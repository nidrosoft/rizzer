/**
 * Rizz Generation Backend Functions
 * Functions to interact with AI rizz generation system
 */

import { supabase } from './supabase';
import { RizzLine } from './rizzCategories';

// ============================================================================
// TYPES
// ============================================================================

export interface GenerationStats {
  total_generations: number;
  total_lines: number;
  total_cost: number;
  success_rate: number;
  avg_duration_ms: number;
  last_generation: string | null;
}

export interface GenerationHistory {
  batch_id: string;
  lines_count: number;
  duration_ms: number;
  created_at: string;
}

export interface GenerateRizzLinesResponse {
  success: boolean;
  data?: RizzLine[];
  batchId?: string;
  duration_ms?: number;
  tokens?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  error?: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================================================
// GENERATION FUNCTIONS
// ============================================================================

/**
 * Generate rizz lines for a category using AI
 */
export async function generateRizzLines(
  categoryId: number,
  userId: string
): Promise<GenerateRizzLinesResponse> {
  try {
    console.log(`🎯 Generating rizz lines for category ${categoryId}...`);

    // Call Edge Function
    const { data, error } = await supabase.functions.invoke('generate-rizz-lines', {
      body: { categoryId, userId },
    });

    if (error) {
      console.error('❌ Edge Function error:', error);
      throw error;
    }

    if (!data.success) {
      throw new Error(data.error || 'Failed to generate rizz lines');
    }

    console.log(`✅ Generated ${data.data?.length || 0} rizz lines`);

    return {
      success: true,
      data: data.data,
      batchId: data.batchId,
      duration_ms: data.duration_ms,
      tokens: data.tokens,
    };
  } catch (error: any) {
    console.error('❌ Error generating rizz lines:', error);
    return {
      success: false,
      error: error.message || 'Failed to generate rizz lines',
    };
  }
}

// ============================================================================
// STATS & HISTORY FUNCTIONS
// ============================================================================

/**
 * Get generation statistics for a user
 */
export async function getRizzGenerationStats(
  userId: string
): Promise<APIResponse<GenerationStats>> {
  try {
    const { data, error } = await supabase
      .rpc('get_rizz_generation_stats', { p_user_id: userId });

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error('Error fetching generation stats:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get generation history for a category
 */
export async function getCategoryGenerationHistory(
  categoryId: number,
  limit: number = 10
): Promise<APIResponse<GenerationHistory[]>> {
  try {
    const { data, error } = await supabase
      .rpc('get_category_generation_history', {
        p_category_id: categoryId,
        p_limit: limit,
      });

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (error: any) {
    console.error('Error fetching generation history:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get recent generation logs
 */
export async function getRecentGenerationLogs(
  userId: string,
  limit: number = 20
): Promise<APIResponse<any[]>> {
  try {
    const { data, error } = await supabase
      .from('rizz_generation_log')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (error: any) {
    console.error('Error fetching generation logs:', error);
    return { success: false, error: error.message };
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format cost for display
 */
export function formatCost(cost: number): string {
  if (cost < 0.01) {
    return `$${(cost * 100).toFixed(4)}¢`;
  }
  return `$${cost.toFixed(4)}`;
}

/**
 * Format duration for display
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(1)}s`;
}

/**
 * Calculate estimated cost for generation
 */
export function estimateGenerationCost(): number {
  // Average cost per generation (5 lines)
  return 0.0003; // $0.0003 or 0.03 cents
}
