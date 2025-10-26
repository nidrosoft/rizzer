/**
 * Supabase Storage Utilities
 * Handles photo uploads, downloads, and management
 */

import { supabase } from './supabase';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { decode } from 'base64-arraybuffer';

const STORAGE_BUCKET = 'user-photos';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const IMAGE_QUALITY = 0.8;
const MAX_WIDTH = 1080;
const MAX_HEIGHT = 1080;

/**
 * Request camera/gallery permissions
 */
export async function requestMediaPermissions() {
  const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
  const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  return {
    camera: cameraStatus === 'granted',
    gallery: galleryStatus === 'granted',
  };
}

/**
 * Pick image from gallery
 */
export async function pickImageFromGallery() {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: IMAGE_QUALITY,
    });

    if (!result.canceled && result.assets[0]) {
      return { success: true, uri: result.assets[0].uri };
    }

    return { success: false, error: 'No image selected' };
  } catch (error: any) {
    console.error('Error picking image:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Take photo with camera
 */
export async function takePhoto() {
  try {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: IMAGE_QUALITY,
    });

    if (!result.canceled && result.assets[0]) {
      return { success: true, uri: result.assets[0].uri };
    }

    return { success: false, error: 'No photo taken' };
  } catch (error: any) {
    console.error('Error taking photo:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Compress and resize image
 */
export async function compressImage(uri: string) {
  try {
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: MAX_WIDTH, height: MAX_HEIGHT } }],
      { compress: IMAGE_QUALITY, format: ImageManipulator.SaveFormat.JPEG }
    );

    return { success: true, uri: manipulatedImage.uri };
  } catch (error: any) {
    console.error('Error compressing image:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Upload image to Supabase Storage
 */
export async function uploadPhoto(uri: string, userId: string): Promise<{
  success: boolean;
  url?: string;
  error?: string;
}> {
  try {
    // Compress image first
    const compressed = await compressImage(uri);
    if (!compressed.success) {
      return { success: false, error: compressed.error };
    }

    // Read file as base64
    const response = await fetch(compressed.uri!);
    const blob = await response.blob();
    const arrayBuffer = await new Response(blob).arrayBuffer();

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${userId}/${timestamp}.jpg`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filename, arrayBuffer, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filename);

    console.log('✅ Photo uploaded successfully');
    return { success: true, url: urlData.publicUrl };
  } catch (error: any) {
    console.error('❌ Failed to upload photo:', error);
    return { success: false, error: error.message || 'Failed to upload photo' };
  }
}

/**
 * Delete photo from Supabase Storage
 */
export async function deletePhoto(url: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Extract filename from URL
    const filename = url.split('/').slice(-2).join('/');

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filename]);

    if (error) throw error;

    console.log('✅ Photo deleted successfully');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Failed to delete photo:', error);
    return { success: false, error: error.message || 'Failed to delete photo' };
  }
}

/**
 * Upload multiple photos
 */
export async function uploadMultiplePhotos(
  uris: string[],
  userId: string,
  onProgress?: (current: number, total: number) => void
): Promise<{
  success: boolean;
  urls?: string[];
  error?: string;
}> {
  try {
    const urls: string[] = [];

    for (let i = 0; i < uris.length; i++) {
      onProgress?.(i + 1, uris.length);

      const result = await uploadPhoto(uris[i], userId);
      if (!result.success) {
        return { success: false, error: result.error };
      }

      urls.push(result.url!);
    }

    return { success: true, urls };
  } catch (error: any) {
    console.error('❌ Failed to upload photos:', error);
    return { success: false, error: error.message || 'Failed to upload photos' };
  }
}

/**
 * Validate image file
 */
export async function validateImage(uri: string): Promise<{
  valid: boolean;
  error?: string;
}> {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    // Check file size
    if (blob.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `Image too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      };
    }

    // Check file type
    if (!blob.type.startsWith('image/')) {
      return { valid: false, error: 'File must be an image' };
    }

    return { valid: true };
  } catch (error: any) {
    return { valid: false, error: error.message };
  }
}

/**
 * Compress image for gallery (preserves aspect ratio)
 */
