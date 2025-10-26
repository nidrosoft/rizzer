/**
 * Date Profiles API Service
 * Handles all Supabase operations for date profiles
 */

import { supabase } from './supabase';
import { DateProfileData, BasicInfo, InterestData } from '@/types/dateProfile';

// ==================== FETCH OPERATIONS ====================

/**
 * Fetch all date profiles for a user
 */
export async function fetchUserDateProfiles(userId: string) {
  try {
    const { data, error } = await supabase
      .from('date_profiles')
      .select(`
        *,
        date_profile_photos (
          id,
          photo_url,
          order_index
        ),
        date_profile_interests (
          hobbies,
          favorite_color,
          favorite_flower,
          favorite_foods,
          favorite_music,
          dislikes,
          personality_traits
        ),
        date_profile_notes (
          id,
          content,
          style,
          category,
          created_at
        )
      `)
      .eq('user_id', userId)
      .eq('archived', false)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform database data to app format
    const profiles: DateProfileData[] = (data || []).map(transformProfileData);

    return { success: true, data: profiles, error: null };
  } catch (err: any) {
    console.error('Error fetching date profiles:', err);
    return { success: false, data: null, error: err.message };
  }
}

/**
 * Fetch a single date profile by ID
 */
export async function getDateProfileById(profileId: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from('date_profiles')
      .select(`
        *,
        date_profile_photos (
          id,
          photo_url,
          order_index
        ),
        date_profile_interests (
          hobbies,
          favorite_color,
          favorite_flower,
          favorite_foods,
          favorite_music,
          dislikes,
          personality_traits
        ),
        date_profile_notes (
          id,
          content,
          style,
          category,
          created_at,
          updated_at
        ),
        date_profile_dates (
          id,
          title,
          date,
          location,
          rating
        ),
        date_profile_memories (
          id,
          title,
          date
        ),
        date_profile_important_dates (
          id,
          title,
          date,
          type
        )
      `)
      .eq('id', profileId)
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    const profile = transformProfileData(data);

    return { success: true, data: profile, error: null };
  } catch (err: any) {
    console.error('Error fetching date profile:', err);
    return { success: false, data: null, error: err.message };
  }
}

/**
 * Search date profiles by name
 */
