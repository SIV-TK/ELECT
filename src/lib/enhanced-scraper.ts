import axios, { AxiosRequestConfig } from 'axios';
import * as cheerio from 'cheerio';

interface ScrapedData {
  title: string;
  content: string;
  source: string;
  timestamp: Date;
  url?: string;
  category?: string;
}

interface ScrapingConfig {
  timeout: number;
  retries: number;
  delay: number;
  userAgents: string[];
  headers: Record<string, string>;
  proxies?: string[];
}

export class EnhancedWebScraper {
  private static config: ScrapingConfig = {
    timeout: 15000,
    retries: 3,
    delay: 1000,
    userAgents: [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/121.0'
    ],
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Cache-Control': 'max-age=0'
    }
  };

  private static getRandomUserAgent(): string {
    return this.config.userAgents[Math.floor(Math.random() * this.config.userAgents.length)];
  }

  private static async makeRequest(url: string, customConfig?: Partial<AxiosRequestConfig>): Promise<string> {
    const config: AxiosRequestConfig = {
      timeout: this.config.timeout,
      headers: {
        ...this.config.headers,
        'User-Agent': this.getRandomUserAgent(),
        'Referer': new URL(url).origin,
        ...customConfig?.headers
      },
      maxRedirects: 5,
      validateStatus: (status) => status < 400,
      ...customConfig
    };

    for (let attempt = 1; attempt <= this.config.retries; attempt++) {
      try {
        console.log(`Attempting to scrape ${url} (attempt ${attempt}/${this.config.retries})`);
        
        const response = await axios.get(url, config);
        
        if (response.data && response.data.length > 100) {
          console.log(`✅ Successfully scraped ${url} - ${response.data.length} characters`);
          return response.data;
        } else {
          throw new Error('Response too short or empty');
        }
      } catch (error: any) {
        console.log(`❌ Attempt ${attempt} failed for ${url}:`, error.message);
        
        if (attempt < this.config.retries) {
          const delay = this.config.delay * attempt;
          console.log(`⏳ Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          throw error;
        }
      }
    }
    
    throw new Error(`Failed to scrape ${url} after ${this.config.retries} attempts`);
  }

  // Enhanced Kenyan news sources
  static async scrapeKenyanNews(query?: string): Promise<ScrapedData[]> {
    const results: ScrapedData[] = [];
    
    const newsSources = [
      {
        url: 'https://www.nation.co.ke/kenya/news',
        name: 'Daily Nation',
        selectors: {
          articles: '.teaser, .story-item, .card, .article-teaser, .story-card, [data-article], .news-story, .content-item',
          title: '.teaser-title, .story-headline, .card-title, .article-headline, h2 a, h3 a, .headline a, [class*="title"] a',
          content: '.teaser-summary, .story-summary, .card-summary, .article-summary, .teaser-text, .excerpt'
        }
      },
      {
        url: 'https://citizen.digital/news',
        name: 'Citizen Digital',
        selectors: {
          articles: '.post-item, .news-card, .article-card, .story-card, .content-block, .post-block, [data-post]',
          title: '.post-title a, .card-title a, .story-title a, .entry-title a, h2.title a, h3.headline a',
          content: '.post-excerpt, .card-excerpt, .story-excerpt, .entry-summary, .post-summary'
        }
      },
      {
        url: 'https://www.capitalfm.co.ke/news/',
        name: 'Capital FM',
        selectors: {
          articles: '.entry, .post-entry, .news-entry, .article-entry, .story-entry, .blog-post, [id*="post-"]',
          title: '.entry-title a, .post-title a, h2.entry-title, h3.post-title, .headline a',
          content: '.entry-excerpt, .post-excerpt, .entry-summary, .post-summary, .excerpt p'
        }
      },
      {
        url: 'https://www.tuko.co.ke/',
        name: 'Tuko News',
        selectors: {
          articles: '.tuko-card, .news-card, .story-card, .article-card, [data-article-id], .post-card, .content-card',
          title: '.card-title a, .story-title a, .article-title a, h2 a, h3 a, .headline a, [class*="title"] a',
          content: '.card-summary, .story-summary, .article-summary, .card-excerpt, .story-excerpt'
        }
      },
      {
        url: 'https://www.bbc.com/news/topics/c40rjmqdlzzt',
        name: 'BBC Kenya',
        selectors: {
          articles: '[data-testid="card-text-wrapper"], .gs-c-promo, .media__content',
          title: 'h2, h3, .gs-c-promo-heading__title, .media__title h3, .gs-c-promo-body__headline',
          content: '[data-testid="card-description"], .gs-c-promo-summary, .media__summary, .gs-c-promo-body__summary'
        }
      },
      {
        url: 'https://www.kenyanews.go.ke/',
        name: 'Kenya News Agency',
        selectors: {
          articles: '[class*="post"], #main div, #content div, .news, [class*="news"]',
          title: 'h1, h2, h3, h4, h5, a',
          content: 'p, .excerpt, .summary, div'
        }
      }
    ];

    for (const source of newsSources) {
      try {
        console.log(`🔍 Scraping ${source.name} from ${source.url}`);
        const html = await this.makeRequest(source.url);
        const $ = cheerio.load(html);
        
        // Debug: Count potential articles
        const potentialArticles = $(source.selectors.articles);
        console.log(`📰 Found ${potentialArticles.length} potential articles on ${source.name}`);
        
        const sourceResultsBefore = results.length;
        
        $(source.selectors.articles).slice(0, 10).each((_, element) => {
          const $element = $(element);
          
          // Try multiple ways to get the title
          let title = '';
          const titleSelectors = source.selectors.title.split(', ');
          for (const selector of titleSelectors) {
            const titleElement = $element.find(selector).first();
            if (titleElement.length > 0) {
              title = titleElement.text().trim();
              if (title && title.length > 5) break;
            }
          }
          
          // If still no title, try getting it from the element itself or parent
          if (!title) {
            // Try getting title from link text
            const linkTitle = $element.find('a').first().text().trim();
            if (linkTitle && linkTitle.length > 10) {
              title = linkTitle;
            } else {
              // Try getting from any heading in the element
              const headings = $element.find('h1, h2, h3, h4, h5, h6');
              if (headings.length > 0) {
                title = headings.first().text().trim();
              } else {
                // Last resort: first meaningful text line
                const fullText = $element.text().trim();
                const lines = fullText.split('\n').map(line => line.trim()).filter(line => line.length > 10);
                if (lines.length > 0) {
                  title = lines[0].substring(0, 100);
                }
              }
            }
          }
          
          // Try multiple ways to get content
          let content = '';
          const contentSelectors = source.selectors.content.split(', ');
          for (const selector of contentSelectors) {
            const contentElement = $element.find(selector).first();
            if (contentElement.length > 0) {
              content = contentElement.text().trim();
              if (content && content.length > 20) break;
            }
          }
          
          // If still no content, try getting text from the element itself
          if (!content) {
            const fullText = $element.text().trim();
            const lines = fullText.split('\n').map(line => line.trim()).filter(line => line.length > 20);
            // Skip the title line and get the next meaningful content
            const titleWords = title.toLowerCase().split(' ').slice(0, 3);
            const contentLines = lines.filter(line => {
              const lineWords = line.toLowerCase().split(' ');
              return !titleWords.every(word => lineWords.includes(word));
            });
            content = contentLines.slice(0, 2).join(' ').trim();
          }
          
          // Get the URL
          let articleUrl = '';
          const linkElement = $element.find('a').first();
          if (linkElement.length > 0) {
            const href = linkElement.attr('href');
            if (href) {
              articleUrl = href.startsWith('http') ? href : 
                          href.startsWith('/') ? new URL(source.url).origin + href :
                          source.url + '/' + href;
            }
          }
          
          // Quality checks and filtering
          if (title && content && title.length > 10 && content.length > 30) {
            // Filter by query if provided
            if (!query || 
                title.toLowerCase().includes(query.toLowerCase()) || 
                content.toLowerCase().includes(query.toLowerCase())) {
              
              // Additional quality checks
              const isValidNews = (
                title.length < 200 && // Not too long
                content.length < 500 && // Not too long
                !title.toLowerCase().includes('cookie') && // Not cookie notices
                !title.toLowerCase().includes('subscribe') && // Not subscription prompts
                !content.toLowerCase().includes('click here') // Not ads
              );
              
              if (isValidNews) {
                results.push({
                  title: title.substring(0, 150).trim(),
                  content: content.substring(0, 400).trim(),
                  source: source.name,
                  timestamp: new Date(),
                  url: articleUrl || source.url,
                  category: 'news'
                });
              }
            }
          }
        });
        
        const sourceResultsAfter = results.length;
        const articlesFromThisSource = sourceResultsAfter - sourceResultsBefore;
        console.log(`✅ Extracted ${articlesFromThisSource} articles from ${source.name}`);
        
        // If we didn't get many articles, try a more generic approach
        if (articlesFromThisSource === 0) {
          console.log(`🔄 Trying fallback scraping for ${source.name}`);
          
          // Generic fallback selectors
          const fallbackSelectors = [
            'a[href*="/news/"], a[href*="/article/"], a[href*="/story/"]',
            'h1, h2, h3, h4',
            '.title, .headline, [class*="title"], [class*="headline"]'
          ];
          
          for (const fallbackSelector of fallbackSelectors) {
            const fallbackElements = $(fallbackSelector);
            console.log(`🔍 Found ${fallbackElements.length} elements with selector: ${fallbackSelector}`);
            
            let foundInThisSelector = 0;
            fallbackElements.slice(0, 5).each((_, element) => {
              if (foundInThisSelector >= 3) return false; // Limit fallback results per selector
              
              const $element = $(element);
              const text = $element.text().trim();
              const link = $element.attr('href') || $element.find('a').first().attr('href');
              
              if (text && text.length > 20 && text.length < 200) {
                // Check if this looks like a news title
                const lowerText = text.toLowerCase();
                if (lowerText.includes('kenya') || lowerText.includes('nairobi') || 
                    lowerText.includes('president') || lowerText.includes('government') ||
                    (!query || lowerText.includes(query.toLowerCase()))) {
                  
                  results.push({
                    title: text.substring(0, 150),
                    content: `News item from ${source.name}: ${text.substring(0, 300)}`,
                    source: source.name + ' (Fallback)',
                    timestamp: new Date(),
                    url: link ? (link.startsWith('http') ? link : source.url + link) : source.url,
                    category: 'news'
                  });
                  
                  foundInThisSelector++;
                }
              }
            });
            
            if (results.length > sourceResultsBefore) break; // Found some results, stop trying
          }
          
          const fallbackResults = results.length - sourceResultsAfter;
          if (fallbackResults > 0) {
            console.log(`✅ Fallback method extracted ${fallbackResults} items from ${source.name}`);
          }
        }
        
        // Add delay between sources to be respectful
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error: any) {
        console.log(`❌ Failed to scrape ${source.name}:`, error.message);
      }
    }

    return results;
  }

  // Enhanced government data scraping
  static async scrapeGovernmentData(query?: string): Promise<ScrapedData[]> {
    const results: ScrapedData[] = [];
    
    const govSources = [
      {
        url: 'https://www.president.go.ke',
        name: 'State House Kenya',
        selectors: {
          articles: '.post, article, .news-item, .content-item',
          title: 'h1, h2, h3, .entry-title, .post-title, .title',
          content: 'p, .entry-content, .post-content, .excerpt'
        }
      },
      {
        url: 'https://www.iebc.or.ke',
        name: 'IEBC',
        selectors: {
          articles: '.post, article, .news-post, .content-item',
          title: 'h1, h2, h3, .post-title, .entry-title, .title',
          content: 'p, .post-content, .entry-content, .excerpt'
        }
      }
    ];

    for (const source of govSources) {
      try {
        const html = await this.makeRequest(source.url);
        const $ = cheerio.load(html);
        
        $(source.selectors.articles).slice(0, 3).each((_, element) => {
          const $element = $(element);
          const title = $element.find(source.selectors.title).first().text().trim();
          const content = $element.find(source.selectors.content).first().text().trim();
          const link = $element.find('a').first().attr('href');
          
          if (title && content && title.length > 10) {
            if (!query || title.toLowerCase().includes(query.toLowerCase()) || 
                content.toLowerCase().includes(query.toLowerCase())) {
              
              results.push({
                title: title.substring(0, 150),
                content: content.substring(0, 400),
                source: source.name,
                timestamp: new Date(),
                url: link ? (link.startsWith('http') ? link : source.url + link) : source.url,
                category: 'government'
              });
            }
          }
        });
        
        console.log(`✅ Scraped ${results.filter(r => r.source === source.name).length} items from ${source.name}`);
        
        // Add delay between sources
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error: any) {
        console.log(`❌ Failed to scrape ${source.name}:`, error.message);
      }
    }

    return results;
  }

  // Enhanced social media and public opinion scraping
  static async scrapeSocialSentiment(candidateName: string): Promise<ScrapedData[]> {
    const results: ScrapedData[] = [];
    
    // Look for news articles with comments or public discussions
    const socialSources = [
      {
        url: `https://www.nation.co.ke/kenya/news?search=${encodeURIComponent(candidateName)}`,
        name: 'Nation Comments',
        selectors: {
          articles: 'article, .comment-item, .discussion-item',
          title: 'h1, h2, h3, .comment-title',
          content: '.comment-text, .discussion-content, p'
        }
      }
    ];

    for (const source of socialSources) {
      try {
        const html = await this.makeRequest(source.url);
        const $ = cheerio.load(html);
        
        $(source.selectors.articles).slice(0, 8).each((_, element) => {
          const $element = $(element);
          const title = $element.find(source.selectors.title).first().text().trim() || 
                       `Public Opinion on ${candidateName}`;
          const content = $element.find(source.selectors.content).first().text().trim();
          
          if (content && content.length > 30) {
            results.push({
              title: title.substring(0, 100),
              content: content.substring(0, 300),
              source: source.name,
              timestamp: new Date(),
              category: 'social'
            });
          }
        });
        
        console.log(`✅ Scraped ${results.filter(r => r.source === source.name).length} social items from ${source.name}`);
        
      } catch (error: any) {
        console.log(`❌ Failed to scrape ${source.name}:`, error.message);
      }
    }

    return results;
  }

  // Comprehensive scraping with better error handling
  static async scrapeAllSources(query?: string): Promise<ScrapedData[]> {
    console.log(`🚀 Starting comprehensive scraping${query ? ` for: ${query}` : ''}`);
    
    const [newsData, govData, socialData] = await Promise.allSettled([
      this.scrapeKenyanNews(query),
      this.scrapeGovernmentData(query),
      query ? this.scrapeSocialSentiment(query) : Promise.resolve([])
    ]);

    const results: ScrapedData[] = [];
    
    if (newsData.status === 'fulfilled') {
      results.push(...newsData.value);
    } else {
      console.log('❌ News scraping failed:', newsData.reason);
    }
    
    if (govData.status === 'fulfilled') {
      results.push(...govData.value);
    } else {
      console.log('❌ Government scraping failed:', govData.reason);
    }
    
    if (socialData.status === 'fulfilled') {
      results.push(...socialData.value);
    } else {
      console.log('❌ Social scraping failed:', socialData.reason);
    }

    // Remove duplicates based on title similarity
    const uniqueResults = this.removeDuplicates(results);
    
    console.log(`✅ Total scraped: ${uniqueResults.length} unique items from ${results.length} total`);
    
    return uniqueResults;
  }

  private static removeDuplicates(data: ScrapedData[]): ScrapedData[] {
    const seen = new Set();
    return data.filter(item => {
      const key = item.title.toLowerCase().substring(0, 50);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  // Health check for scraping capabilities
  static async healthCheck(): Promise<{ working: string[], failed: string[] }> {
    const testUrls = [
      'https://www.nation.co.ke',
      'https://citizen.digital', 
      'https://www.capitalfm.co.ke',
      'https://www.tuko.co.ke',
      'https://www.bbc.com',
      'https://www.kenyanews.go.ke'
    ];

    const working: string[] = [];
    const failed: string[] = [];

    for (const url of testUrls) {
      try {
        await this.makeRequest(url);
        working.push(url);
      } catch {
        failed.push(url);
      }
    }

    return { working, failed };
  }
}
