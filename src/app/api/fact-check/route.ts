import { NextRequest, NextResponse } from 'next/server';
import { EnhancedWebScraper } from '@/lib/enhanced-scraper';

interface FactCheckRequest {
  statement: string;
  useRealTimeData?: boolean;
}

interface FactCheckResponse {
  statement: string;
  verdict: 'true' | 'false' | 'misleading' | 'unverified';
  confidence: number;
  explanation: string;
  context: string;
  sources: SourceInfo[];
  relatedClaims: string[];
  realtimeData: RealtimeFactData;
  aiAnalysis: AIFactAnalysis;
  verification: VerificationDetails;
}

interface SourceInfo {
  title: string;
  source: string;
  url?: string;
  publishedDate?: string;
  relevanceScore: number;
  credibilityScore: number;
  summary: string;
}

interface RealtimeFactData {
  relatedNews: any[];
  governmentSources: any[];
  socialSentiment: any;
  statisticalData: any;
  lastUpdated: string;
  dataFreshness: number;
}

interface AIFactAnalysis {
  entityExtraction: {
    politicians: string[];
    policies: string[];
    locations: string[];
    dates: string[];
    organizations: string[];
  };
  claimType: 'statistical' | 'policy' | 'historical' | 'prediction' | 'opinion';
  verificationStrategy: string;
  keyFactors: string[];
  riskAssessment: 'low' | 'medium' | 'high';
}

interface VerificationDetails {
  crossReferencedSources: number;
  governmentVerification: boolean;
  mediaConsensus: 'agree' | 'disagree' | 'mixed' | 'insufficient';
  timeContext: string;
  contradictoryEvidence: string[];
  supportingEvidence: string[];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { statement, useRealTimeData = true }: FactCheckRequest = body;

    // Validate input
    if (!statement || typeof statement !== 'string' || statement.trim().length === 0) {
      return NextResponse.json(
        { error: 'Statement is required and must be a non-empty string' }, 
        { status: 400 }
      );
    }

    if (statement.length > 1000) {
      return NextResponse.json(
        { error: 'Statement too long. Maximum 1000 characters allowed.' }, 
        { status: 400 }
      );
    }

    console.log(`🔍 Starting comprehensive fact-check for: "${statement.substring(0, 100)}..."`);
    
    const factCheckResult = await performEnhancedFactCheck(statement.trim(), useRealTimeData);
    return NextResponse.json(factCheckResult);

  } catch (error) {
    console.error('Fact check error:', error);
    return NextResponse.json(
      { error: 'Internal server error during fact checking' }, 
      { status: 500 }
    );
  }
}

async function performEnhancedFactCheck(statement: string, useRealTimeData: boolean): Promise<FactCheckResponse> {
  try {
    console.log(`🧠 Starting AI entity extraction...`);
    
    // Step 1: AI Entity Extraction and Analysis
    const aiAnalysis = await extractEntitiesAndAnalyze(statement);
    
    // Step 2: Real-time data collection using enhanced scraper
    let realtimeData: RealtimeFactData = {
      relatedNews: [],
      governmentSources: [],
      socialSentiment: {},
      statisticalData: {},
      lastUpdated: new Date().toISOString(),
      dataFreshness: 0
    };

    if (useRealTimeData) {
      console.log(`📰 Collecting real-time data using enhanced scraper...`);
      realtimeData = await collectRealtimeFactData(statement, aiAnalysis);
    }

    // Step 3: Comprehensive AI fact verification with scraped data
    console.log(`🔬 Performing AI fact verification with real-time context...`);
    const verificationResult = await performAIFactVerification(statement, realtimeData, aiAnalysis);

    // Step 4: Cross-reference and validate sources
    console.log(`🔍 Cross-referencing sources and building verification details...`);
    const verificationDetails = await buildVerificationDetails(realtimeData, verificationResult);

    // Step 5: Generate comprehensive response
    const response: FactCheckResponse = {
      statement,
      verdict: verificationResult.verdict,
      confidence: verificationResult.confidence,
      explanation: verificationResult.explanation,
      context: verificationResult.context,
      sources: await buildSourceInfo(realtimeData),
      relatedClaims: verificationResult.relatedClaims,
      realtimeData,
      aiAnalysis,
      verification: verificationDetails
    };

    console.log(`✅ Fact-check completed with verdict: ${response.verdict} (${Math.round(response.confidence * 100)}% confidence)`);
    return response;
    
  } catch (error) {
    console.error('Enhanced fact check failed:', error);
    return generateEnhancedFallbackResponse(statement);
  }
}

