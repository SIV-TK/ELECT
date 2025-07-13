// src/app/live-tally/page.tsx
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { presidentialCandidates } from "@/lib/data";
import type { Candidate, LiveTally } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Landmark, Check, User, MapPin, Hash, BarChart } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, CartesianGrid, LabelList } from "recharts";
import { Separator } from "@/components/ui/separator";

const pollingStations = ["KICC, Nairobi", "Moi Avenue Primary, Mombasa", "Kisumu Social Hall, Kisumu", "Eldoret Town Hall, Uasin Gishu", "Nyeri Primary, Nyeri"];

// Function to generate a mock hash
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

  const addNewTally = useCallback(() => {
    const candidateVotes: Record<string, number> = {};
    let maxVote = 0;
    let leadingCandidate = '';

    // Simulate votes for each candidate
    const voteDistribution = candidates.map(c => {
      const votes = Math.floor(Math.random() * (Math.random() > 0.8 ? 500 : 150)) + 50;
       if(votes > maxVote) {
         maxVote = votes;
         leadingCandidate = c.name;
       }
      return { id: c.id, votes };
    });

    const newTally: LiveTally = {
      id: `tally-${generateMockId(8)}`,
      officerId: `officer-${generateMockId(4)}`,
      pollingStation: pollingStations[Math.floor(Math.random() * pollingStations.length)],
      voteDistribution,
      timestamp: new Date(),
      verifications: Math.floor(Math.random() * 5), // Start with some verifications
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

  const totalVotes = useMemo(() => candidates.reduce((acc, c) => acc + c.votes, 0), [candidates]);
  
  const chartData = candidates.map(c => ({ name: c.name, votes: c.votes, fill: `var(--color-${c.name.split(' ').join('')})`})).sort((a,b) => b.votes - a.votes);

  const chartConfig = candidates.reduce((acc, candidate) => {
    const key = candidate.name.split(' ').join('');
    acc[key] = {
      label: candidate.name,
      color: `hsl(var(--chart-${Object.keys(acc).length + 1}))`,
    };
    return acc;
  }, {} as ChartConfig);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2"><BarChart /> National Tally Overview</CardTitle>
            <CardDescription>
              This is a live, simulated feed of the national presidential election results. Total Votes Tallied: <span className="font-bold">{totalVotes.toLocaleString()}</span>
            </CardDescription>
          </CardHeader>
           <CardContent>
            {totalVotes > 0 ? (
              <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
                <RechartsBarChart data={chartData} accessibilityLayer layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid horizontal={false} />
                  <YAxis dataKey="name" type="category" tickLine={false} tickMargin={10} axisLine={false} width={120} interval={0} />
                  <XAxis type="number" dataKey="votes" hide/>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Bar dataKey="votes" radius={5} layout="vertical">
                    <LabelList dataKey="votes" position="right" offset={8} className="fill-foreground font-semibold" formatter={(value: number) => value.toLocaleString()} />
                  </Bar>
                </RechartsBarChart>
              </ChartContainer>
            ) : (
              <div className="text-center text-muted-foreground py-16">
                <p>Waiting for the first polling station to report...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Landmark/>Live Verification Feed</CardTitle>
            <CardDescription>
              Newly submitted tallies from polling stations appear here for public verification.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {liveTallies.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <p>Awaiting incoming data...</p>
                </div>
              )}
            {liveTallies.map((tally) => (
              <div key={tally.id} className="border rounded-lg p-3 space-y-2 animate-in fade-in-50">
                <div className="flex justify-between items-center">
                   <div className="text-xs text-muted-foreground">
                      <p className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {tally.pollingStation}</p>
                      <p className="flex items-center gap-1"><User className="h-3 w-3" /> Officer: {tally.officerId}</p>
                   </div>
                   <Button size="sm" variant="outline" onClick={() => handleVerification(tally.id)}>
                     <Check className="mr-2 h-4 w-4" /> Verify ({tally.verifications})
                   </Button>
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
                 <p className="text-xs text-muted-foreground pt-1 text-right">{tally.timestamp.toLocaleTimeString()}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
