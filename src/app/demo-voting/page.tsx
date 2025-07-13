// src/app/demo-voting/page.tsx
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { predictElectionOutcome } from "@/ai/flows/predict-election-outcome";
import type { PredictElectionOutcomeOutput } from "@/ai/flows/predict-election-outcome";
import {
  presidentialCandidates,
  gubernatorialCandidates,
  senatorialCandidates,
  womenRepCandidates,
  mcaCandidates
} from "@/lib/data";
import type { Candidate } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, BarChart, Lightbulb, UserCheck, Trophy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, CartesianGrid, LabelList } from "recharts";

type VoteState = {
  [key: string]: Candidate[];
};

type VotedState = {
  [key: string]: string | null;
};

const elections = [
  { id: 'presidential', title: 'Presidential', data: presidentialCandidates },
  { id: 'gubernatorial', title: 'Gubernatorial (Nairobi)', data: gubernatorialCandidates },
  { id: 'senatorial', title: 'Senatorial (Nairobi)', data: senatorialCandidates },
  { id: 'womenrep', title: 'Women Rep (Nairobi)', data: womenRepCandidates },
  { id: 'mca', title: 'MCA (Karen Ward)', data: mcaCandidates },
];

const chartConfig = {
  votes: {
    label: "Votes",
  },
} as ChartConfig;

const CandidateCard = ({ candidate, onVote, hasVoted, isVotedFor }: { candidate: Candidate; onVote: (id: string) => void; hasVoted: boolean; isVotedFor: boolean; }) => (
    <Card className="text-center hover:shadow-lg transition-shadow">
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
          onClick={() => onVote(candidate.id)}
          disabled={hasVoted}
          variant={isVotedFor ? "outline" : "default"}
          className="w-full mt-2"
        >
          {isVotedFor ? <UserCheck className="mr-2 h-4 w-4" /> : null}
          {hasVoted ? (isVotedFor ? "Voted" : "Vote Cast") : "Vote"}
        </Button>
      </CardContent>
    </Card>
);

const ElectionTabContent = ({
  electionType,
  candidates,
  onVote,
  votedCandidateId,
  totalVotes,
}: {
  electionType: string;
  candidates: Candidate[];
  onVote: (electionType: string, candidateId: string) => void;
  votedCandidateId: string | null;
  totalVotes: number;
}) => {
  const chartData = candidates.map(c => ({ name: c.name, votes: c.votes, fill: `var(--color-${c.name.replace(/[^a-zA-Z0-9]/g, '')})` }));
  
  const candidateChartConfig = candidates.reduce((acc, candidate, index) => {
    acc[candidate.name.replace(/[^a-zA-Z0-9]/g, '')] = {
      label: candidate.name,
      color: `hsl(var(--chart-${index + 1}))`,
    };
    return acc;
  }, {} as ChartConfig);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Candidates</CardTitle>
          <CardDescription>
            Cast your vote for a candidate in the {electionType} race.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {candidates.map(candidate => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onVote={(id) => onVote(electionType, id)}
              hasVoted={!!votedCandidateId}
              isVotedFor={votedCandidateId === candidate.id}
            />
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <BarChart /> Live Results
          </CardTitle>
          <CardDescription>Total Votes Cast for this race: {totalVotes}</CardDescription>
        </CardHeader>
        <CardContent>
          {totalVotes > 0 ? (
            <ChartContainer config={candidateChartConfig} className="min-h-[250px] w-full">
              <RechartsBarChart data={chartData} accessibilityLayer layout="vertical">
                <CartesianGrid horizontal={false} />
                <YAxis dataKey="name" type="category" tickLine={false} tickMargin={10} axisLine={false} width={120} interval={0} />
                <XAxis type="number" dataKey="votes" hide/>
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="votes" radius={5} layout="vertical">
                  <LabelList dataKey="votes" position="right" offset={8} className="fill-foreground font-semibold" />
                </Bar>
              </RechartsBarChart>
            </ChartContainer>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <p>No votes have been cast yet for this race. Be the first to vote!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default function DemoVotingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictElectionOutcomeOutput | null>(null);
  const [candidateState, setCandidateState] = useState<VoteState>({
    presidential: presidentialCandidates,
    gubernatorial: gubernatorialCandidates,
    senatorial: senatorialCandidates,
    womenrep: womenRepCandidates,
    mca: mcaCandidates,
  });
  const [votedState, setVotedState] = useState<VotedState>({
    presidential: null,
    gubernatorial: null,
    senatorial: null,
    womenrep: null,
    mca: null,
  });
  const { toast } = useToast();

  const handleVote = (electionType: string, candidateId: string) => {
    if (votedState[electionType]) {
      toast({
        variant: "destructive",
        title: "Already Voted",
        description: `You can only vote once per race.`,
      });
      return;
    }

    setCandidateState(prev => ({
      ...prev,
      [electionType]: prev[electionType].map(c =>
        c.id === candidateId ? { ...c, votes: c.votes + 1 } : c
      ),
    }));

    setVotedState(prev => ({
      ...prev,
      [electionType]: candidateId,
    }));

    toast({
      title: "Vote Cast!",
      description: "Thank you for participating in the demo vote for this race.",
    });
  };

  async function handlePrediction() {
    setIsLoading(true);
    setPrediction(null);
    const demoVotesData = candidateState.presidential
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

  const totalPresidentialVotes = useMemo(() => candidateState.presidential.reduce((acc, c) => acc + c.votes, 0), [candidateState.presidential]);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Demo Voting Booth</CardTitle>
            <CardDescription>
              Select an election race and cast your vote. Your vote contributes to the live tally for that race.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="presidential" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 h-auto">
                {elections.map(e => <TabsTrigger key={e.id} value={e.id}>{e.title}</TabsTrigger>)}
              </TabsList>
              {elections.map(e => {
                const totalVotes = candidateState[e.id].reduce((sum, c) => sum + c.votes, 0);
                return (
                  <TabsContent key={e.id} value={e.id} className="mt-6">
                    <ElectionTabContent
                      electionType={e.id}
                      candidates={candidateState[e.id]}
                      onVote={handleVote}
                      votedCandidateId={votedState[e.id]}
                      totalVotes={totalVotes}
                    />
                  </TabsContent>
                )
              })}
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle className="font-headline">AI Presidential Prediction</CardTitle>
            <CardDescription>
              Based on the *presidential* demo votes, our AI will predict the outcome and highlight key trends.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handlePrediction} disabled={isLoading || totalPresidentialVotes === 0} className="w-full">
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Predicting...</>
              ) : (
                "Predict Presidential Winner"
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
