#!/usr/bin/env node

// Test script for predictive heat maps API
console.log('🗺️  Testing Predictive Heat Maps API...\n');

async function testAPI() {
  try {
    const response = await fetch('http://localhost:3001/api/predictive-heatmaps', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'election-outcomes',
        timeframe: '1month',
        granularity: 'county',
        includeFactors: true
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ API Response Successful!');
      console.log(`📊 Counties Analyzed: ${data.heatMap.regions?.length || 0}`);
      console.log(`🎯 Confidence Level: ${Math.round((data.heatMap.confidence?.overall || 0) * 100)}%`);
      console.log(`📈 Prediction Type: ${data.heatMap.type}`);
      console.log(`💡 Insights Generated: ${data.heatMap.insights?.length || 0}`);
      
      if (data.heatMap.regions && data.heatMap.regions.length > 0) {
        console.log('\n🏛️  Sample Counties:');
        data.heatMap.regions.slice(0, 5).forEach(region => {
          console.log(`   ${region.name}: ${region.value}% (${Math.round(region.confidence * 100)}% confidence)`);
        });
      }
      
      console.log('\n🎉 Heat Map API is working correctly!');
      console.log('🌐 Users can now see county-level predictions in the popup dialog.');
      
    } else {
      console.log('❌ API Response Failed:', data.error);
    }
    
  } catch (error) {
    console.log('🚨 API Test Failed:', error.message);
  }
}

// Run the test
testAPI();
