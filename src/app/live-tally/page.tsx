"use client";
import React, { useState, useEffect } from "react";
import { analyzeCandidateSentiment } from '@/ai/flows/analyze-candidate-sentiment';

import { useMemo, useCallback } from "react";
import Image from "next/image";
import { presidentialCandidates } from "@/lib/data";
import { pollingStations } from "@/types";
import type { LiveTally } from "@/types";
import { useLiveTallyStore } from "@/hooks/use-live-tally-store";
import { analyzeTallyAnomaly } from "@/ai/flows/analyze-tally-anomaly";
import { summarizeForm34a } from "@/ai/flows/summarize-form-34a";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Landmark, Check, User, MapPin, Hash, BarChart, PieChart, Microscope, Loader2, ShieldCheck, ShieldAlert, FileText, Bot } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, CartesianGrid, LabelList, Pie, PieChart as RechartsPieChart, Cell } from "recharts";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// A mock function to get a data URI for the placeholder image
const getForm34aPlaceholderUri = async (): Promise<string> => {
  const response = await fetch("https://placehold.co/600x800.png");
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};


const Form34AViewer = ({ tally }: { tally: LiveTally }) => {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSummarize = async () => {
    setIsSummarizing(true);
    setSummary(null);
    try {
      // In a real app, you would use the actual form image data URI
      const formImageUri = await getForm34aPlaceholderUri();
      const result = await summarizeForm34a({ formImageUri });
      setSummary(result.summary);
    } catch (error) {
      console.error("Error summarizing form:", error);
      toast({ variant: "destructive", title: "Summarization Failed", description: "The AI could not process this form." });
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="ghost" className="w-full mt-1">
          <FileText className="mr-2 h-4 w-4" /> View Form 34A
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Form 34A - {tally.pollingStation}</AlertDialogTitle>
          <AlertDialogDescription>
            This is a placeholder for the official Form 34A document from this polling station. You can use AI to summarize its content.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-center items-center p-4 border rounded-md bg-secondary max-h-[60vh] overflow-auto">
          <Image
            src="https://placehold.co/600x800.png"
            width={500}
            height={707}
            alt="Placeholder for Form 34A"
            data-ai-hint="document form"
          />
        </div>
        <div className="space-y-4">
           <Button onClick={handleSummarize} disabled={isSummarizing} className="w-full">
            {isSummarizing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Summarizing...</> : <><Bot className="mr-2 h-4 w-4"/> Summarize with AI</>}
           </Button>
           {summary && (
              <Alert className="animate-in fade-in-50">
                 <Bot className="h-4 w-4" />
                <AlertTitle>AI Summary</AlertTitle>
                <AlertDescription>{summary}</AlertDescription>
              </Alert>
           )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};


const counties = [...new Set(pollingStations.map(p => p.county))];
const subCounties = [...new Set(pollingStations.map(p => p.subCounty))];
const wards = [...new Set(pollingStations.map(p => p.ward))];


function generateMockId(length: number) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function LiveTallyPage() {
  const { tallies, analyses, addTally, verifyTally, setAnalysisStatus, setAnalysisResult } = useLiveTallyStore();
  const { toast } = useToast();
  
  // Filter state
  const [filterLevel, setFilterLevel] = useState<string>("national");
  const [filterValue, setFilterValue] = useState<string | null>(null);
  const [filterPolitician, setFilterPolitician] = useState<string | null>(null);

  const addNewTally = useCallback(() => {
    const station = pollingStations[Math.floor(Math.random() * pollingStations.length)];
    const voteDistribution = presidentialCandidates.map(c => {
      const anomalyChance = Math.random();
      let votes;
      if (anomalyChance < 0.1) {
        votes = Math.floor(Math.random() * 100) + station.registeredVoters;
      } else if (anomalyChance < 0.15) {
         votes = Math.floor(Math.random() * (station.registeredVoters * 0.8)) + 100;
      } else {
         votes = Math.floor(Math.random() * (station.registeredVoters / presidentialCandidates.length * (0.5 + Math.random()))) + 50;
      }
      return { id: c.id, votes };
    });

    const newTally: LiveTally = {
      id: `tally-${generateMockId(8)}`,
      officerId: `officer-${generateMockId(4)}`,
      pollingStation: `${station.name}, ${station.ward}`,
      voteDistribution,
      timestamp: new Date(),
      verifications: Math.floor(Math.random() * 5),
      ...station
    };

    addTally(newTally);

    toast({
      title: "New Tally Received",
      description: `From ${newTally.pollingStation} by Officer ${newTally.officerId}.`,
    });
  }, [toast, addTally]);
  
  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        const response = await fetch('/api/realtime/tally');
        const data = await response.json();
        // Update tallies with real-time data
        data.results.forEach((result: any) => {
          const station = pollingStations[Math.floor(Math.random() * pollingStations.length)];
          const voteDistribution = presidentialCandidates.map(c => ({
            id: c.id,
            votes: Math.floor(result.votes * Math.random())
          }));
          
          const newTally: LiveTally = {
            id: `tally-${generateMockId(8)}`,
            officerId: `officer-${generateMockId(4)}`,
            pollingStation: `${station.name}, ${station.ward}`,
            voteDistribution,
            timestamp: new Date(),
            verifications: Math.floor(Math.random() * 5),
            ...station
          };
          
          addTally(newTally);
        });
      } catch (error) {
        console.error('Failed to fetch real-time tally data:', error);
      }
    };
    
    fetchRealTimeData();
    const interval = setInterval(fetchRealTimeData, 10000);
    return () => clearInterval(interval);
  }, [addTally]);

  const handleVerification = (tallyId: string) => {
    verifyTally(tallyId);
  };
  
  const handleAnalysis = async (tally: LiveTally) => {
    setAnalysisStatus(tally.id, 'loading');
    
    const totalTallyVotes = tally.voteDistribution.reduce((sum, v) => sum + v.votes, 0);
    const allReportedVotes = tallies.flatMap(t => t.voteDistribution).reduce((sum, v) => sum + v.votes, 0);
    const averageTallySize = tallies.length > 0 ? allReportedVotes / tallies.length : totalTallyVotes;
  
    try {
      const result = await analyzeTallyAnomaly({
        pollingStation: tally.pollingStation,
        registeredVoters: tally.registeredVoters,
        reportedVotes: tally.voteDistribution.map(v => `${presidentialCandidates.find(c=>c.id === v.id)?.name}: ${v.votes} votes`).join(', '),
        previousTallyAverage: averageTallySize,
        historicalFraudRisk: 0.05, // Example value, replace with real data if available
        socialMediaSignal: 'neutral', // Example value, replace with real data if available
        crowdIntel: 'none', // Example value, replace with real data if available
      });
      setAnalysisResult(tally.id, result);
    } catch (error) {
      console.error("Error analyzing tally:", error);
      toast({ variant: "destructive", title: "Analysis Failed", description: "The AI could not process this tally." });
      setAnalysisStatus(tally.id, 'error');
    }
  };

  const filteredTallies = useMemo(() => {
    if (filterLevel === 'national' || !filterValue) return tallies;
    return tallies.filter(tally => {
      if (filterLevel === 'county') return tally.county === filterValue;
      if (filterLevel === 'subCounty') return tally.subCounty === filterValue;
      if (filterLevel === 'ward') return tally.ward === filterValue;
      return true;
    });
  }, [tallies, filterLevel, filterValue]);
  
  const displayTallies = useMemo(() => filteredTallies.slice(0, 5), [filteredTallies]);

  const totalVotes = useMemo(() => {
    const talliesToSum = filterValue ? filteredTallies : tallies;
    let votes = 0;
    for(const tally of talliesToSum) {
        for(const dist of tally.voteDistribution) {
            if(!filterPolitician || dist.id === filterPolitician) {
                 votes += dist.votes;
            }
        }
    }
    return votes;
  }, [tallies, filteredTallies, filterValue, filterPolitician]);
  
  const chartData = useMemo(() => {
    const talliesToSum = filterValue ? filteredTallies : tallies;
    const voteMap = new Map<string, number>();

    for(const tally of talliesToSum) {
        for(const dist of tally.voteDistribution) {
            const currentVotes = voteMap.get(dist.id) || 0;
            voteMap.set(dist.id, currentVotes + dist.votes);
        }
    }
    
    let candidatesData = presidentialCandidates.map(c => ({
        id: c.id,
        name: c.name,
        value: voteMap.get(c.id) || 0,
        fill: `var(--color-${c.name.split(' ').join('')})`
    }));

    if(filterPolitician) {
        candidatesData = candidatesData.filter(c => c.id === filterPolitician);
    }
    
    return candidatesData.sort((a,b) => b.value - a.value);

  }, [tallies, filteredTallies, filterValue, filterPolitician]);

  const chartConfig = useMemo(() => presidentialCandidates.reduce((acc, candidate, index) => {
    const key = candidate.name.split(' ').join('');
    acc[key] = {
      label: candidate.name,
      color: `hsl(var(--chart-${index + 1}))`,
    };
    return acc;
  }, {} as ChartConfig), []);

  const getFilterLocationOptions = () => {
    if (filterLevel === 'county') return counties;
    if (filterLevel === 'subCounty') return subCounties;
    if (filterLevel === 'ward') return wards;
    return [];
  };

  const handleFilterLevelChange = (level: string) => {
    setFilterLevel(level);
    setFilterValue(null);
  }

  const handleLocationFilterChange = (value: string) => {
    setFilterValue(value);
  };

  const handlePoliticianFilterChange = (value: string) => {
    if (value === 'all') {
      setFilterPolitician(null);
    } else {
      setFilterPolitician(value);
    }
  };

  const getOverviewTitle = () => {
    if(filterPolitician && filterValue) return `Tally for ${presidentialCandidates.find(c=>c.id === filterPolitician)?.name} in ${filterValue}`;
    if(filterPolitician) return `National Tally for ${presidentialCandidates.find(c=>c.id === filterPolitician)?.name}`;
    if(filterValue) return `Tally Overview for ${filterValue}`;
    return "National Tally Overview";
  }

  // ...existing code...
  // Mock sentiment data for demonstration (replace with real AI call)
  const [sentimentData, setSentimentData] = useState<Array<{ name: string; sentimentScore: number; sentimentSummary: string; positiveKeywords: string[]; negativeKeywords: string[] }>>([]);
  const [loadingSentiment, setLoadingSentiment] = useState(true);
  useEffect(() => {
    async function fetchSentiment() {
      setLoadingSentiment(true);
      const countyPaths = require('@/components/maps/county-paths').countyPaths as Array<{ id: string; name: string; d: string }>;
      const counties: string[] = countyPaths.map((c: { name: string }) => c.name);
      const candidateName = require('@/lib/data').presidentialCandidates[0]?.name || 'Candidate';
      const topic = 'election';
      const results = await Promise.all(counties.map(async county => {
        try {
          const sentiment = await analyzeCandidateSentiment({ candidateName, topic });
          return { name: county, sentimentScore: sentiment.sentimentScore, sentimentSummary: sentiment.sentimentSummary, positiveKeywords: sentiment.positiveKeywords, negativeKeywords: sentiment.negativeKeywords };
        } catch {
          return { name: county, sentimentScore: 0, sentimentSummary: 'No data', positiveKeywords: [], negativeKeywords: [] };
        }
      }));
      setSentimentData(results);
      setLoadingSentiment(false);
    }
    fetchSentiment();
  }, []);

  return (
    <div className="grid lg:grid-cols-3 gap-6 animate-in fade-in-50">
      <div className="lg:col-span-2 space-y-6">
        <Card className="rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2 animate-in fade-in-50 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{getOverviewTitle()}</CardTitle>
            <CardDescription>
              {(() => {
                let areaLabel = '';
                if (filterLevel === 'national' || !filterValue) {
                  areaLabel = 'National';
                } else if (filterLevel === 'county') {
                  areaLabel = `County: ${filterValue}`;
                } else if (filterLevel === 'subCounty') {
                  areaLabel = `Sub-County: ${filterValue}`;
                } else if (filterLevel === 'ward') {
                  areaLabel = `Ward: ${filterValue}`;
                }
                let postLabel = 'Presidential';
                if (filterPolitician) {
                  const pol = presidentialCandidates.find(c => c.id === filterPolitician);
                  postLabel = pol ? pol.name : 'Presidential';
                }
                return `Live ${postLabel} results for ${areaLabel}. Total Votes Tallied: `;
              })()}
              <span className="font-bold">{totalVotes.toLocaleString()}</span>
            </CardDescription>
          </CardHeader>
           <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 border-b pb-4">
                 <Select value={filterLevel} onValueChange={handleFilterLevelChange}>
                    <SelectTrigger><SelectValue placeholder="Select Level" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="national">National</SelectItem>
                        <SelectItem value="county">County</SelectItem>
                        <SelectItem value="subCounty">Sub-County</SelectItem>
                        <SelectItem value="ward">Ward</SelectItem>
                    </SelectContent>
                 </Select>
                 <Select value={filterValue || "all"} onValueChange={handleLocationFilterChange} disabled={filterLevel === 'national'}>
                    <SelectTrigger><SelectValue placeholder="Select Location" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {getFilterLocationOptions().map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                 </Select>
                 <Select value={filterPolitician || "all"} onValueChange={handlePoliticianFilterChange}>
                    <SelectTrigger><SelectValue placeholder="Track Politician (All)" /></SelectTrigger>
                    <SelectContent>
                         <SelectItem value="all">All Politicians</SelectItem>
                        {presidentialCandidates.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                 </Select>
                 <Button variant="outline" onClick={() => { setFilterLevel('national'); setFilterValue(null); setFilterPolitician(null); }}>Reset Filters</Button>
            </div>
             <Tabs defaultValue="bar">
              <div className="flex justify-end">
                <TabsList>
                  <TabsTrigger value="bar"><BarChart className="mr-2 h-4 w-4"/>Bar Chart</TabsTrigger>
                  <TabsTrigger value="pie"><PieChart className="mr-2 h-4 w-4"/>Pie Chart</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="bar">
                 {totalVotes > 0 ? (
                  <>
                  <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
                    <RechartsBarChart data={chartData} accessibilityLayer layout="vertical" margin={{ left: 20 }}>
                      <CartesianGrid horizontal={false} />
                      <YAxis dataKey="name" type="category" tickLine={false} tickMargin={10} axisLine={false} width={120} interval={0} />
                      <XAxis type="number" dataKey="value" hide/>
                      <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                      <Bar dataKey="value" radius={5} layout="vertical">
                        <LabelList dataKey="value" position="right" offset={8} className="fill-foreground font-semibold" formatter={(value: number) => value.toLocaleString()} />
                      </Bar>
                    </RechartsBarChart>
                  </ChartContainer>
                  {/* Legend below chart */}
                  <div className="mt-6 flex flex-wrap gap-4 justify-center">
                    {chartData.map(entry => {
                      const percent = totalVotes > 0 ? ((entry.value / totalVotes) * 100).toFixed(1) : '0.0';
                      return (
                        <div key={entry.id} className="flex items-center gap-2 px-3 py-1 rounded bg-muted text-sm shadow">
                          <span className="inline-block w-3 h-3 rounded-full" style={{ background: entry.fill }}></span>
                          <span className="font-semibold">{entry.name}</span>
                          <span className="text-xs text-muted-foreground">{percent}%</span>
                        </div>
                      );
                    })}
                  </div>
                  </>
                ) : (
                  <div className="text-center text-muted-foreground py-16 animate-in fade-in-50">
                    <p>Waiting for polling stations to report...</p>
                  </div>
                )}
              </TabsContent>
               <TabsContent value="pie">
                 {totalVotes > 0 ? (
                  <>
                    <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
                       <RechartsPieChart>
                          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                          <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={120} labelLine={false} label={({ percent }) => `${(percent * 100).toFixed(0)}%`}>
                             {chartData.map((entry) => (
                               <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                             ))}
                          </Pie>
                       </RechartsPieChart>
                    </ChartContainer>
                    {/* Legend below chart */}
                    <div className="mt-6 flex flex-wrap gap-4 justify-center">
                      {chartData.map(entry => {
                        const percent = totalVotes > 0 ? ((entry.value / totalVotes) * 100).toFixed(1) : '0.0';
                        return (
                          <div key={entry.id} className="flex items-center gap-2 px-3 py-1 rounded bg-muted text-sm shadow">
                            <span className="inline-block w-3 h-3 rounded-full" style={{ background: entry.fill }}></span>
                            <span className="font-semibold">{entry.name}</span>
                            <span className="text-xs text-muted-foreground">{percent}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                 ) : (
                   <div className="text-center text-muted-foreground py-16 animate-in fade-in-50">
                     <p>Waiting for polling stations to report...</p>
                   </div>
                 )}
               </TabsContent>
             </Tabs>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        <Card className="sticky top-20 rounded-xl shadow-lg animate-in fade-in-50">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2 animate-in fade-in-50 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"><Landmark/>Live Verification Feed</CardTitle>
            <CardDescription>
              New tallies from polling stations appear here. Feed updates every 7 seconds.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {displayTallies.length === 0 && (
                <div className="text-center text-muted-foreground py-8 animate-in fade-in-50">
                  <p>Awaiting incoming data for this location...</p>
                </div>
              )}
            {displayTallies.map((tally) => {
              const analysis = analyses[tally.id];
              const isAnomaly = analysis?.status === 'complete' && analysis.result?.isAnomaly;
              const isCredible = analysis?.status === 'complete' && !analysis.result?.isAnomaly;
              
              // ...existing code...
              return (
                <div key={tally.id} className="border rounded-xl shadow p-3 space-y-2 animate-in fade-in-50 bg-card">
                  <div className="flex justify-between items-start">
                     <div className="text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                           {isAnomaly && <div className="h-2 w-2 rounded-full bg-red-500 blinking-indicator"></div>}
                           {isCredible && <div className="h-2 w-2 rounded-full bg-green-500 blinking-indicator"></div>}
                           <p className="flex items-center gap-1 font-semibold text-sm text-foreground"><MapPin className="h-3 w-3" /> {tally.pollingStation}</p>
                        </div>
                        <p>Registered Voters: {tally.registeredVoters.toLocaleString()}</p>
                        <p className="flex items-center gap-1"><User className="h-3 w-3" /> Officer: {tally.officerId}</p>
                     </div>
                     <div className="text-right text-xs text-muted-foreground">
                        <p>{tally.timestamp.toLocaleTimeString()}</p>
                        <p>ID: {tally.id}</p>
                     </div>
                  </div>
                  <Separator/>
                  <div className="text-sm space-y-1">
                    {tally.voteDistribution.map(dist => {
                       const candidate = presidentialCandidates.find(c => c.id === dist.id);
                       return (
                        <div key={dist.id} className="flex justify-between">
                           <span>{candidate?.name}</span>
                           <span className="font-semibold">{dist.votes.toLocaleString()}</span>
                        </div>
                       )
                    })}
                  </div>
                  {/* AI Insights Section */}
                  {analysis?.status === 'complete' && analysis.result && (
                     <Alert variant={analysis.result.isAnomaly ? "destructive" : "default"} className="mt-2 animate-in fade-in-50">
                        {analysis.result.isAnomaly ? <ShieldAlert className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                        <AlertTitle className="font-headline bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                           AI Analysis: {analysis.result.isAnomaly ? "Anomaly Detected" : "All Clear"}
                        </AlertTitle>
                        <AlertDescription>{analysis.result.reason}</AlertDescription>
                        {analysis.result.explainability && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            <strong>Explainability:</strong> {analysis.result.explainability}
                          </div>
                        )}
                        {typeof analysis.result.fraudRiskScore === 'number' && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            <strong>Fraud Risk Score:</strong> {(analysis.result.fraudRiskScore * 100).toFixed(1)}%
                          </div>
                        )}
                        {/* Turnout prediction placeholder (to be replaced with real AI call) */}
                        <div className="mt-2 text-xs text-muted-foreground">
                          <strong>Turnout Prediction:</strong> <span className="font-semibold">AI estimates turnout at 72% (based on historical, weather, and social signals)</span>
                        </div>
                      </Alert>
                  )}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                     <Button size="sm" variant="outline" onClick={() => handleVerification(tally.id)}>
                       <Check className="mr-2 h-4 w-4" /> Verify ({tally.verifications})
                     </Button>
                     <Button size="sm" variant="secondary" onClick={() => handleAnalysis(tally)} disabled={analysis?.status === 'loading'}>
                       {analysis?.status === 'loading' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Microscope className="mr-2 h-4 w-4" />}
                       {analysis?.status ? 'Analyzed' : 'Analyze Tally'}
                     </Button>
                  </div>
                   <Form34AViewer tally={tally} />
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
