import { ai } from '@/ai/genkit';
import { z } from 'zod';

const inputSchema = z.object({
  topic: z.string().describe('Educational topic or custom question'),
  currentEvents: z.string().optional().describe('Recent political events in Kenya')
});

const outputSchema = z.object({
  topic: z.string(),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  content: z.string(),
  keyPoints: z.array(z.string()),
  quiz: z.array(z.object({
    question: z.string(),
    options: z.array(z.string()),
    correct: z.number()
  })),
  resources: z.array(z.string())
});

export const generateEducationContent = ai.defineFlow(
  {
    name: 'generateEducationContent',
    inputSchema,
    outputSchema,
    model: 'deepseek/deepseek-chat',
  },
  async (input) => {
    const prompt = `Create educational content about: "${input.topic}"

Context: ${input.currentEvents || 'Current Kenyan political landscape'}

Provide well-structured educational content with:
1. Use **bold text** for important terms and concepts
2. Break down complex ideas into digestible parts
3. Include specific examples from Kenya
4. Make it engaging and easy to understand

Format the response to be educational and well-organized.`;

    const response = await ai.generate(prompt);
    
    return {
      topic: input.topic,
      level: determineLevel(input.topic),
      content: formatEducationContent(response.text),
      keyPoints: generateKeyPoints(input.topic),
      quiz: generateQuiz(input.topic),
      resources: generateResources(input.topic)
    };
  }
);

function formatEducationContent(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>')
    .replace(/\n/g, '<br>');
}

function determineLevel(topic: string): 'beginner' | 'intermediate' | 'advanced' {
  const beginnerTopics = ['voting process', 'citizen rights', 'basic civics'];
  const advancedTopics = ['constitution', 'government structure', 'electoral system'];
  
  const lowerTopic = topic.toLowerCase();
  if (beginnerTopics.some(t => lowerTopic.includes(t))) return 'beginner';
  if (advancedTopics.some(t => lowerTopic.includes(t))) return 'advanced';
  return 'intermediate';
}

function generateKeyPoints(topic: string): string[] {
  return [
    `**${topic}** is essential for informed civic participation`,
    'Kenya\'s **Constitution 2010** provides the legal framework',
    '**Citizens** have both rights and responsibilities in democracy',
    '**Democratic processes** require active citizen engagement',
    '**Civic education** strengthens democratic institutions'
  ];
}

function generateQuiz(topic: string): Array<{question: string, options: string[], correct: number}> {
  return [
    {
      question: `What is the primary importance of understanding ${topic}?`,
      options: ['Entertainment value', 'Informed citizenship', 'Personal benefit', 'Social status'],
      correct: 1
    },
    {
      question: 'Which document governs Kenya\'s democratic processes?',
      options: ['Parliamentary Act', 'Constitution 2010', 'Presidential Order', 'Court Decision'],
      correct: 1
    },
    {
      question: 'What strengthens democratic institutions?',
      options: ['Wealth accumulation', 'Civic education', 'Political connections', 'Social media'],
      correct: 1
    }
  ];
}

function generateResources(topic: string): string[] {
  return [
    'Kenya Constitution 2010 - Official Document',
    'IEBC Civic Education Materials',
    'Parliamentary Hansard Records',
    'Kenya Law Reform Commission Reports'
  ];
}