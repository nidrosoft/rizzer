/**
 * API Services Index
 * Central export for all API services
 */

export { apiClient } from './client';
export { authAPI } from './auth';
export { userAPI } from './user';
export { giftsAPI } from './gifts';

// Re-export types
export type { SendOTPRequest, SendOTPResponse, VerifyOTPRequest, AuthResponse } from './auth';
export type { User, UpdateProfileRequest, UploadPhotoResponse } from './user';
export type {
  Investigation,
  CreateInvestigationRequest,
  Message,
  GiftSuggestion,
  ConversationSummary,
} from './gifts';
