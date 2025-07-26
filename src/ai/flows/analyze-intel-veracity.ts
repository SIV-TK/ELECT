// src/ai/flows/analyze-intel-veracity.ts
'use server';

/**
 * @fileOverview Analyzes the veracity of a video, image, or document and its description.
 *
 * - analyzeIntelVeracity - A function that analyzes content veracity.
 * - AnalyzeIntelVeracityInput - The input type for the function.
 * - AnalyzeIntelVeracityOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeIntelVeracityInputSchema = z.object({
  dataUri: z
    .string()
    .describe(
      "A video, image, or document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  userDescription: z.string().describe('The user-provided description of the events in the content.'),
  politicianName: z.string().describe("The name of the politician in the content."),
});
export type AnalyzeIntelVeracityInput = z.infer<typeof AnalyzeIntelVeracityInputSchema>;

const AnalyzeIntelVeracityOutputSchema = z.object({
  isAuthentic: z.boolean().describe("A boolean indicating if the content is likely authentic and not AI-generated or manipulated."),
  analysisSummary: z.string().describe("A detailed summary of the analysis, including reasons for the authenticity conclusion."),
  keyMoments: z.array(z.string()).describe("A list of key moments, objects, or text fragments identified in the content that support the analysis."),
});
export type AnalyzeIntelVeracityOutput = z.infer<typeof AnalyzeIntelVeracityOutputSchema>;

export async function analyzeIntelVeracity(
  input: AnalyzeIntelVeracityInput
): Promise<AnalyzeIntelVeracityOutput> {
  return analyzeIntelVeracityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeIntelVeracityPrompt',
  input: {schema: AnalyzeIntelVeracityInputSchema},
  output: {schema: AnalyzeIntelVeracityOutputSchema},
  prompt: `You are an expert digital forensics analyst specializing in content authenticity. Your task is to analyze a piece of content (video, image, or document) featuring a politician and its accompanying description to determine if it is likely authentic or if it shows signs of being AI-generated, deepfaked, or otherwise manipulated.

You will base your analysis on the content itself and cross-reference it with the user's description.

**Analysis Steps:**
1.  **Examine for Artifacts:** Look for common signs of digital manipulation. For videos/images, check for inconsistent lighting, strange blurring, unnatural movements, or pixelation. For documents, check for font inconsistencies, layout anomalies, or metadata that seems suspicious.
2.  **Contextual Analysis:** Evaluate if the events or claims depicted are plausible for the politician and the context described.
3.  **Cross-Reference Description:** Compare the user's description with the content. Do they match? Does the content support the description?
4.  **Conclude Authenticity:** Based on your findings, make a determination on the content's authenticity.

**Input:**
- **Politician:** {{{politicianName}}}
- **User Description:** {{{userDescription}}}
- **Content:** {{media url=dataUri}}

Provide your final analysis below.
`,
});

const analyzeIntelVeracityFlow = ai.defineFlow(
  {
    name: 'analyzeIntelVeracityFlow',
    inputSchema: AnalyzeIntelVeracityInputSchema,
    outputSchema: AnalyzeIntelVeracityOutputSchema,
    model: 'deepseek/deepseek-chat',
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
