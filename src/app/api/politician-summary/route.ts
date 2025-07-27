import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { politician } = await req.json();

    if (!politician) {
      return NextResponse.json({ error: 'Politician data required' }, { status: 400 });
    }

    // Generate summary
    const summary = `${politician.name} is a ${politician.level} politician from ${politician.party}${politician.county ? ` representing ${politician.county}` : ''}. 

Track Record: ${politician.name} has maintained ${politician.trackRecord.promisesKept.length} fulfilled promises including ${politician.trackRecord.promisesKept.slice(0, 2).join(' and ')}. However, there are ${politician.trackRecord.promisesBroken.length} unfulfilled commitments.

Key Contributions: Notable achievements include ${politician.trackRecord.contributions.slice(0, 2).join(' and ')}.

Legal Standing: ${politician.legalOversight.hasAdverseFindings ? 'Has adverse legal findings' : 'No major legal issues reported'}.

Academic Background: Educated at ${politician.academicLife.university} with notable achievements in ${politician.academicLife.notableAchievements?.[0] || 'academic excellence'}.`;

    return NextResponse.json({
      success: true,
      data: { summary }
    });
  } catch (error) {
    console.error('Politician summary error:', error);
    return NextResponse.json({ error: 'Summary generation failed' }, { status: 500 });
  }
}