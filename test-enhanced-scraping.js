#!/usr/bin/env node

// Test the new enhanced scraping system
import { EnhancedWebScraper } from '../src/lib/enhanced-scraper';
import { PuppeteerScraper } from '../src/lib/puppeteer-scraper';

async function testScrapers() {
  console.log('🚀 Testing Enhanced Scraping System for ELECT\n');
  
  // Test 1: Enhanced Web Scraper
  console.log('='.repeat(50));
  console.log('TEST 1: Enhanced Web Scraper');
  console.log('='.repeat(50));
  
  try {
    const enhancedResults = await EnhancedWebScraper.scrapeKenyanNews('political');
    console.log(`✅ Enhanced scraper collected ${enhancedResults.length} articles`);
    
    if (enhancedResults.length > 0) {
      console.log('\n📰 Sample articles:');
      enhancedResults.slice(0, 3).forEach((article, i) => {
        console.log(`${i + 1}. ${article.title} (${article.source})`);
        console.log(`   Content: ${article.content.substring(0, 100)}...`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.log('❌ Enhanced scraper failed:', error);
  }
  
  // Test 2: Health Check
  console.log('\n' + '='.repeat(50));
  console.log('TEST 2: Scraper Health Check');
  console.log('='.repeat(50));
  
  try {
    const healthCheck = await EnhancedWebScraper.healthCheck();
    console.log(`✅ Working sources: ${healthCheck.working.length}`);
    console.log(`❌ Failed sources: ${healthCheck.failed.length}`);
    
    if (healthCheck.working.length > 0) {
      console.log(`\n🟢 Working: ${healthCheck.working.join(', ')}`);
    }
    
    if (healthCheck.failed.length > 0) {
      console.log(`🔴 Failed: ${healthCheck.failed.join(', ')}`);
    }
    
  } catch (error) {
    console.log('❌ Health check failed:', error);
  }
  
  // Test 3: JSDOM Lightweight Scraper
  console.log('\n' + '='.repeat(50));
  console.log('TEST 3: JSDOM Lightweight Scraper');
  console.log('='.repeat(50));
  
  try {
    const jsdomResults = await PuppeteerScraper.scrapeWithJSDOM('https://www.nation.co.ke');
    console.log(`✅ JSDOM scraper collected ${jsdomResults.length} articles`);
    
    if (jsdomResults.length > 0) {
      console.log('\n📄 Sample articles:');
      jsdomResults.slice(0, 2).forEach((article, i) => {
        console.log(`${i + 1}. ${article.title} (${article.source})`);
      });
    }
    
  } catch (error) {
    console.log('❌ JSDOM scraper failed:', error);
  }
  
  // Test 4: Puppeteer Health Check (without full scraping to save resources)
  console.log('\n' + '='.repeat(50));
  console.log('TEST 4: Puppeteer Health Check');
  console.log('='.repeat(50));
  
  try {
    const puppeteerHealth = await PuppeteerScraper.healthCheck();
    console.log(`🎭 Puppeteer working: ${puppeteerHealth.puppeteerWorking}`);
    
    if (puppeteerHealth.browserInfo) {
      console.log(`📦 Browser version: ${puppeteerHealth.browserInfo.version}`);
    }
    
    console.log('\n🔍 Test results:');
    puppeteerHealth.testResults.forEach(result => {
      const status = result.success ? '✅' : '❌';
      console.log(`${status} ${result.url} ${result.error ? `(${result.error})` : ''}`);
    });
    
  } catch (error) {
    console.log('❌ Puppeteer health check failed:', error);
  }
  
  // Test 5: Crisis Early Warning Integration Test
  console.log('\n' + '='.repeat(50));
  console.log('TEST 5: Crisis Early Warning Integration');
  console.log('='.repeat(50));
  
  try {
    console.log('🚨 Testing crisis monitoring data collection...');
    
    // Simulate what the crisis early warning system does
    const allData = await EnhancedWebScraper.scrapeAllSources('political crisis');
    
    console.log(`✅ Crisis monitoring collected ${allData.length} total items`);
    
    // Analyze data types
    const categories = allData.reduce((acc, item) => {
      acc[item.category || 'unknown'] = (acc[item.category || 'unknown'] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n📊 Data breakdown:');
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} items`);
    });
    
    if (allData.length > 0) {
      console.log('\n🔍 Crisis-related samples:');
      allData
        .filter(item => 
          item.title.toLowerCase().includes('crisis') || 
          item.title.toLowerCase().includes('conflict') ||
          item.content.toLowerCase().includes('crisis')
        )
        .slice(0, 2)
        .forEach((item, i) => {
          console.log(`${i + 1}. ${item.title} (${item.source})`);
        });
    }
    
  } catch (error) {
    console.log('❌ Crisis monitoring test failed:', error);
  }
  
  // Cleanup
  console.log('\n' + '='.repeat(50));
  console.log('CLEANUP');
  console.log('='.repeat(50));
  
  try {
    await PuppeteerScraper.cleanup();
    console.log('✅ Puppeteer resources cleaned up');
  } catch (error) {
    console.log('⚠️ Cleanup warning:', error);
  }
  
  console.log('\n🎉 Enhanced scraping system test completed!');
  console.log('\n💡 Key Benefits:');
  console.log('  ✅ Multiple fallback scraping methods');
  console.log('  ✅ Better error handling and retry logic');
  console.log('  ✅ Realistic headers and user agents');
  console.log('  ✅ Support for dynamic JavaScript content');
  console.log('  ✅ Health monitoring and diagnostics');
  console.log('  ✅ Resource cleanup and management');
  
  process.exit(0);
}

// Run the test
testScrapers().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
