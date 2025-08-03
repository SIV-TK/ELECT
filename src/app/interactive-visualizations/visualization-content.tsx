"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  BarChart3, 
  MapPin, 
  Scale, 
  Clock,
  ArrowLeft,
  Zap,
  Eye,
  RefreshCw,
  Download,
  Filter,
  Settings,
  TrendingUp,
  Globe,
  Users,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Map,
  Target,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth-guard';
import { useToast } from '@/hooks/use-toast';

export default function VisualizationPage() {
  const { toast } = useToast();
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [heatMapData, setHeatMapData] = useState<any>(null);
  const [policyData, setPolicyData] = useState<any>(null);
  const [timelineData, setTimelineData] = useState<any>(null);

  // Feature configurations
  const features = [
    {
      id: 'ai-dashboards',
      title: 'AI-Generated Political Dashboards',
      description: 'Dynamic dashboards that automatically adjust based on current political events',
      icon: BarChart3,
      color: 'emerald',
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50/50 to-teal-50/50',
      borderColor: 'border-emerald-200',
      features: [
        'Real-time data integration',
        'AI-powered layout optimization',
        'Multiple dashboard templates',
        'Interactive widgets',
        'Automated insights generation'
      ]
    },
    {
      id: 'heatmaps',
      title: 'Predictive Heat Maps',
      description: 'County-level predictions for election outcomes and policy support',
      icon: MapPin,
      color: 'orange',
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50/50 to-red-50/50',
      borderColor: 'border-orange-200',
      features: [
        'Election outcome predictions',
        'Policy support mapping',
        'Crisis risk assessment',
        'Voter turnout forecasting',
        'Confidence intervals'
      ]
    },
    {
      id: 'policy-comparison',
      title: 'Interactive Policy Comparison',
      description: 'Multi-party manifesto analysis and policy alignment visualization',
      icon: Scale,
      color: 'blue',
      gradient: 'from-blue-500 to-indigo-500',
      bgGradient: 'from-blue-50/50 to-indigo-50/50',
      borderColor: 'border-blue-200',
      features: [
        'Multi-party analysis',
        'Policy similarity matrices',
        'Alignment scoring',
        'Coalition analysis',
        'Implementation tracking'
      ]
    },
    {
      id: 'timeline',
      title: 'Political Timeline Generator',
      description: 'Interactive event mapping with connections and significance analysis',
      icon: Clock,
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50/50 to-pink-50/50',
      borderColor: 'border-purple-200',
      features: [
        'Event connection analysis',
        'Interactive navigation',
        'Significance assessment',
        'Trend identification',
        'Figure prominence tracking'
      ]
    }
  ];

  const handleFeatureGenerate = async (featureId: string) => {
    setIsLoading(true);
    setActiveFeature(featureId);

    try {
      let response;
      
      switch (featureId) {
        case 'ai-dashboards':
          response = await fetch('/api/ai-dashboards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'election-monitoring',
              timeframe: '7days',
              includeWidgets: true,
              autoOptimize: true
            })
          });
          const dashboardResult = await response.json();
          if (dashboardResult.success) {
            setDashboardData(dashboardResult.dashboard);
            toast({
              title: "Dashboard Generated!",
              description: "AI dashboard has been successfully created.",
            });
          }
          break;

        case 'heatmaps':
          response = await fetch('/api/predictive-heatmaps', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'election-outcomes',
              timeframe: '1month',
              granularity: 'county',
              includeFactors: true
            })
          });
          const heatMapResult = await response.json();
          if (heatMapResult.success) {
            setHeatMapData(heatMapResult.heatMap);
            toast({
              title: "Heat Map Generated!",
              description: "Predictive heat map has been successfully created.",
            });
          }
          break;

        case 'policy-comparison':
          response = await fetch('/api/policy-comparison', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              parties: ['UDA', 'ODM', 'Wiper'],
              categories: ['economic', 'social', 'governance'],
              includeManifestos: true,
              comparisonType: 'detailed'
            })
          });
          const policyResult = await response.json();
          if (policyResult.success) {
            setPolicyData(policyResult.comparison);
            toast({
              title: "Policy Comparison Generated!",
              description: "Policy comparison analysis has been completed.",
            });
          }
          break;

        case 'timeline':
          const endDate = new Date();
          const startDate = new Date();
          startDate.setMonth(endDate.getMonth() - 2);
          
          response = await fetch('/api/political-timeline', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              timeframe: {
                start: startDate.toISOString(),
                end: endDate.toISOString()
              },
              categories: ['elections', 'legislation', 'governance'],
              includeConnections: true,
              includeAnalysis: true
            })
          });
          const timelineResult = await response.json();
          if (timelineResult.success) {
            setTimelineData(timelineResult.timeline);
            toast({
              title: "Timeline Generated!",
              description: "Political timeline has been successfully created.",
            });
          }
          break;
      }
    } catch (error) {
      console.error('Feature generation error:', error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating the visualization. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-100 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-100 rounded-full opacity-10 blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-8"
          >
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Interactive Visualization & Insights
              </h1>
              <p className="text-gray-600 mt-1">
                Advanced AI-powered visualizations for comprehensive political analysis
              </p>
            </div>
            <Badge className="ml-auto bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
              Latest Features
            </Badge>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <Card className={`${feature.borderColor} border-2 bg-gradient-to-br ${feature.bgGradient} hover:shadow-xl transition-all duration-300 cursor-pointer group`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.gradient} group-hover:scale-110 transition-transform duration-200`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-lg font-bold text-${feature.color}-900`}>
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {feature.description}
                        </p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900 text-sm">Key Features:</h4>
                      <ul className="space-y-1">
                        {feature.features.map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle className={`w-3 h-3 text-${feature.color}-500`} />
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button 
                      onClick={() => handleFeatureGenerate(feature.id)}
                      disabled={isLoading}
                      className={`w-full bg-gradient-to-r ${feature.gradient} hover:shadow-lg transition-all duration-200 text-white font-medium`}
                    >
                      {isLoading && activeFeature === feature.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Generate {feature.title.split(' ')[0]}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Results Display */}
          <AnimatePresence>
            {(dashboardData || heatMapData || policyData || timelineData) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <Card className="border-2 border-dashed border-gray-300 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="w-5 h-5 text-blue-600" />
                        Visualization Results
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Refresh
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* AI Dashboard Results */}
                    {dashboardData && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <BarChart3 className="w-5 h-5 text-emerald-600" />
                          <h3 className="text-lg font-semibold text-emerald-900">AI-Generated Dashboard</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                            <div className="text-2xl font-bold text-emerald-900">{dashboardData.widgets?.length || 0}</div>
                            <div className="text-sm text-emerald-700">Widgets Generated</div>
                          </div>
                          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                            <div className="text-2xl font-bold text-emerald-900">{dashboardData.insights?.length || 0}</div>
                            <div className="text-sm text-emerald-700">AI Insights</div>
                          </div>
                          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                            <div className="text-2xl font-bold text-emerald-900 capitalize">{dashboardData.type?.replace('-', ' ')}</div>
                            <div className="text-sm text-emerald-700">Dashboard Type</div>
                          </div>
                          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                            <div className="text-2xl font-bold text-emerald-900">
                              {new Date(dashboardData.metadata?.generated).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-emerald-700">Generated</div>
                          </div>
                        </div>

                        {dashboardData.summary && (
                          <div className="p-4 bg-white rounded-lg border border-gray-200">
                            <h4 className="font-semibold text-gray-900 mb-2">AI-Generated Summary</h4>
                            <p className="text-gray-600">{dashboardData.summary}</p>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Heat Map Results */}
                    {heatMapData && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-orange-600" />
                            <h3 className="text-lg font-semibold text-orange-900">Predictive Heat Map</h3>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="flex items-center gap-2">
                                <Map className="w-4 h-4" />
                                View Interactive Map
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <MapPin className="w-5 h-5 text-orange-600" />
                                  Kenya Counties - {heatMapData.type?.replace('-', ' ').toUpperCase()} Predictions
                                </DialogTitle>
                              </DialogHeader>
                              
                              {/* Heat Map Visualization */}
                              <div className="space-y-6">
                                {/* Map Legend */}
                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border">
                                  <div className="flex items-center gap-4">
                                    <div className="text-sm font-medium text-gray-700">Prediction Scale:</div>
                                    <div className="flex items-center gap-2">
                                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                                      <span className="text-xs">Low (0-40)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="w-4 h-4 bg-orange-500 rounded"></div>
                                      <span className="text-xs">Medium (40-60)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                                      <span className="text-xs">High (60-80)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                                      <span className="text-xs">Very High (80+)</span>
                                    </div>
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    Confidence: {Math.round((heatMapData.confidence?.overall || 0.75) * 100)}%
                                  </div>
                                </div>

                                {/* County Grid Display */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                                  {heatMapData.regions?.map((region: any, index: number) => {
                                    const intensity = region.intensity || region.value || Math.random() * 100;
                                    const confidence = region.confidence || Math.random() * 0.4 + 0.6;
                                    
                                    // Determine color based on intensity
                                    let bgColor = 'bg-green-100 border-green-300';
                                    let textColor = 'text-green-800';
                                    let iconColor = 'text-green-600';
                                    
                                    if (intensity < 40) {
                                      bgColor = 'bg-red-100 border-red-300';
                                      textColor = 'text-red-800';
                                      iconColor = 'text-red-600';
                                    } else if (intensity < 60) {
                                      bgColor = 'bg-orange-100 border-orange-300';
                                      textColor = 'text-orange-800';
                                      iconColor = 'text-orange-600';
                                    } else if (intensity < 80) {
                                      bgColor = 'bg-blue-100 border-blue-300';
                                      textColor = 'text-blue-800';
                                      iconColor = 'text-blue-600';
                                    }

                                    return (
                                      <div key={index} className={`p-4 rounded-lg border-2 ${bgColor} hover:shadow-md transition-shadow`}>
                                        <div className="flex items-center justify-between mb-2">
                                          <h4 className={`font-semibold ${textColor}`}>{region.name}</h4>
                                          <Target className={`w-4 h-4 ${iconColor}`} />
                                        </div>
                                        
                                        <div className="space-y-2">
                                          <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Prediction:</span>
                                            <span className={`font-bold ${textColor}`}>{Math.round(intensity)}%</span>
                                          </div>
                                          
                                          <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Confidence:</span>
                                            <span className="text-sm font-medium">{Math.round(confidence * 100)}%</span>
                                          </div>
                                          
                                          {region.trend && (
                                            <div className="flex justify-between items-center">
                                              <span className="text-sm text-gray-600">Trend:</span>
                                              <Badge variant="outline" className="text-xs">
                                                {region.trend}
                                              </Badge>
                                            </div>
                                          )}
                                          
                                          {region.population && (
                                            <div className="flex justify-between items-center">
                                              <span className="text-sm text-gray-600">Population:</span>
                                              <span className="text-xs">{region.population?.toLocaleString()}</span>
                                            </div>
                                          )}
                                          
                                          {region.factors && Array.isArray(region.factors) && (
                                            <div className="mt-3">
                                              <span className="text-xs text-gray-500 block mb-1">Key Factors:</span>
                                              <div className="flex flex-wrap gap-1">
                                                {region.factors.slice(0, 2).map((factor: string, i: number) => (
                                                  <Badge key={i} variant="secondary" className="text-xs">
                                                    {factor}
                                                  </Badge>
                                                ))}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Summary Statistics */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                      {heatMapData.regions?.filter((r: any) => (r.intensity || r.value || 0) >= 80).length || 0}
                                    </div>
                                    <div className="text-sm text-gray-600">Very High</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                      {heatMapData.regions?.filter((r: any) => {
                                        const val = r.intensity || r.value || 0;
                                        return val >= 60 && val < 80;
                                      }).length || 0}
                                    </div>
                                    <div className="text-sm text-gray-600">High</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-orange-600">
                                      {heatMapData.regions?.filter((r: any) => {
                                        const val = r.intensity || r.value || 0;
                                        return val >= 40 && val < 60;
                                      }).length || 0}
                                    </div>
                                    <div className="text-sm text-gray-600">Medium</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-red-600">
                                      {heatMapData.regions?.filter((r: any) => (r.intensity || r.value || 0) < 40).length || 0}
                                    </div>
                                    <div className="text-sm text-gray-600">Low</div>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                            <div className="text-2xl font-bold text-orange-900">{heatMapData.regions?.length || 47}</div>
                            <div className="text-sm text-orange-700">Counties Analyzed</div>
                          </div>
                          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                            <div className="text-2xl font-bold text-orange-900">
                              {Math.round((heatMapData.confidence?.overall || 0.75) * 100)}%
                            </div>
                            <div className="text-sm text-orange-700">Confidence Level</div>
                          </div>
                          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                            <div className="text-2xl font-bold text-orange-900 capitalize">
                              {heatMapData.type?.replace('-', ' ') || 'Election Outcomes'}
                            </div>
                            <div className="text-sm text-orange-700">Prediction Type</div>
                          </div>
                          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                            <div className="text-2xl font-bold text-orange-900">
                              {heatMapData.metadata?.timeframe || '1 month'}
                            </div>
                            <div className="text-sm text-orange-700">Time Horizon</div>
                          </div>
                        </div>

                        {heatMapData.insights && (
                          <div className="p-4 bg-white rounded-lg border border-gray-200">
                            <h4 className="font-semibold text-gray-900 mb-3">Key Insights</h4>
                            <ul className="space-y-2">
                              {heatMapData.insights.map((insight: string, index: number) => (
                                <li key={index} className="flex items-start gap-2">
                                  <TrendingUp className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-600">{insight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Quick Actions */}
                        <div className="flex gap-2 justify-center">
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            View Trends
                          </Button>
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Export Data
                          </Button>
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Update Predictions
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {/* Policy Comparison Results */}
                    {policyData && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <Scale className="w-5 h-5 text-blue-600" />
                          <h3 className="text-lg font-semibold text-blue-900">Policy Comparison Analysis</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="text-2xl font-bold text-blue-900">{policyData.parties?.length || 0}</div>
                            <div className="text-sm text-blue-700">Parties Compared</div>
                          </div>
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="text-2xl font-bold text-blue-900">
                              {Object.keys(policyData.policies || {}).length}
                            </div>
                            <div className="text-sm text-blue-700">Policy Categories</div>
                          </div>
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="text-2xl font-bold text-blue-900">
                              {policyData.alignment?.collaborationOpportunities?.length || 0}
                            </div>
                            <div className="text-sm text-blue-700">Collaboration Areas</div>
                          </div>
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="text-2xl font-bold text-blue-900">
                              {policyData.alignment?.competitiveAreas?.length || 0}
                            </div>
                            <div className="text-sm text-blue-700">Competitive Areas</div>
                          </div>
                        </div>

                        {policyData.insights && (
                          <div className="p-4 bg-white rounded-lg border border-gray-200">
                            <h4 className="font-semibold text-gray-900 mb-3">Analysis Insights</h4>
                            <ul className="space-y-2">
                              {policyData.insights.map((insight: string, index: number) => (
                                <li key={index} className="flex items-start gap-2">
                                  <Users className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-600">{insight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Timeline Results */}
                    {timelineData && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <Clock className="w-5 h-5 text-purple-600" />
                          <h3 className="text-lg font-semibold text-purple-900">Political Timeline Analysis</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="text-2xl font-bold text-purple-900">{timelineData.events?.length || 0}</div>
                            <div className="text-sm text-purple-700">Events Mapped</div>
                          </div>
                          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="text-2xl font-bold text-purple-900">{timelineData.connections?.length || 0}</div>
                            <div className="text-sm text-purple-700">Connections Found</div>
                          </div>
                          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="text-2xl font-bold text-purple-900">
                              {timelineData.summary?.highImpactEvents || 0}
                            </div>
                            <div className="text-sm text-purple-700">High Impact Events</div>
                          </div>
                          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="text-2xl font-bold text-purple-900 capitalize">
                              {timelineData.summary?.dominantCategory || 'Various'}
                            </div>
                            <div className="text-sm text-purple-700">Dominant Category</div>
                          </div>
                        </div>

                        {timelineData.analysis?.insights && (
                          <div className="p-4 bg-white rounded-lg border border-gray-200">
                            <h4 className="font-semibold text-gray-900 mb-3">Timeline Insights</h4>
                            <ul className="space-y-2">
                              {timelineData.analysis.insights.map((insight: string, index: number) => (
                                <li key={index} className="flex items-start gap-2">
                                  <Globe className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-600">{insight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card className="border-2 border-dashed border-gray-300 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
              <CardContent className="p-6 text-center">
                <Settings className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="font-semibold text-gray-900 mb-2">Customize Settings</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Configure your visualization preferences and defaults
                </p>
                <Link href="/settings">
                  <Button variant="outline" className="w-full">
                    Open Settings
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-dashed border-gray-300 bg-gradient-to-r from-emerald-50/50 to-teal-50/50">
              <CardContent className="p-6 text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-emerald-600" />
                <h3 className="font-semibold text-gray-900 mb-2">Try Demo Features</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Explore all AI features with interactive demonstrations
                </p>
                <Link href="/ai-features-demo">
                  <Button variant="outline" className="w-full">
                    Launch Demo
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-dashed border-gray-300 bg-gradient-to-r from-purple-50/50 to-pink-50/50">
              <CardContent className="p-6 text-center">
                <Globe className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                <h3 className="font-semibold text-gray-900 mb-2">Return to Dashboard</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Go back to the main dashboard to explore all features
                </p>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full">
                    Back to Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AuthGuard>
  );
}
