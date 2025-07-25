"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Users, Search, Layers } from 'lucide-react';

interface Constituency {
  name: string;
  county: string;
  mp: string;
  party: string;
  voters: number;
  area: number;
  lat: number;
  lng: number;
}

export default function ConstituencyMapping() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [selectedCounty, setSelectedCounty] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConstituency, setSelectedConstituency] = useState<Constituency | null>(null);
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);

  useEffect(() => {
    // Mock constituency data
    const mockData: Constituency[] = [
      { name: 'Westlands', county: 'Nairobi', mp: 'Tim Wanyonyi', party: 'ODM', voters: 125000, area: 45, lat: -1.2634, lng: 36.8063 },
      { name: 'Starehe', county: 'Nairobi', mp: 'Amos Kimunya', party: 'UDA', voters: 98000, area: 32, lat: -1.2841, lng: 36.8155 },
      { name: 'Kisumu East', county: 'Kisumu', mp: 'Shakeel Shabbir', party: 'ODM', voters: 87000, area: 78, lat: -0.0917, lng: 34.7680 },
      { name: 'Eldoret North', county: 'Uasin Gishu', mp: 'Oscar Sudi', party: 'UDA', voters: 112000, area: 156, lat: 0.5143, lng: 35.2698 },
      { name: 'Mombasa Island', county: 'Mombasa', mp: 'Abdulswamad Nassir', party: 'ODM', voters: 76000, area: 15, lat: -4.0435, lng: 39.6682 }
    ];
    setConstituencies(mockData);
  }, []);

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

        const map = L.map(container, {
          center: [-0.5, 37.5],
          zoom: 6,
          zoomControl: true,
          maxZoom: 12,
          minZoom: 5
        });

        mapInstanceRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add constituency markers
        constituencies.forEach(constituency => {
          if (selectedCounty !== 'all' && constituency.county !== selectedCounty) return;
          if (searchTerm && !constituency.name.toLowerCase().includes(searchTerm.toLowerCase())) return;

          const marker = L.circleMarker([constituency.lat, constituency.lng], {
            color: constituency.party === 'UDA' ? '#dc2626' : constituency.party === 'ODM' ? '#2563eb' : '#16a34a',
            weight: 2,
            fillColor: constituency.party === 'UDA' ? '#fca5a5' : constituency.party === 'ODM' ? '#93c5fd' : '#86efac',
            fillOpacity: 0.7,
            radius: Math.max(8, constituency.voters / 10000)
          }).addTo(map);

          marker.bindPopup(`
            <div style="padding: 8px; min-width: 200px;">
              <h3 style="margin: 0 0 4px 0; font-weight: bold;">${constituency.name}</h3>
              <p style="margin: 0 0 2px 0;"><strong>County:</strong> ${constituency.county}</p>
              <p style="margin: 0 0 2px 0;"><strong>MP:</strong> ${constituency.mp}</p>
              <p style="margin: 0 0 2px 0;"><strong>Party:</strong> ${constituency.party}</p>
              <p style="margin: 0 0 2px 0;"><strong>Voters:</strong> ${constituency.voters.toLocaleString()}</p>
              <p style="margin: 0;"><strong>Area:</strong> ${constituency.area} km²</p>
            </div>
          `);

          marker.on('click', () => {
            setSelectedConstituency(constituency);
          });
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
  }, [constituencies, selectedCounty, searchTerm]);

  const counties = [...new Set(constituencies.map(c => c.county))];
  const filteredConstituencies = constituencies.filter(c => 
    (selectedCounty === 'all' || c.county === selectedCounty) &&
    (!searchTerm || c.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Constituency Mapping</h1>
        <p className="text-muted-foreground">Interactive electoral boundary visualization</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">County</label>
                <Select value={selectedCounty} onValueChange={setSelectedCounty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select county" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Counties</SelectItem>
                    {counties.map(county => (
                      <SelectItem key={county} value={county}>{county}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search constituency..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-2">Legend</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <span className="text-sm">UDA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                    <span className="text-sm">ODM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <span className="text-sm">Other</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {selectedConstituency && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {selectedConstituency.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">County:</span>
                  <span className="text-sm font-medium">{selectedConstituency.county}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">MP:</span>
                  <span className="text-sm font-medium">{selectedConstituency.mp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Party:</span>
                  <Badge variant={selectedConstituency.party === 'UDA' ? 'destructive' : 'default'}>
                    {selectedConstituency.party}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Voters:</span>
                  <span className="text-sm font-medium">{selectedConstituency.voters.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Area:</span>
                  <span className="text-sm font-medium">{selectedConstituency.area} km²</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Electoral Map</CardTitle>
              <CardDescription>
                {filteredConstituencies.length} constituencies shown
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div ref={mapRef} className="w-full h-[600px] rounded-lg border" />
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Constituency List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredConstituencies.map((constituency) => (
              <div
                key={constituency.name}
                className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => setSelectedConstituency(constituency)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{constituency.name}</h4>
                  <Badge variant={constituency.party === 'UDA' ? 'destructive' : 'default'} className="text-xs">
                    {constituency.party}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{constituency.county} County</p>
                <p className="text-sm font-medium">{constituency.mp}</p>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>{constituency.voters.toLocaleString()} voters</span>
                  <span>{constituency.area} km²</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}