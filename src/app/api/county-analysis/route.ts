import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/ai/genkit';
import { MODELS } from '@/ai/models';
import { WebScraper } from '@/lib/web-scraper';
import { KenyaPoliticalDataService } from '@/lib/kenya-political-data';

// Kenya's 47 counties with metadata
const KENYA_COUNTIES = {
  'Baringo': { region: 'Rift Valley', population: 666763, capital: 'Kabarnet' },
  'Bomet': { region: 'Rift Valley', population: 875689, capital: 'Bomet' },
  'Bungoma': { region: 'Western', population: 1670570, capital: 'Bungoma' },
  'Busia': { region: 'Western', population: 893681, capital: 'Busia' },
  'Elgeyo-Marakwet': { region: 'Rift Valley', population: 454480, capital: 'Iten' },
  'Embu': { region: 'Eastern', population: 608599, capital: 'Embu' },
  'Garissa': { region: 'North Eastern', population: 841353, capital: 'Garissa' },
  'Homa Bay': { region: 'Nyanza', population: 1131950, capital: 'Homa Bay' },
  'Isiolo': { region: 'Eastern', population: 268002, capital: 'Isiolo' },
  'Kajiado': { region: 'Rift Valley', population: 1117840, capital: 'Kajiado' },
  'Kakamega': { region: 'Western', population: 1867579, capital: 'Kakamega' },
  'Kericho': { region: 'Rift Valley', population: 901777, capital: 'Kericho' },
  'Kiambu': { region: 'Central', population: 2417735, capital: 'Kiambu' },
  'Kilifi': { region: 'Coast', population: 1453787, capital: 'Kilifi' },
  'Kirinyaga': { region: 'Central', population: 610411, capital: 'Kerugoya' },
  'Kisii': { region: 'Nyanza', population: 1266860, capital: 'Kisii' },
  'Kisumu': { region: 'Nyanza', population: 1155574, capital: 'Kisumu' },
  'Kitui': { region: 'Eastern', population: 1136187, capital: 'Kitui' },
  'Kwale': { region: 'Coast', population: 866820, capital: 'Kwale' },
  'Laikipia': { region: 'Central', population: 518560, capital: 'Nanyuki' },
  'Lamu': { region: 'Coast', population: 143920, capital: 'Lamu' },
  'Machakos': { region: 'Eastern', population: 1421932, capital: 'Machakos' },
  'Makueni': { region: 'Eastern', population: 987653, capital: 'Wote' },
  'Mandera': { region: 'North Eastern', population: 1025756, capital: 'Mandera' },
  'Marsabit': { region: 'Northern', population: 459785, capital: 'Marsabit' },
  'Meru': { region: 'Eastern', population: 1545714, capital: 'Meru' },
  'Migori': { region: 'Nyanza', population: 1116436, capital: 'Migori' },
  'Mombasa': { region: 'Coast', population: 1208333, capital: 'Mombasa' },
  'Murang\'a': { region: 'Central', population: 1056640, capital: 'Murang\'a' },
  'Nairobi': { region: 'Nairobi', population: 4397073, capital: 'Nairobi' },
  'Nakuru': { region: 'Rift Valley', population: 2162202, capital: 'Nakuru' },
  'Nandi': { region: 'Rift Valley', population: 885711, capital: 'Kapsabet' },
  'Narok': { region: 'Rift Valley', population: 1157873, capital: 'Narok' },
  'Nyamira': { region: 'Nyanza', population: 605576, capital: 'Nyamira' },
  'Nyandarua': { region: 'Central', population: 638289, capital: 'Ol Kalou' },
  'Nyeri': { region: 'Central', population: 759164, capital: 'Nyeri' },
  'Samburu': { region: 'Rift Valley', population: 310327, capital: 'Maralal' },
  'Siaya': { region: 'Nyanza', population: 993183, capital: 'Siaya' },
  'Taita-Taveta': { region: 'Coast', population: 340671, capital: 'Voi' },
  'Tana River': { region: 'Coast', population: 315943, capital: 'Hola' },
  'Tharaka-Nithi': { region: 'Eastern', population: 393177, capital: 'Kathwana' },
  'Trans Nzoia': { region: 'Rift Valley', population: 990341, capital: 'Kitale' },
  'Turkana': { region: 'Rift Valley', population: 926976, capital: 'Lodwar' },
  'Uasin Gishu': { region: 'Rift Valley', population: 1163186, capital: 'Eldoret' },
  'Vihiga': { region: 'Western', population: 590013, capital: 'Vihiga' },
  'Wajir': { region: 'North Eastern', population: 781263, capital: 'Wajir' },
  'West Pokot': { region: 'Rift Valley', population: 621241, capital: 'Kapenguria' }
};

