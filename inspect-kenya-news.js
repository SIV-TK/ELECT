const axios = require('axios');
const cheerio = require('cheerio');

async function inspectKenyaNews() {
  console.log('🔍 Inspecting Kenya News Agency HTML Structure\n');

  try {
    const response = await axios.get('https://www.kenyanews.go.ke/', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    
    console.log('📊 Element Analysis:');
    console.log(`- Total elements: ${$('*').length}`);
    console.log(`- Articles: ${$('article').length}`);
    console.log(`- Posts: ${$('.post, [class*="post"]').length}`);
    console.log(`- News items: ${$('.news, [class*="news"]').length}`);
    console.log(`- Content items: ${$('.content, [class*="content"]').length}`);
    
    console.log('\n🔗 Looking for common news patterns:');
    console.log(`- Links with "/news/": ${$('a[href*="/news/"]').length}`);
    console.log(`- Headings (h1-h6): ${$('h1, h2, h3, h4, h5, h6').length}`);
    console.log(`- Divs with "item": ${$('div[class*="item"]').length}`);
    console.log(`- Divs with "story": ${$('div[class*="story"]').length}`);
    
    console.log('\n📝 Sample titles found:');
    $('h1, h2, h3').slice(0, 5).each((i, el) => {
      const title = $(el).text().trim();
      if (title && title.length > 20) {
        console.log(`   ${i + 1}. ${title.substring(0, 80)}...`);
      }
    });
    
    console.log('\n🎯 Looking for main content area:');
    const mainSelectors = ['.main', '#main', '.content', '#content', '.posts', '.news-list', '.articles'];
    for (const selector of mainSelectors) {
      const elements = $(selector);
      if (elements.length > 0) {
        console.log(`   Found ${elements.length} elements with '${selector}'`);
        // Look for articles within this main area
        const articlesInside = elements.find('div, article, section').slice(0, 3);
        console.log(`     Contains ${articlesInside.length} potential article containers`);
      }
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

inspectKenyaNews().catch(console.error);
