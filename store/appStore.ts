/**
 * App Store
 * Global app state and preferences
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { errorLogger } from '@/services/logging/errorLogger';

// ============================================
// TYPES
// ============================================

interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

interface AppState {
  // State
  isOnboarded: boolean;
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
  location: Location | null;
  isLoading: boolean;
  
  // Actions
  setOnboarded: (value: boolean) => Promise<void>;
  setTheme: (theme: 'light' | 'dark') => Promise<void>;
  toggleNotifications: () => Promise<void>;
  setLocation: (location: Location) => void;
  setLoading: (loading: boolean) => void;
  
  // Persistence
  loadFromStorage: () => Promise<void>;
}

// ============================================
// STORAGE KEYS
// ============================================

const STORAGE_KEYS = {
  ONBOARDED: '@rizzers_onboarded',
  THEME: '@rizzers_theme',
  NOTIFICATIONS: '@rizzers_notifications',
};

// ============================================
// STORE
// ============================================

export const useAppStore = create<AppState>((set, get) => ({
  // Initial State
  isOnboarded: false,
  theme: 'light',
  notificationsEnabled: true,
  location: null,
  isLoading: false,

  // ============================================
  // Actions
  // ============================================

  setOnboarded: async (value: boolean) => {
    set({ isOnboarded: value });
    
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.ONBOARDED,
        JSON.stringify(value)
      );
    } catch (error) {
      errorLogger.error(error as Error, { context: 'appStore.setOnboarded' });
    }
  },

  setTheme: async (theme: 'light' | 'dark') => {
    set({ theme });
    
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (error) {
      errorLogger.error(error as Error, { context: 'appStore.setTheme' });
    }
  },

  toggleNotifications: async () => {
    const newValue = !get().notificationsEnabled;
    set({ notificationsEnabled: newValue });
    
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.NOTIFICATIONS,
        JSON.stringify(newValue)
      );
    } catch (error) {
      errorLogger.error(error as Error, { context: 'appStore.toggleNotifications' });
    }
  },

  setLocation: (location: Location) => {
    set({ location });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  // ============================================
  // Persistence
  // ============================================

  loadFromStorage: async () => {
    try {
      const [onboardedData, themeData, notificationsData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.ONBOARDED),
        AsyncStorage.getItem(STORAGE_KEYS.THEME),
        AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS),
      ]);

      set({
        isOnboarded: onboardedData ? JSON.parse(onboardedData) : false,
        theme: (themeData as 'light' | 'dark') || 'light',
        notificationsEnabled: notificationsData ? JSON.parse(notificationsData) : true,
      });

      console.log('✅ App settings loaded from storage');
    } catch (error) {
      errorLogger.error(error as Error, { context: 'appStore.loadFromStorage' });
    }
  },
}));

// ============================================
// SELECTORS
// ============================================

export const selectIsOnboarded = (state: AppState) => state.isOnboarded;
export const selectTheme = (state: AppState) => state.theme;
export const selectNotifications = (state: AppState) => state.notificationsEnabled;
export const selectLocation = (state: AppState) => state.location;
export const selectIsLoading = (state: AppState) => state.isLoading;
