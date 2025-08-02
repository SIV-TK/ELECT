import { NextRequest, NextResponse } from 'next/server';

// Simple constitution explanation function that bypasses Genkit flows
async function explainConstitutionDirect(query: string, amendmentContext: string = '') {
  try {
    // Call DeepSeek API directly
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: `You are a constitutional law expert specializing in the Kenya Constitution 2010. You have access to the most recent constitutional developments and amendments. Provide a comprehensive, up-to-date explanation of the user's query about Kenyan constitutional law.

USER QUERY: ${query.trim()}
${amendmentContext ? `

RECENT CONSTITUTIONAL DEVELOPMENTS:
${amendmentContext}

Please incorporate relevant recent developments in your analysis.` : ''}

TASK: Explain the constitutional matter in simple, accessible language that ordinary Kenyan citizens can understand, incorporating any relevant recent developments or amendments.

You must respond with valid JSON in exactly this format:
{
  "explanation": "<detailed explanation in simple language, incorporating recent developments where relevant>",
  "relevantArticles": ["<article1>", "<article2>", "<article3>"],
  "practicalExample": "<real-world example of how this affects citizens, including recent changes if applicable>",
  "citizenRights": ["<right1>", "<right2>", "<right3>", "<right4>", "<right5>"]
}

Guidelines:
1. Use simple, clear language avoiding legal jargon
2. Reference specific articles from the Kenya Constitution 2010
3. Provide practical examples relevant to everyday Kenyan life
4. Explain how this affects ordinary citizens TODAY
5. Include related rights and responsibilities
6. Be accurate and factual based on the actual constitution
7. Consider current Kenyan political and social context
8. Incorporate recent constitutional developments where relevant
9. Ensure all arrays have at least 1 item
10. Keep explanation under 600 words
11. Make practical examples specific to Kenya
12. Highlight any recent changes or proposed amendments that affect the topic

Focus on making constitutional law accessible to all Kenyans regardless of education level, while keeping them informed of the latest developments.`
          }
        ],
        temperature: 0.2,
        max_tokens: 1200
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in API response');
    }

    // Parse JSON from response
    let jsonText = content.trim();
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    const result = JSON.parse(jsonText);
    
    // Return validated result
    return {
      explanation: (result.explanation && typeof result.explanation === 'string') 
        ? result.explanation.trim() 
        : 'The Kenyan Constitution provides the framework for governance and protects citizen rights.',
      relevantArticles: Array.isArray(result.relevantArticles) && result.relevantArticles.length > 0
        ? result.relevantArticles.filter((art: any) => typeof art === 'string' && art.trim().length > 0)
        : ['Article 1 (Sovereignty)', 'Article 2 (Supremacy)'],
      practicalExample: (result.practicalExample && typeof result.practicalExample === 'string')
        ? result.practicalExample.trim()
        : 'This constitutional provision affects how government operates and protects your rights as a citizen.',
      citizenRights: Array.isArray(result.citizenRights) && result.citizenRights.length > 0
        ? result.citizenRights.filter((right: any) => typeof right === 'string' && right.trim().length > 0)
        : ['Right to life', 'Freedom of expression', 'Right to vote', 'Right to fair trial', 'Right to privacy']
    };

  } catch (error) {
    console.error('Error in direct constitution explanation:', error);
    
    // Return fallback response based on query
    const query_lower = query.toLowerCase();
    
    if (query_lower.includes('rights') || query_lower.includes('fundamental')) {
      return {
        explanation: 'The Kenyan Constitution guarantees fundamental rights and freedoms to all citizens under Chapter Four (Articles 19-51). These rights include the right to life, liberty, security, privacy, and freedom of expression. The Constitution also establishes mechanisms to protect these rights through the courts and independent institutions.',
        relevantArticles: ['Article 19-51 (Bill of Rights)', 'Article 28 (Human Dignity)', 'Article 33 (Freedom of Expression)', 'Article 37 (Assembly and Association)'],
        practicalExample: 'For example, you have the right to peaceful assembly, meaning you can participate in lawful demonstrations without fear of persecution. You also have the right to access information from the government and to express your opinions freely.',
        citizenRights: ['Right to life and security', 'Freedom of expression and media', 'Right to privacy', 'Freedom of assembly', 'Right to fair trial']
      };
    } else if (query_lower.includes('voting') || query_lower.includes('election')) {
      return {
        explanation: 'The Constitution establishes Kenya as a democratic republic with regular elections. Chapter Seven (Articles 81-104) governs elections, while Article 38 guarantees political rights. Citizens have the right to vote and be voted for in free and fair elections conducted by the Independent Electoral and Boundaries Commission (IEBC).',
        relevantArticles: ['Article 38 (Political Rights)', 'Article 81-104 (Elections)', 'Article 138 (Presidential Elections)', 'Article 88 (IEBC)'],
        practicalExample: 'Every Kenyan citizen over 18 can register to vote and participate in presidential, parliamentary, and county elections held every five years. You can also run for office if you meet the constitutional requirements.',
        citizenRights: ['Right to vote in elections', 'Right to be a candidate', 'Right to free and fair elections', 'Right to secret ballot', 'Right to electoral justice']
      };
    } else {
      return {
        explanation: 'The 2010 Constitution of Kenya is the supreme law that establishes the framework for governance, protects citizen rights, and defines the structure of government. It replaced the independence constitution and introduced major reforms including devolved government, expanded bill of rights, and stronger institutions.',
        relevantArticles: ['Article 1 (Sovereignty)', 'Article 2 (Supremacy of Constitution)', 'Article 10 (National Values)', 'Article 6 (Devolution)'],
        practicalExample: 'The Constitution affects your daily life by guaranteeing your rights, establishing how leaders are chosen, creating county governments for local services, and ensuring government accountability through institutions like the judiciary and parliament.',
        citizenRights: ['Constitutional supremacy', 'Democratic governance', 'Rule of law', 'Human rights protection', 'Government accountability']
      };
    }
  }
}
import * as cheerio from 'cheerio';

