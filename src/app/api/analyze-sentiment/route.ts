import { NextRequest, NextResponse } from 'next/server';
import { analyzeCandidateSentiment } from '@/ai/flows/analyze-candidate-sentiment';

export async function POST(request: NextRequest) {
  try {
    const { candidateName, topic } = await request.json();
    
    if (!candidateName || !topic) {
      return NextResponse.json(
        { error: 'candidateName and topic are required' },
        { status: 400 }
      );
    }

    const result = await analyzeCandidateSentiment({ candidateName, topic });
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Analysis failed' },
      { status: 500 }
    );
  }
}