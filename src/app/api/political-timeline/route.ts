import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/ai/genkit';
import { MODELS } from '@/ai/models';
import { EnhancedWebScraper } from '@/lib/enhanced-scraper';
import { KenyaPoliticalDataService } from '@/lib/kenya-political-data';

// Major Kenyan political timeline categories
const TIMELINE_CATEGORIES = {
  'elections': {
    name: 'Elections & Electoral Process',
    keywords: ['election', 'voting', 'campaign', 'nomination', 'ballot', 'IEBC'],
    color: '#2563eb',
    icon: 'ballot-box'
  },
  'legislation': {
    name: 'Legislative & Parliamentary',
    keywords: ['bill', 'law', 'parliament', 'senate', 'assembly', 'motion'],
    color: '#7c3aed',
    icon: 'document-text'
  },
  'judicial': {
    name: 'Judicial & Legal',
    keywords: ['court', 'ruling', 'judgment', 'justice', 'legal', 'constitution'],
    color: '#dc2626',
    icon: 'scale'
  },
  'economic': {
    name: 'Economic & Financial',
    keywords: ['budget', 'economic', 'finance', 'tax', 'development', 'investment'],
    color: '#059669',
    icon: 'currency-dollar'
  },
  'governance': {
    name: 'Governance & Administration',
    keywords: ['government', 'cabinet', 'appointment', 'policy', 'reform', 'governance'],
    color: '#ea580c',
    icon: 'building-office'
  },
  'security': {
    name: 'Security & Defense',
    keywords: ['security', 'police', 'military', 'terrorism', 'crime', 'peacekeeping'],
    color: '#7f1d1d',
    icon: 'shield-check'
  },
  'international': {
    name: 'International Relations',
    keywords: ['diplomatic', 'international', 'treaty', 'foreign', 'bilateral', 'embassy'],
    color: '#1e40af',
    icon: 'globe-africa'
  },
  'social': {
    name: 'Social & Cultural',
    keywords: ['social', 'education', 'health', 'culture', 'community', 'welfare'],
    color: '#be185d',
    icon: 'users'
  }
};

// Important Kenyan political figures for context
const POLITICAL_FIGURES = {
  'William Ruto': { role: 'President', party: 'UDA', active_since: '2013' },
  'Raila Odinga': { role: 'Opposition Leader', party: 'ODM', active_since: '1992' },
  'Uhuru Kenyatta': { role: 'Former President', party: 'Jubilee', active_since: '2002' },
  'Martha Karua': { role: 'Former Justice Minister', party: 'Narc Kenya', active_since: '2002' },
  'Kalonzo Musyoka': { role: 'Former VP', party: 'Wiper', active_since: '1985' },
  'Musalia Mudavadi': { role: 'Deputy President', party: 'ANC', active_since: '1989' },
  'Moses Wetangula': { role: 'National Assembly Speaker', party: 'FORD-K', active_since: '1992' }
};

interface TimelineRequest {
  timeframe: {
    start: string;
    end: string;
  };
  categories?: string[];
  figures?: string[];
  regions?: string[];
  eventTypes?: string[];
  includeConnections?: boolean;
  includeAnalysis?: boolean;
  granularity?: 'day' | 'week' | 'month';
}

export async function POST(request: NextRequest) {
  try {
    const { 
      timeframe,
      categories = Object.keys(TIMELINE_CATEGORIES),
      figures = [],
      regions = [],
      eventTypes = ['major', 'significant'],
      includeConnections = true,
      includeAnalysis = true,
      granularity = 'day'
    }: TimelineRequest = await request.json();

    if (!timeframe || !timeframe.start || !timeframe.end) {
      return NextResponse.json(
        { error: 'Start and end dates required for timeline' },
        { status: 400 }
      );
    }

    // Validate date range
    const startDate = new Date(timeframe.start);
    const endDate = new Date(timeframe.end);
    
    if (startDate >= endDate) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    // Generate comprehensive political timeline
    const timeline = await generatePoliticalTimeline(
      timeframe, 
      categories, 
      figures, 
      regions,
      eventTypes
    );
    
    // Create event connections and relationships
    const connections = includeConnections ? await generateEventConnections(timeline.events) : [];
    
    // Generate timeline analysis and insights
    const analysis = includeAnalysis ? await generateTimelineAnalysis(timeline, timeframe) : null;
    
    // Create interactive timeline structure
    const interactiveTimeline = await createInteractiveTimeline(timeline, connections, granularity);

    return NextResponse.json({
      success: true,
      timeline: {
        ...timeline,
        connections,
        analysis,
        interactive: interactiveTimeline,
        metadata: {
          generated: new Date().toISOString(),
          timeframe,
          categories: categories.length,
          totalEvents: timeline.events.length,
          granularity,
          includeConnections,
          includeAnalysis
        }
      }
    });

  } catch (error) {
    console.error('Political timeline generation error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Timeline generation service temporarily unavailable',
      fallback: generateFallbackTimeline()
    }, { status: 500 });
  }
}

