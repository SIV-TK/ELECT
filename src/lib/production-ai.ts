/**
 * Production-Ready AI Service with Fallback Mechanisms
 * Handles AI service failures gracefully in production environments
 */

export interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
  fallback?: boolean;
  source?: 'ai' | 'cache' | 'mock';
}

export class ProductionAIService {
  private isProduction = process.env.NODE_ENV === 'production';
  private aiDisabled = process.env.DISABLE_AI_FEATURES === 'true';
  private deepSeekKey = process.env.DEEPSEEK_API_KEY;

  /**
   * Check if AI services are available
   */
  private isAIAvailable(): boolean {
    return !this.aiDisabled && !!this.deepSeekKey;
  }

  /**
   * Analyze political sentiment with fallback
   */
  async analyzeSentiment(text: string): Promise<AIResponse> {
    try {
      if (!this.isAIAvailable()) {
        return this.getFallbackSentiment(text);
      }

      // Try to call actual AI service with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      try {
        // Simulate AI call - replace with actual service call
        const response = await this.callDeepSeekAPI({
          prompt: `Analyze the political sentiment of this text: "${text}"`,
          timeout: controller.signal
        });

        clearTimeout(timeoutId);
        
        return {
          success: true,
          data: response,
          source: 'ai'
        };
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (error instanceof Error && error.name === 'AbortError') {
          console.warn('AI service timeout, using fallback');
          return this.getFallbackSentiment(text);
        }
        throw error;
      }

    } catch (error) {
      console.error('AI sentiment analysis failed:', error);
      return this.getFallbackSentiment(text);
    }
  }

  /**
   * Analyze candidate information with fallback
   */
  async analyzeCandidate(candidateData: any): Promise<AIResponse> {
    try {
      if (!this.isAIAvailable()) {
        return this.getFallbackCandidateAnalysis(candidateData);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      try {
        const response = await this.callDeepSeekAPI({
          prompt: `Analyze this political candidate data: ${JSON.stringify(candidateData)}`,
          timeout: controller.signal
        });

        clearTimeout(timeoutId);
        
        return {
          success: true,
          data: response,
          source: 'ai'
        };
      } catch (error) {
        clearTimeout(timeoutId);
        return this.getFallbackCandidateAnalysis(candidateData);
      }

    } catch (error) {
      console.error('AI candidate analysis failed:', error);
      return this.getFallbackCandidateAnalysis(candidateData);
    }
  }

  /**
   * Fact-check content with fallback
   */
  async factCheck(content: string): Promise<AIResponse> {
    try {
      if (!this.isAIAvailable()) {
        return this.getFallbackFactCheck(content);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      try {
        const response = await this.callDeepSeekAPI({
          prompt: `Fact-check this political statement: "${content}"`,
          timeout: controller.signal
        });

        clearTimeout(timeoutId);
        
        return {
          success: true,
          data: response,
          source: 'ai'
        };
      } catch (error) {
        clearTimeout(timeoutId);
        return this.getFallbackFactCheck(content);
      }

    } catch (error) {
      console.error('AI fact-check failed:', error);
      return this.getFallbackFactCheck(content);
    }
  }

  /**
   * Call DeepSeek API with proper error handling
   */
  private async callDeepSeekAPI(params: { prompt: string; timeout?: AbortSignal }): Promise<any> {
    if (!this.deepSeekKey) {
      throw new Error('DeepSeek API key not configured');
    }

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.deepSeekKey}`,
        'Content-Type': 'application/json',
      },
      signal: params.timeout,
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: params.prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No response generated';
  }

  /**
   * Fallback sentiment analysis using simple keyword matching
   */
  private getFallbackSentiment(text: string): AIResponse {
    const positiveWords = ['good', 'excellent', 'great', 'positive', 'strong', 'successful', 'improvement', 'better'];
    const negativeWords = ['bad', 'terrible', 'poor', 'negative', 'weak', 'failed', 'worse', 'problem'];
    
    const words = text.toLowerCase().split(/\s+/);
    const positiveCount = words.filter(word => positiveWords.includes(word)).length;
    const negativeCount = words.filter(word => negativeWords.includes(word)).length;
    
    let sentiment = 'neutral';
    let confidence = 0.5;
    
    if (positiveCount > negativeCount) {
      sentiment = 'positive';
      confidence = Math.min(0.8, 0.5 + (positiveCount - negativeCount) * 0.1);
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative';
      confidence = Math.min(0.8, 0.5 + (negativeCount - positiveCount) * 0.1);
    }
    
    return {
      success: true,
      data: {
        sentiment,
        confidence,
        analysis: `Fallback analysis: ${sentiment} sentiment detected with ${confidence} confidence`,
        wordCounts: { positive: positiveCount, negative: negativeCount }
      },
      fallback: true,
      source: 'mock'
    };
  }

  /**
   * Fallback candidate analysis using basic profile data
   */
  private getFallbackCandidateAnalysis(candidateData: any): AIResponse {
    const analysis = {
      name: candidateData.name || 'Unknown Candidate',
      party: candidateData.party || 'Independent',
      position: candidateData.position || 'Unknown Position',
      experience: candidateData.experience || 'No experience data available',
      keyIssues: candidateData.keyIssues || ['Economic development', 'Healthcare', 'Education'],
      summary: 'Basic candidate profile analysis (AI services unavailable)',
      riskLevel: 'medium',
      publicSupport: 'unknown'
    };
    
    return {
      success: true,
      data: analysis,
      fallback: true,
      source: 'mock'
    };
  }

  /**
   * Fallback fact-check using simple credibility scoring
   */
  private getFallbackFactCheck(content: string): AIResponse {
    const factCheck = {
      content: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
      verdict: 'unverified',
      confidence: 0.3,
      explanation: 'Unable to verify this claim using AI fact-checking services. Please verify manually through reliable sources.',
      sources: [],
      timestamp: new Date().toISOString(),
      fallbackUsed: true
    };
    
    return {
      success: true,
      data: factCheck,
      fallback: true,
      source: 'mock'
    };
  }

  /**
   * Get cached results for common queries
   */
  private getCachedResult(key: string): any {
    // In a real implementation, this would check Redis or database cache
    const commonResults: Record<string, any> = {
      'political_sentiment_general': {
        sentiment: 'mixed',
        confidence: 0.6,
        analysis: 'General political sentiment appears mixed based on recent trends'
      },
      'candidate_analysis_general': {
        summary: 'Standard candidate profile analysis',
        riskLevel: 'medium',
        publicSupport: 'moderate'
      }
    };
    
    return commonResults[key] || null;
  }

  /**
   * Health check for AI services
   */
  async healthCheck(): Promise<{ status: string; details: any }> {
    const checks = {
      apiKeyConfigured: !!this.deepSeekKey,
      aiEnabled: !this.aiDisabled,
      environment: process.env.NODE_ENV,
      lastHealthCheck: new Date().toISOString()
    };
    
    const status = checks.apiKeyConfigured && checks.aiEnabled ? 'healthy' : 'degraded';
    
    return {
      status,
      details: checks
    };
  }
}

// Export singleton instance
export const productionAI = new ProductionAIService();
