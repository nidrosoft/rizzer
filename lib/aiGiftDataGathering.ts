/**
 * AI Gift Data Gathering Service
 * Collects all relevant profile data for AI gift generation
 */

import { supabase } from '@/lib/supabase';

export interface ProfileDataForAI {
  profile: {
    id: string;
    name: string;
    age: number | null;
    relationship_status: string | null;
    how_we_met: string | null;
    relationship_start_date: string | null;
    favorite_color: string | null;
    favorite_flower: string | null;
    favorite_food: string | null;
    favorite_drink: string | null;
    favorite_music: string | null;
    favorite_movie: string | null;
  };
  interests: Array<{
    category: string;
    name: string;
    notes?: string;
  }>;
  conversations: Array<{
    date: string;
    topic: string;
    summary: string;
  }>;
  memories: Array<{
    date: string;
    title: string;
    description: string;
  }>;
  notes: Array<{
    title: string;
    content: string;
    category?: string;
  }>;
  dates: Array<{
    date: string;
    activity: string;
    location: string;
  }>;
  giftHistory: Array<{
    title: string;
    occasion: string;
    price?: string;
    reaction?: string;
  }>;
  giftIdeas: Array<{
    title: string;
    priority: string;
    occasion?: string;
  }>;
}

/**
 * Gathers all profile data needed for AI gift generation
 */
export async function gatherProfileDataForAI(
  profileId: string
): Promise<{ success: boolean; data?: ProfileDataForAI; error?: string }> {
  try {
    // Use the global supabase client

    // 1. Get basic profile info
    const { data: profile, error: profileError } = await supabase
      .from('date_profiles')
      .select('*')
      .eq('id', profileId)
      .single();

    if (profileError) throw profileError;
    if (!profile) throw new Error('Profile not found');

    // 2. Get interests
    const { data: interests, error: interestsError } = await supabase
      .from('date_profile_interests')
      .select('category, name, notes')
      .eq('date_profile_id', profileId)
      .order('created_at', { ascending: false });

    if (interestsError) throw interestsError;

    // 3. Get recent conversations (last 20)
    const { data: conversations, error: conversationsError } = await supabase
      .from('date_profile_conversations')
      .select('conversation_date, topic, summary')
      .eq('date_profile_id', profileId)
      .order('conversation_date', { ascending: false })
      .limit(20);

    if (conversationsError) throw conversationsError;

    // 4. Get recent memories (last 10)
    const { data: memories, error: memoriesError } = await supabase
      .from('date_profile_memories')
      .select('memory_date, title, description')
      .eq('date_profile_id', profileId)
      .order('memory_date', { ascending: false })
      .limit(10);

    if (memoriesError) throw memoriesError;

    // 5. Get recent notes (last 10)
    const { data: notes, error: notesError } = await supabase
      .from('date_profile_notes')
      .select('title, content, category')
      .eq('date_profile_id', profileId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (notesError) throw notesError;

    // 6. Get recent dates (last 10)
    const { data: dates, error: datesError } = await supabase
      .from('date_profile_dates')
      .select('date, activity, location')
      .eq('date_profile_id', profileId)
      .order('date', { ascending: false })
      .limit(10);

    if (datesError) throw datesError;

    // 7. Get gift history
    const { data: giftHistory, error: giftHistoryError } = await supabase
      .from('date_profile_gift_history')
      .select('title, occasion, price, reaction')
      .eq('date_profile_id', profileId)
      .order('date_given', { ascending: false });

    if (giftHistoryError) throw giftHistoryError;

    // 8. Get current gift ideas
    const { data: giftIdeas, error: giftIdeasError } = await supabase
      .from('date_profile_gift_ideas')
      .select('title, priority, occasion')
      .eq('date_profile_id', profileId)
      .eq('status', 'idea')
      .order('created_at', { ascending: false });

    if (giftIdeasError) throw giftIdeasError;

    // Compile all data
    const profileData: ProfileDataForAI = {
      profile: {
        id: (profile as any).id,
        name: (profile as any).name,
        age: (profile as any).age,
        relationship_status: (profile as any).relationship_status,
        how_we_met: (profile as any).how_we_met,
        relationship_start_date: (profile as any).relationship_start_date,
        favorite_color: (profile as any).favorite_color,
        favorite_flower: (profile as any).favorite_flower,
        favorite_food: (profile as any).favorite_food,
        favorite_drink: (profile as any).favorite_drink,
        favorite_music: (profile as any).favorite_music,
        favorite_movie: (profile as any).favorite_movie,
      },
      interests: interests || [],
      conversations: (conversations || []).map((c: any) => ({
        date: c.conversation_date,
        topic: c.topic,
        summary: c.summary || '',
      })),
      memories: (memories || []).map((m: any) => ({
        date: m.memory_date,
        title: m.title,
        description: m.description || '',
      })),
      notes: (notes || []).map((n: any) => ({
        title: n.title,
        content: n.content,
        category: n.category,
      })),
      dates: (dates || []).map((d: any) => ({
        date: d.date,
        activity: d.activity,
        location: d.location || '',
      })),
      giftHistory: (giftHistory || []).map((g: any) => ({
        title: g.title,
        occasion: g.occasion || '',
        price: g.price,
        reaction: g.reaction,
      })),
      giftIdeas: (giftIdeas || []).map((i: any) => ({
        title: i.title,
        priority: i.priority,
        occasion: i.occasion,
      })),
    };

    return { success: true, data: profileData };
  } catch (error: any) {
    console.error('Error gathering profile data:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Calculates data quality score (0-100)
 * Used to determine if we have enough data for good suggestions
 */
export function calculateDataQualityScore(data: ProfileDataForAI): number {
  let score = 0;
  const weights = {
    profile: 20,
    interests: 20,
    conversations: 15,
    memories: 15,
    notes: 10,
    dates: 10,
    giftHistory: 5,
    giftIdeas: 5,
  };

  // Profile completeness
  const profileFields = [
    data.profile.name,
    data.profile.favorite_color,
    data.profile.favorite_flower,
    data.profile.favorite_food,
    data.profile.favorite_drink,
  ];
  const filledFields = profileFields.filter((f) => f && f.trim()).length;
  score += (filledFields / profileFields.length) * weights.profile;

  // Interests
  if (data.interests.length > 0) {
    score += Math.min(data.interests.length / 5, 1) * weights.interests;
  }

  // Conversations
  if (data.conversations.length > 0) {
    score += Math.min(data.conversations.length / 10, 1) * weights.conversations;
  }

  // Memories
  if (data.memories.length > 0) {
    score += Math.min(data.memories.length / 5, 1) * weights.memories;
  }

  // Notes
  if (data.notes.length > 0) {
    score += Math.min(data.notes.length / 5, 1) * weights.notes;
  }

  // Dates
  if (data.dates.length > 0) {
    score += Math.min(data.dates.length / 5, 1) * weights.dates;
  }

  // Gift history
  if (data.giftHistory.length > 0) {
    score += Math.min(data.giftHistory.length / 3, 1) * weights.giftHistory;
  }

  // Gift ideas
  if (data.giftIdeas.length > 0) {
    score += Math.min(data.giftIdeas.length / 3, 1) * weights.giftIdeas;
  }

  return Math.round(score);
}

/**
 * Checks if profile has minimum data for generation
 */
export function hasMinimumDataForGeneration(data: ProfileDataForAI): boolean {
  const score = calculateDataQualityScore(data);
  return score >= 30; // Need at least 30% data quality
}
