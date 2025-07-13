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
  candidateName: z.string().describe("The name of the candidate."),
  trendingTopics: z
    .string()
    .describe('The current trending topics that are relevant to the election (e.g., #CostOfLiving, #YouthUnemployment).'),
  candidateCurrentStance: z
    .string()
    .describe('The current stance of the candidate on key issues.'),
  userSentimentAnalysis: z
    .string()
    .describe(
      'The user\'s summary of the sentiment analysis of the electorate regarding the candidate.'
    ),
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
  prompt: `You are an expert political campaign strategist.

Your task is to provide actionable, strategic advice for a political candidate. To do this, you will perform two steps:

1.  **Analyze Public Sentiment:** Based on the provided candidate name and trending topics, perform a simulated search of recent online data, including social media, news articles, and public forums. Synthesize the current public sentiment regarding the candidate's stance on these topics.

2.  **Formulate Strategy:** Combine your sentiment analysis with the user-provided context (their own sentiment analysis and the candidate's current stance) to create a comprehensive and strategic set of recommendations. The advice should be specific, addressing both strengths to amplify and weaknesses to mitigate.

**Candidate Name:** {{candidateName}}
**Key Trending Topics:** {{{trendingTopics}}}
**Candidate's Current Stance:** {{{candidateCurrentStance}}}
**User's Sentiment Analysis:** {{{userSentimentAnalysis}}}

Provide your final strategic campaign advice below:
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
