# Firebase Admin SDK Setup Guide

## The Issue
Your Firebase Admin SDK configuration is missing server-side credentials. The build fails because `firebase-admin.ts` expects environment variables that aren't set.

## Solution Steps

### 1. Get Firebase Service Account Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `last-35eb7`
3. Go to **Project Settings** (gear icon)
4. Navigate to **Service accounts** tab
5. Click **Generate new private key**
6. Download the JSON file

### 2. Extract Credentials from JSON File

The downloaded JSON will look like:
```json
{
  "type": "service_account",
  "project_id": "last-35eb7",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@last-35eb7.iam.gserviceaccount.com",
  "client_id": "123456789...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40last-35eb7.iam.gserviceaccount.com"
}
```

### 3. Update .env.local

Replace the placeholder values in `.env.local` with your actual credentials:

```bash
# Firebase Admin SDK Configuration (server-side only)
FIREBASE_PROJECT_ID=last-35eb7
FIREBASE_PRIVATE_KEY_ID=your_actual_private_key_id_from_json
FIREBASE_PRIVATE_KEY="your_actual_private_key_from_json_with_newlines"
FIREBASE_CLIENT_EMAIL=your_actual_client_email_from_json
FIREBASE_CLIENT_ID=your_actual_client_id_from_json
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=your_actual_cert_url_from_json
```

### 4. Important Notes

- **Keep the private key format intact** - include the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` parts
- **Preserve newlines** in the private key by wrapping in quotes and using `\n`
- **Never commit** this file to version control (it's in .gitignore)
- The `FIREBASE_PROJECT_ID` should be `last-35eb7` based on your client config

### 5. Test the Build

After updating the credentials, run:
```bash
npm run build
```

## Alternative: Use Firebase Service Account JSON directly

If you prefer, you can also modify `firebase-admin.ts` to use the JSON file directly:

```typescript
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import serviceAccount from './path-to-your-service-account.json';

const app = !getApps().length
  ? initializeApp({
      credential: cert(serviceAccount as any),
    })
  : getApps()[0];
```

But using environment variables is more secure for production.
