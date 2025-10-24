# Phase 1: Critical Security & Infrastructure - Implementation Guide

## 🎯 **Goal:** Make app secure and stable before database integration

**Timeline:** 1 week  
**Priority:** 🔴 CRITICAL

---

## 📋 **Checklist**

### **Day 1-2: Environment & Security**
- [ ] Set up environment variables
- [ ] Install expo-secure-store
- [ ] Create environment config
- [ ] Update .gitignore

### **Day 3-4: Error Handling**
- [ ] Create Error Boundary
- [ ] Add error handling to all async operations
- [ ] Create error logging service
- [ ] Add user-friendly error messages

### **Day 5-7: API Layer**
- [ ] Create API service
- [ ] Add interceptors
- [ ] Add retry logic
- [ ] Test all endpoints

---

## 1️⃣ **Environment Variables Setup**

### **Step 1: Install Dependencies**

```bash
npm install react-native-dotenv
npm install expo-secure-store
```

### **Step 2: Create Environment Files**

**Create `.env.development`:**
```env
# Development Environment
EXPO_PUBLIC_ENV=development
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_SUPABASE_URL=your_dev_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_dev_anon_key
EXPO_PUBLIC_OPENAI_API_KEY=your_dev_openai_key
EXPO_PUBLIC_APP_VERSION=1.0.0
```

**Create `.env.production`:**
```env
# Production Environment
EXPO_PUBLIC_ENV=production
EXPO_PUBLIC_API_URL=https://api.rizzers.com/api
EXPO_PUBLIC_SUPABASE_URL=your_prod_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_prod_anon_key
EXPO_PUBLIC_OPENAI_API_KEY=your_prod_openai_key
EXPO_PUBLIC_APP_VERSION=1.0.0
```

### **Step 3: Update .gitignore**

Add to `.gitignore`:
```gitignore
# Environment files
.env
.env.local
.env.development
.env.production
.env*.local

# Secrets
secrets.json
*.pem
*.key
```

### **Step 4: Create Environment Config**

**Create `/config/env.ts`:**
```typescript
/**
 * Environment Configuration
 * Centralized access to environment variables
 */

const ENV = {
  // Environment
  isDevelopment: process.env.EXPO_PUBLIC_ENV === 'development',
  isProduction: process.env.EXPO_PUBLIC_ENV === 'production',
  
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

// Validation
const validateEnv = () => {
  const required = [
    'EXPO_PUBLIC_API_URL',
    'EXPO_PUBLIC_SUPABASE_URL',
    'EXPO_PUBLIC_SUPABASE_ANON_KEY',
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
  
  console.log('✅ Environment variables validated');
};

// Validate on import
if (ENV.isProduction) {
  validateEnv();
}

export default ENV;
```

### **Step 5: Update babel.config.js**

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
      }],
    ],
  };
};
```

---

## 2️⃣ **Secure Storage Setup**

### **Create `/services/storage/secure.ts`:**

```typescript
/**
 * Secure Storage Service
 * Uses expo-secure-store for sensitive data
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
      console.error(`Error saving ${key}:`, error);
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
      console.error(`Error getting ${key}:`, error);
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
      console.error(`Error removing ${key}:`, error);
      return false;
    }
  }

  /**
   * Clear all secure data
   */
  static async clear(): Promise<boolean> {
    try {
      // List of keys to clear
      const keys = ['authToken', 'refreshToken', 'userId'];
      await Promise.all(keys.map(key => this.removeItem(key)));
      return true;
    } catch (error) {
      console.error('Error clearing secure storage:', error);
      return false;
    }
  }

  // Auth-specific methods
  static async saveAuthToken(token: string): Promise<boolean> {
    return this.setItem('authToken', token);
  }

  static async getAuthToken(): Promise<string | null> {
    return this.getItem('authToken');
  }

  static async removeAuthToken(): Promise<boolean> {
    return this.removeItem('authToken');
  }

  static async saveRefreshToken(token: string): Promise<boolean> {
    return this.setItem('refreshToken', token);
  }

  static async getRefreshToken(): Promise<string | null> {
    return this.getItem('refreshToken');
  }
}
```

---

## 3️⃣ **Error Boundary**

### **Create `/components/ErrorBoundary.tsx`:**

```typescript
/**
 * Global Error Boundary
 * Catches React errors and displays fallback UI
 */

