import { ai } from '@/ai/genkit';
import { z } from 'zod';

const inputSchema = z.object({
  query: z.string().describe('User question about the Kenyan Constitution'),
  article: z.string().optional().describe('Specific constitutional article if mentioned')
});

const outputSchema = z.object({
  explanation: z.string(),
  relevantArticles: z.array(z.string()),
  practicalExample: z.string(),
  citizenRights: z.array(z.string())
});

export const explainConstitution = ai.defineFlow(
  {
    name: 'explainConstitution',
    inputSchema,
    outputSchema,
    model: 'deepseek/deepseek-chat',
  },
  async (input) => {
    const prompt = `Explain this Kenyan Constitution question: "${input.query}"

Provide a clear, well-structured explanation with:
1. Simple language that ordinary Kenyans can understand
2. Use **bold text** for important terms and concepts
3. Break down complex ideas into digestible parts
4. Include specific constitutional articles
5. Give practical Kenyan examples

Format the response to be educational and engaging.`;

    const response = await ai.generate(prompt);
    
    // Extract key information for structured display
    const explanation = response.text;
    const articles = extractArticles(explanation);
    const rights = extractRights(input.query);
    const example = generateExample(input.query);
    
    return {
      explanation: formatExplanation(explanation),
      relevantArticles: articles,
      practicalExample: example,
      citizenRights: rights
    };
  }
);

function formatExplanation(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
}

function extractArticles(text: string): string[] {
  const articles = text.match(/Article \d+[A-Za-z]?/g) || [];
  return articles.length > 0 ? articles : ['Article 1', 'Article 10', 'Article 43'];
}

function extractRights(query: string): string[] {
  const lowerQuery = query.toLowerCase();
  if (lowerQuery.includes('right')) {
    return ['Right to information', 'Right to participate in governance', 'Right to fair treatment', 'Right to equality'];
  }
  if (lowerQuery.includes('vote') || lowerQuery.includes('election')) {
    return ['Right to vote', 'Right to be elected', 'Right to fair elections', 'Right to political participation'];
  }
  return ['Right to dignity', 'Right to life', 'Right to freedom', 'Right to equality'];
}

function generateExample(query: string): string {
  const lowerQuery = query.toLowerCase();
  if (lowerQuery.includes('right')) {
    return 'For example, **as a Kenyan citizen**, you can request information from government offices, participate in public meetings, and report corruption without fear of persecution.';
  }
  if (lowerQuery.includes('vote')) {
    return 'For example, **during elections**, you have the right to vote secretly, your vote must be counted fairly, and you can contest results if there are irregularities.';
  }
  return 'For example, **in daily life**, this constitutional provision protects you from discrimination and ensures you are treated fairly by government institutions.';
}