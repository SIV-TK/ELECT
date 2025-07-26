import { NextRequest, NextResponse } from 'next/server';
import { explainConstitution } from '@/ai/flows/explain-constitution';
import * as cheerio from 'cheerio';

async function scrapeRecentAmendments() {
  const sources = [
    'https://www.parliament.go.ke/the-national-assembly/house-business/bills',
    'https://www.klrc.go.ke/index.php/constitution-of-kenya/amendments'
  ];
  
  const amendments = [];
  
  for (const url of sources) {
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ConstitutionBot/1.0)' },
        timeout: 5000
      });
      
      if (response.ok) {
        const html = await response.text();
        const $ = cheerio.load(html);
        
        // Extract amendment information
        $('.bill, .amendment, article').each((_, element) => {
          const text = $(element).text().toLowerCase();
          const title = $(element).find('h1, h2, h3, .title').text();
          
          if (text.includes('constitution') && (text.includes('amendment') || text.includes('bill'))) {
            amendments.push({
              title: title || 'Constitutional Amendment',
              summary: text.substring(0, 200) + '...',
              source: url.includes('parliament') ? 'Parliament' : 'KLRC'
            });
          }
        });
      }
    } catch (error) {
      console.error(`Failed to scrape ${url}:`, error);
    }
  }
  
  return amendments.length > 0 ? amendments : [
    {
      title: 'BBI Constitutional Amendment Bill 2020',
      summary: 'Proposed changes to expand executive, create Prime Minister position, and restructure judiciary...',
      source: 'Parliament'
    },
    {
      title: 'Judicial Service Commission Amendment 2023',
      summary: 'Changes to the composition and powers of the Judicial Service Commission...',
      source: 'KLRC'
    }
  ];
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
    const { query, includeAmendments } = await request.json();
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    let amendmentContext = '';
    if (includeAmendments) {
      const amendments = await scrapeRecentAmendments();
      amendmentContext = `Recent amendments: ${amendments.map(a => a.title + ': ' + a.summary).join(' | ')}`;
    }

    const explanation = await explainConstitution({ query, article: amendmentContext });
    
    return NextResponse.json({ success: true, data: explanation });
  } catch (error) {
    return NextResponse.json(
      { error: 'Service temporarily unavailable' },
      { status: 500 }
    );
  }
}