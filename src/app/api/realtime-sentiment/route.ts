import { NextRequest, NextResponse } from 'next/server';
import { WebScraper } from '@/lib/web-scraper';

// Direct real-time sentiment analysis function
async function analyzeRealtimeSentiment(candidateName: string, scrapedData: any[]) {
  try {
    // Combine all scraped content
    const combinedContent = scrapedData.map(item => 
      `Source: ${item.source}\nTitle: ${item.title}\nContent: ${item.content}\n---`
    ).join('\n');

    // Call DeepSeek API directly
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: `You are a sophisticated sentiment analysis expert specializing in Kenyan politics. Analyze the following REAL-TIME data about ${candidateName} across all political topics and activities.

REAL-TIME DATA FROM MULTIPLE SOURCES:
${combinedContent}

Based on this real-time information, provide:

1. A precise sentiment score between -1 and 1:
   * -1.0 to -0.6: Very negative public sentiment
   * -0.6 to -0.2: Moderately negative public sentiment  
   * -0.2 to 0.2: Neutral or mixed public sentiment
   * 0.2 to 0.6: Moderately positive public sentiment
   * 0.6 to 1.0: Very positive public sentiment

2. A comprehensive summary (3-5 sentences) explaining:
   * Current public sentiment based on real-time data
   * Key factors driving this sentiment from the sources
   * Recent developments that influence opinion
   * Regional or demographic variations if mentioned

3. At least 5 positive keywords from the real-time data
4. At least 5 negative keywords from the real-time data

You must respond with valid JSON in exactly this format:
{
  "sentimentScore": <number between -1 and 1>,
  "sentimentSummary": "<detailed summary based on real-time data>",
  "positiveKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "negativeKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}

Ensure your analysis reflects the CURRENT situation based on the provided real-time data sources.`
          }
        ],
        temperature: 0.3,
        max_tokens: 1200
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in API response');
    }

    // Parse JSON from response
    let jsonText = content.trim();
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    const result = JSON.parse(jsonText);
    
    // Return validated result
    return {
      sentimentScore: (typeof result.sentimentScore === 'number') 
        ? Math.max(-1, Math.min(1, result.sentimentScore))
        : 0,
      sentimentSummary: (result.sentimentSummary && typeof result.sentimentSummary === 'string') 
        ? result.sentimentSummary.trim() 
        : `Real-time analysis of ${candidateName} shows mixed public sentiment based on current media coverage and social discussions.`,
      positiveKeywords: Array.isArray(result.positiveKeywords) && result.positiveKeywords.length > 0
        ? result.positiveKeywords.filter((word: any) => typeof word === 'string' && word.trim().length > 0).slice(0, 8)
        : ['leadership', 'development', 'progress', 'unity', 'reform'],
      negativeKeywords: Array.isArray(result.negativeKeywords) && result.negativeKeywords.length > 0
        ? result.negativeKeywords.filter((word: any) => typeof word === 'string' && word.trim().length > 0).slice(0, 8)
        : ['concerns', 'challenges', 'criticism', 'controversy', 'opposition']
    };

  } catch (error) {
    console.error('Error in direct real-time sentiment analysis:', error);
    
    // Fallback parsing from the scraped content if AI fails
    const fallbackContent = scrapedData.map(item => item.content).join(' ');
    const sentimentScore = extractSentimentScore(fallbackContent);
    const summary = extractSummary(fallbackContent);
    const positiveKeywords = extractKeywords(fallbackContent, 'positive');
    const negativeKeywords = extractKeywords(fallbackContent, 'negative');
    
    return {
      sentimentScore,
      sentimentSummary: summary || `Real-time analysis of ${candidateName} shows mixed public sentiment based on current discussions.`,
      positiveKeywords,
      negativeKeywords
    };
  }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const { candidateName } = await req.json();

    if (!candidateName) {
      return NextResponse.json(
        { error: 'Candidate name is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Scrape real-time data from multiple sources
    const scrapedData = await WebScraper.scrapeAllSources(candidateName);
    
    // Use direct sentiment analysis
    const parsedResult = await analyzeRealtimeSentiment(candidateName, scrapedData);

    const result = {
      ...parsedResult,
      sources: scrapedData.map(item => ({
        title: item.title,
        source: item.source,
        timestamp: item.timestamp
      })),
      dataFreshness: new Date().toISOString()
    };

    return NextResponse.json(result, { headers: corsHeaders });

  } catch (error) {
    console.error('Real-time sentiment analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze real-time sentiment' },
      { status: 500, headers: corsHeaders }
    );
  }
}

function extractSentimentScore(text: string): number {
  const scoreMatch = text.match(/sentiment score[:\s]*(-?\d*\.?\d+)/i);
  return scoreMatch ? parseFloat(scoreMatch[1]) : 0;
}

function extractSummary(text: string): string {
  const summaryMatch = text.match(/summary[:\s]*([\s\S]+?)(?=\n\n|\n[0-9]|\nPositive|$)/i);
  return summaryMatch ? summaryMatch[1].trim() : 'Analysis summary not available';
}

function extractKeywords(text: string, type: 'positive' | 'negative'): string[] {
  const pattern = new RegExp(`${type} keywords?[:\s]*([\s\S]+?)(?=\n\n|\n[a-zA-Z]|$)`, 'i');
  const match = text.match(pattern);
  
  if (match) {
    return match[1]
      .split(/[,\n]/)
      .map(keyword => keyword.trim().replace(/^[-*•]\s*/, ''))
      .filter(keyword => keyword.length > 0)
      .slice(0, 8);
  }
  
  return [`${type} sentiment detected`];
}