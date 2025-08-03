import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/admin',
  '/profile',
  '/settings',
  '/test-auth'
];

// Define API routes that should remain completely public (AI, scraping, etc.)
const publicApiRoutes = [
  '/api/health',
  '/api/test',
  '/api/auth',
  '/api/analyze-sentiment',    // Keep AI services public
  '/api/fact-check',          // Keep AI services public
  '/api/analyze-bias',        // Keep AI services public
  '/api/scraper-health',      // Keep scraping public
  '/api/campaign-advice',     // Keep AI services public
  '/api/ai-chat-multilang',   // Keep AI services public
  '/api/integrated-ai',       // Keep AI services public
  '/api/policy-comparison',   // Keep AI services public
  '/api/political-timeline',  // Keep AI services public
  '/api/constitution',        // Keep AI services public
  '/api/voter-education',     // Keep public for accessibility
  '/api/voter-registration'   // Keep public for accessibility
];

// Define API routes that need authentication (sensitive operations only)
const protectedApiRoutes = [
  '/api/admin',              // Admin operations only
  '/api/user-profile',       // User data operations only
  '/api/user-settings'       // User settings only
];

// Define public page routes (no authentication needed)
const publicPageRoutes = [
  '/',
  '/login',
  '/signup',
  '/about',
  '/sentiment-analysis',     // Keep public for demo
  '/fact-check',            // Keep public for transparency
  '/media-bias',            // Keep public for transparency
  '/constitution',          // Keep public for education
  '/voter-education',       // Keep public for education
  '/voter-registration',    // Keep public for civic participation
  '/campaign-advice',       // Keep public for transparency
  '/constituency-map',      // Keep public for information
  '/verification-gallery',  // Keep public for transparency
  '/interactive-visualizations', // Keep public for engagement
  '/crowd-sourced-intel',   // Keep public for participation
  '/influence-network',     // Keep public for transparency
  '/corruption-risk',       // Keep public for transparency
  '/live-tally',           // Keep public for transparency
  '/demo-voting',          // Keep public for demo
  '/ai-features-demo'      // Keep public for demo
];

function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => pathname.startsWith(route)) ||
         protectedApiRoutes.some(route => pathname.startsWith(route));
}

function isPublicRoute(pathname: string): boolean {
  return publicPageRoutes.some(route => pathname.startsWith(route)) ||
         publicApiRoutes.some(route => pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/_next/') ||
    pathname.includes('.') && !pathname.includes('/api/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/manifest.json') ||
    pathname.startsWith('/icon-')
  ) {
    return NextResponse.next();
  }

  // Allow all public routes (including ALL AI and scraping APIs)
  if (isPublicRoute(pathname)) {
    return addSecurityHeaders(NextResponse.next());
  }

  // Check authentication only for truly protected routes
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
            message: 'This protected resource requires authentication'
          }),
          { 
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      return NextResponse.redirect(loginUrl);
    }
  }

  // Default: allow with security headers
  return addSecurityHeaders(NextResponse.next());
}

/**
 * Add basic security headers
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.[^/]*$).*)',
  ],
};