// Economic indicators by region
const REGIONAL_ECONOMIC_DATA = {
  'Nairobi': { gdp_contribution: 27.5, unemployment_rate: 11.5, poverty_rate: 18.7 },
  'Central': { gdp_contribution: 15.2, unemployment_rate: 8.2, poverty_rate: 20.4 },
  'Rift Valley': { gdp_contribution: 20.1, unemployment_rate: 12.8, poverty_rate: 35.6 },
  'Eastern': { gdp_contribution: 12.3, unemployment_rate: 15.2, poverty_rate: 45.2 },
  'Coast': { gdp_contribution: 8.4, unemployment_rate: 17.8, poverty_rate: 41.7 },
  'Western': { gdp_contribution: 9.1, unemployment_rate: 19.2, poverty_rate: 52.4 },
  'Nyanza': { gdp_contribution: 7.8, unemployment_rate: 21.5, poverty_rate: 55.1 },
  'North Eastern': { gdp_contribution: 1.2, unemployment_rate: 35.4, poverty_rate: 68.8 },
  'Northern': { gdp_contribution: 0.8, unemployment_rate: 42.1, poverty_rate: 72.3 }
};

interface CountyAnalysis {
  county: string;
  region: string;
  demographics: any;
  politicalLandscape: any;
  economicIndicators: any;
  keyIssues: string[];
  currentGovernance: any;
  sentimentAnalysis: any;
  developmentProjects: any[];
  recommendations: string[];
  riskAssessment: any;
}

export async function POST(request: NextRequest) {
  try {
    const { 
      county,
      analysisType = 'comprehensive', // comprehensive, political, economic, social
      includeComparisons = true,
      timeframe = '12months'
    } = await request.json();

    if (!county) {
      return NextResponse.json(
        { error: 'County name is required' },
        { status: 400 }
      );
    }

    // Validate county exists
    if (!KENYA_COUNTIES[county as keyof typeof KENYA_COUNTIES]) {
      return NextResponse.json(
        { error: 'Invalid county name. Please provide a valid Kenyan county name.' },
        { status: 400 }
      );
    }

    // Get county-specific data
    const [newsData, govData, politicalData] = await Promise.all([
      WebScraper.scrapeKenyanNews(`${county} county politics governance`),
      WebScraper.scrapeGovernmentData(`${county} county development projects`),
      KenyaPoliticalDataService.fetchPoliticalSentiment(`${county} county politics`)
    ]);

    // Perform comprehensive county analysis
    const analysis = await performCountyAnalysis(
      county,
      { newsData, govData, politicalData },
      analysisType
    );

    // Add comparisons if requested
    // if (includeComparisons) {
    //   analysis.regionalComparison = await generateRegionalComparison(county, analysis);
    //   analysis.similarCounties = findSimilarCounties(county);
    // }

    return NextResponse.json({
      success: true,
      data: analysis,
      metadata: {
        analysisType,
        dataFreshness: new Date().toISOString(),
        sourceCount: newsData.length + govData.length + politicalData.length,
        includeComparisons
      }
    });

  } catch (error) {
    console.error('County-specific analysis error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'County analysis service temporarily unavailable',
      fallbackMessage: 'Please check official county government websites for local information'
    }, { status: 500 });
  }
}

