import { NextResponse } from 'next/server';

export async function GET() {
  const data = {
    activeCitizens: Math.floor(Math.random() * 100000) + 1200000,
    sentimentAnalyses: Math.floor(Math.random() * 1000) + 45000,
    livePolls: Math.floor(Math.random() * 10) + 20,
    chatMessages: Math.floor(Math.random() * 5000) + 85000,
    verifiedPoliticians: 1247,
    trendingTopics: [
      { 
        topic: "Healthcare Reform", 
        sentiment: (Math.random() - 0.5) * 2, 
        mentions: Math.floor(Math.random() * 5000) + 10000,
        growth: `${Math.random() > 0.5 ? '+' : '-'}${Math.floor(Math.random() * 20)}%`
      },
      { 
        topic: "Economic Policy", 
        sentiment: (Math.random() - 0.5) * 2, 
        mentions: Math.floor(Math.random() * 3000) + 8000,
        growth: `${Math.random() > 0.5 ? '+' : '-'}${Math.floor(Math.random() * 15)}%`
      }
    ],
    recentActivity: [
      {
        type: "sentiment",
        candidate: "William Ruto",
        score: Math.random(),
        time: `${Math.floor(Math.random() * 10) + 1} min ago`
      }
    ],
    timestamp: new Date().toISOString()
  };

  return NextResponse.json(data);
}