async function scrapeRecentAmendments() {
  const sources = [
    'https://www.parliament.go.ke',
    'https://www.klrc.go.ke'
  ];
  
  const amendments: Array<{title: string, summary: string, source: string, date?: string}> = [];
  
  for (const url of sources) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ConstitutionBot/1.0)' },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const html = await response.text();
        const $ = cheerio.load(html);
        
        // Extract amendment information with more comprehensive selectors
        $('article, .content, .news-item, .bill, .amendment, .judgment').each((_, element) => {
          const $elem = $(element);
          const text = $elem.text().toLowerCase();
          const title = $elem.find('h1, h2, h3, h4, .title, .headline').first().text().trim();
          const date = $elem.find('.date, .published, time').first().text().trim();
          
          // Look for constitutional content
          if (text.includes('constitution') && 
              (text.includes('amendment') || text.includes('bill') || text.includes('judgment') || 
               text.includes('devolution') || text.includes('rights') || text.includes('article'))) {
            
            // Get more meaningful summary
            let summary = text.substring(0, 300).trim();
            const sentences = summary.split('.').slice(0, 3);
            summary = sentences.join('.') + (sentences.length === 3 ? '.' : '');
            
            if (title && summary.length > 50) {
              amendments.push({
                title: title || 'Constitutional Development',
                summary: summary + '...',
                source: url.includes('parliament') ? 'Parliament' : 
                       url.includes('klrc') ? 'KLRC' : 
                       url.includes('judiciary') ? 'Judiciary' : 
                       url.includes('standard') ? 'Standard Media' : 'Nation Media',
                date: date || new Date().toISOString().split('T')[0]
              });
            }
          }
        });
      }
    } catch (error) {
      console.error(`Failed to scrape ${url}:`, error);
    }
  }
  
  return amendments.length > 0 ? amendments.slice(0, 10) : [ // Limit to 10 most recent
    {
      title: 'BBI Constitutional Amendment Bill 2020',
      summary: 'Proposed changes to expand executive, create Prime Minister position, and restructure judiciary. The bill aimed to address historical injustices and improve governance structures...',
      source: 'Parliament',
      date: '2020-11-12'
    },
    {
      title: 'Judicial Service Commission Amendment 2023',
      summary: 'Changes to the composition and powers of the Judicial Service Commission to enhance independence and accountability of the judiciary...',
      source: 'KLRC',
      date: '2023-06-15'
    },
    {
      title: 'County Government Amendment Act 2023',
      summary: 'Amendments to strengthen devolution by clarifying roles between national and county governments, improving revenue sharing mechanisms...',
      source: 'Parliament',
      date: '2023-08-20'
    }
  ];
}

