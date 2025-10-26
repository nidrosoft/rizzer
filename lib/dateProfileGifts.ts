/**
 * Date Profile Gifts & Ideas Functions
 * Complete CRUD operations for AI suggestions, user ideas, and gift history
 * 
 * Features:
 * - AI Gift Suggestions (view, update status, save to ideas)
 * - User Gift Ideas (full CRUD)
 * - Gift History (full CRUD)
 * - Helper functions (statistics, active suggestions, expiration)
 */

import { supabase } from './supabase';
import {
  AIGiftSuggestion,
  CreateAIGiftSuggestionInput,
  UpdateAIGiftSuggestionInput,
  GiftIdea,
  CreateGiftIdeaInput,
  UpdateGiftIdeaInput,
  GiftHistory,
  CreateGiftHistoryInput,
  UpdateGiftHistoryInput,
  CreateGenerationLogInput,
  GiftStatistics,
  ActiveAISuggestion,
  GiftsAPIResponse,
} from '@/types/dateProfileGifts';

// ============================================================================
// AI GIFT SUGGESTIONS
// ============================================================================

/**
 * Get all AI gift suggestions for a profile
 * Includes all statuses (pending, saved, dismissed, expired)
 */
export async function getAIGiftSuggestions(
  profileId: string
): Promise<GiftsAPIResponse<AIGiftSuggestion[]>> {
  try {
    console.log('🎁 [getAIGiftSuggestions] Fetching AI suggestions for profile:', profileId);

    const { data, error } = await supabase
      .from('date_profile_ai_gift_suggestions')
      .select('*')
      .eq('date_profile_id', profileId)
      .order('confidence_score', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;

    console.log('✅ [getAIGiftSuggestions] Fetched', data?.length || 0, 'AI suggestions');
    return { success: true, data: data as AIGiftSuggestion[] };
  } catch (error: any) {
    console.error('❌ [getAIGiftSuggestions] Error:', error);
    return { success: false, error: error.message || 'Failed to fetch AI gift suggestions' };
  }
}

/**
 * Get active (pending, non-expired) AI suggestions for a profile
 * Uses the database helper function for optimized query
 */
export async function getActiveAIGiftSuggestions(
  profileId: string
): Promise<GiftsAPIResponse<ActiveAISuggestion[]>> {
  try {
    console.log('🎁 [getActiveAIGiftSuggestions] Fetching active suggestions for profile:', profileId);

    const { data, error } = await supabase
      .rpc('get_active_ai_suggestions', { profile_id: profileId });

    if (error) throw error;

    console.log('✅ [getActiveAIGiftSuggestions] Fetched', data?.length || 0, 'active suggestions');
    return { success: true, data: data as ActiveAISuggestion[] };
  } catch (error: any) {
    console.error('❌ [getActiveAIGiftSuggestions] Error:', error);
    return { success: false, error: error.message || 'Failed to fetch active AI suggestions' };
  }
}

/**
 * Get a single AI gift suggestion by ID
 */
export async function getAIGiftSuggestionById(
  suggestionId: string
): Promise<GiftsAPIResponse<AIGiftSuggestion>> {
  try {
    console.log('🎁 [getAIGiftSuggestionById] Fetching suggestion:', suggestionId);

    const { data, error } = await supabase
      .from('date_profile_ai_gift_suggestions')
      .select('*')
      .eq('id', suggestionId)
      .single();

    if (error) throw error;

    console.log('✅ [getAIGiftSuggestionById] Suggestion fetched');
    return { success: true, data: data as AIGiftSuggestion };
  } catch (error: any) {
    console.error('❌ [getAIGiftSuggestionById] Error:', error);
    return { success: false, error: error.message || 'Failed to fetch AI suggestion' };
  }
}

/**
 * Create new AI gift suggestions (typically called by backend/cron)
 * This is for the daily AI generation process
 */
export async function createAIGiftSuggestions(
  suggestions: CreateAIGiftSuggestionInput[]
): Promise<GiftsAPIResponse<AIGiftSuggestion[]>> {
  try {
    console.log('🎁 [createAIGiftSuggestions] Creating', suggestions.length, 'AI suggestions');

    const { data, error } = await supabase
      .from('date_profile_ai_gift_suggestions')
      .insert(suggestions)
      .select();

    if (error) throw error;

    console.log('✅ [createAIGiftSuggestions] Created', data?.length || 0, 'suggestions');
    return { success: true, data: data as AIGiftSuggestion[] };
  } catch (error: any) {
    console.error('❌ [createAIGiftSuggestions] Error:', error);
    return { success: false, error: error.message || 'Failed to create AI suggestions' };
  }
}

/**
 * Update an AI gift suggestion (change status, mark as opened, etc.)
 */
export async function updateAIGiftSuggestion(
  suggestionId: string,
  updates: UpdateAIGiftSuggestionInput
): Promise<GiftsAPIResponse<AIGiftSuggestion>> {
  try {
    console.log('🎁 [updateAIGiftSuggestion] Updating suggestion:', suggestionId, updates);

    const { data, error } = await supabase
      .from('date_profile_ai_gift_suggestions')
      .update(updates)
      .eq('id', suggestionId)
      .select()
      .single();

    if (error) throw error;

    console.log('✅ [updateAIGiftSuggestion] Suggestion updated');
    return { success: true, data: data as AIGiftSuggestion };
  } catch (error: any) {
    console.error('❌ [updateAIGiftSuggestion] Error:', error);
    return { success: false, error: error.message || 'Failed to update AI suggestion' };
  }
}

/**
 * Dismiss an AI gift suggestion
 * Sets status to 'dismissed' and records timestamp
 */
export async function dismissAIGiftSuggestion(
  suggestionId: string
): Promise<GiftsAPIResponse<AIGiftSuggestion>> {
  try {
    console.log('🎁 [dismissAIGiftSuggestion] Dismissing suggestion:', suggestionId);

    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('date_profile_ai_gift_suggestions')
      .update({
        status: 'dismissed',
        dismissed_at: now,
      })
      .eq('id', suggestionId)
      .select()
      .single();

    if (error) throw error;

    console.log('✅ [dismissAIGiftSuggestion] Suggestion dismissed');
    return { success: true, data: data as AIGiftSuggestion };
  } catch (error: any) {
    console.error('❌ [dismissAIGiftSuggestion] Error:', error);
    return { success: false, error: error.message || 'Failed to dismiss AI suggestion' };
  }
}

/**
 * Save an AI suggestion to user's gift ideas
 * Creates a new gift idea and marks the AI suggestion as 'saved'
 */
export async function saveAIGiftSuggestionToIdeas(
  suggestionId: string,
  additionalData?: Partial<CreateGiftIdeaInput>
): Promise<GiftsAPIResponse<{ suggestion: AIGiftSuggestion; idea: GiftIdea }>> {
  try {
    console.log('🎁 [saveAIGiftSuggestionToIdeas] Saving suggestion to ideas:', suggestionId);

    // 1. Get the AI suggestion
    const { data: suggestion, error: fetchError } = await supabase
      .from('date_profile_ai_gift_suggestions')
      .select('*')
      .eq('id', suggestionId)
      .single();

    if (fetchError) throw fetchError;
    if (!suggestion) throw new Error('AI suggestion not found');

    // 2. Create gift idea from AI suggestion
    const giftIdeaInput: CreateGiftIdeaInput = {
      date_profile_id: suggestion.date_profile_id,
      title: suggestion.title,
      occasion: suggestion.occasion,
      budget: suggestion.price,
      notes: suggestion.reason,
      priority: 'Medium', // Default priority
      source: 'ai_suggestion',
      ai_suggestion_id: suggestionId,
      ...additionalData, // Allow overriding defaults
    };

    const { data: idea, error: createError } = await supabase
      .from('date_profile_gift_ideas')
      .insert(giftIdeaInput)
      .select()
      .single();

    if (createError) throw createError;

    // 3. Update AI suggestion status to 'saved'
    const now = new Date().toISOString();
    const { data: updatedSuggestion, error: updateError } = await supabase
      .from('date_profile_ai_gift_suggestions')
      .update({
        status: 'saved',
        saved_at: now,
      })
      .eq('id', suggestionId)
      .select()
      .single();

    if (updateError) throw updateError;

    console.log('✅ [saveAIGiftSuggestionToIdeas] Saved to ideas successfully');
    return {
      success: true,
      data: {
        suggestion: updatedSuggestion as AIGiftSuggestion,
        idea: idea as GiftIdea,
      },
    };
  } catch (error: any) {
    console.error('❌ [saveAIGiftSuggestionToIdeas] Error:', error);
    return { success: false, error: error.message || 'Failed to save AI suggestion to ideas' };
  }
}

/**
 * Mark AI suggestion notification as opened
 */
export async function markAIGiftSuggestionOpened(
  suggestionId: string
): Promise<GiftsAPIResponse<AIGiftSuggestion>> {
  try {
    console.log('🎁 [markAIGiftSuggestionOpened] Marking as opened:', suggestionId);

    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('date_profile_ai_gift_suggestions')
      .update({
        notification_opened: true,
        notification_opened_at: now,
      })
      .eq('id', suggestionId)
      .select()
      .single();

    if (error) throw error;

    console.log('✅ [markAIGiftSuggestionOpened] Marked as opened');
    return { success: true, data: data as AIGiftSuggestion };
  } catch (error: any) {
    console.error('❌ [markAIGiftSuggestionOpened] Error:', error);
    return { success: false, error: error.message || 'Failed to mark suggestion as opened' };
  }
}

/**
 * Expire old AI suggestions
 * Calls the database function to mark expired suggestions
 */
export async function expireOldAIGiftSuggestions(): Promise<GiftsAPIResponse<number>> {
  try {
    console.log('🎁 [expireOldAIGiftSuggestions] Expiring old suggestions');

    const { data, error } = await supabase.rpc('expire_old_ai_suggestions');

    if (error) throw error;

    const expiredCount = data as number;
    console.log('✅ [expireOldAIGiftSuggestions] Expired', expiredCount, 'suggestions');
    return { success: true, data: expiredCount };
  } catch (error: any) {
    console.error('❌ [expireOldAIGiftSuggestions] Error:', error);
    return { success: false, error: error.message || 'Failed to expire old suggestions' };
  }
}

// ============================================================================
// USER GIFT IDEAS
// ============================================================================

/**
 * Get all gift ideas for a profile
 */
export async function getGiftIdeas(
  profileId: string
): Promise<GiftsAPIResponse<GiftIdea[]>> {
  try {
    console.log('💡 [getGiftIdeas] Fetching gift ideas for profile:', profileId);

    const { data, error } = await supabase
      .from('date_profile_gift_ideas')
      .select('*')
      .eq('date_profile_id', profileId)
      .order('priority', { ascending: true }) // High first
      .order('created_at', { ascending: false });

    if (error) throw error;

    console.log('✅ [getGiftIdeas] Fetched', data?.length || 0, 'gift ideas');
    return { success: true, data: data as GiftIdea[] };
  } catch (error: any) {
    console.error('❌ [getGiftIdeas] Error:', error);
    return { success: false, error: error.message || 'Failed to fetch gift ideas' };
  }
}

/**
 * Get a single gift idea by ID
 */
export async function getGiftIdeaById(
  ideaId: string
): Promise<GiftsAPIResponse<GiftIdea>> {
  try {
    console.log('💡 [getGiftIdeaById] Fetching gift idea:', ideaId);

    const { data, error } = await supabase
      .from('date_profile_gift_ideas')
      .select('*')
      .eq('id', ideaId)
      .single();

    if (error) throw error;

    console.log('✅ [getGiftIdeaById] Gift idea fetched');
    return { success: true, data: data as GiftIdea };
  } catch (error: any) {
    console.error('❌ [getGiftIdeaById] Error:', error);
    return { success: false, error: error.message || 'Failed to fetch gift idea' };
  }
}

/**
 * Create a new gift idea
 */
export async function createGiftIdea(
  input: CreateGiftIdeaInput
): Promise<GiftsAPIResponse<GiftIdea>> {
  try {
    console.log('💡 [createGiftIdea] Creating gift idea:', input.title);

    const { data, error } = await supabase
      .from('date_profile_gift_ideas')
      .insert(input)
      .select()
      .single();

    if (error) throw error;

    console.log('✅ [createGiftIdea] Gift idea created');
    return { success: true, data: data as GiftIdea };
  } catch (error: any) {
    console.error('❌ [createGiftIdea] Error:', error);
    return { success: false, error: error.message || 'Failed to create gift idea' };
  }
}

/**
 * Update a gift idea
 */
export async function updateGiftIdea(
  ideaId: string,
  updates: UpdateGiftIdeaInput
): Promise<GiftsAPIResponse<GiftIdea>> {
  try {
    console.log('💡 [updateGiftIdea] Updating gift idea:', ideaId, updates);

    const { data, error } = await supabase
      .from('date_profile_gift_ideas')
      .update(updates)
      .eq('id', ideaId)
      .select()
      .single();

    if (error) throw error;

    console.log('✅ [updateGiftIdea] Gift idea updated');
    return { success: true, data: data as GiftIdea };
  } catch (error: any) {
    console.error('❌ [updateGiftIdea] Error:', error);
    return { success: false, error: error.message || 'Failed to update gift idea' };
  }
}

/**
 * Delete a gift idea
 */
export async function deleteGiftIdea(
  ideaId: string
): Promise<GiftsAPIResponse<void>> {
  try {
    console.log('💡 [deleteGiftIdea] Deleting gift idea:', ideaId);

    const { error } = await supabase
      .from('date_profile_gift_ideas')
      .delete()
      .eq('id', ideaId);

    if (error) throw error;

    console.log('✅ [deleteGiftIdea] Gift idea deleted');
    return { success: true };
  } catch (error: any) {
    console.error('❌ [deleteGiftIdea] Error:', error);
    return { success: false, error: error.message || 'Failed to delete gift idea' };
  }
}

/**
 * Mark a gift idea as given and move to history
 * Creates a gift history entry and optionally deletes the idea
 */
export async function markGiftIdeaAsGiven(
  ideaId: string,
  historyData: Partial<CreateGiftHistoryInput>,
  deleteIdea: boolean = true
): Promise<GiftsAPIResponse<{ history: GiftHistory; idea?: GiftIdea }>> {
  try {
    console.log('💡 [markGiftIdeaAsGiven] Marking idea as given:', ideaId);

    // 1. Get the gift idea
    const { data: idea, error: fetchError } = await supabase
      .from('date_profile_gift_ideas')
      .select('*')
      .eq('id', ideaId)
      .single();

    if (fetchError) throw fetchError;
    if (!idea) throw new Error('Gift idea not found');

    // 2. Create gift history entry
    const historyInput: CreateGiftHistoryInput = {
      date_profile_id: idea.date_profile_id,
      title: idea.title,
      occasion: idea.occasion || undefined,
      date_given: historyData.date_given || new Date().toISOString().split('T')[0],
      source: 'gift_idea',
      gift_idea_id: ideaId,
      ai_suggestion_id: idea.ai_suggestion_id || undefined,
      ...historyData, // Allow overriding defaults
    };

    const { data: history, error: createError } = await supabase
      .from('date_profile_gift_history')
      .insert(historyInput)
      .select()
      .single();

    if (createError) throw createError;

    // 3. Update or delete the gift idea
    let updatedIdea: GiftIdea | undefined;
    
    if (deleteIdea) {
      const { error: deleteError } = await supabase
        .from('date_profile_gift_ideas')
        .delete()
        .eq('id', ideaId);

      if (deleteError) throw deleteError;
      console.log('✅ [markGiftIdeaAsGiven] Gift idea deleted after moving to history');
    } else {
      const { data: updated, error: updateError } = await supabase
        .from('date_profile_gift_ideas')
        .update({
          status: 'given',
          given_date: historyInput.date_given,
        })
        .eq('id', ideaId)
        .select()
        .single();

      if (updateError) throw updateError;
      updatedIdea = updated as GiftIdea;
      console.log('✅ [markGiftIdeaAsGiven] Gift idea marked as given');
    }

    console.log('✅ [markGiftIdeaAsGiven] Successfully moved to history');
    return {
      success: true,
      data: {
        history: history as GiftHistory,
        idea: updatedIdea,
      },
    };
  } catch (error: any) {
    console.error('❌ [markGiftIdeaAsGiven] Error:', error);
    return { success: false, error: error.message || 'Failed to mark gift idea as given' };
  }
}

// ============================================================================
// GIFT HISTORY
// ============================================================================

/**
 * Get all gift history for a profile
 */
export async function getGiftHistory(
  profileId: string
): Promise<GiftsAPIResponse<GiftHistory[]>> {
  try {
    console.log('📜 [getGiftHistory] Fetching gift history for profile:', profileId);

    const { data, error } = await supabase
      .from('date_profile_gift_history')
      .select('*')
      .eq('date_profile_id', profileId)
      .order('date_given', { ascending: false });

    if (error) throw error;

    console.log('✅ [getGiftHistory] Fetched', data?.length || 0, 'gift history entries');
    return { success: true, data: data as GiftHistory[] };
  } catch (error: any) {
    console.error('❌ [getGiftHistory] Error:', error);
    return { success: false, error: error.message || 'Failed to fetch gift history' };
  }
}

/**
 * Get a single gift history entry by ID
 */
export async function getGiftHistoryById(
  historyId: string
): Promise<GiftsAPIResponse<GiftHistory>> {
  try {
    console.log('📜 [getGiftHistoryById] Fetching gift history:', historyId);

    const { data, error } = await supabase
      .from('date_profile_gift_history')
      .select('*')
      .eq('id', historyId)
      .single();

    if (error) throw error;

    console.log('✅ [getGiftHistoryById] Gift history fetched');
    return { success: true, data: data as GiftHistory };
  } catch (error: any) {
    console.error('❌ [getGiftHistoryById] Error:', error);
    return { success: false, error: error.message || 'Failed to fetch gift history' };
  }
}

/**
 * Create a new gift history entry
 */
export async function createGiftHistory(
  input: CreateGiftHistoryInput
): Promise<GiftsAPIResponse<GiftHistory>> {
  try {
    console.log('📜 [createGiftHistory] Creating gift history:', input.title);

    const { data, error } = await supabase
      .from('date_profile_gift_history')
      .insert(input)
      .select()
      .single();

    if (error) throw error;

    console.log('✅ [createGiftHistory] Gift history created');
    return { success: true, data: data as GiftHistory };
  } catch (error: any) {
    console.error('❌ [createGiftHistory] Error:', error);
    return { success: false, error: error.message || 'Failed to create gift history' };
  }
}

/**
 * Update a gift history entry
 */
export async function updateGiftHistory(
  historyId: string,
  updates: UpdateGiftHistoryInput
): Promise<GiftsAPIResponse<GiftHistory>> {
  try {
    console.log('📜 [updateGiftHistory] Updating gift history:', historyId, updates);

    const { data, error } = await supabase
      .from('date_profile_gift_history')
      .update(updates)
      .eq('id', historyId)
      .select()
      .single();

    if (error) throw error;

    console.log('✅ [updateGiftHistory] Gift history updated');
    return { success: true, data: data as GiftHistory };
  } catch (error: any) {
    console.error('❌ [updateGiftHistory] Error:', error);
    return { success: false, error: error.message || 'Failed to update gift history' };
  }
}

/**
 * Delete a gift history entry
 */
export async function deleteGiftHistory(
  historyId: string
): Promise<GiftsAPIResponse<void>> {
  try {
    console.log('📜 [deleteGiftHistory] Deleting gift history:', historyId);

    const { error } = await supabase
      .from('date_profile_gift_history')
      .delete()
      .eq('id', historyId);

    if (error) throw error;

    console.log('✅ [deleteGiftHistory] Gift history deleted');
    return { success: true };
  } catch (error: any) {
    console.error('❌ [deleteGiftHistory] Error:', error);
    return { success: false, error: error.message || 'Failed to delete gift history' };
  }
}

// ============================================================================
// AI GENERATION LOG
// ============================================================================

/**
 * Create a generation log entry
 * Typically called after AI generation process completes
 */
export async function createGenerationLog(
  input: CreateGenerationLogInput
): Promise<GiftsAPIResponse<void>> {
  try {
    console.log('📊 [createGenerationLog] Creating generation log for batch:', input.batch_id);

    const { error } = await supabase
      .from('ai_gift_generation_log')
      .insert(input);

    if (error) throw error;

    console.log('✅ [createGenerationLog] Generation log created');
    return { success: true };
  } catch (error: any) {
    console.error('❌ [createGenerationLog] Error:', error);
    return { success: false, error: error.message || 'Failed to create generation log' };
  }
}

/**
 * Get generation logs for a profile
 */
export async function getGenerationLogs(
  profileId: string,
  limit: number = 10
): Promise<GiftsAPIResponse<any[]>> {
  try {
    console.log('📊 [getGenerationLogs] Fetching generation logs for profile:', profileId);

    const { data, error } = await supabase
      .from('ai_gift_generation_log')
      .select('*')
      .eq('date_profile_id', profileId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    console.log('✅ [getGenerationLogs] Fetched', data?.length || 0, 'generation logs');
    return { success: true, data };
  } catch (error: any) {
    console.error('❌ [getGenerationLogs] Error:', error);
    return { success: false, error: error.message || 'Failed to fetch generation logs' };
  }
}

// ============================================================================
// STATISTICS & HELPER FUNCTIONS
// ============================================================================

/**
 * Get gift statistics for a profile
 * Uses the database helper function
 */
export async function getGiftStatistics(
  profileId: string
): Promise<GiftsAPIResponse<GiftStatistics>> {
  try {
    console.log('📊 [getGiftStatistics] Fetching statistics for profile:', profileId);

    const { data, error } = await supabase
      .rpc('get_gift_statistics', { profile_id: profileId });

    if (error) throw error;

    // The RPC returns an array with one object, extract it
    const stats = Array.isArray(data) && data.length > 0 ? data[0] : data;

    console.log('✅ [getGiftStatistics] Statistics fetched:', stats);
    return { success: true, data: stats as GiftStatistics };
  } catch (error: any) {
    console.error('❌ [getGiftStatistics] Error:', error);
    return { success: false, error: error.message || 'Failed to fetch gift statistics' };
  }
}

/**
 * Get comprehensive gift data for a profile
 * Fetches all data types in parallel for efficiency
 */
export async function getAllGiftData(profileId: string): Promise<GiftsAPIResponse<{
  aiSuggestions: AIGiftSuggestion[];
  activeAISuggestions: ActiveAISuggestion[];
  giftIdeas: GiftIdea[];
  giftHistory: GiftHistory[];
  statistics: GiftStatistics;
}>> {
  try {
    console.log('📦 [getAllGiftData] Fetching all gift data for profile:', profileId);

    // Fetch all data in parallel for better performance
    const [
      aiSuggestionsResult,
      activeAISuggestionsResult,
      giftIdeasResult,
      giftHistoryResult,
      statisticsResult,
    ] = await Promise.all([
      getAIGiftSuggestions(profileId),
      getActiveAIGiftSuggestions(profileId),
      getGiftIdeas(profileId),
      getGiftHistory(profileId),
      getGiftStatistics(profileId),
    ]);

    // Check if any request failed
    if (!aiSuggestionsResult.success) throw new Error(aiSuggestionsResult.error);
    if (!activeAISuggestionsResult.success) throw new Error(activeAISuggestionsResult.error);
    if (!giftIdeasResult.success) throw new Error(giftIdeasResult.error);
    if (!giftHistoryResult.success) throw new Error(giftHistoryResult.error);
    if (!statisticsResult.success) throw new Error(statisticsResult.error);

    console.log('✅ [getAllGiftData] All gift data fetched successfully');
    return {
      success: true,
      data: {
        aiSuggestions: aiSuggestionsResult.data || [],
        activeAISuggestions: activeAISuggestionsResult.data || [],
        giftIdeas: giftIdeasResult.data || [],
        giftHistory: giftHistoryResult.data || [],
        statistics: statisticsResult.data || {
          total_ideas: 0,
          total_history: 0,
          active_ai_suggestions: 0,
          gifts_given_this_month: 0,
          total_spent: null,
        },
      },
    };
  } catch (error: any) {
    console.error('❌ [getAllGiftData] Error:', error);
    return { success: false, error: error.message || 'Failed to fetch all gift data' };
  }
}
