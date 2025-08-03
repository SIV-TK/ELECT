const axios = require('axios');
const cheerio = require('cheerio');

async function testAllWorkingSources() {
  console.log('🧪 Testing All Enhanced Scraper Sources\n');

  const sources = [
    {
      url: 'https://www.capitalfm.co.ke/news/',
      name: 'Capital FM',
      articles: '.entry, .post-entry, .news-entry, .article-entry, .story-entry, .blog-post, [id*="post-"]',
      title: '.entry-title a, .post-title a, h2.entry-title, h3.post-title, .headline a',
      content: '.entry-excerpt, .post-excerpt, .entry-summary, .post-summary, .excerpt p'
    },
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
      articles: '[class*="post"], #main div, #content div, .news, [class*="news"]',
      title: 'h1, h2, h3, h4, h5, a',
      content: 'p, .excerpt, .summary, div'
    }
  ];

  let totalExtracted = 0;
  
  for (const source of sources) {
    try {
      console.log(`📡 Testing ${source.name}...`);
      
      const response = await axios.get(source.url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      console.log(`✅ Status: ${response.status}, Size: ${Math.round(response.data.length/1024)}KB`);
      
      const $ = cheerio.load(response.data);
      const articles = $(source.articles);
      console.log(`🔍 Found ${articles.length} article containers`);
      
      let extractedCount = 0;
      const sampleArticles = [];
      
      articles.slice(0, 10).each((_, element) => {
        const $element = $(element);
        
        // Try to extract title
        let title = '';
        const titleSelectors = source.title.split(', ');
        for (const selector of titleSelectors) {
          const titleEl = $element.find(selector).first();
          if (titleEl.length > 0) {
            title = titleEl.text().trim();
            if (title && title.length > 15 && title.length < 150) break;
          }
        }
        
        // Try to extract content  
        let content = '';
        const contentSelectors = source.content.split(', ');
        for (const selector of contentSelectors) {
          const contentEl = $element.find(selector).first();
          if (contentEl.length > 0) {
            content = contentEl.text().trim();
            if (content && content.length > 30 && content.length < 300) break;
          }
        }
        
        // Quality checks
        const isValidNews = title && content && 
                           title.length > 15 && content.length > 30 &&
                           !title.toLowerCase().includes('cookie') &&
                           !title.toLowerCase().includes('subscribe') &&
                           !content.toLowerCase().includes('click here') &&
                           (title.toLowerCase().includes('kenya') || 
                            content.toLowerCase().includes('kenya') ||
                            title.toLowerCase().includes('government') ||
                            title.toLowerCase().includes('president'));
        
        if (isValidNews) {
          extractedCount++;
          totalExtracted++;
          sampleArticles.push({
            title: title.substring(0, 80),
            content: content.substring(0, 120)
          });
        }
      });
      
      console.log(`✅ Successfully extracted ${extractedCount} articles`);
      if (sampleArticles.length > 0) {
        console.log('📰 Sample articles:');
        sampleArticles.slice(0, 2).forEach((article, index) => {
          console.log(`   ${index + 1}. ${article.title}`);
          console.log(`      ${article.content}...\n`);
        });
      }
      
    } catch (error) {
      console.log(`❌ ${source.name}: ${error.message}`);
    }
    
    console.log('─'.repeat(50));
  }
  
  console.log(`🎉 TOTAL ARTICLES EXTRACTED: ${totalExtracted}`);
}

testAllWorkingSources().catch(console.error);
