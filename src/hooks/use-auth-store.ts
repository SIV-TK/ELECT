// src/hooks/use-auth-store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type User = {
    fullName: string;
    email?: string;
};

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      isLoading: true, // Start with loading true
      login: (user) => set({ isAuthenticated: true, user }),
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage), // or localStorage
      onRehydrateStorage: () => (state) => {
        if (state) {
            state.isLoading = false;
        }
      },
    }
  )
);

// This is a bit of a workaround to set isLoading to false after rehydration
const unsub = useAuthStore.subscribe(
  (state) => {
    if (state.isLoading) {
      useAuthStore.setState({ isLoading: false });
      unsub(); // Unsubscribe after the first run
    }
  }
);