export async function searchDateProfiles(userId: string, query: string) {
  try {
    const { data, error } = await supabase
      .from('date_profiles')
      .select('*')
      .eq('user_id', userId)
      .ilike('name', `%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const profiles: DateProfileData[] = (data || []).map(transformProfileData);

    return { success: true, data: profiles, error: null };
  } catch (err: any) {
    console.error('Error searching date profiles:', err);
    return { success: false, data: null, error: err.message };
  }
}

/**
 * Filter date profiles by relationship status
 */
export async function filterDateProfiles(
  userId: string,
  status: 'talking' | 'dating' | 'exclusive' | 'engaged'
) {
  try {
    const { data, error } = await supabase
      .from('date_profiles')
      .select('*')
      .eq('user_id', userId)
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const profiles: DateProfileData[] = (data || []).map(transformProfileData);

    return { success: true, data: profiles, error: null };
  } catch (err: any) {
    console.error('Error filtering date profiles:', err);
    return { success: false, data: null, error: err.message };
  }
}

// ==================== CREATE OPERATIONS ====================

/**
 * Create a new date profile
 */
export async function createDateProfile(
  userId: string,
  profileData: {
    name: string;
    age?: number;
    birthday?: Date;
    profession?: string;
    status: string;
    startDate: Date;
    howWeMet?: string;
    location?: any;
  }
) {
  try {
    const { data, error } = await supabase
      .from('date_profiles')
      .insert({
        user_id: userId,
        name: profileData.name,
        age: profileData.age,
        birthday: profileData.birthday,
        profession: profileData.profession,
        status: profileData.status,
        start_date: profileData.startDate,
        how_we_met: profileData.howWeMet,
        location: profileData.location,
        total_dates: 0,
        memories_count: 0,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (err: any) {
    console.error('Error creating date profile:', err);
    return { success: false, data: null, error: err.message };
  }
}

/**
 * Add profile interests
 */
export async function addProfileInterests(
  profileId: string,
  interests: {
    hobbies?: string[];
    favoriteColor?: string;
    favoriteFlower?: string;
    favoriteFoods?: string[];
    favoriteMusic?: string[];
    dislikes?: string[];
    personalityTraits?: string[];
  }
) {
  try {
    const { data, error } = await supabase
      .from('date_profile_interests')
      .insert({
        date_profile_id: profileId,
        hobbies: interests.hobbies,
        favorite_color: interests.favoriteColor,
        favorite_flower: interests.favoriteFlower,
        favorite_foods: interests.favoriteFoods,
        favorite_music: interests.favoriteMusic,
        dislikes: interests.dislikes,
        personality_traits: interests.personalityTraits,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (err: any) {
    console.error('Error adding profile interests:', err);
    return { success: false, data: null, error: err.message };
  }
}

// ==================== UPDATE OPERATIONS ====================

/**
 * Update date profile basic info
 */
export async function updateDateProfile(
  profileId: string,
  updates: Partial<{
    name: string;
    age: number;
    birthday: Date;
    profession: string;
    status: string;
    startDate: Date;
    howWeMet: string;
    location: any;
  }>
) {
  try {
    const { data, error } = await supabase
      .from('date_profiles')
      .update({
        name: updates.name,
        age: updates.age,
        birthday: updates.birthday,
        profession: updates.profession,
        status: updates.status,
        start_date: updates.startDate,
        how_we_met: updates.howWeMet,
        location: updates.location,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profileId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (err: any) {
    console.error('Error updating date profile:', err);
    return { success: false, data: null, error: err.message };
  }
}

/**
 * Update profile interests
 */
export async function updateProfileInterests(
  profileId: string,
  interests: Partial<{
    hobbies: string[];
    favoriteColor: string;
    favoriteFlower: string;
    favoriteFoods: string[];
    favoriteMusic: string[];
    dislikes: string[];
    personalityTraits: string[];
  }>
) {
  try {
    const { data, error } = await supabase
      .from('date_profile_interests')
      .update({
        hobbies: interests.hobbies,
        favorite_color: interests.favoriteColor,
        favorite_flower: interests.favoriteFlower,
        favorite_foods: interests.favoriteFoods,
        favorite_music: interests.favoriteMusic,
        dislikes: interests.dislikes,
        personality_traits: interests.personalityTraits,
        updated_at: new Date().toISOString(),
      })
      .eq('date_profile_id', profileId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (err: any) {
    console.error('Error updating profile interests:', err);
    return { success: false, data: null, error: err.message };
  }
}


/**
 * Add photo to date profile
 */
export async function addProfilePhoto(
  profileId: string,
  photoUrl: string,
  orderIndex: number = 0
) {
  try {
    const { data, error } = await supabase
      .from('date_profile_photos')
      .insert({
        date_profile_id: profileId,
        photo_url: photoUrl,
        order_index: orderIndex,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding profile photo:', error);
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data, error: null };
  } catch (err: any) {
    console.error('Error in addProfilePhoto:', err);
    return { success: false, data: null, error: err.message };
  }
}

/**
 * Delete profile photo
 */
export async function deleteProfilePhoto(photoId: string, photoUrl: string) {
  try {
    // Delete from database
    const { error } = await supabase
      .from('date_profile_photos')
      .delete()
      .eq('id', photoId);

    if (error) throw error;

    // Note: Photo deletion from storage should be handled separately
    // using the deletePhoto function from storage.ts

    return { success: true, error: null };
  } catch (err: any) {
    console.error('Error deleting profile photo:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Get all photos for a profile
 */
export async function getProfilePhotos(profileId: string) {
  try {
    const { data, error } = await supabase
      .from('date_profile_photos')
      .select('*')
      .eq('date_profile_id', profileId)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching profile photos:', error);
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data, error: null };
  } catch (err: any) {
    console.error('Error in getProfilePhotos:', err);
    return { success: false, data: null, error: err.message };
  }
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Transform database data to app DateProfileData format
 */
function transformProfileData(dbProfile: any): DateProfileData {
  // Get photos sorted by order_index
  const photos =
    dbProfile.date_profile_photos
      ?.sort((a: any, b: any) => a.order_index - b.order_index)
      .map((p: any) => p.photo_url) || [];
  
  // If no photos in date_profile_photos table, use primary_photo from main table
  if (photos.length === 0 && dbProfile.primary_photo) {
    photos.push(dbProfile.primary_photo);
  }

  // Get interests data
  const interestsData = dbProfile.date_profile_interests?.[0] || {};
  
  // Debug logging for interests
  console.log('🔍 [transformProfileData] Interests Debug:', {
    hasInterestsArray: !!dbProfile.date_profile_interests,
    interestsArrayLength: dbProfile.date_profile_interests?.length,
    interestsData: interestsData,
    hobbies: interestsData.hobbies,
    hobbiesLength: interestsData.hobbies?.length,
  });

  // Get notes
  const notes =
    dbProfile.date_profile_notes?.map((note: any) => ({
      id: note.id,
      content: note.content,
      createdAt: new Date(note.created_at),
      style: note.style || 'default',
      category: note.category,
    })) || [];

  // Calculate stats
  const startDate = new Date(dbProfile.start_date);
  const daysTogether = Math.floor(
    (Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    id: dbProfile.id,
    basicInfo: {
      name: dbProfile.name,
      age: dbProfile.age || 0,
      birthday: dbProfile.birthday ? new Date(dbProfile.birthday) : undefined,
      profession: dbProfile.occupation || '',  // Database column is 'occupation'
      photo: photos[0] || '',
      status: dbProfile.relationship_stage || dbProfile.status,  // Use relationship_stage, fallback to status
      startDate: startDate,
      howWeMet: dbProfile.how_we_met,
    },
    stats: {
      daysTogether,
      totalDates: dbProfile.total_dates || 0,
      memoriesCount: dbProfile.memories_count || 0,
    },
    interests: {
      hobbies: interestsData.hobbies || [],
      favoriteThings: {
        color: interestsData.favorite_color,
        flower: interestsData.favorite_flower,
        food: interestsData.favorite_foods || [],
        music: interestsData.favorite_music || [],
      },
      dislikes: interestsData.dislikes || [],
      personality: interestsData.personality_traits || [],
    },
    notes,
    photos,
  };
}

// ==================== ARCHIVE OPERATIONS ====================

/**
 * Fetch archived date profiles for a user
 */
export async function fetchArchivedProfiles(userId: string) {
  try {
    const { data, error } = await supabase
      .from('date_profiles')
      .select(`
        *,
        date_profile_photos (
          id,
          photo_url,
          order_index
        )
      `)
      .eq('user_id', userId)
      .eq('archived', true)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    // Transform database data to app format (simplified for archived view)
    const profiles = (data || []).map(profile => ({
      id: profile.id,
      name: profile.name,
      age: profile.age,
      photo: profile.date_profile_photos?.[0]?.photo_url || null,
      status: profile.status,
      archivedAt: profile.updated_at,
    }));

    return { success: true, data: profiles, error: null };
  } catch (err: any) {
    console.error('Error fetching archived profiles:', err);
    return { success: false, data: null, error: err.message };
  }
}

/**
 * Archive a date profile
 */
export async function archiveDateProfile(profileId: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from('date_profiles')
      .update({ archived: true })
      .eq('id', profileId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error archiving profile:', error);
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data, error: null };
  } catch (err: any) {
    console.error('Error in archiveDateProfile:', err);
    return { success: false, data: null, error: err.message };
  }
}

/**
 * Restore an archived date profile
 */
export async function restoreDateProfile(profileId: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from('date_profiles')
      .update({ archived: false })
      .eq('id', profileId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error restoring profile:', error);
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data, error: null };
  } catch (err: any) {
    console.error('Error in restoreDateProfile:', err);
    return { success: false, data: null, error: err.message };
  }
}

// ==================== DELETE OPERATIONS ====================

/**
 * Delete a date profile and all associated data
 */
export async function deleteDateProfile(profileId: string, userId: string) {
  try {
    // Note: Cascade delete is handled by database foreign key constraints
    // This will automatically delete:
    // - date_profile_interests
    // - date_profile_photos
    // - date_profile_notes
    // - date_profile_note_folders
    // - date_profile_favorites
    
    const { error } = await supabase
      .from('date_profiles')
      .delete()
      .eq('id', profileId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting profile:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err: any) {
    console.error('Error in deleteDateProfile:', err);
    return { success: false, error: err.message };
  }
}
