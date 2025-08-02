import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/ai/genkit';
import { MODELS } from '@/ai/models';
import { WebScraper } from '@/lib/web-scraper';
import { KenyaPoliticalDataService } from '@/lib/kenya-political-data';

// Crisis indicators and their weights
const CRISIS_INDICATORS = {
  'violence_keywords': {
    weight: 0.9,
    keywords: ['violence', 'clash', 'conflict', 'attack', 'riot', 'protest', 'unrest', 'ethnic tension', 'demonstration']
  },
  'political_tension': {
    weight: 0.8,
    keywords: ['dispute', 'disagreement', 'opposition', 'boycott', 'walkout', 'deadlock', 'crisis', 'tension']
  },
  'economic_stress': {
    weight: 0.7,
    keywords: ['strike', 'unemployment', 'inflation', 'poverty', 'economic hardship', 'cost of living']
  },
  'electoral_issues': {
    weight: 0.85,
    keywords: ['election dispute', 'voter fraud', 'irregularities', 'rigging', 'ballot', 'electoral violence']
  },
  'government_instability': {
    weight: 0.75,
    keywords: ['impeachment', 'resignation', 'no confidence', 'coalition breakdown', 'cabinet reshuffle']
  }
};

// County risk profiles based on historical data
const COUNTY_RISK_PROFILES: Record<string, number> = {
  'Nairobi': 0.7,
  'Mombasa': 0.6,
  'Kisumu': 0.65,
  'Nakuru': 0.6,
  'Turkana': 0.8,
  'Marsabit': 0.75,
  'Mandera': 0.8,
  'Wajir': 0.75,
  'Garissa': 0.7,
  'Tana River': 0.7,
  'Lamu': 0.65,
  'Isiolo': 0.6,
  'Samburu': 0.65,
  'West Pokot': 0.7,
  'Baringo': 0.65,
  'Laikipia': 0.6,
  // Add more counties with their historical risk levels
};

interface CrisisAlert {
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  score: number;
  location: string;
  indicators: string[];
  sources: string[];
  recommendations: string[];
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    const { 
      county = null,
      timeframe = '24h',
      includePreventiveMeasures = true
    } = await request.json();

    // Scrape recent political data
    const [newsData, socialData, govData] = await Promise.all([
      WebScraper.scrapeKenyanNews('political crisis kenya conflict'),
      WebScraper.scrapeSocialMedia('kenya politics tension conflict'),
      WebScraper.scrapeGovernmentData('security alert kenya')
    ]);

    const allData = [...newsData, ...socialData, ...govData];

    // Analyze crisis indicators
    const crisisAnalysis = analyzeCrisisIndicators(allData);
    
    // Generate county-specific alerts
    const countyAlerts = county ? 
      [await generateCountyAlert(county, allData, crisisAnalysis)] :
      await generateNationalAlerts(allData, crisisAnalysis);

    // Get AI-powered risk assessment
    const aiRiskAssessment = await getAIRiskAssessment(allData, crisisAnalysis);

    // Generate preventive recommendations
    const preventiveMeasures = includePreventiveMeasures ? 
      generatePreventiveMeasures(crisisAnalysis, county) : [];

    return NextResponse.json({
      success: true,
      data: {
        alerts: countyAlerts,
        nationalRiskLevel: calculateNationalRiskLevel(crisisAnalysis),
        aiAssessment: aiRiskAssessment,
        preventiveMeasures: preventiveMeasures,
        dataFreshness: new Date().toISOString(),
        sourceCount: allData.length,
        monitoringActive: true
      }
    });

  } catch (error) {
    console.error('Crisis early warning system error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Crisis monitoring system temporarily unavailable',
      fallbackMessage: 'Please monitor official government channels for security updates'
    }, { status: 500 });
  }
}

