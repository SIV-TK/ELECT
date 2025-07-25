import { ai } from '@/ai/genkit';
import { z } from 'zod';

const inputSchema = z.object({
  message: z.string().describe('User question about Kenyan politics')
});

const outputSchema = z.object({
  response: z.string().describe('AI response about Kenyan politics')
});

export const chat = ai.defineFlow(
  {
    name: 'chat',
    inputSchema: inputSchema,
    outputSchema: outputSchema,
  },
  async (input: z.infer<typeof inputSchema>) => {
    const prompt = `You are an expert on Kenyan politics and governance. Provide a detailed and accurate response to this question:

Question: "${input.message}"

Your response should:
1. Focus exclusively on Kenyan politics, governance, and electoral matters
2. Maintain strict factual accuracy and political neutrality
3. Include relevant historical context and key events when applicable
4. Cite specific laws, policies, and regulations where relevant
5. Explain complex concepts in clear, accessible language
6. Address any misconceptions present in the question
7. Respect all political viewpoints while staying factual

Format your response in markdown for better readability.

Response:`;

    const response = await ai.generate(prompt);
    return { response: response.text };
  }
);
