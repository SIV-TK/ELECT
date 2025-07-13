// src/ai/flows/predict-vote-distribution.ts
'use server';

/**
 * @fileOverview Predicts election vote distribution based on sentiment analysis.
 *
 * - predictVoteDistribution - Predicts vote share for a candidate across Kenyan regions.
 * - PredictVoteDistributionInput - The input type for the function.
 * - PredictVoteDistributionOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Note: This list is not exhaustive and is for demonstration purposes.
const kenyanCounties = [
  'Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita-Taveta', 'Garissa', 'Wajir', 'Mandera', 'Marsabit', 
  'Isiolo', 'Meru', 'Tharaka-Nithi', 'Embu', 'Kitui', 'Machakos', 'Makueni', 'Nyandarua', 'Nyeri', 'Kirinyaga', 
  'Muranga', 'Kiambu', 'Turkana', 'West Pokot', 'Samburu', 'Trans Nzoia', 'Uasin Gishu', 'Elgeyo-Marakwet', 'Nandi', 
  'Baringo', 'Laikipia', 'Nakuru', 'Narok', 'Kajiado', 'Kericho', 'Bomet', 'Kakamega', 'Vihiga', 'Bungoma', 'Busia', 
  'Siaya', 'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira', 'Nairobi'
];

const PredictVoteDistributionInputSchema = z.object({
  candidateName: z.string().describe('The name of the candidate.'),
  topic: z.string().describe('The topic or issue analyzed.'),
  sentimentScore: z.number().describe('The sentiment score from -1 (negative) to 1 (positive).'),
});
export type PredictVoteDistributionInput = z.infer<typeof PredictVoteDistributionInputSchema>;

export const VoteDistributionSchema = z.object({
  name: z.enum(kenyanCounties as [string, ...string[]]).describe('The name of the Kenyan county.'),
  predictedVoteShare: z
    .number()
    .min(0)
    .max(100)
    .describe('Predicted vote share percentage for the candidate in this county (0-100).'),
});
export type VoteDistribution = z.infer<typeof VoteDistributionSchema>;


const PredictVoteDistributionOutputSchema = z.object({
  regions: z.array(VoteDistributionSchema).describe("An array of predicted vote distributions for each Kenyan county.")
});
export type PredictVoteDistributionOutput = z.infer<typeof PredictVoteDistributionOutputSchema>;


export async function predictVoteDistribution(
  input: PredictVoteDistributionInput
): Promise<PredictVoteDistributionOutput> {
  return predictVoteDistributionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictVoteDistributionPrompt',
  input: {schema: PredictVoteDistributionInputSchema},
  output: {schema: PredictVoteDistributionOutputSchema},
  prompt: `You are a sophisticated Kenyan political analyst AI. Your task is to predict the election vote share for a candidate in every county of Kenya based on public sentiment on a specific topic.

Consider the following factors in your prediction:
- The candidate's historical performance in different regions.
- The topic's relevance and impact on different demographic and regional groups in Kenya.
- The overall sentiment score. A positive score should generally correlate with a higher predicted vote share, but the distribution will not be uniform. Some regions may be more influenced by this topic than others.
- Known political strongholds and swing regions.

**Analysis Details:**
- **Candidate:** {{candidateName}}
- **Topic of Analysis:** {{topic}}
- **Sentiment Score:** {{sentimentScore}} (from -1 for very negative to 1 for very positive)

Based on this information, provide a predicted vote share percentage for **{{candidateName}}** in **ALL** of the following Kenyan counties: ${kenyanCounties.join(', ')}.

Ensure your output contains an entry for every single county listed. The vote share must be a number between 0 and 100.
`,
});

const predictVoteDistributionFlow = ai.defineFlow(
  {
    name: 'predictVoteDistributionFlow',
    inputSchema: PredictVoteDistributionInputSchema,
    outputSchema: PredictVoteDistributionOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
