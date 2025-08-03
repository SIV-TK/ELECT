#!/usr/bin/env node

// Simple test for the enhanced scraper
const { EnhancedWebScraper } = require('./src/lib/enhanced-scraper.ts');

async function testEnhancedScraper() {
  console.log('🚀 Testing Enhanced Web Scraper\n');
  
  try {
    console.log('📊 Running health check...');
    const healthCheck = await EnhancedWebScraper.healthCheck();
    console.log(`✅ Working sources: ${healthCheck.working.length}`);
    console.log(`❌ Failed sources: ${healthCheck.failed.length}`);
    
    if (healthCheck.working.length > 0) {
      console.log(`🟢 Working: ${healthCheck.working.join(', ')}`);
    }
    
    if (healthCheck.failed.length > 0) {
      console.log(`🔴 Failed: ${healthCheck.failed.join(', ')}`);
    }
    
    console.log('\n📰 Testing news scraping...');
    const newsResults = await EnhancedWebScraper.scrapeKenyanNews('political');
    console.log(`✅ Scraped ${newsResults.length} news articles`);
    
    if (newsResults.length > 0) {
      console.log('\n📄 Sample articles:');
      newsResults.slice(0, 3).forEach((article, i) => {
        console.log(`${i + 1}. ${article.title} (${article.source})`);
        console.log(`   Content: ${article.content.substring(0, 100)}...`);
        console.log('');
      });
    }
    
    console.log('\n🏛️ Testing government data scraping...');
    const govResults = await EnhancedWebScraper.scrapeGovernmentData();
    console.log(`✅ Scraped ${govResults.length} government items`);
    
    if (govResults.length > 0) {
      console.log('\n📄 Government data:');
      govResults.slice(0, 2).forEach((item, i) => {
        console.log(`${i + 1}. ${item.title} (${item.source})`);
      });
    }
    
    console.log(`\n✅ Test completed successfully!`);
    console.log(`📊 Total items collected: ${newsResults.length + govResults.length}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Only run if called directly
if (require.main === module) {
  testEnhancedScraper();
}

module.exports = { testEnhancedScraper };