function analyzeCrisisIndicators(data: any[]): any {
  const analysis = {
    violenceScore: 0,
    politicalTensionScore: 0,
    economicStressScore: 0,
    electoralIssuesScore: 0,
    governmentInstabilityScore: 0,
    overallScore: 0,
    triggeredIndicators: [] as string[],
    regionalHotspots: [] as string[]
  };

  const combinedText = data.map(item => item.content).join(' ').toLowerCase();

  // Check each crisis indicator
  Object.entries(CRISIS_INDICATORS).forEach(([indicator, config]) => {
    const keywordMatches = config.keywords.filter(keyword => 
      combinedText.includes(keyword.toLowerCase())
    ).length;

    const score = Math.min((keywordMatches / config.keywords.length) * config.weight, 1);
    
    switch (indicator) {
      case 'violence_keywords':
        analysis.violenceScore = score;
        break;
      case 'political_tension':
        analysis.politicalTensionScore = score;
        break;
      case 'economic_stress':
        analysis.economicStressScore = score;
        break;
      case 'electoral_issues':
        analysis.electoralIssuesScore = score;
        break;
      case 'government_instability':
        analysis.governmentInstabilityScore = score;
        break;
    }

    if (score > 0.5) {
      analysis.triggeredIndicators.push(indicator);
    }
  });

  // Calculate overall score
  analysis.overallScore = (
    analysis.violenceScore * 0.3 +
    analysis.politicalTensionScore * 0.25 +
    analysis.economicStressScore * 0.15 +
    analysis.electoralIssuesScore * 0.2 +
    analysis.governmentInstabilityScore * 0.1
  );

  // Identify regional hotspots
  analysis.regionalHotspots = identifyRegionalHotspots(data);

  return analysis;
}

async function generateCountyAlert(county: string, data: any[], analysis: any): Promise<CrisisAlert> {
  const countyRisk = COUNTY_RISK_PROFILES[county] || 0.5;
  const adjustedScore = Math.min(analysis.overallScore * (1 + countyRisk), 1);

  const level = adjustedScore > 0.8 ? 'CRITICAL' :
                adjustedScore > 0.6 ? 'HIGH' :
                adjustedScore > 0.4 ? 'MEDIUM' : 'LOW';

  const countySpecificData = data.filter(item => 
    item.content.toLowerCase().includes(county.toLowerCase())
  );

  return {
    level,
    score: Math.round(adjustedScore * 100) / 100,
    location: `${county} County`,
    indicators: analysis.triggeredIndicators,
    sources: countySpecificData.map(item => item.source).slice(0, 5),
    recommendations: generateCountyRecommendations(level, county, analysis),
    timestamp: new Date().toISOString()
  };
}

async function generateNationalAlerts(data: any[], analysis: any): Promise<CrisisAlert[]> {
  const alerts: CrisisAlert[] = [];

  // Generate alerts for high-risk counties mentioned in data
  const mentionedCounties = new Set<string>();
  
  data.forEach(item => {
    Object.keys(COUNTY_RISK_PROFILES).forEach(county => {
      if (item.content.toLowerCase().includes(county.toLowerCase())) {
        mentionedCounties.add(county);
      }
    });
  });

  // Generate alerts for top 5 mentioned counties or all if less than 5
  const countiesToAlert = Array.from(mentionedCounties).slice(0, 5);
  
  for (const county of countiesToAlert) {
    const alert = await generateCountyAlert(county, data, analysis);
    alerts.push(alert);
  }

  // Add national-level alert if overall score is high
  if (analysis.overallScore > 0.5) {
    alerts.unshift({
      level: analysis.overallScore > 0.8 ? 'CRITICAL' :
             analysis.overallScore > 0.6 ? 'HIGH' : 'MEDIUM',
      score: Math.round(analysis.overallScore * 100) / 100,
      location: 'National',
      indicators: analysis.triggeredIndicators,
      sources: data.map(item => item.source).slice(0, 10),
      recommendations: generateNationalRecommendations(analysis),
      timestamp: new Date().toISOString()
    });
  }

  return alerts;
}