async function generatePoliticalTimeline(
  timeframe: any, 
  categories: string[], 
  figures: string[], 
  regions: string[],
  eventTypes: string[]
) {
  const events: any[] = [];
  const startDate = new Date(timeframe.start);
  const endDate = new Date(timeframe.end);
  
  // Search for political events in the specified timeframe
  const [newsEvents, governmentEvents, parliamentaryEvents] = await Promise.all([
    searchPoliticalEvents('news', timeframe, categories, figures),
    searchPoliticalEvents('government', timeframe, categories, figures),
    searchPoliticalEvents('parliamentary', timeframe, categories, figures)
  ]);

  // Combine and process all events
  const allEvents = [...newsEvents, ...governmentEvents, ...parliamentaryEvents];
  
  // Process each event to create timeline entries
  for (const eventData of allEvents) {
    const processedEvent = await processTimelineEvent(eventData, categories, figures);
    if (processedEvent && isEventInTimeframe(processedEvent.date, startDate, endDate)) {
      events.push(processedEvent);
    }
  }

  // Sort events chronologically
  events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Generate timeline summary
  const summary = generateTimelineSummary(events, timeframe);
  
  return {
    events,
    summary,
    categories: categories.map(cat => ({
      key: cat,
      ...TIMELINE_CATEGORIES[cat as keyof typeof TIMELINE_CATEGORIES],
      eventCount: events.filter(e => e.category === cat).length
    })),
    figures: figures.map(fig => ({
      name: fig,
      ...POLITICAL_FIGURES[fig as keyof typeof POLITICAL_FIGURES],
      eventCount: events.filter(e => e.figures?.includes(fig)).length
    })),
    dateRange: { start: timeframe.start, end: timeframe.end }
  };
}

async function searchPoliticalEvents(source: string, timeframe: any, categories: string[], figures: string[]) {
  try {
    const searchQueries: string[] = [];
    
    // Create search queries based on categories
    categories.forEach(category => {
      if (TIMELINE_CATEGORIES[category as keyof typeof TIMELINE_CATEGORIES]) {
        const categoryInfo = TIMELINE_CATEGORIES[category as keyof typeof TIMELINE_CATEGORIES];
        searchQueries.push(`Kenya ${categoryInfo.name} ${timeframe.start} ${timeframe.end}`);
      }
    });
    
    // Add figure-specific searches
    figures.forEach(figure => {
      searchQueries.push(`"${figure}" Kenya political ${timeframe.start}`);
    });

    const searchResults: any[] = [];
    
    // Perform searches based on source type
    for (const query of searchQueries.slice(0, 5)) { // Limit to prevent overwhelming API
      let results: any[] = [];
      
      switch (source) {
        case 'news':
          results = await EnhancedWebScraper.scrapeKenyanNews(query);
          break;
        case 'government':
          results = await EnhancedWebScraper.scrapeGovernmentData(query);
          break;
        case 'parliamentary':
          results = await KenyaPoliticalDataService.fetchPoliticalSentiment(query);
          break;
      }
      
      searchResults.push(...results.slice(0, 10)); // Limit results per query
    }
    
    return searchResults;
  } catch (error) {
    console.error(`Error searching ${source} events:`, error);
    return [];
  }
}

