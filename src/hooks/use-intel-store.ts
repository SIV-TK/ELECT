// src/hooks/use-intel-store.ts
import { create } from 'zustand';
import type { CrowdIntel, AnalyzeIntelVeracityOutput } from '@/types';

interface IntelStore {
  intelItems: CrowdIntel[];
  addIntel: (item: CrowdIntel) => void;
  verifyIntel: (id: string) => void;
  startAnalysis: (id: string) => void;
  completeAnalysis: (id: string, result: AnalyzeIntelVeracityOutput | null) => void;
}

export const useIntelStore = create<IntelStore>((set) => ({
  intelItems: [],
  addIntel: (item) => set((state) => ({ intelItems: [item, ...state.intelItems] })),
  verifyIntel: (id) => set((state) => ({
    intelItems: state.intelItems.map(item => {
      if (item.id === id) {
        const newVerifications = (item.verifications || 0) + 1;
        return {
          ...item,
          verifications: newVerifications,
          isVerified: newVerifications >= 100,
        };
      }
      return item;
    }),
  })),
  startAnalysis: (id) => set((state) => ({
    intelItems: state.intelItems.map(item =>
      item.id === id ? { ...item, aiAnalysis: 'loading' } : item
    ),
  })),
  completeAnalysis: (id, result) => set((state) => ({
    intelItems: state.intelItems.map(item =>
      item.id === id ? { ...item, aiAnalysis: result } : item
    ),
  })),
}));
