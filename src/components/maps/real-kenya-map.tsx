"use client";

import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { VoteDistribution } from '@/ai/flows/predict-vote-distribution';
import { kenyaCountiesGeoJSON } from './kenya-geojson';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const GeoJSON = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), { ssr: false });

interface RealKenyaMapProps {
  data: VoteDistribution[];
  sentimentMode?: boolean;
}

const getColor = (voteShare: number, sentimentMode: boolean = false) => {
  if (sentimentMode) {
    if (voteShare > 75) return '#22c55e'; // green-500
    if (voteShare > 60) return '#4ade80'; // green-400
    if (voteShare > 50) return '#86efac'; // green-300
    if (voteShare >= 50) return '#fef08a'; // yellow-200
    if (voteShare > 40) return '#fde047'; // yellow-300
    if (voteShare > 25) return '#fca5a5'; // red-300
    return '#ef4444'; // red-500
  } else {
    if (voteShare > 75) return '#3b82f6'; // primary
    if (voteShare > 60) return '#60a5fa'; // primary/80
    if (voteShare > 50) return '#93c5fd'; // primary/60
    if (voteShare > 40) return '#bfdbfe'; // primary/40
    return '#dbeafe'; // primary/20
  }
};

export function RealKenyaMap({ data, sentimentMode = false }: RealKenyaMapProps) {
  const [isClient, setIsClient] = useState(false);
  const mapRef = useRef<any>(null);
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    setIsClient(true);
    // Force re-render when data changes to avoid map container conflicts
    setMapKey(prev => prev + 1);
  }, [data]);

  useEffect(() => {
    // Cleanup function to prevent memory leaks
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  const dataMap = new Map(data.map(item => [item.name, item]));

  const onEachFeature = (feature: any, layer: any) => {
    const countyName = feature.properties.name;
    const countyData = dataMap.get(countyName);
    const voteShare = countyData?.predictedVoteShare ?? 0;

    layer.bindPopup(`
      <div class="p-2">
        <h3 class="font-bold">${countyName}</h3>
        <p>Predicted Vote: ${voteShare.toFixed(1)}%</p>
      </div>
    `);

    layer.setStyle({
      fillColor: getColor(voteShare, sentimentMode),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    });

    layer.on({
      mouseover: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          weight: 5,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.9
        });
      },
      mouseout: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          weight: 2,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.7
        });
      }
    });
  };

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border relative">
      <MapContainer
        key={mapKey}
        ref={mapRef}
        center={[-0.0236, 37.9062] as [number, number]}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        whenReady={() => {
          // Map is ready
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          data={kenyaCountiesGeoJSON as any}
          eventHandlers={{
            add: (e: any) => {
              const layer = e.target;
              onEachFeature(layer.feature, layer);
            }
          }}
        />
      </MapContainer>
      
      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-md border shadow-lg text-xs z-[1000] max-w-xs">
        <p className="font-bold mb-2">Legend</p>
        {sentimentMode ? (
          <>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-sm" style={{backgroundColor: '#22c55e'}}></div>
              Very Positive
            </div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-sm" style={{backgroundColor: '#4ade80'}}></div>
              Positive
            </div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-sm" style={{backgroundColor: '#fef08a'}}></div>
              Neutral
            </div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-sm" style={{backgroundColor: '#fca5a5'}}></div>
              Negative
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{backgroundColor: '#ef4444'}}></div>
              Very Negative
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-sm" style={{backgroundColor: '#dbeafe'}}></div>
              {'< 40%'}
            </div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-sm" style={{backgroundColor: '#bfdbfe'}}></div>
              40-50%
            </div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-sm" style={{backgroundColor: '#93c5fd'}}></div>
              50-60%
            </div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-sm" style={{backgroundColor: '#60a5fa'}}></div>
              60-75%
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{backgroundColor: '#3b82f6'}}></div>
              {'> 75%'}
            </div>
          </>
        )}
      </div>
    </div>
  );
}