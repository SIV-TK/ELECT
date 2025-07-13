// src/app/live-tally/page.tsx
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { presidentialCandidates } from "@/lib/data";
import type { Candidate, LiveTally, TallyAnalysisState } from "@/types";
import { analyzeTallyAnomaly } from "@/ai/flows/analyze-tally-anomaly";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Landmark, Check, User, MapPin, Hash, BarChart, PieChart, Microscope, Loader2, ShieldCheck, ShieldAlert, FileText } from "lucide-react";
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


const pollingStations = [
  { name: "KICC, Nairobi", registeredVoters: 2500 },
  { name: "Moi Avenue Primary, Mombasa", registeredVoters: 1800 },
  { name: "Kisumu Social Hall, Kisumu", registeredVoters: 2200 },
  { name: "Eldoret Town Hall, Uasin Gishu", registeredVoters: 2800 },
  { name: "Nyeri Primary, Nyeri", registeredVoters: 1500 },
];

function generateMockId(length: number) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function LiveTallyPage() {
  const [candidates, setCandidates] = useState<Candidate[]>(presidentialCandidates.map(c => ({...c, votes: 0})));
  const [liveTallies, setLiveTallies] = useState<LiveTally[]>([]);
  const { toast } = useToast();
  const [tallyAnalyses, setTallyAnalyses] = useState<Record<string, TallyAnalysisState>>({});

  const addNewTally = useCallback(() => {
    const station = pollingStations[Math.floor(Math.random() * pollingStations.length)];
    const voteDistribution = candidates.map(c => {
      // Simulate potential for anomalies in some tallies
      const anomalyChance = Math.random();
      let votes;
      if (anomalyChance < 0.1) { // 10% chance of a high-turnout anomaly
        votes = Math.floor(Math.random() * 100) + station.registeredVoters;
      } else if (anomalyChance < 0.15) { // 5% chance of a vote spike for one candidate
         votes = Math.floor(Math.random() * (station.registeredVoters * 0.8)) + 100;
      } else {
         votes = Math.floor(Math.random() * (station.registeredVoters / candidates.length * (0.5 + Math.random()))) + 50;
      }
      return { id: c.id, votes };
    });

    const newTally: LiveTally = {
      id: `tally-${generateMockId(8)}`,
      officerId: `officer-${generateMockId(4)}`,
      pollingStation: station.name,
      registeredVoters: station.registeredVoters,
      voteDistribution,
      timestamp: new Date(),
      verifications: Math.floor(Math.random() * 5),
    };

    setLiveTallies(prev => [newTally, ...prev.slice(0, 4)]);
    setCandidates(prevCandidates => 
      prevCandidates.map(pc => {
        const newVotes = voteDistribution.find(v => v.id === pc.id)?.votes || 0;
        return {...pc, votes: pc.votes + newVotes};
      })
    );

    toast({
      title: "New Tally Received",
      description: `From ${newTally.pollingStation} by Officer ${newTally.officerId}.`,
    });
  }, [candidates, toast]);
  
  useEffect(() => {
    const interval = setInterval(addNewTally, 7000); // Add a new tally every 7 seconds
    return () => clearInterval(interval);
  }, [addNewTally]);

  const handleVerification = (tallyId: string) => {
    setLiveTallies(prev => 
      prev.map(t => 
        t.id === tallyId ? { ...t, verifications: t.verifications + 1 } : t
      )
    );
  };
  
  const handleAnalysis = async (tally: LiveTally) => {
    setTallyAnalyses(prev => ({ ...prev, [tally.id]: { status: 'loading' } }));
    
    const totalTallyVotes = tally.voteDistribution.reduce((sum, v) => sum + v.votes, 0);
    const allReportedVotes = liveTallies.flatMap(t => t.voteDistribution).reduce((sum, v) => sum + v.votes, 0);
    const averageTallySize = liveTallies.length > 0 ? allReportedVotes / liveTallies.length : totalTallyVotes;
  
    try {
      const result = await analyzeTallyAnomaly({
        pollingStation: tally.pollingStation,
        registeredVoters: tally.registeredVoters,
        reportedVotes: tally.voteDistribution.map(v => `${candidates.find(c=>c.id === v.id)?.name}: ${v.votes} votes`).join(', '),
        previousTallyAverage: averageTallySize,
      });
      setTallyAnalyses(prev => ({ ...prev, [tally.id]: { status: 'complete', result } }));
    } catch (error) {
      console.error("Error analyzing tally:", error);
      toast({ variant: "destructive", title: "Analysis Failed", description: "The AI could not process this tally." });
      setTallyAnalyses(prev => ({ ...prev, [tally.id]: { status: 'error' } }));
    }
  };

  const totalVotes = useMemo(() => candidates.reduce((acc, c) => acc + c.votes, 0), [candidates]);
  
  const chartData = useMemo(() => candidates.map(c => ({ name: c.name, value: c.votes, fill: `var(--color-${c.name.split(' ').join('')})`})).sort((a,b) => b.value - a.value), [candidates]);

  const chartConfig = useMemo(() => candidates.reduce((acc, candidate, index) => {
    const key = candidate.name.split(' ').join('');
    acc[key] = {
      label: candidate.name,
      color: `hsl(var(--chart-${index + 1}))`,
    };
    return acc;
  }, {} as ChartConfig), [candidates]);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2"> National Tally Overview</CardTitle>
            <CardDescription>
              This is a live, simulated feed of the national presidential election results. Total Votes Tallied: <span className="font-bold">{totalVotes.toLocaleString()}</span>
            </CardDescription>
          </CardHeader>
           <CardContent>
             <Tabs defaultValue="bar">
              <div className="flex justify-end">
                <TabsList>
                  <TabsTrigger value="bar"><BarChart className="mr-2 h-4 w-4"/>Bar Chart</TabsTrigger>
                  <TabsTrigger value="pie"><PieChart className="mr-2 h-4 w-4"/>Pie Chart</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="bar">
                 {totalVotes > 0 ? (
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
                ) : (
                  <div className="text-center text-muted-foreground py-16">
                    <p>Waiting for the first polling station to report...</p>
                  </div>
                )}
              </TabsContent>
               <TabsContent value="pie">
                 {totalVotes > 0 ? (
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
                 ) : (
                   <div className="text-center text-muted-foreground py-16">
                     <p>Waiting for the first polling station to report...</p>
                   </div>
                 )}
               </TabsContent>
             </Tabs>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Landmark/>Live Verification Feed</CardTitle>
            <CardDescription>
              New tallies from polling stations appear here for verification and AI analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {liveTallies.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <p>Awaiting incoming data...</p>
                </div>
              )}
            {liveTallies.map((tally) => {
              const analysis = tallyAnalyses[tally.id];
              const isAnomaly = analysis?.status === 'complete' && analysis.result?.isAnomaly;
              const isCredible = analysis?.status === 'complete' && !analysis.result?.isAnomaly;
              
              return (
                <div key={tally.id} className="border rounded-lg p-3 space-y-2 animate-in fade-in-50">
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
                       const candidate = candidates.find(c => c.id === dist.id);
                       return (
                        <div key={dist.id} className="flex justify-between">
                           <span>{candidate?.name}</span>
                           <span className="font-semibold">{dist.votes.toLocaleString()}</span>
                        </div>
                       )
                    })}
                  </div>
                  {analysis?.status === 'complete' && analysis.result && (
                     <Alert variant={analysis.result.isAnomaly ? "destructive" : "default"} className="mt-2">
                        {analysis.result.isAnomaly ? <ShieldAlert className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                        <AlertTitle>
                           AI Analysis: {analysis.result.isAnomaly ? "Anomaly Detected" : "All Clear"}
                        </AlertTitle>
                        <AlertDescription>{analysis.result.reason}</AlertDescription>
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
                   <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button size="sm" variant="ghost" className="w-full mt-1">
                           <FileText className="mr-2 h-4 w-4" /> View Form 34A
                         </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Form 34A - {tally.pollingStation}</AlertDialogTitle>
                          <AlertDialogDescription>
                            This is a placeholder for the official Form 34A document from this polling station.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="flex justify-center items-center p-4 border rounded-md bg-secondary">
                          <Image 
                            src="https://placehold.co/600x800.png"
                            width={500}
                            height={707}
                            alt="Placeholder for Form 34A"
                            data-ai-hint="document form"
                          />
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Close</AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                   </AlertDialog>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
