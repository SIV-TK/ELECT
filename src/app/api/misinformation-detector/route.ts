import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/ai/genkit';
import { MODELS } from '@/ai/models';
import { WebScraper } from '@/lib/web-scraper';
import { KenyaPoliticalDataService } from '@/lib/kenya-political-data';

// Misinformation patterns and indicators
const MISINFORMATION_PATTERNS = {
  'emotional_manipulation': {
    weight: 0.8,
    indicators: ['shocking', 'outrageous', 'you won\'t believe', 'must see', 'breaking', 'urgent']
  },
  'lack_of_sources': {
    weight: 0.7,
    indicators: ['according to sources', 'insider reports', 'anonymous sources', 'we have learned']
  },
  'sensational_language': {
    weight: 0.6,
    indicators: ['scandal', 'explosive', 'bombshell', 'devastating', 'shocking revelation']
  },
  'unverified_claims': {
    weight: 0.9,
    indicators: ['allegedly', 'reportedly', 'claims suggest', 'sources say', 'unconfirmed reports']
  },
  'inflammatory_content': {
    weight: 0.85,
    indicators: ['ethnic', 'tribal', 'divisive', 'hate', 'violence', 'destroy', 'enemy']
  }
};

// Reliable source patterns
const RELIABLE_SOURCES = [
  'nation.co.ke',
  'standardmedia.co.ke',
  'the-star.co.ke',
  'kbc.co.ke',
  'capitalfm.co.ke',
  'africanews.com',
  'bbc.com',
  'reuters.com',
  'gov.ke',
  'iebc.or.ke',
  'parliament.go.ke'
];

interface MisinformationAnalysis {
  verificationStatus: 'VERIFIED' | 'PARTIALLY_VERIFIED' | 'DISPUTED' | 'FALSE' | 'UNVERIFIED';
  confidenceScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  indicators: string[];
  counterNarrative: string;
  factCheckSources: string[];
  relatedFactChecks: any[];
  recommendations: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { 
      content,
      source = 'unknown',
      contentType = 'text',
      language = 'en',
      generateCounterNarrative = true,
      confidenceThreshold = 0.7
    } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required for analysis' },
        { status: 400 }
      );
    }

    // Analyze misinformation patterns
    const patternAnalysis = analyzeMisinformationPatterns(content);
    
    // Check against reliable sources
    const sourceReliability = assessSourceReliability(source);
    
    // Perform fact-checking against known data
    const factCheckResults = await performFactCheck(content);
    
    // Generate AI-powered verification
    const aiVerification = await performAIVerification(content, language);
    
    // Generate counter-narrative if requested
    const counterNarrative = generateCounterNarrative ? 
      await generateCounterNarrative(content, factCheckResults, language) : '';

    // Calculate final scores and status
    const analysis = calculateFinalAnalysis(
      patternAnalysis, 
      sourceReliability, 
      factCheckResults, 
      aiVerification,
      confidenceThreshold
    );

    // Add counter-narrative to analysis
    analysis.counterNarrative = counterNarrative;

    // Generate recommendations
    analysis.recommendations = generateRecommendations(analysis, content);

    return NextResponse.json({
      success: true,
      data: {
        analysis,
        originalContent: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
        source: source,
        timestamp: new Date().toISOString(),
        language: language
      }
    });

  } catch (error) {
    console.error('Misinformation detection error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Misinformation detection service temporarily unavailable',
      fallbackMessage: 'Please verify information through official government sources'
    }, { status: 500 });
  }
}

function analyzeMisinformationPatterns(content: string): any {
  const analysis = {
    emotionalManipulation: 0,
    lackOfSources: 0,
    sensationalLanguage: 0,
    unverifiedClaims: 0,
    inflammatoryContent: 0,
    overallPatternScore: 0,
    detectedPatterns: [] as string[]
  };

  const lowerContent = content.toLowerCase();

  Object.entries(MISINFORMATION_PATTERNS).forEach(([pattern, config]) => {
    const matches = config.indicators.filter(indicator => 
      lowerContent.includes(indicator.toLowerCase())
    ).length;

    const score = Math.min((matches / config.indicators.length) * config.weight, 1);

    switch (pattern) {
      case 'emotional_manipulation':
        analysis.emotionalManipulation = score;
        break;
      case 'lack_of_sources':
        analysis.lackOfSources = score;
        break;
      case 'sensational_language':
        analysis.sensationalLanguage = score;
        break;
      case 'unverified_claims':
        analysis.unverifiedClaims = score;
        break;
      case 'inflammatory_content':
        analysis.inflammatoryContent = score;
        break;
    }

    if (score > 0.3) {
      analysis.detectedPatterns.push(pattern);
    }
  });

  // Calculate overall pattern score
  analysis.overallPatternScore = (
    analysis.emotionalManipulation * 0.2 +
    analysis.lackOfSources * 0.25 +
    analysis.sensationalLanguage * 0.15 +
    analysis.unverifiedClaims * 0.3 +
    analysis.inflammatoryContent * 0.1
  );

  return analysis;
}

