/**
 * Gifts API Service
 * All gift investigation-related API calls
 */

import { apiClient } from './client';

// ============================================
// TYPES
// ============================================

export interface Investigation {
  id: string;
  recipientName: string;
  recipientPhone: string;
  occasion: string;
  occasionDate?: string;
  relationshipContext: string;
  platform: 'whatsapp' | 'imessage';
  creativityMode: 'standard' | 'creative';
  language: string;
  budget?: number;
  status: 'pending' | 'active' | 'paused' | 'completed' | 'cancelled';
  messageCount: number;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvestigationRequest {
  recipientName: string;
  recipientPhone: string;
  occasion: string;
  occasionDate?: string;
  relationshipContext: string;
  extraInstructions?: string;
  budget?: number;
  language: string;
  platform: 'whatsapp' | 'imessage';
  creativityMode: 'standard' | 'creative';
}

export interface Message {
  id: string;
  investigationId: string;
  sender: 'sherlock' | 'recipient' | 'user';
  content: string;
  timestamp: string;
}

export interface GiftSuggestion {
  id: string;
  title: string;
  description: string;
  price: number;
  matchScore: number;
  reasoning: string;
  category: string;
  imageUrl?: string;
  purchaseUrl?: string;
}

export interface ConversationSummary {
  summary: string;
  insights: Array<{
    icon: string;
    text: string;
  }>;
  giftSuggestions: GiftSuggestion[];
}

// ============================================
// GIFTS API
// ============================================

export const giftsAPI = {
  /**
   * Get all investigations
   */
  getInvestigations: async (status?: Investigation['status']): Promise<Investigation[]> => {
    const params = status ? { status } : {};
    return apiClient.get<Investigation[]>('/investigations', { params });
  },

  /**
   * Get investigation by ID
   */
  getInvestigation: async (id: string): Promise<Investigation> => {
    return apiClient.get<Investigation>(`/investigations/${id}`);
  },

  /**
   * Create new investigation
   */
  createInvestigation: async (data: CreateInvestigationRequest): Promise<Investigation> => {
    return apiClient.post<Investigation>('/investigations', data);
  },

  /**
   * Update investigation
   */
  updateInvestigation: async (
    id: string,
    data: Partial<CreateInvestigationRequest>
  ): Promise<Investigation> => {
    return apiClient.patch<Investigation>(`/investigations/${id}`, data);
  },

  /**
   * Delete investigation
   */
  deleteInvestigation: async (id: string): Promise<void> => {
    return apiClient.delete(`/investigations/${id}`);
  },

  /**
   * Pause investigation
   */
  pauseInvestigation: async (id: string): Promise<Investigation> => {
    return apiClient.post<Investigation>(`/investigations/${id}/pause`);
  },

  /**
   * Resume investigation
   */
  resumeInvestigation: async (id: string): Promise<Investigation> => {
    return apiClient.post<Investigation>(`/investigations/${id}/resume`);
  },

  /**
   * Get investigation messages
   */
  getMessages: async (investigationId: string): Promise<Message[]> => {
    return apiClient.get<Message[]>(`/investigations/${investigationId}/messages`);
  },

  /**
   * Send message (inject)
   */
  sendMessage: async (investigationId: string, content: string): Promise<Message> => {
    return apiClient.post<Message>(`/investigations/${investigationId}/messages`, {
      content,
    });
  },

  /**
   * Get conversation summary
   */
  getSummary: async (investigationId: string): Promise<ConversationSummary> => {
    return apiClient.get<ConversationSummary>(`/investigations/${investigationId}/summary`);
  },

  /**
   * Get gift suggestions
   */
  getGiftSuggestions: async (investigationId: string): Promise<GiftSuggestion[]> => {
    return apiClient.get<GiftSuggestion[]>(`/investigations/${investigationId}/suggestions`);
  },

  /**
   * Regenerate gift suggestions
   */
  regenerateSuggestions: async (investigationId: string): Promise<GiftSuggestion[]> => {
    return apiClient.post<GiftSuggestion[]>(`/investigations/${investigationId}/suggestions/regenerate`);
  },
};