async function processTimelineEvent(eventData: any, categories: string[], figures: string[]) {
  try {
    // Extract basic event information
    const content = eventData.content || eventData.title || eventData.text || '';
    const date = extractEventDate(eventData, content);
    
    if (!date) return null;

    // Categorize the event
    const category = categorizeEvent(content, categories);
    
    // Identify mentioned figures
    const mentionedFigures = identifyMentionedFigures(content, figures);
    
    // Generate AI analysis of the event
    const eventAnalysis = await analyzeEventSignificance(content, category, mentionedFigures);
    
    return {
      id: generateEventId(content, date),
      title: extractEventTitle(eventData, content),
      description: content.substring(0, 300),
      date: date.toISOString(),
      category,
      significance: eventAnalysis.significance,
      impact: eventAnalysis.impact,
      figures: mentionedFigures,
      location: extractLocation(content),
      source: eventData.source || 'Unknown',
      url: eventData.url,
      tags: eventAnalysis.tags,
      connections: [], // Will be populated later
      analysis: eventAnalysis.analysis
    };
  } catch (error) {
    console.error('Error processing timeline event:', error);
    return null;
  }
}

function extractEventDate(eventData: any, content: string): Date | null {
  // Try to extract date from various fields
  if (eventData.date) return new Date(eventData.date);
  if (eventData.timestamp) return new Date(eventData.timestamp);
  if (eventData.published) return new Date(eventData.published);
  
  // Try to extract date from content using regex
  const datePatterns = [
    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,
    /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/,
    /(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s+(\d{4})/i
  ];
  
  for (const pattern of datePatterns) {
    const match = content.match(pattern);
    if (match) {
      try {
        return new Date(match[0]);
      } catch (e) {
        continue;
      }
    }
  }
  
  // Default to current date if no date found
  return new Date();
}

function categorizeEvent(content: string, categories: string[]): string {
  const contentLower = content.toLowerCase();
  
  let bestCategory = 'governance'; // default
  let maxScore = 0;
  
  categories.forEach(category => {
    if (TIMELINE_CATEGORIES[category as keyof typeof TIMELINE_CATEGORIES]) {
      const categoryInfo = TIMELINE_CATEGORIES[category as keyof typeof TIMELINE_CATEGORIES];
      const score = categoryInfo.keywords.reduce((count, keyword) => {
        const regex = new RegExp(keyword, 'gi');
        const matches = contentLower.match(regex);
        return count + (matches ? matches.length : 0);
      }, 0);
      
      if (score > maxScore) {
        maxScore = score;
        bestCategory = category;
      }
    }
  });
  
  return bestCategory;
}

function identifyMentionedFigures(content: string, figures: string[]): string[] {
  const mentioned: string[] = [];
  const contentLower = content.toLowerCase();
  
  // Check for explicitly provided figures
  figures.forEach(figure => {
    if (contentLower.includes(figure.toLowerCase())) {
      mentioned.push(figure);
    }
  });
  
  // Check for known political figures
  Object.keys(POLITICAL_FIGURES).forEach(figure => {
    if (contentLower.includes(figure.toLowerCase())) {
      mentioned.push(figure);
    }
  });
  
  return [...new Set(mentioned)]; // Remove duplicates
}

async function analyzeEventSignificance(content: string, category: string, figures: string[]) {
  try {
    const prompt = `Analyze this Kenyan political event:

Event: ${content.substring(0, 500)}
Category: ${category}
Figures: ${figures.join(', ')}

Provide analysis in JSON format:
{
  "significance": 0.0-1.0,
  "impact": {"political": 0.0-1.0, "economic": 0.0-1.0, "social": 0.0-1.0},
  "tags": ["tag1", "tag2", "tag3"],
  "analysis": "brief analysis of significance and implications"
}`;

    const response = await ai.generate({
      model: MODELS.DEEPSEEK_CHAT,
      prompt,
      config: { temperature: 0.3, maxOutputTokens: 300 }
    });

    // Handle different response structures
    const responseText = response.text || '';
    
    if (!responseText) {
      console.warn('Empty AI response for event analysis');
      return {
        significance: 0.5,
        impact: { political: 0.5, economic: 0.3, social: 0.4 },
        tags: [category],
        analysis: 'Event analysis unavailable - empty response'
      };
    }

    // Try to extract JSON from the response text
    let jsonText = responseText;
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    }

    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Event analysis error:', error);
    return {
      significance: 0.5,
      impact: { political: 0.5, economic: 0.3, social: 0.4 },
      tags: [category],
      analysis: 'Event analysis unavailable due to parsing error'
    };
  }
}

function extractEventTitle(eventData: any, content: string): string {
  if (eventData.title) return eventData.title;
  if (eventData.headline) return eventData.headline;
  
  // Extract first sentence or first 100 characters
  const firstSentence = content.split('.')[0];
  return firstSentence.substring(0, 100) + (firstSentence.length > 100 ? '...' : '');
}

