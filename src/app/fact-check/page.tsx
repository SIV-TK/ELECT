"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertTriangle, Loader2, Shield, ExternalLink } from 'lucide-react';

interface FactCheckResult {
  statement: string;
  verdict: 'true' | 'false' | 'misleading' | 'unverified';
  confidence: number;
  sources: SourceInfo[];
  explanation: string;
  context: string;
  relatedClaims: string[];
  realtimeData: RealtimeFactData;
  aiAnalysis: AIFactAnalysis;
  verification: VerificationDetails;
}

interface SourceInfo {
  title: string;
  source: string;
  url?: string;
  publishedDate?: string;
  relevanceScore: number;
  credibilityScore: number;
  summary: string;
}

interface RealtimeFactData {
  relatedNews: any[];
  governmentSources: any[];
  socialSentiment: any;
  statisticalData: any;
  lastUpdated: string;
  dataFreshness: number;
}

interface AIFactAnalysis {
  entityExtraction: {
    politicians: string[];
    policies: string[];
    locations: string[];
    dates: string[];
    organizations: string[];
  };
  claimType: 'statistical' | 'policy' | 'historical' | 'prediction' | 'opinion';
  verificationStrategy: string;
  keyFactors: string[];
  riskAssessment: 'low' | 'medium' | 'high';
}

interface VerificationDetails {
  crossReferencedSources: number;
  governmentVerification: boolean;
  mediaConsensus: 'agree' | 'disagree' | 'mixed' | 'insufficient';
  timeContext: string;
  contradictoryEvidence: string[];
  supportingEvidence: string[];
}

