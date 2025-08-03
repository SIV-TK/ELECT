"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackCrisisAlert } from '@/lib/analytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Zap,
  TrendingUp,
  TrendingDown,
  Activity,
  Eye,
  MapPin,
  Brain,
  Gauge,
  Shield,
  Users,
  BarChart3,
  ChevronRight,
  RefreshCw,
  Lightbulb,
  Target,
  AlertCircle
} from 'lucide-react';

interface CrisisAlert {
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  score: number;
  location: string;
  indicators: string[];
  sources: string[];
  recommendations: string[];
  timestamp: string;
}

interface AIAssessment {
  riskLevel: string;
  keyThreats: string[];
  timeframe: string;
  confidence: number;
  summary: string;
  earlyWarningSignsToWatch: string[];
}

interface CrisisData {
  alerts: CrisisAlert[];
  nationalRiskLevel: string;
  aiAssessment: AIAssessment;
  preventiveMeasures: string[];
  dataFreshness: string;
  sourceCount: number;
  monitoringActive: boolean;
}

interface RealtimeInsights {
  alertLevel: string;
  dataPoints: number;
  immediateThreats: number;
  sentimentAnalysis: {
    positive: number;
    negative: number;
    neutral: number;
    overallMood: string;
  };
  trendingTopics: { word: string; count: number }[];
  hotspots: { county: string; mentions: number; riskMultiplier: number }[];
  timestamp: string;
}

