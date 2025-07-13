'use server';

/**
 * @fileOverview Summarizes a politician's profile.
 * - summarizePolitician - A function that generates a summary of a politician's career.
 * - SummarizePoliticianInput - The input type for the summarizePolitician function.
 * - SummarizePoliticianOutput - The return type for the summarizePolitician function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { Politician } from '@/types';

export const SummarizePoliticianInputSchema = z.custom<Politician>();
export type SummarizePoliticianInput = z.infer<typeof SummarizePoliticianInputSchema>;

export const SummarizePoliticianOutputSchema = z.object({
  summary: z.string().describe("A comprehensive, neutral summary of the politician's profile, including their career, achievements, and controversies."),
});
export type SummarizePoliticianOutput = z.infer<typeof SummarizePoliticianOutputSchema>;


export async function summarizePolitician(
  input: SummarizePoliticianInput
): Promise<SummarizePoliticianOutput> {
  return summarizePoliticianFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizePoliticianPrompt',
  input: { schema: z.object({ politicianData: z.string() }) },
  output: { schema: SummarizePoliticianOutputSchema },
  prompt: `You are an expert political analyst. Your task is to provide a concise and unbiased summary of the following politician's profile. 

Focus on their key career milestones, notable achievements, significant promises kept and broken, and any major legal or public controversies. Present the information in a neutral, factual tone.

Politician's Data:
{{{politicianData}}}

Generate a summary based on this data.
`,
});

const summarizePoliticianFlow = ai.defineFlow(
  {
    name: 'summarizePoliticianFlow',
    inputSchema: SummarizePoliticianInputSchema,
    outputSchema: SummarizePoliticianOutputSchema,
  },
  async (politician) => {
    // Convert the complex politician object into a string for the prompt
    const politicianDataString = `
      Name: ${politician.name}
      Party: ${politician.party}
      Level: ${politician.level} ${politician.county ? `- ${politician.county}` : ''}
      Bio: ${politician.bio}
      Work History: ${politician.trackRecord.workHistory.join(', ')}
      Promises Kept: ${politician.trackRecord.promisesKept.join(', ')}
      Promises Broken: ${politician.trackRecord.promisesBroken.join(', ')}
      Contributions: ${politician.trackRecord.contributions.join(', ')}
      Court Cases: ${politician.legalOversight.courtCases.join(', ')}
      Academic Background: ${politician.academicLife.university}
    `;

    const {output} = await prompt({ politicianData: politicianDataString });
    return output!;
  }
);
