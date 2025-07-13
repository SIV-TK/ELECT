import type { AnalyzeIntelVeracityOutput } from "@/ai/flows/analyze-intel-veracity";
import type { TallyAnomalyOutput } from "@/ai/flows/analyze-tally-anomaly";

export interface Politician {
  id: string;
  name: string;
  party: string;
  level: 'Presidential' | 'Gubernatorial' | 'Senatorial' | 'MP';
  county?: string;
  constituency?: string;
  imageUrl: string;
  bio: string;
  trackRecord: {
    workHistory: string[];
    promisesKept: string[];
    promisesBroken: string[];
    contributions: string[];
  };
  legalOversight: {
    courtCases: string[];
    hasAdverseFindings: boolean;
  };
  academicLife: {
    primarySchool: string;
    highSchool: string;
    university: string;
    notableAchievements: string[];
  };
}

export interface Candidate extends Omit<Politician, 'trackRecord' | 'legalOversight' | 'academicLife'> {
  votes: number;
}

export interface CrowdIntel {
  id: string;
  politician: Politician;
  description: string;
  file: {
    url: string; // For display
    type: string;
    name: string;
  };
  dataUri: string; // For AI analysis
  verifications: number;
  isVerified: boolean;
  aiAnalysis: AnalyzeIntelVeracityOutput | 'loading' | null;
  blockchainTransactionId: string;
  storageHash: string;
}

export interface LiveTally {
  id: string;
  officerId: string;
  pollingStation: string;
  registeredVoters: number;
  voteDistribution: { id: string; votes: number }[];
  timestamp: Date;
  verifications: number;
  county: string;
  subCounty: string;
  ward: string;
}

export type TallyAnalysisState = {
  status: 'loading' | 'complete' | 'error';
  result?: TallyAnomalyOutput;
};
