/**
 * Favorites Management Functions
 * Handles CRUD operations for date profile favorites
 */

import { supabase } from './supabase';

export interface Favorite {
  id: string;
  profile_id: string;
  icon: string;
  category: string;
  value: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetch all favorites for a date profile
 */
export async function fetchFavorites(profileId: string) {
  try {
    const { data, error } = await supabase
      .from('date_profile_favorites')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching favorites:', error);
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: data || [], error: null };
  } catch (err: any) {
    console.error('Error in fetchFavorites:', err);
    return { success: false, data: null, error: err.message };
  }
}

/**
 * Add a new favorite
 */
export async function addFavorite(favorite: Omit<Favorite, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('date_profile_favorites')
      .insert({
        profile_id: favorite.profile_id,
        icon: favorite.icon,
        category: favorite.category,
        value: favorite.value,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding favorite:', error);
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data, error: null };
  } catch (err: any) {
    console.error('Error in addFavorite:', err);
    return { success: false, data: null, error: err.message };
  }
}

/**
 * Update an existing favorite
 */
export async function updateFavorite(id: string, updates: Partial<Pick<Favorite, 'icon' | 'category' | 'value'>>) {
  try {
    const { data, error } = await supabase
      .from('date_profile_favorites')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating favorite:', error);
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data, error: null };
  } catch (err: any) {
    console.error('Error in updateFavorite:', err);
    return { success: false, data: null, error: err.message };
  }
}

/**
 * Delete a favorite
 */
export async function deleteFavorite(id: string) {
  try {
    const { error } = await supabase
      .from('date_profile_favorites')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting favorite:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err: any) {
    console.error('Error in deleteFavorite:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Delete all favorites for a profile
 */
export async function deleteAllFavorites(profileId: string) {
  try {
    const { error } = await supabase
      .from('date_profile_favorites')
      .delete()
      .eq('profile_id', profileId);

    if (error) {
      console.error('Error deleting all favorites:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err: any) {
    console.error('Error in deleteAllFavorites:', err);
    return { success: false, error: err.message };
  }
}
