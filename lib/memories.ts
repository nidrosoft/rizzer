/**
 * Date Profile Memories Functions
 * CRUD operations for memories with photo management
 */

import { supabase } from './supabase';
import { uploadMemoryPhoto, deleteMemoryPhoto } from './storage';
import { Memory, CreateMemoryInput, UpdateMemoryInput } from '@/types/memory';

/**
 * Fetch all memories for a date profile
 * Returns memories ordered by date (most recent first)
 */
export async function getMemories(profileId: string): Promise<{
  success: boolean;
  memories?: Memory[];
  error?: string;
}> {
  try {
    console.log('📸 [getMemories] Fetching memories for profile:', profileId);

    const { data, error } = await supabase
      .from('date_profile_memories')
      .select('*')
      .eq('date_profile_id', profileId)
      .order('date', { ascending: false });

    if (error) throw error;

    console.log('✅ [getMemories] Fetched', data?.length || 0, 'memories');
    return { success: true, memories: data as Memory[] };
  } catch (error: any) {
    console.error('❌ [getMemories] Error:', error);
    return { success: false, error: error.message || 'Failed to fetch memories' };
  }
}

/**
 * Fetch a single memory by ID
 */
export async function getMemoryById(memoryId: string): Promise<{
  success: boolean;
  memory?: Memory;
  error?: string;
}> {
  try {
    console.log('📸 [getMemoryById] Fetching memory:', memoryId);

    const { data, error } = await supabase
      .from('date_profile_memories')
      .select('*')
      .eq('id', memoryId)
      .single();

    if (error) throw error;

    console.log('✅ [getMemoryById] Memory fetched');
    return { success: true, memory: data as Memory };
  } catch (error: any) {
    console.error('❌ [getMemoryById] Error:', error);
    return { success: false, error: error.message || 'Failed to fetch memory' };
  }
}

/**
 * Create a new memory with photos
 * Uploads photos to storage and saves URLs to database
 */
export async function createMemory(input: CreateMemoryInput): Promise<{
  success: boolean;
  memory?: Memory;
  error?: string;
}> {
  try {
    console.log('📸 [createMemory] Creating memory:', {
      title: input.title,
      type: input.memory_type,
      photoCount: input.photo_uris?.length || 0,
    });

    // 1. Upload photos first (if provided)
    let photoUrls: string[] = [];
    
    if (input.photo_uris && input.photo_uris.length > 0) {
      console.log('📤 [createMemory] Uploading', input.photo_uris.length, 'photos...');
      
      for (let i = 0; i < input.photo_uris.length; i++) {
        const uri = input.photo_uris[i];
        
        const { success, url, error: uploadError } = await uploadMemoryPhoto(
          uri,
          input.date_profile_id
        );

        if (success && url) {
          photoUrls.push(url);
          console.log(`✅ [createMemory] Photo ${i + 1}/${input.photo_uris.length} uploaded`);
        } else {
          console.error(`❌ [createMemory] Failed to upload photo ${i + 1}:`, uploadError);
          // Continue with other photos even if one fails
        }
      }
    }

    // 2. Create memory record in database
    const { data, error } = await supabase
      .from('date_profile_memories')
      .insert({
        date_profile_id: input.date_profile_id,
        title: input.title,
        description: input.description || null,
        date: input.date,
        memory_type: input.memory_type,
        photos: photoUrls.length > 0 ? photoUrls : null,
        tags: input.tags && input.tags.length > 0 ? input.tags : null,
        likes: 0,
      })
      .select()
      .single();

    if (error) throw error;

    console.log('✅ [createMemory] Memory created successfully with', photoUrls.length, 'photos');
    return { success: true, memory: data as Memory };
  } catch (error: any) {
    console.error('❌ [createMemory] Error:', error);
    return { success: false, error: error.message || 'Failed to create memory' };
  }
}

/**
 * Update an existing memory
 * Note: To update photos, use addMemoryPhotos or removeMemoryPhoto
 */
export async function updateMemory(
  memoryId: string,
  input: UpdateMemoryInput
): Promise<{
  success: boolean;
  memory?: Memory;
  error?: string;
}> {
  try {
    console.log('📸 [updateMemory] Updating memory:', memoryId);

    const updateData: any = {
      ...input,
      updated_at: new Date().toISOString(),
    };

    // Handle tags - convert empty array to null
    if (input.tags !== undefined) {
      updateData.tags = input.tags.length > 0 ? input.tags : null;
    }

    const { data, error } = await supabase
      .from('date_profile_memories')
      .update(updateData)
      .eq('id', memoryId)
      .select()
      .single();

    if (error) throw error;

    console.log('✅ [updateMemory] Memory updated successfully');
    return { success: true, memory: data as Memory };
  } catch (error: any) {
    console.error('❌ [updateMemory] Error:', error);
    return { success: false, error: error.message || 'Failed to update memory' };
  }
}

/**
 * Delete a memory and all its photos
 * Removes photos from storage and deletes database record
 */
