"use client";

import React, { useState } from "react";
import '@/styles/leaflet.css';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader2, Brain, TrendingUp, ThumbsUp, ThumbsDown, Map } from "lucide-react";
import dynamic from 'next/dynamic';

const KenyaSentimentMap = dynamic(() => import('@/components/maps/kenya-sentiment-map'), { ssr: false });

const formSchema = z.object({
  candidateName: z.string().min(2, "Required"),
});

export default function SentimentAnalysisPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [useRealTime, setUseRealTime] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { candidateName: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    
    try {
      const endpoint = useRealTime ? '/api/realtime-sentiment' : '/api/analyze-sentiment';
      const body = useRealTime 
        ? { candidateName: values.candidateName }
        : { candidateName: values.candidateName, topic: 'Overall Political Performance' };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const sentimentPercentage = result ? (result.sentimentScore + 1) * 50 : 0;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">How AI Sentiment Analysis Works</h2>
        <p className="text-blue-800 text-sm leading-relaxed">
          Our AI system scrapes real-time data from Kenyan news sources and social media comments, then uses advanced natural language processing to analyze public sentiment toward political candidates. Simply enter a candidate's name, choose real-time data for current analysis, and get comprehensive insights including sentiment scores, key themes, and county-by-county breakdown across all 47 counties in Kenya.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Sentiment Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="candidateName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Candidate Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., William Ruto" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="realtime"
                  checked={useRealTime}
                  onChange={(e) => setUseRealTime(e.target.checked)}
                />
                <label htmlFor="realtime" className="text-sm">Use Real-time Data</label>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Sentiment'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Analysis Results for {form.getValues("candidateName")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-semibold">Sentiment Score: {result.sentimentScore.toFixed(2)}</h3>
                <Progress value={sentimentPercentage} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ThumbsDown className="h-3 w-3" /> Negative
                  </span>
                  <span>Neutral</span>
                  <span className="flex items-center gap-1">
                    Positive <ThumbsUp className="h-3 w-3" />
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">AI Summary</h3>
                <p className="text-sm leading-relaxed">{result.sentimentSummary}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-green-600">Positive Keywords</h3>
                  <div className="flex flex-wrap gap-1">
                    {result.positiveKeywords.map((keyword: string) => (
                      <Badge key={keyword} variant="outline" className="text-green-600 border-green-200">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-red-600">Negative Keywords</h3>
                  <div className="flex flex-wrap gap-1">
                    {result.negativeKeywords.map((keyword: string) => (
                      <Badge key={keyword} variant="outline" className="text-red-600 border-red-200">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                County Analysis (47 Counties)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-96 overflow-y-auto">
                {((result as any).countyAnalysis || []).map((county: any) => (
                  <div key={county.name} className={`flex justify-between items-center p-2 rounded ${
                    county.support >= 60 ? 'bg-green-50' : county.support >= 45 ? 'bg-yellow-50' : 'bg-red-50'
                  }`}>
                    <span className="text-sm">{county.name}</span>
                    <Badge variant="outline" className={`${
                      county.support >= 60 ? 'text-green-600 border-green-200' : 
                      county.support >= 45 ? 'text-yellow-600 border-yellow-200' : 
                      'text-red-600 border-red-200'
                    }`}>
                      {county.support}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {(result as any).countyAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5" />
                  Kenya County Sentiment Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span>High Support (60%+)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                      <span>Moderate (45-59%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span>Low Support (&lt;45%)</span>
                    </div>
                  </div>
                  <KenyaSentimentMap countyData={(result as any).countyAnalysis || []} />
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}