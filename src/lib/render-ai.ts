/**
 * Render-Compatible AI Service
 * Designed specifically for Render platform restrictions
 * Uses only local processing and cached responses
 */

export interface RenderAIResponse {
  success: boolean;
  data?: any;
  error?: string;
  source: 'cache' | 'local' | 'mock' | 'blocked';
  timestamp: number;
}

export class RenderAIService {
  private static instance: RenderAIService;
  private isRenderPlatform = process.env.RENDER === 'true' || process.env.NODE_ENV === 'production';
  
  // Pre-computed sentiment analysis cache for common political terms
  private sentimentCache = new Map([
    ['leadership', { sentiment: 'positive', confidence: 0.75, keywords: ['vision', 'guidance', 'direction'] }],
    ['corruption', { sentiment: 'negative', confidence: 0.90, keywords: ['scandal', 'misuse', 'unethical'] }],
    ['development', { sentiment: 'positive', confidence: 0.80, keywords: ['progress', 'growth', 'improvement'] }],
    ['unemployment', { sentiment: 'negative', confidence: 0.85, keywords: ['jobless', 'economic hardship'] }],
    ['education', { sentiment: 'positive', confidence: 0.70, keywords: ['learning', 'schools', 'knowledge'] }],
    ['healthcare', { sentiment: 'positive', confidence: 0.75, keywords: ['medical', 'hospitals', 'treatment'] }],
    ['security', { sentiment: 'neutral', confidence: 0.65, keywords: ['safety', 'protection', 'law enforcement'] }],
    ['economy', { sentiment: 'neutral', confidence: 0.60, keywords: ['financial', 'trade', 'business'] }]
  ]);

  // Cached political analysis responses
  private politicalCache = new Map([
    ['government approval', {
      sentiment: 'mixed',
      positivePercentage: 42,
      negativePercentage: 38,
      neutralPercentage: 20,
      keyIssues: ['economic policy', 'healthcare reform', 'infrastructure'],
      analysis: 'Current government approval shows mixed sentiment with slight positive lean'
    }],
    ['election prediction', {
      confidence: 'moderate',
      factors: ['historical trends', 'current polls', 'economic indicators'],
      prediction: 'Competitive race expected with multiple viable candidates'
    }]
  ]);

  public static getInstance(): RenderAIService {
    if (!RenderAIService.instance) {
      RenderAIService.instance = new RenderAIService();
    }
    return RenderAIService.instance;
  }

  /**
   * Analyze sentiment using local processing only
   */
  async analyzeSentiment(input: { text: string; candidateName?: string; topic?: string }): Promise<RenderAIResponse> {
    try {
      const { text, candidateName = 'Unknown', topic = 'General' } = input;
      
      // Local sentiment analysis using keyword matching
      const analysis = this.performLocalSentimentAnalysis(text);
      
      return {
        success: true,
        data: {
          sentiment: analysis.overallSentiment,
          confidence: analysis.confidence,
          positiveScore: analysis.positiveScore,
          negativeScore: analysis.negativeScore,
          neutralScore: analysis.neutralScore,
          keyWords: analysis.keywords,
          summary: `Sentiment analysis for ${candidateName} on ${topic}: ${analysis.summary}`,
          analysis: {
            candidate: candidateName,
            topic: topic,
            overallSentiment: analysis.overallSentiment,
            emotionalTone: analysis.emotionalTone,
            keyThemes: analysis.themes,
            recommendedActions: analysis.recommendations
          },
          metadata: {
            processingTime: Date.now() - analysis.startTime,
            method: 'local-processing',
            renderCompatible: true
          }
        },
        source: 'local',
        timestamp: Date.now()
      };
      
    } catch (error) {
      console.error('Local sentiment analysis error:', error);
      return this.getFallbackSentiment(input);
    }
  }

