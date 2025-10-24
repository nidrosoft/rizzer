/**
 * API Client
 * Centralized Axios instance with interceptors for authentication and error handling
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import ENV from '@/config/env';
import { SecureStorage } from '@/services/storage/secure';
import { errorLogger } from '@/services/logging/errorLogger';

interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

class APIClient {
  private client: AxiosInstance;
  private refreshing: boolean = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
  }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: ENV.apiUrl,
      timeout: 30000, // 30 seconds
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors() {
    // ============================================
    // REQUEST INTERCEPTOR
    // ============================================
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // Get auth token from secure storage
        const token = await SecureStorage.getAuthToken();
        
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request in development
        if (ENV.isDevelopment) {
          console.log('📤 API Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            data: config.data,
          });
        }

        return config;
      },
      (error: AxiosError) => {
        errorLogger.error(error, { context: 'API Request Interceptor' });
        return Promise.reject(error);
      }
    );

    // ============================================
    // RESPONSE INTERCEPTOR
    // ============================================
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log response in development
        if (ENV.isDevelopment) {
          console.log('📥 API Response:', {
            status: response.status,
            url: response.config.url,
            data: response.data,
          });
        }
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Handle 401 - Unauthorized (token expired)
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
          if (this.refreshing) {
            // Wait for token refresh to complete
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then(() => this.client(originalRequest))
              .catch(err => Promise.reject(err));
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

              // Retry all failed requests
              this.processQueue(null);

              // Retry original request
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              
              this.refreshing = false;
              return this.client(originalRequest);
            } else {
              // No refresh token - logout
              await this.handleLogout();
              this.processQueue(new Error('No refresh token'));
              this.refreshing = false;
              return Promise.reject(error);
            }
          } catch (refreshError) {
            // Refresh failed - logout user
            await this.handleLogout();
            this.processQueue(refreshError);
            this.refreshing = false;
            return Promise.reject(refreshError);
          }
        }

        // Handle other errors
        return this.handleError(error);
      }
    );
  }

  /**
   * Process queued requests after token refresh
   */
  private processQueue(error: any) {
    this.failedQueue.forEach(promise => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve();
      }
    });
    this.failedQueue = [];
  }

  /**
   * Handle logout
   */
  private async handleLogout() {
    await SecureStorage.clearAuthSession();
    // TODO: Navigate to login screen
    // router.replace('/auth/signin');
    console.log('🔓 User logged out - token expired');
  }

  /**
   * Handle API errors
   */
  private handleError(error: AxiosError): Promise<never> {
    let message = 'Something went wrong';
    let status: number | undefined;
    let data: any;

    if (error.response) {
      // Server responded with error
      status = error.response.status;
      data = error.response.data;
      
      switch (status) {
        case 400:
          message = (data as any)?.message || 'Invalid request';
          break;
        case 401:
          message = 'Unauthorized - Please login';
          break;
        case 403:
          message = 'Forbidden - You don\'t have permission';
          break;
        case 404:
          message = 'Not found';
          break;
        case 422:
          message = (data as any)?.message || 'Validation error';
          break;
        case 429:
          message = 'Too many requests - Please try again later';
          break;
        case 500:
          message = 'Server error - Please try again';
          break;
        case 503:
          message = 'Service unavailable - Please try again later';
          break;
        default:
          message = (data as any)?.message || message;
      }
    } else if (error.request) {
      // No response received
      message = 'No internet connection';
      errorLogger.warn('No response from server', { error: error.message });
    } else {
      // Request setup error
      message = error.message || message;
    }

    // Log error
    errorLogger.error(error, {
      context: 'API Error',
      status,
      message,
      url: error.config?.url,
    });

    const apiError: ApiError = {
      message,
      status,
      data,
    };

    return Promise.reject(apiError);
  }

  // ============================================
  // PUBLIC METHODS
  // ============================================

  /**
   * GET request
   */
  async get<T = any>(url: string, config?: any): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, config?: any): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  /**
   * Upload file
   */
  async upload<T = any>(url: string, formData: FormData, onProgress?: (progress: number) => void): Promise<T> {
    const response = await this.client.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
    return response.data;
  }
}

// Export singleton instance
export const apiClient = new APIClient();