function extractLocation(content: string): string | null {
  const kenyanLocations = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Machakos', 'Meru',
    'Thika', 'Nyeri', 'Kakamega', 'Malindi', 'Kitale', 'Garissa', 'Isiolo'
  ];
  
  const contentLower = content.toLowerCase();
  
  for (const location of kenyanLocations) {
    if (contentLower.includes(location.toLowerCase())) {
      return location;
    }
  }
  
  return null;
}

function generateEventId(content: string, date: Date): string {
  const hash = content.substring(0, 50).replace(/[^a-zA-Z0-9]/g, '');
  const dateStr = date.toISOString().split('T')[0];
  return `event-${dateStr}-${hash}`.substring(0, 30);
}

function isEventInTimeframe(eventDate: string, startDate: Date, endDate: Date): boolean {
  const date = new Date(eventDate);
  return date >= startDate && date <= endDate;
}

function generateTimelineSummary(events: any[], timeframe: any) {
  const totalEvents = events.length;
  const categoryCounts = events.reduce((acc: Record<string, number>, event) => {
    acc[event.category] = (acc[event.category] || 0) + 1;
    return acc;
  }, {});
  
  const topCategory = Object.entries(categoryCounts).sort(([,a], [,b]) => (b as number) - (a as number))[0];
  
  const avgSignificance = events.length > 0 
    ? events.reduce((sum, event) => sum + (event.significance || 0.5), 0) / events.length 
    : 0.5;
    
  const highImpactEvents = events.filter(event => event.significance > 0.7).length;
  
  return {
    totalEvents,
    timeSpan: `${timeframe.start} to ${timeframe.end}`,
    dominantCategory: topCategory ? topCategory[0] : 'None',
    categoryDistribution: categoryCounts,
    averageSignificance: Math.round(avgSignificance * 100) / 100,
    highImpactEvents,
    keyFigures: [...new Set(events.flatMap(e => e.figures || []))].slice(0, 10)
  };
}

async function generateEventConnections(events: any[]) {
  const connections = [];
  
  // Find connections between events based on various criteria
  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const event1 = events[i];
      const event2 = events[j];
      
      const connection = analyzeEventConnection(event1, event2);
      if (connection.strength > 0.3) {
        connections.push({
          from: event1.id,
          to: event2.id,
          type: connection.type,
          strength: connection.strength,
          description: connection.description
        });
      }
    }
  }
  
  return connections.slice(0, 50); // Limit connections to prevent overwhelming display
}

function analyzeEventConnection(event1: any, event2: any) {
  let strength = 0;
  let connectionType = 'related';
  let description = '';
  
  // Check for figure overlap
  const commonFigures = (event1.figures || []).filter((fig: string) => 
    (event2.figures || []).includes(fig)
  );
  
  if (commonFigures.length > 0) {
    strength += 0.4;
    connectionType = 'figure-related';
    description = `Connected through ${commonFigures.join(', ')}`;
  }
  
  // Check for category relationship
  if (event1.category === event2.category) {
    strength += 0.3;
    if (connectionType === 'related') {
      connectionType = 'category-related';
      description = `Both ${event1.category} events`;
    }
  }
  
  // Check for temporal proximity (within 7 days)
  const daysDiff = Math.abs(
    new Date(event1.date).getTime() - new Date(event2.date).getTime()
  ) / (1000 * 60 * 60 * 24);
  
  if (daysDiff <= 7) {
    strength += 0.2;
    description += ` (${Math.round(daysDiff)} days apart)`;
  }
  
  // Check for location overlap
  if (event1.location && event2.location && event1.location === event2.location) {
    strength += 0.2;
    description += ` in ${event1.location}`;
  }
  
  // Check for cause-effect relationship based on content similarity
  const contentSimilarity = calculateContentSimilarity(
    event1.description, 
    event2.description
  );
  
  if (contentSimilarity > 0.3) {
    strength += contentSimilarity * 0.3;
  }
  
  return {
    strength: Math.min(strength, 1.0),
    type: connectionType,
    description: description.trim()
  };
}

function calculateContentSimilarity(content1: string, content2: string): number {
  // Simple similarity based on common words
  const words1 = content1.toLowerCase().split(/\W+/).filter(w => w.length > 3);
  const words2 = content2.toLowerCase().split(/\W+/).filter(w => w.length > 3);
  
  const commonWords = words1.filter(word => words2.includes(word));
  const totalWords = new Set([...words1, ...words2]).size;
  
  return totalWords > 0 ? commonWords.length / totalWords : 0;
}

