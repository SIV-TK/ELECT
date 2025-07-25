import { NextRequest, NextResponse } from 'next/server';
import { WebScraper } from '@/lib/web-scraper';
import { KenyaPoliticalDataService } from '@/lib/kenya-political-data';
import { getCampaignAdvice } from '@/ai/flows/get-campaign-advice';
import { z } from 'zod';

const requestSchema = z.object({
  candidateName: z.string().min(1, 'Candidate name is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { candidateName } = requestSchema.parse(body);

    // Scrape real-time political data about Kenya and the candidate
    const [newsData, socialData, govData, publicSentiment, politicalTrends, swotAnalysis] = await Promise.all([
      WebScraper.scrapeKenyanNews(candidateName),
      WebScraper.scrapeSocialMedia(candidateName),
      WebScraper.scrapeGovernmentData(candidateName),
      KenyaPoliticalDataService.fetchPoliticalSentiment(candidateName),
      KenyaPoliticalDataService.getKenyanPoliticalTrends(),
      KenyaPoliticalDataService.analyzePoliticianPerformance(candidateName)
    ]);

    // Compile comprehensive data
    const allData = [...newsData, ...socialData, ...govData];
    const trendingTopics = [...WebScraper.extractTrendingTopics(allData), ...politicalTrends];
    const publicConcerns = KenyaPoliticalDataService.compilePublicConcerns();
    const voterExpectations = KenyaPoliticalDataService.getVoterExpectations();
    
    // Generate comprehensive sentiment analysis
    const sentimentAnalysis = `
      Public Sentiment Analysis for ${candidateName}:
      ${WebScraper.compileSentimentAnalysis(publicSentiment.map(p => ({ title: p.source, content: p.content, source: p.source, timestamp: p.timestamp })), candidateName)}
      
      Key Public Concerns: ${publicConcerns.slice(0, 5).join(', ')}
      Voter Expectations: ${voterExpectations.slice(0, 5).join(', ')}
      
      SWOT Analysis:
      Strengths: ${swotAnalysis.strengths.join(', ')}
      Weaknesses: ${swotAnalysis.weaknesses.join(', ')}
      Opportunities: ${swotAnalysis.opportunities.join(', ')}
      Threats: ${swotAnalysis.threats.join(', ')}
    `;
    
    // Extract candidate's current stance from recent data
    const candidateStance = WebScraper.extractCandidateStance(allData, candidateName);

    // Generate AI-powered campaign advice
    const advice = await getCampaignAdvice({
      candidateName,
      trendingTopics: trendingTopics.join(', '),
      candidateCurrentStance: candidateStance,
      userSentimentAnalysis: sentimentAnalysis,
    });

    return NextResponse.json({
      success: true,
      data: {
        advice: advice.advice,
        metadata: {
          dataSourcesCount: newsData.length + socialData.length + govData.length + publicSentiment.length,
          trendingTopics: trendingTopics.slice(0, 8),
          publicConcerns: publicConcerns.slice(0, 5),
          voterExpectations: voterExpectations.slice(0, 5),
          swotAnalysis,
          lastUpdated: new Date().toISOString(),
        }
      }
    });

  } catch (error) {
    console.error('Campaign advice API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate campaign advice' 
      },
      { status: 500 }
    );
  }
}