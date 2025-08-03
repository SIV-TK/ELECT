import axios from 'axios';
import * as cheerio from 'cheerio';

interface ScrapedData {
  title: string;
  content: string;
  source: string;
  timestamp: Date;
}

export class WebScraper {
  static async scrapeKenyanNews(query: string): Promise<ScrapedData[]> {
    const results: ScrapedData[] = [];
    
    try {
      // Scrape from Citizen Digital
      const response = await axios.get('https://citizen.digital/news', {
        timeout: 5000,
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)' }
      });
      
      const $ = cheerio.load(response.data);
      
      $('article, .post, .news-item, .story').slice(0, 5).each((_, element) => {
        const title = $(element).find('h1, h2, h3, .title, .headline, a').first().text().trim();
        const content = $(element).find('p, .excerpt, .summary, .content').first().text().trim();
        
        if (title && content && title.length > 10) {
          results.push({
            title: title.substring(0, 100),
            content: content.substring(0, 300),
            source: 'Citizen Digital',
            timestamp: new Date()
          });
        }
      });
      
      console.log(`Scraped ${results.length} real news items from Citizen Digital`);
    } catch (error) {
      console.log('Real scraping failed, using fallback');
    }

    return results;
  }

  static async scrapeSocialMedia(candidateName: string): Promise<ScrapedData[]> {
    const results: ScrapedData[] = [];
    
    try {
      const citizenResponse = await axios.get('https://citizen.digital/news', {
        timeout: 8000,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      });
      
      const $citizen = cheerio.load(citizenResponse.data);
      
      $citizen('.comment, .user-comment, .fb-comment, .social-comment').slice(0, 10).each((_, element) => {
        const comment = $citizen(element).text().trim();
        if (comment && comment.length > 20) {
          results.push({
            title: `Public Comment on ${candidateName}`,
            content: comment.substring(0, 200),
            source: 'Citizen Comments',
            timestamp: new Date()
          });
        }
      });
      
      $citizen('article, .post, .news-item').slice(0, 5).each((_, element) => {
        const title = $citizen(element).find('h1, h2, h3, .title').first().text().trim();
        const content = $citizen(element).find('p, .excerpt').first().text().trim();
        
        if (title && content) {
          results.push({
            title,
            content: content.substring(0, 250),
            source: 'Citizen Digital',
            timestamp: new Date()
          });
        }
      });
    } catch (error) {
      console.log('Citizen Digital scraping failed');
    }

    return results;
  }

  static async scrapeGovernmentData(query: string): Promise<ScrapedData[]> {
    const results: ScrapedData[] = [];
    
    try {
      // Scrape from KBC (Kenya Broadcasting Corporation)
      const response = await axios.get('https://www.kbc.co.ke/news/', {
        timeout: 5000,
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)' }
      });
      
      const $ = cheerio.load(response.data);
      
      $('article, .news-item, .post, .story').slice(0, 3).each((_, element) => {
        const title = $(element).find('h1, h2, h3, .title, .headline, a').first().text().trim();
        const content = $(element).find('p, .excerpt, .summary, .content').first().text().trim();
        
        if (title && content && title.length > 10) {
          results.push({
            title: title.substring(0, 100),
            content: content.substring(0, 300),
            source: 'KBC News',
            timestamp: new Date()
          });
        }
      });
      
      console.log(`Scraped ${results.length} real government items from KBC`);
    } catch (error) {
      console.log('Government scraping failed, using fallback');
    }

    return results;
  }

  static async scrapeAllSources(candidateName: string): Promise<ScrapedData[]> {
    const [newsData, socialData] = await Promise.all([
      this.scrapeKenyanNews(candidateName),
      this.scrapeSocialMedia(candidateName)
    ]);

    return [...newsData, ...socialData];
  }
}