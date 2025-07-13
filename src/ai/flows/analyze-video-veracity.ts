// src/ai/flows/analyze-video-veracity.ts
'use server';

/**
 * @fileOverview Analyzes the veracity of a video and its description.
 *
 * - analyzeVideoVeracity - A function that analyzes video content.
 * - AnalyzeVideoVeracityInput - The input type for the function.
 * - AnalyzeVideoVeracityOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeVideoVeracityInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video of a politician, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  userDescription: z.string().describe('The user-provided description of the events in the video.'),
  politicianName: z.string().describe("The name of the politician in the video."),
});
export type AnalyzeVideoVeracityInput = z.infer<typeof AnalyzeVideoVeracityInputSchema>;

const AnalyzeVideoVeracityOutputSchema = z.object({
  isAuthentic: z.boolean().describe("A boolean indicating if the video is likely authentic and not AI-generated or manipulated."),
  analysisSummary: z.string().describe("A detailed summary of the analysis, including reasons for the authenticity conclusion."),
  keyMoments: z.array(z.string()).describe("A list of key moments or objects identified in the video that support the analysis."),
});
export type AnalyzeVideoVeracityOutput = z.infer<typeof AnalyzeVideoVeracityOutputSchema>;


export async function analyzeVideoVeracity(
  input: AnalyzeVideoVeracityInput
): Promise<AnalyzeVideoVeracityOutput> {
  return analyzeVideoVeracityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeVideoVeracityPrompt',
  input: {schema: AnalyzeVideoVeracityInputSchema},
  output: {schema: AnalyzeVideoVeracityOutputSchema},
  prompt: `You are an expert digital forensics analyst specializing in video authenticity. Your task is to analyze a video of a politician and its accompanying description to determine if the video is likely authentic or if it shows signs of being AI-generated, deepfaked, or otherwise manipulated.

You will base your analysis on the video content itself and cross-reference it with the user's description.

**Analysis Steps:**
1.  **Examine Video for Artifacts:** Look for common signs of digital manipulation, such as inconsistent lighting, strange blurring, unnatural facial movements, or audio/video synchronization issues.
2.  **Contextual Analysis:** Evaluate if the events depicted are plausible for the politician and the context described.
3.  **Cross-Reference Description:** Compare the user's description with the video content. Do they match?
4.  **Conclude Authenticity:** Based on your findings, make a determination on the video's authenticity.

**Input:**
- **Politician:** {{{politicianName}}}
- **User Description:** {{{userDescription}}}
- **Video:** {{media url=videoDataUri}}

Provide your final analysis below.
`,
});

const analyzeVideoVeracityFlow = ai.defineFlow(
  {
    name: 'analyzeVideoVeracityFlow',
    inputSchema: AnalyzeVideoVeracityInputSchema,
    outputSchema: AnalyzeVideoVeracityOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
