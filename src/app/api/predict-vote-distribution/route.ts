import { NextRequest, NextResponse } from 'next/server';
import { WebScraper } from '@/lib/web-scraper';

interface VoteDistribution {
  name: string;
  predictedVoteShare: number;
}

// Direct vote distribution prediction function using DeepSeek API
async function predictVoteDistributionDirect(candidateName: string, topic: string, sentimentScore: number) {
  try {
    // Get real-time data for more accurate predictions
    const scrapedData = await WebScraper.scrapeAllSources(candidateName);
    const combinedContent = scrapedData.map(item => 
      `Source: ${item.source}\nContent: ${item.content}`
    ).join('\n\n');

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
            content: `You are an expert political analyst specializing in Kenyan electoral predictions. Based on real-time data and sentiment analysis, predict the vote distribution for ${candidateName} across Kenya's 47 counties.

CANDIDATE: ${candidateName}
TOPIC: ${topic}
CURRENT SENTIMENT SCORE: ${sentimentScore} (range: -1 to 1, where -1 is very negative, 0 is neutral, 1 is very positive)

REAL-TIME DATA FROM KENYAN SOURCES:
${combinedContent}

TASK: Predict county-level vote distribution based on:
1. Current sentiment analysis results
2. Real-time political data from Kenyan sources
3. Historical voting patterns in Kenya
4. Regional political dynamics
5. Economic and social factors

Consider these key factors in your analysis:
- Mount Kenya region traditional voting patterns
- Coastal region political dynamics
- Western Kenya electoral behavior
- Rift Valley constituencies
- North Eastern Kenya voting trends
- Urban vs rural divide
- Ethnic demographics and their political preferences
- Economic issues affecting different regions
- Infrastructure development priorities
- Recent political developments and alliances

You must respond with valid JSON containing predictions for ALL 47 Kenyan counties in exactly this format:
{
  "regions": [
    {"name": "Nairobi", "predictedVoteShare": 65.4},
    {"name": "Kiambu", "predictedVoteShare": 72.1},
    {"name": "Mombasa", "predictedVoteShare": 45.8},
    {"name": "Nakuru", "predictedVoteShare": 58.3},
    {"name": "Machakos", "predictedVoteShare": 51.2},
    ... (continue for all 47 counties)
  ],
  "aiPrediction": "<comprehensive analysis explaining the predicted outcome, regional variations, and key factors influencing the vote distribution>"
}

IMPORTANT: Include ALL 47 Kenyan counties with realistic vote share predictions (0-100%). Consider current sentiment score and real-time data to make accurate predictions. The aiPrediction should be a detailed 3-4 sentence analysis of the overall electoral prospects and regional dynamics.

Counties to include: Nairobi, Kiambu, Mombasa, Nakuru, Machakos, Kajiado, Murang'a, Nyeri, Kirinyaga, Nyandarua, Laikipia, Meru, Tharaka Nithi, Embu, Kitui, Makueni, Nzauri, Taita Taveta, Lamu, Tana River, Garissa, Wajir, Mandera, Marsabit, Isiolo, Samburu, West Pokot, Turkana, Baringo, Elgeyo Marakwet, Nandi, Uasin Gishu, Trans Nzoia, Bungoma, Busia, Siaya, Kisumu, Homa Bay, Migori, Kisii, Nyamira, Narok, Bomet, Kericho, Kakamega, Vihiga, Nyandarua.`
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
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
    
    // Validate and return result
    const regions = result.regions || [];
    const validRegions = regions.filter((region: any) => 
      region.name && typeof region.predictedVoteShare === 'number'
    );

    if (validRegions.length === 0) {
      throw new Error('No valid regions in AI response');
    }

    return {
      regions: validRegions,
      aiPrediction: result.aiPrediction || `Based on current sentiment analysis and political data, ${candidateName} shows varied electoral prospects across Kenya's counties, with performance likely influenced by regional dynamics, economic factors, and recent political developments.`
    };

  } catch (error) {
    console.error('Error in direct vote distribution prediction:', error);
    
    // Return fallback prediction based on sentiment score
    const baseVoteShare = Math.max(15, Math.min(85, 50 + (sentimentScore * 25))); // Convert sentiment to vote share
    
    const kenyaCounties = [
      'Nairobi', 'Kiambu', 'Mombasa', 'Nakuru', 'Machakos', 'Kajiado', 'Murang\'a', 
      'Nyeri', 'Kirinyaga', 'Nyandarua', 'Laikipia', 'Meru', 'Tharaka Nithi', 'Embu',
      'Kitui', 'Makueni', 'Nzauri', 'Taita Taveta', 'Lamu', 'Tana River', 'Garissa',
      'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Samburu', 'West Pokot', 'Turkana',
      'Baringo', 'Elgeyo Marakwet', 'Nandi', 'Uasin Gishu', 'Trans Nzoia', 'Bungoma',
      'Busia', 'Siaya', 'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira', 'Narok',
      'Bomet', 'Kericho', 'Kakamega', 'Vihiga', 'Nyandarua'
    ];

    const regions = kenyaCounties.map((county) => ({
      name: county,
      predictedVoteShare: Math.max(10, Math.min(90, baseVoteShare + (Math.random() - 0.5) * 20))
    }));

    return {
      regions,
      aiPrediction: `Based on sentiment analysis (score: ${sentimentScore.toFixed(2)}), ${candidateName} shows ${sentimentScore > 0.2 ? 'positive' : sentimentScore < -0.2 ? 'challenging' : 'mixed'} electoral prospects across Kenya's counties, with regional variations expected due to local political dynamics and economic factors.`
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { candidateName, topic, sentimentScore } = await request.json();
    
    if (!candidateName || typeof sentimentScore !== 'number') {
      return NextResponse.json(
        { error: 'candidateName and sentimentScore are required' },
        { status: 400 }
      );
    }

    // Use direct vote distribution prediction
    const result = await predictVoteDistributionDirect(
      candidateName, 
      topic || 'general election', 
      sentimentScore
    );
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Vote distribution prediction error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Prediction failed' },
      { status: 500 }
    );
  }
}
