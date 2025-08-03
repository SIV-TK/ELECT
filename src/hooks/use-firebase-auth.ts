import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthStore } from './use-auth-store';

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

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionValid, setSessionValid] = useState(true);
  const { login, logout } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
      
      if (user) {
        // Create or update user session
        await createUserSession(user);
        login({ fullName: user.displayName || user.email?.split('@')[0] || 'User' });
      } else {
        // Clear session when user logs out
        clearUserSession();
        logout();
      }
    });

    // Check session validity on mount
    checkSessionValidity();

    return () => unsubscribe();
  }, [login, logout]);

  const createUserSession = async (user: User) => {
    try {
      // Get Firebase ID token
      const idToken = await user.getIdToken();
      
      // Create session data
      const sessionData: UserSession = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || undefined,
        photoURL: user.photoURL || undefined,
        emailVerified: user.emailVerified,
        expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        lastActivity: Date.now(),
        role: 'user', // Default role - can be enhanced with custom claims
        permissions: ['read', 'write'] // Default permissions
      };

      // Set secure cookies
      setCookie('firebase-auth-token', idToken, 24 * 60 * 60); // 24 hours
      setCookie('user-session', encodeURIComponent(JSON.stringify(sessionData)), 24 * 60 * 60);
      
      setSessionValid(true);
    } catch (error) {
      console.error('Failed to create user session:', error);
      setSessionValid(false);
    }
  };

  const checkSessionValidity = () => {
    const sessionData = getCookie('user-session');
    const authToken = getCookie('firebase-auth-token');

    if (!sessionData || !authToken) {
      setSessionValid(false);
      return;
    }

    try {
      const session: UserSession = JSON.parse(decodeURIComponent(sessionData));
      const now = Date.now();

      // Check if session has expired
      if (session.expires && now > session.expires) {
        clearUserSession();
        setSessionValid(false);
        handleSignOut();
        return;
      }

      // Session is valid
      setSessionValid(true);

      // Update last activity if needed (every 5 minutes)
      if (now - session.lastActivity > 5 * 60 * 1000) {
        const updatedSession = {
          ...session,
          lastActivity: now
        };
        setCookie('user-session', encodeURIComponent(JSON.stringify(updatedSession)), 24 * 60 * 60);
      }
    } catch (error) {
      console.error('Invalid session data:', error);
      clearUserSession();
      setSessionValid(false);
    }
  };

  const clearUserSession = () => {
    // Clear all auth-related cookies
    document.cookie = 'firebase-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; secure; samesite=strict';
    document.cookie = 'user-session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; secure; samesite=strict';
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; secure; samesite=strict';
  };

  const setCookie = (name: string, value: string, maxAge: number) => {
    if (typeof document === 'undefined') return;
    const secure = process.env.NODE_ENV === 'production' ? 'secure; ' : '';
    document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; ${secure}samesite=strict; httponly`;
  };

  const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  const handleSignOut = async () => {
    try {
      // Clear session first
      clearUserSession();
      
      // Sign out from Firebase
      await signOut(auth);
      
      setSessionValid(false);
      
      // Force redirect to login
      window.location.href = '/login';
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if Firebase signout fails, clear local session
      clearUserSession();
      setSessionValid(false);
      window.location.href = '/login';
    }
  };

  const refreshSession = async () => {
    if (user) {
      await createUserSession(user);
    }
  };

  const getUserSession = (): UserSession | null => {
    const sessionData = getCookie('user-session');
    if (sessionData) {
      try {
        return JSON.parse(decodeURIComponent(sessionData));
      } catch (error) {
        console.error('Failed to parse session data:', error);
        return null;
      }
    }
    return null;
  };

  return { 
    user, 
    loading, 
    sessionValid,
    signOut: handleSignOut,
    refreshSession,
    getUserSession
  };
}