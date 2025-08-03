const axios = require('axios');
const cheerio = require('cheerio');

async function inspectDailyNation() {
  console.log('🔍 Inspecting Daily Nation HTML Structure\n');

  try {
    const response = await axios.get('https://www.nation.co.ke/kenya/news', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    
    console.log('📊 Element Analysis:');
    console.log(`- Total elements: ${$('*').length}`);
    console.log(`- Articles: ${$('article').length}`);
    console.log(`- Teasers: ${$('.teaser, [class*="teaser"]').length}`);
    console.log(`- Stories: ${$('.story, [class*="story"]').length}`);
    console.log(`- Cards: ${$('.card, [class*="card"]').length}`);
    
    console.log('\n🔗 Looking for Daily Nation patterns:');
    console.log(`- Links with "/kenya/": ${$('a[href*="/kenya/"]').length}`);
    console.log(`- Links with "/news/": ${$('a[href*="/news/"]').length}`);
    console.log(`- Headings (h1-h6): ${$('h1, h2, h3, h4, h5, h6').length}`);
    
    console.log('\n📝 Sample article links found:');
    $('a[href*="/kenya/"]').slice(0, 5).each((i, el) => {
      const title = $(el).text().trim();
      const href = $(el).attr('href');
      if (title && title.length > 20) {
        console.log(`   ${i + 1}. ${title.substring(0, 60)}...`);
        console.log(`      URL: ${href}`);
      }
    });
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

inspectDailyNation().catch(console.error);
