'use server';

/**
 * @fileOverview This file defines a Genkit flow to analyze demo voting results and predict potential election outcomes.
 *
 * - predictElectionOutcome - A function that analyzes demo voting data to predict election outcomes.
 * - PredictElectionOutcomeInput - The input type for the predictElectionOutcome function.
 * - PredictElectionOutcomeOutput - The return type for the predictElectionOutcome function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictElectionOutcomeInputSchema = z.object({
  demoVotesData: z
    .string()
    .describe(
      'A string containing the data from demo votes, including candidate preferences and demographic information.'
    ),
});
export type PredictElectionOutcomeInput = z.infer<typeof PredictElectionOutcomeInputSchema>;

const PredictElectionOutcomeOutputSchema = z.object({
  predictedWinner: z
    .string()
    .describe('The predicted winner of the election based on the demo votes.'),
  keyTrends: z
    .string()
    .describe('Key trends and insights from the demo voting data.'),
});
export type PredictElectionOutcomeOutput = z.infer<typeof PredictElectionOutcomeOutputSchema>;

export async function predictElectionOutcome(
  input: PredictElectionOutcomeInput
): Promise<PredictElectionOutcomeOutput> {
  return predictElectionOutcomeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictElectionOutcomePrompt',
  input: {schema: PredictElectionOutcomeInputSchema},
  output: {schema: PredictElectionOutcomeOutputSchema},
  prompt: `You are an AI assistant specialized in analyzing election data and predicting outcomes.

  Analyze the following data from demo votes to predict the likely winner of the election and identify key trends in voter behavior.

  Demo Votes Data: {{{demoVotesData}}}

  Based on this data, who is the predicted winner, and what are the key trends that influenced this prediction?
  `,
});

const predictElectionOutcomeFlow = ai.defineFlow(
  {
    name: 'predictElectionOutcomeFlow',
    inputSchema: PredictElectionOutcomeInputSchema,
    outputSchema: PredictElectionOutcomeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
