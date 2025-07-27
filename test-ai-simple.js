// Simple test for AI flows
async function testAI() {
  try {
    console.log('Testing AI API...');
    
    const response = await fetch('http://localhost:3000/api/integrated-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'comprehensive_analysis',
        data: { candidateName: 'William Ruto', topic: 'economy' }
      })
    });
    
    const result = await response.json();
    console.log('AI Response:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testAI();