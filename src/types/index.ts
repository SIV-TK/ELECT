import type { AnalyzeIntelVeracityOutput } from "@/ai/flows/analyze-intel-veracity";
import type { TallyAnomalyOutput } from "@/ai/flows/analyze-tally-anomaly";

export interface Politician {
  id: string;
  name: string;
  party: string;
  level: 'Presidential' | 'Gubernatorial' | 'Senatorial' | 'WomenRep' | 'MP' | 'MCA';
  county?: string;
  constituency?: string;
  ward?: string;
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
  formUrl?: string; // Optional URL to the form image
}

export type TallyAnalysisState = {
  status: 'loading' | 'complete' | 'error';
  result?: TallyAnomalyOutput;
};

export const pollingStations = [
  { name: "KICC", registeredVoters: 2500, county: "Nairobi", subCounty: "Starehe", ward: "Nairobi Central" },
  { name: "Moi Avenue Primary", registeredVoters: 1800, county: "Mombasa", subCounty: "Mvita", ward: "Mji wa Kale" },
  { name: "Kisumu Social Hall", registeredVoters: 2200, county: "Kisumu", subCounty: "Kisumu Central", ward: "Market Milimani" },
  { name: "Eldoret Town Hall", registeredVoters: 2800, county: "Uasin Gishu", subCounty: "Kapseret", ward: "Kapseret" },
  { name: "Nyeri Primary", registeredVoters: 1500, county: "Nyeri", subCounty: "Nyeri Town", ward: "Kiganjo/Mathari" },
  { name: "Uhuru Park", registeredVoters: 3500, county: "Nairobi", subCounty: "Starehe", ward: "Nairobi Central" },
  { name: "Likoni Ferry", registeredVoters: 2100, county: "Mombasa", subCounty: "Likoni", ward: "Likoni" },
  { name: "Jomo Kenyatta Grounds", registeredVoters: 2600, county: "Kisumu", subCounty: "Kisumu Central", ward: "Shaurimoyo" },
];