// Step 1: AI Entity Extraction and Analysis
async function extractEntitiesAndAnalyze(statement: string): Promise<AIFactAnalysis> {
  try {
    const prompt = `Analyze this Kenyan political statement and extract key information for fact-checking:

Statement: "${statement}"

Provide analysis in JSON format:
{
  "entityExtraction": {
    "politicians": ["names of politicians mentioned"],
    "policies": ["policies or programs mentioned"],
    "locations": ["counties, cities, regions mentioned"],
    "dates": ["dates, years, time periods mentioned"],
    "organizations": ["government bodies, institutions mentioned"]
  },
  "claimType": "statistical|policy|historical|prediction|opinion",
  "verificationStrategy": "describe how to verify this claim",
  "keyFactors": ["key factors that determine truth/falsehood"],
  "riskAssessment": "low|medium|high"
}`;

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        max_tokens: 400
      })
    });

    if (response.ok) {
      const data = await response.json();
      const responseText = data.choices?.[0]?.message?.content;
      
      if (responseText) {
        let jsonText = responseText.trim();
        jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return parsed;
        }
      }
    }
  } catch (error) {
    console.error('Entity extraction failed:', error);
  }

  // Fallback analysis
  return {
    entityExtraction: {
      politicians: [],
      policies: [],
      locations: [],
      dates: [],
      organizations: []
    },
    claimType: 'opinion',
    verificationStrategy: 'General fact-checking approach',
    keyFactors: ['Statement context', 'Source credibility'],
    riskAssessment: 'medium'
  };
}

// Step 2: Real-time Data Collection
async function collectRealtimeFactData(statement: string, aiAnalysis: AIFactAnalysis): Promise<RealtimeFactData> {
  const startTime = Date.now();
  
  // Create search queries based on extracted entities
  const searchQueries = [
    statement.substring(0, 100), // Original statement
    ...aiAnalysis.entityExtraction.politicians,
    ...aiAnalysis.entityExtraction.policies,
    ...aiAnalysis.entityExtraction.locations,
    ...aiAnalysis.entityExtraction.organizations
  ].filter(query => query && query.length > 3);

  console.log(`🔎 Searching for: ${searchQueries.slice(0, 3).join(', ')}...`);

  const realtimeData: RealtimeFactData = {
    relatedNews: [],
    governmentSources: [],
    socialSentiment: {},
    statisticalData: {},
    lastUpdated: new Date().toISOString(),
    dataFreshness: 0
  };

  try {
    // Enhanced scraper for news and government data
    const scrapedData = await EnhancedWebScraper.scrapeAllSources(searchQueries[0]);
    realtimeData.relatedNews = scrapedData.filter(item => item.category === 'news');
    realtimeData.governmentSources = scrapedData.filter(item => item.category === 'government');

    // Additional focused searches for specific entities
    if (aiAnalysis.entityExtraction.politicians.length > 0) {
      const politicianData = await EnhancedWebScraper.scrapeSocialSentiment(
        aiAnalysis.entityExtraction.politicians[0]
      );
      realtimeData.socialSentiment = {
        politician: aiAnalysis.entityExtraction.politicians[0],
        sentimentData: politicianData
      };
    }

    const endTime = Date.now();
    realtimeData.dataFreshness = (endTime - startTime) / 1000; // seconds

    console.log(`📊 Collected ${realtimeData.relatedNews.length} news articles and ${realtimeData.governmentSources.length} government sources`);
    
  } catch (error) {
    console.error('Real-time data collection failed:', error);
  }

  return realtimeData;
}

