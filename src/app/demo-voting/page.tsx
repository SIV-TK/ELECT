// src/app/demo-voting/page.tsx
"use client";

import { useState, useMemo } from "react";
import { pollingStations } from "@/types";
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

const AREA_TABS = [
  { id: 'national', label: 'National' },
  { id: 'county', label: 'County' },
  { id: 'ward', label: 'Ward' },
];

const COUNTY_LIST = [
  ...new Set([
    ...gubernatorialCandidates.map(c => c.county),
    ...senatorialCandidates.map(c => c.county),
    ...womenRepCandidates.map(c => c.county),
    ...mcaCandidates.map(c => c.county),
    ...pollingStations.map(p => p.county),
  ].filter(Boolean)),
];

const WARD_LIST = [
  ...new Set([
    ...mcaCandidates.map(c => c.ward),
    ...pollingStations.map(p => p.ward),
  ].filter(Boolean)),
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
  const [areaTab, setAreaTab] = useState('national');
  const [selectedCounty, setSelectedCounty] = useState(COUNTY_LIST[0] || 'Nairobi');
  const [selectedWard, setSelectedWard] = useState(WARD_LIST[0] || 'Karen');
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

  // Filter posts/candidates based on area selection
  type ElectionTab = { id: string; title: string; data: Candidate[] };
  let filteredElections: ElectionTab[] = [];
  if (areaTab === 'national') {
    filteredElections = [
      { id: 'presidential', title: 'Presidential', data: candidateState.presidential },
    ];
  } else if (areaTab === 'county') {
    filteredElections = [
      { id: 'gubernatorial', title: `Gubernatorial (${selectedCounty})`, data: candidateState.gubernatorial.filter((c: Candidate) => c.county === selectedCounty) },
      { id: 'senatorial', title: `Senatorial (${selectedCounty})`, data: candidateState.senatorial.filter((c: Candidate) => c.county === selectedCounty) },
      { id: 'womenrep', title: `Women Rep (${selectedCounty})`, data: candidateState.womenrep.filter((c: Candidate) => c.county === selectedCounty) },
    ];
  } else if (areaTab === 'ward') {
    filteredElections = [
      { id: 'mca', title: `MCA (${selectedWard})`, data: candidateState.mca.filter((c: Candidate) => c.ward === selectedWard) },
    ];
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Demo Voting Booth</CardTitle>
            <CardDescription>
              Select your area and post, then cast your vote. Your vote contributes to the live tally for that race.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Area selection tabs */}
            <Tabs value={areaTab} onValueChange={setAreaTab} className="mb-4">
              <TabsList className="grid w-full grid-cols-3 h-auto mb-2">
                {AREA_TABS.map(tab => (
                  <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* County/Ward dropdowns */}
            {areaTab === 'county' && (
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Select County:</label>
                <select
                  value={selectedCounty}
                  onChange={e => setSelectedCounty(e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                >
                  {COUNTY_LIST.map(county => (
                    <option key={county} value={county}>{county}</option>
                  ))}
                </select>
              </div>
            )}
            {areaTab === 'ward' && (
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Select Ward:</label>
                <select
                  value={selectedWard}
                  onChange={e => setSelectedWard(e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                >
                  {WARD_LIST.map(ward => (
                    <option key={ward} value={ward}>{ward}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Election posts and candidates */}
            <Tabs defaultValue={filteredElections[0]?.id} className="w-full">
              <TabsList className={`grid w-full grid-cols-${filteredElections.length} h-auto`}>
                {filteredElections.map((e: ElectionTab) => <TabsTrigger key={e.id} value={e.id}>{e.title}</TabsTrigger>)}
              </TabsList>
              {filteredElections.map((e: ElectionTab) => {
                const totalVotes = e.data.reduce((sum: number, c: Candidate) => sum + c.votes, 0);
                return (
                  <TabsContent key={e.id} value={e.id} className="mt-6">
                    <ElectionTabContent
                      electionType={e.id}
                      candidates={e.data}
                      onVote={handleVote}
                      votedCandidateId={votedState[e.id]}
                      totalVotes={totalVotes}
                    />
                  </TabsContent>
                );
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
