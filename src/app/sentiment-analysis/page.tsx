// src/app/sentiment-analysis/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { analyzeCandidateSentiment } from "@/ai/flows/analyze-candidate-sentiment";
import type { AnalyzeCandidateSentimentOutput } from "@/ai/flows/analyze-candidate-sentiment";
import { predictVoteDistribution } from "@/ai/flows/predict-vote-distribution";
import type { VoteDistribution } from "@/ai/flows/predict-vote-distribution";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ThumbsUp, 
  ThumbsDown, 
  Loader2, 
  Check, 
  ChevronsUpDown, 
  Trophy, 
  Map, 
  BarChart3, 
  TrendingUp, 
  AlertCircle, 
  Sparkles,
  Brain,
  Users,
  Globe,
  Zap,
  Eye,
  Star
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import FixedKenyaMap from "@/components/maps/fixed-kenya-map";

const suggestedTopics = [
  { value: "The Economy", label: "The Economy" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "The Housing Bill", label: "The Housing Bill" },
  { value: "Education", label: "Education" },
  { value: "Infrastructure", label: "Infrastructure" },
  { value: "Unemployment", label: "Unemployment" },
  { value: "Foreign Policy", label: "Foreign Policy" },
  { value: "Cost of living", label: "Cost of living" },
  { value: "Corruption", label: "Corruption" },
  { value: "National Security", label: "National Security" },
  { value: "Climate Change", label: "Climate Change" },
  { value: "Tax Policy", label: "Tax Policy" },
  { value: "Youth Empowerment", label: "Youth Empowerment" },
];

const suggestedCandidates = [
  "William Ruto",
  "Raila Odinga",
  "Martha Karua",
  "Kalonzo Musyoka",
  "Rigathi Gachagua",
  "Musalia Mudavadi",
  "Moses Wetangula",
  "Anne Waiguru",
  "Johnson Sakaja",
  "Gladys Wanga",
];

const formSchema = z.object({
  candidateName: z.string().min(2, "Candidate name is required."),
});

type ResultState = {
  sentiment: AnalyzeCandidateSentimentOutput;
  prediction?: {
    regions: VoteDistribution[];
    aiPrediction: string;
  };
} | null;

