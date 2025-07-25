import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const registrationData = await req.json();
    
    // Simulate registration processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock verification logic
    const isValid = registrationData.nationalId && 
                   registrationData.firstName && 
                   registrationData.lastName &&
                   registrationData.county;
    
    const statuses = ['verified', 'pending', 'rejected'];
    const status = isValid ? statuses[Math.floor(Math.random() * 2)] : 'rejected';
    
    const result = {
      status,
      voterNumber: status === 'verified' ? `VR${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}` : '',
      pollingStation: status === 'verified' ? `${registrationData.ward} Primary School` : '',
      message: status === 'verified' 
        ? 'Your voter registration has been successfully verified. You can now participate in elections.'
        : status === 'pending'
        ? 'Your registration is being processed. You will receive an SMS notification once verified.'
        : 'Registration could not be completed. Please verify your information and try again.'
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Voter registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}