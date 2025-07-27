# DeepSeek AI Integration

## Configuration
- **Primary AI Model**: DeepSeek Chat (`deepseek/deepseek-chat`)
- **API Key**: `sk-3cd6995fe396452b801d4fc7721a0e6c`
- **Fallback Model**: Gemini (for specific use cases)

## Updated AI Flows Using DeepSeek

### Core Analysis Flows
1. **analyze-candidate-sentiment.ts** - DeepSeek Chat
2. **predict-vote-distribution.ts** - DeepSeek Chat  
3. **get-campaign-advice.ts** - DeepSeek Chat
4. **explain-constitution.ts** - DeepSeek Chat
5. **political-chat.ts** - DeepSeek Chat (already configured)
6. **enhanced-political-chat.ts** - DeepSeek Chat (default)
7. **generate-education-content.ts** - DeepSeek Chat
8. **analyze-video-veracity.ts** - DeepSeek Chat

### Model Selection Logic
- **Default**: DeepSeek Chat for all political analysis
- **Coding Tasks**: DeepSeek Coder (when needed)
- **Fallback**: Gemini for specific edge cases

## Benefits of DeepSeek Integration
- Specialized in reasoning and analysis
- Better performance for political content analysis
- Cost-effective for high-volume requests
- Consistent model across all flows