// src/ai/flows/summarize-form-34a.ts
'use server';

/**
 * @fileOverview Summarizes the content of an election Form 34A.
 *
 * - summarizeForm34a - A function that analyzes an image of Form 34A.
 * - SummarizeForm34aInput - The input type for the function.
 * - SummarizeForm34aOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeForm34aInputSchema = z.object({
  formImageUri: z
    .string()
    .describe(
      "An image of the Form 34A, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SummarizeForm34aInput = z.infer<typeof SummarizeForm34aInputSchema>;

const SummarizeForm34aOutputSchema = z.object({
  summary: z.string().describe("A concise summary of the key information from the Form 34A, including polling station name, total registered voters, and the votes for each main candidate mentioned."),
});
export type SummarizeForm34aOutput = z.infer<typeof SummarizeForm34aOutputSchema>;

export async function summarizeForm34a(
  input: SummarizeForm34aInput
): Promise<SummarizeForm34aOutput> {
  return summarizeForm34aFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeForm34aPrompt',
  input: {schema: SummarizeForm34aInputSchema},
  output: {schema: SummarizeForm34aOutputSchema},
  prompt: `You are an expert election data analyst. Your task is to analyze an image of a Kenyan election Form 34A and extract the most critical information.

Analyze the provided image of the Form 34A. Identify the polling station name, the number of registered voters, and the votes recorded for the main candidates. Present this information in a clear and concise summary.

**Content to Analyze:**
- **Form 34A Image:** {{media url=formImageUri}}

Provide a summary of the key data points from the form.
`,
});

const summarizeForm34aFlow = ai.defineFlow(
  {
    name: 'summarizeForm34aFlow',
    inputSchema: SummarizeForm34aInputSchema,
    outputSchema: SummarizeForm34aOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
