import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/ai/genkit';
import { MODELS } from '@/ai/models';
import { WebScraper } from '@/lib/web-scraper';
import { KenyaPoliticalDataService } from '@/lib/kenya-political-data';

// Language mappings for Kenyan languages
const LANGUAGE_MAPPINGS: Record<string, string> = {
  'en': 'English',
  'sw': 'Kiswahili', 
  'ki': 'Kikuyu',
  'luo': 'Luo'
};

// Political context for different languages
const POLITICAL_CONTEXT: Record<string, string> = {
  'en': 'Respond about Kenyan politics in clear, educational English. Focus on facts, constitutional law, and civic education.',
  'sw': 'Jibu kuhusu siasa za Kenya kwa Kiswahili rahisi. Zingatia ukweli, sheria ya katiba, na elimu ya uraia.',
  'ki': 'Respond about Kenyan politics in Kikuyu language, focusing on constitutional rights and civic duties.',
  'luo': 'Respond about Kenyan politics in Luo language, emphasizing democratic participation and governance.'
};

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    const { 
      message, 
      language = 'en', 
      responseStyle = 'detailed',
      includeRealTimeData = true,
      conversationHistory = [],
      county = null
    } = await request.json();

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Validate language
    if (!LANGUAGE_MAPPINGS[language]) {
      return NextResponse.json(
        { error: 'Unsupported language' },
        { status: 400 }
      );
    }

    // Get real-time political data if requested
    let realTimeContext = '';
    if (includeRealTimeData) {
      try {
        const [newsData, politicalData] = await Promise.all([
          WebScraper.scrapeKenyanNews(message.substring(0, 50)),
          KenyaPoliticalDataService.fetchPoliticalSentiment(message.substring(0, 50))
        ]);

        const combinedData = [...newsData.slice(0, 3), ...politicalData.slice(0, 2)];
        realTimeContext = combinedData.map(item => 
          `Source: ${item.source} - ${item.content.substring(0, 200)}`
        ).join('\n');
      } catch (error) {
        console.warn('Failed to fetch real-time data:', error);
      }
    }

    // Build conversation context
    const conversationContext = conversationHistory
      .slice(-6) // Keep last 6 messages for context
      .map((msg: ChatMessage) => `${msg.role}: ${msg.content}`)
      .join('\n');

    // Build response style instructions
    const styleInstructions: Record<string, string> = {
      'concise': 'Give brief, direct answers. Maximum 100 words.',
      'detailed': 'Provide comprehensive explanations with examples. 200-400 words.',
      'academic': 'Give in-depth analysis with sources and references. Include constitutional articles where relevant.'
    };

    // County-specific context
    const countyContext = county ? 
      `Focus specifically on ${county} County politics, governance, and local issues.` : 
      'Cover national Kenyan politics and governance.';

    // Construct the AI prompt
    const systemPrompt = `You are a knowledgeable AI assistant specializing in Kenyan politics and governance. 

LANGUAGE: Respond in ${LANGUAGE_MAPPINGS[language]}
CONTEXT: ${POLITICAL_CONTEXT[language]}
STYLE: ${styleInstructions[responseStyle]}
LOCATION: ${countyContext}

CONVERSATION HISTORY:
${conversationContext}

CURRENT NEWS & DATA:
${realTimeContext}

GUIDELINES:
1. Be factual and non-partisan
2. Explain complex political concepts simply
3. Reference the Kenya Constitution 2010 when relevant
4. Promote democratic values and civic participation
5. If discussing sensitive topics, encourage peace and unity
6. For county-specific questions, provide local governance context
7. Always encourage citizens to verify information from official sources

USER QUESTION: ${message}

Respond helpfully and educationally about Kenyan politics in ${LANGUAGE_MAPPINGS[language]}.`;

    // Generate AI response
    const response = await ai.generate({
      model: MODELS.DEEPSEEK_CHAT,
      prompt: systemPrompt,
      config: { 
        temperature: 0.3, 
        maxOutputTokens: responseStyle === 'academic' ? 800 : 
                        responseStyle === 'detailed' ? 500 : 200
      }
    });

    const aiResponse = response.text || 'Samahani, sikuweza kuzalisha jibu la kutosha.';

    // Extract key topics mentioned
    const keyTopics = extractKeyTopics(message, language);

    // Determine response confidence based on real-time data availability
    const confidence = realTimeContext.length > 100 ? 0.9 : 0.7;

    // Suggest follow-up questions
    const followUpQuestions = generateFollowUpQuestions(message, language, county);

    return NextResponse.json({
      success: true,
      data: {
        response: aiResponse,
        language: language,
        responseStyle: responseStyle,
        confidence: confidence,
        keyTopics: keyTopics,
        followUpQuestions: followUpQuestions,
        hasRealTimeData: realTimeContext.length > 0,
        county: county,
        timestamp: new Date().toISOString(),
        sources: realTimeContext ? ['Recent Kenyan News', 'Political Analysis'] : []
      }
    });

  } catch (error) {
    console.error('Multi-language AI chat error:', error);
    
    // Provide fallback response in requested language
    const fallbackResponses: Record<string, string> = {
      'en': 'I apologize, but I encountered an issue processing your question. Please try again or contact support.',
      'sw': 'Samahani, nimepata tatizo katika kuchakata swali lako. Tafadhali jaribu tena au wasiliana na msaada.',
      'ki': 'Ngathaithe, nkorire na mathina ma guthiithania kiuria giaku. Ndaguthaitha ugerie ringu kana uthaire ateithia.',
      'luo': 'Awacho kechi, asenyo gi thilo e tich gi penjoni mari. Karem itiem kendo kata ithur jo-konyo.'
    };

    const { language: reqLanguage = 'en' } = await request.json().catch(() => ({ language: 'en' }));

    return NextResponse.json({
      success: false,
      error: 'AI service temporarily unavailable',
      fallbackResponse: fallbackResponses[reqLanguage] || fallbackResponses['en']
    }, { status: 500 });
  }
}

