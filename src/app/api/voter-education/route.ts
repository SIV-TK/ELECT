import { NextRequest, NextResponse } from 'next/server';
import { generateEducationContent } from '@/ai/flows/generate-education-content';

async function fetchCurrentEvents() {
  // Mock real-time data - replace with actual news API
  return `Recent developments: 2027 election preparations underway, new voter registration drive launched, constitutional amendments being discussed in Parliament, IEBC conducting civic education campaigns across counties.`;
}

export async function POST(request: NextRequest) {
  try {
    const { topic } = await request.json();
    
    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    const currentEvents = await fetchCurrentEvents();
    const content = await generateEducationContent({ topic, currentEvents });
    
    return NextResponse.json(content);
  } catch (error) {
    console.error('Education content generation failed:', error);
    
    const fallback = {
      topic,
      level: 'beginner' as const,
      content: `Learn about ${topic} in the context of Kenyan governance and electoral processes. This topic covers essential civic knowledge that every Kenyan citizen should understand to participate effectively in democratic processes.`,
      keyPoints: [
        `Understanding ${topic} is crucial for informed citizenship`,
        'Kenya\'s constitution provides the framework for civic participation',
        'Citizens have both rights and responsibilities in democratic processes',
        'Electoral knowledge empowers voters to make informed decisions',
        'Civic education strengthens democratic institutions'
      ],
      quiz: [
        {
          question: `What is the primary importance of understanding ${topic}?`,
          options: ['Entertainment', 'Informed citizenship', 'Personal gain', 'Social status'],
          correct: 1
        },
        {
          question: 'Which document governs Kenya\'s democratic processes?',
          options: ['Parliamentary Act', 'Constitution 2010', 'Presidential Order', 'Court Decision'],
          correct: 1
        },
        {
          question: 'What strengthens democratic institutions?',
          options: ['Wealth', 'Civic education', 'Political power', 'Social status'],
          correct: 1
        }
      ],
      resources: [
        'Kenya Constitution 2010',
        'IEBC Voter Education Materials',
        'Parliamentary Hansard Records'
      ]
    };
    
    return NextResponse.json(fallback);
  }
}