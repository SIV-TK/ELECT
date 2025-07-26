// src/ai/flows/analyze-candidate-sentiment.ts
'use server';

/**
 * @fileOverview Analyzes candidate sentiment from online data.
 *
 * - analyzeCandidateSentiment - Analyzes online sentiment related to a candidate.
 * - AnalyzeCandidateSentimentInput - The input type for the analyzeCandidateSentiment function.
 * - AnalyzeCandidateSentimentOutput - The return type for the analyzeCandidateSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCandidateSentimentInputSchema = z.object({
  candidateName: z.string().describe('The name of the candidate to analyze.'),
  topic: z.string().describe('The topic or issue to analyze sentiment for.'),
});
export type AnalyzeCandidateSentimentInput = z.infer<typeof AnalyzeCandidateSentimentInputSchema>;

const AnalyzeCandidateSentimentOutputSchema = z.object({
  sentimentScore: z
    .number()
    .describe(
      'A numerical score representing the overall sentiment towards the candidate on the specified topic. Ranges from -1 (very negative) to 1 (very positive).' + // changed from -100 to 100 because sentiment is usually normalized
        '0 is neutral.'
    ),
  sentimentSummary: z
    .string()
    .describe('A summary of the sentiment towards the candidate on the specified topic.'),
  positiveKeywords: z.array(z.string()).describe('Keywords associated with positive sentiment.'),
  negativeKeywords: z.array(z.string()).describe('Keywords associated with negative sentiment.'),
});
export type AnalyzeCandidateSentimentOutput = z.infer<typeof AnalyzeCandidateSentimentOutputSchema>;

export async function analyzeCandidateSentiment(
  input: AnalyzeCandidateSentimentInput
): Promise<AnalyzeCandidateSentimentOutput> {
  return analyzeCandidateSentimentFlow(input);
}

const analyzeCandidateSentimentPrompt = ai.definePrompt({
  name: 'analyzeCandidateSentimentPrompt',
  input: {schema: AnalyzeCandidateSentimentInputSchema},
  output: {schema: AnalyzeCandidateSentimentOutputSchema},
  prompt: `You are a sophisticated sentiment analysis expert specializing in Kenyan politics. Your task is to analyze public opinion towards political candidates based on social media, news articles, and public discourse data.

  TASK: Analyze the current public sentiment towards {{candidateName}} regarding the topic of {{topic}} in Kenya.

  CONTEXT:
  - Consider recent news, social media trends, and public statements related to this candidate and topic
  - Take into account the candidate's political party affiliations and their historical stance on this topic
  - Consider regional and demographic variations in sentiment across Kenya
  - Analyze both mainstream media coverage and social media discourse
  
  REQUIREMENTS:
  1. Provide a precise sentiment score between -1 and 1:
     * -1.0 to -0.6: Very negative public sentiment
     * -0.6 to -0.2: Moderately negative public sentiment
     * -0.2 to 0.2: Neutral or mixed public sentiment
     * 0.2 to 0.6: Moderately positive public sentiment
     * 0.6 to 1.0: Very positive public sentiment
  
  2. Write a comprehensive summary (3-5 sentences) that explains:
     * The overall public sentiment toward the candidate on this topic
     * Key factors driving this sentiment
     * Any notable regional or demographic variations
     * Recent events that may have influenced this sentiment
  
  3. Identify at least 5 keywords or phrases associated with positive sentiment
  
  4. Identify at least 5 keywords or phrases associated with negative sentiment

  Candidate: {{candidateName}}
  Topic: {{topic}}
  
  Ensure your analysis is politically neutral, factually grounded, and reflects the current Kenyan political landscape.`,
});

const analyzeCandidateSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeCandidateSentimentFlow',
    inputSchema: AnalyzeCandidateSentimentInputSchema,
    outputSchema: AnalyzeCandidateSentimentOutputSchema,
    model: 'deepseek/deepseek-chat',
  },
  async input => {
    const {output} = await analyzeCandidateSentimentPrompt(input);
    return output!;
  }
);
