import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const stats = {
      totalModules: Math.floor(Math.random() * 3) + 6,
      activeQuizzes: Math.floor(Math.random() * 5) + 22,
      totalDuration: (Math.random() * 0.5 + 2.5).toFixed(1),
      successRate: Math.floor(Math.random() * 8) + 92,
      activeUsers: Math.floor(Math.random() * 500) + 1200,
      completedCourses: Math.floor(Math.random() * 100) + 450
    };
    
    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}