import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/sentiment-analysis',
  '/fact-check',
  '/media-bias',
  '/live-tally',
  '/constitution',
  '/voter-education',
  '/voter-registration',
  '/campaign-advice',
  '/constituency-map',
  '/influence-network',
  '/verification-gallery',
  '/profile',
  '/settings',
  '/politicians',
  '/test-auth',
  '/admin'
];

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/about',
  '/api/auth',
  '/api/health',
  '/api/scraper-health',
  '/_next',
  '/favicon.ico',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Define API routes that require authentication
const protectedApiRoutes = [
  '/api/ai-chat-multilang',
  '/api/ai-dashboards',
  '/api/analyze-bias',
  '/api/analyze-sentiment',
  '/api/campaign-advice',
  '/api/constitution',
  '/api/corruption-risk',
  '/api/county-analysis',
  '/api/crisis-early-warning',
  '/api/fact-check',
  '/api/integrated-ai',
  '/api/policy-comparison',
  '/api/political-timeline',
  '/api/predict-vote-distribution',
  '/api/predictive-heatmaps',
  '/api/realtime-sentiment',
  '/api/realtime',
  '/api/scraper-health',
  '/api/voter-education',
  '/api/voter-registration'
];

function isProtectedRoute(pathname: string): boolean {
  // Check if it's a protected page route
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    return true;
  }
  
  // Check if it's a protected API route
  if (protectedApiRoutes.some(route => pathname.startsWith(route))) {
    return true;
  }
  
  return false;
}

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  
  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/_next/') ||
    pathname.includes('.') && !pathname.includes('/api/')
  ) {
    return NextResponse.next();
  }

  // CSRF Protection for non-GET requests (relaxed for public APIs)
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const referer = request.headers.get('referer');
    const csrfToken = request.headers.get('x-csrf-token') || request.headers.get('x-requested-with');
    const userAgent = request.headers.get('user-agent');
    
    // Allow requests from curl, postman, and other API tools
    const isApiTool = userAgent && (
      userAgent.includes('curl') || 
      userAgent.includes('Postman') || 
      userAgent.includes('HTTPie') ||
      userAgent.includes('node-fetch') ||
      userAgent.includes('axios')
    );
    
    // Skip CSRF for public API endpoints and tools
    const isPublicApiEndpoint = pathname.startsWith('/api/health') || 
                               pathname.startsWith('/api/auth') ||
                               pathname.startsWith('/api/scraper-health');
    
    if (!isPublicApiEndpoint && !isApiTool) {
      // Check if the request comes from the same origin or has CSRF token
      if (referer) {
        const refererUrl = new URL(referer);
        if (refererUrl.origin !== origin && !csrfToken) {
          return new NextResponse(
            JSON.stringify({ 
              error: 'CSRF protection failed',
              message: 'Request blocked by CSRF protection' 
            }),
            { 
              status: 403,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }
      }
      
      // For protected API routes, ensure XMLHttpRequest header or CSRF token
      if (pathname.startsWith('/api/') && !csrfToken && !request.headers.get('x-requested-with')) {
        // Only enforce for truly protected routes, not public ones
        if (protectedApiRoutes.some(route => pathname.startsWith(route))) {
          return new NextResponse(
            JSON.stringify({ 
              error: 'CSRF protection required',
              message: 'Protected API requests must include CSRF protection headers' 
            }),
            { 
              status: 403,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }
      }
    }
  }

  // Skip public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Check for authentication on protected routes
  if (isProtectedRoute(pathname)) {
    const authToken = request.cookies.get('firebase-auth-token')?.value || 
                     request.cookies.get('auth-token')?.value ||
                     request.headers.get('authorization')?.replace('Bearer ', '');
    
    const userSession = request.cookies.get('user-session')?.value;
    
    if (!authToken && !userSession) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      
      // For API routes, return 401 instead of redirect
      if (pathname.startsWith('/api/')) {
        return new NextResponse(
          JSON.stringify({ 
            error: 'Authentication required',
            message: 'You must be logged in to access this resource',
            redirectTo: '/login'
          }),
          { 
            status: 401,
            headers: {
              'Content-Type': 'application/json',
              'WWW-Authenticate': 'Bearer'
            }
          }
        );
      }
      
      return NextResponse.redirect(loginUrl);
    }
    
    // Validate session for additional security
    if (userSession) {
      try {
        const sessionData = JSON.parse(decodeURIComponent(userSession));
        const now = Date.now();
        
        // Check if session has expired
        if (sessionData.expires && now > sessionData.expires) {
          const loginUrl = new URL('/login', request.url);
          loginUrl.searchParams.set('redirect', pathname);
          loginUrl.searchParams.set('reason', 'session-expired');
          
          if (pathname.startsWith('/api/')) {
            return new NextResponse(
              JSON.stringify({ 
                error: 'Session expired',
                message: 'Your session has expired. Please login again.',
                redirectTo: '/login'
              }),
              { 
                status: 401,
                headers: { 'Content-Type': 'application/json' }
              }
            );
          }
          
          return NextResponse.redirect(loginUrl);
        }
        
        // Auto-refresh session if it's expiring soon (less than 2 hours)
        const twoHours = 2 * 60 * 60 * 1000;
        if (sessionData.expires - now < twoHours) {
          const refreshedSession = {
            ...sessionData,
            expires: now + 24 * 60 * 60 * 1000, // Extend by 24 hours
            lastActivity: now
          };
          
          const response = NextResponse.next();
          response.cookies.set('user-session', encodeURIComponent(JSON.stringify(refreshedSession)), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60,
            path: '/'
          });
          
          // Add security headers
          response.headers.set('X-Frame-Options', 'DENY');
          response.headers.set('X-Content-Type-Options', 'nosniff');
          response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
          response.headers.set('X-XSS-Protection', '1; mode=block');
          
          return response;
        }
        
      } catch (error) {
        console.error('Session validation error:', error);
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  // Add security headers to all responses
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     * - api/health (health check endpoints)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|public|api/health).*)',
  ],
};