export default function SentimentAnalysisPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPrediction, setIsLoadingPrediction] = useState(false);
  const [result, setResult] = useState<ResultState>(null);
  const { toast } = useToast();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [candidateSuggestions, setCandidateSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [analysisCount, setAnalysisCount] = useState(0);
  const [useRealTimeData, setUseRealTimeData] = useState(false);
  
  useEffect(() => {
    // Get real analysis count from localStorage or API
    const storedCount = localStorage.getItem('sentiment-analysis-count');
    setAnalysisCount(storedCount ? parseInt(storedCount) : 0);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { candidateName: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setIsLoadingPrediction(true);
    setResult(null);
    try {
      let sentimentResult;
      
      // Choose API endpoint based on real-time data toggle
      if (useRealTimeData) {
        // Use real-time sentiment analysis API
        const response = await fetch('/api/realtime-sentiment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            candidateName: values.candidateName
          })
        });
        
        if (!response.ok) throw new Error('Real-time sentiment analysis failed');
        const apiResult = await response.json();
        sentimentResult = apiResult;
      } else {
        // Use regular sentiment analysis API
        const response = await fetch('/api/analyze-sentiment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            candidateName: values.candidateName
          })
        });
        
        if (!response.ok) throw new Error('Sentiment analysis failed');
        const apiResult = await response.json();
        
        if (!apiResult.success || !apiResult.data) {
          throw new Error('Invalid response from sentiment analysis API');
        }
        
        sentimentResult = apiResult.data;
      }
      
      setResult({ sentiment: sentimentResult });
      
      // Increment real analysis count
      const newCount = analysisCount + 1;
      setAnalysisCount(newCount);
      localStorage.setItem('sentiment-analysis-count', newCount.toString());

      // Generate vote distribution prediction using the new API
      try {
        const predictionResponse = await fetch('/api/predict-vote-distribution', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            candidateName: values.candidateName,
            sentimentScore: sentimentResult.sentimentScore
          })
        });
        
        if (predictionResponse.ok) {
          const predictionResult = await predictionResponse.json();
          
          if (predictionResult.success && predictionResult.data) {
            setResult(prev => prev ? {
              ...prev,
              prediction: predictionResult.data
            } : null);
          }
        } else {
          console.warn('Prediction API failed, continuing without prediction map');
        }
      } catch (predictionError) {
        console.warn('Failed to generate prediction:', predictionError);
        // Continue without prediction rather than failing entirely
      }

    } catch (error) {
      console.error("Error during analysis:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not complete the sentiment analysis. Please try again.",
      });
    } finally {
      setIsLoading(false);
      setIsLoadingPrediction(false);
    }
  }

  const sentimentPercentage = result ? (result.sentiment.sentimentScore + 1) * 50 : 0;
  
  const handleCandidateInput = (value: string) => {
    if (value.length > 2) {
      const filtered = suggestedCandidates.filter(name => 
        name.toLowerCase().includes(value.toLowerCase())
      );
      setCandidateSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const generateAIPrediction = (candidateName: string, sentimentScore: number, regions: any[]) => {
    const avgVoteShare = regions.reduce((sum, region) => sum + region.predictedVoteShare, 0) / regions.length;
    const topRegions = regions.sort((a, b) => b.predictedVoteShare - a.predictedVoteShare).slice(0, 3);
    
    let prediction = `Based on current sentiment analysis (score: ${sentimentScore.toFixed(2)}), `;
    
    if (sentimentScore > 0.3) {
      prediction += `${candidateName} shows strong positive momentum with an average predicted vote share of ${avgVoteShare.toFixed(1)}%. `;
      prediction += `Strongest support expected in ${topRegions.map(r => r.name).join(', ')}. `;
      prediction += "Current trends suggest favorable electoral prospects.";
    } else if (sentimentScore > -0.3) {
      prediction += `${candidateName} maintains moderate public standing with mixed sentiment across regions. `;
      prediction += `Performance varies significantly, with better prospects in ${topRegions[0].name} (${topRegions[0].predictedVoteShare.toFixed(1)}%). `;
      prediction += "Electoral outcome will depend on campaign effectiveness and current events.";
    } else {
      prediction += `${candidateName} faces challenging public sentiment with an average predicted vote share of ${avgVoteShare.toFixed(1)}%. `;
      prediction += `Even in stronger regions like ${topRegions[0].name}, support remains limited. `;
      prediction += "Significant campaign efforts needed to improve electoral prospects.";
    }
    
    return prediction;
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/10 shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b border-primary/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="font-headline text-2xl">Public Sentiment Analysis</CardTitle>
          </div>
          <CardDescription className="text-base">
            Use AI to gauge public opinion on political topics, then predict election outcomes based on sentiment analysis.
          </CardDescription>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" />
              <span>{analysisCount.toLocaleString()} analyses performed</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="realtime-toggle"
                checked={useRealTimeData}
                onChange={(e) => setUseRealTimeData(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="realtime-toggle" className="text-xs text-muted-foreground cursor-pointer">
                Use Real-time Data
              </label>
            </div>
          </div>
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
                      <div className="relative">
                        <FormControl>
                          <Input 
                            placeholder="e.g., William Ruto" 
                            {...field} 
                            onChange={(e) => {
                              field.onChange(e);
                              handleCandidateInput(e.target.value);
                            }}
                            className="pr-8"
                          />
                        </FormControl>
                        {showSuggestions && (
                          <div className="absolute z-10 w-full mt-1 bg-card border rounded-md shadow-lg py-1">
                            {candidateSuggestions.map((name) => (
                              <div 
                                key={name} 
                                className="px-3 py-1.5 hover:bg-primary/5 cursor-pointer text-sm"
                                onClick={() => {
                                  form.setValue("candidateName", name);
                                  setShowSuggestions(false);
                                }}
                              >
                                {name}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Analyze and Predict
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
      </Card>

      {isLoading && (
        <Card className="border-primary/10 shadow-md overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="relative mb-4">
                <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary" />
              </div>
              <p className="text-lg font-medium mb-2">AI Analysis in Progress</p>
              <p className="text-muted-foreground">
                {useRealTimeData 
                  ? 'Scraping real-time data and analyzing sentiment...' 
                  : 'Analyzing sentiment and predicting electoral outcomes...'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {result?.sentiment && (
        <Card className="animate-in fade-in-50 border-primary/10 shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b border-primary/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="font-headline">Analysis Results</CardTitle>
            </div>
            <CardDescription className="text-base">
              {useRealTimeData ? 'Real-time' : 'AI-generated'} sentiment analysis for <span className="font-bold text-foreground">{form.getValues("candidateName")}</span>
              {(result.sentiment as any).dataFreshness && (
                <div className="text-xs text-muted-foreground mt-1">
                  Data updated: {new Date((result.sentiment as any).dataFreshness).toLocaleString()}
                </div>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
              <h3 className="text-lg font-semibold mb-3">Overall Sentiment Score: {result.sentiment.sentimentScore.toFixed(2)} (47 Counties)</h3>
              <Progress 
                value={sentimentPercentage} 
                className="w-full h-3 rounded-full" 
                style={{
                  background: 'linear-gradient(to right, #ef4444, #eab308, #22c55e)',
                }}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span className="flex items-center gap-1"><ThumbsDown className="h-3 w-3 text-red-500" /> Very Negative</span>
                <span>Neutral</span>
                <span className="flex items-center gap-1">Very Positive <ThumbsUp className="h-3 w-3 text-green-500" /></span>
              </div>
            </div>
            <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
              <h3 className="text-lg font-semibold mb-2">Summary</h3>
              <p className="text-foreground">{result.sentiment.sentimentSummary}</p>
              {(result.sentiment as any).countyBreakdown && (
                <p className="text-sm text-muted-foreground mt-2">{(result.sentiment as any).countyBreakdown}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card/50 p-4 rounded-lg border border-green-100/30">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-green-100/30 flex items-center justify-center">
                    <ThumbsUp className="text-green-500 h-4 w-4" />
                  </div>
                  Positive Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.sentiment.positiveKeywords.map((kw: string) => (
                    <Badge 
                      key={kw} 
                      variant="outline" 
                      className="border-green-500/30 bg-green-50/30 text-green-600 hover:bg-green-100/30 transition-colors"
                    >
                      {kw}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="bg-card/50 p-4 rounded-lg border border-red-100/30">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-red-100/30 flex items-center justify-center">
                    <ThumbsDown className="text-red-500 h-4 w-4" />
                  </div>
                  Negative Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.sentiment.negativeKeywords.map((kw: string) => (
                    <Badge 
                      key={kw} 
                      variant="outline" 
                      className="border-red-500/30 bg-red-50/30 text-red-600 hover:bg-red-100/30 transition-colors"
                    >
                      {kw}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="min-h-[600px] border-primary/10 shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b border-primary/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Map className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="font-headline">Vote Distribution Prediction</CardTitle>
          </div>
          <CardDescription className="text-base">
            AI-powered prediction of vote distribution across Kenya based on sentiment analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
           {isLoadingPrediction && (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                 <div className="relative mb-4">
                   <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                   <Map className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary" />
                 </div>
                 <p className="text-lg font-medium mb-2">Generating Prediction</p>
                 <p className="text-muted-foreground">Creating county-level vote distribution map...</p>
              </div>
           )}
           {result?.prediction && (
             <div className="space-y-4 animate-in fade-in-50">
                <FixedKenyaMap data={result.prediction.regions} />
             </div>
           )}
           {!isLoading && !result && (
             <div className="text-center py-12 px-4">
               <div className="mb-4 flex justify-center">
                 <div className="h-16 w-16 rounded-full bg-primary/5 flex items-center justify-center">
                   <AlertCircle className="h-8 w-8 text-primary/40" />
                 </div>
               </div>
               <h3 className="text-lg font-medium mb-2">No Analysis Yet</h3>
               <p className="text-muted-foreground max-w-md mx-auto">Complete the form above to generate an AI-powered sentiment analysis and vote distribution prediction.</p>
             </div>
           )}
        </CardContent>
      </Card>

      {result?.prediction && (
        <Card className="animate-in fade-in-50 border-primary/10 shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-accent/5 to-transparent border-b border-accent/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-accent" />
              </div>
              <CardTitle className="font-headline">AI Predicted Outcome</CardTitle>
            </div>
            <CardDescription className="text-base">
              Based on sentiment analysis and political data for {form.getValues("candidateName")}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
              <p className="text-lg font-medium text-foreground">
                {result.prediction.aiPrediction}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
