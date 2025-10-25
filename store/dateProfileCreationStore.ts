/**
 * Date Profile Creation Store
 * Manages the state during date profile creation flow
 * Handles draft saving, auto-save, and data persistence
 */

import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from './authStore';

// ============================================
// TYPES
// ============================================

export interface DateProfileDraft {
  // Basic Info
  first_name?: string;
  last_name?: string;
  
  // Date of Birth & Age
  date_of_birth?: string; // YYYY-MM-DD
  age?: number;
  zodiac_sign?: string;
  
  // Personal Details
  gender?: string;
  occupation?: string;
  height?: number; // in cm
  
  // Location
  location?: {
    city?: string;
    state?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
  
  // Photo
  primary_photo?: string;
  
  // Relationship Info
  relationship_stage?: 'talking' | 'dating' | 'exclusive' | 'engaged';
  how_met?: string;
  start_date?: string;
  love_language?: string;
  
  // Interests (stored in separate table, but tracked here)
  hobbies?: string[];
  favorite_color?: string;
  favorite_flower?: string;
  favorite_foods?: string[];
  favorite_music?: string[];
  dislikes?: string[];
  personality_traits?: string[];
  
  // Notes
  initial_notes?: string;
}

interface DateProfileCreationState {
  // Draft Data
  draft: DateProfileDraft;
  draftId: string | null; // ID of draft profile in database
  
  // Flow State
  currentStep: number;
  totalSteps: number;
  
  // UI State
  isSaving: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions - Data Management
  updateDraft: (updates: Partial<DateProfileDraft>) => void;
  setDraftId: (id: string | null) => void;
  
  // Actions - Flow Control
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  
  // Actions - Persistence
  saveDraft: () => Promise<{ success: boolean; profileId?: string; error?: string }>;
  loadDraft: () => Promise<void>;
  completeDraft: () => Promise<{ success: boolean; profileId?: string; error?: string }>;
  
