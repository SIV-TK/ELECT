const axios = require('axios');
const cheerio = require('cheerio');

async function testEnhancedScraper() {
  console.log('🧪 Testing Enhanced Scraper Core Functionality\n');

  const sources = [
    {
      url: 'https://www.bbc.com/news/topics/c40rjmqdlzzt',
      name: 'BBC Kenya',
      articles: '[data-testid="card-text-wrapper"], [data-testid="edinburgh-article"], .gs-c-promo, .media__content',
      title: '[data-testid="card-headline"] h2, .gs-c-promo-heading__title, .media__title h3, .gs-c-promo-body__headline',
      content: '[data-testid="card-description"], .gs-c-promo-summary, .media__summary, .gs-c-promo-body__summary'
    },
    {
      url: 'https://www.kenyanews.go.ke/',
      name: 'Kenya News Agency',
      articles: '.news-post, .post-item, .article-item, .content-item, .story-item, [class*="post"], [class*="news"]',
      title: '.post-title a, .news-title a, .article-title a, h2.title a, h3.headline a, .entry-title a',
      content: '.post-excerpt, .news-excerpt, .article-excerpt, .entry-summary, .post-summary'
    }
  ];

  for (const source of sources) {
    try {
      console.log(`📡 Testing ${source.name}...`);
      
      const response = await axios.get(source.url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      console.log(`✅ Status: ${response.status}, Size: ${Math.round(response.data.length/1024)}KB`);
      
      const $ = cheerio.load(response.data);
      const articles = $(source.articles);
      console.log(`🔍 Found ${articles.length} article containers`);
      
      let extractedCount = 0;
      const sampleArticles = [];
      
      articles.slice(0, 5).each((_, element) => {
        const $element = $(element);
        
        // Try to extract title
        let title = '';
        const titleSelectors = source.title.split(', ');
        for (const selector of titleSelectors) {
          const titleEl = $element.find(selector).first();
          if (titleEl.length > 0) {
            title = titleEl.text().trim();
            if (title && title.length > 10) break;
          }
        }
        
        // Fallback for title
        if (!title) {
          const linkTitle = $element.find('a').first().text().trim();
          const headingTitle = $element.find('h1, h2, h3, h4').first().text().trim();
          title = linkTitle.length > 10 ? linkTitle : headingTitle;
        }
        
        // Try to extract content
        let content = '';
        const contentSelectors = source.content.split(', ');
        for (const selector of contentSelectors) {
          const contentEl = $element.find(selector).first();
          if (contentEl.length > 0) {
            content = contentEl.text().trim();
            if (content && content.length > 20) break;
          }
        }
        
        // Fallback for content
        if (!content) {
          const fullText = $element.text().trim();
          const lines = fullText.split('\n').filter(line => line.trim().length > 20);
          content = lines.length > 1 ? lines[1] : '';
        }
        
        if (title && title.length > 10 && content && content.length > 20) {
          extractedCount++;
          sampleArticles.push({
            title: title.substring(0, 80) + '...',
            content: content.substring(0, 100) + '...'
          });
        }
      });
      
      console.log(`✅ Successfully extracted ${extractedCount} articles`);
      if (sampleArticles.length > 0) {
        console.log('📰 Sample articles:');
        sampleArticles.slice(0, 2).forEach((article, index) => {
          console.log(`   ${index + 1}. ${article.title}`);
          console.log(`      ${article.content}\n`);
        });
      }
      
    } catch (error) {
      console.log(`❌ ${source.name}: ${error.message}`);
    }
    
    console.log('─'.repeat(50));
  }
}

testEnhancedScraper().catch(console.error);
