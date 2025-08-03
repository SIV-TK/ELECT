import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'success',
    message: 'API is working correctly',
    timestamp: new Date().toISOString(),
    method: 'GET',
    path: '/api/test'
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({
      status: 'success',
      message: 'POST request processed successfully',
      timestamp: new Date().toISOString(),
      method: 'POST',
      path: '/api/test',
      receivedData: body
    });
  } catch (error) {
    return NextResponse.json({
      status: 'success',
      message: 'POST request received (no JSON body)',
      timestamp: new Date().toISOString(),
      method: 'POST',
      path: '/api/test'
    });
  }
}
