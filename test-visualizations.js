// Test the interactive visualizations API endpoints
async function testVisualizationAPIs() {
  console.log('🧪 Testing Interactive Visualization APIs...\n');

  const APIs = [
    {
      name: 'AI Dashboards',
      endpoint: '/api/ai-dashboards',
      payload: {
        template: 'election-monitoring',
        customization: {
          widgets: ['voter-turnout', 'party-performance'],
          timeframe: '7days'
        }
      }
    },
    {
      name: 'Predictive Heat Maps', 
      endpoint: '/api/predictive-heatmaps',
      payload: {
        type: 'election-outcomes',
        timeframe: '1month',
        granularity: 'county',
        includeFactors: true
      }
    },
    {
      name: 'Policy Comparison',
      endpoint: '/api/policy-comparison', 
      payload: {
        parties: ['UDA', 'ODM', 'Wiper'],
        categories: ['economic', 'social'],
        comparisonType: 'summary'
      }
    },
    {
      name: 'Political Timeline',
      endpoint: '/api/political-timeline',
      payload: {
        timeframe: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
          end: new Date().toISOString()
        },
        categories: ['elections', 'governance'],
        includeConnections: true,
        includeAnalysis: true
      }
    }
  ];

  for (const api of APIs) {
    try {
      console.log(`📡 Testing ${api.name}...`);
      
      const response = await fetch(`http://localhost:3000${api.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(api.payload)
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        console.log(`✅ ${api.name} - SUCCESS`);
        console.log(`   Generated data: ${JSON.stringify(result).substring(0, 100)}...`);
      } else {
        console.log(`❌ ${api.name} - FAILED`);
        console.log(`   Error: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.log(`❌ ${api.name} - ERROR: ${error.message}`);
    }
    
    console.log(''); // Add spacing
  }
}

// Run the test
testVisualizationAPIs();
