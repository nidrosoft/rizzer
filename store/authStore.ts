/**
 * Auth Store
 * Global authentication state management with Zustand
 * Now integrated with Supabase
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import * as auth from '@/lib/auth';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// ============================================
// TYPES
// ============================================

export interface User {
  id: string;
  phone: string;
  name: string;
  email?: string;
  avatar?: string;
  bio?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  interests?: string[];
  photos?: string[];
}

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  
  // Async Actions
  initialize: () => Promise<void>;
  login: (phone: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

// ============================================
// STORE
// ============================================

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial State
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,

  // ============================================
  // Sync Actions
  // ============================================

  setUser: (user) => {
    set({ 
      user,
      isAuthenticated: user !== null,
    });
  },

  setToken: (token) => {
    set({ token });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  updateUser: (updates) => {
    const currentUser = get().user;
    if (currentUser) {
      set({ 
        user: { ...currentUser, ...updates } 
      });
    }
  },

  // ============================================
  // Async Actions
  // ============================================

  /**
   * Initialize auth state on app start
   * Checks for existing session and validates it
   */
  initialize: async () => {
    set({ isLoading: true });

    try {
      // Get current session from Supabase
      const { success, session } = await auth.getSession();
      
      if (success && session) {
        set({ token: session.access_token });

        // Get user data
        const { success: userSuccess, user: supabaseUser } = await auth.getCurrentUser();
        
        if (userSuccess && supabaseUser) {
          // Fetch user profile from database
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', supabaseUser.id)
            .single();

          if (profile) {
            set({ 
              user: {
                id: profile.id,
                phone: profile.phone,
                name: profile.name || '',
                email: profile.email || undefined,
                avatar: profile.avatar_url || undefined,
                bio: profile.bio || undefined,
                dateOfBirth: profile.date_of_birth || undefined,
                gender: profile.gender as 'male' | 'female' | 'other' | undefined,
                interests: profile.interests || undefined,
                photos: profile.photos as string[] || undefined,
              },
              isAuthenticated: true,
              isInitialized: true,
              isLoading: false,
            });
            console.log('✅ Auth initialized - User logged in');
          }
        } else {
          // Session invalid - clear
          await auth.signOut();
          set({ 
            user: null,
            token: null,
            isAuthenticated: false,
            isInitialized: true,
            isLoading: false,
          });
          console.log('⚠️ Auth initialized - Session invalid');
        }
      } else {
        // No session - user not logged in
        set({ 
          isInitialized: true,
          isLoading: false,
        });
        console.log('ℹ️ Auth initialized - No session');
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ 
        isInitialized: true,
        isLoading: false,
      });
    }
  },

  /**
   * Login with phone and OTP
   */
  login: async (phone: string, otp: string) => {
    set({ isLoading: true });

    try {
      // Verify OTP with Supabase
      const { success, data, error } = await auth.verifyOTP(phone, otp);

      if (!success || !data) {
        throw new Error(error || 'Failed to verify OTP');
      }

      // Get user from session
      if (data.user) {
        // Fetch or create user profile
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError && profileError.code === 'PGRST116') {
          // User doesn't exist - create profile
          const { data: newProfile } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              phone: phone,
            })
            .select()
            .single();

          if (newProfile) {
            set({
              user: {
                id: newProfile.id,
                phone: newProfile.phone,
                name: newProfile.name || '',
              },
              token: data.session?.access_token || null,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } else if (profile) {
          // User exists - update state
          set({
            user: {
              id: profile.id,
              phone: profile.phone,
              name: profile.name || '',
              email: profile.email || undefined,
              avatar: profile.avatar_url || undefined,
              bio: profile.bio || undefined,
              dateOfBirth: profile.date_of_birth || undefined,
              gender: profile.gender as 'male' | 'female' | 'other' | undefined,
              interests: profile.interests || undefined,
              photos: profile.photos as string[] || undefined,
            },
            token: data.session?.access_token || null,
            isAuthenticated: true,
            isLoading: false,
          });
        }
      }

      console.log('✅ Login successful');
    } catch (error) {
      set({ isLoading: false });
      console.error('Login error:', error);
      throw error; // Re-throw for UI to handle
    }
  },

  /**
   * Logout user
   */
  logout: async () => {
    set({ isLoading: true });

    try {
      // Sign out from Supabase
      await auth.signOut();

      // Clear state
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });

      console.log('✅ Logout successful');
    } catch (error) {
      // Clear state even if API fails
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });

      console.error('Logout error:', error);
    }
  },

  /**
   * Refresh user data from Supabase
   */
  refreshUser: async () => {
    try {
      const { success, user: supabaseUser } = await auth.getCurrentUser();
      
      if (success && supabaseUser) {
        // Fetch latest profile
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', supabaseUser.id)
          .single();

        if (profile) {
          set({ 
            user: {
              id: profile.id,
              phone: profile.phone,
              name: profile.name || '',
              email: profile.email || undefined,
              avatar: profile.avatar_url || undefined,
              bio: profile.bio || undefined,
              dateOfBirth: profile.date_of_birth || undefined,
              gender: profile.gender as 'male' | 'female' | 'other' | undefined,
              interests: profile.interests || undefined,
              photos: profile.photos as string[] || undefined,
            }
          });
          console.log('✅ User data refreshed');
        }
      }
    } catch (error) {
      console.error('Refresh user error:', error);
      throw error;
    }
  },
}));

// ============================================
// SELECTORS (for performance)
// ============================================

export const selectUser = (state: AuthState) => state.user;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectIsLoading = (state: AuthState) => state.isLoading;
export const selectIsInitialized = (state: AuthState) => state.isInitialized;
