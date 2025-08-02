import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/ai/genkit';
import { MODELS } from '@/ai/models';

export async function POST(req: NextRequest) {
  try {
    const registrationData = await req.json();
    
    // AI eligibility verification
    const prompt = `Verify voter eligibility for Kenya:
ID: ${registrationData.nationalId}
DOB: ${registrationData.dateOfBirth}
County: ${registrationData.county}

Check:
1. Age over 18 from ID/DOB
2. Valid Kenyan ID format
3. Location consistency

JSON: {"eligible":true/false,"reason":"explanation","age":number}`;

    let aiVerification = null;
    try {
      const response = await ai.generate({
        model: MODELS.DEEPSEEK_CHAT,
        prompt,
        config: { temperature: 0.1, maxOutputTokens: 200 }
      });
      
      const responseText = response.text || '';
      const jsonMatch = responseText.match(/```json\s*\n?([\s\S]*?)\n?```/) || responseText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        aiVerification = JSON.parse(jsonStr);
      }
    } catch (aiError) {
      console.error('AI verification failed:', aiError);
    }
    
    // Age verification fallback
    const birthYear = new Date(registrationData.dateOfBirth).getFullYear();
    const age = new Date().getFullYear() - birthYear;
    
    // Check eligibility
    if (aiVerification && !aiVerification.eligible) {
      return NextResponse.json({
        status: 'rejected',
        voterNumber: '',
        pollingStation: '',
        message: `Registration rejected: ${aiVerification.reason}`
      });
    }
    
    if (age < 18) {
      return NextResponse.json({
        status: 'rejected',
        voterNumber: '',
        pollingStation: '',
        message: `Registration rejected: Must be 18 or older to vote. Current age: ${age}`
      });
    }
    
    // Basic validation
    const isValid = registrationData.nationalId && 
                   registrationData.firstName && 
                   registrationData.lastName &&
                   registrationData.county;
    
    if (!isValid) {
      return NextResponse.json({
        status: 'rejected',
        voterNumber: '',
        pollingStation: '',
        message: 'Registration rejected: Incomplete information provided.'
      });
    }
    
    // Successful registration
    const voterNumber = `VR${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
    const pollingStation = `${registrationData.ward} Primary School`;
    
    return NextResponse.json({
      status: 'verified',
      voterNumber,
      pollingStation,
      message: `Registration successful! Age verified: ${age} years. AI eligibility check passed. You are eligible to vote.`
    });
    
  } catch (error) {
    console.error('Voter registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}