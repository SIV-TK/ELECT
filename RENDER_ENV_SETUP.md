# Render.com Environment Variables Setup Guide

## 🔧 How to Set Environment Variables on Render.com

### 1. **Go to your Render Dashboard**
- Navigate to your service
- Click on "Environment" tab

### 2. **Firebase Environment Variables**

⚠️ **CRITICAL: Private Key Formatting**

When setting `FIREBASE_PRIVATE_KEY` on Render, you have two options:

#### Option A: Single Line Format (Recommended)
```
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDSc3cql0ezQS59\ndYxRrQWzU0MXUo0BBFaoAMlYj+b+7xpPuOz3co3XG+oOyT+ADOvWnaGp2Oioi1r+\n[...your key continues...]\n-----END PRIVATE KEY-----\n"
```

#### Option B: JSON Escape Format
```
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDSc3cql0ezQS59\\ndYxRrQWzU0MXUo0BBFaoAMlYj+b+7xpPuOz3co3XG+oOyT+ADOvWnaGp2Oioi1r+\\n[...your key continues...]\\n-----END PRIVATE KEY-----\\n"
```

### 3. **Required Environment Variables**

Add these exactly as shown:

```
NODE_ENV=production
PORT=10000

# Firebase Configuration
FIREBASE_PROJECT_ID=last-35eb7
FIREBASE_PRIVATE_KEY_ID=85b3e1869a59a92b61681b2e4fae30f1dd271146
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n[YOUR_FULL_PRIVATE_KEY_HERE]\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@last-35eb7.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=109671364078592412962

# AI API Keys
DEEPSEEK_API_KEY=sk-3cd6995fe396452b801d4fc7721a0e6c
GEMINI_API_KEY=AIzaSyCx-ga-Ywvj8tk3BgleNd3qib5lLO8Bxss

# Firebase Client (these are already in render.yaml)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD05R5TMWg9QcWqkEVZnw-STsZgzY_Xe9k
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=last-35eb7.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=last-35eb7
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=last-35eb7.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=760347188535
NEXT_PUBLIC_FIREBASE_APP_ID=1:760347188535:web:cb0fec7e97ee514a430eb2
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-40EQ7YQ4JH
```

### 4. **Common Issues & Solutions**

#### Issue 1: "Firebase Admin SDK initialization error"
**Cause**: Private key format is incorrect
**Solution**: Ensure the private key includes proper PEM headers and newlines

#### Issue 2: "Missing environment variables"
**Cause**: Variables not set in Render environment
**Solution**: Double-check all variables are added in Render dashboard

#### Issue 3: "Cannot read properties of null"
**Cause**: Firebase authentication failing
**Solution**: Verify client_email and project_id match your Firebase project

### 5. **Testing Environment Variables**

Our build now includes validation. Check the build logs for:
```
🔍 Validating environment variables...
✅ FIREBASE_PROJECT_ID: last-35eb7
✅ FIREBASE_PRIVATE_KEY: Valid PEM format
✅ DEEPSEEK_API_KEY: sk-3cd6995...
```

If you see ❌ errors, the environment variables need to be fixed.

### 6. **Quick Fix Commands**

If the build fails with environment errors, try:
1. Delete and re-add the problematic environment variable
2. Ensure no extra spaces or quotes are added
3. For private key, copy the ENTIRE key including headers
4. Trigger a manual redeploy

## 🚨 Security Note
Never commit actual API keys or private keys to your repository. Always use environment variables.
