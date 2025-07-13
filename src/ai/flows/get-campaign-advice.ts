// src/ai/flows/get-campaign-advice.ts
'use server';

/**
 * @fileOverview Provides strategic campaign advice to candidates based on sentiment analysis and trending topics.
 *
 * - getCampaignAdvice - A function that generates campaign advice.
 * - CampaignAdviceInput - The input type for the getCampaignAdvice function.
 * - CampaignAdviceOutput - The return type for the getCampaignAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CampaignAdviceInputSchema = z.object({
  sentimentAnalysis: z
    .string()
    .describe(
      'The overall sentiment analysis of the electorate regarding the candidate.'
    ),
  trendingTopics: z
    .string()
    .describe('The current trending topics that are relevant to the election.'),
  candidateCurrentStance: z
    .string()
    .describe('The current stance of the candidate on key issues.'),
});
export type CampaignAdviceInput = z.infer<typeof CampaignAdviceInputSchema>;

const CampaignAdviceOutputSchema = z.object({
  advice: z.string().describe('Strategic advice for the candidate.'),
});
export type CampaignAdviceOutput = z.infer<typeof CampaignAdviceOutputSchema>;

export async function getCampaignAdvice(
  input: CampaignAdviceInput
): Promise<CampaignAdviceOutput> {
  return getCampaignAdviceFlow(input);
}

const campaignAdvicePrompt = ai.definePrompt({
  name: 'campaignAdvicePrompt',
  input: {schema: CampaignAdviceInputSchema},
  output: {schema: CampaignAdviceOutputSchema},
  prompt: `You are a campaign strategist expert.

You will analyze the sentiment of the electorate, trending topics, and the candidate's current stance to provide strategic advice to the candidate. The advice should be actionable and specific.

Sentiment Analysis: {{{sentimentAnalysis}}}
Trending Topics: {{{trendingTopics}}}
Candidate's Current Stance: {{{candidateCurrentStance}}}

Provide strategic campaign advice:
`, config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const getCampaignAdviceFlow = ai.defineFlow(
  {
    name: 'getCampaignAdviceFlow',
    inputSchema: CampaignAdviceInputSchema,
    outputSchema: CampaignAdviceOutputSchema,
  },
  async input => {
    const {output} = await campaignAdvicePrompt(input);
    return output!;
  }
);
