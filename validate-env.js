#!/usr/bin/env node

// Environment variable validation script for Render deployment
const requiredVars = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY_ID', 
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_CLIENT_ID',
  'DEEPSEEK_API_KEY',
  'GEMINI_API_KEY',
];

console.log('🔍 Validating environment variables...\n');

let hasErrors = false;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.error(`❌ Missing: ${varName}`);
    hasErrors = true;
  } else {
    // Show partial value for security
    const maskedValue = varName.includes('KEY') || varName.includes('PRIVATE') 
      ? `${value.substring(0, 10)}...` 
      : value;
    console.log(`✅ ${varName}: ${maskedValue}`);
  }
});

// Special validation for Firebase private key
if (process.env.FIREBASE_PRIVATE_KEY) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
    console.error('❌ FIREBASE_PRIVATE_KEY: Invalid format (missing PEM headers)');
    hasErrors = true;
  } else {
    console.log('✅ FIREBASE_PRIVATE_KEY: Valid PEM format');
  }
}

if (hasErrors) {
  console.error('\n💥 Environment validation failed!');
  process.exit(1);
} else {
  console.log('\n🎉 All environment variables are valid!');
}
