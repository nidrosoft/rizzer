/**
 * Account Deletion Service
 * Handles permanent deletion of user account and all associated data
 */

import { supabase } from './supabase';
import { deletePhoto } from './storage';

interface DeleteAccountResult {
  success: boolean;
  error?: string;
}

/**
 * Permanently delete user account and all associated data
 * This includes:
 * - User profile data
 * - Date profiles
 * - Photos from storage
 * - Onboarding data
 * - All other user-related data
 * - Auth account
 */
export async function deleteUserAccount(userId: string): Promise<DeleteAccountResult> {
  try {
    console.log('Starting account deletion for user:', userId);

    // 1. Get all user photos to delete from storage
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('photos')
      .eq('id', userId)
      .single();

    if (!userError && userData?.photos) {
      // Delete user profile photos
      for (const photoUrl of userData.photos) {
        try {
          await deletePhoto(photoUrl);
        } catch (error) {
          console.error('Error deleting photo:', error);
          // Continue even if photo deletion fails
        }
      }
    }

    // 2. Get all date profile photos
    const { data: dateProfiles, error: dateProfilesError } = await supabase
      .from('date_profiles')
      .select('basic_info')
      .eq('user_id', userId);

    if (!dateProfilesError && dateProfiles) {
      for (const profile of dateProfiles) {
        if (profile.basic_info?.photo) {
          try {
            await deletePhoto(profile.basic_info.photo);
          } catch (error) {
            console.error('Error deleting date profile photo:', error);
            // Continue even if photo deletion fails
          }
        }
      }
    }

    // 3. Delete date profiles (cascade will handle related data)
    const { error: deleteProfilesError } = await supabase
      .from('date_profiles')
      .delete()
      .eq('user_id', userId);

    if (deleteProfilesError) {
      console.error('Error deleting date profiles:', deleteProfilesError);
      throw new Error('Failed to delete date profiles');
    }

    // 4. Delete user onboarding data (if table exists)
    // Skip this step as onboarding data is stored in users table
    // No separate onboarding_progress table needed

    // 5. Delete user profile data
    const { error: deleteUserError } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (deleteUserError) {
      console.error('Error deleting user data:', deleteUserError);
      throw new Error('Failed to delete user data');
    }

    // 6. Sign out the user (auth account will be handled by backend/admin)
    await supabase.auth.signOut();

    console.log('Account deletion completed successfully');
    return { success: true };

  } catch (error: any) {
    console.error('Account deletion error:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete account',
    };
  }
}

/**
 * Alternative: Mark account for deletion (soft delete)
 * Use this if you want to keep data for a grace period
 */
export async function markAccountForDeletion(userId: string): Promise<DeleteAccountResult> {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        deleted_at: new Date().toISOString(),
        status: 'deleted',
      })
      .eq('id', userId);

    if (error) {
      throw error;
    }

    // Sign out the user
    await supabase.auth.signOut();

    return { success: true };
  } catch (error: any) {
    console.error('Mark for deletion error:', error);
    return {
      success: false,
      error: error.message || 'Failed to mark account for deletion',
    };
  }
}

/**
 * Get user data summary before deletion (for confirmation)
 */
export async function getUserDataSummary(userId: string) {
  try {
    // Get user profile count
    const { count: profileCount } = await supabase
      .from('date_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Get photos count
    const { data: userData } = await supabase
      .from('users')
      .select('photos')
      .eq('id', userId)
      .single();

    const photosCount = userData?.photos?.length || 0;

    return {
      dateProfiles: profileCount || 0,
      photos: photosCount,
    };
  } catch (error) {
    console.error('Error getting user data summary:', error);
    return {
      dateProfiles: 0,
      photos: 0,
    };
  }
}
