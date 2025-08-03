import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw,
  Globe,
  Zap,
  Eye,
  TrendingUp
} from 'lucide-react';

interface ScraperHealthData {
  status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
  timestamp: string;
  testDuration: string;
  scrapers: {
    enhanced: {
      status: 'WORKING' | 'FAILED';
      workingSources: string[];
      failedSources: string[];
      sampleResults: number;
    };
    puppeteer: {
      status: 'WORKING' | 'FAILED';
      browserInfo?: any;
      testResults: any[];
      sampleResults: number;
    };
    jsdom: {
      status: 'WORKING' | 'FAILED';
      sampleResults: number;
    };
  };
  recommendations: string[];
}

export function ScraperHealthMonitor() {
  const [healthData, setHealthData] = useState<ScraperHealthData | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const fetchHealthData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/scraper-health');
      const result = await response.json();
      
      if (result.success) {
        setHealthData(result.data);
        setLastChecked(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch scraper health:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchHealthData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'HEALTHY':
      case 'WORKING':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'DEGRADED':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'CRITICAL':
      case 'FAILED':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HEALTHY':
      case 'WORKING':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'DEGRADED':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CRITICAL':
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getOverallHealth = () => {
    if (!healthData) return 0;
    
    const workingScrapers = Object.values(healthData.scrapers).filter(
      scraper => scraper.status === 'WORKING'
    ).length;
    
    return (workingScrapers / 3) * 100; // 3 total scrapers
  };

  if (!healthData && !loading) {
    return (
      <Card className="border-2 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Data Scraper Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <Button onClick={fetchHealthData} variant="outline">
              Check Scraper Health
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Data Scraper Health
            {healthData && (
              <Badge 
                variant="outline" 
                className={`ml-2 ${getStatusColor(healthData.status)}`}
              >
                {healthData.status}
              </Badge>
            )}
          </div>
          <Button
            onClick={fetchHealthData}
            disabled={loading}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
          </div>
        ) : healthData ? (
          <>
            {/* Overall Health Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">System Health</span>
                <span className="font-medium">{Math.round(getOverallHealth())}%</span>
              </div>
              <Progress value={getOverallHealth()} className="h-2" />
            </div>

            {/* Individual Scraper Status */}
            <div className="grid grid-cols-1 gap-3">
              {/* Enhanced Scraper */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-medium text-sm">Enhanced Scraper</div>
                    <div className="text-xs text-gray-600">
                      {healthData.scrapers.enhanced.workingSources.length} sources working
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">
                    {healthData.scrapers.enhanced.sampleResults} items
                  </span>
                  {getStatusIcon(healthData.scrapers.enhanced.status)}
                </div>
              </div>

              {/* Puppeteer Scraper */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="font-medium text-sm">Puppeteer Browser</div>
                    <div className="text-xs text-gray-600">
                      {healthData.scrapers.puppeteer.browserInfo ? 
                        'Chrome browser active' : 'Browser setup needed'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">
                    {healthData.scrapers.puppeteer.sampleResults} items
                  </span>
                  {getStatusIcon(healthData.scrapers.puppeteer.status)}
                </div>
              </div>

              {/* JSDOM Scraper */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="font-medium text-sm">JSDOM Lightweight</div>
                    <div className="text-xs text-gray-600">
                      Fast fallback scraper
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">
                    {healthData.scrapers.jsdom.sampleResults} items
                  </span>
                  {getStatusIcon(healthData.scrapers.jsdom.status)}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center p-2 bg-white rounded border">
                <div className="text-lg font-bold text-blue-600">
                  {Object.values(healthData.scrapers).reduce((sum, scraper) => 
                    sum + scraper.sampleResults, 0
                  )}
                </div>
                <div className="text-xs text-gray-600">Total Items Scraped</div>
              </div>
              <div className="text-center p-2 bg-white rounded border">
                <div className="text-lg font-bold text-green-600">
                  {healthData.testDuration}
                </div>
                <div className="text-xs text-gray-600">Response Time</div>
              </div>
            </div>

            {/* Recommendations */}
            {healthData.recommendations.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-900 mb-2">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  System Recommendations
                </div>
                <ul className="text-xs text-blue-800 space-y-1">
                  {healthData.recommendations.slice(0, 3).map((rec, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <span className="text-blue-600">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Last Checked */}
            {lastChecked && (
              <div className="text-xs text-gray-500 text-center pt-2">
                Last checked: {lastChecked.toLocaleTimeString()}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Unable to load scraper health data</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
