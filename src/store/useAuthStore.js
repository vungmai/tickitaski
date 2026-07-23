import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  authLoading: true,
  setUser: (user) => set({ user, authLoading: false }),
  clearUser: () => set({ user: null, authLoading: false }),
}));