export function CrisisEarlyWarningCard() {
  const [crisisData, setCrisisData] = useState<CrisisData | null>(null);
  const [realtimeInsights, setRealtimeInsights] = useState<RealtimeInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchCrisisData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/crisis-early-warning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          county: null,
          timeframe: '24h',
          includePreventiveMeasures: true
        })
      });
      
      const data = await response.json();
      if (data.success) {
        // Track crisis alerts for analytics
        if (data.data?.alerts?.length > 0) {
          data.data.alerts.forEach((alert: any) => {
            trackCrisisAlert(alert.type || 'unknown', alert.severity || 'medium');
          });
        }
        
        setCrisisData(data.data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Crisis data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 5 minutes
  useEffect(() => {
    fetchCrisisData();
    const interval = setInterval(fetchCrisisData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getRiskLevelColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'CRITICAL': return 'text-red-600 bg-red-50 border-red-200';
      case 'HIGH': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'LOW': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level.toUpperCase()) {
      case 'CRITICAL': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'HIGH': return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'MEDIUM': return <Eye className="w-5 h-5 text-yellow-600" />;
      case 'LOW': return <CheckCircle className="w-5 h-5 text-green-600" />;
      default: return <Shield className="w-5 h-5 text-blue-600" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const hours = Math.floor(diffInMinutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50/50 to-orange-50/50 overflow-hidden">
      <CardHeader className="relative">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-200/30 to-orange-200/30 rounded-full -translate-y-10 translate-x-10"></div>
        <CardTitle className="flex items-center gap-3 text-red-900 relative">
          <div className="p-2 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-lg font-bold">Political Crisis Early Warning</div>
            <div className="text-sm text-red-600 font-normal">AI-Powered Real-time Monitoring</div>
          </div>
          <Badge 
            variant="secondary" 
            className="ml-auto bg-red-100 text-red-700 animate-pulse"
          >
            LIVE
          </Badge>
        </CardTitle>
        {lastUpdated && (
          <div className="text-xs text-red-600 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Updated {formatTimeAgo(lastUpdated.toISOString())}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {loading ? (
          <div className="text-center p-8 bg-white/60 backdrop-blur-sm rounded-xl border border-red-200">
            <div className="w-12 h-12 border-3 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-lg font-semibold text-red-900 mb-2">Analyzing Crisis Indicators</div>
            <div className="text-sm text-red-600">Processing real-time data from multiple sources</div>
          </div>
        ) : crisisData ? (
          <>
            {/* National Risk Overview */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-red-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">National Risk Level</h3>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getRiskLevelColor(crisisData.nationalRiskLevel)}`}>
                  {getRiskIcon(crisisData.nationalRiskLevel)}
                  <span className="font-semibold text-sm">{crisisData.nationalRiskLevel}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-red-50 rounded-lg border border-red-100">
                  <div className="text-2xl font-bold text-red-600">
                    {crisisData.alerts.length}
                  </div>
                  <div className="text-xs text-gray-600">Active Alerts</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="text-2xl font-bold text-blue-600">
                    {crisisData.sourceCount}
                  </div>
                  <div className="text-xs text-gray-600">Data Sources</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="text-2xl font-bold text-green-600">
                    {47 - crisisData.alerts.length}
                  </div>
                  <div className="text-xs text-gray-600">Stable Counties</div>
                </div>
              </div>

              {/* AI Assessment */}
              {crisisData.aiAssessment && (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-4 h-4 text-purple-600" />
                    <span className="font-semibold text-purple-900">AI Assessment</span>
                    <Badge variant="outline" className="text-xs border-purple-300 text-purple-700">
                      {Math.round(crisisData.aiAssessment.confidence * 100)}% Confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-purple-800 mb-3">
                    {crisisData.aiAssessment.summary}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-purple-700">
                    <Clock className="w-3 h-3" />
                    <span>Expected timeframe: {crisisData.aiAssessment.timeframe}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Active Alerts */}
            {crisisData.alerts.length > 0 ? (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  Active Crisis Alerts
                </h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {crisisData.alerts.slice(0, 4).map((alert, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border-l-4 bg-white shadow-sm ${
                        alert.level === 'HIGH' || alert.level === 'CRITICAL' ? 'border-red-500' :
                        alert.level === 'MEDIUM' ? 'border-yellow-500' :
                        'border-blue-500'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-900">{alert.location}</span>
                            <Badge 
                              variant="outline"
                              className={`text-xs ${
                                alert.level === 'HIGH' || alert.level === 'CRITICAL' ? 'border-red-200 text-red-700' :
                                alert.level === 'MEDIUM' ? 'border-yellow-200 text-yellow-700' :
                                'border-blue-200 text-blue-700'
                              }`}
                            >
                              {alert.level}
                            </Badge>
                          </div>
                          
                          {alert.indicators?.length > 0 && (
                            <div className="mb-2">
                              <div className="text-xs text-gray-500 mb-1">Crisis Indicators:</div>
                              <div className="flex flex-wrap gap-1">
                                {alert.indicators.slice(0, 3).map((indicator, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs bg-gray-100">
                                    {indicator.replace('_', ' ')}
                                  </Badge>
                                ))}
                                {alert.indicators.length > 3 && (
                                  <Badge variant="secondary" className="text-xs bg-gray-100">
                                    +{alert.indicators.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Gauge className="w-3 h-3" />
                              Risk: {Math.round(alert.score * 100)}%
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTimeAgo(alert.timestamp)}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <div className="text-lg font-semibold text-green-900 mb-1">All Clear</div>
                <div className="text-sm text-green-700">No crisis alerts detected across all 47 counties</div>
              </div>
            )}

            {/* Key Threats & Early Warning Signs */}
            {crisisData.aiAssessment?.keyThreats?.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-orange-600" />
                    <span className="font-semibold text-orange-900">Key Threats</span>
                  </div>
                  <ul className="space-y-1">
                    {crisisData.aiAssessment.keyThreats.slice(0, 3).map((threat, idx) => (
                      <li key={idx} className="text-sm text-orange-800 flex items-start gap-2">
                        <div className="w-1 h-1 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                        {threat}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-blue-900">Watch For</span>
                  </div>
                  <ul className="space-y-1">
                    {crisisData.aiAssessment.earlyWarningSignsToWatch?.slice(0, 3).map((sign, idx) => (
                      <li key={idx} className="text-sm text-blue-800 flex items-start gap-2">
                        <div className="w-1 h-1 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        {sign}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Preventive Measures */}
            {crisisData.preventiveMeasures?.length > 0 && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-900">Preventive Measures</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {crisisData.preventiveMeasures.slice(0, 4).map((measure, idx) => (
                    <div key={idx} className="text-sm text-green-800 flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                      {measure}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center p-6 bg-yellow-50 rounded-lg border border-yellow-200">
            <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-sm font-medium text-yellow-900">Unable to load crisis data</div>
            <div className="text-xs text-yellow-700">Please try refreshing</div>
          </div>
        )}

        {/* Action Button */}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full border-red-200 text-red-700 hover:bg-red-50"
          onClick={fetchCrisisData}
          disabled={loading}
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Zap className="w-4 h-4 mr-2" />
          )}
          {loading ? 'Analyzing...' : 'Refresh Analysis'}
        </Button>
      </CardContent>
    </Card>
  );
}
