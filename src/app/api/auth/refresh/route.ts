import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

interface UserSession {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
  expires: number;
  lastActivity: number;
  role?: string;
  permissions?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('user-session')?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401 }
      );
    }

    let sessionData: UserSession;
    try {
      sessionData = JSON.parse(decodeURIComponent(sessionCookie));
    } catch (error) {
      console.error('Invalid session data:', error);
      return NextResponse.json(
        { error: 'Invalid session data' },
        { status: 401 }
      );
    }

    const now = Date.now();
    
    // Check if session has expired (no refresh for expired sessions)
    if (sessionData.expires && now > sessionData.expires) {
      return NextResponse.json(
        { error: 'Session expired, please login again' },
        { status: 401 }
      );
    }

    // Check if session is eligible for refresh (refresh if less than 2 hours remaining)
    const timeUntilExpiry = sessionData.expires - now;
    const twoHours = 2 * 60 * 60 * 1000;
    
    if (timeUntilExpiry > twoHours) {
      // No refresh needed yet
      return NextResponse.json({
        success: true,
        message: 'Session still valid, no refresh needed',
        timeUntilExpiry,
        nextRefreshEligible: now + (twoHours - timeUntilExpiry)
      });
    }

    // Refresh the session
    const refreshedSession: UserSession = {
      ...sessionData,
      expires: now + 24 * 60 * 60 * 1000, // Extend by 24 hours
      lastActivity: now
    };

    const response = NextResponse.json({
      success: true,
      message: 'Session refreshed successfully',
      session: {
        expires: refreshedSession.expires,
        lastActivity: refreshedSession.lastActivity,
        timeUntilExpiry: refreshedSession.expires - now
      }
    });

    // Set refreshed session cookie
    response.cookies.set('user-session', encodeURIComponent(JSON.stringify(refreshedSession)), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Session refresh error:', error);
    return NextResponse.json(
      { error: 'Session refresh failed' },
      { status: 500 }
    );
  }
}

// GET endpoint to check if session needs refresh
export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('user-session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({
        needsRefresh: false,
        error: 'No session found'
      });
    }

    const sessionData: UserSession = JSON.parse(decodeURIComponent(sessionCookie));
    const now = Date.now();

    // Check if session has expired
    if (sessionData.expires && now > sessionData.expires) {
      return NextResponse.json({
        needsRefresh: false,
        expired: true,
        error: 'Session expired'
      });
    }

    const timeUntilExpiry = sessionData.expires - now;
    const twoHours = 2 * 60 * 60 * 1000;
    const needsRefresh = timeUntilExpiry <= twoHours;

    return NextResponse.json({
      needsRefresh,
      timeUntilExpiry,
      expires: sessionData.expires,
      lastActivity: sessionData.lastActivity,
      hoursUntilExpiry: Math.round(timeUntilExpiry / (60 * 60 * 1000))
    });

  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({
      needsRefresh: false,
      error: 'Session check failed'
    });
  }
}
