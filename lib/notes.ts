/**
 * Notes Management Functions
 * Handles CRUD operations for date profile notes and folders
 */

import { supabase } from './supabase';

// =====================================================
// TYPES
// =====================================================

export interface NoteFolder {
  id: string;
  profile_id: string;
  name: string;
  color: 'blue' | 'yellow' | 'green' | 'purple' | 'pink' | 'orange';
  order_index: number;
  created_at?: string;
  updated_at?: string;
  note_count?: number; // Computed field
}

export interface Note {
  id: string;
  profile_id: string;
  folder_id?: string;
  title?: string;
  content: string;
  style: 'default' | 'important' | 'love' | 'idea' | 'reminder';
  category?: string;
  created_at?: string;
  updated_at?: string;
}

// =====================================================
// FOLDER FUNCTIONS
// =====================================================

/**
 * Fetch all folders for a date profile with note counts
 */
export async function fetchNoteFolders(profileId: string) {
  try {
    const { data, error } = await supabase
      .from('date_profile_note_folders')
      .select(`
        *,
        notes:date_profile_notes(count)
      `)
      .eq('profile_id', profileId)
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching note folders:', error);
      return { success: false, data: null, error: error.message };
    }

    // Transform data to include note_count
    const foldersWithCounts = data?.map(folder => ({
      ...folder,
      note_count: folder.notes?.[0]?.count || 0,
      notes: undefined, // Remove the notes object
    })) || [];

    return { success: true, data: foldersWithCounts, error: null };
  } catch (err: any) {
    console.error('Error in fetchNoteFolders:', err);
    return { success: false, data: null, error: err.message };
  }
}

/**
 * Create a new note folder
 */
export async function createNoteFolder(
  profileId: string,
  name: string,
  color: NoteFolder['color'],
  orderIndex?: number
) {
  try {
    const { data, error } = await supabase
      .from('date_profile_note_folders')
      .insert({
        profile_id: profileId,
        name,
        color,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating note folder:', error);
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data, error: null };
  } catch (err: any) {
    console.error('Error in createNoteFolder:', err);
    return { success: false, data: null, error: err.message };
  }
}

/**
 * Update a note folder
 */
export async function updateNoteFolder(
  folderId: string,
  updates: Partial<Pick<NoteFolder, 'name' | 'color' | 'order_index'>>
) {
  try {
    const { data, error } = await supabase
      .from('date_profile_note_folders')
      .update(updates)
      .eq('id', folderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating note folder:', error);
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data, error: null };
  } catch (err: any) {
    console.error('Error in updateNoteFolder:', err);
    return { success: false, data: null, error: err.message };
  }
}

/**
 * Delete a note folder (cascade deletes all notes in folder)
 */
export async function deleteNoteFolder(folderId: string) {
  try {
    const { error } = await supabase
      .from('date_profile_note_folders')
      .delete()
      .eq('id', folderId);

    if (error) {
      console.error('Error deleting note folder:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err: any) {
    console.error('Error in deleteNoteFolder:', err);
    return { success: false, error: err.message };
  }
}

// =====================================================
// NOTE FUNCTIONS
// =====================================================

/**
 * Fetch all notes for a date profile
 */
export async function fetchNotes(profileId: string) {
  try {
    const { data, error } = await supabase
      .from('date_profile_notes')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes:', error);
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: data || [], error: null };
  } catch (err: any) {
    console.error('Error in fetchNotes:', err);
    return { success: false, data: null, error: err.message };
  }
}

/**
 * Fetch notes by folder
 */
export async function fetchNotesByFolder(folderId: string) {
  try {
    const { data, error } = await supabase
      .from('date_profile_notes')
      .select('*')
      .eq('folder_id', folderId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes by folder:', error);
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: data || [], error: null };
  } catch (err: any) {
    console.error('Error in fetchNotesByFolder:', err);
    return { success: false, data: null, error: err.message };
  }
}

/**
 * Fetch recent notes for QuickNotesCard
 */
export async function fetchRecentNotes(profileId: string, limit: number = 5) {
  try {
    const { data, error } = await supabase
      .from('date_profile_notes')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent notes:', error);
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: data || [], error: null };
  } catch (err: any) {
    console.error('Error in fetchRecentNotes:', err);
    return { success: false, data: null, error: err.message };
  }
}

/**
 * Get total note count for a profile
 */
export async function getTotalNoteCount(profileId: string) {
  try {
    const { count, error } = await supabase
      .from('date_profile_notes')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', profileId);

    if (error) {
      console.error('Error getting note count:', error);
      return { success: false, count: 0, error: error.message };
    }

    return { success: true, count: count || 0, error: null };
  } catch (err: any) {
    console.error('Error in getTotalNoteCount:', err);
    return { success: false, count: 0, error: err.message };
  }
}

/**
 * Create a new note
 */
export async function createNote(
  profileId: string,
  content: string,
  options?: {
    folderId?: string;
    title?: string;
    style?: Note['style'];
    category?: string;
  }
) {
  try {
    const { data, error } = await supabase
      .from('date_profile_notes')
      .insert({
        profile_id: profileId,
        folder_id: options?.folderId,
        title: options?.title,
        content,
        style: options?.style || 'default',
        category: options?.category,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating note:', error);
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data, error: null };
  } catch (err: any) {
    console.error('Error in createNote:', err);
    return { success: false, data: null, error: err.message };
  }
}

/**
 * Update a note
 */
export async function updateNote(
  noteId: string,
  updates: Partial<Pick<Note, 'title' | 'content' | 'style' | 'folder_id' | 'category'>>
) {
  try {
    const { data, error } = await supabase
      .from('date_profile_notes')
      .update(updates)
      .eq('id', noteId)
      .select()
      .single();

    if (error) {
      console.error('Error updating note:', error);
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data, error: null };
  } catch (err: any) {
    console.error('Error in updateNote:', err);
    return { success: false, data: null, error: err.message };
  }
}

/**
 * Delete a note
 */
export async function deleteNote(noteId: string) {
  try {
    const { error } = await supabase
      .from('date_profile_notes')
      .delete()
      .eq('id', noteId);

    if (error) {
      console.error('Error deleting note:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err: any) {
    console.error('Error in deleteNote:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Delete all notes in a folder
 */
export async function deleteNotesByFolder(folderId: string) {
  try {
    const { error } = await supabase
      .from('date_profile_notes')
      .delete()
      .eq('folder_id', folderId);

    if (error) {
      console.error('Error deleting notes by folder:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err: any) {
    console.error('Error in deleteNotesByFolder:', err);
    return { success: false, error: err.message };
  }
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Search notes by content or title
 */
export async function searchNotes(profileId: string, query: string) {
  try {
    const { data, error } = await supabase
      .from('date_profile_notes')
      .select('*')
      .eq('profile_id', profileId)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching notes:', error);
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: data || [], error: null };
  } catch (err: any) {
    console.error('Error in searchNotes:', err);
    return { success: false, data: null, error: err.message };
  }
}

/**
 * Search folders by name
 */
export async function searchFolders(profileId: string, query: string) {
  try {
    const { data, error } = await supabase
      .from('date_profile_note_folders')
      .select('*')
      .eq('profile_id', profileId)
      .ilike('name', `%${query}%`)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error searching folders:', error);
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: data || [], error: null };
  } catch (err: any) {
    console.error('Error in searchFolders:', err);
    return { success: false, data: null, error: err.message };
  }
}