  // Actions - UI State
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Actions - Reset
  reset: () => void;
}

// Initial State
const initialState = {
  draft: {},
  draftId: null,
  currentStep: 1,
  totalSteps: 13,
  isSaving: false,
  isLoading: false,
  error: null,
};

// ============================================
// CREATE STORE
// ============================================

export const useDateProfileCreationStore = create<DateProfileCreationState>((set, get) => ({
  ...initialState,

  // ==================== DATA MANAGEMENT ====================
  
  updateDraft: (updates) => {
    set((state) => ({
      draft: { ...state.draft, ...updates },
      error: null,
    }));
  },

  setDraftId: (id) => set({ draftId: id }),

  // ==================== FLOW CONTROL ====================
  
  setCurrentStep: (step) => set({ currentStep: step }),
  
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

  // ==================== PERSISTENCE ====================
  
  /**
   * Save current draft to database
   * Creates new profile with status='draft' or updates existing draft
   */
  saveDraft: async () => {
    const { draft, draftId } = get();
    const user = useAuthStore.getState().user;

    if (!user?.id) {
      return { success: false, error: 'No user ID found' };
    }

    set({ isSaving: true, error: null });

    try {
      // Prepare data for main profile table
      // Handle NOT NULL columns with defaults
      const profileData = {
        user_id: user.id,
        name: draft.first_name || 'Not sure', // NOT NULL - use first_name or default
        first_name: draft.first_name,
        last_name: draft.last_name,
        date_of_birth: draft.date_of_birth,
        age: draft.age,
        zodiac_sign: draft.zodiac_sign,
        gender: draft.gender,
        occupation: draft.occupation,
        height: draft.height,
        location: draft.location,
        primary_photo: draft.primary_photo,
        relationship_stage: draft.relationship_stage,
        how_we_met: draft.how_met, // Column is how_we_met not how_met
        start_date: draft.start_date || new Date().toISOString().split('T')[0], // NOT NULL - default to today
        love_language: draft.love_language,
        status: 'draft', // NOT NULL
        updated_at: new Date().toISOString(),
      };

      let profileId = draftId;

      if (draftId) {
        // Update existing draft
        const { error } = await supabase
          .from('date_profiles')
          .update(profileData)
          .eq('id', draftId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Create new draft
        const { data, error } = await supabase
          .from('date_profiles')
          .insert({
            ...profileData,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;
        if (!data) throw new Error('No data returned from insert');

        profileId = data.id;
        set({ draftId: profileId });
      }

      // Save interests if any
      if (profileId && (draft.hobbies || draft.favorite_color || draft.favorite_flower)) {
        const interestsData = {
          profile_id: profileId,
          hobbies: draft.hobbies || [],
          favorite_color: draft.favorite_color,
          favorite_flower: draft.favorite_flower,
          favorite_foods: draft.favorite_foods || [],
          favorite_music: draft.favorite_music || [],
          dislikes: draft.dislikes || [],
          personality_traits: draft.personality_traits || [],
        };

        // Check if interests exist
        const { data: existingInterests } = await supabase
          .from('date_profile_interests')
          .select('id')
          .eq('profile_id', profileId)
          .single();

        if (existingInterests) {
          // Update
          await supabase
            .from('date_profile_interests')
            .update(interestsData)
            .eq('profile_id', profileId);
        } else {
          // Insert
          await supabase
            .from('date_profile_interests')
            .insert(interestsData);
        }
      }

      // Save initial note if any
      if (profileId && draft.initial_notes) {
        await supabase
          .from('date_profile_notes')
          .insert({
            profile_id: profileId,
            content: draft.initial_notes,
            style: 'default',
            created_at: new Date().toISOString(),
          });
      }

      set({ isSaving: false });
      console.log('✅ Draft saved successfully');
      
      return { success: true, profileId };
    } catch (error: any) {
      console.error('Error saving draft:', error);
      set({ isSaving: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  /**
   * Load existing draft from database
   * Looks for profiles with status='draft' for current user
   */
  loadDraft: async () => {
    const user = useAuthStore.getState().user;

    if (!user?.id) {
      console.error('No user ID found');
      return;
    }

    set({ isLoading: true, error: null });

    try {
      // Find most recent draft
      const { data: profiles, error: profileError } = await supabase
        .from('date_profiles')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'draft')
        .order('updated_at', { ascending: false })
        .limit(1);

      if (profileError) throw profileError;

      if (profiles && profiles.length > 0) {
        const profile = profiles[0];

        // Load interests
        const { data: interests } = await supabase
          .from('date_profile_interests')
          .select('*')
          .eq('profile_id', profile.id)
          .single();

        // Reconstruct draft
        const draft: DateProfileDraft = {
          first_name: profile.first_name,
          last_name: profile.last_name,
          date_of_birth: profile.date_of_birth,
          age: profile.age,
          zodiac_sign: profile.zodiac_sign,
          gender: profile.gender,
          occupation: profile.occupation,
          height: profile.height,
          location: profile.location,
          primary_photo: profile.primary_photo,
          relationship_stage: profile.relationship_stage,
          how_met: profile.how_met,
          start_date: profile.start_date,
          love_language: profile.love_language,
        };

        if (interests) {
          draft.hobbies = interests.hobbies;
          draft.favorite_color = interests.favorite_color;
          draft.favorite_flower = interests.favorite_flower;
          draft.favorite_foods = interests.favorite_foods;
          draft.favorite_music = interests.favorite_music;
          draft.dislikes = interests.dislikes;
          draft.personality_traits = interests.personality_traits;
        }

        set({
          draft,
          draftId: profile.id,
          isLoading: false,
        });

        console.log('✅ Draft loaded successfully');
      } else {
        set({ isLoading: false });
        console.log('No draft found');
      }
    } catch (error: any) {
      console.error('Error loading draft:', error);
      set({ isLoading: false, error: error.message });
    }
  },

  /**
   * Complete the profile creation
   * Changes status from 'draft' to 'active'
   */
  completeDraft: async () => {
    const { draftId, draft } = get();
    const user = useAuthStore.getState().user;

    if (!user?.id) {
      return { success: false, error: 'No user ID found' };
    }

    if (!draftId) {
      return { success: false, error: 'No draft ID found' };
    }

    set({ isSaving: true, error: null });

    try {
      // Update status to active
      const { error } = await supabase
        .from('date_profiles')
        .update({
          status: 'active',
          updated_at: new Date().toISOString(),
        })
        .eq('id', draftId)
        .eq('user_id', user.id);

      if (error) throw error;

      set({ isSaving: false });
      console.log('✅ Profile completed successfully');
      
      return { success: true, profileId: draftId };
    } catch (error: any) {
      console.error('Error completing profile:', error);
      set({ isSaving: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  // ==================== UI STATE ====================
  
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  // ==================== RESET ====================
  
  reset: () => set(initialState),
}));
