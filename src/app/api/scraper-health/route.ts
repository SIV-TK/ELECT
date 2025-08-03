import { NextRequest, NextResponse } from 'next/server';
import { EnhancedWebScraper } from '@/lib/enhanced-scraper';
import { PuppeteerScraper } from '@/lib/puppeteer-scraper';

export async function GET() {
  try {
    console.log('🔍 Running scraper health check...');
    
    const startTime = Date.now();
    
    // Test Enhanced Web Scraper
    const enhancedHealthCheck = await EnhancedWebScraper.healthCheck();
    
    // Test Puppeteer Scraper
    const puppeteerHealthCheck = await PuppeteerScraper.healthCheck();
    
    // Test sample scraping
    let sampleScrapeResults = {
      enhanced: 0,
      puppeteer: 0,
      jsdom: 0
    };
    
    try {
      const enhancedSample = await EnhancedWebScraper.scrapeKenyanNews();
      sampleScrapeResults.enhanced = enhancedSample.length;
    } catch (error) {
      console.log('Enhanced scraper sample failed:', error);
    }
    
    try {
      const jsdomSample = await PuppeteerScraper.scrapeWithJSDOM('https://www.nation.co.ke');
      sampleScrapeResults.jsdom = jsdomSample.length;
    } catch (error) {
      console.log('JSDOM scraper sample failed:', error);
    }
    
    // Only test Puppeteer if needed (resource intensive)
    if (sampleScrapeResults.enhanced + sampleScrapeResults.jsdom < 5) {
      try {
        const puppeteerSample = await PuppeteerScraper.scrapeKenyanNewsAdvanced();
        sampleScrapeResults.puppeteer = puppeteerSample.length;
      } catch (error) {
        console.log('Puppeteer scraper sample failed:', error);
      }
    }
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    const overallStatus = (
      enhancedHealthCheck.working.length > 0 || 
      puppeteerHealthCheck.puppeteerWorking ||
      sampleScrapeResults.enhanced > 0 ||
      sampleScrapeResults.jsdom > 0
    ) ? 'HEALTHY' : 'DEGRADED';
    
    return NextResponse.json({
      success: true,
      data: {
        status: overallStatus,
        timestamp: new Date().toISOString(),
        testDuration: `${totalTime}ms`,
        scrapers: {
          enhanced: {
            status: enhancedHealthCheck.working.length > 0 ? 'WORKING' : 'FAILED',
            workingSources: enhancedHealthCheck.working,
            failedSources: enhancedHealthCheck.failed,
            sampleResults: sampleScrapeResults.enhanced
          },
          puppeteer: {
            status: puppeteerHealthCheck.puppeteerWorking ? 'WORKING' : 'FAILED',
            browserInfo: puppeteerHealthCheck.browserInfo,
            testResults: puppeteerHealthCheck.testResults,
            sampleResults: sampleScrapeResults.puppeteer
          },
          jsdom: {
            status: sampleScrapeResults.jsdom > 0 ? 'WORKING' : 'FAILED',
            sampleResults: sampleScrapeResults.jsdom
          }
        },
        recommendations: generateRecommendations(overallStatus, {
          enhanced: enhancedHealthCheck.working.length,
          puppeteer: puppeteerHealthCheck.puppeteerWorking,
          jsdom: sampleScrapeResults.jsdom
        })
      }
    });
    
  } catch (error: any) {
    console.error('Scraper health check failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Health check failed',
      details: error.message,
      timestamp: new Date().toISOString(),
      status: 'CRITICAL'
    });
  }
}

function generateRecommendations(status: string, results: any): string[] {
  const recommendations: string[] = [];
  
  if (status === 'CRITICAL') {
    recommendations.push('All scrapers are down - check network connectivity');
    recommendations.push('Verify that target websites are accessible');
    recommendations.push('Consider using cached/fallback data sources');
  } else if (status === 'DEGRADED') {
    recommendations.push('Some scrapers are working - system partially operational');
    
    if (!results.enhanced) {
      recommendations.push('Enhanced scraper needs attention - check user agents and headers');
    }
    
    if (!results.puppeteer) {
      recommendations.push('Puppeteer may need browser setup - check Chrome installation');
    }
    
    if (!results.jsdom) {
      recommendations.push('JSDOM fallback having issues - check basic HTTP connectivity');
    }
  } else {
    recommendations.push('All systems operational');
    recommendations.push('Regular monitoring recommended');
    recommendations.push('Consider optimizing scraping intervals');
  }
  
  return recommendations;
}

// Also add a POST endpoint for testing specific URLs
export async function POST(request: NextRequest) {
  try {
    const { urls, method = 'enhanced' } = await request.json();
    
    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json({
        success: false,
        error: 'URLs array is required'
      });
    }
    
    const results: any[] = [];
    
    for (const url of urls.slice(0, 5)) { // Limit to 5 URLs
      let scraped: any[] = [];
      
      try {
        switch (method) {
          case 'enhanced':
            // Use enhanced scraper's health check method
            scraped = await EnhancedWebScraper.scrapeAllSources();
            break;
          case 'puppeteer':
            scraped = await PuppeteerScraper.scrapeWithPuppeteer(url, {
              articles: 'article, .post, .news-item',
              title: 'h1, h2, h3, .title',
              content: 'p, .excerpt, .summary'
            });
            break;  
          case 'jsdom':
            scraped = await PuppeteerScraper.scrapeWithJSDOM(url);
            break;
          default:
            scraped = await EnhancedWebScraper.scrapeAllSources();
        }
        
        results.push({
          url,
          success: true,
          count: scraped.length,
          samples: scraped.slice(0, 3).map(item => ({
            title: item.title,
            source: item.source,
            timestamp: item.timestamp
          }))
        });
        
      } catch (error: any) {
        results.push({
          url,
          success: false,
          error: error.message
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      data: {
        method,
        results,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Test scraping failed',
      details: error.message
    });
  }
}
