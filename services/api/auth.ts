/**
 * Auth API Service
 * All authentication-related API calls
 */

import { apiClient } from './client';
import { SecureStorage } from '@/services/storage/secure';

// ============================================
// TYPES
// ============================================

export interface SendOTPRequest {
  phone: string;
}

export interface SendOTPResponse {
  success: boolean;
  message: string;
}

export interface VerifyOTPRequest {
  phone: string;
  otp: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    phone: string;
    name: string;
    email?: string;
    avatar?: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

// ============================================
// AUTH API
// ============================================

export const authAPI = {
  /**
   * Send OTP to phone number
   */
  sendOTP: async (phone: string): Promise<SendOTPResponse> => {
    return apiClient.post<SendOTPResponse>('/auth/send-otp', { phone });
  },

  /**
   * Verify OTP and login
   */
  verifyOTP: async (phone: string, otp: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/verify-otp', {
      phone,
      otp,
    });

    // Save auth session
    if (response.token && response.user) {
      await SecureStorage.saveAuthSession({
        token: response.token,
        refreshToken: response.refreshToken,
        userId: response.user.id,
        email: response.user.email,
      });
    }

    return response;
  },

  /**
   * Refresh auth token
   */
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    return apiClient.post<RefreshTokenResponse>('/auth/refresh', {
      refreshToken,
    });
  },

  /**
   * Logout
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      // Clear local session regardless of API response
      await SecureStorage.clearAuthSession();
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: async (): Promise<boolean> => {
    return SecureStorage.isAuthenticated();
  },

  /**
   * Get current user
   */
  getCurrentUser: async (): Promise<AuthResponse['user']> => {
    return apiClient.get<AuthResponse['user']>('/auth/me');
  },
};
