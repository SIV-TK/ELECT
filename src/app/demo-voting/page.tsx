// src/app/demo-voting/page.tsx
"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { pollingStations } from "@/types";
import { predictElectionOutcome } from "@/ai/flows/predict-election-outcome";
import type { PredictElectionOutcomeOutput } from "@/ai/flows/predict-election-outcome";
import { trackVotingAction, trackPoliticianView } from "@/lib/analytics";
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  BarChart, 
  Lightbulb, 
  UserCheck, 
  Trophy,
  Vote,
  Users,
  MapPin,
  Crown,
  Building,
  Star,
  Scale,
  TrendingUp,
  Eye,
  CheckCircle,
  ArrowRight,
  Zap
} from "lucide-react";
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
  { id: 'national', label: 'National', icon: <Crown className="w-4 h-4" /> },
  { id: 'county', label: 'County', icon: <Building className="w-4 h-4" /> },
  { id: 'ward', label: 'Ward', icon: <MapPin className="w-4 h-4" /> },
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

// Modern Candidate Card
const CandidateCard = ({ 
  candidate, 
  onVote, 
  hasVoted, 
  isVotedFor,
  index
}: { 
  candidate: Candidate; 
  onVote: (id: string) => void; 
  hasVoted: boolean; 
  isVotedFor: boolean;
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group"
    >
      <Card className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
        isVotedFor ? 'ring-2 ring-green-500 bg-green-50/50' : 'bg-white'
      }`}>
        {/* Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-60" />
        
        {/* Vote Badge */}
        {isVotedFor && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 right-2 z-10"
          >
            <Badge className="bg-green-500 text-white shadow-lg">
              <CheckCircle className="w-3 h-3 mr-1" />
              Voted
            </Badge>
          </motion.div>
        )}

        <CardContent className="relative pt-6 flex flex-col items-center gap-4 text-center">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center text-xl font-bold text-purple-700 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              {candidate.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
            </div>
            {candidate.votes > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg"
              >
                {candidate.votes}
              </motion.div>
            )}
          </div>

          {/* Candidate Info */}
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-purple-700 transition-colors duration-300">
              {candidate.name}
            </h3>
            <p className="text-sm font-medium text-gray-600">{candidate.party}</p>
            {candidate.county && (
              <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                <MapPin className="w-3 h-3" />
                {candidate.county}
              </div>
            )}
          </div>

          {/* Vote Button */}
          <Button
            onClick={() => onVote(candidate.id)}
            disabled={hasVoted}
            variant={isVotedFor ? "outline" : "default"}
            size="sm"
            className={`w-full transition-all duration-300 ${
              isVotedFor 
                ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' 
                : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {isVotedFor ? (
              <>
                <UserCheck className="mr-2 h-4 w-4" />
                Voted
              </>
            ) : hasVoted ? (
              <>
                <Vote className="mr-2 h-4 w-4" />
                Vote Cast
              </>
            ) : (
              <>
                <Vote className="mr-2 h-4 w-4" />
                Vote
              </>
            )}
          </Button>
        </CardContent>

        {/* Hover Effect */}
        <AnimatePresence>
          {isHovered && !isVotedFor && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 pointer-events-none"
            />
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

// Modern Election Tab Content
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
  const chartData = candidates.map(c => ({ 
    name: c.name.split(' ').slice(0, 2).join(' '), // Shorter names for chart
    votes: c.votes, 
    fill: `var(--color-${c.name.replace(/[^a-zA-Z0-9]/g, '')})` 
  }));
  
  const candidateChartConfig = candidates.reduce((acc, candidate, index) => {
    acc[candidate.name.replace(/[^a-zA-Z0-9]/g, '')] = {
      label: candidate.name,
      color: `hsl(var(--chart-${index + 1}))`,
    };
    return acc;
  }, {} as ChartConfig);

  return (
    <div className="space-y-8">
      {/* Candidates Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Users className="w-5 h-5 text-purple-600" />
                  Candidates
                </CardTitle>
                <CardDescription className="mt-1">
                  Cast your vote for a candidate in the {electionType} race
                </CardDescription>
              </div>
              <Badge variant="outline" className="px-3 py-1">
                {candidates.length} Candidates
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.map((candidate, index) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  onVote={(id) => onVote(electionType, id)}
                  hasVoted={!!votedCandidateId}
                  isVotedFor={votedCandidateId === candidate.id}
                  index={index}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <BarChart className="w-5 h-5 text-green-600" />
                  Live Results
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-2" />
                </CardTitle>
                <CardDescription className="mt-1">
                  Real-time vote tallies for this race
                </CardDescription>
              </div>
              <Badge className="bg-blue-100 text-blue-700 px-3 py-1">
                {totalVotes} Total Votes
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {totalVotes > 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <ChartContainer config={candidateChartConfig} className="min-h-[300px] w-full">
                  <RechartsBarChart data={chartData} accessibilityLayer layout="vertical">
                    <CartesianGrid horizontal={false} />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      tickLine={false} 
                      tickMargin={10} 
                      axisLine={false} 
                      width={120} 
                      interval={0}
                      className="text-sm"
                    />
                    <XAxis type="number" dataKey="votes" hide/>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <Bar dataKey="votes" radius={5}>
                      <LabelList dataKey="votes" position="right" offset={8} className="fill-foreground font-semibold" />
                    </Bar>
                  </RechartsBarChart>
                </ChartContainer>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No votes yet</h3>
                <p className="text-gray-600">Be the first to cast your vote in this race!</p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
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

    // Find the candidate to get their name for analytics
    const candidateList = candidateState[electionType];
    const candidate = candidateList?.find(c => c.id === candidateId);
    
    // Track voting action
    if (candidate) {
      trackVotingAction('cast_vote', candidate.name);
      trackPoliticianView(candidate.name, candidateId);
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
      title: "Vote Cast Successfully!",
      description: "Thank you for participating in the demo vote.",
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

  const totalPresidentialVotes = useMemo(() => 
    candidateState.presidential.reduce((acc, c) => acc + c.votes, 0), 
    [candidateState.presidential]
  );

  // Filter elections based on area selection
  type ElectionTab = { id: string; title: string; data: Candidate[]; icon: React.ReactNode };
  let filteredElections: ElectionTab[] = [];
  
  if (areaTab === 'national') {
    filteredElections = [
      { 
        id: 'presidential', 
        title: 'Presidential', 
        data: candidateState.presidential,
        icon: <Crown className="w-4 h-4" />
      },
    ];
  } else if (areaTab === 'county') {
    filteredElections = [
      { 
        id: 'gubernatorial', 
        title: `Governor (${selectedCounty})`, 
        data: candidateState.gubernatorial.filter((c: Candidate) => c.county === selectedCounty),
        icon: <Building className="w-4 h-4" />
      },
      { 
        id: 'senatorial', 
        title: `Senator (${selectedCounty})`, 
        data: candidateState.senatorial.filter((c: Candidate) => c.county === selectedCounty),
        icon: <Star className="w-4 h-4" />
      },
      { 
        id: 'womenrep', 
        title: `Women Rep (${selectedCounty})`, 
        data: candidateState.womenrep.filter((c: Candidate) => c.county === selectedCounty),
        icon: <Users className="w-4 h-4" />
      },
    ];
  } else if (areaTab === 'ward') {
    filteredElections = [
      { 
        id: 'mca', 
        title: `MCA (${selectedWard})`, 
        data: candidateState.mca.filter((c: Candidate) => c.ward === selectedWard),
        icon: <Scale className="w-4 h-4" />
      },
    ];
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-100 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 bg-clip-text text-transparent mb-3">
              Democratic Voting Simulator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Experience Kenya's electoral process through our interactive demo. Cast your votes and see real-time results with AI-powered predictions.
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Voting Section */}
          <div className="lg:col-span-3 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-2xl">
                        <Vote className="w-6 h-6 text-purple-600" />
                        Voting Interface
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Select your area and participate in the democratic process
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      Live Demo
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Area Selection Tabs */}
                  <Tabs value={areaTab} onValueChange={setAreaTab} className="mb-6">
                    <TabsList className="grid w-full grid-cols-3 h-12 bg-gray-100/80">
                      {AREA_TABS.map(tab => (
                        <TabsTrigger 
                          key={tab.id} 
                          value={tab.id}
                          className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md"
                        >
                          {tab.icon}
                          {tab.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>

                  {/* County/Ward Selection */}
                  <AnimatePresence mode="wait">
                    {areaTab === 'county' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6"
                      >
                        <label className="block mb-2 font-semibold">Select County:</label>
                        <select
                          value={selectedCounty}
                          onChange={e => setSelectedCounty(e.target.value)}
                          className="w-full px-3 py-2 border border-purple-200 rounded-lg bg-white/80 focus:border-purple-400 focus:outline-none"
                        >
                          {COUNTY_LIST.map(county => (
                            <option key={county} value={county}>{county}</option>
                          ))}
                        </select>
                      </motion.div>
                    )}
                    
                    {areaTab === 'ward' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6"
                      >
                        <label className="block mb-2 font-semibold">Select Ward:</label>
                        <select
                          value={selectedWard}
                          onChange={e => setSelectedWard(e.target.value)}
                          className="w-full px-3 py-2 border border-purple-200 rounded-lg bg-white/80 focus:border-purple-400 focus:outline-none"
                        >
                          {WARD_LIST.map(ward => (
                            <option key={ward} value={ward}>{ward}</option>
                          ))}
                        </select>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Election Tabs */}
                  <Tabs defaultValue={filteredElections[0]?.id} className="w-full">
                    <TabsList className={`grid w-full h-auto p-1 bg-gray-100/80`} style={{ gridTemplateColumns: `repeat(${filteredElections.length}, 1fr)` }}>
                      {filteredElections.map((e: ElectionTab) => (
                        <TabsTrigger 
                          key={e.id} 
                          value={e.id}
                          className="flex items-center gap-2 py-2 data-[state=active]:bg-white data-[state=active]:shadow-md"
                        >
                          {e.icon}
                          <span className="hidden sm:inline">{e.title}</span>
                          <span className="sm:hidden">{e.title.split(' ')[0]}</span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    {filteredElections.map((e: ElectionTab) => {
                      const totalVotes = e.data.reduce((sum: number, c: Candidate) => sum + c.votes, 0);
                      return (
                        <TabsContent key={e.id} value={e.id} className="mt-8">
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
            </motion.div>
          </div>

          {/* AI Prediction Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="sticky top-8"
            >
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    AI Prediction
                  </CardTitle>
                  <CardDescription>
                    Based on presidential demo votes, get AI-powered election predictions and analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{totalPresidentialVotes}</div>
                      <div className="text-sm text-gray-600">Total Presidential Votes</div>
                    </div>
                    
                    <Button 
                      onClick={handlePrediction} 
                      disabled={isLoading || totalPresidentialVotes === 0} 
                      className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Lightbulb className="mr-2 h-4 w-4" />
                          Predict Winner
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
                
                <AnimatePresence>
                  {prediction && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <CardFooter className="flex flex-col items-start gap-4 pt-4 border-t">
                        <div className="w-full">
                          <h3 className="font-semibold flex items-center gap-2 mb-2">
                            <Trophy className="w-4 h-4 text-yellow-600" />
                            Predicted Winner
                          </h3>
                          <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                            <p className="font-bold text-lg text-yellow-800">{prediction.predictedWinner}</p>
                          </div>
                        </div>
                        
                        <div className="w-full">
                          <h3 className="font-semibold flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-blue-600" />
                            Key Trends
                          </h3>
                          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-800">{prediction.keyTrends}</p>
                          </div>
                        </div>
                      </CardFooter>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
