# Campaign Advice API Documentation

## Overview

The Campaign Advice API provides AI-powered strategic campaign recommendations for Kenyan politicians based on real-time political data analysis, public sentiment, and trending topics.

## Features

### 🔍 Real-time Data Analysis
- Scrapes latest Kenyan political news from major sources
- Analyzes social media sentiment and discussions
- Monitors government communications and official statements
- Tracks trending political topics and hashtags

### 🧠 AI-Powered Insights
- Generates strategic campaign advice using advanced AI
- Performs SWOT analysis (Strengths, Weaknesses, Opportunities, Threats)
- Identifies key public concerns and voter expectations
- Provides actionable recommendations for campaign strategy

### 📊 Comprehensive Analysis
- **Public Sentiment**: Analyzes what people are saying about the politician
- **Trending Topics**: Identifies current political discussions and hashtags
- **Voter Concerns**: Highlights key issues affecting Kenyan voters
- **Strategic Recommendations**: Provides specific, actionable campaign advice

## API Endpoint

### POST `/api/campaign-advice`

Generates AI-powered campaign advice for a specified politician.

#### Request Body
```json
{
  "candidateName": "William Ruto"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "advice": "Strategic campaign advice text...",
    "metadata": {
      "dataSourcesCount": 12,
      "trendingTopics": ["#CostOfLiving", "#YouthUnemployment", "#CorruptionFight"],
      "publicConcerns": ["High cost of living", "Youth unemployment", "Corruption"],
      "voterExpectations": ["Transparent leadership", "Economic policies", "Job creation"],
      "swotAnalysis": {
        "strengths": ["Strong regional support", "Effective communication"],
        "weaknesses": ["Mixed economic perception", "Youth engagement challenges"],
        "opportunities": ["Digital governance", "Youth policies"],
        "threats": ["Rising costs", "Opposition messaging"]
      },
      "lastUpdated": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

## Data Sources

### News Sources
- Nation Media Group (nation.co.ke)
- Standard Media Group (standardmedia.co.ke)
- Kenya Broadcasting Corporation (kbc.co.ke)
- Capital FM (capitalfm.co.ke)

### Government Sources
- Office of the President (president.go.ke)
- Parliament of Kenya (parliament.go.ke)
- Independent Electoral and Boundaries Commission (iebc.or.ke)

### Analysis Categories
- **Economic Policies**: Cost of living, taxation, job creation
- **Leadership Style**: Communication, decision-making, public presence
- **Policy Promises**: Campaign commitments and implementation
- **Public Trust**: Transparency, accountability, corruption perception

## Key Features

### 1. Public Sentiment Analysis
Analyzes public opinion across multiple dimensions:
- Economic policy reception
- Leadership style perception
- Policy promise credibility
- Overall trust levels

### 2. Trending Topic Identification
Automatically identifies relevant political hashtags and topics:
- #CostOfLiving
- #YouthUnemployment
- #CorruptionFight
- #HealthcareReform
- #EducationFunding
- #InfrastructureDevelopment

### 3. SWOT Analysis
Provides comprehensive strategic analysis:
- **Strengths**: What's working well for the politician
- **Weaknesses**: Areas needing improvement
- **Opportunities**: Emerging chances to capitalize on
- **Threats**: Challenges and risks to address

### 4. Voter Expectations Mapping
Identifies what Kenyan voters expect from leaders:
- Transparent and accountable leadership
- Effective economic policies
- Job creation and youth empowerment
- Improved healthcare and education
- Infrastructure development

## Usage Examples

### Frontend Integration
```javascript
const getCampaignAdvice = async (politicianName) => {
  const response = await fetch('/api/campaign-advice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ candidateName: politicianName })
  });
  
  const result = await response.json();
  return result.data;
};
```

### React Component Usage
```jsx
const [advice, setAdvice] = useState(null);
const [loading, setLoading] = useState(false);

const handleSubmit = async (politicianName) => {
  setLoading(true);
  try {
    const data = await getCampaignAdvice(politicianName);
    setAdvice(data.advice);
  } catch (error) {
    console.error('Failed to get advice:', error);
  } finally {
    setLoading(false);
  }
};
```

## Technical Implementation

### Architecture
- **API Layer**: Next.js API routes for handling requests
- **Data Layer**: Web scraping services for real-time data collection
- **AI Layer**: Genkit AI flows for generating strategic advice
- **Analysis Layer**: Specialized services for Kenyan political data

### Key Components
1. **WebScraper**: Handles data collection from various sources
2. **KenyaPoliticalDataService**: Specialized Kenyan political analysis
3. **getCampaignAdvice**: AI flow for generating strategic recommendations
4. **Campaign Advice API**: RESTful endpoint for client integration

### Performance Considerations
- Parallel data fetching for improved response times
- Caching mechanisms for frequently requested politicians
- Error handling and fallback strategies
- Rate limiting to prevent abuse

## Security & Privacy

- No personal data storage
- Anonymous analysis of public information
- Secure API endpoints with proper validation
- Compliance with data protection regulations

## Future Enhancements

- Real-time social media API integration
- Historical trend analysis
- Multi-language support (Swahili, English)
- Regional sentiment analysis by county
- Predictive modeling for election outcomes
- Integration with polling data