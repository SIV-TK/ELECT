import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD05R5TMWg9QcWqkEVZnw-STsZgzY_Xe9k",
  authDomain: "last-35eb7.firebaseapp.com",
  projectId: "last-35eb7",
  storageBucket: "last-35eb7.firebasestorage.app",
  messagingSenderId: "760347188535",
  appId: "1:760347188535:web:cb0fec7e97ee514a430eb2",
  measurementId: "G-40EQ7YQ4JH"
};

let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw new Error('Failed to initialize Firebase');
}

export const auth = getAuth(app);
export const db = getFirestore(app);

// Configure auth settings
auth.useDeviceLanguage();

// Test connection
auth.onAuthStateChanged((user) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Firebase Auth state:', user ? 'Authenticated' : 'Not authenticated');
  }
});