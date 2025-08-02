import { NextRequest, NextResponse } from 'next/server';
import { WebScraper } from '@/lib/web-scraper';
import { getCampaignAdvice } from '@/ai/flows/get-campaign-advice';
import { z } from 'zod';

const requestSchema = z.object({
  politicianName: z.string().min(1, 'Politician name is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { politicianName } = requestSchema.parse(body);

    const [newsData, socialData, govData] = await Promise.all([
      WebScraper.scrapeKenyanNews(`${politicianName} education academic`),
      WebScraper.scrapeSocialMedia(`${politicianName} school university`),
      WebScraper.scrapeGovernmentData(politicianName)
    ]);

    const allData = [...newsData, ...socialData, ...govData];
    const academicInfo = allData.map(item => item.content).join(' ');

    const aiAnalysis = await getCampaignAdvice({
      candidateName: politicianName,
      trendingTopics: 'education, academic background, qualifications',
      candidateCurrentStance: academicInfo,
      userSentimentAnalysis: `Academic background analysis for ${politicianName} based on real-time data from news sources, social media, and government records.`
    });

    return NextResponse.json({
      success: true,
      data: {
        narrative: (aiAnalysis as any).advice || 'No analysis available',
        dataPoints: allData.length,
        lastUpdated: new Date().toISOString(),
      }
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to analyze academic data' },
      { status: 500 }
    );
  }
}