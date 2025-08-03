#!/usr/bin/env node

/**
 * Security System Test Script
 * Tests the comprehensive authentication and session management system
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const TEST_EMAIL = process.env.TEST_EMAIL || 'test@example.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'testpass123';

console.log('🔒 ELECT Platform Security System Test');
console.log('=====================================\n');

// Test routes that should be protected
const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/admin',
  '/api/user/profile',
  '/api/admin/users',
  '/sentiment-analysis',
  '/live-tally',
  '/politicians',
  '/constituency-map',
  '/media-bias',
  '/fact-check',
  '/verification-gallery',
  '/voter-education',
  '/voter-registration',
  '/influence-network',
  '/settings'
];

// Test routes that should be accessible without auth
const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/login',
  '/signup',
  '/api/auth/verify',
  '/api/health'
];

// Test routes that should redirect (disabled pages)
const REDIRECT_ROUTES = [
  '/ai-features-demo',
  '/interactive-visualizations', 
  '/demo-voting',
  '/corruption-risk',
  '/crowd-sourced-intel'
];

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.request(url, {
      method: 'GET',
      timeout: 10000,
      ...options
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          redirected: res.statusCode >= 300 && res.statusCode < 400
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Request timeout')));
    req.end();
  });
}

async function testRoute(route, expectedBehavior = 'protected') {
  try {
    console.log(`Testing: ${route}`);
    const response = await makeRequest(`${BASE_URL}${route}`);
    
    switch (expectedBehavior) {
      case 'protected':
        if (response.statusCode === 401 || response.statusCode === 403) {
          console.log(`✅ PASS: ${route} - Properly protected (${response.statusCode})`);
          return true;
        } else if (response.statusCode === 302 || response.statusCode === 307) {
          const location = response.headers.location;
          if (location && (location.includes('/login') || location.includes('/auth'))) {
            console.log(`✅ PASS: ${route} - Redirects to login (${response.statusCode})`);
            return true;
          }
        }
        console.log(`❌ FAIL: ${route} - Not properly protected (${response.statusCode})`);
        return false;

      case 'public':
        if (response.statusCode === 200) {
          console.log(`✅ PASS: ${route} - Accessible (${response.statusCode})`);
          return true;
        }
        console.log(`❌ FAIL: ${route} - Should be accessible (${response.statusCode})`);
        return false;

      case 'redirect':
        if (response.statusCode === 302 || response.statusCode === 307) {
          const location = response.headers.location;
          if (location && location.includes('/dashboard')) {
            console.log(`✅ PASS: ${route} - Redirects to dashboard (${response.statusCode})`);
            return true;
          }
        }
        console.log(`❌ FAIL: ${route} - Should redirect to dashboard (${response.statusCode})`);
        return false;

      default:
        console.log(`❓ UNKNOWN: ${route} - Status: ${response.statusCode}`);
        return false;
    }
  } catch (error) {
    console.log(`❌ ERROR: ${route} - ${error.message}`);
    return false;
  }
}

async function testAuthAPI() {
  console.log('\n🔐 Testing Authentication API Endpoints');
  console.log('----------------------------------------');

  try {
    // Test auth verification without token
    console.log('Testing: POST /api/auth/verify (no token)');
    const noTokenResponse = await makeRequest(`${BASE_URL}/api/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (noTokenResponse.statusCode === 401) {
      console.log('✅ PASS: Auth API rejects requests without token');
    } else {
      console.log('❌ FAIL: Auth API should reject requests without token');
    }

    // Test session check without session
    console.log('Testing: GET /api/auth/verify (no session)');
    const noSessionResponse = await makeRequest(`${BASE_URL}/api/auth/verify`);
    
    if (noSessionResponse.statusCode === 200) {
      const data = JSON.parse(noSessionResponse.body);
      if (data.authenticated === false) {
        console.log('✅ PASS: Session check correctly identifies no session');
      } else {
        console.log('❌ FAIL: Session check should return authenticated: false');
      }
    } else {
      console.log('❌ FAIL: Session check endpoint not accessible');
    }

    // Test logout endpoint
    console.log('Testing: DELETE /api/auth/verify (logout)');
    const logoutResponse = await makeRequest(`${BASE_URL}/api/auth/verify`, {
      method: 'DELETE'
    });
    
    if (logoutResponse.statusCode === 200) {
      console.log('✅ PASS: Logout endpoint accessible');
    } else {
      console.log('❌ FAIL: Logout endpoint not working');
    }

  } catch (error) {
    console.log(`❌ ERROR: Auth API test failed - ${error.message}`);
  }
}

async function testSessionRefresh() {
  console.log('\n🔄 Testing Session Refresh API');
  console.log('-------------------------------');

  try {
    // Test refresh without session
    console.log('Testing: POST /api/auth/refresh (no session)');
    const noSessionResponse = await makeRequest(`${BASE_URL}/api/auth/refresh`, {
      method: 'POST'
    });
    
    if (noSessionResponse.statusCode === 401) {
      console.log('✅ PASS: Refresh API rejects requests without session');
    } else {
      console.log('❌ FAIL: Refresh API should reject requests without session');
    }

    // Test refresh status check
    console.log('Testing: GET /api/auth/refresh (refresh status)');
    const statusResponse = await makeRequest(`${BASE_URL}/api/auth/refresh`);
    
    if (statusResponse.statusCode === 200) {
      const data = JSON.parse(statusResponse.body);
      if (data.needsRefresh === false) {
        console.log('✅ PASS: Refresh status check works without session');
      } else {
        console.log('❌ FAIL: Refresh status should indicate no session');
      }
    } else {
      console.log('❌ FAIL: Refresh status endpoint not accessible');
    }

  } catch (error) {
    console.log(`❌ ERROR: Session refresh test failed - ${error.message}`);
  }
}

async function runSecurityTests() {
  let totalTests = 0;
  let passedTests = 0;

  console.log('🛡️  Testing Protected Routes (should require auth)');
  console.log('--------------------------------------------------');
  for (const route of PROTECTED_ROUTES) {
    totalTests++;
    if (await testRoute(route, 'protected')) {
      passedTests++;
    }
  }

  console.log('\n🌐 Testing Public Routes (should be accessible)');
  console.log('-----------------------------------------------');
  for (const route of PUBLIC_ROUTES) {
    totalTests++;
    if (await testRoute(route, 'public')) {
      passedTests++;
    }
  }

  console.log('\n↩️  Testing Redirect Routes (disabled pages)');
  console.log('--------------------------------------------');
  for (const route of REDIRECT_ROUTES) {
    totalTests++;
    if (await testRoute(route, 'redirect')) {
      passedTests++;
    }
  }

  // Test API endpoints
  await testAuthAPI();
  await testSessionRefresh();

  console.log('\n📊 Test Results Summary');
  console.log('=======================');
  console.log(`Total Route Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${totalTests - passedTests}`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

  if (passedTests === totalTests) {
    console.log('\n🎉 All security tests passed! The system is properly protected.');
  } else {
    console.log('\n⚠️  Some security tests failed. Please review the system configuration.');
  }

  console.log('\n📝 Manual Testing Recommendations:');
  console.log('-----------------------------------');
  console.log('1. Test actual login flow with valid credentials');
  console.log('2. Verify session persistence across browser refresh');
  console.log('3. Test automatic logout after session expiry');
  console.log('4. Verify role-based access control for admin routes');
  console.log('5. Test CSRF protection with cross-origin requests');
  console.log('6. Verify secure cookie settings in production');
  
  console.log('\n🔗 Quick Test Commands:');
  console.log('------------------------');
  console.log(`curl -i ${BASE_URL}/dashboard`);
  console.log(`curl -i ${BASE_URL}/api/auth/verify`);
  console.log(`curl -i -X POST ${BASE_URL}/api/auth/verify -H "Content-Type: application/json" -d "{}"`);
  console.log(`curl -i ${BASE_URL}/ai-features-demo`);
}

// Run the tests
if (require.main === module) {
  runSecurityTests().catch(console.error);
}

module.exports = {
  runSecurityTests,
  testRoute,
  PROTECTED_ROUTES,
  PUBLIC_ROUTES,
  REDIRECT_ROUTES
};