import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RefreshCircle } from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to service (e.g., Sentry)
    console.error('Error Boundary caught:', error, errorInfo);
    
    // TODO: Send to error logging service
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.emoji}>😕</Text>
            <Text style={styles.title}>Oops! Something went wrong</Text>
            <Text style={styles.message}>
              We're sorry for the inconvenience. Please try again.
            </Text>
            
            {__DEV__ && this.state.error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>
                  {this.state.error.toString()}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={this.handleReset}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.gradientStart, Colors.gradientEnd]}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <RefreshCircle size={20} color={Colors.textWhite} variant="Bold" />
                <Text style={styles.buttonText}>Try Again</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  content: {
    alignItems: 'center',
    maxWidth: 320,
  },
  emoji: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  message: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  errorBox: {
    backgroundColor: Colors.backgroundGray,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
    width: '100%',
  },
  errorText: {
    fontSize: FontSizes.xs,
    color: Colors.error,
    fontFamily: 'monospace',
  },
  button: {
    borderRadius: 9999,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  buttonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
});
```

### **Update `/app/_layout.tsx`:**

```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function RootLayout() {
  return (
    <View style={styles.container}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <ToastProvider>
            <StatusBar style="auto" />
            <Stack screenOptions={{ headerShown: false }}>
              {/* ... */}
            </Stack>
          </ToastProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </View>
  );
}
```

---

## 4️⃣ **API Service Layer**

### **Create `/services/api/client.ts`:**

```typescript
/**
 * API Client
 * Centralized Axios instance with interceptors
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import ENV from '@/config/env';
import { SecureStorage } from '@/services/storage/secure';

class APIClient {
  private client: AxiosInstance;
  private refreshing: boolean = false;

  constructor() {
    this.client = axios.create({
      baseURL: ENV.apiUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await SecureStorage.getAuthToken();
        
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request in development
        if (ENV.isDevelopment) {
          console.log('📤 API Request:', config.method?.toUpperCase(), config.url);
        }

        return config;
      },
      (error: AxiosError) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle errors
    this.client.interceptors.response.use(
      (response) => {
        // Log response in development
        if (ENV.isDevelopment) {
          console.log('📥 API Response:', response.status, response.config.url);
        }
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Handle 401 - Unauthorized (token expired)
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.refreshing) {
            // Wait for refresh to complete
            await new Promise(resolve => setTimeout(resolve, 1000));
            return this.client(originalRequest);
          }

          originalRequest._retry = true;
          this.refreshing = true;

          try {
            const refreshToken = await SecureStorage.getRefreshToken();
            
            if (refreshToken) {
              // Refresh token
              const response = await this.client.post('/auth/refresh', {
                refreshToken,
              });

              const { token } = response.data;
              await SecureStorage.saveAuthToken(token);

              // Retry original request
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              
              this.refreshing = false;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed - logout user
            await SecureStorage.clear();
            this.refreshing = false;
            // TODO: Navigate to login
            return Promise.reject(refreshError);
          }
        }

        // Handle other errors
        return this.handleError(error);
      }
    );
  }

  private handleError(error: AxiosError): Promise<never> {
    let message = 'Something went wrong';

    if (error.response) {
      // Server responded with error
      const status = error.response.status;
      
      switch (status) {
        case 400:
          message = 'Invalid request';
          break;
        case 401:
          message = 'Unauthorized';
          break;
        case 403:
          message = 'Forbidden';
          break;
        case 404:
          message = 'Not found';
          break;
        case 500:
          message = 'Server error';
          break;
        default:
          message = error.response.data?.message || message;
      }
    } else if (error.request) {
      // No response received
      message = 'No internet connection';
    }

    console.error('❌ API Error:', message, error);

    return Promise.reject({
      message,
      status: error.response?.status,
      data: error.response?.data,
    });
  }

  // Public methods
  get<T>(url: string, config?: any) {
    return this.client.get<T>(url, config);
  }

  post<T>(url: string, data?: any, config?: any) {
    return this.client.post<T>(url, data, config);
  }

  put<T>(url: string, data?: any, config?: any) {
    return this.client.put<T>(url, data, config);
  }

  patch<T>(url: string, data?: any, config?: any) {
    return this.client.patch<T>(url, data, config);
  }

  delete<T>(url: string, config?: any) {
    return this.client.delete<T>(url, config);
  }
}

export const apiClient = new APIClient();
```

### **Create `/services/api/auth.ts`:**

```typescript
/**
 * Auth API Service
 * All authentication-related API calls
 */

