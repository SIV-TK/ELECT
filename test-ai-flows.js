// Test script to verify AI flows are working
const { analyzeCandidateSentiment } = require('./src/ai/flows/analyze-candidate-sentiment.ts');
const { politicalChat } = require('./src/ai/flows/political-chat.ts');

async function testAIFlows() {
  console.log('Testing AI flows...');
  
  try {
    // Test sentiment analysis
    console.log('Testing sentiment analysis...');
    const sentimentResult = await analyzeCandidateSentiment({
      candidateName: 'William Ruto',
      topic: 'economy'
    });
    console.log('Sentiment analysis result:', sentimentResult);
    
    // Test political chat
    console.log('Testing political chat...');
    const chatResult = await politicalChat({
      message: 'Tell me about the Kenyan parliament'
    });
    console.log('Political chat result:', chatResult);
    
    console.log('AI flows test completed successfully!');
  } catch (error) {
    console.error('AI flows test failed:', error);
  }
}

testAIFlows();