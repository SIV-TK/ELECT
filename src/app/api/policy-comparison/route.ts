import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/ai/genkit';
import { MODELS } from '@/ai/models';
import { WebScraper } from '@/lib/web-scraper';
import { KenyaPoliticalDataService } from '@/lib/kenya-political-data';

// Kenya's major political parties and their common policy areas
const KENYAN_POLITICAL_PARTIES = {
  'UDA': { name: 'United Democratic Alliance', leader: 'William Ruto', coalition: 'Kenya Kwanza' },
  'ODM': { name: 'Orange Democratic Movement', leader: 'Raila Odinga', coalition: 'Azimio' },
  'Wiper': { name: 'Wiper Democratic Movement', leader: 'Kalonzo Musyoka', coalition: 'Azimio' },
  'ANC': { name: 'Amani National Congress', leader: 'Musalia Mudavadi', coalition: 'Kenya Kwanza' },
  'FORD-K': { name: 'Forum for the Restoration of Democracy Kenya', leader: 'Moses Wetangula', coalition: 'Kenya Kwanza' },
  'Jubilee': { name: 'Jubilee Party', leader: 'Uhuru Kenyatta', coalition: 'Azimio' },
  'DAP-K': { name: 'Democratic Action Party of Kenya', leader: 'Eugene Wamalwa', coalition: 'Azimio' }
};

// Policy categories for comparison
const POLICY_CATEGORIES = {
  'economic': {
    name: 'Economic Policy',
    subcategories: ['taxation', 'employment', 'business', 'agriculture', 'industrialization', 'trade'],
    weight: 0.25
  },
  'social': {
    name: 'Social Policy',
    subcategories: ['healthcare', 'education', 'housing', 'social_security', 'gender_equality'],
    weight: 0.20
  },
  'governance': {
    name: 'Governance & Democracy',
    subcategories: ['devolution', 'anti_corruption', 'rule_of_law', 'transparency', 'public_participation'],
    weight: 0.20
  },
  'infrastructure': {
    name: 'Infrastructure Development',
    subcategories: ['transport', 'energy', 'water', 'telecommunications', 'urban_development'],
    weight: 0.15
  },
  'security': {
    name: 'Security & Defense',
    subcategories: ['national_security', 'police_reforms', 'border_security', 'cyber_security'],
    weight: 0.10
  },
  'environment': {
    name: 'Environment & Climate',
    subcategories: ['climate_change', 'conservation', 'renewable_energy', 'pollution_control'],
    weight: 0.10
  }
};

interface PolicyComparisonRequest {
  parties: string[];
  categories?: string[];
  timeframe?: string;
  includeManifestos?: boolean;
  includeImplementation?: boolean;
  comparisonType?: 'detailed' | 'summary' | 'scorecard';
}

export async function POST(request: NextRequest) {
  try {
    const { 
      parties,
      categories = Object.keys(POLICY_CATEGORIES),
      timeframe = 'current',
      includeManifestos = true,
      includeImplementation = true,
      comparisonType = 'detailed'
    }: PolicyComparisonRequest = await request.json();

    if (!parties || parties.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 parties required for comparison' },
        { status: 400 }
      );
    }

    // Validate parties
    const validParties = parties.filter(party => KENYAN_POLITICAL_PARTIES[party as keyof typeof KENYAN_POLITICAL_PARTIES]);
    if (validParties.length < 2) {
      return NextResponse.json(
        { error: 'Invalid party codes provided' },
        { status: 400 }
      );
    }

    // Generate comprehensive policy comparison
    const comparison = await generatePolicyComparison(
      validParties, 
      categories, 
      includeManifestos, 
      includeImplementation
    );
    
    // Create interactive comparison matrices
    const matrices = await createComparisonMatrices(comparison, categories);
    
    // Generate policy recommendations and insights
    const insights = await generatePolicyInsights(comparison, validParties);
    
    // Create similarity scores and alignment analysis
    const alignmentAnalysis = await analyzePolicyAlignment(comparison, validParties);

    return NextResponse.json({
      success: true,
      comparison: {
        parties: validParties.map(code => ({
          code,
          ...KENYAN_POLITICAL_PARTIES[code as keyof typeof KENYAN_POLITICAL_PARTIES]
        })),
        policies: comparison,
        matrices,
        insights,
        alignment: alignmentAnalysis,
        metadata: {
          generated: new Date().toISOString(),
          categories: categories.length,
          timeframe,
          comparisonType,
          includeManifestos,
          includeImplementation
        }
      }
    });

  } catch (error) {
    console.error('Policy comparison error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Policy comparison service temporarily unavailable',
      fallback: generateFallbackComparison()
    }, { status: 500 });
  }
}