async function getAIRiskAssessment(data: any[], analysis: any): Promise<any> {
  try {
    const contextData = data.slice(0, 10).map(item => 
      `${item.source}: ${item.content.substring(0, 200)}`
    ).join('\n');

    const prompt = `Analyze the following recent political data from Kenya for crisis risk assessment:

CRISIS INDICATORS DETECTED:
- Violence Score: ${analysis.violenceScore}
- Political Tension Score: ${analysis.politicalTensionScore}
- Economic Stress Score: ${analysis.economicStressScore}
- Electoral Issues Score: ${analysis.electoralIssuesScore}
- Government Instability Score: ${analysis.governmentInstabilityScore}
- Overall Risk Score: ${analysis.overallScore}

RECENT DATA:
${contextData}

Provide a comprehensive risk assessment in JSON format:
{
  "riskLevel": "LOW|MEDIUM|HIGH|CRITICAL",
  "keyThreats": ["threat1", "threat2"],
  "timeframe": "expected timeframe for potential escalation",
  "confidence": 0.0-1.0,
  "summary": "brief assessment summary",
  "earlyWarningSignsToWatch": ["sign1", "sign2"]
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
        riskLevel: analysis.overallScore > 0.7 ? 'HIGH' : 'MEDIUM',
        keyThreats: analysis.triggeredIndicators,
        timeframe: '24-72 hours',
        confidence: 0.7,
        summary: 'AI analysis temporarily unavailable, using automated assessment',
        earlyWarningSignsToWatch: ['Increased social media activity', 'Political statements']
      };
    }

  } catch (error) {
    console.error('AI risk assessment failed:', error);
    return {
      riskLevel: 'MEDIUM',
      keyThreats: ['Data analysis error'],
      timeframe: 'Unknown',
      confidence: 0.5,
      summary: 'AI assessment unavailable',
      earlyWarningSignsToWatch: ['Monitor official channels']
    };
  }
}

function calculateNationalRiskLevel(analysis: any): string {
  if (analysis.overallScore > 0.8) return 'CRITICAL';
  if (analysis.overallScore > 0.6) return 'HIGH';
  if (analysis.overallScore > 0.4) return 'MEDIUM';
  return 'LOW';
}

function identifyRegionalHotspots(data: any[]): string[] {
  const locationMentions: Record<string, number> = {};

  data.forEach(item => {
    Object.keys(COUNTY_RISK_PROFILES).forEach(county => {
      if (item.content.toLowerCase().includes(county.toLowerCase())) {
        locationMentions[county] = (locationMentions[county] || 0) + 1;
      }
    });
  });

  return Object.entries(locationMentions)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([county]) => county);
}

function generateCountyRecommendations(level: string, county: string, analysis: any): string[] {
  const baseRecommendations = [
    'Monitor local news and official county communications',
    'Avoid large gatherings and protests',
    'Keep emergency contacts readily available'
  ];

  const levelSpecificRecommendations = {
    'CRITICAL': [
      'Consider avoiding non-essential travel',
      'Stock up on essential supplies',
      'Stay in close contact with family and friends',
      'Follow official evacuation procedures if issued'
    ],
    'HIGH': [
      'Limit movement to essential activities only',
      'Keep informed through official channels',
      'Prepare emergency supplies'
    ],
    'MEDIUM': [
      'Stay alert to developing situations',
      'Plan alternative routes for daily activities'
    ],
    'LOW': [
      'Continue normal activities with awareness',
      'Stay informed of political developments'
    ]
  };

  return [...baseRecommendations, ...(levelSpecificRecommendations[level as keyof typeof levelSpecificRecommendations] || [])];
}

function generateNationalRecommendations(analysis: any): string[] {
  return [
    'Monitor official government communications',
    'Follow credible news sources for updates',
    'Avoid spreading unverified information',
    'Report suspicious activities to authorities',
    'Maintain inter-community dialogue and peace',
    'Support conflict resolution initiatives'
  ];
}

function generatePreventiveMeasures(analysis: any, county: string | null): string[] {
  const measures = [
    'Community dialogue sessions',
    'Peace building workshops',
    'Youth engagement programs',
    'Inter-ethnic cultural exchanges',
    'Economic empowerment initiatives',
    'Conflict mediation training',
    'Early warning committee establishment',
    'Religious and traditional leader engagement'
  ];

  if (analysis.economicStressScore > 0.6) {
    measures.push('Job creation programs', 'Economic relief initiatives');
  }

  if (analysis.politicalTensionScore > 0.6) {
    measures.push('Political dialogue forums', 'Civic education programs');
  }

  return measures.slice(0, 6);
}

export async function GET() {
  return NextResponse.json({
    message: 'Political Crisis Early Warning System',
    features: [
      'Real-time crisis monitoring',
      'County-specific risk assessment',
      'AI-powered threat analysis',
      'Preventive measure recommendations',
      'Multi-source data integration'
    ],
    riskLevels: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    monitoredIndicators: Object.keys(CRISIS_INDICATORS)
  });
}
