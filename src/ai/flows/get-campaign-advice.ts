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
  prompt: `You are an expert Kenyan political campaign strategist with deep knowledge of the country's political landscape, voter behavior, and current issues.

Based on real-time political data scraped from Kenyan news sources, social media, and government portals, provide strategic campaign advice for the specified politician.

**CONTEXT:**
- Politician: {{candidateName}}
- Current Trending Topics: {{{trendingTopics}}}
- Recent Political Stance: {{{candidateCurrentStance}}}
- Public Sentiment Analysis: {{{userSentimentAnalysis}}}

**ANALYSIS FRAMEWORK:**
1. **Strengths Assessment**: Identify what's working well for the politician
2. **Vulnerability Analysis**: Highlight areas of concern or weakness
3. **Opportunity Mapping**: Point out emerging opportunities to capitalize on
4. **Strategic Recommendations**: Provide specific, actionable advice

**FOCUS AREAS:**
- Address key Kenyan voter concerns (economy, corruption, unemployment, healthcare)
- Leverage trending topics effectively
- Counter negative sentiment with strategic messaging
- Build on existing strengths and popular positions
- Suggest specific campaign tactics and messaging strategies

Provide comprehensive, Kenya-specific strategic campaign advice:
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
