// src/ai/flows/generate-education-content.ts
'use server';

import { ai } from '@/ai/genkit';
import { MODELS } from '@/ai/models';
import { KenyaPoliticalDataService } from '@/lib/kenya-political-data';

export interface GenerateEducationContentInput {
  topic: string;
  currentEvents?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Resource {
  title: string;
  type: 'article' | 'video' | 'document' | 'website';
  url: string;
  description: string;
}

export interface GenerateEducationContentOutput {
  topic: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  content: string;
  keyPoints: string[];
  quiz: QuizQuestion[];
  resources: Resource[];
}

export async function generateEducationContent(
  input: GenerateEducationContentInput
): Promise<GenerateEducationContentOutput> {
  try {
    // Get current political context
    const [voterExpectations, publicConcerns] = await Promise.all([
      KenyaPoliticalDataService.getVoterExpectations(),
      KenyaPoliticalDataService.compilePublicConcerns()
    ]);

    const educationPrompt = `
You are an expert civic educator specializing in Kenyan politics and governance. Create comprehensive educational content about the requested topic.

TOPIC: ${input.topic}
${input.currentEvents ? `CURRENT EVENTS CONTEXT: ${input.currentEvents}` : ''}

VOTER EXPECTATIONS: ${voterExpectations.slice(0, 5).join(', ')}
PUBLIC CONCERNS: ${publicConcerns.slice(0, 5).join(', ')}

TASK: Create educational content in JSON format:

{
  "topic": "${input.topic}",
  "level": "<beginner|intermediate|advanced>",
  "content": "<comprehensive educational content>",
  "keyPoints": ["<point1>", "<point2>", "<point3>", "<point4>", "<point5>"],
  "quiz": [
    {
      "question": "<question>",
      "options": ["<option1>", "<option2>", "<option3>", "<option4>"],
      "correctAnswer": <0-3>,
      "explanation": "<explanation>"
    }
  ],
  "resources": [
    {
      "title": "<resource title>",
      "type": "<article|video|document|website>",
      "url": "<url>",
      "description": "<description>"
    }
  ]
}

Guidelines:
1. Make content accessible to ordinary Kenyan citizens
2. Use simple language and practical examples
3. Include current Kenyan political context
4. Create 3-5 quiz questions to test understanding
5. Suggest relevant resources for further learning
6. Focus on civic education and democratic participation
7. Be factual, non-partisan, and educational

Ensure content helps citizens understand their role in Kenyan democracy.
    `;

    const response = await ai.generate({
      model: MODELS.DEEPSEEK_CHAT,
      prompt: educationPrompt,
      config: {
        temperature: 0.3,
        maxOutputTokens: 2000
      }
    });

    try {
      const result = JSON.parse(response.text || response.content?.[0]?.text || "");
      return {
        topic: result.topic || input.topic,
        level: result.level || 'beginner',
        content: result.content || `Educational content about ${input.topic} in the context of Kenyan politics and governance.`,
        keyPoints: result.keyPoints || [
          `Understanding ${input.topic} in Kenya`,
          'Historical context and development',
          'Current implementation and challenges',
          'Citizen rights and responsibilities',
          'Future prospects and reforms'
        ],
        quiz: result.quiz || [
          {
            question: `What is the main purpose of ${input.topic} in Kenya?`,
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 0,
            explanation: `This relates to how ${input.topic} functions in the Kenyan context.`
          }
        ],
        resources: result.resources || [
          {
            title: 'Kenya Constitution 2010',
            type: 'document',
            url: 'https://www.klrc.go.ke/index.php/constitution-of-kenya',
            description: 'Official constitutional document'
          }
        ]
      };
    } catch (parseError) {
      // Fallback educational content
      return {
        topic: input.topic,
        level: 'beginner',
        content: `${input.topic} is an important aspect of Kenyan governance and democracy. Understanding this topic helps citizens participate more effectively in democratic processes and hold leaders accountable. In the Kenyan context, this involves understanding constitutional provisions, government structures, and citizen rights and responsibilities.`,
        keyPoints: [
          `Basic understanding of ${input.topic}`,
          'Constitutional framework in Kenya',
          'Practical applications for citizens',
          'Rights and responsibilities',
          'How to get involved and participate'
        ],
        quiz: [
          {
            question: `Why is understanding ${input.topic} important for Kenyan citizens?`,
            options: [
              'It helps in democratic participation',
              'It is required by law',
              'It improves job prospects',
              'It is part of school curriculum'
            ],
            correctAnswer: 0,
            explanation: 'Understanding civic topics helps citizens participate effectively in democracy and hold leaders accountable.'
          }
        ],
        resources: [
          {
            title: 'Kenya Constitution 2010',
            type: 'document',
            url: 'https://www.klrc.go.ke/index.php/constitution-of-kenya',
            description: 'The supreme law of Kenya containing fundamental principles of governance'
          },
          {
            title: 'IEBC Voter Education',
            type: 'website',
            url: 'https://www.iebc.or.ke',
            description: 'Official electoral commission resources for voter education'
          }
        ]
      };
    }

  } catch (error) {
    console.error('Error generating education content:', error);
    
    return {
      topic: input.topic,
      level: 'beginner',
      content: `Educational content about ${input.topic} will help you understand this important aspect of Kenyan governance and your role as a citizen.`,
      keyPoints: [
        'Basic concepts and definitions',
        'Kenyan context and applications',
        'Citizen participation opportunities'
      ],
      quiz: [],
      resources: []
    };
  }
}