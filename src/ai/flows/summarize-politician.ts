// src/ai/flows/summarize-politician.ts
'use server';

import type { Politician } from '@/types';

export interface SummarizePoliticianOutput {
  summary: string;
}

export async function summarizePolitician(
  politician: Politician
): Promise<SummarizePoliticianOutput> {
  // Generate a comprehensive summary of the politician
  const summary = `
${politician.name} is a ${politician.level.toLowerCase()} politician representing ${politician.party}${politician.county ? ` in ${politician.county} County` : ''}. 

**Background**: ${politician.bio}

**Track Record**: 
- Work History: ${politician.trackRecord.workHistory.join(', ')}
- Promises Kept: ${politician.trackRecord.promisesKept.length} major commitments fulfilled
- Key Contributions: ${politician.trackRecord.contributions.slice(0, 2).join(', ')}

**Education**: Attended ${politician.academicLife.university} after completing studies at ${politician.academicLife.highSchool}.

**Legal Standing**: ${politician.legalOversight.hasAdverseFindings ? 'Has been associated with legal proceedings' : 'No major legal issues reported'}.

This analysis is based on publicly available information and political records.
  `.trim();

  return { summary };
}