  /**
   * Local sentiment analysis using keyword matching and scoring
   */
  private performLocalSentimentAnalysis(text: string) {
    const startTime = Date.now();
    const words = text.toLowerCase().split(/\s+/);
    
    // Sentiment keywords
    const positiveWords = [
      'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'outstanding',
      'progress', 'development', 'growth', 'improvement', 'success', 'achievement',
      'leadership', 'vision', 'hope', 'unity', 'prosperity', 'innovation', 'reform'
    ];
    
    const negativeWords = [
      'bad', 'terrible', 'awful', 'horrible', 'disappointing', 'failed', 'failure',
      'corruption', 'scandal', 'crisis', 'problem', 'issue', 'concern', 'worried',
      'unemployment', 'poverty', 'decline', 'recession', 'conflict', 'violence'
    ];
    
    const neutralWords = [
      'government', 'policy', 'election', 'candidate', 'vote', 'political', 'party',
      'parliament', 'democracy', 'citizen', 'public', 'national', 'state', 'official'
    ];

    let positiveScore = 0;
    let negativeScore = 0;
    let neutralScore = 0;
    const foundKeywords: string[] = [];

    // Score the text
    words.forEach(word => {
      if (positiveWords.includes(word)) {
        positiveScore++;
        foundKeywords.push(word);
      } else if (negativeWords.includes(word)) {
        negativeScore++;
        foundKeywords.push(word);
      } else if (neutralWords.includes(word)) {
        neutralScore++;
        foundKeywords.push(word);
      }
    });

    // Calculate overall sentiment
    const totalScore = positiveScore + negativeScore + neutralScore;
    const positivePercentage = totalScore > 0 ? (positiveScore / totalScore) * 100 : 33;
    const negativePercentage = totalScore > 0 ? (negativeScore / totalScore) * 100 : 33;
    const neutralPercentage = totalScore > 0 ? (neutralScore / totalScore) * 100 : 34;

    let overallSentiment: string;
    let confidence: number;
    
    if (positivePercentage > negativePercentage + 10) {
      overallSentiment = 'positive';
      confidence = Math.min(0.9, 0.5 + (positivePercentage / 100) * 0.4);
    } else if (negativePercentage > positivePercentage + 10) {
      overallSentiment = 'negative';
      confidence = Math.min(0.9, 0.5 + (negativePercentage / 100) * 0.4);
    } else {
      overallSentiment = 'neutral';
      confidence = 0.6;
    }

    // Determine emotional tone
    const emotionalTone = positiveScore > negativeScore * 1.5 ? 'optimistic' :
                         negativeScore > positiveScore * 1.5 ? 'pessimistic' : 'balanced';

    // Identify key themes
    const themes = [];
    if (text.includes('economy') || text.includes('job') || text.includes('business')) themes.push('economic');
    if (text.includes('health') || text.includes('hospital') || text.includes('medical')) themes.push('healthcare');
    if (text.includes('education') || text.includes('school') || text.includes('university')) themes.push('education');
    if (text.includes('security') || text.includes('police') || text.includes('crime')) themes.push('security');
    if (themes.length === 0) themes.push('general');

    // Generate recommendations
    const recommendations = [];
    if (overallSentiment === 'negative') {
      recommendations.push('Address public concerns through transparent communication');
      recommendations.push('Focus on delivering tangible improvements');
    } else if (overallSentiment === 'positive') {
      recommendations.push('Leverage positive sentiment for policy advancement');
      recommendations.push('Maintain current communication strategy');
    } else {
      recommendations.push('Clarify policy positions to improve public understanding');
      recommendations.push('Engage more directly with constituents');
    }

    return {
      overallSentiment,
      confidence,
      positiveScore: positivePercentage,
      negativeScore: negativePercentage,
      neutralScore: neutralPercentage,
      keywords: foundKeywords.slice(0, 10), // Top 10 keywords
      summary: `Analysis shows ${overallSentiment} sentiment (${confidence.toFixed(2)} confidence)`,
      emotionalTone,
      themes,
      recommendations,
      startTime
    };
  }

  /**
   * Get cached political analysis
   */
  async getPoliticalAnalysis(topic: string): Promise<RenderAIResponse> {
    const cached = this.politicalCache.get(topic.toLowerCase());
    
    if (cached) {
      return {
        success: true,
        data: cached,
        source: 'cache',
        timestamp: Date.now()
      };
    }

    // Generate mock analysis for unknown topics
    return {
      success: true,
      data: {
        sentiment: 'neutral',
        confidence: 0.65,
        analysis: `Political analysis for "${topic}" indicates mixed public opinion with varying perspectives across different regions and demographics.`,
        keyFactors: ['public opinion', 'media coverage', 'policy impact'],
        recommendation: 'Continue monitoring public sentiment and adjust communication strategy accordingly'
      },
      source: 'mock',
      timestamp: Date.now()
    };
  }

  /**
   * Fallback sentiment when all else fails
   */
  private getFallbackSentiment(input: { text: string; candidateName?: string; topic?: string }): RenderAIResponse {
    return {
      success: true,
      data: {
        sentiment: 'neutral',
        confidence: 0.5,
        positiveScore: 33,
        negativeScore: 33,
        neutralScore: 34,
        keyWords: ['analysis', 'political', 'sentiment'],
        summary: `Fallback analysis for ${input.candidateName || 'candidate'} on ${input.topic || 'topic'}`,
        analysis: {
          candidate: input.candidateName || 'Unknown',
          topic: input.topic || 'General',
          overallSentiment: 'neutral',
          emotionalTone: 'balanced',
          keyThemes: ['general'],
          recommendedActions: ['Monitor public opinion', 'Engage with constituents']
        },
        metadata: {
          method: 'fallback',
          renderCompatible: true,
          note: 'This is a fallback response due to service limitations'
        }
      },
      source: 'mock',
      timestamp: Date.now()
    };
  }

  /**
   * Health check for Render platform
   */
  async healthCheck(): Promise<{ status: string; details: any }> {
    return {
      status: 'healthy',
      details: {
        service: 'render-ai',
        platform: 'render',
        capabilities: ['local-sentiment', 'cached-analysis', 'mock-responses'],
        limitations: ['no-external-apis', 'local-processing-only'],
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Check if external AI services are available (always false on Render)
   */
  isExternalAIAvailable(): boolean {
    return false; // Always return false for Render compatibility
  }
}

// Export singleton instance
export const renderAI = RenderAIService.getInstance();
