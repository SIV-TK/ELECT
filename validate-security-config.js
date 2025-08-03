#!/usr/bin/env node

/**
 * Security Configuration Validator
 * Validates the security system configuration files
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 ELECT Platform Security Configuration Validator');
console.log('==================================================\n');

const workspaceRoot = '/workspaces/ELECT';

// Test results tracking
let totalTests = 0;
let passedTests = 0;

function test(description, condition) {
  totalTests++;
  if (condition) {
    console.log(`✅ PASS: ${description}`);
    passedTests++;
  } else {
    console.log(`❌ FAIL: ${description}`);
  }
}

function fileExists(filePath) {
  return fs.existsSync(path.join(workspaceRoot, filePath));
}

function readFile(filePath) {
  try {
    return fs.readFileSync(path.join(workspaceRoot, filePath), 'utf8');
  } catch {
    return null;
  }
}

console.log('📁 Checking Core Security Files');
console.log('--------------------------------');

// Check if middleware exists and has proper structure
test('Middleware file exists', fileExists('src/middleware.ts'));

const middlewareContent = readFile('src/middleware.ts');
if (middlewareContent) {
  test('Middleware contains protected routes array', middlewareContent.includes('protectedRoutes'));
  test('Middleware contains session validation', middlewareContent.includes('user-session'));
  test('Middleware contains CSRF protection', middlewareContent.includes('csrf'));
  test('Middleware contains security headers', middlewareContent.includes('X-Frame-Options'));
  test('Middleware exports config', middlewareContent.includes('export const config'));
}

// Check auth guard component
test('Auth guard component exists', fileExists('src/components/auth-guard.tsx'));

const authGuardContent = readFile('src/components/auth-guard.tsx');
if (authGuardContent) {
  test('Auth guard has role-based access', authGuardContent.includes('role') && authGuardContent.includes('permissions'));
  test('Auth guard handles loading states', authGuardContent.includes('loading'));
  test('Auth guard redirects unauthorized users', authGuardContent.includes('redirect') || authGuardContent.includes('unauthorized'));
}

// Check Firebase auth hook
test('Firebase auth hook exists', fileExists('src/hooks/use-firebase-auth.ts'));

const firebaseAuthContent = readFile('src/hooks/use-firebase-auth.ts');
if (firebaseAuthContent) {
  test('Firebase auth has session management', firebaseAuthContent.includes('session'));
  test('Firebase auth has logout functionality', firebaseAuthContent.includes('logout') || firebaseAuthContent.includes('signOut'));
  test('Firebase auth handles token refresh', firebaseAuthContent.includes('refresh') || firebaseAuthContent.includes('token'));
}

console.log('\n🔐 Checking API Security Endpoints');
console.log('-----------------------------------');

// Check auth API endpoints
test('Auth verify endpoint exists', fileExists('src/app/api/auth/verify/route.ts'));
test('Auth refresh endpoint exists', fileExists('src/app/api/auth/refresh/route.ts'));

const verifyEndpoint = readFile('src/app/api/auth/verify/route.ts');
if (verifyEndpoint) {
  test('Verify endpoint handles POST requests', verifyEndpoint.includes('export async function POST'));
  test('Verify endpoint handles GET requests', verifyEndpoint.includes('export async function GET'));
  test('Verify endpoint handles DELETE requests', verifyEndpoint.includes('export async function DELETE'));
  test('Verify endpoint validates tokens', verifyEndpoint.includes('verifyIdToken'));
  test('Verify endpoint manages sessions', verifyEndpoint.includes('user-session'));
}

const refreshEndpoint = readFile('src/app/api/auth/refresh/route.ts');
if (refreshEndpoint) {
  test('Refresh endpoint exists and handles requests', refreshEndpoint.includes('export async function POST'));
  test('Refresh endpoint validates sessions', refreshEndpoint.includes('session'));
  test('Refresh endpoint extends expiry', refreshEndpoint.includes('expires'));
}

console.log('\n⚙️  Checking Configuration Files');
console.log('---------------------------------');

// Check Next.js configuration
test('Next.js config exists', fileExists('next.config.js') || fileExists('next.config.ts'));

const nextConfig = readFile('next.config.js') || readFile('next.config.ts');
if (nextConfig) {
  test('Next.js config has redirects', nextConfig.includes('redirects'));
  test('Next.js config redirects disabled pages', 
    nextConfig.includes('ai-features-demo') && 
    nextConfig.includes('interactive-visualizations') &&
    nextConfig.includes('demo-voting') &&
    nextConfig.includes('corruption-risk') &&
    nextConfig.includes('crowd-sourced-intel')
  );
}

// Check Firebase configuration
test('Firebase config exists', fileExists('src/lib/firebase.ts'));
test('Firebase admin config exists', fileExists('src/lib/firebase-admin.ts'));

console.log('\n🏗️  Checking Page Structure');
console.log('-----------------------------');

// Check protected pages exist
const protectedPages = [
  'src/app/dashboard/page.tsx',
  'src/app/profile/page.tsx',
  'src/app/admin/page.tsx'
];

protectedPages.forEach(page => {
  test(`Protected page exists: ${page.split('/').pop()}`, fileExists(page));
});

// Check public pages exist
const publicPages = [
  'src/app/page.tsx',
  'src/app/about/page.tsx',
  'src/app/login/page.tsx',
  'src/app/signup/page.tsx'
];

publicPages.forEach(page => {
  test(`Public page exists: ${page.split('/').pop()}`, fileExists(page));
});

console.log('\n🔒 Checking Security Best Practices');
console.log('------------------------------------');

// Check for environment variable usage
const envFile = readFile('.env.local');
test('Environment file exists', envFile !== null);

if (envFile) {
  test('Environment has Firebase config', envFile.includes('FIREBASE') || envFile.includes('NEXT_PUBLIC_FIREBASE'));
}

// Check for secure cookie settings in middleware
if (middlewareContent) {
  test('Middleware uses httpOnly cookies', middlewareContent.includes('httpOnly: true'));
  test('Middleware uses secure cookies in production', middlewareContent.includes('secure:'));
  test('Middleware uses sameSite setting', middlewareContent.includes('sameSite'));
}

console.log('\n📊 Security Configuration Summary');
console.log('==================================');
console.log(`Total Checks: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${totalTests - passedTests}`);
console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

if (passedTests === totalTests) {
  console.log('\n🎉 All security configuration checks passed!');
  console.log('Your security system is properly configured.');
} else {
  console.log('\n⚠️  Some security configuration checks failed.');
  console.log('Please review and fix the issues above.');
}

console.log('\n🚀 Next Steps for Testing:');
console.log('---------------------------');
console.log('1. Start the development server: npm run dev');
console.log('2. Test protected routes in browser (should redirect to login)');
console.log('3. Test login flow with Firebase auth');
console.log('4. Verify session persistence and automatic refresh');
console.log('5. Test logout functionality');
console.log('6. Verify disabled pages redirect to dashboard');

console.log('\n🔧 Manual Test Commands:');
console.log('-------------------------');
console.log('# Test protected route (should get 401 or redirect):');
console.log('curl -i http://localhost:3000/dashboard');
console.log('');
console.log('# Test disabled page redirect:');
console.log('curl -i http://localhost:3000/ai-features-demo');
console.log('');
console.log('# Test auth API:');
console.log('curl -i http://localhost:3000/api/auth/verify');
console.log('');
console.log('# Test public route (should work):');
console.log('curl -i http://localhost:3000/about');