// Step 3: AI Fact Verification with Real-time Context
async function performAIFactVerification(statement: string, realtimeData: RealtimeFactData, aiAnalysis: AIFactAnalysis) {
  try {
    const contextData = [
      ...realtimeData.relatedNews.slice(0, 5),
      ...realtimeData.governmentSources.slice(0, 3)
    ].map(item => `${item.source}: ${item.title} - ${item.content.substring(0, 200)}`).join('\n');

    const prompt = `You are a comprehensive fact-checker for Kenyan political statements. Analyze this statement against real-time data and provide detailed verification.

STATEMENT TO VERIFY: "${statement}"

REAL-TIME CONTEXT DATA:
${contextData || 'No recent related news found'}

AI ANALYSIS:
- Claim Type: ${aiAnalysis.claimType}
- Key Entities: Politicians: ${aiAnalysis.entityExtraction.politicians.join(', ')} | Policies: ${aiAnalysis.entityExtraction.policies.join(', ')}
- Risk Assessment: ${aiAnalysis.riskAssessment}

VERIFICATION SOURCES:
- News Articles: ${realtimeData.relatedNews.length} recent articles
- Government Sources: ${realtimeData.governmentSources.length} official sources
- Data Freshness: ${realtimeData.dataFreshness} seconds old

Provide comprehensive analysis in JSON format:
{
  "verdict": "true|false|misleading|unverified",
  "confidence": 0.85,
  "explanation": "Detailed explanation based on real-time evidence and context",
  "context": "Current political context and recent developments related to this statement",
  "relatedClaims": ["Related verified/disputed claims"],
  "evidenceSupport": "How real-time data supports or contradicts the statement",
  "timelineRelevance": "How timing affects the statement's accuracy"
}

Guidelines:
- Cross-reference with provided real-time data
- Consider recency of information (fresher data = higher confidence)
- Account for changing political situations
- Provide specific evidence from the scraped sources when available
- Higher confidence when multiple sources corroborate`;

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 600
      })
    });

    if (response.ok) {
      const data = await response.json();
      const responseText = data.choices?.[0]?.message?.content;
      
      if (responseText) {
        let jsonText = responseText.trim();
        jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return parsed;
        }
      }
    }
  } catch (error) {
    console.error('AI fact verification failed:', error);
  }

  // Fallback verification
  return {
    verdict: 'unverified',
    confidence: 0.5,
    explanation: 'Unable to verify with available real-time data',
    context: 'Statement requires additional verification from authoritative sources',
    relatedClaims: [],
    evidenceSupport: 'Insufficient real-time evidence',
    timelineRelevance: 'Current'
  };
}

// Step 4: Build Verification Details
async function buildVerificationDetails(realtimeData: RealtimeFactData, verificationResult: any): Promise<VerificationDetails> {
  const totalSources = realtimeData.relatedNews.length + realtimeData.governmentSources.length;
  const hasGovernmentVerification = realtimeData.governmentSources.length > 0;
  
  // Analyze media consensus
  let mediaConsensus: 'agree' | 'disagree' | 'mixed' | 'insufficient' = 'insufficient';
  if (realtimeData.relatedNews.length >= 3) {
    mediaConsensus = 'mixed'; // Simplified - in real implementation, analyze sentiment
  } else if (realtimeData.relatedNews.length >= 1) {
    mediaConsensus = 'agree'; // Simplified
  }

  return {
    crossReferencedSources: totalSources,
    governmentVerification: hasGovernmentVerification,
    mediaConsensus,
    timeContext: `Analysis based on ${realtimeData.relatedNews.length} recent news sources`,
    contradictoryEvidence: [], // Would be populated by AI analysis
    supportingEvidence: realtimeData.relatedNews.slice(0, 3).map(news => news.title)
  };
}

