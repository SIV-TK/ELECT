// src/ai/flows/enhanced-political-chat.ts
'use server';

import { ai } from '@/ai/genkit';
import { MODELS } from '@/ai/models';
import { WebScraper } from '@/lib/web-scraper';
import { KenyaPoliticalDataService } from '@/lib/kenya-political-data';

export interface EnhancedPoliticalChatInput {
  message: string;
  useDeepSeek?: boolean;
}

export interface EnhancedPoliticalChatOutput {
  response: string;
  model: string;
}

export async function enhancedPoliticalChat(
  input: EnhancedPoliticalChatInput
): Promise<EnhancedPoliticalChatOutput> {
  try {
    // Get real-time political context
    const [politicalTrends, publicConcerns] = await Promise.all([
      KenyaPoliticalDataService.getKenyanPoliticalTrends(),
      KenyaPoliticalDataService.compilePublicConcerns()
    ]);

    const selectedModel = MODELS.DEEPSEEK_CHAT;
    
    const enhancedPrompt = `
You are an expert on Kenyan politics with access to real-time political data. Provide comprehensive, factual responses about Kenyan political matters.

CURRENT POLITICAL TRENDS: ${politicalTrends.join(', ')}
MAJOR PUBLIC CONCERNS: ${publicConcerns.slice(0, 5).join(', ')}

USER MESSAGE: ${input.message}

Guidelines:
1. Focus exclusively on Kenyan political matters
2. Use current political context in your response
3. Be factual, non-partisan, and educational
4. Reference current trends and concerns when relevant
5. Provide actionable information for citizens
6. Maintain respect for all political viewpoints

Provide a comprehensive response that incorporates current political context.
    `;

    const response = await ai.generate({
      model: selectedModel,
      prompt: enhancedPrompt,
      config: {
        temperature: 0.4,
        maxOutputTokens: 700
      }
    });

    return {
      response: response.text || 'I can help you understand current Kenyan political developments. What specific aspect would you like to explore?',
      model: selectedModel
    };

  } catch (error) {
    console.error('Error in enhanced political chat:', error);
    
    // Fallback to basic political chat
    const message = input.message.toLowerCase();
    let response = '';
    
    if (message.includes('current') || message.includes('recent')) {
      response = 'Current Kenyan political discussions focus on economic policies, cost of living, youth unemployment, and governance reforms. Key issues include healthcare, education funding, and infrastructure development.';
    } else if (message.includes('trend') || message.includes('popular')) {
      response = 'Popular political topics in Kenya include #CostOfLiving, #YouthUnemployment, #CorruptionFight, #HealthcareReform, and #EducationFunding. These reflect major citizen concerns.';
    } else {
      response = 'I can provide insights on current Kenyan political trends, government policies, and citizen concerns. What specific topic interests you?';
    }
    
    return {
      response,
      model: 'deepseek-fallback'
    };
  }
}