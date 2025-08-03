"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import('react-leaflet').then(mod => mod.CircleMarker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface CountyData {
  name: string;
  support: number;
}

interface KenyaSentimentMapProps {
  countyData: CountyData[];
}

export default function KenyaSentimentMap({ countyData }: KenyaSentimentMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getColor = (support: number) => {
    return support >= 60 ? '#22c55e' : support >= 45 ? '#eab308' : '#ef4444';
  };

  const kenyaGeoJSON = {
    "type": "FeatureCollection",
    "features": [
      {"type": "Feature", "properties": {"name": "Nairobi"}, "geometry": {"type": "Polygon", "coordinates": [[[36.75, -1.32], [36.85, -1.32], [36.85, -1.22], [36.75, -1.22], [36.75, -1.32]]]}},
      {"type": "Feature", "properties": {"name": "Mombasa"}, "geometry": {"type": "Polygon", "coordinates": [[[39.6, -4.1], [39.8, -4.1], [39.8, -3.9], [39.6, -3.9], [39.6, -4.1]]]}},
      {"type": "Feature", "properties": {"name": "Kisumu"}, "geometry": {"type": "Polygon", "coordinates": [[[34.6, -0.2], [35.0, -0.2], [35.0, 0.2], [34.6, 0.2], [34.6, -0.2]]]}},
      {"type": "Feature", "properties": {"name": "Nakuru"}, "geometry": {"type": "Polygon", "coordinates": [[[35.8, -1.0], [36.4, -1.0], [36.4, -0.2], [35.8, -0.2], [35.8, -1.0]]]}},
      {"type": "Feature", "properties": {"name": "Kiambu"}, "geometry": {"type": "Polygon", "coordinates": [[[36.6, -1.2], [37.2, -1.2], [37.2, -0.8], [36.6, -0.8], [36.6, -1.2]]]}},
      {"type": "Feature", "properties": {"name": "Machakos"}, "geometry": {"type": "Polygon", "coordinates": [[[36.8, -1.8], [37.6, -1.8], [37.6, -1.0], [36.8, -1.0], [36.8, -1.8]]]}},
      {"type": "Feature", "properties": {"name": "Meru"}, "geometry": {"type": "Polygon", "coordinates": [[[37.4, -0.5], [38.2, -0.5], [38.2, 0.3], [37.4, 0.3], [37.4, -0.5]]]}},
      {"type": "Feature", "properties": {"name": "Nyeri"}, "geometry": {"type": "Polygon", "coordinates": [[[36.8, -0.8], [37.4, -0.8], [37.4, -0.2], [36.8, -0.2], [36.8, -0.8]]]}},
      {"type": "Feature", "properties": {"name": "Kakamega"}, "geometry": {"type": "Polygon", "coordinates": [[[34.4, -0.2], [35.0, -0.2], [35.0, 0.6], [34.4, 0.6], [34.4, -0.2]]]}},
      {"type": "Feature", "properties": {"name": "Busia"}, "geometry": {"type": "Polygon", "coordinates": [[[33.8, -0.2], [34.4, -0.2], [34.4, 0.6], [33.8, 0.6], [33.8, -0.2]]]}},
      {"type": "Feature", "properties": {"name": "Siaya"}, "geometry": {"type": "Polygon", "coordinates": [[[34.0, -0.6], [34.6, -0.6], [34.6, 0.2], [34.0, 0.2], [34.0, -0.6]]]}},
      {"type": "Feature", "properties": {"name": "Kisii"}, "geometry": {"type": "Polygon", "coordinates": [[[34.6, -1.2], [35.2, -1.2], [35.2, -0.4], [34.6, -0.4], [34.6, -1.2]]]}},
      {"type": "Feature", "properties": {"name": "Migori"}, "geometry": {"type": "Polygon", "coordinates": [[[34.0, -1.6], [34.8, -1.6], [34.8, -0.8], [34.0, -0.8], [34.0, -1.6]]]}},
      {"type": "Feature", "properties": {"name": "Homa Bay"}, "geometry": {"type": "Polygon", "coordinates": [[[34.2, -1.0], [34.8, -1.0], [34.8, -0.2], [34.2, -0.2], [34.2, -1.0]]]}},
      {"type": "Feature", "properties": {"name": "Turkana"}, "geometry": {"type": "Polygon", "coordinates": [[[34.5, 2.0], [36.0, 2.0], [36.0, 4.0], [34.5, 4.0], [34.5, 2.0]]]}},
      {"type": "Feature", "properties": {"name": "Marsabit"}, "geometry": {"type": "Polygon", "coordinates": [[[36.8, 1.0], [39.0, 1.0], [39.0, 4.4], [36.8, 4.4], [36.8, 1.0]]]}},
      {"type": "Feature", "properties": {"name": "Garissa"}, "geometry": {"type": "Polygon", "coordinates": [[[38.4, -1.6], [41.0, -1.6], [41.0, 1.6], [38.4, 1.6], [38.4, -1.6]]]}},
      {"type": "Feature", "properties": {"name": "Wajir"}, "geometry": {"type": "Polygon", "coordinates": [[[39.0, 1.0], [41.0, 1.0], [41.0, 3.9], [39.0, 3.9], [39.0, 1.0]]]}},
      {"type": "Feature", "properties": {"name": "Mandera"}, "geometry": {"type": "Polygon", "coordinates": [[[40.0, 3.2], [41.9, 3.2], [41.9, 4.7], [40.0, 4.7], [40.0, 3.2]]]}},
      {"type": "Feature", "properties": {"name": "Isiolo"}, "geometry": {"type": "Polygon", "coordinates": [[[37.4, 0.0], [38.8, 0.0], [38.8, 1.2], [37.4, 1.2], [37.4, 0.0]]]}},
      {"type": "Feature", "properties": {"name": "Samburu"}, "geometry": {"type": "Polygon", "coordinates": [[[36.2, 0.8], [37.8, 0.8], [37.8, 2.4], [36.2, 2.4], [36.2, 0.8]]]}},
      {"type": "Feature", "properties": {"name": "Laikipia"}, "geometry": {"type": "Polygon", "coordinates": [[[36.2, -0.2], [37.4, -0.2], [37.4, 0.8], [36.2, 0.8], [36.2, -0.2]]]}},
      {"type": "Feature", "properties": {"name": "Nyandarua"}, "geometry": {"type": "Polygon", "coordinates": [[[36.2, -0.8], [36.8, -0.8], [36.8, -0.2], [36.2, -0.2], [36.2, -0.8]]]}},
      {"type": "Feature", "properties": {"name": "Nyamira"}, "geometry": {"type": "Polygon", "coordinates": [[[34.8, -1.0], [35.2, -1.0], [35.2, -0.6], [34.8, -0.6], [34.8, -1.0]]]}},
      {"type": "Feature", "properties": {"name": "Kericho"}, "geometry": {"type": "Polygon", "coordinates": [[[35.0, -0.8], [35.6, -0.8], [35.6, -0.2], [35.0, -0.2], [35.0, -0.8]]]}},
      {"type": "Feature", "properties": {"name": "Bomet"}, "geometry": {"type": "Polygon", "coordinates": [[[35.0, -1.2], [35.6, -1.2], [35.6, -0.6], [35.0, -0.6], [35.0, -1.2]]]}},
      {"type": "Feature", "properties": {"name": "Nandi"}, "geometry": {"type": "Polygon", "coordinates": [[[34.8, 0.0], [35.4, 0.0], [35.4, 0.6], [34.8, 0.6], [34.8, 0.0]]]}},
      {"type": "Feature", "properties": {"name": "Uasin Gishu"}, "geometry": {"type": "Polygon", "coordinates": [[[35.0, 0.4], [35.8, 0.4], [35.8, 1.0], [35.0, 1.0], [35.0, 0.4]]]}},
      {"type": "Feature", "properties": {"name": "Trans Nzoia"}, "geometry": {"type": "Polygon", "coordinates": [[[34.6, 0.6], [35.2, 0.6], [35.2, 1.2], [34.6, 1.2], [34.6, 0.6]]]}},
      {"type": "Feature", "properties": {"name": "Bungoma"}, "geometry": {"type": "Polygon", "coordinates": [[[34.2, 0.4], [34.8, 0.4], [34.8, 1.0], [34.2, 1.0], [34.2, 0.4]]]}},
      {"type": "Feature", "properties": {"name": "Vihiga"}, "geometry": {"type": "Polygon", "coordinates": [[[34.6, -0.2], [35.0, -0.2], [35.0, 0.2], [34.6, 0.2], [34.6, -0.2]]]}},
      {"type": "Feature", "properties": {"name": "Baringo"}, "geometry": {"type": "Polygon", "coordinates": [[[35.6, 0.2], [36.4, 0.2], [36.4, 1.2], [35.6, 1.2], [35.6, 0.2]]]}},
      {"type": "Feature", "properties": {"name": "Elgeyo Marakwet"}, "geometry": {"type": "Polygon", "coordinates": [[[35.2, 0.6], [35.8, 0.6], [35.8, 1.2], [35.2, 1.2], [35.2, 0.6]]]}},
      {"type": "Feature", "properties": {"name": "West Pokot"}, "geometry": {"type": "Polygon", "coordinates": [[[34.8, 1.0], [35.6, 1.0], [35.6, 2.0], [34.8, 2.0], [34.8, 1.0]]]}},
      {"type": "Feature", "properties": {"name": "Kajiado"}, "geometry": {"type": "Polygon", "coordinates": [[[36.2, -2.8], [37.2, -2.8], [37.2, -1.2], [36.2, -1.2], [36.2, -2.8]]]}},
      {"type": "Feature", "properties": {"name": "Makueni"}, "geometry": {"type": "Polygon", "coordinates": [[[37.2, -2.4], [38.2, -2.4], [38.2, -1.4], [37.2, -1.4], [37.2, -2.4]]]}},
      {"type": "Feature", "properties": {"name": "Kitui"}, "geometry": {"type": "Polygon", "coordinates": [[[37.6, -1.8], [39.0, -1.8], [39.0, -0.2], [37.6, -0.2], [37.6, -1.8]]]}},
      {"type": "Feature", "properties": {"name": "Embu"}, "geometry": {"type": "Polygon", "coordinates": [[[37.2, -0.8], [37.8, -0.8], [37.8, -0.2], [37.2, -0.2], [37.2, -0.8]]]}},
      {"type": "Feature", "properties": {"name": "Tharaka Nithi"}, "geometry": {"type": "Polygon", "coordinates": [[[37.6, -0.6], [38.2, -0.6], [38.2, 0.0], [37.6, 0.0], [37.6, -0.6]]]}},
      {"type": "Feature", "properties": {"name": "Murang'a"}, "geometry": {"type": "Polygon", "coordinates": [[[36.8, -1.2], [37.4, -1.2], [37.4, -0.6], [36.8, -0.6], [36.8, -1.2]]]}},
      {"type": "Feature", "properties": {"name": "Kirinyaga"}, "geometry": {"type": "Polygon", "coordinates": [[[37.0, -0.8], [37.6, -0.8], [37.6, -0.2], [37.0, -0.2], [37.0, -0.8]]]}},
      {"type": "Feature", "properties": {"name": "Kilifi"}, "geometry": {"type": "Polygon", "coordinates": [[[39.4, -4.0], [40.2, -4.0], [40.2, -2.8], [39.4, -2.8], [39.4, -4.0]]]}},
      {"type": "Feature", "properties": {"name": "Kwale"}, "geometry": {"type": "Polygon", "coordinates": [[[39.0, -4.8], [39.8, -4.8], [39.8, -3.8], [39.0, -3.8], [39.0, -4.8]]]}},
      {"type": "Feature", "properties": {"name": "Lamu"}, "geometry": {"type": "Polygon", "coordinates": [[[40.2, -2.8], [41.4, -2.8], [41.4, -1.6], [40.2, -1.6], [40.2, -2.8]]]}},
      {"type": "Feature", "properties": {"name": "Taita Taveta"}, "geometry": {"type": "Polygon", "coordinates": [[[37.8, -4.2], [38.8, -4.2], [38.8, -3.0], [37.8, -3.0], [37.8, -4.2]]]}},
      {"type": "Feature", "properties": {"name": "Tana River"}, "geometry": {"type": "Polygon", "coordinates": [[[39.0, -2.4], [40.6, -2.4], [40.6, -0.8], [39.0, -0.8], [39.0, -2.4]]]}},
      {"type": "Feature", "properties": {"name": "Narok"}, "geometry": {"type": "Polygon", "coordinates": [[[35.2, -2.0], [36.2, -2.0], [36.2, -0.8], [35.2, -0.8], [35.2, -2.0]]]}} 
    ]
  };

  if (!isClient) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden">
      <MapContainer
        center={[-0.0236, 37.9062]}
        zoom={6.5}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {countyData.map((county) => {
          const positions = {
            'Nairobi': [-1.2921, 36.8219], 'Mombasa': [-4.0435, 39.6682], 'Kisumu': [-0.0917, 34.7680],
            'Nakuru': [-0.3031, 36.0800], 'Kiambu': [-1.1714, 36.8356], 'Machakos': [-1.5177, 37.2634],
            'Meru': [0.0467, 37.6500], 'Nyeri': [-0.4167, 36.9500], 'Kakamega': [0.2827, 34.7519],
            'Busia': [0.4601, 34.1115], 'Siaya': [0.0609, 34.2888], 'Kisii': [-0.6774, 34.7692],
            'Migori': [-1.0634, 34.4731], 'Homa Bay': [-0.5273, 34.4569], 'Turkana': [3.1167, 35.5667],
            'Marsabit': [2.3284, 37.9899], 'Garissa': [-0.4536, 39.6401], 'Wajir': [1.7471, 40.0629],
            'Mandera': [3.9366, 41.8670], 'Isiolo': [0.3556, 37.5833], 'Samburu': [1.1748, 36.8006],
            'Laikipia': [0.5143, 36.7879], 'Nyandarua': [-0.3924, 36.4275], 'Nyamira': [-0.5633, 34.9358],
            'Kericho': [-0.3691, 35.2861], 'Bomet': [-0.7895, 35.3414], 'Nandi': [0.1632, 35.1027],
            'Uasin Gishu': [0.5143, 35.2699], 'Trans Nzoia': [1.0218, 35.0062], 'Bungoma': [0.5635, 34.5606],
            'Vihiga': [0.0659, 34.7278], 'Baringo': [0.4684, 35.9738], 'Elgeyo Marakwet': [0.5500, 35.4500],
            'West Pokot': [1.4000, 35.1167], 'Kajiado': [-2.0978, 36.7820], 'Makueni': [-1.8038, 37.6243],
            'Kitui': [-1.3667, 38.0100], 'Embu': [-0.5396, 37.4513], 'Tharaka Nithi': [-0.1833, 37.9833],
            'Murang\'a': [-0.7167, 37.1500], 'Kirinyaga': [-0.6667, 37.3000], 'Kilifi': [-3.5053, 39.8992],
            'Kwale': [-4.1747, 39.4502], 'Lamu': [-2.2717, 40.9020], 'Taita Taveta': [-3.3167, 38.3500],
            'Tana River': [-1.0167, 40.1000], 'Narok': [-1.0833, 35.8667]
          };
          
          const position = positions[county.name as keyof typeof positions] || [-1.2921, 36.8219];
          
          return (
            <CircleMarker
              key={county.name}
              center={position as [number, number]}
              radius={8}
              pathOptions={{
                fillColor: getColor(county.support),
                color: '#ffffff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
              }}
            >
              <Popup>
                <b>{county.name}</b><br/>
                Support: {county.support}%
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}