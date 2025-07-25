import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/ai/genkit';

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();

    const prompt = `You are an expert civic education tutor specializing in Kenyan democracy and electoral processes. Create comprehensive educational content about: "${topic}"

Provide:
1. Educational level (beginner/intermediate/advanced)
2. Clear, informative content (2-3 paragraphs)
3. 5 key learning points
4. 3 quiz questions with 4 multiple choice options each
5. 3 additional learning resources

Focus on Kenyan context including:
- Constitution of Kenya 2010
- IEBC processes and procedures
- County and national government structures
- Citizen rights and responsibilities
- Electoral laws and regulations

Respond in JSON format:
{
  "topic": string,
  "level": string,
  "content": string,
  "keyPoints": string[],
  "quiz": [
    {
      "question": string,
      "options": string[],
      "correct": number
    }
  ],
  "resources": string[]
}`;

    const response = await ai.generate(prompt);
    
    let education;
    try {
      const jsonMatch = response.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        education = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found');
      }
    } catch {
      // Fallback education content
      const levels = ['beginner', 'intermediate', 'advanced'];
      const level = levels[Math.floor(Math.random() * levels.length)];
      
      education = {
        topic,
        level,
        content: `This educational content covers ${topic} in the context of Kenyan democracy. Understanding this topic is essential for informed civic participation and effective engagement in democratic processes. The information provided here is based on Kenya's Constitution 2010 and current electoral laws.`,
        keyPoints: [
          `Key aspect of ${topic} in Kenyan context`,
          'Constitutional provisions and legal framework',
          'Citizen rights and responsibilities',
          'Practical application in elections',
          'Impact on democratic participation'
        ],
        quiz: [
          {
            question: `What is the primary importance of ${topic} in Kenya's democracy?`,
            options: [
              'Ensures transparent governance',
              'Promotes citizen participation',
              'Maintains constitutional order',
              'All of the above'
            ],
            correct: 3
          },
          {
            question: 'Which document primarily governs this aspect of Kenyan democracy?',
            options: [
              'Constitution of Kenya 2010',
              'Elections Act',
              'Political Parties Act',
              'County Governments Act'
            ],
            correct: 0
          },
          {
            question: 'Who is responsible for overseeing this process?',
            options: [
              'National Assembly',
              'Judiciary',
              'IEBC',
              'Executive'
            ],
            correct: 2
          }
        ],
        resources: [
          'Constitution of Kenya 2010 - Official Document',
          'IEBC Voter Education Materials',
          'Kenya Law Reports - Electoral Laws'
        ]
      };
    }

    return NextResponse.json(education);
  } catch (error) {
    console.error('Voter education error:', error);
    return NextResponse.json({ error: 'Education content generation failed' }, { status: 500 });
  }
}