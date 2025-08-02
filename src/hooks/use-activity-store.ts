"use client";

import React from 'react';
import { create } from 'zustand';
import { useFirebaseAuth } from './use-firebase-auth';

export interface ActivityItem {
  id: string;
  type: 'sentiment' | 'fact-check' | 'bias' | 'vote' | 'analysis' | 'login' | 'settings' | 'profile';
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'alert' | 'info' | 'error';
  metadata?: {
    location?: string;
    category?: string;
    severity?: 'low' | 'medium' | 'high';
  };
}

interface ActivityStore {
  activities: ActivityItem[];
  loading: boolean;
  error: string | null;
  addActivity: (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => void;
  loadUserActivities: (userId: string) => void;
  clearActivities: () => void;
}

// Mock activity data with more realistic entries
const generateMockActivities = (userId: string): ActivityItem[] => [
  {
    id: `${userId}-1`,
    type: 'login',
    title: 'Account Login',
    description: 'Successfully logged in using Google authentication',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    status: 'completed',
    metadata: { category: 'security' }
  },
  {
    id: `${userId}-2`,
    type: 'settings',
    title: 'Profile Settings Updated',
    description: 'Updated notification preferences and privacy settings',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    status: 'completed',
    metadata: { category: 'profile' }
  },
  {
    id: `${userId}-3`,
    type: 'sentiment',
    title: 'Viewed Sentiment Analysis',
    description: 'Accessed William Ruto sentiment analysis for Nairobi County',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    status: 'completed',
    metadata: { location: 'Nairobi County', category: 'analysis' }
  },
  {
    id: `${userId}-4`,
    type: 'fact-check',
    title: 'Fact Check Request',
    description: 'Submitted fact-check request for recent parliamentary statement',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    status: 'pending',
    metadata: { category: 'verification', severity: 'medium' }
  },
  {
    id: `${userId}-5`,
    type: 'vote',
    title: 'Demo Voting Participation',
    description: 'Participated in gubernatorial election simulation',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    status: 'completed',
    metadata: { location: 'Nairobi County', category: 'civic' }
  },
  {
    id: `${userId}-6`,
    type: 'bias',
    title: 'Media Bias Report Viewed',
    description: 'Reviewed bias analysis for Daily Nation political coverage',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    status: 'alert',
    metadata: { category: 'media', severity: 'high' }
  },
  {
    id: `${userId}-7`,
    type: 'analysis',
    title: 'Politician Profile Accessed',
    description: 'Viewed detailed profile and corruption risk analysis',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    status: 'completed',
    metadata: { category: 'research' }
  },
  {
    id: `${userId}-8`,
    type: 'profile',
    title: 'Profile Picture Updated',
    description: 'Changed profile picture and updated bio information',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    status: 'completed',
    metadata: { category: 'profile' }
  }
];

export const useActivityStore = create<ActivityStore>((set, get) => ({
  activities: [],
  loading: false,
  error: null,

  addActivity: (activity) => {
    const newActivity: ActivityItem = {
      ...activity,
      id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      activities: [newActivity, ...state.activities.slice(0, 49)] // Keep only latest 50
    }));

    // Persist to localStorage
    try {
      const currentActivities = [newActivity, ...get().activities];
      localStorage.setItem('user-activities', JSON.stringify(currentActivities));
    } catch (error) {
      console.error('Failed to save activity to localStorage:', error);
    }
  },

  loadUserActivities: (userId) => {
    set({ loading: true, error: null });

    try {
      // Try to load from localStorage first
      const savedActivities = localStorage.getItem('user-activities');
      if (savedActivities) {
        const parsed = JSON.parse(savedActivities);
        set({ activities: parsed, loading: false });
        return;
      }

      // If no saved activities, generate mock data
      const mockActivities = generateMockActivities(userId);
      set({ activities: mockActivities, loading: false });

      // Save mock data to localStorage for future use
      localStorage.setItem('user-activities', JSON.stringify(mockActivities));
    } catch (error) {
      console.error('Failed to load activities:', error);
      set({ 
        error: 'Failed to load activity history',
        loading: false,
        activities: generateMockActivities(userId) // Fallback to mock data
      });
    }
  },

  clearActivities: () => {
    set({ activities: [], error: null });
    try {
      localStorage.removeItem('user-activities');
    } catch (error) {
      console.error('Failed to clear activities from localStorage:', error);
    }
  },
}));

// Custom hook to use activity store with Firebase auth integration
export const useUserActivity = () => {
  const { user } = useFirebaseAuth();
  const { activities, loading, error, addActivity, loadUserActivities, clearActivities } = useActivityStore();

  // Load activities when user changes
  React.useEffect(() => {
    if (user?.uid) {
      loadUserActivities(user.uid);
    } else {
      clearActivities();
    }
  }, [user?.uid, loadUserActivities, clearActivities]);

  return {
    activities,
    loading,
    error,
    addActivity,
    clearActivities,
  };
};

// Helper function to format timestamps
export const formatActivityTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  
  return date.toLocaleDateString();
};

// Helper function to get activity icon and color
export const getActivityDisplay = (type: ActivityItem['type'], status: ActivityItem['status']) => {
  const displays = {
    login: { 
      icon: '🔐', 
      color: status === 'completed' ? 'text-green-600 bg-green-50' : 'text-gray-600 bg-gray-50' 
    },
    settings: { 
      icon: '⚙️', 
      color: status === 'completed' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 bg-gray-50' 
    },
    sentiment: { 
      icon: '📊', 
      color: status === 'completed' ? 'text-purple-600 bg-purple-50' : 'text-gray-600 bg-gray-50' 
    },
    'fact-check': { 
      icon: '✅', 
      color: status === 'pending' ? 'text-orange-600 bg-orange-50' : status === 'completed' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50' 
    },
    bias: { 
      icon: '⚠️', 
      color: status === 'alert' ? 'text-red-600 bg-red-50' : 'text-yellow-600 bg-yellow-50' 
    },
    vote: { 
      icon: '🗳️', 
      color: status === 'completed' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 bg-gray-50' 
    },
    analysis: { 
      icon: '🧠', 
      color: status === 'completed' ? 'text-cyan-600 bg-cyan-50' : 'text-gray-600 bg-gray-50' 
    },
    profile: { 
      icon: '👤', 
      color: status === 'completed' ? 'text-teal-600 bg-teal-50' : 'text-gray-600 bg-gray-50' 
    },
  };

  return displays[type] || { icon: '📝', color: 'text-gray-600 bg-gray-50' };
};
