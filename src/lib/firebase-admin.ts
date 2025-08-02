import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Check if all required environment variables are present
const requiredEnvVars = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY_ID', 
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_CLIENT_ID'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

let app: any = null;
let adminAuth: any = null;
let adminDb: any = null;

if (missingVars.length > 0) {
  console.warn('⚠️ Firebase Admin SDK not initialized. Missing environment variables:', missingVars);
  console.warn('💡 See FIREBASE_SETUP_GUIDE.md for setup instructions');
  
  // Create mock exports for build-time compatibility
  adminAuth = null;
  adminDb = null;
} else {
  try {
    const serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
    };

    app = getApps().length === 0 
      ? initializeApp({
          credential: cert(serviceAccount as any),
          projectId: process.env.FIREBASE_PROJECT_ID,
        })
      : getApps()[0];

    adminAuth = getAuth(app);
    adminDb = getFirestore(app);
    
    console.log('✅ Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('❌ Firebase Admin SDK initialization error:', error);
    adminAuth = null;
    adminDb = null;
  }
}

export { adminAuth, adminDb };