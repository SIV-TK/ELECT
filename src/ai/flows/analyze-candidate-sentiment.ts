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
  prompt: `You are a sentiment analysis expert analyzing online data to determine public opinion towards political candidates.

  Analyze the online sentiment towards {{candidateName}} regarding the topic of {{topic}}.

  Provide a sentiment score between -1 and 1, where -1 is very negative, 0 is neutral, and 1 is very positive.
  Summarize the sentiment in a few sentences.
  Identify keywords associated with positive and negative sentiment.

  Candidate Name: {{candidateName}}
  Topic: {{topic}}`,
});

const analyzeCandidateSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeCandidateSentimentFlow',
    inputSchema: AnalyzeCandidateSentimentInputSchema,
    outputSchema: AnalyzeCandidateSentimentOutputSchema,
  },
  async input => {
    const {output} = await analyzeCandidateSentimentPrompt(input);
    return output!;
  }
);