export async function compressImageForGallery(uri: string) {
  try {
    // Get image info first
    const response = await fetch(uri);
    const blob = await response.blob();
    
    // Just compress without resizing to preserve aspect ratio
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [], // No resize, keep original dimensions
      { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
    );

    return { success: true, uri: manipulatedImage.uri };
  } catch (error: any) {
    console.error('Error compressing image for gallery:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Upload date profile photo (for profile picture - crops to square)
 */
export async function uploadDateProfilePhoto(
  uri: string,
  userId: string,
  profileId: string
): Promise<{
  success: boolean;
  url?: string;
  error?: string;
}> {
  try {
    // Compress image first
    const compressed = await compressImage(uri);
    if (!compressed.success) {
      return { success: false, error: compressed.error };
    }

    // Read file as base64
    const response = await fetch(compressed.uri!);
    const blob = await response.blob();
    const arrayBuffer = await new Response(blob).arrayBuffer();

    // Generate unique filename with profile folder
    const timestamp = Date.now();
    const filename = `${userId}/date-profiles/${profileId}/${timestamp}.jpg`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filename, arrayBuffer, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filename);

    console.log('✅ Date profile photo uploaded successfully');
    return { success: true, url: urlData.publicUrl };
  } catch (error: any) {
    console.error('❌ Failed to upload date profile photo:', error);
    return { success: false, error: error.message || 'Failed to upload photo' };
  }
}

/**
 * Upload gallery photo (preserves original aspect ratio)
 */
export async function uploadGalleryPhoto(
  uri: string,
  userId: string,
  profileId: string
): Promise<{
  success: boolean;
  url?: string;
  error?: string;
}> {
  try {
    // Compress without resizing to preserve aspect ratio
    const compressed = await compressImageForGallery(uri);
    if (!compressed.success) {
      return { success: false, error: compressed.error };
    }

    // Read file as ArrayBuffer
    const response = await fetch(compressed.uri!);
    const blob = await response.blob();
    const arrayBuffer = await new Response(blob).arrayBuffer();

    // Generate unique filename with gallery folder
    const timestamp = Date.now();
    const filename = `${userId}/date-profiles/${profileId}/gallery/${timestamp}.jpg`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filename, arrayBuffer, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filename);

    console.log('✅ Gallery photo uploaded successfully');
    return { success: true, url: urlData.publicUrl };
  } catch (error: any) {
    console.error('❌ Failed to upload gallery photo:', error);
    return { success: false, error: error.message || 'Failed to upload photo' };
  }
}

/**
 * Upload memory photo (preserves original aspect ratio)
 * Storage path: {userId}/date-profiles/{profileId}/memories/{timestamp}.jpg
 */
export async function uploadMemoryPhoto(
  uri: string,
  profileId: string
): Promise<{
  success: boolean;
  url?: string;
  error?: string;
}> {
  try {
    // Compress without resizing to preserve aspect ratio
    const compressed = await compressImageForGallery(uri);
    if (!compressed.success) {
      return { success: false, error: compressed.error };
    }

    // Read file as ArrayBuffer
    const response = await fetch(compressed.uri!);
    const blob = await response.blob();
    const arrayBuffer = await new Response(blob).arrayBuffer();

    // Generate unique filename with memories folder
    // Note: We extract userId from the profile relationship in the database
    // For now, using a simpler path structure
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const filename = `date-profiles/${profileId}/memories/${timestamp}-${random}.jpg`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filename, arrayBuffer, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filename);

    console.log('✅ Memory photo uploaded successfully');
    return { success: true, url: urlData.publicUrl };
  } catch (error: any) {
    console.error('❌ Failed to upload memory photo:', error);
    return { success: false, error: error.message || 'Failed to upload photo' };
  }
}

/**
 * Delete memory photo from storage
 * Extracts filename from URL and removes from bucket
 */
export async function deleteMemoryPhoto(photoUrl: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Extract filename from URL
    // URL format: https://.../storage/v1/object/public/user-photos/date-profiles/{profileId}/memories/{timestamp}.jpg
    const urlParts = photoUrl.split('/');
    const bucketIndex = urlParts.findIndex(part => part === STORAGE_BUCKET);
    
    if (bucketIndex === -1) {
      throw new Error('Invalid photo URL format');
    }

    // Get everything after the bucket name
    const filename = urlParts.slice(bucketIndex + 1).join('/');

    console.log('🗑️ Deleting memory photo:', filename);

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filename]);

    if (error) throw error;

    console.log('✅ Memory photo deleted successfully');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Failed to delete memory photo:', error);
    return { success: false, error: error.message || 'Failed to delete photo' };
  }
}
