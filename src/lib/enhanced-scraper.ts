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

interface CachedScrapingData {
  data: ScrapedData[];
  lastUpdated: Date;
  expiresAt: Date;
}

interface ScrapingConfig {
  timeout: number;
  retries: number;
  delay: number;
  userAgents: string[];
  headers: Record<string, string>;
  proxies?: string[];
  cacheExpiryHours: number;
}

export class EnhancedWebScraper {
  private static config: ScrapingConfig = {
    timeout: 10000, // Reduced timeout for faster failures
    retries: 1, // Reduced retries to avoid wait times
    delay: 500, // Reduced delay
    cacheExpiryHours: 24, // Cache data for 24 hours
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

  // Track failed URLs to avoid retrying them
  private static failedUrls = new Set<string>();

  // In-memory cache for scraped data
  private static newsCache: CachedScrapingData | null = null;
  private static governmentCache: CachedScrapingData | null = null;
  private static socialCache: Map<string, CachedScrapingData> = new Map();

  // Clear failed URLs cache (call this periodically or when you want to retry previously failed URLs)
  static clearFailedUrlsCache(): void {
    this.failedUrls.clear();
    console.log('🧹 Cleared failed URLs cache - will retry previously failed URLs');
  }

  // Cache utility methods
  private static isCacheExpired(cache: CachedScrapingData | null): boolean {
    if (!cache) return true;
    return new Date() > cache.expiresAt;
  }

  private static createCacheEntry(data: ScrapedData[]): CachedScrapingData {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + (this.config.cacheExpiryHours * 60 * 60 * 1000));
    
    return {
      data,
      lastUpdated: now,
      expiresAt
    };
  }

  // Get cached data or fetch new data if cache is expired
  private static async getCachedOrFresh<T>(
    cache: CachedScrapingData | null,
    fetchFunction: () => Promise<ScrapedData[]>,
    cacheType: string
  ): Promise<ScrapedData[]> {
    if (!this.isCacheExpired(cache)) {
      console.log(`📋 Using cached ${cacheType} data (expires at ${cache!.expiresAt.toLocaleString()})`);
      return cache!.data;
    }

    console.log(`🔄 Cache expired or missing for ${cacheType}, fetching fresh data...`);
    const freshData = await fetchFunction();
    
    // Update the appropriate cache
    const newCache = this.createCacheEntry(freshData);
    if (cacheType === 'news') {
      this.newsCache = newCache;
    } else if (cacheType === 'government') {
      this.governmentCache = newCache;
    }
    
    console.log(`💾 Cached ${freshData.length} ${cacheType} items until ${newCache.expiresAt.toLocaleString()}`);
    return freshData;
  }

  // Clear all caches
  static clearAllCaches(): void {
    this.newsCache = null;
    this.governmentCache = null;
    this.socialCache.clear();
    this.failedUrls.clear();
    console.log('🧹 Cleared all caches - will fetch fresh data on next request');
  }

  // Get cache status
  static getCacheStatus(): { 
    news: { cached: boolean, expiresAt?: string, itemCount?: number },
    government: { cached: boolean, expiresAt?: string, itemCount?: number },
    social: { cachedQueries: number }
  } {
    return {
      news: {
        cached: !this.isCacheExpired(this.newsCache),
        expiresAt: this.newsCache?.expiresAt.toLocaleString(),
        itemCount: this.newsCache?.data.length
      },
      government: {
        cached: !this.isCacheExpired(this.governmentCache),
        expiresAt: this.governmentCache?.expiresAt.toLocaleString(),
        itemCount: this.governmentCache?.data.length
      },
      social: {
        cachedQueries: this.socialCache.size
      }
    };
  }

  private static getRandomUserAgent(): string {
    return this.config.userAgents[Math.floor(Math.random() * this.config.userAgents.length)];
  }

  private static async makeRequest(url: string, customConfig?: Partial<AxiosRequestConfig>): Promise<string> {
    // Skip URLs that have already failed
    if (this.failedUrls.has(url)) {
      console.log(`⏭️ Skipping previously failed URL: ${url}`);
      throw new Error(`URL ${url} previously failed - skipping to avoid delays`);
    }

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

    try {
      console.log(`🔄 Attempting to scrape ${url} (single attempt - no retries)`);
      
      const response = await axios.get(url, config);
      
      if (response.data && response.data.length > 100) {
        console.log(`✅ Successfully scraped ${url} - ${response.data.length} characters`);
        return response.data;
      } else {
        throw new Error('Response too short or empty');
      }
    } catch (error: any) {
      console.log(`❌ Failed to scrape ${url}:`, error.message);
      
      // Mark this URL as failed to avoid future attempts
      this.failedUrls.add(url);
      
      throw error;
    }
  }

  // Enhanced Kenyan news sources with fail-fast approach
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

    // Process sources in parallel but handle failures gracefully
    const sourcePromises = newsSources.map(async (source) => {
      try {
        console.log(`🔍 Scraping ${source.name} from ${source.url}`);
        const html = await this.makeRequest(source.url);
        const $ = cheerio.load(html);
        
        // Debug: Count potential articles
        const potentialArticles = $(source.selectors.articles);
        console.log(`📰 Found ${potentialArticles.length} potential articles on ${source.name}`);
        
        const sourceResults: ScrapedData[] = [];
        
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
                sourceResults.push({
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

        console.log(`✅ Extracted ${sourceResults.length} articles from ${source.name}`);
        return sourceResults;

      } catch (error: any) {
        console.log(`❌ Failed to scrape ${source.name}:`, error.message);
        return []; // Return empty array for failed sources
      }
    });

    // Wait for all sources to complete or fail
    const sourceResults = await Promise.allSettled(sourcePromises);
    
    // Combine results from all successful sources
    sourceResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        results.push(...result.value);
      } else {
        console.log(`❌ Source ${newsSources[index].name} failed:`, result.reason);
      }
    });

    console.log(`📊 Total articles collected: ${results.length} from ${newsSources.length} sources`);
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

    // Process government sources in parallel
    const sourcePromises = govSources.map(async (source) => {
      try {
        console.log(`🏛️ Scraping ${source.name} from ${source.url}`);
        const html = await this.makeRequest(source.url);
        const $ = cheerio.load(html);
        
        const sourceResults: ScrapedData[] = [];
        
        $(source.selectors.articles).slice(0, 3).each((_, element) => {
          const $element = $(element);
          const title = $element.find(source.selectors.title).first().text().trim();
          const content = $element.find(source.selectors.content).first().text().trim();
          const link = $element.find('a').first().attr('href');
          
          if (title && content && title.length > 10) {
            if (!query || title.toLowerCase().includes(query.toLowerCase()) || 
                content.toLowerCase().includes(query.toLowerCase())) {
              
              sourceResults.push({
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
        
        console.log(`✅ Extracted ${sourceResults.length} items from ${source.name}`);
        return sourceResults;
        
      } catch (error: any) {
        console.log(`❌ Failed to scrape ${source.name}:`, error.message);
        return []; // Return empty array for failed sources
      }
    });

    // Wait for all government sources to complete or fail
    const sourceResults = await Promise.allSettled(sourcePromises);
    
    // Combine results from all successful sources
    sourceResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        results.push(...result.value);
      } else {
        console.log(`❌ Government source ${govSources[index].name} failed:`, result.reason);
      }
    });

    console.log(`🏛️ Total government items collected: ${results.length} from ${govSources.length} sources`);
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
