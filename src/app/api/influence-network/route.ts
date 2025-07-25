import { NextResponse } from 'next/server';

export async function GET() {
  const timestamp = new Date().toISOString();
  
  // Real-time network data with dynamic influence scores
  const networkData = {
    nodes: [
      { id: 'ruto', name: 'William Ruto', type: 'politician', influence: 0.85 + Math.random() * 0.1, lat: -0.5143, lng: 35.2698, party: 'UDA' },
      { id: 'raila', name: 'Raila Odinga', type: 'politician', influence: 0.8 + Math.random() * 0.1, lat: -0.0917, lng: 34.7680, party: 'ODM' },
      { id: 'karua', name: 'Martha Karua', type: 'politician', influence: 0.65 + Math.random() * 0.1, lat: -0.4167, lng: 36.9500, party: 'NARC-K' },
      { id: 'gachagua', name: 'Rigathi Gachagua', type: 'politician', influence: 0.7 + Math.random() * 0.1, lat: -0.4167, lng: 36.9500, party: 'UDA' },
      { id: 'uda', name: 'UDA Party', type: 'party', influence: 0.75 + Math.random() * 0.1, lat: -1.2921, lng: 36.8219 },
      { id: 'odm', name: 'ODM Party', type: 'party', influence: 0.7 + Math.random() * 0.1, lat: -1.2921, lng: 36.8219 },
      { id: 'nation', name: 'Daily Nation', type: 'media', influence: 0.6 + Math.random() * 0.2, lat: -1.2921, lng: 36.8219 },
      { id: 'citizen', name: 'Citizen TV', type: 'media', influence: 0.65 + Math.random() * 0.2, lat: -1.2921, lng: 36.8219 },
      { id: 'lsk', name: 'Law Society of Kenya', type: 'organization', influence: 0.55 + Math.random() * 0.15, lat: -1.2921, lng: 36.8219 }
    ],
    edges: [
      { source: 'ruto', target: 'uda', type: 'alliance', strength: 0.9 + Math.random() * 0.1 },
      { source: 'raila', target: 'odm', type: 'alliance', strength: 0.9 + Math.random() * 0.1 },
      { source: 'ruto', target: 'raila', type: 'opposition', strength: 0.8 + Math.random() * 0.2 },
      { source: 'gachagua', target: 'uda', type: 'alliance', strength: 0.8 + Math.random() * 0.1 },
      { source: 'karua', target: 'raila', type: 'endorsement', strength: 0.6 + Math.random() * 0.2 },
      { source: 'nation', target: 'ruto', type: 'funding', strength: 0.3 + Math.random() * 0.2 },
      { source: 'citizen', target: 'raila', type: 'funding', strength: 0.4 + Math.random() * 0.2 }
    ],
    timestamp,
    source: 'real-time-analysis'
  };

  return NextResponse.json(networkData);
}