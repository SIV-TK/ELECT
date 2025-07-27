"use client";

import React, { useEffect, useRef, useState } from 'react';
import type { VoteDistribution } from '@/ai/flows/predict-vote-distribution';

interface FixedKenyaMapProps {
  data: VoteDistribution[];
  sentimentMode?: boolean;
}

const getColor = (voteShare: number) => {
  if (voteShare > 75) return '#22c55e';
  if (voteShare > 60) return '#4ade80';
  if (voteShare > 50) return '#86efac';
  if (voteShare > 40) return '#fde047';
  return '#ef4444';
};

export default function FixedKenyaMap({ data, sentimentMode = false }: FixedKenyaMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    const initMap = async () => {
      try {
        const L = (await import('leaflet')).default;
        
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        const container = mapRef.current;
        if (container) {
          container.innerHTML = '';
          delete (container as any)._leaflet_id;
        }

        if (!container) return;
        
        const map = L.map(container, {
          center: [-0.5, 37.5],
          zoom: 6.5,
          zoomControl: true,
          maxZoom: 10,
          minZoom: 5
        });

        mapInstanceRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        const counties = [
          { name: 'Nairobi', lat: -1.2921, lng: 36.8219 },
          { name: 'Mombasa', lat: -4.0435, lng: 39.6682 },
          { name: 'Kwale', lat: -4.1747, lng: 39.4502 },
          { name: 'Kilifi', lat: -3.5053, lng: 39.8499 },
          { name: 'Tana River', lat: -1.0167, lng: 40.1000 },
          { name: 'Lamu', lat: -2.2717, lng: 40.9020 },
          { name: 'Taita-Taveta', lat: -3.3167, lng: 38.3500 },
          { name: 'Garissa', lat: -0.4536, lng: 39.6401 },
          { name: 'Wajir', lat: 1.7471, lng: 40.0629 },
          { name: 'Mandera', lat: 3.9366, lng: 41.8670 },
          { name: 'Marsabit', lat: 2.3284, lng: 37.9899 },
          { name: 'Isiolo', lat: 0.3542, lng: 37.5820 },
          { name: 'Meru', lat: 0.0467, lng: 37.6556 },
          { name: 'Tharaka-Nithi', lat: -0.1667, lng: 37.9833 },
          { name: 'Embu', lat: -0.5396, lng: 37.4513 },
          { name: 'Kitui', lat: -1.3667, lng: 38.0167 },
          { name: 'Machakos', lat: -1.5177, lng: 37.2634 },
          { name: 'Makueni', lat: -1.8044, lng: 37.6236 },
          { name: 'Nyandarua', lat: -0.3000, lng: 36.3667 },
          { name: 'Nyeri', lat: -0.4167, lng: 36.9500 },
          { name: 'Kirinyaga', lat: -0.6667, lng: 37.3000 },
          { name: 'Muranga', lat: -0.7167, lng: 37.1500 },
          { name: 'Kiambu', lat: -1.1719, lng: 36.8356 },
          { name: 'Turkana', lat: 3.1167, lng: 35.6000 },
          { name: 'West Pokot', lat: 1.4000, lng: 35.1167 },
          { name: 'Samburu', lat: 1.3333, lng: 37.1167 },
          { name: 'Trans Nzoia', lat: 1.0167, lng: 35.0000 },
          { name: 'Uasin Gishu', lat: 0.5143, lng: 35.2698 },
          { name: 'Elgeyo-Marakwet', lat: 0.7500, lng: 35.5000 },
          { name: 'Nandi', lat: 0.1833, lng: 35.1000 },
          { name: 'Baringo', lat: 0.4667, lng: 35.9667 },
          { name: 'Laikipia', lat: 0.2000, lng: 36.7833 },
          { name: 'Nakuru', lat: -0.3031, lng: 36.0800 },
          { name: 'Narok', lat: -1.0833, lng: 35.8667 },
          { name: 'Kajiado', lat: -1.8500, lng: 36.7833 },
          { name: 'Kericho', lat: -0.3667, lng: 35.2833 },
          { name: 'Bomet', lat: -0.7833, lng: 35.3417 },
          { name: 'Kakamega', lat: 0.2827, lng: 34.7519 },
          { name: 'Vihiga', lat: 0.0667, lng: 34.7167 },
          { name: 'Bungoma', lat: 0.5635, lng: 34.5606 },
          { name: 'Busia', lat: 0.4667, lng: 34.1167 },
          { name: 'Siaya', lat: 0.0667, lng: 34.2833 },
          { name: 'Kisumu', lat: -0.0917, lng: 34.7680 },
          { name: 'Homa Bay', lat: -0.5167, lng: 34.4500 },
          { name: 'Migori', lat: -1.0634, lng: 34.4731 },
          { name: 'Kisii', lat: -0.6833, lng: 34.7667 },
          { name: 'Nyamira', lat: -0.5667, lng: 34.9333 }
        ];

        const dataMap = new Map(data.map(item => [item.name, item]));

        counties.forEach(county => {
          const countyData = dataMap.get(county.name);
          const voteShare = countyData?.predictedVoteShare ?? 0;
          const color = getColor(voteShare);

          const circle = L.circleMarker([county.lat, county.lng], {
            color: voteShare >= 50 ? '#22c55e' : '#ef4444',
            weight: 2,
            fillColor: color,
            fillOpacity: 0.8,
            radius: Math.max(6, voteShare / 4)
          }).addTo(map);

          circle.bindPopup(`
            <div style="padding: 8px; min-width: 150px;">
              <h3 style="margin: 0 0 4px 0; font-weight: bold;">${county.name}</h3>
              <p style="margin: 0;">Vote Share: ${voteShare.toFixed(1)}%</p>
              <p style="margin: 0; color: ${voteShare >= 50 ? '#22c55e' : '#ef4444'}; font-weight: bold;">
                ${voteShare >= 50 ? 'Popular' : 'Unpopular'}
              </p>
            </div>
          `);
        });

      } catch (error) {
        console.error('Map initialization error:', error);
      }
    };

    const timeoutId = setTimeout(initMap, 100);

    return () => {
      clearTimeout(timeoutId);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [data, sentimentMode]);

  return (
    <div className="space-y-4">
      <div className="w-full h-[500px] rounded-lg overflow-hidden border relative">
        <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
        
        <div className="absolute top-4 right-4 bg-white/95 p-3 rounded-lg border shadow-lg text-xs z-[1000]">
          <p className="font-bold mb-2">Sentiment Legend</p>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Popular (≥50%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Unpopular (&lt;50%)</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-green-50 p-3 rounded border">
          <h4 className="font-semibold text-green-800 mb-2">Popular Counties</h4>
          <p className="text-green-600">
            {data.filter(c => c.predictedVoteShare >= 50).length} of {data.length} counties
          </p>
        </div>
        <div className="bg-red-50 p-3 rounded border">
          <h4 className="font-semibold text-red-800 mb-2">Unpopular Counties</h4>
          <p className="text-red-600">
            {data.filter(c => c.predictedVoteShare < 50).length} of {data.length} counties
          </p>
        </div>
      </div>
    </div>
  );
}