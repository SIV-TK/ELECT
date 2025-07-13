// src/ai/flows/analyze-tally-anomaly.ts
'use server';

/**
 * @fileOverview Analyzes a single election tally for potential anomalies.
 *
 * - analyzeTallyAnomaly - A function that analyzes a vote tally.
 * - TallyAnomalyInput - The input type for the function.
 * - TallyAnomalyOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const TallyAnomalyInputSchema = z.object({
  pollingStation: z.string().describe("The name of the polling station."),
  registeredVoters: z.number().describe("The total number of registered voters at the station."),
  reportedVotes: z.string().describe("A summary string of the votes reported for each candidate."),
  previousTallyAverage: z.number().describe("The average number of votes reported in previous tallies from other stations."),
});
export type TallyAnomalyInput = z.infer<typeof TallyAnomalyInputSchema>;

export const TallyAnomalyOutputSchema = z.object({
  isAnomaly: z.boolean().describe("A boolean indicating if the tally is considered anomalous."),
  reason: z.string().describe("A brief explanation for why the tally is or is not considered an anomaly."),
  confidenceScore: z.number().min(0).max(1).describe("A score from 0 to 1 indicating the confidence in the anomaly detection."),
});
export type TallyAnomalyOutput = z.infer<typeof TallyAnomalyOutputSchema>;

export async function analyzeTallyAnomaly(
  input: TallyAnomalyInput
): Promise<TallyAnomalyOutput> {
  return analyzeTallyAnomalyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeTallyAnomalyPrompt',
  input: {schema: TallyAnomalyInputSchema},
  output: {schema: TallyAnomalyOutputSchema},
  prompt: `You are an expert election fraud detection AI. Your task is to analyze a single vote tally report from a polling station and determine if it's anomalous.

**Analysis Criteria:**
1.  **Voter Turnout:** Compare the total votes cast to the number of registered voters. Turnout over 100% is a major red flag. Unusually high (e.g., >95%) or low (e.g., <20%) turnout can also be anomalous.
2.  **Statistical Outliers:** Compare the total votes in this tally to the average from other stations. A result that is drastically different (e.g., more than 3 standard deviations, or simply 5x higher/lower) could be an anomaly.
3.  **Internal Consistency:** Check the reported votes for any obvious errors.

**Input Data:**
- **Polling Station:** {{{pollingStation}}}
- **Registered Voters:** {{{registeredVoters}}}
- **Reported Votes:** {{{reportedVotes}}}
- **Average Tally Size (from other stations):** {{{previousTallyAverage}}}

Based on this data, determine if there is an anomaly. Provide a confidence score and a brief reason for your conclusion.
`,
});

const analyzeTallyAnomalyFlow = ai.defineFlow(
  {
    name: 'analyzeTallyAnomalyFlow',
    inputSchema: TallyAnomalyInputSchema,
    outputSchema: TallyAnomalyOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
