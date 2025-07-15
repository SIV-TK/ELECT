// src/hooks/use-politician-store.ts
import { create } from 'zustand';
import type { Politician } from '@/types';
import { politicians as initialPoliticians } from '@/lib/data';

interface PoliticianStore {
  politicians: Politician[];
  addPolitician: (politician: Politician) => void;
}

export const usePoliticianStore = create<PoliticianStore>((set) => ({
  politicians: initialPoliticians,
  addPolitician: (politician) => set((state) => ({ 
    politicians: [politician, ...state.politicians] 
  })),
}));
