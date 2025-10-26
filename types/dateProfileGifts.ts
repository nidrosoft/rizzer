/**
 * Type definitions for Date Profile Gifts & Ideas feature
 * Comprehensive types for AI suggestions, user ideas, and gift history
 */

// ============================================================================
// AI Gift Suggestions
// ============================================================================

export type AIGiftStatus = 'pending' | 'saved' | 'dismissed' | 'expired';

export interface AIGiftSuggestion {
  id: string;
  date_profile_id: string;
  
  // Gift Details
  title: string;
  reason: string;
  price: string | null;
  occasion: string | null;
  confidence_score: number | null;
  product_link: string | null;
  
  // AI Metadata
  generated_at: string;
  generation_batch_id: string;
  expires_at: string;
  
  // User Actions
  status: AIGiftStatus;
  saved_at: string | null;
  dismissed_at: string | null;
  
  // Notifications
  notification_sent: boolean;
  notification_sent_at: string | null;
  notification_opened: boolean;
  notification_opened_at: string | null;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface CreateAIGiftSuggestionInput {
  date_profile_id: string;
  title: string;
  reason: string;
  price?: string;
  occasion?: string;
  confidence_score?: number;
  product_link?: string;
  generation_batch_id: string;
  expires_at: string; // ISO string
}

export interface UpdateAIGiftSuggestionInput {
  status?: AIGiftStatus;
  saved_at?: string;
  dismissed_at?: string;
  notification_opened?: boolean;
  notification_opened_at?: string;
}

// ============================================================================
// User Gift Ideas
// ============================================================================

export type GiftIdeaPriority = 'High' | 'Medium' | 'Low';
export type GiftIdeaStatus = 'idea' | 'purchased' | 'given';
export type GiftIdeaSource = 'manual' | 'ai_suggestion';

export interface GiftIdea {
  id: string;
  date_profile_id: string;
  
  // Gift Details
  title: string;
  occasion: string | null;
  budget: string | null;
  notes: string | null;
  priority: GiftIdeaPriority;
  
  // Status
  status: GiftIdeaStatus;
  
  // Dates
  target_date: string | null; // ISO date string
  purchased_date: string | null;
  given_date: string | null;
  
  // Source tracking
  source: GiftIdeaSource;
  ai_suggestion_id: string | null;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface CreateGiftIdeaInput {
  date_profile_id: string;
  title: string;
  occasion?: string;
  budget?: string;
  notes?: string;
  priority?: GiftIdeaPriority;
  target_date?: string; // ISO date string
  source?: GiftIdeaSource;
  ai_suggestion_id?: string;
}

export interface UpdateGiftIdeaInput {
  title?: string;
  occasion?: string;
  budget?: string;
  notes?: string;
  priority?: GiftIdeaPriority;
  status?: GiftIdeaStatus;
  target_date?: string;
  purchased_date?: string;
  given_date?: string;
}

// ============================================================================
// Gift History
// ============================================================================

export type GiftHistorySource = 'manual' | 'ai_suggestion' | 'gift_idea';

export interface GiftHistory {
  id: string;
  date_profile_id: string;
  
  // Gift Details
  title: string;
  occasion: string | null;
  price: string | null;
  date_given: string; // ISO date string
  
  // Reaction/Feedback
  reaction: string | null;
  reaction_emoji: string | null;
  notes: string | null;
  
  // Photos
  photos: string[] | null;
  
  // Source tracking
  source: GiftHistorySource;
  ai_suggestion_id: string | null;
  gift_idea_id: string | null;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface CreateGiftHistoryInput {
  date_profile_id: string;
  title: string;
  date_given: string; // ISO date string
  occasion?: string;
  price?: string;
  reaction?: string;
  reaction_emoji?: string;
  notes?: string;
  photos?: string[];
  source?: GiftHistorySource;
  ai_suggestion_id?: string;
  gift_idea_id?: string;
}

export interface UpdateGiftHistoryInput {
  title?: string;
  occasion?: string;
  price?: string;
  date_given?: string;
  reaction?: string;
  reaction_emoji?: string;
  notes?: string;
  photos?: string[];
}

// ============================================================================
// AI Generation Log
// ============================================================================

export type GenerationStatus = 'success' | 'failed' | 'partial';

export interface AIGenerationLog {
  id: string;
  date_profile_id: string;
  batch_id: string;
  
  // Generation Details
  suggestions_count: number;
  generation_duration_ms: number | null;
  
  // AI Model Info
  model_used: string | null;
  prompt_tokens: number | null;
  completion_tokens: number | null;
  total_cost: number | null;
  
  // Status
  status: GenerationStatus;
  error_message: string | null;
  
  // Metadata
  profile_data_snapshot: any | null; // JSONB
  
  // Timestamp
  created_at: string;
}

export interface CreateGenerationLogInput {
  date_profile_id: string;
  batch_id: string;
  suggestions_count: number;
  generation_duration_ms?: number;
  model_used?: string;
  prompt_tokens?: number;
  completion_tokens?: number;
  total_cost?: number;
  status?: GenerationStatus;
  error_message?: string;
  profile_data_snapshot?: any;
}

// ============================================================================
// Helper Function Return Types
// ============================================================================

export interface GiftStatistics {
  total_ideas: number;
  total_history: number;
  active_ai_suggestions: number;
  gifts_given_this_month: number;
  total_spent: string | null;
}

export interface ActiveAISuggestion {
  id: string;
  title: string;
  reason: string;
  price: string | null;
  occasion: string | null;
  confidence_score: number | null;
  product_link: string | null;
  generated_at: string;
  expires_at: string;
  status: AIGiftStatus;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface GiftsAPIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================================================
// UI Display Types (for components)
// ============================================================================

export interface GiftIdeaDisplay extends GiftIdea {
  // Add any computed or display-specific properties
  isOverdue?: boolean;
  daysUntilTarget?: number;
}

export interface GiftHistoryDisplay extends GiftHistory {
  // Add any computed or display-specific properties
  timeSinceGiven?: string;
}

export interface AIGiftSuggestionDisplay extends AIGiftSuggestion {
  // Add any computed or display-specific properties
  timeUntilExpiry?: string;
  isExpiringSoon?: boolean;
}
