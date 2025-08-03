"use client";

import { useFirebaseAuth } from '@/hooks/use-firebase-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, User, AlertCircle } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
  requiredRole?: string;
  requiredPermissions?: string[];
}

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

export function AuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/login',
  fallback,
  requiredRole,
  requiredPermissions = []
}: AuthGuardProps) {
  const { user, loading } = useFirebaseAuth();
  const router = useRouter();
  const [sessionValid, setSessionValid] = useState<boolean | null>(null);
  const [userSession, setUserSession] = useState<UserSession | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!user && requireAuth) {
        const currentPath = window.location.pathname;
        router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
      } else if (user) {
        validateSession();
      }
    }
  }, [user, loading, router, requireAuth, redirectTo]);

  const validateSession = async () => {
    try {
      // Check session data
      const sessionData = getCookie('user-session');
      
      if (sessionData) {
        const session: UserSession = JSON.parse(decodeURIComponent(sessionData));
        const now = Date.now();

        // Check if session has expired
        if (session.expires && now > session.expires) {
          clearAuthCookies();
          setSessionValid(false);
          if (requireAuth) {
            router.push(redirectTo);
          }
          return;
        }

        // Check role and permissions
        if (requiredRole && session.role !== requiredRole) {
          setSessionValid(false);
          return;
        }

        if (requiredPermissions.length > 0) {
          const hasPermissions = requiredPermissions.every(
            permission => session.permissions?.includes(permission)
          );
          if (!hasPermissions) {
            setSessionValid(false);
            return;
          }
        }

        setUserSession(session);
        setSessionValid(true);

        // Update last activity
        if (now - session.lastActivity > 5 * 60 * 1000) { // Update every 5 minutes
          const updatedSession = {
            ...session,
            lastActivity: now
          };
          setCookie('user-session', encodeURIComponent(JSON.stringify(updatedSession)), 24 * 60 * 60);
        }
      } else if (user) {
        // Create new session from Firebase user
        const newSession: UserSession = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || undefined,
          photoURL: user.photoURL || undefined,
          emailVerified: user.emailVerified,
          expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
          lastActivity: Date.now(),
          role: 'user', // Default role
          permissions: ['read'] // Default permissions
        };

        setCookie('user-session', encodeURIComponent(JSON.stringify(newSession)), 24 * 60 * 60);
        setUserSession(newSession);
        setSessionValid(true);
      }
    } catch (error) {
      console.error('Session validation failed:', error);
      setSessionValid(false);
      clearAuthCookies();
    }
  };

  const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  const setCookie = (name: string, value: string, maxAge: number) => {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; secure; samesite=strict`;
  };

  const clearAuthCookies = () => {
    if (typeof document === 'undefined') return;
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'firebase-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'user-session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  };

  // Show loading state
  if (loading || (requireAuth && sessionValid === null)) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Authenticating...</h2>
          <p className="text-gray-500">Verifying your session</p>
        </motion.div>
      </div>
    );
  }

  // Show unauthorized state for missing permissions/role
  if (requireAuth && user && sessionValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl"
        >
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Insufficient Permissions</h2>
          <p className="text-gray-600 mb-6">
            You don't have the required permissions to access this resource.
            {requiredRole && ` Required role: ${requiredRole}`}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/dashboard')}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-200"
          >
            Go to Dashboard
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Show login required state
  if (requireAuth && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to access this page. Please sign in to continue.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push(redirectTo)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Sign In
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Render children if authenticated and authorized
  return <>{children}</>;
}