import { apiClient } from './client';

export interface LoginCredentials {
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
  };
}

export const authAPI = {
  /**
   * Send OTP to phone number
   */
  sendOTP: async (phone: string) => {
    const response = await apiClient.post('/auth/send-otp', { phone });
    return response.data;
  },

  /**
   * Verify OTP and login
   */
  verifyOTP: async (credentials: LoginCredentials) => {
    const response = await apiClient.post<AuthResponse>('/auth/verify-otp', credentials);
    return response.data;
  },

  /**
   * Refresh auth token
   */
  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  /**
   * Logout
   */
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
};
```

---

## 5️⃣ **Error Logging Service**

### **Create `/services/logging/errorLogger.ts`:**

```typescript
/**
 * Error Logging Service
 * Centralized error logging (ready for Sentry integration)
 */

import ENV from '@/config/env';

export interface ErrorLog {
  message: string;
  stack?: string;
  context?: any;
  timestamp: Date;
  userId?: string;
}

class ErrorLogger {
  private logs: ErrorLog[] = [];

  /**
   * Log error
   */
  log(error: Error | string, context?: any) {
    const errorLog: ErrorLog = {
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' ? error.stack : undefined,
      context,
      timestamp: new Date(),
    };

    this.logs.push(errorLog);

    // Console log in development
    if (ENV.isDevelopment) {
      console.error('🔴 Error:', errorLog);
    }

    // TODO: Send to error tracking service (Sentry, Bugsnag, etc.)
    // this.sendToService(errorLog);
  }

  /**
   * Log warning
   */
  warn(message: string, context?: any) {
    if (ENV.isDevelopment) {
      console.warn('⚠️ Warning:', message, context);
    }
  }

  /**
   * Log info
   */
  info(message: string, context?: any) {
    if (ENV.isDevelopment) {
      console.log('ℹ️ Info:', message, context);
    }
  }

  /**
   * Get all logs
   */
  getLogs(): ErrorLog[] {
    return this.logs;
  }

  /**
   * Clear logs
   */
  clearLogs() {
    this.logs = [];
  }
}

export const errorLogger = new ErrorLogger();
```

---

## 6️⃣ **Testing the Setup**

### **Create `/app/test-api.tsx` (temporary):**

```typescript
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { apiClient } from '@/services/api/client';
import { useToast } from '@/contexts/ToastContext';
import ENV from '@/config/env';

export default function TestAPIScreen() {
  const { showToast } = useToast();

  const testAPI = async () => {
    try {
      const response = await apiClient.get('/health');
      showToast('API Connected!', 'success');
      console.log('Response:', response.data);
    } catch (error: any) {
      showToast(error.message, 'error');
      console.error('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Test</Text>
      <Text style={styles.url}>URL: {ENV.apiUrl}</Text>
      
      <TouchableOpacity style={styles.button} onPress={testAPI}>
        <Text style={styles.buttonText}>Test API Connection</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## ✅ **Verification Checklist**

After implementing Phase 1:

- [ ] Environment variables load correctly
- [ ] SecureStore saves/retrieves data
- [ ] Error Boundary catches errors
- [ ] API client makes requests
- [ ] Interceptors add auth token
- [ ] 401 errors trigger token refresh
- [ ] Errors show user-friendly messages
- [ ] No secrets in code
- [ ] .env files in .gitignore

---

## 🚀 **Next Steps**

After Phase 1 is complete:
1. Move to **Phase 2: State Management & Loading**
2. Implement Zustand stores
3. Add loading states everywhere
4. Connect authentication flow

---

**Status:** Ready to implement ✅
