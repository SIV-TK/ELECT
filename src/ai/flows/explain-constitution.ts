// src/ai/flows/explain-constitution.ts
'use server';

import { ai } from '@/ai/genkit';
import { MODELS } from '@/ai/models';

export interface ExplainConstitutionInput {
  query: string;
  article?: string;
}

export interface ExplainConstitutionOutput {
  explanation: string;
  relevantArticles: string[];
  practicalExample: string;
  citizenRights: string[];
}

export async function explainConstitution(
  input: ExplainConstitutionInput
): Promise<ExplainConstitutionOutput> {
  try {
    const constitutionPrompt = `
You are a constitutional law expert specializing in the Kenya Constitution 2010. Provide a comprehensive explanation of the user's query about Kenyan constitutional law.

USER QUERY: ${input.query}
${input.article ? `SPECIFIC ARTICLE: ${input.article}` : ''}

TASK: Explain the constitutional matter in simple, accessible language that ordinary Kenyan citizens can understand.

Respond in JSON format:
{
  "explanation": "<detailed explanation in simple language>",
  "relevantArticles": ["<article1>", "<article2>", "<article3>"],
  "practicalExample": "<real-world example of how this affects citizens>",
  "citizenRights": ["<right1>", "<right2>", "<right3>", "<right4>", "<right5>"]
}

Guidelines:
1. Use simple, clear language avoiding legal jargon
2. Reference specific articles from the Kenya Constitution 2010
3. Provide practical examples relevant to everyday Kenyan life
4. Explain how this affects ordinary citizens
5. Include related rights and responsibilities
6. Be accurate and factual based on the actual constitution
7. Consider current Kenyan political and social context

Focus on making constitutional law accessible to all Kenyans regardless of education level.
    `;

    const response = await ai.generate({
      model: MODELS.DEEPSEEK_CHAT,
      prompt: constitutionPrompt,
      config: {
        temperature: 0.2,
        maxOutputTokens: 1200
      }
    });

    try {
      const result = JSON.parse(response.text || response.content?.[0]?.text || "");
      return {
        explanation: result.explanation || 'The Kenyan Constitution provides the framework for governance and protects citizen rights.',
        relevantArticles: result.relevantArticles || ['Article 1 (Sovereignty)', 'Article 2 (Supremacy)'],
        practicalExample: result.practicalExample || 'This constitutional provision affects how government operates and protects your rights as a citizen.',
        citizenRights: result.citizenRights || ['Right to life', 'Freedom of expression', 'Right to vote', 'Right to fair trial', 'Right to privacy']
      };
    } catch (parseError) {
      // Fallback based on query analysis
      const query = input.query.toLowerCase();
      
      if (query.includes('rights') || query.includes('fundamental')) {
        return {
          explanation: 'The Kenyan Constitution guarantees fundamental rights and freedoms to all citizens under Chapter Four (Articles 19-51). These rights include the right to life, liberty, security, privacy, and freedom of expression. The Constitution also establishes mechanisms to protect these rights through the courts and independent institutions.',
          relevantArticles: ['Article 19-51 (Bill of Rights)', 'Article 28 (Human Dignity)', 'Article 33 (Freedom of Expression)', 'Article 37 (Assembly and Association)'],
          practicalExample: 'For example, you have the right to peaceful assembly, meaning you can participate in lawful demonstrations without fear of persecution. You also have the right to access information from the government and to express your opinions freely.',
          citizenRights: ['Right to life and security', 'Freedom of expression and media', 'Right to privacy', 'Freedom of assembly', 'Right to fair trial']
        };
      } else if (query.includes('voting') || query.includes('election')) {
        return {
          explanation: 'The Constitution establishes Kenya as a democratic republic with regular elections. Chapter Seven (Articles 81-104) governs elections, while Article 38 guarantees political rights. Citizens have the right to vote and be voted for in free and fair elections conducted by the Independent Electoral and Boundaries Commission (IEBC).',
          relevantArticles: ['Article 38 (Political Rights)', 'Article 81-104 (Elections)', 'Article 138 (Presidential Elections)', 'Article 88 (IEBC)'],
          practicalExample: 'Every Kenyan citizen over 18 can register to vote and participate in presidential, parliamentary, and county elections held every five years. You can also run for office if you meet the constitutional requirements.',
          citizenRights: ['Right to vote in elections', 'Right to be a candidate', 'Right to free and fair elections', 'Right to secret ballot', 'Right to electoral justice']
        };
      } else if (query.includes('devolution') || query.includes('county')) {
        return {
          explanation: 'Chapter Eleven (Articles 174-200) establishes devolved government in Kenya. This system brings government closer to the people by creating 47 county governments with specific functions like healthcare, agriculture, and local infrastructure. Counties have their own governors, assemblies, and budgets.',
          relevantArticles: ['Article 174-200 (Devolved Government)', 'Article 185 (County Assemblies)', 'Article 179 (County Governor)'],
          practicalExample: 'Your county government is responsible for services like local hospitals, markets, water supply, and roads within the county. You elect a governor and county assembly members to manage these services.',
          citizenRights: ['Right to participate in county governance', 'Right to access county services', 'Right to information from county government', 'Right to petition county assembly']
        };
      } else {
        return {
          explanation: 'The 2010 Constitution of Kenya is the supreme law that establishes the framework for governance, protects citizen rights, and defines the structure of government. It replaced the independence constitution and introduced major reforms including devolved government, expanded bill of rights, and stronger institutions.',
          relevantArticles: ['Article 1 (Sovereignty)', 'Article 2 (Supremacy of Constitution)', 'Article 10 (National Values)', 'Article 6 (Devolution)'],
          practicalExample: 'The Constitution affects your daily life by guaranteeing your rights, establishing how leaders are chosen, creating county governments for local services, and ensuring government accountability through institutions like the judiciary and parliament.',
          citizenRights: ['Constitutional supremacy', 'Democratic governance', 'Rule of law', 'Human rights protection', 'Government accountability']
        };
      }
    }

  } catch (error) {
    console.error('Error explaining constitution:', error);
    
    return {
      explanation: 'The Kenyan Constitution is the supreme law that governs the country and protects citizen rights. It establishes the structure of government and defines the relationship between citizens and the state.',
      relevantArticles: ['Article 1', 'Article 2', 'Article 10'],
      practicalExample: 'The Constitution ensures that government serves the people and protects your fundamental rights and freedoms.',
      citizenRights: ['Right to life', 'Freedom of expression', 'Right to vote', 'Right to fair trial']
    };
  }
}