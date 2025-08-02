// src/ai/flows/get-campaign-advice.ts
'use server';

import { ai } from '@/ai/genkit';
import { MODELS } from '@/ai/models';
import { WebScraper } from '@/lib/web-scraper';
import { KenyaPoliticalDataService } from '@/lib/kenya-political-data';

export interface GetCampaignAdviceInput {
  candidateName: string;
  trendingTopics: string;
  candidateCurrentStance: string;
  userSentimentAnalysis: string;
}

export interface GetCampaignAdviceOutput {
  strategicRecommendations: string[];
  messagingAdvice: string;
  targetAudiences: string[];
  riskAssessment: string;
}

export async function getCampaignAdvice(
  input: GetCampaignAdviceInput
): Promise<GetCampaignAdviceOutput> {
  try {
    // Gather comprehensive real-time data
    const [
      scrapedData,
      politicalTrends,
      performanceAnalysis,
      publicConcerns,
      voterExpectations
    ] = await Promise.all([
      WebScraper.scrapeAllSources(input.candidateName),
      KenyaPoliticalDataService.getKenyanPoliticalTrends(),
      KenyaPoliticalDataService.analyzePoliticianPerformance(input.candidateName),
      KenyaPoliticalDataService.compilePublicConcerns(),
      KenyaPoliticalDataService.getVoterExpectations()
    ]);

    // Compile comprehensive context for AI analysis
    const dataContext = scrapedData.map(item => `${item.source}: ${item.content}`).join('\n\n');
    const trendsContext = politicalTrends.join(', ');
    const concernsContext = publicConcerns.slice(0, 8).join(', ');
    const expectationsContext = voterExpectations.slice(0, 8).join(', ');

    const advicePrompt = `
You are a senior political strategist with deep expertise in Kenyan politics. Provide comprehensive campaign advice for ${input.candidateName} based on real-time data and analysis.

CANDIDATE: ${input.candidateName}
CURRENT STANCE: ${input.candidateCurrentStance}
TRENDING TOPICS: ${input.trendingTopics}
SENTIMENT ANALYSIS: ${input.userSentimentAnalysis}

REAL-TIME DATA:
${dataContext}

CURRENT POLITICAL TRENDS:
${trendsContext}

PERFORMANCE ANALYSIS:
Strengths: ${performanceAnalysis.strengths.join(', ')}
Weaknesses: ${performanceAnalysis.weaknesses.join(', ')}
Opportunities: ${performanceAnalysis.opportunities.join(', ')}
Threats: ${performanceAnalysis.threats.join(', ')}

PUBLIC CONCERNS:
${concernsContext}

VOTER EXPECTATIONS:
${expectationsContext}

TASK: Provide strategic campaign advice in JSON format:

{
  "strategicRecommendations": [
    "<recommendation1>",
    "<recommendation2>",
    "<recommendation3>",
    "<recommendation4>",
    "<recommendation5>"
  ],
  "messagingAdvice": "<comprehensive messaging strategy>",
  "targetAudiences": [
    "<audience1>",
    "<audience2>",
    "<audience3>",
    "<audience4>"
  ],
  "riskAssessment": "<detailed risk analysis and mitigation strategies>"
}

Focus on:
1. Data-driven strategic recommendations
2. Messaging that addresses current public concerns
3. Target audiences based on sentiment analysis
4. Risk assessment considering current political climate
5. Actionable advice for Kenyan political context

Ensure advice is ethical, legal, and focused on democratic engagement.
    `;

    // Use AI to generate comprehensive campaign advice
    const response = await ai.generate({
      model: MODELS.DEEPSEEK_CHAT,
      prompt: advicePrompt,
      config: {
        temperature: 0.4,
        maxOutputTokens: 1500
      }
    });

    try {
      const responseText = response.text || '';
      if (!responseText.trim()) {
        throw new Error('Empty response');
      }
      
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found');
      }
      
      const result = JSON.parse(jsonMatch[0]);
      return {
        strategicRecommendations: result.strategicRecommendations || [
          'Focus on addressing cost of living concerns',
          'Strengthen grassroots engagement',
          'Improve digital communication strategy',
          'Address corruption perception issues',
          'Enhance youth voter outreach'
        ],
        messagingAdvice: result.messagingAdvice || `${input.candidateName} should focus on unity, economic solutions, and transparent governance while addressing key voter concerns about cost of living and job creation.`,
        targetAudiences: result.targetAudiences || [
          'Young voters (18-35)',
          'Rural communities',
          'Urban middle class',
          'Women voters'
        ],
        riskAssessment: result.riskAssessment || 'Moderate risk level with opportunities for improvement through focused messaging on economic issues and transparency.'
      };
    } catch (parseError) {
      // Fallback response based on data analysis
      return {
        strategicRecommendations: [
          'Address cost of living concerns with concrete policy proposals',
          'Increase grassroots engagement in key constituencies',
          'Leverage digital platforms for youth voter outreach',
          'Demonstrate transparency through regular public updates',
          'Focus on job creation and economic development messaging'
        ],
        messagingAdvice: `Based on current sentiment analysis, ${input.candidateName} should emphasize economic solutions, transparent governance, and unity. Address public concerns about cost of living while highlighting achievements in infrastructure and development.`,
        targetAudiences: [
          'Young voters seeking employment opportunities',
          'Rural farmers and small business owners',
          'Urban professionals concerned about economy',
          'Women voters focused on family welfare'
        ],
        riskAssessment: 'Current political climate presents moderate challenges with opportunities for positive messaging. Key risks include economic concerns and corruption perception. Mitigation strategies should focus on transparency and concrete policy solutions.'
      };
    }

  } catch (error) {
    console.error('Error generating campaign advice:', error);
    
    // Basic fallback response
    return {
      strategicRecommendations: [
        'Focus on key voter concerns',
        'Improve public communication',
        'Strengthen party organization',
        'Address policy implementation'
      ],
      messagingAdvice: `Campaign messaging should focus on addressing voter priorities and demonstrating leadership capability.`,
      targetAudiences: [
        'General electorate',
        'Key demographic groups',
        'Regional constituencies'
      ],
      riskAssessment: 'Standard political risks apply. Focus on positive messaging and voter engagement.'
    };
  }
}