async function generateTimelineAnalysis(timeline: any, timeframe: any) {
  const events = timeline.events;
  const insights = [];
  
  // Activity pattern analysis
  const activityPatterns = analyzeActivityPatterns(events, timeframe);
  insights.push(`Most active period: ${activityPatterns.mostActive}`);
  
  // Trend analysis
  const trends = analyzeTrends(events);
  if (trends.length > 0) {
    insights.push(`Key trends: ${trends.slice(0, 3).join(', ')}`);
  }
  
  // Impact analysis
  const impactAnalysis = analyzeOverallImpact(events);
  insights.push(`Dominant impact area: ${impactAnalysis.dominant}`);
  
  // Figure prominence analysis
  const figureAnalysis = analyzeFigureProminence(events);
  if (figureAnalysis.mostProminent) {
    insights.push(`Most prominent figure: ${figureAnalysis.mostProminent}`);
  }
  
  return {
    insights,
    patterns: activityPatterns,
    trends,
    impact: impactAnalysis,
    figures: figureAnalysis,
    summary: generateAnalysisSummary(events, timeline.summary)
  };
}

function analyzeActivityPatterns(events: any[], timeframe: any) {
  // Group events by time periods
  const dailyActivity: Record<string, number> = {};
  
  events.forEach(event => {
    const date = new Date(event.date).toISOString().split('T')[0];
    dailyActivity[date] = (dailyActivity[date] || 0) + 1;
  });
  
  const sortedDays = Object.entries(dailyActivity).sort(([,a], [,b]) => (b as number) - (a as number));
  const mostActive = sortedDays[0]?.[0] || 'None';
  
  return {
    dailyActivity,
    mostActive,
    averageDaily: events.length / Object.keys(dailyActivity).length || 0,
    peakActivity: sortedDays[0]?.[1] || 0
  };
}

function analyzeTrends(events: any[]): string[] {
  const trends: string[] = [];
  
  // Category trends
  const categoryCounts = events.reduce((acc: Record<string, number>, event) => {
    acc[event.category] = (acc[event.category] || 0) + 1;
    return acc;
  }, {});
  
  const topCategories = Object.entries(categoryCounts)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 3);
    
  topCategories.forEach(([category, count]) => {
    trends.push(`${category} activities (${count} events)`);
  });
  
  return trends;
}

function analyzeOverallImpact(events: any[]) {
  const impactAreas = { political: 0, economic: 0, social: 0 };
  let count = 0;
  
  events.forEach(event => {
    if (event.impact) {
      impactAreas.political += event.impact.political || 0;
      impactAreas.economic += event.impact.economic || 0;
      impactAreas.social += event.impact.social || 0;
      count++;
    }
  });
  
  if (count === 0) return { dominant: 'Unknown', distribution: impactAreas };
  
  // Average the impacts
  Object.keys(impactAreas).forEach(key => {
    impactAreas[key as keyof typeof impactAreas] /= count;
  });
  
  const dominant = Object.entries(impactAreas).sort(([,a], [,b]) => b - a)[0][0];
  
  return { dominant, distribution: impactAreas };
}

function analyzeFigureProminence(events: any[]) {
  const figureCounts: Record<string, number> = {};
  
  events.forEach(event => {
    (event.figures || []).forEach((figure: string) => {
      figureCounts[figure] = (figureCounts[figure] || 0) + 1;
    });
  });
  
  const sortedFigures = Object.entries(figureCounts).sort(([,a], [,b]) => b - a);
  
  return {
    mostProminent: sortedFigures[0]?.[0],
    prominence: figureCounts,
    topFigures: sortedFigures.slice(0, 5).map(([name, count]) => ({ name, events: count }))
  };
}

function generateAnalysisSummary(events: any[], timelineSummary: any) {
  return {
    overview: `Timeline contains ${events.length} political events with average significance of ${timelineSummary.averageSignificance}`,
    keyInsights: [
      `${timelineSummary.highImpactEvents} high-impact events identified`,
      `${timelineSummary.dominantCategory} was the most active category`,
      `${timelineSummary.keyFigures.length} political figures involved`
    ],
    recommendations: [
      'Focus on high-significance events for detailed analysis',
      'Monitor connections between related events',
      'Track figure involvement patterns over time'
    ]
  };
}

