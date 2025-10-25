/**
 * Onboarding Store (Zustand)
 * Manages onboarding state and saves data to Supabase
 */

import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from './authStore';

// ============================================
// TYPES
// ============================================

export interface OnboardingData {
  // Step 1: Name
  name?: string;
  
  // Step 2: Email
  email?: string;
  
  // Step 3: Date of Birth
  dateOfBirth?: string;
  age?: number;
  
  // Step 3: Gender
  gender?: 'male' | 'female' | 'other';
  
  // Step 4: Height
  height?: number; // in cm
  
  // Step 5: Ethnicity
  ethnicity?: string;
  
  // Step 6: Religion
  religion?: string;
  
  // Step 7: Zodiac Sign
  zodiacSign?: string;
  
  // Step 8: Drinking
  drinking?: string;
  
  // Step 9: Occupation
  occupation?: string;
  
  // Step 10: Bio
  bio?: string;
  
  // Step 11: Interests
  interests?: string[];
  
  // Step 12: Photos
  photos?: string[];
  
  // Step 13: Location
  location?: {
    city?: string;
    state?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
  
  // Step 14: Looking For
  lookingFor?: string;
  
  // Step 15: Relationship Type
  relationshipType?: string;
  
  // Step 16: Primary Goal
  primaryGoal?: string;
}

interface OnboardingState {
  // State
  data: OnboardingData;
  currentStep: number;
  totalSteps: number;
  isLoading: boolean;
  isSaving: boolean;
  
  // Actions
  updateData: (updates: Partial<OnboardingData>) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  saveProgress: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  reset: () => void;
}

// ============================================
// STORE
// ============================================

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  // Initial State
  data: {},
  currentStep: 1,
  totalSteps: 16,
  isLoading: false,
  isSaving: false,

  // ============================================
  // Sync Actions
  // ============================================

  updateData: (updates) => {
    set((state) => ({
      data: { ...state.data, ...updates },
    }));
  },

  setCurrentStep: (step) => {
    set({ currentStep: step });
  },

  nextStep: () => {
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, state.totalSteps),
    }));
  },

  previousStep: () => {
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1),
    }));
  },

  reset: () => {
    set({
      data: {},
      currentStep: 1,
      isLoading: false,
      isSaving: false,
    });
  },

  // ============================================
  // Async Actions
  // ============================================

  /**
   * Save progress to database (auto-save after each step)
   */
  saveProgress: async () => {
    const { data } = get();
    const user = useAuthStore.getState().user;

    if (!user?.id) {
      console.error('❌ No user ID found - user may not be logged in');
      throw new Error('No user ID found. Please log in again.');
    }

    set({ isSaving: true });

    try {
      // Calculate age from date of birth
      let age: number | undefined;
      if (data.dateOfBirth) {
        const birthDate = new Date(data.dateOfBirth);
        const today = new Date();
        age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
      }

      // Update user profile in database
      const { error } = await supabase
        .from('users')
        .update({
          name: data.name,
          email: data.email,
          date_of_birth: data.dateOfBirth,
          age: age,
          gender: data.gender,
          height: data.height,
          ethnicity: data.ethnicity,
          religion: data.religion,
          zodiac_sign: data.zodiacSign,
          drinking: data.drinking,
          occupation: data.occupation,
          bio: data.bio,
          interests: data.interests,
          photos: data.photos,
          location: data.location,
          looking_for: data.lookingFor,
          relationship_type: data.relationshipType,
          primary_goal: data.primaryGoal,
          onboarding_step: get().currentStep,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      console.log('✅ Onboarding progress saved');
    } catch (error) {
      console.error('❌ Failed to save progress:', error);
      throw error;
    } finally {
      set({ isSaving: false });
    }
  },

  /**
   * Complete onboarding and mark as done
   */
  completeOnboarding: async () => {
    const user = useAuthStore.getState().user;

    if (!user?.id) {
      console.error('No user ID found');
      return;
    }

    set({ isLoading: true });

    try {
      // Save final progress
      await get().saveProgress();

      // Mark onboarding as completed
      const { error } = await supabase
        .from('users')
        .update({
          onboarding_completed: true,
          onboarding_step: get().totalSteps,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      // Refresh user data in auth store
      await useAuthStore.getState().refreshUser();

      console.log('✅ Onboarding completed');
    } catch (error) {
      console.error('❌ Failed to complete onboarding:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

// ============================================
// SELECTORS (for performance)
// ============================================

export const selectOnboardingData = (state: OnboardingState) => state.data;
export const selectCurrentStep = (state: OnboardingState) => state.currentStep;
export const selectIsLoading = (state: OnboardingState) => state.isLoading;
export const selectIsSaving = (state: OnboardingState) => state.isSaving;
