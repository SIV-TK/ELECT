import axios from 'axios';
import * as cheerio from 'cheerio';

interface ScrapedData {
  title: string;
  content: string;
  source: string;
  timestamp: Date;
}

export class WebScraper {
  private static readonly KENYAN_NEWS_SOURCES = [
    'https://www.nation.co.ke',
    'https://www.standardmedia.co.ke',
    'https://www.kbc.co.ke',
    'https://www.capitalfm.co.ke'
  ];

  static async scrapeKenyanNews(candidateName: string): Promise<ScrapedData[]> {
    const results: ScrapedData[] = [];
    const searchTerms = `${candidateName}`.toLowerCase();

    try {
      // Search Google News for recent articles about the politician
      const googleNewsUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(searchTerms + ' Kenya politics')}&hl=en-KE&gl=KE&ceid=KE:en`;
      
      const response = await axios.get(googleNewsUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data, { xmlMode: true });
      
      $('item').slice(0, 5).each((_, element) => {
        const title = $(element).find('title').text();
        const description = $(element).find('description').text();
        const link = $(element).find('link').text();
        
        if (title && description) {
          results.push({
            title: title.trim(),
            content: description.trim(),
            source: link || 'Google News',
            timestamp: new Date()
          });
        }
      });

    } catch (error) {
      console.error('Error scraping news:', error);
    }

    return results;
  }

  static async scrapeSocialMedia(candidateName: string): Promise<ScrapedData[]> {
    // Simulate social media data (in production, you'd use Twitter API, etc.)
    const mockSocialData: ScrapedData[] = [
      {
        title: `Recent discussions about ${candidateName}`,
        content: `Public sentiment analysis shows varied reactions to ${candidateName}'s recent activities, policies, and public statements. Citizens are actively discussing their performance and political positions.`,
        source: 'Social Media Aggregator',
        timestamp: new Date()
      },
      {
        title: `Trending: ${candidateName}`,
        content: `Latest social media trends show ${candidateName} is generating significant public attention across various political topics and current events. Engagement metrics indicate active public discourse.`,
        source: 'Social Media Trends',
        timestamp: new Date()
      }
    ];

    return mockSocialData;
  }

  static async scrapeGovernmentData(candidateName: string): Promise<ScrapedData[]> {
    const results: ScrapedData[] = [];

    try {
      // Scrape Kenya government websites for official statements
      const govSources = [
        'https://www.president.go.ke',
        'https://www.parliament.go.ke'
      ];

      // Simulate government data scraping
      results.push({
        title: `Official records and statements involving ${candidateName}`,
        content: `Government records, official statements, policy positions, and recent activities involving ${candidateName}. Includes parliamentary proceedings, official communications, and press releases.`,
        source: 'Kenya Government Portal',
        timestamp: new Date()
      });

    } catch (error) {
      console.error('Error scraping government data:', error);
    }

    return results;
  }

  static async scrapeAllSources(candidateName: string): Promise<ScrapedData[]> {
    const [newsData, socialData, govData] = await Promise.all([
      this.scrapeKenyanNews(candidateName),
      this.scrapeSocialMedia(candidateName),
      this.scrapeGovernmentData(candidateName)
    ]);

    return [...newsData, ...socialData, ...govData];
  }
}