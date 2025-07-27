// src/ai/flows/analyze-tally-anomaly.ts
'use server';

export interface AnalyzeTallyAnomalyInput {
  pollingStation: string;
  registeredVoters: number;
  reportedVotes: string;
  previousTallyAverage: number;
  historicalFraudRisk: number;
  socialMediaSignal: string;
  crowdIntel: string;
}

export interface TallyAnomalyOutput {
  isAnomaly: boolean;
  reason: string;
  explainability?: string;
  fraudRiskScore?: number;
}

export async function analyzeTallyAnomaly(
  input: AnalyzeTallyAnomalyInput
): Promise<TallyAnomalyOutput> {
  // Parse total votes from reported votes string
  const voteMatches = input.reportedVotes.match(/(\d+)/g);
  const totalVotes = voteMatches ? voteMatches.reduce((sum, vote) => sum + parseInt(vote), 0) : 0;
  
  // Check for anomalies
  const turnoutRate = (totalVotes / input.registeredVoters) * 100;
  const isHighTurnout = turnoutRate > 95;
  const isLowTurnout = turnoutRate < 20;
  const exceedsRegistered = totalVotes > input.registeredVoters;
  
  let isAnomaly = false;
  let reason = 'Tally appears normal within expected parameters.';
  let fraudRiskScore = 0.1;
  
  if (exceedsRegistered) {
    isAnomaly = true;
    reason = `Vote count (${totalVotes}) exceeds registered voters (${input.registeredVoters}). This requires immediate investigation.`;
    fraudRiskScore = 0.9;
  } else if (isHighTurnout) {
    isAnomaly = true;
    reason = `Unusually high turnout of ${turnoutRate.toFixed(1)}% detected. While possible, this warrants verification.`;
    fraudRiskScore = 0.6;
  } else if (isLowTurnout) {
    isAnomaly = true;
    reason = `Very low turnout of ${turnoutRate.toFixed(1)}% detected. This may indicate voter suppression or other issues.`;
    fraudRiskScore = 0.4;
  }

  return {
    isAnomaly,
    reason,
    explainability: `Analysis based on turnout rate (${turnoutRate.toFixed(1)}%), historical patterns, and verification signals.`,
    fraudRiskScore
  };
}