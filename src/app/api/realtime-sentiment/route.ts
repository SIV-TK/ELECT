import { NextRequest, NextResponse } from 'next/server';
import { WebScraper } from '@/lib/web-scraper';
import { ai } from '@/ai/genkit';

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
    
    // Combine all scraped content
    const combinedContent = scrapedData.map(item => 
      `Source: ${item.source}\nTitle: ${item.title}\nContent: ${item.content}\n---`
    ).join('\n');

    // Enhanced prompt with real-time data
    const prompt = `You are a sophisticated sentiment analysis expert specializing in Kenyan politics. Analyze the following REAL-TIME data about ${candidateName} across all political topics and activities.

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

Ensure your analysis reflects the CURRENT situation based on the provided real-time data sources.`;

    // Use structured prompt for better parsing
    const structuredPrompt = `${prompt}

Provide your response in this exact JSON format:
{
  "sentimentScore": <number between -1 and 1>,
  "sentimentSummary": "<your summary here>",
  "positiveKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "negativeKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}`;

    const response = await ai.generate(structuredPrompt);
    
    let parsedResult;
    try {
      // Try to parse as JSON first
      const jsonMatch = response.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found');
      }
    } catch {
      // Fallback to text parsing
      const sentimentScore = extractSentimentScore(response.text);
      const summary = extractSummary(response.text);
      const positiveKeywords = extractKeywords(response.text, 'positive');
      const negativeKeywords = extractKeywords(response.text, 'negative');
      
      parsedResult = {
        sentimentScore,
        sentimentSummary: summary,
        positiveKeywords,
        negativeKeywords
      };
    }

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
  const summaryMatch = text.match(/summary[:\s]*(.+?)(?=\n\n|\n[0-9]|\nPositive|$)/is);
  return summaryMatch ? summaryMatch[1].trim() : 'Analysis summary not available';
}

function extractKeywords(text: string, type: 'positive' | 'negative'): string[] {
  const pattern = new RegExp(`${type} keywords?[:\s]*(.+?)(?=\n\n|\n[a-zA-Z]|$)`, 'is');
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