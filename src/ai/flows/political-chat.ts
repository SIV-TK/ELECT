// src/ai/flows/political-chat.ts
'use server';

import { ai } from '@/ai/genkit';
import { MODELS } from '@/ai/models';
import { validateAIResponse } from '@/ai/validation';

export interface PoliticalChatInput {
  message: string;
}

export interface PoliticalChatOutput {
  response: string;
}

export async function politicalChat(
  input: PoliticalChatInput
): Promise<PoliticalChatOutput> {
  try {
    const chatPrompt = `
You are an expert on Kenyan politics and governance. Your responses should be:
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

USER MESSAGE: ${input.message}

Provide a helpful, informative response about Kenyan politics. If asked about non-political topics, politely redirect the conversation to Kenyan politics.

Keep your response concise but informative, suitable for citizens seeking to understand their political system better.
    `;

    const response = await ai.generate({
      model: MODELS.DEEPSEEK_CHAT,
      prompt: chatPrompt,
      config: {
        temperature: 0.3,
        maxOutputTokens: 500
      }
    });

    const responseText = validateAIResponse(response);
    
    return {
      response: responseText
    };

  } catch (error) {
    console.error('Error in political chat:', error);
    
    // Fallback response based on message analysis
    const message = input.message.toLowerCase();
    
    let response = '';
    
    if (message.includes('president') || message.includes('ruto')) {
      response = 'The President of Kenya is the head of state and government, elected for a five-year term. The current president is William Ruto, who took office in September 2022. The president leads the executive branch and implements government policies.';
    } else if (message.includes('parliament') || message.includes('mp')) {
      response = 'The Kenyan Parliament consists of the National Assembly and the Senate. MPs are elected to represent constituencies, while Senators represent counties in the bicameral system. Parliament makes laws and oversees government operations.';
    } else if (message.includes('county') || message.includes('governor')) {
      response = 'Kenya has 47 counties, each led by an elected Governor. Counties handle devolved functions like healthcare, agriculture, and local infrastructure development under the 2010 Constitution.';
    } else if (message.includes('election') || message.includes('vote')) {
      response = 'Kenya holds general elections every five years. Citizens vote for President, MPs, Senators, Governors, and MCAs. The next general election is scheduled for 2027. Elections are managed by the Independent Electoral and Boundaries Commission (IEBC).';
    } else if (message.includes('constitution')) {
      response = 'The 2010 Constitution of Kenya established a new governance structure with devolved government, expanded bill of rights, and stronger institutions for accountability. It replaced the independence constitution.';
    } else {
      response = 'I can help you understand Kenyan politics, government structure, elections, and constitutional matters. What specific topic would you like to know about?';
    }
    
    return { response };
  }
}