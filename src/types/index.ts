import type { AnalyzeVideoVeracityOutput } from "./ai/flows/analyze-video-veracity";

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
  videoUrl: string; // For display
  videoDataUri: string; // For AI analysis
  verifications: number;
  isVerified: boolean;
  aiAnalysis: AnalyzeVideoVeracityOutput | 'loading' | null;
}
