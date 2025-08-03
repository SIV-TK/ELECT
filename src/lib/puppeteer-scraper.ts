import puppeteer, { Browser, Page } from 'puppeteer';
import { JSDOM } from 'jsdom';

interface ScrapedData {
  title: string;
  content: string;
  source: string;
  timestamp: Date;
  url?: string;
  category?: string;
}

interface PuppeteerConfig {
  headless: boolean;
  timeout: number;
  waitFor: number;
  viewport: { width: number; height: number };
  userDataDir?: string;
}

export class PuppeteerScraper {
  private static browser: Browser | null = null;
  private static config: PuppeteerConfig = {
    headless: true,
    timeout: 30000,
    waitFor: 3000,
    viewport: { width: 1920, height: 1080 }
  };

  private static async getBrowser(): Promise<Browser> {
    if (!this.browser) {
      console.log('🚀 Launching Puppeteer browser...');
      this.browser = await puppeteer.launch({
        headless: this.config.headless,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding'
        ],
        timeout: this.config.timeout
      });
      
      console.log('✅ Puppeteer browser launched successfully');
    }
    return this.browser;
  }

  private static async createPage(): Promise<Page> {
    const browser = await this.getBrowser();
    const page = await browser.newPage();
    
    await page.setViewport(this.config.viewport);
    
    // Set realistic headers
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    });

    // Block images and fonts to speed up loading
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const resourceType = req.resourceType();
      if (resourceType === 'image' || resourceType === 'font' || resourceType === 'media') {
        req.abort();
      } else {
        req.continue();
      }
    });

    return page;
  }

  static async scrapeWithPuppeteer(url: string, selectors: any): Promise<ScrapedData[]> {
    const results: ScrapedData[] = [];
    let page: Page | null = null;

    try {
      console.log(`🔍 Puppeteer scraping: ${url}`);
      page = await this.createPage();
      
      // Navigate to the page with timeout
      await page.goto(url, { 
        waitUntil: 'domcontentloaded',
        timeout: this.config.timeout 
      });

      // Wait for content to load
      await new Promise(resolve => setTimeout(resolve, this.config.waitFor));

      // Extract data using selectors
      const scrapedData = await page.evaluate((selectors, url) => {
        const results: any[] = [];
        const articles = document.querySelectorAll(selectors.articles);
        
        articles.forEach((article, index) => {
          if (index >= 10) return; // Limit to 10 articles
          
          const titleElement = article.querySelector(selectors.title);
          const contentElement = article.querySelector(selectors.content);
          const linkElement = article.querySelector('a');
          
          const title = titleElement?.textContent?.trim() || '';
          const content = contentElement?.textContent?.trim() || '';
          const link = linkElement?.getAttribute('href') || '';
          
          if (title && content && title.length > 10 && content.length > 20) {
            results.push({
              title: title.substring(0, 150),
              content: content.substring(0, 400),
              link: link.startsWith('http') ? link : url + link,
              timestamp: new Date().toISOString()
            });
          }
        });
        
        return results;
      }, selectors, url);

      // Convert and add to results
      scrapedData.forEach(item => {
        results.push({
          title: item.title,
          content: item.content,
          source: new URL(url).hostname,
          timestamp: new Date(),
          url: item.link,
          category: 'news'
        });
      });

      console.log(`✅ Puppeteer scraped ${results.length} items from ${url}`);
      
    } catch (error: any) {
      console.log(`❌ Puppeteer scraping failed for ${url}:`, error.message);
    } finally {
      if (page) {
        await page.close();
      }
    }

    return results;
  }

  // Enhanced Kenyan news scraping with Puppeteer
  static async scrapeKenyanNewsAdvanced(): Promise<ScrapedData[]> {
    const results: ScrapedData[] = [];
    
    const sources = [
      {
        url: 'https://www.nation.co.ke/kenya/news',
        selectors: {
          articles: 'article, .story-item, .teaser-story, .news-item',
          title: 'h1, h2, h3, .headline, .story-title, .title',
          content: 'p, .story-intro, .excerpt, .summary, .description'
        }
      },
      {
        url: 'https://www.standardmedia.co.ke/politics',
        selectors: {
          articles: 'article, .story, .news-item, .post',
          title: 'h1, h2, h3, .title, .headline, .entry-title',
          content: 'p, .intro, .excerpt, .entry-content'
        }
      },
      {
        url: 'https://citizen.digital/news',
        selectors: {
          articles: 'article, .post, .news-item, .story',
          title: 'h1, h2, h3, .title, .post-title, .entry-title',
          content: 'p, .post-content, .excerpt, .entry-content'
        }
      }
    ];

    for (const source of sources) {
      try {
        const sourceResults = await this.scrapeWithPuppeteer(source.url, source.selectors);
        results.push(...sourceResults);
        
        // Delay between sources to be respectful
        await new Promise(resolve => setTimeout(resolve, 3000));
        
      } catch (error: any) {
        console.log(`❌ Failed to scrape ${source.url}:`, error.message);
      }
    }

    return results;
  }

  // Dynamic content scraping (for JavaScript-heavy sites)
  static async scrapeDynamicContent(url: string, waitForSelector?: string): Promise<ScrapedData[]> {
    const results: ScrapedData[] = [];
    let page: Page | null = null;

    try {
      console.log(`🔄 Scraping dynamic content from: ${url}`);
      page = await this.createPage();
      
      await page.goto(url, { waitUntil: 'networkidle2', timeout: this.config.timeout });
      
      // Wait for specific selector if provided
      if (waitForSelector) {
        await page.waitForSelector(waitForSelector, { timeout: 10000 });
      }
      
      // Scroll to load more content if it's a dynamic page
      await page.evaluate(() => {
        return new Promise<void>((resolve) => {
          let totalHeight = 0;
          const distance = 100;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if(totalHeight >= scrollHeight || totalHeight >= 2000) {
              clearInterval(timer);
              resolve();
            }
          }, 100);
        });
      });

      // Extract content
      const content = await page.evaluate(() => {
        const articles = document.querySelectorAll('article, .post, .news-item, .story, .content-item');
        const results: any[] = [];
        
        articles.forEach((article, index) => {
          if (index >= 15) return;
          
          const title = article.querySelector('h1, h2, h3, .title, .headline')?.textContent?.trim() || '';
          const content = article.querySelector('p, .excerpt, .summary, .description')?.textContent?.trim() || '';
          const link = article.querySelector('a')?.getAttribute('href') || '';
          
          if (title && content && title.length > 10) {
            results.push({
              title: title.substring(0, 150),
              content: content.substring(0, 400),
              link: link,
              timestamp: new Date().toISOString()
            });
          }
        });
        
        return results;
      });

      content.forEach(item => {
        results.push({
          title: item.title,
          content: item.content,
          source: new URL(url).hostname,
          timestamp: new Date(),
          url: item.link.startsWith('http') ? item.link : url + item.link,
          category: 'dynamic'
        });
      });

      console.log(`✅ Dynamic scraping completed: ${results.length} items from ${url}`);
      
    } catch (error: any) {
      console.log(`❌ Dynamic scraping failed for ${url}:`, error.message);
    } finally {
      if (page) {
        await page.close();
      }
    }

    return results;
  }

  // Screenshot capability for verification
  static async takeScreenshot(url: string, fullPage = false): Promise<Buffer | null> {
    let page: Page | null = null;
    
    try {
      page = await this.createPage();
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const screenshot = await page.screenshot({ 
        fullPage,
        type: 'png',
        quality: 80
      });
      
      console.log(`📸 Screenshot taken for ${url}`);
      return Buffer.from(screenshot);
      
    } catch (error: any) {
      console.log(`❌ Screenshot failed for ${url}:`, error.message);
      return null;
    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  // Health check with detailed diagnostics
  static async healthCheck(): Promise<{
    puppeteerWorking: boolean;
    browserInfo?: any;
    testResults: { url: string; success: boolean; error?: string }[];
  }> {
    const testUrls = [
      'https://www.google.com',
      'https://www.nation.co.ke',
      'https://citizen.digital'
    ];
    
    const testResults: { url: string; success: boolean; error?: string }[] = [];
    let puppeteerWorking = false;
    let browserInfo;

    try {
      const browser = await this.getBrowser();
      browserInfo = {
        version: await browser.version(),
        userAgent: await browser.userAgent()
      };
      puppeteerWorking = true;

      for (const url of testUrls) {
        try {
          const page = await this.createPage();
          await page.goto(url, { timeout: 10000 });
          await page.close();
          testResults.push({ url, success: true });
        } catch (error: any) {
          testResults.push({ url, success: false, error: error.message });
        }
      }

    } catch (error: any) {
      console.log('❌ Puppeteer health check failed:', error.message);
    }

    return {
      puppeteerWorking,
      browserInfo,
      testResults
    };
  }

  // Cleanup resources
  static async cleanup(): Promise<void> {
    if (this.browser) {
      console.log('🧹 Closing Puppeteer browser...');
      await this.browser.close();
      this.browser = null;
      console.log('✅ Puppeteer browser closed');
    }
  }

  // Alternative: JSDOM for lightweight scraping
  static async scrapeWithJSDOM(url: string, headers?: Record<string, string>): Promise<ScrapedData[]> {
    const results: ScrapedData[] = [];
    
    try {
      console.log(`🔍 JSDOM scraping: ${url}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          ...headers
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      const dom = new JSDOM(html);
      const document = dom.window.document;

      // Extract articles
      const articles = document.querySelectorAll('article, .post, .news-item, .story, .content-item');
      
      articles.forEach((article, index) => {
        if (index >= 10) return;
        
        const title = article.querySelector('h1, h2, h3, .title, .headline')?.textContent?.trim() || '';
        const content = article.querySelector('p, .excerpt, .summary')?.textContent?.trim() || '';
        const link = article.querySelector('a')?.getAttribute('href') || '';
        
        if (title && content && title.length > 10) {
          results.push({
            title: title.substring(0, 150),
            content: content.substring(0, 400),
            source: new URL(url).hostname,
            timestamp: new Date(),
            url: link.startsWith('http') ? link : url + link,
            category: 'jsdom'
          });
        }
      });

      console.log(`✅ JSDOM scraped ${results.length} items from ${url}`);
      
    } catch (error: any) {
      console.log(`❌ JSDOM scraping failed for ${url}:`, error.message);
    }

    return results;
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down Puppeteer scraper...');
  await PuppeteerScraper.cleanup();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 Terminating Puppeteer scraper...');
  await PuppeteerScraper.cleanup();
  process.exit(0);
});
