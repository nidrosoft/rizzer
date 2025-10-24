/**
 * User Store
 * Global user data and preferences state management
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { errorLogger } from '@/services/logging/errorLogger';

// ============================================
// TYPES
// ============================================

export interface DateProfile {
  id: string;
  name: string;
  age: number;
  bio: string;
  photos: string[];
  interests: string[];
  lastDate?: string;
}

interface UserState {
  // State
  favorites: string[];
  rsvps: string[];
  dateProfiles: DateProfile[];
  selectedInterests: string[];
  
  // Actions
  addFavorite: (id: string) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  isFavorite: (id: string) => boolean;
  
  addRSVP: (eventId: string) => Promise<void>;
  removeRSVP: (eventId: string) => Promise<void>;
  isRSVP: (eventId: string) => boolean;
  
  addDateProfile: (profile: DateProfile) => void;
  removeDateProfile: (id: string) => void;
  updateDateProfile: (id: string, updates: Partial<DateProfile>) => void;
  
  setInterests: (interests: string[]) => void;
  toggleInterest: (interest: string) => void;
  
  // Persistence
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
}

// ============================================
// STORAGE KEYS
// ============================================

const STORAGE_KEYS = {
  FAVORITES: '@rizzers_favorites',
  RSVPS: '@rizzers_rsvps',
  INTERESTS: '@rizzers_interests',
};

// ============================================
// STORE
// ============================================

export const useUserStore = create<UserState>((set, get) => ({
  // Initial State
  favorites: [],
  rsvps: [],
  dateProfiles: [],
  selectedInterests: [],

  // ============================================
  // Favorites
  // ============================================

  addFavorite: async (id: string) => {
    const favorites = [...get().favorites, id];
    set({ favorites });
    
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.FAVORITES,
        JSON.stringify(favorites)
      );
    } catch (error) {
      errorLogger.error(error as Error, { context: 'userStore.addFavorite', id });
    }
  },

  removeFavorite: async (id: string) => {
    const favorites = get().favorites.filter(fav => fav !== id);
    set({ favorites });
    
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.FAVORITES,
        JSON.stringify(favorites)
      );
    } catch (error) {
      errorLogger.error(error as Error, { context: 'userStore.removeFavorite', id });
    }
  },

  isFavorite: (id: string) => {
    return get().favorites.includes(id);
  },

  // ============================================
  // RSVPs
  // ============================================

  addRSVP: async (eventId: string) => {
    const rsvps = [...get().rsvps, eventId];
    set({ rsvps });
    
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.RSVPS,
        JSON.stringify(rsvps)
      );
    } catch (error) {
      errorLogger.error(error as Error, { context: 'userStore.addRSVP', eventId });
    }
  },

  removeRSVP: async (eventId: string) => {
    const rsvps = get().rsvps.filter(id => id !== eventId);
    set({ rsvps });
    
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.RSVPS,
        JSON.stringify(rsvps)
      );
    } catch (error) {
      errorLogger.error(error as Error, { context: 'userStore.removeRSVP', eventId });
    }
  },

  isRSVP: (eventId: string) => {
    return get().rsvps.includes(eventId);
  },

  // ============================================
  // Date Profiles
  // ============================================

  addDateProfile: (profile: DateProfile) => {
    set({ 
      dateProfiles: [...get().dateProfiles, profile] 
    });
  },

  removeDateProfile: (id: string) => {
    set({ 
      dateProfiles: get().dateProfiles.filter(p => p.id !== id) 
    });
  },

  updateDateProfile: (id: string, updates: Partial<DateProfile>) => {
    set({
      dateProfiles: get().dateProfiles.map(profile =>
        profile.id === id ? { ...profile, ...updates } : profile
      ),
    });
  },

  // ============================================
  // Interests
  // ============================================

  setInterests: (interests: string[]) => {
    set({ selectedInterests: interests });
  },

  toggleInterest: (interest: string) => {
    const interests = get().selectedInterests;
    const newInterests = interests.includes(interest)
      ? interests.filter(i => i !== interest)
      : [...interests, interest];
    
    set({ selectedInterests: newInterests });
  },

  // ============================================
  // Persistence
  // ============================================

  loadFromStorage: async () => {
    try {
      const [favoritesData, rsvpsData, interestsData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.FAVORITES),
        AsyncStorage.getItem(STORAGE_KEYS.RSVPS),
        AsyncStorage.getItem(STORAGE_KEYS.INTERESTS),
      ]);

      set({
        favorites: favoritesData ? JSON.parse(favoritesData) : [],
        rsvps: rsvpsData ? JSON.parse(rsvpsData) : [],
        selectedInterests: interestsData ? JSON.parse(interestsData) : [],
      });

      console.log('✅ User data loaded from storage');
    } catch (error) {
      errorLogger.error(error as Error, { context: 'userStore.loadFromStorage' });
    }
  },

  saveToStorage: async () => {
    try {
      const { favorites, rsvps, selectedInterests } = get();
      
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites)),
        AsyncStorage.setItem(STORAGE_KEYS.RSVPS, JSON.stringify(rsvps)),
        AsyncStorage.setItem(STORAGE_KEYS.INTERESTS, JSON.stringify(selectedInterests)),
      ]);

      console.log('✅ User data saved to storage');
    } catch (error) {
      errorLogger.error(error as Error, { context: 'userStore.saveToStorage' });
    }
  },
}));

// ============================================
// SELECTORS
// ============================================

export const selectFavorites = (state: UserState) => state.favorites;
export const selectRSVPs = (state: UserState) => state.rsvps;
export const selectDateProfiles = (state: UserState) => state.dateProfiles;
export const selectInterests = (state: UserState) => state.selectedInterests;
