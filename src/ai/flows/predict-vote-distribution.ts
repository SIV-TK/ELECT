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

const VoteDistributionSchema = z.object({
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
  prompt: `You are an expert Kenyan political analyst with deep knowledge of regional voting patterns, demographic trends, and historical election data. Your task is to predict the election vote share for a candidate in every county of Kenya based on public sentiment analysis.

CONTEXT:
- Kenya has 47 counties with distinct voting patterns influenced by ethnic composition, economic interests, and historical political alignments
- Different regions have traditional political strongholds and opposition areas
- Public sentiment on specific issues affects voting patterns differently across regions
- The candidate's party affiliation and personal background influence regional support

FACTORS TO CONSIDER IN YOUR PREDICTION:
- The candidate's historical performance and party's strength in different regions
- Regional importance of the analyzed topic (some issues matter more in certain counties)
- Ethnic and demographic composition of each county and its traditional voting patterns
- The sentiment score's impact will vary by region (stronghold counties may be less affected by negative sentiment)
- Urban vs. rural county differences in voting behavior
- Recent political developments and alliances that might affect regional support

**ANALYSIS DETAILS:**
- **Candidate:** {{candidateName}}
- **Topic Analyzed:** {{topic}}
- **Overall Sentiment Score:** {{sentimentScore}} (from -1 for very negative to 1 for very positive)

TASK:
Based on this information, provide a realistic predicted vote share percentage for **{{candidateName}}** in **ALL** of the following Kenyan counties: ${kenyanCounties.join(', ')}.

Your predictions should:
- Reflect realistic voting patterns (no county should show 0% or 100%)
- Show appropriate regional variations based on known political alignments
- Correlate with the sentiment score while accounting for regional factors
- Include all 47 counties with values between 0 and 100
`,
});

const predictVoteDistributionFlow = ai.defineFlow(
  {
    name: 'predictVoteDistributionFlow',
    inputSchema: PredictVoteDistributionInputSchema,
    outputSchema: PredictVoteDistributionOutputSchema,
    model: 'deepseek/deepseek-chat',
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
