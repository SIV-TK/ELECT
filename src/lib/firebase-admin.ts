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
    // Handle private key formatting - Render may store it differently
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;
    
    // Handle different private key formats
    if (privateKey) {
      // Replace escaped newlines with actual newlines
      privateKey = privateKey.replace(/\\n/g, '\n');
      
      // Ensure proper PEM format
      if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
        console.error('❌ Firebase private key format invalid');
        throw new Error('Invalid private key format');
      }
    }

    const serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: privateKey,
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
    
    // Log specific error details for debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Check if it's a credential error
    if (error instanceof Error && error.message.includes('credential')) {
      console.error('💡 This looks like a Firebase credential error.');
      console.error('💡 Check that your FIREBASE_PRIVATE_KEY is properly formatted.');
      console.error('💡 See RENDER_ENV_SETUP.md for proper environment variable setup.');
    }
    
    adminAuth = null;
    adminDb = null;
  }
}

export { adminAuth, adminDb };