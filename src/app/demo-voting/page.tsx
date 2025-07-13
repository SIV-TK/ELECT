"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { predictElectionOutcome } from "@/ai/flows/predict-election-outcome";
import type { PredictElectionOutcomeOutput } from "@/ai/flows/predict-election-outcome";
import { presidentialCandidates } from "@/lib/data";
import type { Candidate } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, BarChart, Lightbulb, UserCheck, Trophy } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, CartesianGrid, LabelList } from "recharts";

export default function DemoVotingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictElectionOutcomeOutput | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>(presidentialCandidates);
  const [votedCandidateId, setVotedCandidateId] = useState<string | null>(null);
  const { toast } = useToast();

  const totalVotes = useMemo(() => candidates.reduce((acc, c) => acc + c.votes, 0), [candidates]);

  const handleVote = (candidateId: string) => {
    if (votedCandidateId) {
      toast({
        variant: "destructive",
        title: "Already Voted",
        description: "You can only vote once in this demo session.",
      });
      return;
    }

    setCandidates(prev =>
      prev.map(c =>
        c.id === candidateId ? { ...c, votes: c.votes + 1 } : c
      )
    );
    setVotedCandidateId(candidateId);
    toast({
      title: "Vote Cast!",
      description: "Thank you for participating in the demo vote.",
    });
  };

  async function handlePrediction() {
    setIsLoading(true);
    setPrediction(null);
    const demoVotesData = candidates
      .map(c => `${c.name} (${c.party}): ${c.votes} votes`)
      .join("\n");

    try {
      const result = await predictElectionOutcome({ demoVotesData });
      setPrediction(result);
    } catch (error) {
      console.error("Error predicting outcome:", error);
      toast({
        variant: "destructive",
        title: "Prediction Failed",
        description: "Could not generate prediction. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const chartData = candidates.map(c => ({ name: c.name, votes: c.votes, fill: `var(--color-${c.name.split(' ').join('')})`}));

  const chartConfig = candidates.reduce((acc, candidate) => {
    acc[candidate.name.split(' ').join('')] = {
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
            <CardTitle className="font-headline text-2xl">Presidential Demo Vote</CardTitle>
            <CardDescription>
              Cast your vote for a presidential candidate. Your vote contributes to the live tally and AI prediction.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {candidates.map(candidate => (
              <Card key={candidate.id} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 flex flex-col items-center gap-2">
                  <Image
                    src={candidate.imageUrl}
                    alt={candidate.name}
                    width={80}
                    height={80}
                    className="rounded-full border-2"
                    data-ai-hint="politician portrait"
                  />
                  <h3 className="font-semibold">{candidate.name}</h3>
                  <p className="text-xs text-muted-foreground">{candidate.party}</p>
                  <Button
                    onClick={() => handleVote(candidate.id)}
                    disabled={!!votedCandidateId}
                    variant={votedCandidateId === candidate.id ? "outline" : "default"}
                    className="w-full mt-2"
                  >
                    {votedCandidateId === candidate.id ? <UserCheck className="mr-2 h-4 w-4" /> : null}
                    {votedCandidateId ? "Voted" : "Vote"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <BarChart /> Live Results
            </CardTitle>
            <CardDescription>Total Votes Cast: {totalVotes}</CardDescription>
          </CardHeader>
          <CardContent>
            {totalVotes > 0 ? (
              <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                <RechartsBarChart data={chartData} accessibilityLayer layout="vertical">
                  <CartesianGrid horizontal={false} />
                  <YAxis dataKey="name" type="category" tickLine={false} tickMargin={10} axisLine={false} width={120} />
                  <XAxis type="number" dataKey="votes" hide/>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Bar dataKey="votes" radius={5} layout="vertical">
                    <LabelList dataKey="votes" position="right" offset={8} className="fill-foreground font-semibold" />
                  </Bar>
                </RechartsBarChart>
              </ChartContainer>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <p>No votes have been cast yet. Be the first to vote!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle className="font-headline">AI Election Prediction</CardTitle>
            <CardDescription>
              Based on the demo votes, our AI will predict the election outcome and highlight key trends.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handlePrediction} disabled={isLoading || totalVotes === 0} className="w-full">
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Predicting...</>
              ) : (
                "Predict Winner"
              )}
            </Button>
          </CardContent>
          {prediction && (
            <CardFooter className="flex flex-col items-start gap-4 animate-in fade-in-50 pt-4 border-t">
              <div>
                <h3 className="font-semibold flex items-center gap-2"><Trophy /> Predicted Winner</h3>
                <p className="text-primary font-bold text-xl">{prediction.predictedWinner}</p>
              </div>
              <div>
                <h3 className="font-semibold flex items-center gap-2"><Lightbulb /> Key Trends</h3>
                <p className="text-sm text-muted-foreground">{prediction.keyTrends}</p>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
