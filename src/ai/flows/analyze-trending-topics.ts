import { ai } from '@/ai/genkit';
import { z } from 'zod';

const inputSchema = z.object({
  rawTopics: z.string().describe('Raw trending topics data from social media/news APIs'),
  region: z.string().optional().describe('Kenya region to focus on')
});

const outputSchema = z.object({
  topics: z.array(z.object({
    topic: z.string(),
    mentions: z.number(),
    sentiment: z.number().min(-1).max(1),
    trend: z.enum(['up', 'down', 'stable']),
    politicalRelevance: z.number().min(0).max(1)
  }))
});

export const analyzeTrendingTopics = ai.defineFlow(
  {
    name: 'analyzeTrendingTopics',
    inputSchema,
    outputSchema,
    model: 'deepseek/deepseek-chat',
  },
  async (input) => {
    const prompt = `Analyze these trending topics for Kenyan political relevance and sentiment:

${input.rawTopics}

Extract the top 5 most politically relevant topics. For each topic:
1. Calculate sentiment (-1 to 1)
2. Estimate mention count
3. Determine trend direction
4. Rate political relevance (0-1)

Focus on Kenyan politics, governance, and electoral matters.`;

    const response = await ai.generate(prompt);
    return JSON.parse(response.text);
  }
);