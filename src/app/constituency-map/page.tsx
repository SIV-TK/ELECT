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
    // All 47 counties in Kenya with sample constituencies
    const mockData: Constituency[] = [
      // Nairobi County
      { name: 'Westlands', county: 'Nairobi', mp: 'Tim Wanyonyi', party: 'ODM', voters: 125000, area: 45, lat: -1.2634, lng: 36.8063 },
      { name: 'Starehe', county: 'Nairobi', mp: 'Amos Kimunya', party: 'UDA', voters: 98000, area: 32, lat: -1.2841, lng: 36.8155 },
      
      // Mombasa County
      { name: 'Mombasa Island', county: 'Mombasa', mp: 'Abdulswamad Nassir', party: 'ODM', voters: 76000, area: 15, lat: -4.0435, lng: 39.6682 },
      
      // Kisumu County
      { name: 'Kisumu East', county: 'Kisumu', mp: 'Shakeel Shabbir', party: 'ODM', voters: 87000, area: 78, lat: -0.0917, lng: 34.7680 },
      
      // Uasin Gishu County
      { name: 'Eldoret North', county: 'Uasin Gishu', mp: 'Oscar Sudi', party: 'UDA', voters: 112000, area: 156, lat: 0.5143, lng: 35.2698 },
      
      // Nakuru County
      { name: 'Nakuru Town East', county: 'Nakuru', mp: 'David Gikaria', party: 'UDA', voters: 95000, area: 120, lat: -0.3031, lng: 36.0800 },
      
      // Kiambu County
      { name: 'Kiambu', county: 'Kiambu', mp: 'John Machua', party: 'UDA', voters: 89000, area: 85, lat: -1.1714, lng: 36.8356 },
      
      // Machakos County
      { name: 'Machakos Town', county: 'Machakos', mp: 'Victor Munyaka', party: 'Wiper', voters: 67000, area: 95, lat: -1.5177, lng: 37.2634 },
      
      // Kakamega County
      { name: 'Lurambi', county: 'Kakamega', mp: 'Titus Khamala', party: 'ODM', voters: 78000, area: 110, lat: 0.2827, lng: 34.7519 },
      
      // Bungoma County
      { name: 'Kanduyi', county: 'Bungoma', mp: 'John Chikati', party: 'FORD-K', voters: 85000, area: 130, lat: 0.5635, lng: 34.5606 },
      
      // Turkana County
      { name: 'Turkana Central', county: 'Turkana', mp: 'John Lodepe', party: 'ODM', voters: 45000, area: 2500, lat: 3.1190, lng: 35.5966 },
      
      // West Pokot County
      { name: 'Kapenguria', county: 'West Pokot', mp: 'Samuel Moroto', party: 'UDA', voters: 52000, area: 180, lat: 1.2389, lng: 35.1119 },
      
      // Samburu County
      { name: 'Samburu North', county: 'Samburu', mp: 'Aliphine Tuya', party: 'UDA', voters: 38000, area: 1200, lat: 1.5299, lng: 37.1061 },
      
      // Trans Nzoia County
      { name: 'Cherangany', county: 'Trans Nzoia', mp: 'Joshua Kutuny', party: 'UDA', voters: 72000, area: 140, lat: 1.0218, lng: 35.0062 },
      
      // Nandi County
      { name: 'Aldai', county: 'Nandi', mp: 'Marilyn Kamau', party: 'UDA', voters: 68000, area: 160, lat: 0.1853, lng: 35.1811 },
      
      // Baringo County
      { name: 'Baringo Central', county: 'Baringo', mp: 'Joshua Kandie', party: 'UDA', voters: 55000, area: 200, lat: 0.4684, lng: 35.9737 },
      
      // Laikipia County
      { name: 'Laikipia North', county: 'Laikipia', mp: 'Sarah Korere', party: 'UDA', voters: 42000, area: 350, lat: 0.5143, lng: 36.7820 },
      
      // Isiolo County
      { name: 'Isiolo North', county: 'Isiolo', mp: 'Hassan Odha', party: 'UDA', voters: 35000, area: 800, lat: 0.3556, lng: 37.5833 },
      
      // Meru County
      { name: 'Igembe South', county: 'Meru', mp: 'John Paul Mwirigi', party: 'Independent', voters: 71000, area: 190, lat: 0.0236, lng: 37.9062 },
      
      // Tharaka Nithi County
      { name: 'Tharaka', county: 'Tharaka Nithi', mp: 'George Gitonga', party: 'UDA', voters: 48000, area: 120, lat: -0.3347, lng: 37.8895 },
      
      // Embu County
      { name: 'Manyatta', county: 'Embu', mp: 'John Muchiri', party: 'UDA', voters: 63000, area: 100, lat: -0.5312, lng: 37.4579 },
      
      // Kitui County
      { name: 'Kitui Central', county: 'Kitui', mp: 'Makali Mulu', party: 'Wiper', voters: 58000, area: 180, lat: -1.3667, lng: 38.0167 },
      
      // Machakos County (additional)
      { name: 'Yatta', county: 'Machakos', mp: 'Robert Mbui', party: 'Wiper', voters: 61000, area: 220, lat: -1.3500, lng: 37.4167 },
      
      // Makueni County
      { name: 'Makueni', county: 'Makueni', mp: 'Daniel Maanzo', party: 'Wiper', voters: 54000, area: 150, lat: -1.8038, lng: 37.6244 },
      
      // Nyandarua County
      { name: 'Kinangop', county: 'Nyandarua', mp: 'Zachary Thuku', party: 'UDA', voters: 49000, area: 130, lat: -0.6333, lng: 36.5667 },
      
      // Nyeri County
      { name: 'Nyeri Town', county: 'Nyeri', mp: 'Duncan Mathenge', party: 'UDA', voters: 73000, area: 90, lat: -0.4167, lng: 36.9500 },
      
      // Kirinyaga County
      { name: 'Kirinyaga Central', county: 'Kirinyaga', mp: 'Joseph Gitari', party: 'UDA', voters: 56000, area: 110, lat: -0.6667, lng: 37.3000 },
      
      // Murang'a County
      { name: 'Murang\'a South', county: 'Murang\'a', mp: 'Sylvia Maina', party: 'UDA', voters: 64000, area: 125, lat: -0.9500, lng: 37.1500 },
      
      // Kiambu County (additional)
      { name: 'Thika Town', county: 'Kiambu', mp: 'Patrick Wainaina', party: 'UDA', voters: 92000, area: 75, lat: -1.0333, lng: 37.0833 },
      
      // Garissa County
      { name: 'Garissa Township', county: 'Garissa', mp: 'Aden Duale', party: 'UDA', voters: 41000, area: 300, lat: -0.4536, lng: 39.6401 },
      
      // Wajir County
      { name: 'Wajir North', county: 'Wajir', mp: 'Ibrahim Saney', party: 'UDA', voters: 33000, area: 400, lat: 1.7471, lng: 40.0629 },
      
      // Mandera County
      { name: 'Mandera East', county: 'Mandera', mp: 'Omar Maalim', party: 'UDA', voters: 29000, area: 350, lat: 3.9366, lng: 41.8669 },
      
      // Marsabit County
      { name: 'Marsabit North', county: 'Marsabit', mp: 'Chachu Ganya', party: 'UDA', voters: 31000, area: 600, lat: 2.3284, lng: 37.9899 },
      
      // Kajiado County
      { name: 'Kajiado Central', county: 'Kajiado', mp: 'Elijah Memusi', party: 'ODM', voters: 69000, area: 200, lat: -1.8500, lng: 36.7833 },
      
      // Kericho County
      { name: 'Ainamoi', county: 'Kericho', mp: 'Sylvanus Maritim', party: 'UDA', voters: 66000, area: 140, lat: -0.3667, lng: 35.2833 },
      
      // Bomet County
      { name: 'Bomet Central', county: 'Bomet', mp: 'Hillary Kosgei', party: 'UDA', voters: 59000, area: 120, lat: -0.7833, lng: 35.3333 },
      
      // Narok County
      { name: 'Narok North', county: 'Narok', mp: 'Moitalel Ole Kenta', party: 'UDA', voters: 62000, area: 250, lat: -1.0833, lng: 35.8667 },
      
      // Kajiado County (additional)
      { name: 'Kajiado North', county: 'Kajiado', mp: 'Onesmus Ngogoyo', party: 'UDA', voters: 75000, area: 180, lat: -1.6000, lng: 36.6500 },
      
      // Taita Taveta County
      { name: 'Taveta', county: 'Taita Taveta', mp: 'Naomi Shaban', party: 'UDA', voters: 44000, area: 170, lat: -3.4000, lng: 37.6833 },
      
      // Kwale County
      { name: 'Msambweni', county: 'Kwale', mp: 'Feisal Bader', party: 'ODM', voters: 51000, area: 160, lat: -4.4667, lng: 39.4833 },
      
      // Kilifi County
      { name: 'Kilifi North', county: 'Kilifi', mp: 'Owen Baya', party: 'ODM', voters: 57000, area: 190, lat: -3.5053, lng: 39.8992 },
      
      // Tana River County
      { name: 'Garsen', county: 'Tana River', mp: 'Ali Wario', party: 'UDA', voters: 36000, area: 280, lat: -2.2833, lng: 40.1167 },
      
      // Lamu County
      { name: 'Lamu East', county: 'Lamu', mp: 'Sharif Athman', party: 'ODM', voters: 25000, area: 120, lat: -2.2717, lng: 40.9020 },
      
      // Siaya County
      { name: 'Ugenya', county: 'Siaya', mp: 'David Ochieng', party: 'MDG', voters: 53000, area: 110, lat: 0.0833, lng: 34.2667 },
      
      // Kisumu County (additional)
      { name: 'Kisumu Central', county: 'Kisumu', mp: 'Joshua Oron', party: 'ODM', voters: 81000, area: 65, lat: -0.0917, lng: 34.7680 },
      
      // Homa Bay County
      { name: 'Homa Bay Town', county: 'Homa Bay', mp: 'Peter Kaluma', party: 'ODM', voters: 47000, area: 90, lat: -0.5273, lng: 34.4569 },
      
      // Migori County
      { name: 'Suna East', county: 'Migori', mp: 'Junet Mohamed', party: 'ODM', voters: 52000, area: 130, lat: -1.0634, lng: 34.4731 },
      
      // Nyamira County
      { name: 'Nyamira North', county: 'Nyamira', mp: 'Jerusha Momanyi', party: 'UDA', voters: 46000, area: 80, lat: -0.5633, lng: 34.9358 },
      
      // Kisii County
      { name: 'Kitutu Chache South', county: 'Kisii', mp: 'Anthony Kibagendi', party: 'UDA', voters: 68000, area: 70, lat: -0.6833, lng: 34.7667 },
      
      // Busia County
      { name: 'Teso North', county: 'Busia', mp: 'Oku Kaunya', party: 'ODM', voters: 49000, area: 100, lat: 0.4600, lng: 34.1117 },
      
      // Vihiga County
      { name: 'Sabatia', county: 'Vihiga', mp: 'Clement Sloya', party: 'ANC', voters: 55000, area: 60, lat: 0.0833, lng: 34.7500 },
      
      // Elgeyo Marakwet County
      { name: 'Keiyo North', county: 'Elgeyo Marakwet', mp: 'Adams Kipsanai', party: 'UDA', voters: 43000, area: 150, lat: 0.7833, lng: 35.5833 }
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

        if (!container) return;
        
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

  const allCounties = [
    'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo Marakwet', 'Embu', 'Garissa', 'Homa Bay',
    'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii',
    'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera',
    'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi', 'Nakuru', 'Nandi',
    'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu', 'Siaya', 'Taita Taveta',
    'Tana River', 'Tharaka Nithi', 'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga',
    'Wajir', 'West Pokot'
  ];
  const counties = allCounties;
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
                {filteredConstituencies.length} constituencies shown from {allCounties.length} counties
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