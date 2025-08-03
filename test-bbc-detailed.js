const axios = require('axios');
const cheerio = require('cheerio');

async function testBBCKenya() {
  console.log('🧪 Testing BBC Kenya - Detailed Analysis\n');

  try {
    const response = await axios.get('https://www.bbc.com/news/topics/c40rjmqdlzzt', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    console.log(`✅ Status: ${response.status}, Size: ${Math.round(response.data.length/1024)}KB`);
    
    const $ = cheerio.load(response.data);
    
    // Test each selector individually
    const selectors = [
      '[data-testid="card-text-wrapper"]',
      '[data-testid="edinburgh-article"]',
      '.gs-c-promo',
      '.media__content'
    ];
    
    console.log('🔍 Testing article selectors:');
    for (const selector of selectors) {
      const elements = $(selector);
      console.log(`   ${selector}: ${elements.length} elements`);
    }
    
    // Use the working selector
    const articles = $('[data-testid="card-text-wrapper"], .gs-c-promo');
    console.log(`\n📰 Found ${articles.length} article containers total`);
    
    let extractedCount = 0;
    const sampleArticles = [];
    
    articles.slice(0, 10).each((_, element) => {
      const $element = $(element);
      
      // Try title selectors
      let title = '';
      const titleSelectors = [
        '[data-testid="card-headline"] h2',
        '.gs-c-promo-heading__title',
        'h2',
        'h3',
        'a'
      ];
      
      for (const selector of titleSelectors) {
        const titleEl = $element.find(selector).first();
        if (titleEl.length > 0) {
          title = titleEl.text().trim();
          if (title && title.length > 10) {
            console.log(`   Title found with '${selector}': ${title.substring(0, 50)}...`);
            break;
          }
        }
      }
      
      // Try content selectors
      let content = '';
      const contentSelectors = [
        '[data-testid="card-description"]',
        '.gs-c-promo-summary',
        'p',
        '.media__summary'
      ];
      
      for (const selector of contentSelectors) {
        const contentEl = $element.find(selector).first();
        if (contentEl.length > 0) {
          content = contentEl.text().trim();
          if (content && content.length > 20) {
            console.log(`   Content found with '${selector}': ${content.substring(0, 50)}...`);
            break;
          }
        }
      }
      
      if (title && content && title.length > 10 && content.length > 20) {
        extractedCount++;
        sampleArticles.push({
          title: title.substring(0, 100),
          content: content.substring(0, 150)
        });
      }
    });
    
    console.log(`\n✅ Successfully extracted ${extractedCount} articles`);
    if (sampleArticles.length > 0) {
      console.log('\n📰 Extracted articles:');
      sampleArticles.forEach((article, index) => {
        console.log(`   ${index + 1}. ${article.title}`);
        console.log(`      ${article.content}...\n`);
      });
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

testBBCKenya().catch(console.error);
