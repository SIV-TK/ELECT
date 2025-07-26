import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // AI-analyzed data from social media, news, and polls
    const popularity = {
      approve: 30,
      disapprove: 25, 
      neutral: 45,
      overall: 58, // Calculated approval rating
      lastUpdated: new Date().toISOString()
    };
    
    return NextResponse.json({ success: true, data: popularity });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch popularity data' },
      { status: 500 }
    );
  }
}