// Step 5: Build Source Information
async function buildSourceInfo(realtimeData: RealtimeFactData): Promise<SourceInfo[]> {
  const sources: SourceInfo[] = [];
  
  // Add news sources
  realtimeData.relatedNews.slice(0, 5).forEach(news => {
    sources.push({
      title: news.title,
      source: news.source,
      url: news.url,
      publishedDate: news.timestamp,
      relevanceScore: 0.8, // Would be calculated based on content analysis
      credibilityScore: getSourceCredibilityScore(news.source),
      summary: news.content.substring(0, 150) + '...'
    });
  });

  // Add government sources
  realtimeData.governmentSources.slice(0, 3).forEach(gov => {
    sources.push({
      title: gov.title,
      source: gov.source,
      url: gov.url,
      publishedDate: gov.timestamp,
      relevanceScore: 0.9, // Government sources highly relevant
      credibilityScore: 0.95, // Government sources highly credible
      summary: gov.content.substring(0, 150) + '...'
    });
  });

  return sources;
}

// Helper function to determine source credibility
function getSourceCredibilityScore(sourceName: string): number {
  const credibilityScores: Record<string, number> = {
    'Daily Nation': 0.85,
    'BBC Kenya': 0.95,
    'Capital FM': 0.80,
    'Citizen Digital': 0.82,
    'Kenya News Agency': 0.90,
    'State House Kenya': 0.95,
    'IEBC': 0.95,
    'Tuko News': 0.70
  };
  
  return credibilityScores[sourceName] || 0.75;
}

// Enhanced fallback response
function generateEnhancedFallbackResponse(statement: string): FactCheckResponse {
  return {
    statement,
    verdict: 'unverified',
    confidence: 0.5,
    explanation: 'Unable to verify this statement with available real-time information. This may be due to limited recent coverage or the need for specialized verification.',
    context: 'This statement requires verification from authoritative Kenyan political sources. Consider checking official government websites, credible news outlets, and verified social media accounts.',
    sources: [
      {
        title: 'Official Government Sources Recommended',
        source: 'Government Verification',
        relevanceScore: 0.8,
        credibilityScore: 0.9,
        summary: 'For official statements and policy information, check government websites and press releases.'
      },
      {
        title: 'Credible News Outlets Recommended',
        source: 'Media Verification',
        relevanceScore: 0.7,
        credibilityScore: 0.8,
        summary: 'Cross-reference with multiple established Kenyan news organizations for comprehensive coverage.'
      }
    ],
    relatedClaims: ['Political statements require verification', 'Check multiple sources', 'Consider statement context and timing'],
    realtimeData: {
      relatedNews: [],
      governmentSources: [],
      socialSentiment: {},
      statisticalData: {},
      lastUpdated: new Date().toISOString(),
      dataFreshness: 0
    },
    aiAnalysis: {
      entityExtraction: {
        politicians: [],
        policies: [],
        locations: [],
        dates: [],
        organizations: []
      },
      claimType: 'opinion',
      verificationStrategy: 'General fact-checking with real-time data',
      keyFactors: ['Statement context', 'Source credibility', 'Recent developments'],
      riskAssessment: 'medium'
    },
    verification: {
      crossReferencedSources: 0,
      governmentVerification: false,
      mediaConsensus: 'insufficient',
      timeContext: 'No recent data available',
      contradictoryEvidence: [],
      supportingEvidence: []
    }
  };
}

export async function GET() {
  return NextResponse.json({
    message: 'Enhanced Fact Check API with Real-time Data',
    description: 'AI-powered fact checking for Kenyan political statements using real-time web scraping',
    version: '2.0',
    features: [
      'Real-time data collection from Kenyan news sources',
      'Government source verification',
      'AI entity extraction and analysis',
      'Comprehensive source credibility scoring',
      'Cross-referenced verification details',
      'Timeline-aware fact checking'
    ],
    usage: {
      method: 'POST',
      body: {
        statement: 'Political statement to fact-check (required, max 1000 chars)',
        useRealTimeData: 'Enable real-time data collection (optional, default: true)'
      }
    },
    verdicts: {
      true: 'Statement is factually accurate based on real-time evidence',
      false: 'Statement is demonstrably incorrect with contradicting evidence',
      misleading: 'Statement is partially true but lacks context or is misrepresented',
      unverified: 'Statement cannot be confirmed with available real-time information'
    },
    dataSources: [
      'BBC Kenya', 'Daily Nation', 'Capital FM', 'Citizen Digital',
      'Kenya News Agency', 'State House Kenya', 'IEBC', 'Tuko News'
    ]
  });
}