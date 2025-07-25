import { NextResponse } from 'next/server';

export async function GET() {
  const candidates = ['William Ruto', 'Raila Odinga', 'Martha Karua', 'Kalonzo Musyoka'];
  
  const data = {
    totalVotes: Math.floor(Math.random() * 500000) + 2000000,
    turnout: Math.floor(Math.random() * 20) + 65,
    results: candidates.map(name => ({
      name,
      votes: Math.floor(Math.random() * 800000) + 200000,
      percentage: Math.floor(Math.random() * 40) + 15,
      trend: Math.random() > 0.5 ? 'up' : 'down'
    })),
    counties: Array.from({length: 10}, (_, i) => ({
      name: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'][i % 5],
      reportingStations: Math.floor(Math.random() * 50) + 150,
      totalStations: 200,
      leadingCandidate: candidates[Math.floor(Math.random() * candidates.length)]
    })),
    lastUpdate: new Date().toISOString()
  };

  return NextResponse.json(data);
}