"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertTriangle, Loader2, Shield } from 'lucide-react';

interface FactCheckResult {
  statement: string;
  verdict: 'true' | 'false' | 'misleading' | 'unverified';
  confidence: number;
  sources: string[];
  explanation: string;
  context: string;
  relatedClaims: string[];
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
                <h4 className="font-semibold mb-2">Sources</h4>
                <div className="space-y-1">
                  {result.sources.map((source, index) => (
                    <div key={index} className="text-sm text-blue-600 hover:underline cursor-pointer">
                      • {source}
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