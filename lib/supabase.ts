/**
 * Supabase Client Configuration
 * Handles database connection, authentication, and storage
 */

import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

// Supabase project credentials
const supabaseUrl = 'https://svspwjunukphqdjjfvef.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2c3B3anVudWtwaHFkampmdmVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyOTA2MzQsImV4cCI6MjA3Njg2NjYzNH0.RhhUP8x12SC-hJy6GsLNGOQPL2uvV1DpPrykZZQrFhQ';

// Create Supabase client with TypeScript types
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Store session in AsyncStorage
    storage: undefined, // Will be configured in auth store
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Helper function to test connection
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return false;
  }
}
