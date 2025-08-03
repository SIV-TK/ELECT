import { NextRequest, NextResponse } from 'next/server';

interface FactCheckRequest {
  statement: string;
}

interface FactCheckResponse {
  statement: string;
  verdict: 'true' | 'false' | 'misleading' | 'unverified';
  confidence: number;
  explanation: string;
  context: string;
  sources: string[];
  relatedClaims: string[];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { statement }: FactCheckRequest = body;

    // Validate input
    if (!statement || typeof statement !== 'string' || statement.trim().length === 0) {
      return NextResponse.json(
        { error: 'Statement is required and must be a non-empty string' }, 
        { status: 400 }
      );
    }

    if (statement.length > 1000) {
      return NextResponse.json(
        { error: 'Statement too long. Maximum 1000 characters allowed.' }, 
        { status: 400 }
      );
    }

    const factCheckResult = await performFactCheck(statement.trim());
    return NextResponse.json(factCheckResult);

  } catch (error) {
    console.error('Fact check error:', error);
    return NextResponse.json(
      { error: 'Internal server error during fact checking' }, 
      { status: 500 }
    );
  }
}

async function performFactCheck(statement: string): Promise<FactCheckResponse> {
  try {
    const prompt = `You are a fact-checker for Kenyan political statements. Analyze this statement and provide a JSON response.

Statement: "${statement}"

Provide your analysis in this exact JSON format:
{
  "statement": "${statement}",
  "verdict": "true|false|misleading|unverified",
  "confidence": 0.75,
  "explanation": "Clear explanation of why this verdict was reached",
  "context": "Relevant context about Kenyan politics",
  "sources": ["Relevant sources or data points"],
  "relatedClaims": ["Related political claims or topics"]
}

Guidelines:
- Use "true" for factually accurate statements
- Use "false" for demonstrably incorrect statements  
- Use "misleading" for partially true but lacking context
- Use "unverified" for claims that cannot be confirmed
- Confidence should be 0.0-1.0
- Focus on Kenyan political context`;

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 600
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.choices?.[0]?.message?.content;
    
    if (responseText) {
      let jsonText = responseText.trim();
      jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (isValidFactCheckResponse(parsed)) {
          return parsed;
        }
      }
    }
    
    return generateFallbackResponse(statement);
    
  } catch (error) {
    console.error('AI fact check failed:', error);
    return generateFallbackResponse(statement);
  }
}

function isValidFactCheckResponse(obj: any): obj is FactCheckResponse {
  return (
    obj &&
    typeof obj.statement === 'string' &&
    ['true', 'false', 'misleading', 'unverified'].includes(obj.verdict) &&
    typeof obj.confidence === 'number' &&
    obj.confidence >= 0 && obj.confidence <= 1 &&
    typeof obj.explanation === 'string' &&
    typeof obj.context === 'string' &&
    Array.isArray(obj.sources) &&
    Array.isArray(obj.relatedClaims)
  );
}

function generateFallbackResponse(statement: string): FactCheckResponse {
  return {
    statement,
    verdict: 'unverified',
    confidence: 0.5,
    explanation: 'Unable to verify this statement with available information. Please check with official sources.',
    context: 'This statement requires verification from authoritative Kenyan political sources.',
    sources: ['Official Government Sources', 'Credible News Outlets', 'Verified Social Media'],
    relatedClaims: ['Political statements require verification', 'Check multiple sources']
  };
}

export async function GET() {
  return NextResponse.json({
    message: 'Fact Check API',
    description: 'AI-powered fact checking for Kenyan political statements',
    usage: {
      method: 'POST',
      body: {
        statement: 'Political statement to fact-check (required, max 1000 chars)'
      }
    },
    verdicts: {
      true: 'Statement is factually accurate',
      false: 'Statement is demonstrably incorrect',
      misleading: 'Statement is partially true but lacks context',
      unverified: 'Statement cannot be confirmed with available information'
    }
  });
}