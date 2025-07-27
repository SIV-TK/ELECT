# AI Flows Summary

## Overview
All AI flows have been restored and connected to use real-time data scraping and AI analysis with the provided API keys.

## API Configuration
- **DeepSeek API Key**: `sk-3cd6995fe396452b801d4fc7721a0e6c`
- **Gemini API Key**: `AIzaSyCx-ga-Ywvj8tk3BgleNd3qib5lLO8Bxss`

## Available AI Flows

### 1. Analyze Candidate Sentiment (`analyze-candidate-sentiment.ts`)
- **Purpose**: Analyzes public sentiment about political candidates
- **Data Sources**: Kenyan news sites, social media, government data
- **AI Model**: Gemini 2.0 Flash
- **Output**: Sentiment score (-1 to 1), summary, positive/negative keywords

### 2. Predict Vote Distribution (`predict-vote-distribution.ts`)
- **Purpose**: Predicts vote share across Kenya's 47 counties
- **Data Sources**: Real-time political data, trends, performance analysis
- **AI Model**: Gemini 2.0 Flash
- **Output**: County-wise vote share predictions

### 3. Get Campaign Advice (`get-campaign-advice.ts`)
- **Purpose**: Provides strategic campaign recommendations
- **Data Sources**: Comprehensive political data, public concerns, voter expectations
- **AI Model**: Gemini 2.0 Flash
- **Output**: Strategic recommendations, messaging advice, target audiences, risk assessment

### 4. Explain Constitution (`explain-constitution.ts`)
- **Purpose**: Explains Kenyan constitutional matters in simple language
- **AI Model**: Gemini 2.0 Flash
- **Output**: Explanations, relevant articles, practical examples, citizen rights

### 5. Political Chat (`political-chat.ts`)
- **Purpose**: Interactive chat about Kenyan politics
- **AI Model**: DeepSeek Chat
- **Output**: Educational responses about Kenyan political system

### 6. Enhanced Political Chat (`enhanced-political-chat.ts`)
- **Purpose**: Advanced political chat with real-time context
- **Data Sources**: Current political trends, public concerns
- **AI Model**: Gemini or DeepSeek (configurable)
- **Output**: Context-aware political discussions

### 7. Generate Education Content (`generate-education-content.ts`)
- **Purpose**: Creates civic education materials
- **Data Sources**: Voter expectations, public concerns
- **AI Model**: Gemini 2.0 Flash
- **Output**: Educational content, key points, quizzes, resources

### 8. Analyze Video Veracity (`analyze-video-veracity.ts`)
- **Purpose**: Verifies authenticity of political media content
- **AI Model**: Gemini 2.0 Flash
- **Output**: Verification status, confidence score, analysis flags

### 9. Predict Election Outcome (`predict-election-outcome.ts`)
- **Purpose**: Predicts election winners based on voting data
- **Output**: Predicted winner, key trends analysis

### 10. Summarize Politician (`summarize-politician.ts`)
- **Purpose**: Creates comprehensive politician profiles
- **Output**: Detailed summaries including background, track record, education

### 11. Analyze Tally Anomaly (`analyze-tally-anomaly.ts`)
- **Purpose**: Detects anomalies in election tallies
- **Output**: Anomaly detection, fraud risk assessment, explanations

### 12. Summarize Form 34A (`summarize-form-34a.ts`)
- **Purpose**: Analyzes official election forms
- **Output**: Form analysis, authenticity assessment

### 13. Analyze Intel Veracity (`analyze-intel-veracity.ts`)
- **Purpose**: Verifies crowd-sourced political intelligence
- **Output**: Verification status, confidence scores, flags

### 14. Analyze Trending Topics (`analyze-trending-topics.ts`)
- **Purpose**: Analyzes current political trends
- **Output**: Trending topics with sentiment and relevance scores

## Data Sources Integration

### Web Scraper (`/lib/web-scraper.ts`)
- Kenyan news sources (Nation, Standard, KBC, Capital FM)
- Social media aggregation
- Government websites
- Public sentiment analysis

### Kenya Political Data Service (`/lib/kenya-political-data.ts`)
- Political trends tracking
- Performance analysis (SWOT)
- Public concerns compilation
- Voter expectations analysis

## Usage Examples

```typescript
// Sentiment Analysis
const sentiment = await analyzeCandidateSentiment({
  candidateName: 'William Ruto',
  topic: 'economy'
});

// Vote Prediction
const prediction = await predictVoteDistribution({
  candidateName: 'Raila Odinga',
  topic: 'healthcare',
  sentimentScore: 0.3
});

// Campaign Advice
const advice = await getCampaignAdvice({
  candidateName: 'Martha Karua',
  trendingTopics: '#YouthUnemployment, #CorruptionFight',
  candidateCurrentStance: 'Anti-corruption advocate',
  userSentimentAnalysis: 'Positive among women voters'
});
```

## Error Handling
All flows include comprehensive error handling with fallback responses to ensure the application remains functional even if AI services are temporarily unavailable.

## Security
- API keys are stored in environment variables
- All flows include input validation
- Responses are sanitized and safe for display

## Performance
- Flows use appropriate AI models for each task
- Temperature and token limits are optimized
- Caching is implemented where appropriate