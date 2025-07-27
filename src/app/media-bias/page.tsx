"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, CheckCircle, Eye, Loader2, Link as LinkIcon } from 'lucide-react';

interface BiasAnalysis {
  overallBias: number; // -1 to 1 (left to right)
  biasLabel: string;
  confidence: number;
  factualReporting: number; // 0 to 1
  emotionalLanguage: number; // 0 to 1
  sourceCredibility: number; // 0 to 1
  keyIndicators: string[];
  summary: string;
  onlineSources?: string[];
}

export default function MediaBiasDetector() {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<BiasAnalysis | null>(null);
  const [analysisMode, setAnalysisMode] = useState<'url' | 'text'>('url');

  const analyzeContent = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-bias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: analysisMode,
          content: analysisMode === 'url' ? url : text
        })
      });
      
      const result = await response.json();
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getBiasColor = (bias: number) => {
    if (bias < -0.3) return 'bg-blue-500';
    if (bias > 0.3) return 'bg-red-500';
    return 'bg-green-500';
  };

  const getBiasPosition = (bias: number) => {
    return ((bias + 1) / 2) * 100;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Media Bias Detector</h1>
        <p className="text-muted-foreground">AI-powered analysis of news source bias and credibility</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Analyze Content</CardTitle>
          <CardDescription>Enter a news URL or paste article text for bias analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              variant={analysisMode === 'url' ? 'default' : 'outline'}
              onClick={() => setAnalysisMode('url')}
              size="sm"
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              URL Analysis
            </Button>
            <Button 
              variant={analysisMode === 'text' ? 'default' : 'outline'}
              onClick={() => setAnalysisMode('text')}
              size="sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              Text Analysis
            </Button>
          </div>

          {analysisMode === 'url' ? (
            <Input
              placeholder="https://example.com/news-article"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          ) : (
            <Textarea
              placeholder="Paste article text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
            />
          )}

          <Button 
            onClick={analyzeContent}
            disabled={isAnalyzing || (!url && !text)}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Bias'
            )}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Bias Analysis Results
                <Badge variant={analysis.overallBias > 0.3 ? 'destructive' : analysis.overallBias < -0.3 ? 'secondary' : 'default'}>
                  {analysis.biasLabel}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Left Bias</span>
                  <span>Center</span>
                  <span>Right Bias</span>
                </div>
                <div className="relative h-4 bg-gradient-to-r from-blue-500 via-green-500 to-red-500 rounded-full">
                  <div 
                    className="absolute top-0 w-3 h-4 bg-white border-2 border-gray-800 rounded-full transform -translate-x-1/2"
                    style={{ left: `${getBiasPosition(analysis.overallBias)}%` }}
                  />
                </div>
                <div className="text-center text-sm text-muted-foreground mt-1">
                  Confidence: {(analysis.confidence * 100).toFixed(0)}%
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Factual Reporting</span>
                    <span>{(analysis.factualReporting * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={analysis.factualReporting * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Emotional Language</span>
                    <span>{(analysis.emotionalLanguage * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={analysis.emotionalLanguage * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Source Credibility</span>
                    <span>{(analysis.sourceCredibility * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={analysis.sourceCredibility * 100} className="h-2" />
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Key Bias Indicators</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.keyIndicators.map((indicator, index) => (
                    <Badge key={index} variant="outline">
                      {indicator}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Analysis Summary</h4>
                <div 
                  className="text-sm text-muted-foreground prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: analysis.summary }}
                />
              </div>

              {(analysis as any).onlineSources && (
                <div>
                  <h4 className="font-semibold mb-2">Online Data Sources</h4>
                  <div className="flex flex-wrap gap-2">
                    {(analysis as any).onlineSources.map((source: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {source}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                  Cross-reference with multiple sources for balanced perspective
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                  Look for primary sources and direct quotes
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                  Consider the publication's editorial stance and funding
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}