import { ai } from './genkit';

// Available models
export const MODELS = {
  GEMINI: 'googleai/gemini-2.0-flash',
  DEEPSEEK_CHAT: 'deepseek/deepseek-chat',
  DEEPSEEK_CODER: 'deepseek/deepseek-coder',
} as const;

// Helper function to generate responses with different models
export async function generateWithModel(
  prompt: string, 
  model: keyof typeof MODELS = 'DEEPSEEK_CHAT',
  options?: any
) {
  const response = await ai.generate({
    model: MODELS[model],
    prompt,
    ...options
  });
  
  return response.text;
}

// Specialized functions for different use cases
export const generatePoliticalAdvice = (query: string) => 
  generateWithModel(query, 'DEEPSEEK_CHAT');

export const generateCodeSolution = (query: string) => 
  generateWithModel(query, 'DEEPSEEK_CODER');

export const generateGeneralChat = (query: string) => 
  generateWithModel(query, 'DEEPSEEK_CHAT');

export const generateAnalysis = (query: string) => 
  generateWithModel(query, 'DEEPSEEK_CHAT');