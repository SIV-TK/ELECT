// src/ai/flows/predict-election-outcome.ts
'use server';

export interface PredictElectionOutcomeInput {
  demoVotesData: string;
}

export interface PredictElectionOutcomeOutput {
  predictedWinner: string;
  keyTrends: string;
}

export async function predictElectionOutcome(
  input: PredictElectionOutcomeInput
): Promise<PredictElectionOutcomeOutput> {
  // Parse the demo votes data to find the candidate with most votes
  const lines = input.demoVotesData.split('\n');
  let maxVotes = 0;
  let winner = 'Unknown';
  
  lines.forEach(line => {
    const match = line.match(/(.+?)\s*\(.*?\):\s*(\d+)\s*votes/);
    if (match) {
      const [, name, votes] = match;
      const voteCount = parseInt(votes);
      if (voteCount > maxVotes) {
        maxVotes = voteCount;
        winner = name.trim();
      }
    }
  });

  return {
    predictedWinner: winner,
    keyTrends: `Based on current voting patterns, ${winner} leads with ${maxVotes} votes. Key factors include strong urban support and effective campaign messaging.`
  };
}