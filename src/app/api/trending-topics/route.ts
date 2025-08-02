import { NextResponse } from 'next/server';
import { analyzeTrendingTopics } from '@/ai/flows/analyze-trending-topics';

export async function GET() {
  try {
    // Try to get real-time AI insights first
    try {
      const aiResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/integrated-ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'real_time_insights' })
      });

      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        
        // Convert AI insights format to trending topics format
        const topics = aiData.trendingTopics?.map((topic: any) => ({
          topic: topic.topic,
          mentions: topic.mentions,
          sentiment: topic.sentiment,
          trend: topic.growth?.startsWith('+') ? 'up' : 
                 topic.growth?.startsWith('-') ? 'down' : 'stable'
        })) || [];

        if (topics.length > 0) {
          return NextResponse.json({ success: true, data: topics });
        }
      }
    } catch (aiError) {
      console.log('AI trending topics unavailable, using AI flow fallback');
    }

    // Fallback to AI flow
    try {
      const aiFlowResult = await analyzeTrendingTopics({
        rawTopics: 'Kenya political discussions',
        region: 'Kenya'
      });

      const topics = aiFlowResult.topics.map(topic => ({
        topic: topic.topic,
        mentions: topic.mentions,
        sentiment: topic.sentiment,
        trend: topic.trend
      }));

      return NextResponse.json({ success: true, data: topics });
    } catch (flowError) {
      console.log('AI flow unavailable, using static data');
    }

    // Final fallback to static data
    const topics = [
      { topic: "Kenya Elections 2027", mentions: 45230, sentiment: 0.65, trend: "up" },
      { topic: "Cost of Living", mentions: 38940, sentiment: -0.42, trend: "down" },
      { topic: "Healthcare Reform", mentions: 23450, sentiment: 0.58, trend: "up" },
      { topic: "Corruption Watch", mentions: 19870, sentiment: -0.73, trend: "down" },
      { topic: "Youth Unemployment", mentions: 15670, sentiment: -0.56, trend: "down" },
      { topic: "Infrastructure Development", mentions: 12340, sentiment: 0.78, trend: "up" },
      { topic: "Education Reform", mentions: 11200, sentiment: 0.34, trend: "stable" },
      { topic: "Climate Change", mentions: 9800, sentiment: 0.45, trend: "up" },
      { topic: "Tax Policy", mentions: 8900, sentiment: -0.23, trend: "down" },
      { topic: "Security Concerns", mentions: 8100, sentiment: -0.67, trend: "down" }
    ];
    
    return NextResponse.json({ success: true, data: topics });
  } catch (error) {
    console.error('Trending topics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending topics' },
      { status: 500 }
    );
  }
}