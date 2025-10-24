/**
 * Environment Configuration
 * Centralized access to environment variables with validation
 */

const ENV = {
  // Environment
  isDevelopment: process.env.EXPO_PUBLIC_ENV === 'development',
  isProduction: process.env.EXPO_PUBLIC_ENV === 'production',
  env: process.env.EXPO_PUBLIC_ENV || 'development',
  
  // API
  apiUrl: process.env.EXPO_PUBLIC_API_URL || '',
  
  // Supabase
  supabase: {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  },
  
  // OpenAI
  openai: {
    apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY || '',
  },
  
  // App
  appVersion: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
};

/**
 * Validate required environment variables
 */
const validateEnv = () => {
  const errors: string[] = [];
  
  // Check API URL
  if (!ENV.apiUrl) {
    errors.push('EXPO_PUBLIC_API_URL is required');
  }
  
  // In production, check all required keys
  if (ENV.isProduction) {
    if (!ENV.supabase.url) {
      errors.push('EXPO_PUBLIC_SUPABASE_URL is required in production');
    }
    if (!ENV.supabase.anonKey) {
      errors.push('EXPO_PUBLIC_SUPABASE_ANON_KEY is required in production');
    }
  }
  
  if (errors.length > 0) {
    console.error('❌ Environment validation failed:');
    errors.forEach(error => console.error(`  - ${error}`));
    
    if (ENV.isProduction) {
      throw new Error('Missing required environment variables');
    }
  } else {
    console.log('✅ Environment variables validated');
    console.log(`📍 Environment: ${ENV.env}`);
    console.log(`🌐 API URL: ${ENV.apiUrl}`);
  }
};

// Validate on import (only in production)
if (ENV.isProduction) {
  validateEnv();
} else {
  // In development, just log warnings
  if (!ENV.apiUrl) {
    console.warn('⚠️ EXPO_PUBLIC_API_URL not set');
  }
}

export default ENV;
