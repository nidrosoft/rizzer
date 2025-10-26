/**
 * Rizz Categories Backend Functions
 * Full CRUD operations for rizz categories and rizz lines
 */

import { supabase } from './supabase';

// ============================================================================
// TYPES
// ============================================================================

export interface RizzCategory {
  id: number;
  user_id: string | null;
  title: string;
  description: string | null;
  icon: string | null;
  emoji: string | null;
  color: string | null;
  order_index: number;
  is_active: boolean;
  is_custom: boolean;
  is_favorite: boolean;
  rizz_count: number;
  times_used: number;
  created_at: string;
  updated_at: string;
}

export interface RizzLine {
  id: string;
  user_id: string;
  category_id: number;
  content: string;
  context: string | null;
  is_ai_generated: boolean;
  ai_prompt_version: string | null;
  ai_model: string | null;
  times_used: number;
  times_copied: number;
  last_used_at: string | null;
  is_favorite: boolean;
  is_saved: boolean;
  saved_at: string | null;
  generation_batch_id: string | null;
  confidence_score: number | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryInput {
  user_id: string;
  title: string;
  description?: string;
  emoji: string;
  color: string;
}

export interface UpdateCategoryInput {
  title?: string;
  description?: string;
  emoji?: string;
  color?: string;
  is_favorite?: boolean;
  order_index?: number;
}

export interface CreateRizzLineInput {
  user_id: string;
  category_id: number;
  content: string;
  context?: string;
  is_ai_generated?: boolean;
  generation_batch_id?: string;
  confidence_score?: number;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================================================
// CATEGORY CRUD OPERATIONS
// ============================================================================

/**
 * Get all user's custom categories (no system categories)
 */
export async function getRizzCategories(userId: string): Promise<APIResponse<RizzCategory[]>> {
  try {
    const { data, error } = await supabase
      .from('rizz_categories')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (error: any) {
    console.error('Error fetching rizz categories:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get single rizz category by ID
 */
export async function getRizzCategory(categoryId: number, userId: string): Promise<APIResponse<RizzCategory>> {
  try {
    const { data, error } = await supabase
      .from('rizz_categories')
      .select('*')
      .eq('id', categoryId)
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error('Error fetching rizz category:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get system categories only
 */
export async function getSystemCategories(): Promise<APIResponse<RizzCategory[]>> {
  try {
    const { data, error } = await supabase
      .from('rizz_categories')
      .select('*')
      .is('user_id', null)
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (error: any) {
    console.error('Error fetching system categories:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get user custom categories only
 */
export async function getUserCustomCategories(userId: string): Promise<APIResponse<RizzCategory[]>> {
  try {
    const { data, error } = await supabase
      .from('rizz_categories')
      .select('*')
      .eq('user_id', userId)
      .eq('is_custom', true)
      .order('order_index', { ascending: true });

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (error: any) {
    console.error('Error fetching user custom categories:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get category by ID
 */
export async function getCategoryById(categoryId: number): Promise<APIResponse<RizzCategory>> {
  try {
    const { data, error } = await supabase
      .from('rizz_categories')
      .select('*')
      .eq('id', categoryId)
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error('Error fetching category:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Create custom rizz category
 */
export async function createRizzCategory(input: CreateCategoryInput): Promise<APIResponse<RizzCategory>> {
  try {
    // Get max order_index for user's custom categories
    const { data: maxOrder } = await supabase
      .from('rizz_categories')
      .select('order_index')
      .eq('user_id', input.user_id)
      .order('order_index', { ascending: false })
      .limit(1)
      .single();

    const nextOrder = maxOrder ? maxOrder.order_index + 1 : 1;

    const { data, error } = await supabase
      .from('rizz_categories')
      .insert({
        user_id: input.user_id,
        title: input.title,
        description: input.description || null,
        emoji: input.emoji,
        color: input.color,
        order_index: nextOrder,
        is_custom: true,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error('Error creating rizz category:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update rizz category
 */
export async function updateRizzCategory(
  categoryId: number,
  input: UpdateCategoryInput
): Promise<APIResponse<RizzCategory>> {
  try {
    const { data, error } = await supabase
      .from('rizz_categories')
      .update(input)
      .eq('id', categoryId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error('Error updating rizz category:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete custom rizz category
 */
export async function deleteRizzCategory(categoryId: number): Promise<APIResponse<void>> {
  try {
    const { error } = await supabase
      .from('rizz_categories')
      .delete()
      .eq('id', categoryId)
      .eq('is_custom', true); // Only allow deleting custom categories

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting rizz category:', error);
    return { success: false, error: error.message };
  }
}

// ============================================================================
// RIZZ LINES CRUD OPERATIONS
// ============================================================================

/**
 * Get rizz lines for a category
 */
export async function getRizzLines(categoryId: number, userId: string): Promise<APIResponse<RizzLine[]>> {
  try {
    const { data, error } = await supabase
      .from('rizz_messages')
      .select('*')
      .eq('category_id', categoryId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (error: any) {
    console.error('Error fetching rizz lines:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get saved rizz lines for user
 */
export async function getSavedRizzLines(userId: string): Promise<APIResponse<RizzLine[]>> {
  try {
    const { data, error } = await supabase
      .from('rizz_messages')
      .select('*')
      .eq('user_id', userId)
      .eq('is_saved', true)
      .order('saved_at', { ascending: false });

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (error: any) {
    console.error('Error fetching saved rizz lines:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Create rizz line
 */
export async function createRizzLine(input: CreateRizzLineInput): Promise<APIResponse<RizzLine>> {
  try {
    const { data, error } = await supabase
      .from('rizz_messages')
      .insert({
        user_id: input.user_id,
        category_id: input.category_id,
        content: input.content,
        context: input.context || null,
        is_ai_generated: input.is_ai_generated || false,
        generation_batch_id: input.generation_batch_id || null,
        confidence_score: input.confidence_score || null,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error('Error creating rizz line:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update rizz line
 */
export async function updateRizzLine(
  lineId: string,
  updates: Partial<RizzLine>
): Promise<APIResponse<RizzLine>> {
  try {
    const { data, error } = await supabase
      .from('rizz_messages')
      .update(updates)
      .eq('id', lineId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error('Error updating rizz line:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete rizz line
 */
export async function deleteRizzLine(lineId: string): Promise<APIResponse<void>> {
  try {
    const { error } = await supabase
      .from('rizz_messages')
      .delete()
      .eq('id', lineId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting rizz line:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Toggle save state of rizz line
 */
export async function toggleSaveRizzLine(lineId: string, isSaved: boolean): Promise<APIResponse<RizzLine>> {
  try {
    const { data, error } = await supabase
      .from('rizz_messages')
      .update({
        is_saved: isSaved,
        saved_at: isSaved ? new Date().toISOString() : null,
      })
      .eq('id', lineId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error('Error toggling save rizz line:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Increment copy count for rizz line
 */
export async function incrementCopyCount(lineId: string): Promise<APIResponse<void>> {
  try {
    const { error } = await supabase.rpc('increment_rizz_copy_count', {
      line_id: lineId,
    });

    // If RPC doesn't exist, fallback to manual update
    if (error && error.message.includes('function')) {
      const { data: line } = await supabase
        .from('rizz_messages')
        .select('times_copied')
        .eq('id', lineId)
        .single();

      if (line) {
        await supabase
          .from('rizz_messages')
          .update({ times_copied: (line.times_copied || 0) + 1 })
          .eq('id', lineId);
      }
    } else if (error) {
      throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error incrementing copy count:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Increment use count for rizz line
 */
export async function incrementUseCount(lineId: string): Promise<APIResponse<void>> {
  try {
    const { data: line } = await supabase
      .from('rizz_messages')
      .select('times_used')
      .eq('id', lineId)
      .single();

    if (line) {
      const { error } = await supabase
        .from('rizz_messages')
        .update({
          times_used: (line.times_used || 0) + 1,
          last_used_at: new Date().toISOString(),
        })
        .eq('id', lineId);

      if (error) throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error incrementing use count:', error);
    return { success: false, error: error.message };
  }
}

// ============================================================================
// STATS & ANALYTICS
// ============================================================================

/**
 * Get category statistics
 */
export async function getCategoryStats(categoryId: number): Promise<APIResponse<any>> {
  try {
    const { data, error } = await supabase
      .from('rizz_categories')
      .select('rizz_count, times_used')
      .eq('id', categoryId)
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error('Error fetching category stats:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get user rizz statistics
 */
export async function getUserRizzStats(userId: string): Promise<APIResponse<any>> {
  try {
    const [categoriesResult, linesResult, savedResult] = await Promise.all([
      supabase
        .from('rizz_categories')
        .select('id')
        .eq('user_id', userId)
        .eq('is_custom', true),
      supabase
        .from('rizz_messages')
        .select('id, times_used, times_copied')
        .eq('user_id', userId),
      supabase
        .from('rizz_messages')
        .select('id')
        .eq('user_id', userId)
        .eq('is_saved', true),
    ]);

    const stats = {
      custom_categories: categoriesResult.data?.length || 0,
      total_rizz_lines: linesResult.data?.length || 0,
      saved_rizz_lines: savedResult.data?.length || 0,
      total_times_used: linesResult.data?.reduce((sum, line) => sum + (line.times_used || 0), 0) || 0,
      total_times_copied: linesResult.data?.reduce((sum, line) => sum + (line.times_copied || 0), 0) || 0,
    };

    return { success: true, data: stats };
  } catch (error: any) {
    console.error('Error fetching user rizz stats:', error);
    return { success: false, error: error.message };
  }
}
