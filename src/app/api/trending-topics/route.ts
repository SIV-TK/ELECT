import { NextResponse } from 'next/server';

export async function GET() {
  try {
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
      { topic: "Security Concerns", mentions: 8100, sentiment: -0.67, trend: "down" },
      { topic: "Women Rights", mentions: 7600, sentiment: 0.82, trend: "up" },
      { topic: "Digital Governance", mentions: 6800, sentiment: 0.56, trend: "up" },
      { topic: "Food Security", mentions: 6200, sentiment: -0.34, trend: "down" },
      { topic: "Energy Policy", mentions: 5900, sentiment: 0.23, trend: "stable" },
      { topic: "Transport System", mentions: 5400, sentiment: 0.12, trend: "stable" }
    ];
    
    return NextResponse.json({ success: true, data: topics });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch trending topics' },
      { status: 500 }
    );
  }
}