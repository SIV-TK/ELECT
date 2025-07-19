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

const TallyAnomalyInputSchema = z.object({
  pollingStation: z.string().describe("The name of the polling station."),
  registeredVoters: z.number().describe("The total number of registered voters at the station."),
  reportedVotes: z.string().describe("A summary string of the votes reported for each candidate."),
  previousTallyAverage: z.number().describe("The average number of votes reported in previous tallies from other stations."),
  historicalFraudRisk: z.number().min(0).max(1).describe("Historical fraud risk score for this area (0-1)."),
  socialMediaSignal: z.string().describe("Summary of social media signals for this polling station (e.g., reports of irregularities, unrest, etc.)."),
  crowdIntel: z.string().describe("Crowd-sourced intelligence or reports for this polling station."),
});
export type TallyAnomalyInput = z.infer<typeof TallyAnomalyInputSchema>;

const TallyAnomalyOutputSchema = z.object({
  isAnomaly: z.boolean().describe("A boolean indicating if the tally is considered anomalous."),
  reason: z.string().describe("A brief explanation for why the tally is or is not considered an anomaly."),
  confidenceScore: z.number().min(0).max(1).describe("A score from 0 to 1 indicating the confidence in the anomaly detection."),
  explainability: z.string().describe("A detailed explanation of which criteria or data sources contributed to the anomaly decision."),
  fraudRiskScore: z.number().min(0).max(1).describe("Fraud risk score for this tally (0-1)."),
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
4.  **Historical Fraud Risk:** Consider the historical fraud risk score for this area.
5.  **Social Media Signals:** Consider any social media reports of irregularities, unrest, or fraud at this polling station.
6.  **Crowd-Sourced Intel:** Consider crowd-sourced intelligence or reports for this polling station.

**Input Data:**
- **Polling Station:** {{{pollingStation}}}
- **Registered Voters:** {{{registeredVoters}}}
- **Reported Votes:** {{{reportedVotes}}}
- **Average Tally Size (from other stations):** {{{previousTallyAverage}}}
- **Historical Fraud Risk:** {{{historicalFraudRisk}}}
- **Social Media Signal:** {{{socialMediaSignal}}}
- **Crowd Intel:** {{{crowdIntel}}}

Based on this data, determine if there is an anomaly. Provide a confidence score, a brief reason, a detailed explainability statement, and a fraud risk score for this tally.
`,
});
// New AI flow: turnout prediction
const TurnoutPredictionInputSchema = z.object({
  pollingStation: z.string().describe("The name of the polling station."),
  county: z.string().describe("The county name."),
  historicalTurnout: z.number().min(0).max(1).describe("Historical turnout rate for this area (0-1)."),
  weather: z.string().describe("Weather conditions at the polling station (e.g., sunny, rainy, etc.)."),
  socialMediaSignal: z.string().describe("Summary of social media signals for this polling station (e.g., reports of turnout, unrest, etc.)."),
  crowdIntel: z.string().describe("Crowd-sourced intelligence or reports for this polling station."),
});
export type TurnoutPredictionInput = z.infer<typeof TurnoutPredictionInputSchema>;

const TurnoutPredictionOutputSchema = z.object({
  predictedTurnout: z.number().min(0).max(1).describe("Predicted turnout rate (0-1)."),
  reason: z.string().describe("A brief explanation for the turnout prediction."),
  explainability: z.string().describe("A detailed explanation of which criteria or data sources contributed to the turnout prediction."),
});
export type TurnoutPredictionOutput = z.infer<typeof TurnoutPredictionOutputSchema>;

export async function predictTurnout(
  input: TurnoutPredictionInput
): Promise<TurnoutPredictionOutput> {
  return predictTurnoutFlow(input);
}

const turnoutPrompt = ai.definePrompt({
  name: 'predictTurnoutPrompt',
  input: {schema: TurnoutPredictionInputSchema},
  output: {schema: TurnoutPredictionOutputSchema},
  prompt: `You are an expert election turnout prediction AI. Your task is to predict the voter turnout rate for a polling station based on historical data, weather, social media signals, and crowd-sourced intelligence.

**Input Data:**
- **Polling Station:** {{{pollingStation}}}
- **County:** {{{county}}}
- **Historical Turnout:** {{{historicalTurnout}}}
- **Weather:** {{{weather}}}
- **Social Media Signal:** {{{socialMediaSignal}}}
- **Crowd Intel:** {{{crowdIntel}}}

Based on this data, predict the turnout rate (0-1), provide a brief reason, and a detailed explainability statement.
`,
});

const predictTurnoutFlow = ai.defineFlow(
  {
    name: 'predictTurnoutFlow',
    inputSchema: TurnoutPredictionInputSchema,
    outputSchema: TurnoutPredictionOutputSchema,
  },
  async (input) => {
    const {output} = await turnoutPrompt(input);
    return output!;
  }
);

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
