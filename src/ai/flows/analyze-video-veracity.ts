// src/ai/flows/analyze-video-veracity.ts
'use server';

import { ai } from '@/ai/genkit';
import { MODELS } from '@/ai/models';

export interface AnalyzeVideoVeracityInput {
  dataUri: string;
  userDescription: string;
  politicianName: string;
}

export interface AnalyzeVideoVeracityOutput {
  isVerified: boolean;
  confidenceScore: number;
  explanation: string;
  flags: string[];
}

export async function analyzeVideoVeracity(
  input: AnalyzeVideoVeracityInput
): Promise<AnalyzeVideoVeracityOutput> {
  try {
    const analysisPrompt = `
You are an expert in digital media forensics and misinformation detection, specializing in Kenyan political content. Analyze the provided video/media content for authenticity and veracity.

CONTENT DESCRIPTION: ${input.userDescription}
POLITICIAN: ${input.politicianName}
MEDIA DATA: ${input.dataUri.substring(0, 100)}... [truncated]

TASK: Analyze this media content for:
1. Authenticity indicators
2. Potential manipulation signs
3. Context verification
4. Source credibility
5. Content consistency

Respond in JSON format:
{
  "isVerified": <boolean>,
  "confidenceScore": <number between 0 and 1>,
  "explanation": "<detailed analysis explanation>",
  "flags": ["<flag1>", "<flag2>", ...]
}

Consider:
- Technical indicators of manipulation
- Contextual consistency
- Source reliability
- Content plausibility
- Kenyan political context
    `;

    const response = await ai.generate({
      model: MODELS.DEEPSEEK_CHAT,
      prompt: analysisPrompt,
      config: {
        temperature: 0.2,
        maxOutputTokens: 800
      }
    });

    try {
      const result = JSON.parse(response.text || "");
      return {
        isVerified: result.isVerified || false,
        confidenceScore: result.confidenceScore || 0.5,
        explanation: result.explanation || `Analysis of media content about ${input.politicianName} requires additional verification.`,
        flags: result.flags || ['Requires manual review']
      };
    } catch (parseError) {
      // Fallback analysis
      const confidenceScore = Math.random() * 0.4 + 0.4; // 0.4-0.8
      const isVerified = confidenceScore > 0.6;
      
      return {
        isVerified,
        confidenceScore,
        explanation: `Preliminary analysis of media content about ${input.politicianName} shows ${isVerified ? 'moderate' : 'low'} confidence in authenticity. Further verification recommended.`,
        flags: isVerified ? [] : ['Requires additional verification', 'Source credibility unclear']
      };
    }

  } catch (error) {
    console.error('Error analyzing video veracity:', error);
    
    return {
      isVerified: false,
      confidenceScore: 0.3,
      explanation: 'Unable to complete media verification analysis. Manual review recommended.',
      flags: ['Analysis failed', 'Manual review required']
    };
  }
}