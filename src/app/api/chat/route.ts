import { NextRequest, NextResponse } from 'next/server';
import { chat } from '@/ai/flows/political-chat';

// Set CORS headers for public access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message format' },
        { status: 400, headers: corsHeaders }
      );
    }

    console.log('Processing chat request:', message);

    // Add retry logic for better reliability with public access
    let retries = 3;
    let result;
    
    while (retries > 0) {
      try {
        result = await chat({ message });
        break;
      } catch (err) {
        retries--;
        if (retries === 0) throw err;
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before retry
      }
    }
    
    console.log('Received AI response:', result);

    return NextResponse.json({ 
      response: result.response 
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500, headers: corsHeaders }
    );
  }
}