function assessSourceReliability(source: string): number {
  if (!source || source === 'unknown') return 0.3;

  // Check if source is in reliable sources list
  const isReliable = RELIABLE_SOURCES.some(reliableSource => 
    source.toLowerCase().includes(reliableSource.toLowerCase())
  );

  if (isReliable) return 0.9;

  // Check for common unreliable source patterns
  const unreliablePatterns = [
    'facebook.com',
    'whatsapp',
    'twitter.com',
    'telegram',
    'anonymous',
    'blog',
    'rumor'
  ];

  const isUnreliable = unreliablePatterns.some(pattern => 
    source.toLowerCase().includes(pattern)
  );

  return isUnreliable ? 0.2 : 0.5;
}

async function performFactCheck(content: string): Promise<any> {
  try {
    // Extract key claims from content
    const keyClaims = extractKeyClaims(content);
    
    // Search for contradictory information
    const [newsData, govData] = await Promise.all([
      WebScraper.scrapeKenyanNews(keyClaims.slice(0, 2).join(' ')),
      WebScraper.scrapeGovernmentData(keyClaims.slice(0, 2).join(' '))
    ]);

    const factCheckData = [...newsData, ...govData];
    
    return {
      contradictoryEvidence: factCheckData.filter(item => 
        findContradictions(content, item.content)
      ).slice(0, 3),
      supportingEvidence: factCheckData.filter(item => 
        findSupport(content, item.content)
      ).slice(0, 3),
      relevantSources: factCheckData.map(item => item.source).slice(0, 5)
    };

  } catch (error) {
    console.error('Fact-checking failed:', error);
    return {
      contradictoryEvidence: [],
      supportingEvidence: [],
      relevantSources: []
    };
  }
}

async function performAIVerification(content: string, language: string): Promise<any> {
  try {
    const prompt = `As an expert fact-checker specializing in Kenyan politics, analyze this content for accuracy:

CONTENT TO VERIFY:
"${content.substring(0, 500)}"

Analyze for:
1. Factual accuracy based on known information about Kenya
2. Logical consistency
3. Potential bias or manipulation
4. Missing context

Respond in JSON format:
{
  "likelihood_accurate": 0.0-1.0,
  "key_concerns": ["concern1", "concern2"],
  "missing_context": "what context is missing",
  "verification_notes": "detailed notes",
  "requires_further_verification": true/false
}`;

    const response = await ai.generate({
      model: MODELS.DEEPSEEK_CHAT,
      prompt,
      config: { temperature: 0.1, maxOutputTokens: 400 }
    });

    try {
      return JSON.parse(response.text || '{}');
    } catch {
      return {
        likelihood_accurate: 0.5,
        key_concerns: ['AI analysis failed'],
        missing_context: 'Unable to determine',
        verification_notes: 'Automated analysis unavailable',
        requires_further_verification: true
      };
    }

  } catch (error) {
    console.error('AI verification failed:', error);
    return {
      likelihood_accurate: 0.5,
      key_concerns: ['Verification service unavailable'],
      missing_context: 'Unknown',
      verification_notes: 'Please verify through official sources',
      requires_further_verification: true
    };
  }
}

async function generateCounterNarrative(content: string, factCheckResults: any, language: string): Promise<string> {
  try {
    const languageInstructions = {
      'en': 'Respond in clear English',
      'sw': 'Jibu kwa Kiswahili',
      'ki': 'Respond in Kikuyu',
      'luo': 'Respond in Luo'
    };

    const prompt = `Generate a fact-based counter-narrative to address this potentially misleading content about Kenyan politics:

ORIGINAL CLAIM:
"${content.substring(0, 400)}"

FACT-CHECK EVIDENCE:
Supporting Evidence: ${factCheckResults.supportingEvidence?.map((e: any) => e.content.substring(0, 100)).join('; ') || 'None'}
Contradictory Evidence: ${factCheckResults.contradictoryEvidence?.map((e: any) => e.content.substring(0, 100)).join('; ') || 'None'}

Create a factual, balanced response that:
1. Addresses the main claims
2. Provides accurate information
3. Cites reliable sources
4. Promotes unity and peaceful discourse
5. ${languageInstructions[language as keyof typeof languageInstructions] || 'Respond in English'}

Keep the response under 300 words and focus on facts, not attacking the original content.`;

    const response = await ai.generate({
      model: MODELS.DEEPSEEK_CHAT,
      prompt,
      config: { temperature: 0.3, maxOutputTokens: 400 }
    });

    return response.text || 'Counter-narrative generation failed. Please verify information through official sources.';

  } catch (error) {
    console.error('Counter-narrative generation failed:', error);
    return 'Please verify this information through official government sources and credible news outlets.';
  }
}