async function generatePolicyComparison(
  parties: string[], 
  categories: string[], 
  includeManifestos: boolean, 
  includeImplementation: boolean
) {
  const policies: Record<string, any> = {};

  // Get policy data for each category
  for (const category of categories) {
    if (!POLICY_CATEGORIES[category as keyof typeof POLICY_CATEGORIES]) continue;
    
    policies[category] = {
      name: POLICY_CATEGORIES[category as keyof typeof POLICY_CATEGORIES].name,
      subcategories: POLICY_CATEGORIES[category as keyof typeof POLICY_CATEGORIES].subcategories,
      parties: {}
    };

    // Get policy positions for each party
    for (const party of parties) {
      const partyPolicies = await fetchPartyPolicies(party, category, includeManifestos, includeImplementation);
      policies[category].parties[party] = partyPolicies;
    }
  }

  return policies;
}

async function fetchPartyPolicies(
  party: string, 
  category: string, 
  includeManifestos: boolean, 
  includeImplementation: boolean
) {
  const partyInfo = KENYAN_POLITICAL_PARTIES[party as keyof typeof KENYAN_POLITICAL_PARTIES];
  
  // Search for party-specific policy content
  const [manifestoData, implementationData, newsData] = await Promise.all([
    includeManifestos ? WebScraper.scrapeKenyanNews(`${partyInfo.name} ${category} manifesto policy`) : Promise.resolve([]),
    includeImplementation ? WebScraper.scrapeGovernmentData(`${partyInfo.name} ${category} implementation`) : Promise.resolve([]),
    WebScraper.scrapeKenyanNews(`${party} ${category} policy position`)
  ]);

  // Generate AI-powered policy analysis
  const policyAnalysis = await generatePartyPolicyAnalysis(party, category, {
    manifesto: manifestoData,
    implementation: implementationData,
    news: newsData
  });

  return {
    manifesto: includeManifestos ? extractManifestoPositions(manifestoData, category) : null,
    implementation: includeImplementation ? extractImplementationRecord(implementationData, category) : null,
    positions: policyAnalysis.positions,
    commitments: policyAnalysis.commitments,
    priorities: policyAnalysis.priorities,
    feasibility: policyAnalysis.feasibility,
    timeline: policyAnalysis.timeline,
    budget: policyAnalysis.budget,
    sources: {
      manifestoSources: manifestoData.length,
      implementationSources: implementationData.length,
      newsSources: newsData.length
    }
  };
}

