import { create } from 'zustand';

export const useHistoryStore = create((set) => ({
  attempts: [],
  isLoading: false,
  error: null,
  selectedAttempt: null,

  setAttempts: (attempts) => set({ attempts, isLoading: false }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),

  addAttempt: (attempt) => set((state) => ({ attempts: [attempt, ...state.attempts] })),
  selectAttempt: (attempt) => set({ selectedAttempt: attempt }),
  clearSelectedAttempt: () => set({ selectedAttempt: null }),
}));