async function performCountyAnalysis(county: string, data: any, analysisType: string): Promise<CountyAnalysis> {
  const countyInfo = KENYA_COUNTIES[county as keyof typeof KENYA_COUNTIES];
  const { newsData, govData, politicalData } = data;

  // Basic county information
  const demographics = {
    population: countyInfo.population,
    capital: countyInfo.capital,
    region: countyInfo.region,
    economicData: REGIONAL_ECONOMIC_DATA[countyInfo.region as keyof typeof REGIONAL_ECONOMIC_DATA]
  };

  // Analyze political landscape
  const politicalLandscape = await analyzePoliticalLandscape(county, newsData, politicalData);

  // Extract key issues from news and government data
  const keyIssues = extractKeyIssues([...newsData, ...govData]);

  // Analyze sentiment
  const sentimentAnalysis = analyzeSentiment(politicalData, newsData);

  // Extract development projects
  const developmentProjects = extractDevelopmentProjects(govData);

  // Generate AI-powered analysis
  const aiAnalysis = await generateAICountyAnalysis(county, data, analysisType);

  // Assess risks and challenges
  const riskAssessment = assessCountyRisks(county, keyIssues, sentimentAnalysis);

  // Generate recommendations
  const recommendations = generateCountyRecommendations(county, keyIssues, riskAssessment);

  return {
    county,
    region: countyInfo.region,
    demographics,
    politicalLandscape,
    economicIndicators: demographics.economicData,
    keyIssues,
    currentGovernance: aiAnalysis.governance || {},
    sentimentAnalysis,
    developmentProjects,
    recommendations,
    riskAssessment
  };
}

