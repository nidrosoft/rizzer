/**
 * Rizz Coach Backend Functions
 * Full CRUD operations for Rizz Coach chat threads and messages
 */

import { supabase } from './supabase';

// Get Supabase URL - hardcoded for now (should be from env in production)
const SUPABASE_URL = 'https://svspwjunukphqdjjfvef.supabase.co';

// ============================================================================
// TYPES
// ============================================================================

export interface ChatThread {
  id: string;
  user_id: string;
  title: string | null;
  last_message: string | null;
  message_count: number;
  is_archived: boolean;
  last_message_at: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  model_used: string | null;
  tokens_used: number | null;
  generation_time_ms: number | null;
  created_at: string;
}

export interface CreateThreadInput {
  user_id: string;
  title?: string;
}

export interface CreateMessageInput {
  conversation_id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  model_used?: string;
  tokens_used?: number;
  generation_time_ms?: number;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================================================
// CHAT THREAD OPERATIONS
// ============================================================================

/**
 * Get all chat threads for user
 */
export async function getChatThreads(userId: string, includeArchived: boolean = false): Promise<APIResponse<ChatThread[]>> {
  try {
    let query = supabase
      .from('rizz_conversations')
      .select('*')
      .eq('user_id', userId);

    if (!includeArchived) {
      query = query.eq('is_archived', false);
    }

    const { data, error } = await query.order('last_message_at', { ascending: false });

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (error: any) {
    console.error('Error fetching chat threads:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get chat thread by ID
 */
export async function getChatThreadById(threadId: string): Promise<APIResponse<ChatThread>> {
  try {
    const { data, error } = await supabase
      .from('rizz_conversations')
      .select('*')
      .eq('id', threadId)
      .maybeSingle(); // Use maybeSingle() instead of single() to handle 0 results

    if (error) throw error;
    
    // If no data found, return error
    if (!data) {
      return { success: false, error: 'Conversation not found' };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Error fetching chat thread:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Create new chat thread
 */
export async function createChatThread(input: CreateThreadInput): Promise<APIResponse<ChatThread>> {
  try {
    const { data, error } = await supabase
      .from('rizz_conversations')
      .insert({
        user_id: input.user_id,
        title: input.title || null,
        message_count: 0,
        is_archived: false,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error('Error creating chat thread:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update chat thread title
 */
export async function updateChatThreadTitle(threadId: string, title: string): Promise<APIResponse<ChatThread>> {
  try {
    const { data, error } = await supabase
      .from('rizz_conversations')
      .update({ title })
      .eq('id', threadId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error('Error updating chat thread title:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Archive chat thread
 */
export async function archiveChatThread(threadId: string): Promise<APIResponse<ChatThread>> {
  try {
    const { data, error } = await supabase
      .from('rizz_conversations')
      .update({ is_archived: true })
      .eq('id', threadId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error('Error archiving chat thread:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Unarchive chat thread
 */
export async function unarchiveChatThread(threadId: string): Promise<APIResponse<ChatThread>> {
  try {
    const { data, error } = await supabase
      .from('rizz_conversations')
      .update({ is_archived: false })
      .eq('id', threadId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error('Error unarchiving chat thread:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete chat thread (and all messages via CASCADE)
 */
export async function deleteChatThread(threadId: string): Promise<APIResponse<void>> {
  try {
    // Get current user to ensure we have auth
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    console.log('🗑️ Deleting conversation:', threadId, 'for user:', user.id);

    // Delete the conversation (messages will be deleted via CASCADE)
    const { error, count } = await supabase
      .from('rizz_conversations')
      .delete({ count: 'exact' })
      .eq('id', threadId)
      .eq('user_id', user.id); // Ensure user owns this conversation

    if (error) {
      console.error('Delete error:', error);
      throw error;
    }

    console.log('✅ Deleted conversation, rows affected:', count);

    if (count === 0) {
      throw new Error('Conversation not found or you do not have permission to delete it');
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting chat thread:', error);
    return { success: false, error: error.message };
  }
}

// ============================================================================
// CHAT MESSAGE OPERATIONS
// ============================================================================

/**
 * Get messages for a chat thread
 */
export async function getChatMessages(threadId: string, limit?: number): Promise<APIResponse<ChatMessage[]>> {
  try {
    let query = supabase
      .from('rizz_conversation_messages')
      .select('*')
      .eq('conversation_id', threadId)
      .order('created_at', { ascending: true });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (error: any) {
    console.error('Error fetching chat messages:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get recent messages for context (last N messages)
 */
export async function getRecentMessages(threadId: string, count: number = 10): Promise<APIResponse<ChatMessage[]>> {
  try {
    const { data, error } = await supabase
      .from('rizz_conversation_messages')
      .select('*')
      .eq('conversation_id', threadId)
      .order('created_at', { ascending: false })
      .limit(count);

    if (error) throw error;

    // Reverse to get chronological order
    const messages = (data || []).reverse();

    return { success: true, data: messages };
  } catch (error: any) {
    console.error('Error fetching recent messages:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Create a new chat message
 */
export async function createChatMessage(message: Omit<ChatMessage, 'id' | 'created_at'>): Promise<APIResponse<ChatMessage>> {
  try {
    const { data, error } = await supabase
      .from('rizz_conversation_messages')
      .insert({
        conversation_id: message.conversation_id,
        user_id: message.user_id, // Add user_id for RLS
        role: message.role,
        content: message.content,
        model_used: message.model_used || null,
        tokens_used: message.tokens_used || null,
        generation_time_ms: message.generation_time_ms || null,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error('Error creating chat message:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send user message and get AI response
 * This is a helper function that combines creating user message + getting AI response
 */
export async function sendMessage(
  threadId: string,
  userId: string,
  userMessage: string,
  dateProfileId?: string
): Promise<APIResponse<{ userMessage: ChatMessage; aiMessage: ChatMessage }>> {
  try {
    // 1. Create user message
    const userMessageResult = await createChatMessage({
      conversation_id: threadId,
      user_id: userId,
      role: 'user',
      content: userMessage,
      model_used: null,
      tokens_used: null,
      generation_time_ms: null,
    });

    if (!userMessageResult.success || !userMessageResult.data) {
      throw new Error(userMessageResult.error || 'Failed to create user message');
    }

    // 2. Check if this is the first message (for title generation)
    const { data: messageCount } = await supabase
      .from('rizz_conversation_messages')
      .select('id', { count: 'exact' })
      .eq('conversation_id', threadId);

    const isFirstMessage = (messageCount?.length || 0) <= 1;

    // 3. Call the deployed Edge Function (rizz-coach-chat)
    const startTime = Date.now();
    const { data: { session } } = await supabase.auth.getSession();
    
    console.log('🤖 Calling rizz-coach-chat Edge Function...');
    
    const aiResponse = await fetch(`${SUPABASE_URL}/functions/v1/rizz-coach-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token || ''}`,
        'apikey': session?.access_token || '',
      },
      body: JSON.stringify({
        conversationId: threadId,
        userMessage: userMessage,
        dateProfileId: dateProfileId || null,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('Edge Function error:', errorText);
      throw new Error(`Failed to get AI response: ${errorText}`);
    }

    const aiData = await aiResponse.json();
    
    if (!aiData.success) {
      throw new Error(aiData.error || 'AI response failed');
    }

    const generationTime = Date.now() - startTime;
    
    console.log('✅ AI response received:', {
      tokens: aiData.tokens,
      cost: aiData.cost,
      duration: aiData.duration_ms
    });

    // 4. The Edge Function already saved the AI message to the database
    // Fetch it with retries to ensure we get it
    let aiMessageData = null;
    let fetchError = null;
    
    for (let attempt = 0; attempt < 3; attempt++) {
      const { data, error } = await supabase
        .from('rizz_conversation_messages')
        .select('*')
        .eq('conversation_id', threadId)
        .eq('role', 'assistant')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (data) {
        aiMessageData = data;
        break;
      }
      
      fetchError = error;
      
      // Wait a bit before retrying
      if (attempt < 2) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    if (!aiMessageData) {
      console.log('⚠️ Using AI response data directly (database sync delay)');
      // Return the message from the Edge Function response
      aiMessageData = {
        id: 'temp-' + Date.now(),
        conversation_id: threadId,
        user_id: userId,
        role: 'assistant' as const,
        content: aiData.message,
        model_used: 'gpt-4o-mini',
        tokens_used: aiData.tokens?.total_tokens || 0,
        generation_time_ms: generationTime,
        created_at: new Date().toISOString(),
      };
    }

    // 5. Generate and update title if first message (Edge Function already updated metadata)
    if (isFirstMessage) {
      const title = generateConversationTitle(userMessage);
      const { error: updateError } = await supabase
        .from('rizz_conversations')
        .update({ title })
        .eq('id', threadId);
      
      if (updateError) {
        console.error('Error updating conversation title:', updateError);
      } else {
        console.log('✅ Conversation title updated:', title);
      }
    }

    return {
      success: true,
      data: {
        userMessage: userMessageResult.data,
        aiMessage: aiMessageData,
      },
    };
  } catch (error: any) {
    console.error('Error sending message:', error);
    return { success: false, error: error.message };
  }
}

// Helper function to generate conversation title from first message
function generateConversationTitle(firstMessage: string): string {
  // Remove extra whitespace and convert to lowercase for analysis
  const cleaned = firstMessage.trim();
  const lower = cleaned.toLowerCase();
  
  // Extract key topic (3-4 words max)
  const words = cleaned.split(' ');
  
  // If very short (1-3 words), use as is
  if (words.length <= 3) {
    return cleaned;
  }
  
  // Try to extract meaningful phrase (max 4 words)
  let title = '';
  let wordCount = 0;
  
  for (const word of words) {
    if (wordCount >= 4) break;
    
    // Skip common filler words at the start
    if (wordCount === 0 && ['i', 'how', 'what', 'can', 'could', 'would', 'should'].includes(word.toLowerCase())) {
      title += (title ? ' ' : '') + word;
      wordCount++;
      continue;
    }
    
    title += (title ? ' ' : '') + word;
    wordCount++;
  }
  
  return title;
}


// ============================================================================
// STATS & ANALYTICS
// ============================================================================

/**
 * Get chat statistics for user
 */
export async function getUserChatStats(userId: string): Promise<APIResponse<any>> {
  try {
    const [threadsResult, messagesResult] = await Promise.all([
      supabase
        .from('rizz_conversations')
        .select('id, message_count, is_archived')
        .eq('user_id', userId),
      supabase
        .from('rizz_conversation_messages')
        .select('id, role, conversation_id')
        .in('conversation_id', 
          supabase
            .from('rizz_conversations')
            .select('id')
            .eq('user_id', userId)
        ),
    ]);

    const threads = threadsResult.data || [];
    const messages = messagesResult.data || [];

    const stats = {
      total_threads: threads.length,
      active_threads: threads.filter(t => !t.is_archived).length,
      archived_threads: threads.filter(t => t.is_archived).length,
      total_messages: messages.length,
      user_messages: messages.filter(m => m.role === 'user').length,
      ai_messages: messages.filter(m => m.role === 'assistant').length,
      avg_messages_per_thread: threads.length > 0 
        ? Math.round(messages.length / threads.length) 
        : 0,
    };

    return { success: true, data: stats };
  } catch (error: any) {
    console.error('Error fetching user chat stats:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get thread statistics
 */
export async function getThreadStats(threadId: string): Promise<APIResponse<any>> {
  try {
    const [threadResult, messagesResult] = await Promise.all([
      supabase
        .from('rizz_conversations')
        .select('message_count, created_at, last_message_at')
        .eq('id', threadId)
        .single(),
      supabase
        .from('rizz_conversation_messages')
        .select('role')
        .eq('conversation_id', threadId),
    ]);

    const thread = threadResult.data;
    const messages = messagesResult.data || [];

    const stats = {
      total_messages: thread?.message_count || 0,
      user_messages: messages.filter(m => m.role === 'user').length,
      ai_messages: messages.filter(m => m.role === 'assistant').length,
      created_at: thread?.created_at,
      last_message_at: thread?.last_message_at,
    };

    return { success: true, data: stats };
  } catch (error: any) {
    console.error('Error fetching thread stats:', error);
    return { success: false, error: error.message };
  }
}
