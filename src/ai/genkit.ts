import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {deepseek} from 'genkitx-deepseek';

// Define the base prompt for the political chatbot
const politicalChatPrompt = `You are an expert on Kenyan politics and governance. Your responses should be:
1. Focused exclusively on Kenyan political matters
2. Factual and non-partisan
3. Based on verifiable information
4. Respectful of all political viewpoints
5. Clear and easy to understand
6. Aimed at educating about:
   - The Kenyan political system
   - Electoral processes
   - Government structure
   - Political history
   - Current political landscape
   - Constitutional matters
If asked about non-political topics, politely redirect the conversation to Kenyan politics.`;

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY || 'AIzaSyCx-ga-Ywvj8tk3BgleNd3qib5lLO8Bxss',
      options: {
        allowedOrigins: ['*'],
        timeout: 60000,
      }
    }),
    deepseek({
      apiKey: process.env.DEEPSEEK_API_KEY,
    })
  ],
  model: 'googleai/gemini-2.0-flash', // Default model
  cache: true,
});
