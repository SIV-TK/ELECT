import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
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
    const body = await request.json();
    const { idToken } = body;
    
    // Also check for token in cookies or headers as fallback
    const cookieStore = cookies();
    const authToken = idToken || 
                     cookieStore.get('firebase-auth-token')?.value || 
                     cookieStore.get('auth-token')?.value ||
                     request.headers.get('authorization')?.replace('Bearer ', '');

    if (!authToken) {
      return NextResponse.json(
        { error: 'No authentication token provided' },
        { status: 401 }
      );
    }

    // Verify the Firebase ID token
    const decodedToken = await adminAuth.verifyIdToken(authToken);
    
    if (!decodedToken) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // Get user record for additional info
    const userRecord = await adminAuth.getUser(decodedToken.uid);

    // Check if session exists and is valid
    const sessionCookie = cookieStore.get('user-session')?.value;
    let sessionData: UserSession | null = null;

    if (sessionCookie) {
      try {
        sessionData = JSON.parse(decodeURIComponent(sessionCookie));
        
        // Check if session has expired
        if (sessionData && sessionData.expires && Date.now() > sessionData.expires) {
          return NextResponse.json(
            { error: 'Session expired' },
            { status: 401 }
          );
        }
      } catch (error) {
        console.error('Invalid session data:', error);
        return NextResponse.json(
          { error: 'Invalid session data' },
          { status: 401 }
        );
      }
    }

    // Create or update session data
    const updatedSession: UserSession = {
      uid: decodedToken.uid,
      email: decodedToken.email || userRecord.email || '',
      displayName: decodedToken.name || userRecord.displayName || undefined,
      photoURL: decodedToken.picture || userRecord.photoURL || undefined,
      emailVerified: decodedToken.email_verified || userRecord.emailVerified,
      expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      lastActivity: Date.now(),
      role: decodedToken.role || sessionData?.role || 'user',
      permissions: decodedToken.permissions || sessionData?.permissions || ['read', 'write']
    };

    // Set updated session cookie
    const response = NextResponse.json({
      success: true,
      user: {
        uid: updatedSession.uid,
        email: updatedSession.email,
        displayName: updatedSession.displayName,
        photoURL: updatedSession.photoURL,
        emailVerified: updatedSession.emailVerified,
        role: updatedSession.role,
        permissions: updatedSession.permissions
      },
      session: {
        expires: updatedSession.expires,
        lastActivity: updatedSession.lastActivity
      }
    });

    // Set secure session cookie
    response.cookies.set('user-session', encodeURIComponent(JSON.stringify(updatedSession)), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Auth verification error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('expired')) {
        return NextResponse.json(
          { error: 'Token expired', code: 'TOKEN_EXPIRED' },
          { status: 401 }
        );
      }
      if (error.message.includes('invalid')) {
        return NextResponse.json(
          { error: 'Invalid token', code: 'INVALID_TOKEN' },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Authentication failed', code: 'AUTH_FAILED' },
      { status: 401 }
    );
  }
}

// GET endpoint to check current session status
export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('user-session')?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { authenticated: false, error: 'No session found' },
        { status: 200 }
      );
    }

    const sessionData: UserSession = JSON.parse(decodeURIComponent(sessionCookie));
    const now = Date.now();

    // Check if session has expired
    if (sessionData.expires && now > sessionData.expires) {
      return NextResponse.json(
        { authenticated: false, error: 'Session expired' },
        { status: 200 }
      );
    }

    // Return session info (without sensitive data)
    return NextResponse.json({
      authenticated: true,
      user: {
        uid: sessionData.uid,
        email: sessionData.email,
        displayName: sessionData.displayName,
        photoURL: sessionData.photoURL,
        emailVerified: sessionData.emailVerified,
        role: sessionData.role,
        permissions: sessionData.permissions
      },
      session: {
        expires: sessionData.expires,
        lastActivity: sessionData.lastActivity,
        timeUntilExpiry: sessionData.expires - now
      }
    });

  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { authenticated: false, error: 'Invalid session data' },
      { status: 200 }
    );
  }
}

// DELETE endpoint to logout and clear session
export async function DELETE(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    // Clear all auth-related cookies
    response.cookies.delete('user-session');
    response.cookies.delete('firebase-auth-token');
    response.cookies.delete('auth-token');

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}