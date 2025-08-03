// src/ai/flows/analyze-candidate-sentiment.ts
'use server';

import { ai } from '@/ai/genkit';
import { MODELS } from '@/ai/models';
import { validateAIResponse, parseJSONResponse, validateStringField, validateArrayField, validateNumberField } from '@/ai/validation';
import { WebScraper } from '@/lib/web-scraper';
import { KenyaPoliticalDataService } from '@/lib/kenya-political-data';

export interface AnalyzeCandidateSentimentInput {
  candidateName: string;
  topic: string;
}

export interface AnalyzeCandidateSentimentOutput {
  sentimentScore: number;
  sentimentSummary: string;
  positiveKeywords: string[];
  negativeKeywords: string[];
}

export async function analyzeCandidateSentiment(
  input: AnalyzeCandidateSentimentInput
): Promise<AnalyzeCandidateSentimentOutput> {
  try {
    // Scrape real-time data from multiple sources
    const [newsData, socialData, govData, sentimentData] = await Promise.all([
      WebScraper.scrapeKenyanNews(input.candidateName),
      WebScraper.scrapeSocialMedia(input.candidateName),
      WebScraper.scrapeGovernmentData(input.candidateName),
      KenyaPoliticalDataService.fetchPoliticalSentiment(input.candidateName)
    ]);

    // Compile all data for AI analysis
    const allData = [...newsData, ...socialData, ...govData];
    const compiledContent = allData.map(item => `${item.title}: ${item.content}`).join('\n\n');
    const sentimentContext = sentimentData.map(item => item.content).join('\n\n');

    // Create comprehensive prompt for AI analysis
    const analysisPrompt = `
You are a sophisticated sentiment analysis expert specializing in Kenyan politics. Analyze the following real-time data about ${input.candidateName} regarding the topic of ${input.topic}.

REAL-TIME DATA:
${compiledContent}

SENTIMENT CONTEXT:
${sentimentContext}

TASK: Provide a comprehensive sentiment analysis with the following requirements:

1. Calculate a precise sentiment score between -1 and 1:
   * -1.0 to -0.6: Very negative public sentiment
   * -0.6 to -0.2: Moderately negative public sentiment
   * -0.2 to 0.2: Neutral or mixed public sentiment
   * 0.2 to 0.6: Moderately positive public sentiment
   * 0.6 to 1.0: Very positive public sentiment

2. Write a comprehensive summary (3-5 sentences) explaining:
   * Overall public sentiment toward the candidate on this topic
   * Key factors driving this sentiment
   * Regional or demographic variations if evident
   * Recent events influencing sentiment

3. Extract 5-8 keywords associated with POSITIVE sentiment
4. Extract 5-8 keywords associated with NEGATIVE sentiment

Respond in JSON format:
{
  "sentimentScore": <number>,
  "sentimentSummary": "<string>",
  "positiveKeywords": ["<keyword1>", "<keyword2>", ...],
  "negativeKeywords": ["<keyword1>", "<keyword2>", ...]
}

Ensure your analysis is politically neutral, factually grounded, and reflects current Kenyan political sentiment.
    `;

    // Use AI to analyze the compiled data
    const response = await ai.generate({
      model: MODELS.DEEPSEEK_CHAT,
      prompt: analysisPrompt,
      config: {
        temperature: 0.3,
        maxOutputTokens: 1000
      }
    });

    const responseText = validateAIResponse(response);
    
    const fallback = {
      sentimentScore: 0,
      sentimentSummary: `Analysis of ${input.candidateName} regarding ${input.topic} shows mixed public sentiment based on current data.`,
      positiveKeywords: ['leadership', 'development', 'progress'],
      negativeKeywords: ['concerns', 'challenges', 'criticism']
    };
    
    const result = parseJSONResponse(responseText, fallback);
    
    return {
      sentimentScore: validateNumberField(result.sentimentScore, fallback.sentimentScore, -1, 1),
      sentimentSummary: validateStringField(result.sentimentSummary, fallback.sentimentSummary),
      positiveKeywords: validateArrayField(result.positiveKeywords, fallback.positiveKeywords),
      negativeKeywords: validateArrayField(result.negativeKeywords, fallback.negativeKeywords)
    };

  } catch (error) {
    console.error('Error in sentiment analysis:', error);
    
    // Fallback response
    return {
      sentimentScore: 0,
      sentimentSummary: `Unable to complete comprehensive analysis for ${input.candidateName} at this time. Please try again later.`,
      positiveKeywords: ['leadership', 'service'],
      negativeKeywords: ['challenges', 'concerns']
    };
  }
}