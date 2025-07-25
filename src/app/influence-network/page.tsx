"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Network, Users, Search, Filter, TrendingUp } from 'lucide-react';

interface NetworkNode {
  id: string;
  name: string;
  type: 'politician' | 'party' | 'organization' | 'media';
  influence: number;
  party?: string;
  position?: string;
}

interface NetworkEdge {
  source: string;
  target: string;
  type: 'endorsement' | 'alliance' | 'opposition' | 'funding';
  strength: number;
}

interface NetworkData {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
}

export default function InfluenceNetwork() {
  const svgRef = useRef<SVGSVGElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [networkData, setNetworkData] = useState<NetworkData | null>(null);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'network' | 'map'>('network');

  useEffect(() => {
    fetchNetworkData();
  }, []);

  useEffect(() => {
    if (viewMode === 'map' && networkData) {
      initMap();
    }
  }, [viewMode, networkData]);

  const initMap = async () => {
    if (typeof window === 'undefined' || !mapRef.current) return;

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
        maxZoom: 10,
        minZoom: 5
      });

      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Add network nodes to map with geographic positions
      const geoNodes = [
        { id: 'ruto', lat: -0.5143, lng: 35.2698 }, // Eldoret
        { id: 'raila', lat: -0.0917, lng: 34.7680 }, // Kisumu
        { id: 'karua', lat: -0.4167, lng: 36.9500 }, // Nyeri
        { id: 'gachagua', lat: -0.4167, lng: 36.9500 }, // Nyeri
        { id: 'mudavadi', lat: 0.2827, lng: 34.7519 }, // Kakamega
        { id: 'uda', lat: -1.2921, lng: 36.8219 }, // Nairobi
        { id: 'odm', lat: -1.2921, lng: 36.8219 }, // Nairobi
        { id: 'nation', lat: -1.2921, lng: 36.8219 }, // Nairobi
        { id: 'citizen', lat: -1.2921, lng: 36.8219 } // Nairobi
      ];

      geoNodes.forEach(geoNode => {
        const node = networkData?.nodes.find(n => n.id === geoNode.id);
        if (!node) return;

        const marker = L.circleMarker([geoNode.lat, geoNode.lng], {
          color: getNodeColor(node.type),
          weight: 2,
          fillColor: getNodeColor(node.type),
          fillOpacity: 0.7,
          radius: 8 + node.influence * 15
        }).addTo(map);

        marker.bindPopup(`
          <div style="padding: 8px; min-width: 150px;">
            <h3 style="margin: 0 0 4px 0; font-weight: bold;">${node.name}</h3>
            <p style="margin: 0 0 2px 0;"><strong>Type:</strong> ${node.type}</p>
            <p style="margin: 0 0 2px 0;"><strong>Influence:</strong> ${(node.influence * 100).toFixed(0)}%</p>
            ${node.party ? `<p style="margin: 0;"><strong>Party:</strong> ${node.party}</p>` : ''}
          </div>
        `);

        marker.on('click', () => setSelectedNode(node));
      });

    } catch (error) {
      console.error('Map initialization error:', error);
    }
  };

  const fetchNetworkData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/influence-network');
      const data = await response.json();
      setNetworkData(data);
      renderNetwork(data);
    } catch (error) {
      console.error('Failed to fetch network data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderNetwork = (data: NetworkData) => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const width = 800;
    const height = 600;

    // Clear previous content
    svg.innerHTML = '';

    // Create simple force-directed layout
    const nodes = data.nodes.map(node => ({
      ...node,
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0,
      vy: 0
    }));

    // Render edges
    data.edges.forEach(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      
      if (sourceNode && targetNode) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', sourceNode.x.toString());
        line.setAttribute('y1', sourceNode.y.toString());
        line.setAttribute('x2', targetNode.x.toString());
        line.setAttribute('y2', targetNode.y.toString());
        line.setAttribute('stroke', getEdgeColor(edge.type));
        line.setAttribute('stroke-width', (edge.strength * 3).toString());
        line.setAttribute('opacity', '0.6');
        svg.appendChild(line);
      }
    });

    // Render nodes
    nodes.forEach(node => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', node.x.toString());
      circle.setAttribute('cy', node.y.toString());
      circle.setAttribute('r', (5 + node.influence * 10).toString());
      circle.setAttribute('fill', getNodeColor(node.type));
      circle.setAttribute('stroke', '#fff');
      circle.setAttribute('stroke-width', '2');
      circle.style.cursor = 'pointer';
      
      circle.addEventListener('click', () => setSelectedNode(node));
      svg.appendChild(circle);

      // Add labels
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', (node.x + 15).toString());
      text.setAttribute('y', (node.y + 5).toString());
      text.setAttribute('font-size', '12');
      text.setAttribute('fill', '#333');
      text.textContent = node.name;
      svg.appendChild(text);
    });
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'politician': return '#3b82f6';
      case 'party': return '#ef4444';
      case 'organization': return '#22c55e';
      case 'media': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getEdgeColor = (type: string) => {
    switch (type) {
      case 'endorsement': return '#22c55e';
      case 'alliance': return '#3b82f6';
      case 'opposition': return '#ef4444';
      case 'funding': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const filteredNodes = networkData?.nodes.filter(node => {
    const matchesSearch = !searchTerm || node.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || node.type === filterType;
    return matchesSearch && matchesType;
  }) || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Influence Network Analysis</h1>
        <p className="text-muted-foreground">Map political connections and endorsements</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search entities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Filter by Type</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="politician">Politicians</SelectItem>
                    <SelectItem value="party">Political Parties</SelectItem>
                    <SelectItem value="organization">Organizations</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-2">Legend</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm">Politicians</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm">Parties</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Organizations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm">Media</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-2">Connections</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-green-500"></div>
                    <span className="text-sm">Endorsement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-blue-500"></div>
                    <span className="text-sm">Alliance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-red-500"></div>
                    <span className="text-sm">Opposition</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-yellow-500"></div>
                    <span className="text-sm">Funding</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {selectedNode && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  {selectedNode.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Type:</span>
                  <Badge variant="outline">{selectedNode.type}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Influence:</span>
                  <span className="text-sm font-medium">{(selectedNode.influence * 100).toFixed(0)}%</span>
                </div>
                {selectedNode.party && (
                  <div className="flex justify-between">
                    <span className="text-sm">Party:</span>
                    <span className="text-sm font-medium">{selectedNode.party}</span>
                  </div>
                )}
                {selectedNode.position && (
                  <div className="flex justify-between">
                    <span className="text-sm">Position:</span>
                    <span className="text-sm font-medium">{selectedNode.position}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Network Visualization</CardTitle>
              <CardDescription>
                Interactive map of political influence and connections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex gap-2">
                <Button
                  variant={viewMode === 'network' ? 'default' : 'outline'}
                  onClick={() => setViewMode('network')}
                  size="sm"
                >
                  Network View
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'outline'}
                  onClick={() => setViewMode('map')}
                  size="sm"
                >
                  Map View
                </Button>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <Network className="h-12 w-12 animate-pulse mx-auto mb-4 text-muted-foreground" />
                    <p>Loading network data...</p>
                  </div>
                </div>
              ) : viewMode === 'network' ? (
                <svg
                  ref={svgRef}
                  width="100%"
                  height="600"
                  viewBox="0 0 800 600"
                  className="border rounded-lg"
                />
              ) : (
                <div ref={mapRef} className="w-full h-[600px] rounded-lg border" />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Network Entities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNodes.map((node) => (
              <div
                key={node.id}
                className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => setSelectedNode(node)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{node.name}</h4>
                  <Badge variant="outline">{node.type}</Badge>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Influence: {(node.influence * 100).toFixed(0)}%</span>
                  {node.party && <span>{node.party}</span>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}