export default function FactChecker() {
  const [statement, setStatement] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<FactCheckResult | null>(null);

  const checkFact = async () => {
    setIsChecking(true);
    try {
      const response = await fetch('/api/fact-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statement })
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Fact check failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'true': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'false': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'misleading': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default: return <Shield className="h-5 w-5 text-gray-500" />;
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'true': return 'bg-green-500';
      case 'false': return 'bg-red-500';
      case 'misleading': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Real-time Fact Checker</h1>
        <p className="text-muted-foreground">AI verification of political statements and claims</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Check Political Statement</CardTitle>
          <CardDescription>Enter a political claim or statement for AI-powered fact verification</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter political statement to fact-check..."
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
            rows={4}
          />
          
          <Button 
            onClick={checkFact}
            disabled={isChecking || !statement.trim()}
            className="w-full"
          >
            {isChecking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Fact-checking...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Verify Statement
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getVerdictIcon(result.verdict)}
                Fact Check Result
                <Badge 
                  variant={result.verdict === 'true' ? 'default' : 
                          result.verdict === 'false' ? 'destructive' : 'secondary'}
                >
                  {result.verdict.toUpperCase()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Statement Analyzed:</h4>
                <p className="text-sm italic">"{result.statement}"</p>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Confidence Level</span>
                  <span>{(result.confidence * 100).toFixed(0)}%</span>
                </div>
                <Progress value={result.confidence * 100} className="h-2" />
              </div>

              <div>
                <h4 className="font-semibold mb-2">Explanation</h4>
                <p className="text-sm text-muted-foreground">{result.explanation}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Context</h4>
                <p className="text-sm text-muted-foreground">{result.context}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Sources ({result.sources.length})</h4>
                <div className="space-y-3">
                  {result.sources.map((source, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h5 className="font-medium text-sm text-gray-900 mb-1">{source.title}</h5>
                          <p className="text-xs text-blue-600 font-medium">{source.source}</p>
                        </div>
                        <div className="flex gap-2 ml-2">
                          <Badge variant="secondary" className="text-xs">
                            {Math.round(source.credibilityScore * 100)}% credible
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {Math.round(source.relevanceScore * 100)}% relevant
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{source.summary}</p>
                      {source.publishedDate && (
                        <p className="text-xs text-gray-400">
                          Published: {new Date(source.publishedDate).toLocaleDateString()}
                        </p>
                      )}
                      {source.url && (
                        <a 
                          href={source.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-500 hover:underline"
                        >
                          View Source →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {result.relatedClaims.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Related Claims</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.relatedClaims.map((claim, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {claim}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Real-time Data Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-500" />
                Real-time Data Analysis
                <Badge variant="secondary" className="text-xs">
                  Fresh Data ({Math.round(result.realtimeData.dataFreshness)}s old)
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{result.realtimeData.relatedNews.length}</div>
                  <div className="text-sm text-blue-800">News Articles</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{result.realtimeData.governmentSources.length}</div>
                  <div className="text-sm text-green-800">Gov Sources</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">{result.verification.crossReferencedSources}</div>
                  <div className="text-sm text-purple-800">Cross-Referenced</div>
                </div>
              </div>

              <div>
                <h5 className="font-medium mb-2">Verification Status</h5>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={result.verification.governmentVerification ? "default" : "secondary"}>
                    {result.verification.governmentVerification ? "✓" : "✗"} Government Verified
                  </Badge>
                  <Badge variant="outline">
                    Media Consensus: {result.verification.mediaConsensus}
                  </Badge>
                  <Badge variant="outline">
                    Risk: {result.aiAnalysis.riskAssessment}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Analysis Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-500" />
                AI Analysis & Entity Extraction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h5 className="font-medium mb-2">Claim Classification</h5>
                <div className="flex gap-2 mb-3">
                  <Badge variant="default" className="capitalize">
                    {result.aiAnalysis.claimType} Claim
                  </Badge>
                  <Badge variant={
                    result.aiAnalysis.riskAssessment === 'high' ? 'destructive' :
                    result.aiAnalysis.riskAssessment === 'medium' ? 'secondary' : 'outline'
                  }>
                    {result.aiAnalysis.riskAssessment} Risk
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.aiAnalysis.entityExtraction.politicians.length > 0 && (
                  <div>
                    <h6 className="font-medium text-sm mb-2">Politicians Mentioned</h6>
                    <div className="flex flex-wrap gap-1">
                      {result.aiAnalysis.entityExtraction.politicians.map((politician, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {politician}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {result.aiAnalysis.entityExtraction.policies.length > 0 && (
                  <div>
                    <h6 className="font-medium text-sm mb-2">Policies/Programs</h6>
                    <div className="flex flex-wrap gap-1">
                      {result.aiAnalysis.entityExtraction.policies.map((policy, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {policy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {result.aiAnalysis.entityExtraction.locations.length > 0 && (
                  <div>
                    <h6 className="font-medium text-sm mb-2">Locations</h6>
                    <div className="flex flex-wrap gap-1">
                      {result.aiAnalysis.entityExtraction.locations.map((location, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {location}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {result.aiAnalysis.entityExtraction.organizations.length > 0 && (
                  <div>
                    <h6 className="font-medium text-sm mb-2">Organizations</h6>
                    <div className="flex flex-wrap gap-1">
                      {result.aiAnalysis.entityExtraction.organizations.map((org, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {org}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h6 className="font-medium text-sm mb-2">Verification Strategy</h6>
                <p className="text-sm text-gray-600">{result.aiAnalysis.verificationStrategy}</p>
              </div>

              <div>
                <h6 className="font-medium text-sm mb-2">Key Verification Factors</h6>
                <ul className="text-sm text-gray-600 space-y-1">
                  {result.aiAnalysis.keyFactors.map((factor, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Comprehensive Sources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-green-500" />
                Comprehensive Sources
                <Badge variant="secondary" className="text-xs">
                  {(result.realtimeData.relatedNews.length + result.realtimeData.governmentSources.length)} Total
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* News Sources */}
                {result.realtimeData.relatedNews.length > 0 && (
                  <div>
                    <h5 className="font-medium mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      News Articles ({result.realtimeData.relatedNews.length})
                    </h5>
                    <div className="space-y-3">
                      {result.realtimeData.relatedNews.map((article, index) => (
                        <div key={index} className="border rounded-lg p-3 bg-blue-50/30">
                          <div className="flex items-start justify-between mb-2">
                            <h6 className="font-medium text-sm line-clamp-2">{article.title}</h6>
                            <div className="flex gap-1 ml-2">
                              <Badge variant="outline" className="text-xs whitespace-nowrap">
                                {article.source}
                              </Badge>
                              <Badge 
                                variant={
                                  article.credibilityScore >= 0.8 ? "default" :
                                  article.credibilityScore >= 0.6 ? "secondary" : "destructive"
                                }
                                className="text-xs"
                              >
                                {Math.round(article.credibilityScore * 100)}%
                              </Badge>
                            </div>
                          </div>
                          {article.excerpt && (
                            <p className="text-sm text-gray-600 mb-2 line-clamp-3">{article.excerpt}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-500">
                                {new Date(article.publishedAt).toLocaleDateString()}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                Relevance: {Math.round(article.relevanceScore * 100)}%
                              </Badge>
                            </div>
                            <a 
                              href={article.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700 text-xs flex items-center gap-1"
                            >
                              Read article <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Government Sources */}
                {result.realtimeData.governmentSources.length > 0 && (
                  <div>
                    <h5 className="font-medium mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Government Sources ({result.realtimeData.governmentSources.length})
                    </h5>
                    <div className="space-y-3">
                      {result.realtimeData.governmentSources.map((source, index) => (
                        <div key={index} className="border rounded-lg p-3 bg-green-50/30">
                          <div className="flex items-start justify-between mb-2">
                            <h6 className="font-medium text-sm line-clamp-2">{source.title}</h6>
                            <div className="flex gap-1 ml-2">
                              <Badge variant="default" className="text-xs whitespace-nowrap">
                                {source.source}
                              </Badge>
                              <Badge variant="default" className="text-xs bg-green-600">
                                Official
                              </Badge>
                            </div>
                          </div>
                          {source.excerpt && (
                            <p className="text-sm text-gray-600 mb-2 line-clamp-3">{source.excerpt}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-500">
                                {new Date(source.publishedAt).toLocaleDateString()}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                Relevance: {Math.round(source.relevanceScore * 100)}%
                              </Badge>
                            </div>
                            <a 
                              href={source.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-800 text-xs flex items-center gap-1"
                            >
                              View source <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fallback for legacy sources */}
                {result.sources && result.sources.length > 0 && (
                  result.realtimeData.relatedNews.length === 0 && 
                  result.realtimeData.governmentSources.length === 0
                ) && (
                  <div>
                    <h5 className="font-medium mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      Additional Sources
                    </h5>
                    <div className="space-y-3">
                      {result.sources.map((source, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex items-start justify-between mb-2">
                            <h6 className="font-medium text-sm">{source.title}</h6>
                            <Badge variant="outline" className="text-xs ml-2">
                              {source.source}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{source.summary}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">{source.publishedDate}</span>
                            <a 
                              href={source.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700 text-xs flex items-center gap-1"
                            >
                              Read more <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No sources message */}
                {(!result.sources || result.sources.length === 0) && 
                 result.realtimeData.relatedNews.length === 0 && 
                 result.realtimeData.governmentSources.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No sources available for this fact-check</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Verification Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span><strong>True:</strong> Statement is factually accurate and supported by evidence</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                  <span><strong>False:</strong> Statement is factually incorrect or unsupported</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <span><strong>Misleading:</strong> Contains some truth but lacks important context</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-gray-500 mt-0.5" />
                  <span><strong>Unverified:</strong> Insufficient evidence to determine accuracy</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}