async function analyzePoliticalLandscape(county: string, newsData: any[], politicalData: any[]): Promise<any> {
  const combinedData = [...newsData, ...politicalData];
  
  // Extract political figures mentioned
  const politicalFigures = extractPoliticalFigures(combinedData, county);
  
  // Analyze party affiliations and coalitions
  const partyDynamics = analyzePartyDynamics(combinedData);
  
  // Recent political events
  const recentEvents = combinedData
    .filter(item => item.timestamp && new Date(item.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
    .slice(0, 5);

  return {
    dominantParties: partyDynamics.parties,
    keyPoliticalFigures: politicalFigures,
    recentPoliticalEvents: recentEvents,
    politicalStability: calculatePoliticalStability(combinedData),
    voterTurnoutTrends: estimateVoterEngagement(combinedData)
  };
}

function extractKeyIssues(data: any[]): string[] {
  const issueKeywords = {
    'healthcare': ['hospital', 'clinic', 'medical', 'health', 'treatment', 'medicine'],
    'education': ['school', 'teacher', 'student', 'education', 'university', 'learning'],
    'infrastructure': ['road', 'bridge', 'water', 'electricity', 'construction', 'development'],
    'agriculture': ['farming', 'crops', 'livestock', 'irrigation', 'agricultural', 'farmers'],
    'security': ['police', 'crime', 'safety', 'security', 'violence', 'theft'],
    'corruption': ['corruption', 'fraud', 'mismanagement', 'embezzlement', 'transparency'],
    'unemployment': ['jobs', 'employment', 'youth', 'unemployment', 'opportunities'],
    'environment': ['environment', 'pollution', 'forest', 'conservation', 'climate']
  };

  const issueCounts: Record<string, number> = {};
  const combinedText = data.map(item => item.content || '').join(' ').toLowerCase();

  Object.entries(issueKeywords).forEach(([issue, keywords]) => {
    const count = keywords.reduce((acc, keyword) => {
      const regex = new RegExp(keyword, 'gi');
      const matches = combinedText.match(regex);
      return acc + (matches ? matches.length : 0);
    }, 0);
    issueCounts[issue] = count;
  });

  return Object.entries(issueCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 6)
    .map(([issue]) => issue);
}

function analyzeSentiment(politicalData: any[], newsData: any[]): any {
  const allData = [...politicalData, ...newsData];
  
  if (allData.length === 0) {
    return {
      overall: 'neutral',
      score: 0,
      positiveIndicators: [],
      negativeIndicators: [],
      confidence: 0.3
    };
  }

  const positiveKeywords = ['development', 'progress', 'improvement', 'success', 'growth', 'achievement'];
  const negativeKeywords = ['problem', 'crisis', 'failure', 'corruption', 'decline', 'protest'];

  let positiveCount = 0;
  let negativeCount = 0;

  const combinedText = allData.map(item => item.content || '').join(' ').toLowerCase();

  positiveKeywords.forEach(keyword => {
    const matches = combinedText.match(new RegExp(keyword, 'gi'));
    positiveCount += matches ? matches.length : 0;
  });

  negativeKeywords.forEach(keyword => {
    const matches = combinedText.match(new RegExp(keyword, 'gi'));
    negativeCount += matches ? matches.length : 0;
  });

  const totalMentions = positiveCount + negativeCount;
  const score = totalMentions > 0 ? (positiveCount - negativeCount) / totalMentions : 0;

  return {
    overall: score > 0.2 ? 'positive' : score < -0.2 ? 'negative' : 'neutral',
    score: Math.round(score * 100) / 100,
    positiveIndicators: positiveKeywords.filter(keyword => 
      combinedText.includes(keyword)
    ).slice(0, 3),
    negativeIndicators: negativeKeywords.filter(keyword => 
      combinedText.includes(keyword)
    ).slice(0, 3),
    confidence: Math.min(totalMentions / 10, 1)
  };
}

function extractDevelopmentProjects(govData: any[]): any[] {
  return govData
    .filter(item => {
      const content = (item.content || '').toLowerCase();
      return content.includes('project') || content.includes('development') || 
             content.includes('construction') || content.includes('initiative');
    })
    .slice(0, 5)
    .map(item => ({
      title: item.title || 'Development Project',
      description: item.content?.substring(0, 200) || '',
      source: item.source,
      timestamp: item.timestamp
    }));
}

async function generateAICountyAnalysis(county: string, data: any, analysisType: string): Promise<any> {
  try {
    const contextData = [
      ...data.newsData.slice(0, 3),
      ...data.govData.slice(0, 3),
      ...data.politicalData.slice(0, 3)
    ].map(item => item.content?.substring(0, 150)).join('\n');

    const prompt = `Analyze ${county} County governance and political situation based on this recent data:

${contextData}

County Information:
- Region: ${KENYA_COUNTIES[county as keyof typeof KENYA_COUNTIES]?.region}
- Capital: ${KENYA_COUNTIES[county as keyof typeof KENYA_COUNTIES]?.capital}
- Population: ${KENYA_COUNTIES[county as keyof typeof KENYA_COUNTIES]?.population?.toLocaleString()}

Provide analysis in JSON format:
{
  "governance": {
    "leadership_effectiveness": "high|medium|low",
    "service_delivery": "excellent|good|fair|poor",
    "transparency_level": "high|medium|low"
  },
  "key_achievements": ["achievement1", "achievement2"],
  "main_challenges": ["challenge1", "challenge2"],
  "development_priority": "top priority area",
  "political_stability": "stable|somewhat_stable|unstable"
}`;

    const response = await ai.generate({
      model: MODELS.DEEPSEEK_CHAT,
      prompt,
      config: { temperature: 0.2, maxOutputTokens: 500 }
    });

    try {
      return JSON.parse(response.text || '{}');
    } catch {
      return {
        governance: { leadership_effectiveness: 'medium', service_delivery: 'fair', transparency_level: 'medium' },
        key_achievements: ['Development projects ongoing'],
        main_challenges: ['Infrastructure development', 'Service delivery'],
        development_priority: 'Infrastructure',
        political_stability: 'stable'
      };
    }

  } catch (error) {
    console.error('AI county analysis failed:', error);
    return {
      governance: { leadership_effectiveness: 'unknown', service_delivery: 'unknown', transparency_level: 'unknown' },
      key_achievements: [],
      main_challenges: [],
      development_priority: 'Unknown',
      political_stability: 'unknown'
    };
  }
}

function assessCountyRisks(county: string, keyIssues: string[], sentimentAnalysis: any): any {
  const riskFactors = [];
  let overallRisk = 'LOW';

  // Assess based on key issues
  const highRiskIssues = ['corruption', 'security', 'unemployment'];
  const mediumRiskIssues = ['infrastructure', 'healthcare', 'education'];

  const highRiskCount = keyIssues.filter(issue => highRiskIssues.includes(issue)).length;
  const mediumRiskCount = keyIssues.filter(issue => mediumRiskIssues.includes(issue)).length;

  if (highRiskCount >= 2) {
    overallRisk = 'HIGH';
    riskFactors.push('Multiple high-risk issues identified');
  } else if (highRiskCount >= 1 || mediumRiskCount >= 3) {
    overallRisk = 'MEDIUM';
    riskFactors.push('Significant governance challenges');
  }

  // Assess based on sentiment
  if (sentimentAnalysis.overall === 'negative' && sentimentAnalysis.score < -0.5) {
    overallRisk = overallRisk === 'LOW' ? 'MEDIUM' : 'HIGH';
    riskFactors.push('Negative public sentiment');
  }

  return {
    level: overallRisk,
    factors: riskFactors,
    recommendations: generateRiskMitigationRecommendations(overallRisk, keyIssues)
  };
}

function generateCountyRecommendations(county: string, keyIssues: string[], riskAssessment: any): string[] {
  const recommendations = [];

  // Issue-specific recommendations
  if (keyIssues.includes('infrastructure')) {
    recommendations.push('Prioritize road and water infrastructure development');
  }
  if (keyIssues.includes('healthcare')) {
    recommendations.push('Expand healthcare facilities and improve medical services');
  }
  if (keyIssues.includes('education')) {
    recommendations.push('Invest in educational infrastructure and teacher training');
  }
  if (keyIssues.includes('unemployment')) {
    recommendations.push('Create youth employment programs and support SMEs');
  }
  if (keyIssues.includes('corruption')) {
    recommendations.push('Strengthen transparency and accountability mechanisms');
  }

  // General governance recommendations
  recommendations.push('Enhance citizen participation in county governance');
  recommendations.push('Improve inter-governmental coordination');
  recommendations.push('Strengthen public-private partnerships');

  return recommendations.slice(0, 6);
}

function generateRiskMitigationRecommendations(riskLevel: string, keyIssues: string[]): string[] {
  const recommendations = [];

  if (riskLevel === 'HIGH') {
    recommendations.push('Implement emergency governance interventions');
    recommendations.push('Increase oversight and monitoring');
    recommendations.push('Establish crisis management protocols');
  } else if (riskLevel === 'MEDIUM') {
    recommendations.push('Strengthen governance systems');
    recommendations.push('Improve service delivery mechanisms');
    recommendations.push('Enhance community engagement');
  }

  return recommendations;
}

async function generateRegionalComparison(county: string, analysis: CountyAnalysis): Promise<any> {
  const countyInfo = KENYA_COUNTIES[county as keyof typeof KENYA_COUNTIES];
  const regionalCounties = Object.entries(KENYA_COUNTIES)
    .filter(([name, info]) => info.region === countyInfo.region && name !== county)
    .map(([name]) => name);

  return {
    region: countyInfo.region,
    similarCounties: regionalCounties.slice(0, 3),
    regionalAverage: REGIONAL_ECONOMIC_DATA[countyInfo.region as keyof typeof REGIONAL_ECONOMIC_DATA],
    performanceRanking: 'middle', // This would need actual performance data
    uniqueStrengths: analysis.keyIssues.slice(0, 2)
  };
}

function findSimilarCounties(county: string): string[] {
  const countyInfo = KENYA_COUNTIES[county as keyof typeof KENYA_COUNTIES];
  
  return Object.entries(KENYA_COUNTIES)
    .filter(([name, info]) => 
      name !== county && 
      Math.abs(info.population - countyInfo.population) < 200000
    )
    .slice(0, 3)
    .map(([name]) => name);
}

function extractPoliticalFigures(data: any[], county: string): string[] {
  // This would be enhanced with actual political figure database
  const titles = ['governor', 'senator', 'mp', 'mca', 'deputy governor'];
  const figures: Set<string> = new Set();

  data.forEach(item => {
    const content = (item.content || '').toLowerCase();
    titles.forEach(title => {
      if (content.includes(title)) {
        // Extract names near political titles - simplified extraction
        const words = content.split(' ');
        const titleIndex = words.findIndex(word => word.includes(title));
        if (titleIndex >= 0 && titleIndex < words.length - 1) {
          figures.add(`${words[titleIndex + 1]} (${title})`);
        }
      }
    });
  });

  return Array.from(figures).slice(0, 5);
}

function analyzePartyDynamics(data: any[]): any {
  const parties = ['UDA', 'ODM', 'Wiper', 'ANC', 'Ford Kenya', 'Jubilee'];
  const partyCounts: Record<string, number> = {};

  const combinedText = data.map(item => item.content || '').join(' ').toLowerCase();

  parties.forEach(party => {
    const matches = combinedText.match(new RegExp(party.toLowerCase(), 'gi'));
    partyCounts[party] = matches ? matches.length : 0;
  });

  return {
    parties: Object.entries(partyCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([party, mentions]) => ({ party, mentions }))
  };
}

function calculatePoliticalStability(data: any[]): string {
  const instabilityKeywords = ['conflict', 'dispute', 'tension', 'crisis', 'disagreement'];
  const combinedText = data.map(item => item.content || '').join(' ').toLowerCase();
  
  const instabilityCount = instabilityKeywords.reduce((count, keyword) => {
    const matches = combinedText.match(new RegExp(keyword, 'gi'));
    return count + (matches ? matches.length : 0);
  }, 0);

  if (instabilityCount > 10) return 'unstable';
  if (instabilityCount > 5) return 'somewhat_stable';
  return 'stable';
}

function estimateVoterEngagement(data: any[]): string {
  const engagementKeywords = ['voting', 'election', 'participation', 'turnout', 'civic'];
  const combinedText = data.map(item => item.content || '').join(' ').toLowerCase();
  
  const engagementCount = engagementKeywords.reduce((count, keyword) => {
    const matches = combinedText.match(new RegExp(keyword, 'gi'));
    return count + (matches ? matches.length : 0);
  }, 0);

  if (engagementCount > 15) return 'high';
  if (engagementCount > 8) return 'medium';
  return 'low';
}

export async function GET() {
  return NextResponse.json({
    message: 'County-Specific Analysis System',
    features: [
      '47 counties comprehensive analysis',
      'Political landscape assessment',
      'Economic indicators tracking',
      'Development projects monitoring',
      'Risk assessment and recommendations',
      'Regional comparisons',
      'AI-powered governance analysis'
    ],
    supportedCounties: Object.keys(KENYA_COUNTIES),
    analysisTypes: ['comprehensive', 'political', 'economic', 'social'],
    regions: [...new Set(Object.values(KENYA_COUNTIES).map(c => c.region))]
  });
}
