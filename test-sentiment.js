const fetch = require('node-fetch');

async function testSentiment() {
  try {
    console.log('Testing sentiment analysis...');
    
    const response = await fetch('http://localhost:3000/api/integrated-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'comprehensive_analysis',
        data: { candidateName: 'William Ruto', topic: 'economy' }
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('✅ SUCCESS - Analysis Results:');
    console.log('Sentiment Score:', result.sentiment?.sentimentScore);
    console.log('Summary:', result.sentiment?.sentimentSummary);
    console.log('Vote Distribution Counties:', result.voteDistribution?.length);
    
  } catch (error) {
    console.error('❌ FAILED:', error.message);
  }
}

testSentiment();