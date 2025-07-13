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
