import { NextResponse } from 'next/server';

export async function GET() {
  const users = ['John K.', 'Mary W.', 'Peter M.', 'Grace N.', 'David O.', 'Sarah L.', 'James M.'];
  const actions = [
    { type: 'sentiment', action: 'Analyzed sentiment for William Ruto', details: 'Score: 72% positive' },
    { type: 'fact_check', action: 'Fact-checked political statement', details: 'Result: Misleading' },
    { type: 'registration', action: 'Completed voter registration', details: 'Nairobi County' },
    { type: 'education', action: 'Completed civic education module', details: 'Electoral System' },
    { type: 'risk_analysis', action: 'Assessed corruption risk', details: 'Medium risk detected' },
    { type: 'media_bias', action: 'Analyzed media bias', details: 'Left bias detected' }
  ];

  const activities = Array.from({length: 8}, (_, i) => {
    const action = actions[Math.floor(Math.random() * actions.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const minutesAgo = Math.floor(Math.random() * 30) + 1;
    
    return {
      id: `activity-${Date.now()}-${i}`,
      type: action.type,
      action: action.action,
      details: action.details,
      user,
      time: `${minutesAgo} min ago`,
      isNew: Math.random() > 0.7,
      timestamp: new Date(Date.now() - minutesAgo * 60000).toISOString()
    };
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return NextResponse.json({ activities });
}