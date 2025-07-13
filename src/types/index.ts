export interface Politician {
  id: string;
  name: string;
  party: string;
  level: 'Presidential' | 'Gubernatorial' | 'Senatorial' | 'MP';
  county?: string;
  constituency?: string;
  imageUrl: string;
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
}

export interface Candidate extends Omit<Politician, 'trackRecord' | 'legalOversight'> {
  votes: number;
}
