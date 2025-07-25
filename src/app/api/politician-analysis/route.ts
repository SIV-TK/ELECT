import { NextRequest, NextResponse } from 'next/server';
import { WebScraper } from '@/lib/web-scraper';
import { KenyaPoliticalDataService } from '@/lib/kenya-political-data';
import { z } from 'zod';

const requestSchema = z.object({
  politicianName: z.string().min(1, 'Politician name is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { politicianName } = requestSchema.parse(body);

    // Scrape real-time data about the politician
    const [newsData, socialData, govData, politicalSentiment] = await Promise.all([
      WebScraper.scrapeKenyanNews(politicianName),
      WebScraper.scrapeSocialMedia(politicianName),
      WebScraper.scrapeGovernmentData(politicianName),
      KenyaPoliticalDataService.fetchPoliticalSentiment(politicianName)
    ]);

    // Analyze the data
    const allData = [...newsData, ...socialData, ...govData];
    const trendingTopics = WebScraper.extractTrendingTopics(allData);
    const recentActivities = allData.slice(0, 5).map(item => item.content);
    const publicSentiment = politicalSentiment.map(p => p.content).join(' ');

    return NextResponse.json({
      success: true,
      data: {
        recentNews: newsData.slice(0, 3),
        socialSentiment: socialData.slice(0, 3),
        governmentData: govData.slice(0, 2),
        trendingTopics: trendingTopics.slice(0, 5),
        recentActivities,
        publicSentiment,
        lastUpdated: new Date().toISOString(),
      }
    });

  } catch (error) {
    console.error('Politician analysis API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to analyze politician data' 
      },
      { status: 500 }
    );
  }
}