export async function deleteMemory(memoryId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    console.log('📸 [deleteMemory] Deleting memory:', memoryId);

    // 1. Get memory to retrieve photo URLs
    const { data: memory, error: fetchError } = await supabase
      .from('date_profile_memories')
      .select('photos')
      .eq('id', memoryId)
      .single();

    if (fetchError) throw fetchError;

    // 2. Delete memory from database (this is the main operation)
    const { error: deleteError } = await supabase
      .from('date_profile_memories')
      .delete()
      .eq('id', memoryId);

    if (deleteError) throw deleteError;

    // 3. Delete photos from storage (best effort - don't fail if this errors)
    if (memory?.photos && memory.photos.length > 0) {
      console.log('🗑️ [deleteMemory] Deleting', memory.photos.length, 'photos from storage...');
      
      for (const photoUrl of memory.photos) {
        try {
          await deleteMemoryPhoto(photoUrl);
        } catch (photoError) {
          console.warn('⚠️ [deleteMemory] Failed to delete photo from storage:', photoError);
          // Continue deleting other photos
        }
      }
    }

    console.log('✅ [deleteMemory] Memory deleted successfully');
    return { success: true };
  } catch (error: any) {
    console.error('❌ [deleteMemory] Error:', error);
    return { success: false, error: error.message || 'Failed to delete memory' };
  }
}

/**
 * Add photos to an existing memory
 * Uploads new photos and appends URLs to memory's photos array
 */
export async function addMemoryPhotos(
  memoryId: string,
  profileId: string,
  photoUris: string[]
): Promise<{
  success: boolean;
  photoUrls?: string[];
  error?: string;
}> {
  try {
    console.log('📸 [addMemoryPhotos] Adding', photoUris.length, 'photos to memory:', memoryId);

    // 1. Upload new photos
    const newPhotoUrls: string[] = [];
    
    for (let i = 0; i < photoUris.length; i++) {
      const uri = photoUris[i];
      
      const { success, url, error: uploadError } = await uploadMemoryPhoto(uri, profileId);

      if (success && url) {
        newPhotoUrls.push(url);
        console.log(`✅ [addMemoryPhotos] Photo ${i + 1}/${photoUris.length} uploaded`);
      } else {
        console.error(`❌ [addMemoryPhotos] Failed to upload photo ${i + 1}:`, uploadError);
      }
    }

    if (newPhotoUrls.length === 0) {
      throw new Error('No photos were uploaded successfully');
    }

    // 2. Get current photos
    const { data: memory, error: fetchError } = await supabase
      .from('date_profile_memories')
      .select('photos')
      .eq('id', memoryId)
      .single();

    if (fetchError) throw fetchError;

    // 3. Append new photos to existing array
    const currentPhotos = memory?.photos || [];
    const updatedPhotos = [...currentPhotos, ...newPhotoUrls];

    // 4. Update memory with new photos array
    const { error: updateError } = await supabase
      .from('date_profile_memories')
      .update({
        photos: updatedPhotos,
        updated_at: new Date().toISOString(),
      })
      .eq('id', memoryId);

    if (updateError) throw updateError;

    console.log('✅ [addMemoryPhotos] Added', newPhotoUrls.length, 'photos to memory');
    return { success: true, photoUrls: newPhotoUrls };
  } catch (error: any) {
    console.error('❌ [addMemoryPhotos] Error:', error);
    return { success: false, error: error.message || 'Failed to add photos' };
  }
}

/**
 * Remove a photo from a memory
 * Deletes photo from storage and removes URL from memory's photos array
 */
export async function removeMemoryPhoto(
  memoryId: string,
  photoUrl: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    console.log('📸 [removeMemoryPhoto] Removing photo from memory:', memoryId);

    // 1. Get current photos
    const { data: memory, error: fetchError } = await supabase
      .from('date_profile_memories')
      .select('photos')
      .eq('id', memoryId)
      .single();

    if (fetchError) throw fetchError;

    if (!memory?.photos || memory.photos.length === 0) {
      throw new Error('Memory has no photos');
    }

    // 2. Remove photo URL from array
    const updatedPhotos = memory.photos.filter((url: string) => url !== photoUrl);

    // 3. Update memory with new photos array
    const { error: updateError } = await supabase
      .from('date_profile_memories')
      .update({
        photos: updatedPhotos.length > 0 ? updatedPhotos : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', memoryId);

    if (updateError) throw updateError;

    // 4. Delete photo from storage (best effort)
    try {
      await deleteMemoryPhoto(photoUrl);
    } catch (photoError) {
      console.warn('⚠️ [removeMemoryPhoto] Failed to delete photo from storage:', photoError);
      // Don't fail the operation if storage deletion fails
    }

    console.log('✅ [removeMemoryPhoto] Photo removed from memory');
    return { success: true };
  } catch (error: any) {
    console.error('❌ [removeMemoryPhoto] Error:', error);
    return { success: false, error: error.message || 'Failed to remove photo' };
  }
}

/**
 * Increment likes count for a memory
 */
export async function likeMemory(memoryId: string): Promise<{
  success: boolean;
  likes?: number;
  error?: string;
}> {
  try {
    console.log('❤️ [likeMemory] Liking memory:', memoryId);

    // Get current likes count
    const { data: memory, error: fetchError } = await supabase
      .from('date_profile_memories')
      .select('likes')
      .eq('id', memoryId)
      .single();

    if (fetchError) throw fetchError;

    const newLikes = (memory?.likes || 0) + 1;

    // Update likes count
    const { error: updateError } = await supabase
      .from('date_profile_memories')
      .update({ likes: newLikes })
      .eq('id', memoryId);

    if (updateError) throw updateError;

    console.log('✅ [likeMemory] Memory liked, new count:', newLikes);
    return { success: true, likes: newLikes };
  } catch (error: any) {
    console.error('❌ [likeMemory] Error:', error);
    return { success: false, error: error.message || 'Failed to like memory' };
  }
}
