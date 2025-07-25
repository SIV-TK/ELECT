"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Shield, TrendingDown, TrendingUp, Loader2, Search } from 'lucide-react';

interface RiskAssessment {
  entity: string;
  type: 'politician' | 'organization' | 'project';
  overallRisk: number;
  transparencyScore: number;
  factors: {
    financial: number;
    governance: number;
    accountability: number;
    disclosure: number;
  };
  alerts: string[];
  recommendations: string[];
  lastUpdated: string;
}

export default function CorruptionRiskAssessment() {
  const [searchTerm, setSearchTerm] = useState('');
  const [entityType, setEntityType] = useState<string>('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);

  const analyzeRisk = async () => {
    if (!searchTerm.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/corruption-risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity: searchTerm, type: entityType })
      });
      
      const data = await response.json();
      setAssessment(data);
    } catch (error) {
      console.error('Risk analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk > 0.7) return 'text-red-500';
    if (risk > 0.4) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getRiskLabel = (risk: number) => {
    if (risk > 0.7) return 'High Risk';
    if (risk > 0.4) return 'Medium Risk';
    return 'Low Risk';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Corruption Risk Assessment</h1>
        <p className="text-muted-foreground">AI-powered transparency scoring and risk analysis</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Risk Analysis
          </CardTitle>
          <CardDescription>Enter entity name for AI-powered corruption risk assessment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Enter politician, organization, or project name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={entityType} onValueChange={setEntityType}>
              <SelectTrigger>
                <SelectValue placeholder="Entity type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="politician">Politician</SelectItem>
                <SelectItem value="organization">Organization</SelectItem>
                <SelectItem value="project">Project</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={analyzeRisk}
            disabled={isAnalyzing || !searchTerm.trim()}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Risk...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Assess Corruption Risk
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {assessment && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{assessment.entity}</span>
                <Badge 
                  variant={assessment.overallRisk > 0.7 ? 'destructive' : 
                          assessment.overallRisk > 0.4 ? 'secondary' : 'default'}
                >
                  {getRiskLabel(assessment.overallRisk)}
                </Badge>
              </CardTitle>
              <CardDescription>
                Type: {assessment.type} • Last updated: {new Date(assessment.lastUpdated).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Overall Risk Score</span>
                    <span className={`font-bold ${getRiskColor(assessment.overallRisk)}`}>
                      {(assessment.overallRisk * 100).toFixed(0)}%
                    </span>
                  </div>
                  <Progress 
                    value={assessment.overallRisk * 100} 
                    className="h-3"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Transparency Score</span>
                    <span className={`font-bold ${getRiskColor(1 - assessment.transparencyScore)}`}>
                      {(assessment.transparencyScore * 100).toFixed(0)}%
                    </span>
                  </div>
                  <Progress 
                    value={assessment.transparencyScore * 100} 
                    className="h-3"
                  />
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Risk Factors Breakdown</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(assessment.factors).map(([factor, score]) => (
                    <div key={factor} className="text-center">
                      <div className="mb-2">
                        <div className={`text-2xl font-bold ${getRiskColor(score)}`}>
                          {(score * 100).toFixed(0)}%
                        </div>
                        <div className="text-sm capitalize">{factor}</div>
                      </div>
                      <Progress value={score * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>

              {assessment.alerts.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    Risk Alerts
                  </h4>
                  <div className="space-y-2">
                    {assessment.alerts.map((alert, index) => (
                      <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">{alert}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold mb-3">Recommendations</h4>
                <div className="space-y-2">
                  {assessment.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                      <p className="text-sm">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>

              {assessment.realTimeContext && (
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3">Real-time Data Sources</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-blue-600">{assessment.realTimeContext.newsArticles}</div>
                      <div className="text-muted-foreground">News Articles</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-green-600">{assessment.realTimeContext.governmentRecords}</div>
                      <div className="text-muted-foreground">Gov Records</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-red-600">{assessment.realTimeContext.legalCases}</div>
                      <div className="text-muted-foreground">Legal Cases</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-purple-600">Live</div>
                      <div className="text-muted-foreground">Data Status</div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Data refreshed: {new Date(assessment.realTimeContext.dataFreshness).toLocaleString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Positive Indicators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    High transparency score in financial disclosures
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Regular public reporting and accountability
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Strong governance structures in place
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                  Areas of Concern
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    Limited financial transparency
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    Inconsistent reporting practices
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    Weak oversight mechanisms
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {!assessment && !isAnalyzing && (
        <Card>
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Start Risk Assessment</h3>
            <p className="text-muted-foreground">
              Enter an entity name above to begin AI-powered corruption risk analysis
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}