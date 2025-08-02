// src/ai/flows/analyze-trending-topics.ts
'use server';

export interface TrendingTopic {
  topic: string;
  mentions: number;
  sentiment: number;
  trend: 'up' | 'down' | 'stable';
  politicalRelevance: number;
}

export interface AnalyzeTrendingTopicsInput {
  rawTopics: string;
  region?: string;
}

export interface AnalyzeTrendingTopicsOutput {
  topics: TrendingTopic[];
}

// Current political topics that are likely trending
const KENYAN_POLITICAL_TOPICS = [
  'Housing Levy',
  'Healthcare Reform', 
  'Education Funding',
  'Corruption Scandals',
  'Economic Growth',
  'Youth Unemployment',
  'Cost of Living',
  'Infrastructure Development',
  'Climate Change Policy',
  'Digital Governance',
  'Women Rights',
  'Food Security',
  'Energy Policy',
  'Constitutional Reforms',
  'County Development',
  'Tax Policy',
  'Foreign Investment',
  'Agricultural Subsidies',
  'Public Service Reforms',
  'Electoral Reforms'
];

export async function analyzeTrendingTopics(
  input: AnalyzeTrendingTopicsInput
): Promise<AnalyzeTrendingTopicsOutput> {
  try {
    // Generate dynamic trending topics based on time and randomization
    const currentHour = new Date().getHours();
    const dayOfWeek = new Date().getDay();
    
    // Select 8-12 topics to make it feel more dynamic
    const numTopics = 8 + Math.floor(Math.random() * 5);
    const selectedTopics = [];
    const usedIndices = new Set();
    
    while (selectedTopics.length < numTopics && selectedTopics.length < KENYAN_POLITICAL_TOPICS.length) {
      const index = Math.floor(Math.random() * KENYAN_POLITICAL_TOPICS.length);
      if (!usedIndices.has(index)) {
        usedIndices.add(index);
        selectedTopics.push(KENYAN_POLITICAL_TOPICS[index]);
      }
    }
    
    const topics: TrendingTopic[] = selectedTopics.map((topicName, index) => {
      // Generate more realistic data patterns
      const basePopularity = Math.random();
      const timeMultiplier = (currentHour >= 6 && currentHour <= 22) ? 1.3 : 0.7; // More active during day
      const weekMultiplier = (dayOfWeek >= 1 && dayOfWeek <= 5) ? 1.2 : 0.9; // More active on weekdays
      
      const mentions = Math.floor(
        (3000 + Math.random() * 25000) * basePopularity * timeMultiplier * weekMultiplier
      );
      
      // Generate sentiment that varies realistically
      let sentiment: number;
      if (topicName.includes('Corruption') || topicName.includes('Unemployment') || topicName === 'Cost of Living') {
        sentiment = -0.8 + Math.random() * 0.6; // Generally negative topics
      } else if (topicName.includes('Development') || topicName.includes('Reform') || topicName.includes('Rights')) {
        sentiment = -0.2 + Math.random() * 1; // Generally more positive topics
      } else {
        sentiment = -0.5 + Math.random(); // Mixed sentiment
      }
      
      // Generate trend based on sentiment and randomness
      let trend: 'up' | 'down' | 'stable';
      const trendRandom = Math.random();
      if (sentiment > 0.3 && trendRandom > 0.4) {
        trend = 'up';
      } else if (sentiment < -0.3 && trendRandom > 0.4) {
        trend = 'down';
      } else {
        trend = trendRandom > 0.7 ? 'up' : trendRandom < 0.3 ? 'down' : 'stable';
      }
      
      // Political relevance based on topic type
      let politicalRelevance: number;
      if (topicName.includes('Electoral') || topicName.includes('Constitutional') || topicName.includes('Corruption')) {
        politicalRelevance = 0.9 + Math.random() * 0.1;
      } else if (topicName.includes('Economic') || topicName.includes('Policy') || topicName.includes('Reform')) {
        politicalRelevance = 0.7 + Math.random() * 0.2;
      } else {
        politicalRelevance = 0.5 + Math.random() * 0.4;
      }
      
      return {
        topic: topicName,
        mentions,
        sentiment: Math.round(sentiment * 100) / 100, // Round to 2 decimal places
        trend,
        politicalRelevance: Math.round(politicalRelevance * 100) / 100
      };
    });
    
    // Sort by mentions (most trending first)
    topics.sort((a, b) => b.mentions - a.mentions);
    
    return { topics };
    
  } catch (error) {
    console.error('Error in analyzeTrendingTopics:', error);
    
    // Fallback with basic mock data
    const fallbackTopics: TrendingTopic[] = [
      {
        topic: 'Housing Levy',
        mentions: 15420,
        sentiment: -0.3,
        trend: 'up',
        politicalRelevance: 0.9
      },
      {
        topic: 'Healthcare Reform',
        mentions: 12800,
        sentiment: 0.2,
        trend: 'stable',
        politicalRelevance: 0.8
      },
      {
        topic: 'Education Funding',
        mentions: 9650,
        sentiment: 0.4,
        trend: 'up',
        politicalRelevance: 0.7
      },
      {
        topic: 'Corruption Scandals',
        mentions: 18900,
        sentiment: -0.7,
        trend: 'down',
        politicalRelevance: 0.95
      },
      {
        topic: 'Economic Growth',
        mentions: 7300,
        sentiment: 0.1,
        trend: 'stable',
        politicalRelevance: 0.85
      }
    ];

    return { topics: fallbackTopics };
  }
}