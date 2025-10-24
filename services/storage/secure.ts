/**
 * Secure Storage Service
 * Uses expo-secure-store for sensitive data like auth tokens
 */

import * as SecureStore from 'expo-secure-store';

export class SecureStorage {
  /**
   * Save data securely
   */
  static async setItem(key: string, value: string): Promise<boolean> {
    try {
      await SecureStore.setItemAsync(key, value);
      return true;
    } catch (error) {
      console.error(`❌ Error saving ${key}:`, error);
      return false;
    }
  }

  /**
   * Get data securely
   */
  static async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`❌ Error getting ${key}:`, error);
      return null;
    }
  }

  /**
   * Remove data
   */
  static async removeItem(key: string): Promise<boolean> {
    try {
      await SecureStore.deleteItemAsync(key);
      return true;
    } catch (error) {
      console.error(`❌ Error removing ${key}:`, error);
      return false;
    }
  }

  /**
   * Clear all secure data
   */
  static async clear(): Promise<boolean> {
    try {
      // List of keys to clear
      const keys = ['authToken', 'refreshToken', 'userId', 'userEmail'];
      await Promise.all(keys.map(key => this.removeItem(key)));
      console.log('✅ Secure storage cleared');
      return true;
    } catch (error) {
      console.error('❌ Error clearing secure storage:', error);
      return false;
    }
  }

  // ============================================
  // Auth Token Methods
  // ============================================

  /**
   * Save auth token
   */
  static async saveAuthToken(token: string): Promise<boolean> {
    return this.setItem('authToken', token);
  }

  /**
   * Get auth token
   */
  static async getAuthToken(): Promise<string | null> {
    return this.getItem('authToken');
  }

  /**
   * Remove auth token
   */
  static async removeAuthToken(): Promise<boolean> {
    return this.removeItem('authToken');
  }

  // ============================================
  // Refresh Token Methods
  // ============================================

  /**
   * Save refresh token
   */
  static async saveRefreshToken(token: string): Promise<boolean> {
    return this.setItem('refreshToken', token);
  }

  /**
   * Get refresh token
   */
  static async getRefreshToken(): Promise<string | null> {
    return this.getItem('refreshToken');
  }

  /**
   * Remove refresh token
   */
  static async removeRefreshToken(): Promise<boolean> {
    return this.removeItem('refreshToken');
  }

  // ============================================
  // User Data Methods
  // ============================================

  /**
   * Save user ID
   */
  static async saveUserId(userId: string): Promise<boolean> {
    return this.setItem('userId', userId);
  }

  /**
   * Get user ID
   */
  static async getUserId(): Promise<string | null> {
    return this.getItem('userId');
  }

  /**
   * Save user email
   */
  static async saveUserEmail(email: string): Promise<boolean> {
    return this.setItem('userEmail', email);
  }

  /**
   * Get user email
   */
  static async getUserEmail(): Promise<string | null> {
    return this.getItem('userEmail');
  }

  // ============================================
  // Utility Methods
  // ============================================

  /**
   * Check if user is authenticated (has valid token)
   */
  static async isAuthenticated(): Promise<boolean> {
    const token = await this.getAuthToken();
    return token !== null && token.length > 0;
  }

  /**
   * Save complete auth session
   */
  static async saveAuthSession(data: {
    token: string;
    refreshToken?: string;
    userId: string;
    email?: string;
  }): Promise<boolean> {
    try {
      await this.saveAuthToken(data.token);
      await this.saveUserId(data.userId);
      
      if (data.refreshToken) {
        await this.saveRefreshToken(data.refreshToken);
      }
      
      if (data.email) {
        await this.saveUserEmail(data.email);
      }
      
      console.log('✅ Auth session saved');
      return true;
    } catch (error) {
      console.error('❌ Error saving auth session:', error);
      return false;
    }
  }

  /**
   * Clear auth session (logout)
   */
  static async clearAuthSession(): Promise<boolean> {
    return this.clear();
  }
}
