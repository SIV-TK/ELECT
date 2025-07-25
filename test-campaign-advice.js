// Simple test script for the campaign advice API
const testCampaignAdvice = async () => {
  try {
    const response = await fetch('http://localhost:9002/api/campaign-advice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        candidateName: 'William Ruto'
      })
    });

    const result = await response.json();
    console.log('Campaign Advice API Response:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test
testCampaignAdvice();