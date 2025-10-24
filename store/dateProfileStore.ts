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
  
  // Search & Filter
  searchQuery: string;
  filterStatus: 'all' | 'talking' | 'dating' | 'exclusive' | 'engaged';
  sortBy: 'newest' | 'oldest' | 'name_asc' | 'name_desc';
  
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
  
  // Actions - Search & Filter
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: 'all' | 'talking' | 'dating' | 'exclusive' | 'engaged') => void;
  setSortBy: (sortBy: 'newest' | 'oldest' | 'name_asc' | 'name_desc') => void;
  clearFilters: () => void;
  
  // Computed - Filtered Profiles
  getFilteredProfiles: () => DateProfileData[];
  
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
  searchQuery: '',
  filterStatus: 'all' as const,
  sortBy: 'newest' as const,
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

  // Search & Filter Actions
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setSortBy: (sortBy) => set({ sortBy }),
  clearFilters: () =>
    set({
      searchQuery: '',
      filterStatus: 'all',
      sortBy: 'newest',
    }),

  // Computed - Get Filtered Profiles
  getFilteredProfiles: () => {
    const { profiles, searchQuery, filterStatus, sortBy } = get();
    let filtered = [...profiles];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((profile) =>
        profile.basicInfo.name.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(
        (profile) => profile.basicInfo.status === filterStatus
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return (
            new Date(b.basicInfo.startDate).getTime() -
            new Date(a.basicInfo.startDate).getTime()
          );
        case 'oldest':
          return (
            new Date(a.basicInfo.startDate).getTime() -
            new Date(b.basicInfo.startDate).getTime()
          );
        case 'name_asc':
          return a.basicInfo.name.localeCompare(b.basicInfo.name);
        case 'name_desc':
          return b.basicInfo.name.localeCompare(a.basicInfo.name);
        default:
          return 0;
      }
    });

    return filtered;
  },

  // Reset Store
  reset: () => set(initialState),
}));
