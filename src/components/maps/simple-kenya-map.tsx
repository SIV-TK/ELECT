"use client";

import React, { useEffect, useRef, useState } from 'react';
import type { VoteDistribution } from '@/ai/flows/predict-vote-distribution';

interface SimpleKenyaMapProps {
  data: VoteDistribution[];
  sentimentMode?: boolean;
}

const getColor = (voteShare: number, sentimentMode: boolean = false) => {
  if (sentimentMode) {
    if (voteShare > 75) return '#22c55e';
    if (voteShare > 60) return '#4ade80';
    if (voteShare > 50) return '#86efac';
    if (voteShare >= 50) return '#fef08a';
    if (voteShare > 40) return '#fde047';
    if (voteShare > 25) return '#fca5a5';
    return '#ef4444';
  } else {
    if (voteShare > 75) return '#3b82f6';
    if (voteShare > 60) return '#60a5fa';
    if (voteShare > 50) return '#93c5fd';
    if (voteShare > 40) return '#bfdbfe';
    return '#dbeafe';
  }
};

export function SimpleKenyaMap({ data, sentimentMode = false }: SimpleKenyaMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [leafletMap, setLeafletMap] = useState<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initMap = async () => {
      const L = (await import('leaflet')).default;
      
      if (!mapRef.current) return;

      // Clear existing map if it exists
      if (leafletMap) {
        leafletMap.remove();
        setLeafletMap(null);
      }

      // Clear the container completely
      mapRef.current.innerHTML = '';
      (mapRef.current as any)._leaflet_id = null;

      // Create new map
      const map = L.map(mapRef.current).setView([-0.0236, 37.9062], 6);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Create data map for quick lookup
      const dataMap = new Map(data.map(item => [item.name, item]));

      // Add county markers/circles for visualization
      const counties = [
        { name: 'Nairobi', lat: -1.2921, lng: 36.8219 },
        { name: 'Mombasa', lat: -4.0435, lng: 39.6682 },
        { name: 'Kisumu', lat: -0.0917, lng: 34.7680 },
        { name: 'Nakuru', lat: -0.3031, lng: 36.0800 },
        { name: 'Uasin Gishu', lat: 0.5143, lng: 35.2698 },
        { name: 'Kiambu', lat: -1.1719, lng: 36.8356 },
        { name: 'Machakos', lat: -1.5177, lng: 37.2634 },
        { name: 'Kakamega', lat: 0.2827, lng: 34.7519 },
        { name: 'Bungoma', lat: 0.5635, lng: 34.5606 },
        { name: 'Meru', lat: 0.0467, lng: 37.6556 },
        { name: 'Nyeri', lat: -0.4167, lng: 36.9500 },
        { name: 'Kirinyaga', lat: -0.6667, lng: 37.3000 },
        { name: 'Embu', lat: -0.5396, lng: 37.4513 },
        { name: 'Kitui', lat: -1.3667, lng: 38.0167 },
        { name: 'Makueni', lat: -1.8044, lng: 37.6236 },
        { name: 'Turkana', lat: 3.1167, lng: 35.6000 },
        { name: 'Marsabit', lat: 2.3284, lng: 37.9899 },
        { name: 'Garissa', lat: -0.4536, lng: 39.6401 },
        { name: 'Wajir', lat: 1.7471, lng: 40.0629 },
        { name: 'Mandera', lat: 3.9366, lng: 41.8670 },
        { name: 'Kilifi', lat: -3.5053, lng: 39.8499 },
        { name: 'Kwale', lat: -4.1747, lng: 39.4502 },
        { name: 'Taita-Taveta', lat: -3.3167, lng: 38.3500 },
        { name: 'Kajiado', lat: -1.8500, lng: 36.7833 },
        { name: 'Narok', lat: -1.0833, lng: 35.8667 },
        { name: 'Kericho', lat: -0.3667, lng: 35.2833 },
        { name: 'Bomet', lat: -0.7833, lng: 35.3417 },
        { name: 'Nandi', lat: 0.1833, lng: 35.1000 },
        { name: 'Baringo', lat: 0.4667, lng: 35.9667 },
        { name: 'Laikipia', lat: 0.2000, lng: 36.7833 },
        { name: 'Samburu', lat: 1.3333, lng: 37.1167 },
        { name: 'Isiolo', lat: 0.3542, lng: 37.5820 },
        { name: 'Trans Nzoia', lat: 1.0167, lng: 35.0000 },
        { name: 'West Pokot', lat: 1.4000, lng: 35.1167 },
        { name: 'Elgeyo-Marakwet', lat: 0.7500, lng: 35.5000 },
        { name: 'Vihiga', lat: 0.0667, lng: 34.7167 },
        { name: 'Busia', lat: 0.4667, lng: 34.1167 },
        { name: 'Siaya', lat: 0.0667, lng: 34.2833 },
        { name: 'Homa Bay', lat: -0.5167, lng: 34.4500 },
        { name: 'Migori', lat: -1.0634, lng: 34.4731 },
        { name: 'Kisii', lat: -0.6833, lng: 34.7667 },
        { name: 'Nyamira', lat: -0.5667, lng: 34.9333 },
        { name: 'Tharaka-Nithi', lat: -0.1667, lng: 37.9833 },
        { name: 'Muranga', lat: -0.7167, lng: 37.1500 },
        { name: 'Nyandarua', lat: -0.3000, lng: 36.3667 },
        { name: 'Tana River', lat: -1.0167, lng: 40.1000 },
        { name: 'Lamu', lat: -2.2717, lng: 40.9020 }
      ];

      counties.forEach(county => {
        const countyData = dataMap.get(county.name);
        const voteShare = countyData?.predictedVoteShare ?? 0;
        const color = getColor(voteShare, sentimentMode);

        const circle = L.circleMarker([county.lat, county.lng], {
          color: 'white',
          weight: 2,
          fillColor: color,
          fillOpacity: 0.8,
          radius: Math.max(8, voteShare / 5) // Size based on vote share
        }).addTo(map);

        circle.bindPopup(`
          <div style="padding: 8px;">
            <h3 style="margin: 0 0 4px 0; font-weight: bold;">${county.name}</h3>
            <p style="margin: 0;">Predicted Vote: ${voteShare.toFixed(1)}%</p>
          </div>
        `);
      });

      setLeafletMap(map);
    };

    initMap();

    return () => {
      if (leafletMap) {
        leafletMap.remove();
        setLeafletMap(null);
      }
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
        (mapRef.current as any)._leaflet_id = null;
      }
    };
  }, [data, sentimentMode]);

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border relative">
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
      
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