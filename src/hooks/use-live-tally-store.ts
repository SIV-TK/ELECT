// src/hooks/use-live-tally-store.ts
import { create } from 'zustand';
import type { LiveTally, TallyAnalysisState } from '@/types';
import type { TallyAnomalyOutput } from "@/ai/flows/analyze-tally-anomaly";

interface LiveTallyStore {
  tallies: LiveTally[];
  analyses: Record<string, TallyAnalysisState>;
  addTally: (tally: LiveTally) => void;
  verifyTally: (tallyId: string) => void;
  setAnalysisStatus: (tallyId: string, status: 'loading' | 'error') => void;
  setAnalysisResult: (tallyId: string, result: TallyAnomalyOutput) => void;
}

export const useLiveTallyStore = create<LiveTallyStore>((set) => ({
  tallies: [],
  analyses: {},
  addTally: (tally) => set((state) => ({ tallies: [tally, ...state.tallies] })),
  verifyTally: (tallyId) => set((state) => ({
    tallies: state.tallies.map(t =>
      t.id === tallyId ? { ...t, verifications: t.verifications + 1 } : t
    ),
  })),
  setAnalysisStatus: (tallyId, status) => set((state) => ({
    analyses: { ...state.analyses, [tallyId]: { status } },
  })),
  setAnalysisResult: (tallyId, result) => set((state) => ({
    analyses: { ...state.analyses, [tallyId]: { status: 'complete', result } },
  })),
}));
