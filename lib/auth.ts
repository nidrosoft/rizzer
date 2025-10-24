/**
 * Authentication Utilities
 * Handles phone auth, OTP verification, and session management
 */

import { supabase } from './supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const AUTH_TOKEN_KEY = '@rizzers_auth_token';
const USER_SESSION_KEY = '@rizzers_user_session';

/**
 * Send OTP to phone number
 */
export async function sendOTP(phoneNumber: string) {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: phoneNumber,
      options: {
        channel: 'sms',
      },
    });

    if (error) throw error;

    console.log('✅ OTP sent successfully');
    return { success: true, data };
  } catch (error: any) {
    console.error('❌ Failed to send OTP:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to send OTP' 
    };
  }
}

/**
 * Verify OTP code
 */
export async function verifyOTP(phoneNumber: string, token: string) {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone: phoneNumber,
      token: token,
      type: 'sms',
    });

    if (error) throw error;

    // Store session
    if (data.session) {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, data.session.access_token);
      await AsyncStorage.setItem(USER_SESSION_KEY, JSON.stringify(data.session));
    }

    console.log('✅ OTP verified successfully');
    return { success: true, data };
  } catch (error: any) {
    console.error('❌ Failed to verify OTP:', error);
    return { 
      success: false, 
      error: error.message || 'Invalid OTP code' 
    };
  }
}

/**
 * Get current session
 */
export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    return { success: true, session: data.session };
  } catch (error: any) {
    console.error('❌ Failed to get session:', error);
    return { success: false, session: null };
  }
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    
    return { success: true, user };
  } catch (error: any) {
    console.error('❌ Failed to get user:', error);
    return { success: false, user: null };
  }
}

/**
 * Sign out
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;

    // Clear stored tokens
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    await AsyncStorage.removeItem(USER_SESSION_KEY);

    console.log('✅ Signed out successfully');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Failed to sign out:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to sign out' 
    };
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  } catch (error) {
    return false;
  }
}

/**
 * Refresh session
 */
export async function refreshSession() {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) throw error;

    // Update stored session
    if (data.session) {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, data.session.access_token);
      await AsyncStorage.setItem(USER_SESSION_KEY, JSON.stringify(data.session));
    }

    return { success: true, session: data.session };
  } catch (error: any) {
    console.error('❌ Failed to refresh session:', error);
    return { success: false, session: null };
  }
}