function extractKeyTopics(message: string, language: string): string[] {
  const topicKeywords: Record<string, Record<string, string[]>> = {
    'en': {
      'constitution': ['constitution', 'rights', 'bill of rights', 'constitutional'],
      'elections': ['election', 'voting', 'candidate', 'poll', 'ballot'],
      'government': ['government', 'president', 'parliament', 'governor', 'county'],
      'corruption': ['corruption', 'ethics', 'integrity', 'transparency'],
      'devolution': ['devolution', 'county government', 'local government'],
      'economy': ['economy', 'budget', 'tax', 'development', 'employment']
    },
    'sw': {
      'katiba': ['katiba', 'haki', 'haki za kiraia'],
      'uchaguzi': ['uchaguzi', 'kupiga kura', 'mgombea', 'urais'],
      'serikali': ['serikali', 'rais', 'bunge', 'gavana', 'kaunti'],
      'rushwa': ['rushwa', 'maadili', 'uwazi'],
      'ugatuzi': ['ugatuzi', 'serikali za kaunti'],
      'uchumi': ['uchumi', 'bajeti', 'kodi', 'maendeleo']
    }
  };

  const topics: string[] = [];
  const keywords = topicKeywords[language] || topicKeywords['en'];
  const lowerMessage = message.toLowerCase();

  Object.entries(keywords).forEach(([topic, words]) => {
    if (Array.isArray(words) && words.some((word: string) => lowerMessage.includes(word.toLowerCase()))) {
      topics.push(topic);
    }
  });

  return topics.length > 0 ? topics : ['general-politics'];
}

function generateFollowUpQuestions(message: string, language: string, county: string | null): string[] {
  const followUps: Record<string, string[]> = {
    'en': [
      'What are the constitutional rights of Kenyan citizens?',
      'How does the electoral process work in Kenya?',
      'What is the role of county governments?',
      'How can citizens participate in governance?'
    ],
    'sw': [
      'Haki za kiraia ni zipi katika katiba ya Kenya?',
      'Mchakato wa uchaguzi unafanyikaje Kenya?',
      'Jukumu la serikali za kaunti ni nini?',
      'Wananchi wanaweza kushiriki vipi katika utawala?'
    ],
    'ki': [
      'Kihonia kia athereshi a Kenya ni kiria?',
      'Guthura athuri ni gutiike atia Kenya?',
      'Wira wa thirikari cia matundu ni uriu?',
      'Athereshi mangihota kugia athiinire wa thirikari atia?'
    ],
    'luo': [
      'Rateng gi jo-Kenya en nadi e chik?',
      'Yiero mar jotelo tiyo nade e Kenya?',
      'Tich mar gweng-gi en nadi?',
      'Jo-pinyni nyalo donjo e tich pinyruoth nade?'
    ]
  };

  let questions = followUps[language] || followUps['en'];

  // Add county-specific follow-up if county is specified
  if (county) {
    const countyQuestions: Record<string, string[]> = {
      'en': [`What are the key issues in ${county} County?`, `Who is the current governor of ${county} County?`],
      'sw': [`Masuala makuu ya Kaunti ya ${county} ni yapi?`, `Gavana wa sasa wa Kaunti ya ${county} ni nani?`]
    };
    
    const countyQs = countyQuestions[language] || countyQuestions['en'];
    questions = [...countyQs, ...questions.slice(0, 2)];
  }

  return questions.slice(0, 4);
}

export async function GET() {
  return NextResponse.json({
    message: 'Multi-language Political Q&A Bot API',
    supportedLanguages: Object.keys(LANGUAGE_MAPPINGS),
    features: [
      'Multi-language support (English, Kiswahili, Kikuyu, Luo)',
      'Real-time political data integration',
      'County-specific analysis',
      'Constitutional guidance',
      'Conversation history',
      'Follow-up suggestions'
    ]
  });
}
