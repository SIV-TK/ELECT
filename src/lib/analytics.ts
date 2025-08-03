import { getAnalytics, logEvent, setUserProperties } from 'firebase/analytics';
import { initializeApp, getApps } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyD05R5TMWg9QcWqkEVZnw-STsZgzY_Xe9k",
  authDomain: "last-35eb7.firebaseapp.com",
  projectId: "last-35eb7",
  storageBucket: "last-35eb7.firebasestorage.app",
  messagingSenderId: "760347188535",
  appId: "1:760347188535:web:cb0fec7e97ee514a430eb2",
  measurementId: "G-40EQ7YQ4JH"
};

// Google Analytics 4 Measurement ID
export const GA_TRACKING_ID = 'G-40EQ7YQ4JH';

// Initialize Firebase Analytics (only in browser)
let analytics: any = null;

if (typeof window !== 'undefined') {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    analytics = getAnalytics(app);
    console.log('Firebase Analytics initialized');
  } catch (error) {
    console.error('Error initializing Firebase Analytics:', error);
  }
}

// Google Analytics 4 functions
export const gtag = (...args: any[]) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag(...args);
  }
};

// Page view tracking
export const pageview = (url: string) => {
  if (typeof window !== 'undefined') {
    gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Event tracking
export const event = (action: string, parameters: any) => {
  if (typeof window !== 'undefined') {
    gtag('event', action, parameters);
    
    // Also log to Firebase Analytics if available
    if (analytics) {
      try {
        logEvent(analytics, action, parameters);
      } catch (error) {
        console.error('Error logging Firebase Analytics event:', error);
      }
    }
  }
};

// Custom events for the political platform
export const trackPoliticianView = (politicianName: string, politicianId: string) => {
  event('politician_view', {
    politician_name: politicianName,
    politician_id: politicianId,
    category: 'engagement'
  });
};

export const trackVotingAction = (action: string, candidate: string) => {
  event('voting_action', {
    action_type: action,
    candidate_name: candidate,
    category: 'voting'
  });
};

export const trackFactCheck = (content: string, result: string) => {
  event('fact_check', {
    content_type: content,
    verification_result: result,
    category: 'verification'
  });
};

export const trackCrowdIntel = (intelType: string, location: string) => {
  event('crowd_intel_submission', {
    intel_type: intelType,
    location: location,
    category: 'intelligence'
  });
};

export const trackCrisisAlert = (alertType: string, severity: string) => {
  event('crisis_alert', {
    alert_type: alertType,
    severity_level: severity,
    category: 'monitoring'
  });
};

// User property tracking
export const setUserProperty = (property: string, value: string) => {
  if (typeof window !== 'undefined') {
    gtag('set', { [property]: value });
    
    // Also set in Firebase Analytics if available
    if (analytics) {
      try {
        setUserProperties(analytics, { [property]: value });
      } catch (error) {
        console.error('Error setting Firebase Analytics user property:', error);
      }
    }
  }
};

export default analytics;