function calculateFinalAnalysis(
  patternAnalysis: any, 
  sourceReliability: number, 
  factCheckResults: any, 
  aiVerification: any,
  confidenceThreshold: number
): MisinformationAnalysis {
  
  // Calculate weighted scores
  const patternWeight = 0.3;
  const sourceWeight = 0.25;
  const factCheckWeight = 0.25;
  const aiWeight = 0.2;

  const patternScore = 1 - patternAnalysis.overallPatternScore; // Invert because high pattern score = low credibility
  const factCheckScore = factCheckResults.supportingEvidence?.length > factCheckResults.contradictoryEvidence?.length ? 0.7 : 0.3;
  const aiScore = aiVerification.likelihood_accurate || 0.5;

  const overallScore = (
    patternScore * patternWeight +
    sourceReliability * sourceWeight +
    factCheckScore * factCheckWeight +
    aiScore * aiWeight
  );

  // Determine verification status
  let verificationStatus: MisinformationAnalysis['verificationStatus'];
  if (overallScore >= 0.8) verificationStatus = 'VERIFIED';
  else if (overallScore >= 0.6) verificationStatus = 'PARTIALLY_VERIFIED';
  else if (overallScore >= 0.4) verificationStatus = 'UNVERIFIED';
  else if (overallScore >= 0.2) verificationStatus = 'DISPUTED';
  else verificationStatus = 'FALSE';

  // Determine risk level
  let riskLevel: MisinformationAnalysis['riskLevel'];
  if (patternAnalysis.inflammatoryContent > 0.7 || overallScore < 0.2) riskLevel = 'CRITICAL';
  else if (patternAnalysis.inflammatoryContent > 0.5 || overallScore < 0.4) riskLevel = 'HIGH';
  else if (overallScore < 0.6) riskLevel = 'MEDIUM';
  else riskLevel = 'LOW';

  return {
    verificationStatus,
    confidenceScore: Math.round(overallScore * 100) / 100,
    riskLevel,
    indicators: [
      ...patternAnalysis.detectedPatterns,
      ...aiVerification.key_concerns || []
    ],
    counterNarrative: '', // Will be filled later
    factCheckSources: factCheckResults.relevantSources || [],
    relatedFactChecks: [
      ...factCheckResults.supportingEvidence || [],
      ...factCheckResults.contradictoryEvidence || []
    ],
    recommendations: [] // Will be filled later
  };
}

function generateRecommendations(analysis: MisinformationAnalysis, content: string): string[] {
  const recommendations = [];

  if (analysis.riskLevel === 'CRITICAL') {
    recommendations.push(
      'Do not share this content',
      'Report to platform administrators',
      'Warn others about potential misinformation'
    );
  } else if (analysis.riskLevel === 'HIGH') {
    recommendations.push(
      'Verify through multiple reliable sources',
      'Check official government statements',
      'Be cautious about sharing'
    );
  } else if (analysis.riskLevel === 'MEDIUM') {
    recommendations.push(
      'Cross-reference with credible news sources',
      'Look for official confirmations',
      'Share with fact-check context'
    );
  } else {
    recommendations.push(
      'Content appears reliable but verify independently',
      'Check for updates from official sources'
    );
  }

  // Add general recommendations
  recommendations.push(
    'Promote peaceful dialogue',
    'Encourage fact-based discussions',
    'Support media literacy'
  );

  return recommendations.slice(0, 5);
}

function extractKeyClaims(content: string): string[] {
  // Simple extraction of potential claims
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
  return sentences.slice(0, 3).map(s => s.trim());
}

function findContradictions(originalContent: string, compareContent: string): boolean {
  // Simple contradiction detection - could be enhanced with NLP
  const originalLower = originalContent.toLowerCase();
  const compareLower = compareContent.toLowerCase();
  
  // Look for direct contradictory statements
  const contradictoryPairs = [
    ['said', 'did not say'],
    ['confirmed', 'denied'],
    ['approved', 'rejected'],
    ['increased', 'decreased'],
    ['true', 'false']
  ];

  return contradictoryPairs.some(([word1, word2]) => 
    originalLower.includes(word1) && compareLower.includes(word2)
  );
}

function findSupport(originalContent: string, compareContent: String): boolean {
  // Simple support detection
  const originalWords = originalContent.toLowerCase().split(' ');
  const compareWords = compareContent.toLowerCase().split(' ');
  
  const commonWords = originalWords.filter(word => 
    word.length > 4 && compareWords.includes(word)
  );

  return commonWords.length > 3;
}

export async function GET() {
  return NextResponse.json({
    message: 'Enhanced Misinformation Detection System',
    features: [
      'Pattern-based misinformation detection',
      'Source reliability assessment',
      'AI-powered fact verification',
      'Counter-narrative generation',
      'Multi-language support',
      'Risk level assessment'
    ],
    verificationStatuses: ['VERIFIED', 'PARTIALLY_VERIFIED', 'DISPUTED', 'FALSE', 'UNVERIFIED'],
    riskLevels: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    supportedLanguages: ['en', 'sw', 'ki', 'luo']
  });
}