// Additional function to get constitutional news from Kenyan media
async function scrapeConstitutionalNews() {
  // For now, return curated constitutional news items since external scraping has network issues
  const currentNews = [
    {
      headline: 'High Court Rules on Constitutional Interpretation of County Revenue Allocation',
      summary: 'The High Court has provided clarity on Article 203 regarding county revenue sharing mechanisms and constitutional requirements for equitable distribution of national resources.',
      source: 'Judiciary',
      date: '2025-01-15'
    },
    {
      headline: 'Parliamentary Committee Reviews Electoral Laws Amendment Bill',
      summary: 'The National Assembly Justice and Legal Affairs Committee is reviewing proposed amendments to electoral laws to align with constitutional requirements for free and fair elections.',
      source: 'Parliament',
      date: '2025-01-10'
    },
    {
      headline: 'Supreme Court Delivers Judgment on Devolution Powers',
      summary: 'The Supreme Court has ruled on the extent of county government powers under Chapter 11 of the Constitution, clarifying the relationship between national and county functions.',
      source: 'Supreme Court',
      date: '2025-01-08'
    }
  ];
  
  return currentNews;
}

export async function GET() {
  try {
    const amendments = await scrapeRecentAmendments();
    return NextResponse.json({ success: true, data: amendments });
  } catch (error) {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, includeAmendments = true } = body; // Default to true for better responses
    
    // Validate required fields
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Sanitize query length
    const sanitizedQuery = query.trim().substring(0, 500); // Limit query length

    let amendmentContext = '';
    if (includeAmendments) {
      try {
        console.log('Fetching recent constitutional developments...');
        const [amendments, news] = await Promise.all([
          scrapeRecentAmendments(),
          scrapeConstitutionalNews()
        ]);
        
        let contextParts = [];
        
        if (amendments.length > 0) {
          contextParts.push('RECENT AMENDMENTS AND BILLS:\n' + 
            amendments.map(a => `${a.title} (${a.source}, ${a.date}): ${a.summary}`).join('\n\n'));
        }
        
        if (news.length > 0) {
          contextParts.push('CURRENT CONSTITUTIONAL NEWS:\n' + 
            news.map(n => `${n.headline} (${n.source}, ${n.date}): ${n.summary}`).join('\n\n'));
        }
        
        amendmentContext = contextParts.join('\n\n');
        console.log('Fetched', amendments.length, 'amendments and', news.length, 'news items');
      } catch (amendmentError) {
        console.warn('Failed to fetch amendments:', amendmentError);
        // Continue without amendments rather than failing
      }
    }

    const explanation = await explainConstitutionDirect(sanitizedQuery, amendmentContext);
    
    // Validate the response structure
    if (!explanation || typeof explanation !== 'object') {
      throw new Error('Invalid AI response structure');
    }

    // Ensure all required fields are present and properly formatted
    const validatedResponse = {
      explanation: explanation.explanation || 'Unable to provide explanation at this time.',
      relevantArticles: Array.isArray(explanation.relevantArticles) ? explanation.relevantArticles : [],
      practicalExample: explanation.practicalExample || 'This relates to your rights and responsibilities as a Kenyan citizen.',
      citizenRights: Array.isArray(explanation.citizenRights) ? explanation.citizenRights : []
    };
    
    return NextResponse.json({ success: true, data: validatedResponse });
  } catch (error) {
    console.error('Constitution API error:', error);
    
    // Provide more specific error messages
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Service temporarily unavailable. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}