async function createInteractiveTimeline(timeline: any, connections: any[], granularity: string) {
  const events = timeline.events;
  
  // Group events by time periods based on granularity
  const timeGroups = groupEventsByTime(events, granularity);
  
  // Create interactive elements
  const interactiveElements = {
    timeGroups,
    filters: createTimelineFilters(timeline),
    visualizations: createTimelineVisualizations(events),
    navigation: createTimelineNavigation(timeGroups, granularity)
  };
  
  return interactiveElements;
}

function groupEventsByTime(events: any[], granularity: string) {
  const groups: Record<string, any[]> = {};
  
  events.forEach(event => {
    const date = new Date(event.date);
    let groupKey = '';
    
    switch (granularity) {
      case 'day':
        groupKey = date.toISOString().split('T')[0];
        break;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        groupKey = weekStart.toISOString().split('T')[0];
        break;
      case 'month':
        groupKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
    }
    
    if (!groups[groupKey]) groups[groupKey] = [];
    groups[groupKey].push(event);
  });
  
  return groups;
}

function createTimelineFilters(timeline: any) {
  return {
    categories: timeline.categories.map((cat: any) => ({
      key: cat.key,
      name: cat.name,
      count: cat.eventCount,
      color: cat.color
    })),
    figures: timeline.figures.map((fig: any) => ({
      name: fig.name,
      role: fig.role,
      party: fig.party,
      count: fig.eventCount
    })),
    significance: {
      high: timeline.events.filter((e: any) => e.significance > 0.7).length,
      medium: timeline.events.filter((e: any) => e.significance > 0.4 && e.significance <= 0.7).length,
      low: timeline.events.filter((e: any) => e.significance <= 0.4).length
    }
  };
}

function createTimelineVisualizations(events: any[]) {
  return {
    categoryDistribution: events.reduce((acc: Record<string, number>, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {}),
    significanceDistribution: {
      high: events.filter(e => e.significance > 0.7).length,
      medium: events.filter(e => e.significance > 0.4 && e.significance <= 0.7).length,
      low: events.filter(e => e.significance <= 0.4).length
    },
    temporalDensity: events.reduce((acc: Record<string, number>, event) => {
      const month = new Date(event.date).toISOString().substring(0, 7);
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {})
  };
}

function createTimelineNavigation(timeGroups: Record<string, any[]>, granularity: string) {
  const sortedPeriods = Object.keys(timeGroups).sort();
  
  return {
    periods: sortedPeriods.map(period => ({
      key: period,
      label: formatPeriodLabel(period, granularity),
      eventCount: timeGroups[period].length,
      hasHighImpact: timeGroups[period].some(e => e.significance > 0.7)
    })),
    totalPeriods: sortedPeriods.length,
    granularity,
    navigation: {
      first: sortedPeriods[0],
      last: sortedPeriods[sortedPeriods.length - 1]
    }
  };
}

function formatPeriodLabel(period: string, granularity: string): string {
  switch (granularity) {
    case 'day':
      return new Date(period).toLocaleDateString();
    case 'week':
      return `Week of ${new Date(period).toLocaleDateString()}`;
    case 'month':
      const [year, month] = period.split('-');
      return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
    default:
      return period;
  }
}

function generateFallbackTimeline() {
  return {
    events: [
      {
        id: 'fallback-1',
        title: 'Timeline service temporarily unavailable',
        description: 'Political timeline generation is currently offline',
        date: new Date().toISOString(),
        category: 'governance',
        significance: 0.5
      }
    ],
    summary: { totalEvents: 1, dominantCategory: 'governance' },
    analysis: { insights: ['Service temporarily unavailable'] }
  };
}

export async function GET() {
  return NextResponse.json({
    message: 'Political Timeline Generator',
    timelineCategories: Object.entries(TIMELINE_CATEGORIES).map(([key, info]) => ({
      key,
      ...info
    })),
    politicalFigures: Object.entries(POLITICAL_FIGURES).map(([name, info]) => ({
      name,
      ...info
    })),
    features: [
      'Comprehensive event timeline',
      'Multi-source data integration',
      'Event connection analysis',
      'Interactive visualizations',
      'Political figure tracking',
      'Significance assessment',
      'Trend analysis',
      'Regional event mapping'
    ]
  });
}
