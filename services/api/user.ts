/**
 * User API Service
 * All user-related API calls
 */

import { apiClient } from './client';

// ============================================
// TYPES
// ============================================

export interface User {
  id: string;
  phone: string;
  name: string;
  email?: string;
  avatar?: string;
  bio?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  height?: number;
  interests?: string[];
  photos?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  bio?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  height?: number;
  interests?: string[];
}

export interface UploadPhotoResponse {
  url: string;
  photoId: string;
}

// ============================================
// USER API
// ============================================

export const userAPI = {
  /**
   * Get user profile
   */
  getProfile: async (userId?: string): Promise<User> => {
    const url = userId ? `/users/${userId}` : '/users/me';
    return apiClient.get<User>(url);
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    return apiClient.patch<User>('/users/me', data);
  },

  /**
   * Upload profile photo
   */
  uploadPhoto: async (
    file: File | Blob,
    onProgress?: (progress: number) => void
  ): Promise<UploadPhotoResponse> => {
    const formData = new FormData();
    formData.append('photo', file);

    return apiClient.upload<UploadPhotoResponse>(
      '/users/me/photos',
      formData,
      onProgress
    );
  },

  /**
   * Delete profile photo
   */
  deletePhoto: async (photoId: string): Promise<void> => {
    return apiClient.delete(`/users/me/photos/${photoId}`);
  },

  /**
   * Update interests
   */
  updateInterests: async (interests: string[]): Promise<User> => {
    return apiClient.patch<User>('/users/me/interests', { interests });
  },

  /**
   * Delete account
   */
  deleteAccount: async (): Promise<void> => {
    return apiClient.delete('/users/me');
  },
};