async function generatePartyPolicyAnalysis(party: string, category: string, data: any) {
  try {
    const partyInfo = KENYAN_POLITICAL_PARTIES[party as keyof typeof KENYAN_POLITICAL_PARTIES];
    const categoryInfo = POLICY_CATEGORIES[category as keyof typeof POLICY_CATEGORIES];
    
    // Combine relevant data for analysis
    const contextData = [
      ...data.manifesto.slice(0, 3),
      ...data.implementation.slice(0, 2),
      ...data.news.slice(0, 3)
    ].map(item => item.content?.substring(0, 150)).filter(Boolean).join('\n');

    const prompt = `Analyze ${partyInfo.name} (${party}) policy positions on ${categoryInfo.name}:

Recent Policy Context:
${contextData}

Policy Subcategories: ${categoryInfo.subcategories.join(', ')}

Provide comprehensive analysis in JSON format:
{
  "positions": {
    "${categoryInfo.subcategories[0]}": {"stance": "string", "details": "string", "strength": 0.0-1.0},
    "${categoryInfo.subcategories[1]}": {"stance": "string", "details": "string", "strength": 0.0-1.0}
  },
  "commitments": ["commitment1", "commitment2"],
  "priorities": [{"item": "string", "importance": 0.0-1.0}],
  "feasibility": {"score": 0.0-1.0, "challenges": ["challenge1"]},
  "timeline": {"short_term": ["item1"], "long_term": ["item1"]},
  "budget": {"estimated_cost": "string", "funding_source": "string"}
}`;

    const response = await ai.generate({
      model: MODELS.DEEPSEEK_CHAT,
      prompt,
      config: { temperature: 0.2, maxOutputTokens: 800 }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error('Policy analysis error:', error);
    return generateFallbackPolicyAnalysis(category);
  }
}

function extractManifestoPositions(manifestoData: any[], category: string) {
  if (!manifestoData.length) return null;
  
  const relevantContent = manifestoData
    .filter(item => item.content?.toLowerCase().includes(category.toLowerCase()))
    .slice(0, 5);
    
  return {
    keyPoints: relevantContent.map(item => item.content?.substring(0, 200)),
    lastUpdated: new Date().toISOString(),
    sourceCount: relevantContent.length
  };
}

function extractImplementationRecord(implementationData: any[], category: string) {
  if (!implementationData.length) return null;
  
  return {
    achievements: implementationData.slice(0, 3).map(item => item.title || item.content?.substring(0, 100)),
    ongoing: implementationData.slice(3, 6).map(item => item.title || item.content?.substring(0, 100)),
    challenges: implementationData.slice(6, 8).map(item => item.title || item.content?.substring(0, 100)),
    lastUpdated: new Date().toISOString()
  };
}

async function createComparisonMatrices(policies: any, categories: string[]) {
  const matrices: Record<string, any> = {};

  for (const category of categories) {
    if (!policies[category]) continue;
    
    const categoryPolicies = policies[category];
    const parties = Object.keys(categoryPolicies.parties);
    
    // Create similarity matrix
    const similarityMatrix = createSimilarityMatrix(categoryPolicies, parties);
    
    // Create position matrix
    const positionMatrix = createPositionMatrix(categoryPolicies, parties);
    
    // Create feasibility matrix
    const feasibilityMatrix = createFeasibilityMatrix(categoryPolicies, parties);
    
    matrices[category] = {
      similarity: similarityMatrix,
      positions: positionMatrix,
      feasibility: feasibilityMatrix,
      subcategories: categoryPolicies.subcategories
    };
  }

  return matrices;
}

function createSimilarityMatrix(categoryPolicies: any, parties: string[]) {
  const matrix: Record<string, Record<string, number>> = {};
  
  parties.forEach(party1 => {
    matrix[party1] = {};
    parties.forEach(party2 => {
      if (party1 === party2) {
        matrix[party1][party2] = 1.0;
      } else {
        matrix[party1][party2] = calculatePolicySimilarity(
          categoryPolicies.parties[party1],
          categoryPolicies.parties[party2]
        );
      }
    });
  });
  
  return matrix;
}

function createPositionMatrix(categoryPolicies: any, parties: string[]) {
  const subcategories = categoryPolicies.subcategories;
  const matrix: Record<string, Record<string, any>> = {};
  
  subcategories.forEach((subcat: string) => {
    matrix[subcat] = {};
    parties.forEach(party => {
      const partyPolicies = categoryPolicies.parties[party];
      const position = partyPolicies.positions?.[subcat];
      
      matrix[subcat][party] = {
        stance: position?.stance || 'unknown',
        strength: position?.strength || 0.5,
        details: position?.details || 'No specific position found'
      };
    });
  });
  
  return matrix;
}

function createFeasibilityMatrix(categoryPolicies: any, parties: string[]) {
  const matrix: Record<string, any> = {};
  
  parties.forEach(party => {
    const partyPolicies = categoryPolicies.parties[party];
    matrix[party] = {
      feasibilityScore: partyPolicies.feasibility?.score || 0.5,
      challenges: partyPolicies.feasibility?.challenges || [],
      timeline: partyPolicies.timeline || {},
      budget: partyPolicies.budget || {}
    };
  });
  
  return matrix;
}

function calculatePolicySimilarity(policy1: any, policy2: any): number {
  if (!policy1.positions || !policy2.positions) return 0.5;
  
  const positions1 = policy1.positions;
  const positions2 = policy2.positions;
  
  const commonCategories = Object.keys(positions1).filter(cat => positions2[cat]);
  
  if (commonCategories.length === 0) return 0.5;
  
  let similaritySum = 0;
  commonCategories.forEach(category => {
    const pos1 = positions1[category];
    const pos2 = positions2[category];
    
    // Simple similarity based on stance alignment and strength
    const stanceSimilarity = pos1.stance === pos2.stance ? 1 : 0;
    const strengthSimilarity = 1 - Math.abs(pos1.strength - pos2.strength);
    
    similaritySum += (stanceSimilarity * 0.7 + strengthSimilarity * 0.3);
  });
  
  return similaritySum / commonCategories.length;
}

async function generatePolicyInsights(policies: any, parties: string[]) {
  const insights = [];
  const categories = Object.keys(policies);
  
  // Find most aligned parties
  let maxAlignment = 0;
  let mostAligned = ['', ''];
  
  for (let i = 0; i < parties.length; i++) {
    for (let j = i + 1; j < parties.length; j++) {
      let totalAlignment = 0;
      let categoryCount = 0;
      
      categories.forEach(category => {
        if (policies[category]?.parties[parties[i]] && policies[category]?.parties[parties[j]]) {
          const similarity = calculatePolicySimilarity(
            policies[category].parties[parties[i]],
            policies[category].parties[parties[j]]
          );
          totalAlignment += similarity;
          categoryCount++;
        }
      });
      
      const avgAlignment = categoryCount > 0 ? totalAlignment / categoryCount : 0;
      if (avgAlignment > maxAlignment) {
        maxAlignment = avgAlignment;
        mostAligned = [parties[i], parties[j]];
      }
    }
  }
  
  insights.push(`Highest policy alignment: ${mostAligned[0]} and ${mostAligned[1]} (${Math.round(maxAlignment * 100)}% similarity)`);
  
  // Find areas of consensus
  const consensusAreas = findConsensusAreas(policies, parties);
  if (consensusAreas.length > 0) {
    insights.push(`Strong consensus on: ${consensusAreas.slice(0, 3).join(', ')}`);
  }
  
  // Find areas of divergence
  const divergentAreas = findDivergentAreas(policies, parties);
  if (divergentAreas.length > 0) {
    insights.push(`Major differences in: ${divergentAreas.slice(0, 3).join(', ')}`);
  }
  
  // Implementation feasibility insights
  const feasibilityInsights = analyzeFeasibilityTrends(policies, parties);
  insights.push(...feasibilityInsights);
  
  return insights;
}

function findConsensusAreas(policies: any, parties: string[]): string[] {
  const consensusAreas = [];
  const categories = Object.keys(policies);
  
  categories.forEach(category => {
    if (!policies[category]?.parties) return;
    
    const subcategories = policies[category].subcategories || [];
    subcategories.forEach((subcat: string) => {
      const positions = parties.map(party => 
        policies[category].parties[party]?.positions?.[subcat]?.stance
      ).filter(Boolean);
      
      if (positions.length >= parties.length - 1) {
        const uniqueStances = [...new Set(positions)];
        if (uniqueStances.length === 1) {
          consensusAreas.push(`${category}/${subcat}`);
        }
      }
    });
  });
  
  return consensusAreas;
}

function findDivergentAreas(policies: any, parties: string[]): string[] {
  const divergentAreas = [];
  const categories = Object.keys(policies);
  
  categories.forEach(category => {
    if (!policies[category]?.parties) return;
    
    const subcategories = policies[category].subcategories || [];
    subcategories.forEach((subcat: string) => {
      const positions = parties.map(party => 
        policies[category].parties[party]?.positions?.[subcat]?.stance
      ).filter(Boolean);
      
      if (positions.length >= parties.length - 1) {
        const uniqueStances = [...new Set(positions)];
        if (uniqueStances.length === parties.length) {
          divergentAreas.push(`${category}/${subcat}`);
        }
      }
    });
  });
  
  return divergentAreas;
}

function analyzeFeasibilityTrends(policies: any, parties: string[]): string[] {
  const insights = [];
  const categories = Object.keys(policies);
  
  // Calculate average feasibility by party
  const partyFeasibility: Record<string, number[]> = {};
  parties.forEach(party => {
    partyFeasibility[party] = [];
  });
  
  categories.forEach(category => {
    if (!policies[category]?.parties) return;
    
    parties.forEach(party => {
      const feasibility = policies[category].parties[party]?.feasibility?.score;
      if (feasibility !== undefined) {
        partyFeasibility[party].push(feasibility);
      }
    });
  });
  
  // Find most and least feasible parties
  const avgFeasibility = Object.entries(partyFeasibility).map(([party, scores]) => [
    party, 
    scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0.5
  ]).sort(([,a], [,b]) => (b as number) - (a as number));
  
  if (avgFeasibility.length > 0) {
    insights.push(`Most feasible policies: ${avgFeasibility[0][0]} (${Math.round((avgFeasibility[0][1] as number) * 100)}% avg feasibility)`);
  }
  
  return insights;
}

async function analyzePolicyAlignment(policies: any, parties: string[]) {
  const alignment = {
    overallAlignment: calculateOverallAlignment(policies, parties),
    categoryAlignment: calculateCategoryAlignment(policies, parties),
    coalitionAnalysis: analyzeCoalitionAlignment(parties),
    competitiveAreas: findCompetitiveAreas(policies, parties),
    collaborationOpportunities: findCollaborationOpportunities(policies, parties)
  };
  
  return alignment;
}

function calculateOverallAlignment(policies: any, parties: string[]): Record<string, Record<string, number>> {
  const alignment: Record<string, Record<string, number>> = {};
  
  parties.forEach(party1 => {
    alignment[party1] = {};
    parties.forEach(party2 => {
      if (party1 === party2) {
        alignment[party1][party2] = 1.0;
      } else {
        let totalSimilarity = 0;
        let categoryCount = 0;
        
        Object.values(policies).forEach((categoryData: any) => {
          if (categoryData.parties?.[party1] && categoryData.parties?.[party2]) {
            totalSimilarity += calculatePolicySimilarity(
              categoryData.parties[party1],
              categoryData.parties[party2]
            );
            categoryCount++;
          }
        });
        
        alignment[party1][party2] = categoryCount > 0 ? totalSimilarity / categoryCount : 0.5;
      }
    });
  });
  
  return alignment;
}

function calculateCategoryAlignment(policies: any, parties: string[]): Record<string, number> {
  const categoryAlignment: Record<string, number> = {};
  
  Object.entries(policies).forEach(([category, categoryData]: [string, any]) => {
    if (!categoryData.parties) return;
    
    let totalAlignment = 0;
    let pairCount = 0;
    
    for (let i = 0; i < parties.length; i++) {
      for (let j = i + 1; j < parties.length; j++) {
        if (categoryData.parties[parties[i]] && categoryData.parties[parties[j]]) {
          totalAlignment += calculatePolicySimilarity(
            categoryData.parties[parties[i]],
            categoryData.parties[parties[j]]
          );
          pairCount++;
        }
      }
    }
    
    categoryAlignment[category] = pairCount > 0 ? totalAlignment / pairCount : 0.5;
  });
  
  return categoryAlignment;
}

function analyzeCoalitionAlignment(parties: string[]) {
  const coalitions: Record<string, string[]> = {};
  
  parties.forEach(party => {
    const partyInfo = KENYAN_POLITICAL_PARTIES[party as keyof typeof KENYAN_POLITICAL_PARTIES];
    if (partyInfo?.coalition) {
      if (!coalitions[partyInfo.coalition]) {
        coalitions[partyInfo.coalition] = [];
      }
      coalitions[partyInfo.coalition].push(party);
    }
  });
  
  return {
    coalitions,
    coalitionCount: Object.keys(coalitions).length,
    largestCoalition: Object.entries(coalitions).sort(([,a], [,b]) => b.length - a.length)[0]?.[0]
  };
}

function findCompetitiveAreas(policies: any, parties: string[]): string[] {
  // Areas with low alignment (high competition)
  const competitive = [];
  
  Object.entries(policies).forEach(([category, categoryData]: [string, any]) => {
    if (!categoryData.parties) return;
    
    let totalAlignment = 0;
    let pairCount = 0;
    
    for (let i = 0; i < parties.length; i++) {
      for (let j = i + 1; j < parties.length; j++) {
        if (categoryData.parties[parties[i]] && categoryData.parties[parties[j]]) {
          totalAlignment += calculatePolicySimilarity(
            categoryData.parties[parties[i]],
            categoryData.parties[parties[j]]
          );
          pairCount++;
        }
      }
    }
    
    const avgAlignment = pairCount > 0 ? totalAlignment / pairCount : 0.5;
    if (avgAlignment < 0.4) {
      competitive.push(category);
    }
  });
  
  return competitive;
}

function findCollaborationOpportunities(policies: any, parties: string[]): string[] {
  // Areas with high alignment (collaboration potential)
  const collaborative = [];
  
  Object.entries(policies).forEach(([category, categoryData]: [string, any]) => {
    if (!categoryData.parties) return;
    
    let totalAlignment = 0;
    let pairCount = 0;
    
    for (let i = 0; i < parties.length; i++) {
      for (let j = i + 1; j < parties.length; j++) {
        if (categoryData.parties[parties[i]] && categoryData.parties[parties[j]]) {
          totalAlignment += calculatePolicySimilarity(
            categoryData.parties[parties[i]],
            categoryData.parties[parties[j]]
          );
          pairCount++;
        }
      }
    }
    
    const avgAlignment = pairCount > 0 ? totalAlignment / pairCount : 0.5;
    if (avgAlignment > 0.7) {
      collaborative.push(category);
    }
  });
  
  return collaborative;
}

function generateFallbackPolicyAnalysis(category: string) {
  const categoryInfo = POLICY_CATEGORIES[category as keyof typeof POLICY_CATEGORIES];
  
  return {
    positions: Object.fromEntries(
      categoryInfo.subcategories.map(subcat => [
        subcat, 
        { stance: 'neutral', details: 'Position analysis unavailable', strength: 0.5 }
      ])
    ),
    commitments: ['Policy analysis unavailable'],
    priorities: [{ item: 'Data collection in progress', importance: 0.5 }],
    feasibility: { score: 0.5, challenges: ['Insufficient data'] },
    timeline: { short_term: [], long_term: [] },
    budget: { estimated_cost: 'Unknown', funding_source: 'TBD' }
  };
}

function generateFallbackComparison() {
  return {
    parties: ['UDA', 'ODM'].map(code => ({
      code,
      ...KENYAN_POLITICAL_PARTIES[code as keyof typeof KENYAN_POLITICAL_PARTIES]
    })),
    policies: { economic: { name: 'Economic Policy', parties: {} } },
    matrices: {},
    insights: ['Policy comparison service temporarily unavailable'],
    alignment: { overallAlignment: {}, categoryAlignment: {} }
  };
}

export async function GET() {
  return NextResponse.json({
    message: 'Interactive Policy Comparison Tool',
    availableParties: Object.entries(KENYAN_POLITICAL_PARTIES).map(([code, info]) => ({
      code,
      ...info
    })),
    policyCategories: Object.entries(POLICY_CATEGORIES).map(([key, info]) => ({
      key,
      ...info
    })),
    features: [
      'Multi-party policy comparison',
      'Manifesto analysis',
      'Implementation tracking',
      'Similarity matrices',
      'Alignment analysis',
      'Feasibility assessment',
      'Coalition analysis',
      'Interactive visualizations'
    ]
  });
}
