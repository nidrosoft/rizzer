/**
 * Date Profile Store
 * Zustand store for managing date profiles state
 */

import { create } from 'zustand';
import { DateProfileData } from '@/types/dateProfile';

// Store State Interface
interface DateProfileState {
  // Data
  profiles: DateProfileData[];
  selectedProfile: DateProfileData | null;
  
  // UI State
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  
  // Actions - Data Management
  setProfiles: (profiles: DateProfileData[]) => void;
  addProfile: (profile: DateProfileData) => void;
  updateProfile: (id: string, updates: Partial<DateProfileData>) => void;
  deleteProfile: (id: string) => void;
  setSelectedProfile: (profile: DateProfileData | null) => void;
  
  // Actions - UI State
  setLoading: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setError: (error: string | null) => void;
  
  // Actions - Reset
  reset: () => void;
}

// Initial State
const initialState = {
  profiles: [],
  selectedProfile: null,
  isLoading: false,
  isRefreshing: false,
  error: null,
};

// Create Store
export const useDateProfileStore = create<DateProfileState>((set, get) => ({
  ...initialState,

  // Data Management Actions
  setProfiles: (profiles) => set({ profiles, error: null }),

  addProfile: (profile) =>
    set((state) => ({
      profiles: [profile, ...state.profiles],
    })),

  updateProfile: (id, updates) =>
    set((state) => ({
      profiles: state.profiles.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
      selectedProfile:
        state.selectedProfile?.id === id
          ? { ...state.selectedProfile, ...updates }
          : state.selectedProfile,
    })),

  deleteProfile: (id) =>
    set((state) => ({
      profiles: state.profiles.filter((p) => p.id !== id),
      selectedProfile:
        state.selectedProfile?.id === id ? null : state.selectedProfile,
    })),

  setSelectedProfile: (profile) => set({ selectedProfile: profile }),

  // UI State Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setRefreshing: (refreshing) => set({ isRefreshing: refreshing }),
  setError: (error) => set({ error }),

  // Reset Store
  reset: () => set(initialState),
}));
