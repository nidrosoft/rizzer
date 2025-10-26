/**
 * Generate Gift Suggestions Edge Function
 * Generates AI-powered gift suggestions for a date profile
 * 
 * Usage:
 * POST /functions/v1/generate-gift-suggestions
 * Body: { "profileId": "uuid" }
 * 
 * Or call from cron job to process all profiles
 * POST /functions/v1/generate-gift-suggestions
 * Body: { "batch": true }
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')!;

    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request
    const { profileId, batch } = await req.json();

    if (batch) {
      // Batch mode: Process all profiles that need generation
      const result = await processBatch(supabase, openaiApiKey);
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (profileId) {
      // Single profile mode
      const result = await generateForProfile(supabase, openaiApiKey, profileId);
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      throw new Error('Either profileId or batch=true required');
    }
  } catch (error: any) {
    console.error('Error in generate-gift-suggestions:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

/**
 * Process batch of profiles
 */
async function processBatch(supabase: any, openaiApiKey: string) {
  const startTime = Date.now();
  
  // Get profiles that need generation
  const { data: profiles, error } = await supabase
    .rpc('get_profiles_needing_generation');

  if (error) throw error;

  if (!profiles || profiles.length === 0) {
    return {
      success: true,
      message: 'No profiles need generation',
      processed: 0,
    };
  }

  console.log(`Processing ${profiles.length} profiles...`);

  const results = {
    total: profiles.length,
    successful: 0,
    failed: 0,
    errors: [] as string[],
  };

  // Process profiles with delay to avoid rate limits
  for (const profile of profiles) {
    try {
      await generateForProfile(supabase, openaiApiKey, profile.profile_id);
      results.successful++;
      
      // Small delay between requests (1 second)
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error: any) {
      console.error(`Error processing profile ${profile.profile_id}:`, error);
      results.failed++;
      results.errors.push(`${profile.profile_id}: ${error.message}`);
    }
  }

  const duration = Date.now() - startTime;
  console.log(`Batch complete: ${results.successful}/${results.total} successful in ${duration}ms`);

  return {
    success: true,
    ...results,
    duration_ms: duration,
  };
}

/**
 * Generate suggestions for a single profile
 */
async function generateForProfile(supabase: any, openaiApiKey: string, profileId: string) {
  const startTime = Date.now();
  const batchId = crypto.randomUUID();

  try {
    console.log(`Generating suggestions for profile: ${profileId}`);

    // 1. Gather profile data
    const profileData = await gatherProfileData(supabase, profileId);

    // 2. Check data quality
    const dataQuality = calculateDataQuality(profileData);
    console.log(`Data quality for profile ${profileId}: ${dataQuality}%`);
    
    // Lower threshold for testing (5% instead of 30%)
    if (dataQuality < 5) {
      throw new Error(`Not enough profile data (${dataQuality}%). To get personalized gift suggestions, please add more details to the profile: interests, conversations, memories, or notes. The more information you add, the better the AI suggestions will be!`);
    }

    // 3. Build prompts
    const systemPrompt = getSystemPrompt();
    const userPrompt = buildUserPrompt(profileData);

    // 4. Call OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.8,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const aiResponse = await response.json();
    const suggestions = JSON.parse(aiResponse.choices[0].message.content);

    // 5. Validate response
    if (!suggestions.suggestions || !Array.isArray(suggestions.suggestions)) {
      throw new Error('Invalid AI response format');
    }

    // 6. Save suggestions to database
    await saveSuggestions(supabase, profileId, suggestions.suggestions, batchId);

    // 7. Log generation
    const duration = Date.now() - startTime;
    await logGeneration(supabase, {
      profileId,
      batchId,
      suggestionsCount: suggestions.suggestions.length,
      duration,
      model: 'gpt-4o-mini',
      promptTokens: aiResponse.usage.prompt_tokens,
      completionTokens: aiResponse.usage.completion_tokens,
      cost: calculateCost(aiResponse.usage),
      status: 'success',
    });

    // 8. Update schedule
    await supabase.rpc('update_generation_schedule', {
      p_profile_id: profileId,
      p_success: true,
      p_next_run_hours: 5, // Next run in 5 hours
    });

    console.log(`✅ Generated ${suggestions.suggestions.length} suggestions for ${profileId}`);

    return {
      success: true,
      profileId,
      suggestionsCount: suggestions.suggestions.length,
      duration_ms: duration,
    };
  } catch (error: any) {
    console.error(`❌ Error generating for ${profileId}:`, error);

    // Log failed generation
    await logGeneration(supabase, {
      profileId,
      batchId,
      status: 'failed',
      errorMessage: error.message,
    });

    // Update schedule (still increment, but mark as failed)
    await supabase.rpc('update_generation_schedule', {
      p_profile_id: profileId,
      p_success: false,
      p_next_run_hours: 5,
    });

    throw error;
  }
}

/**
 * Gather all profile data
 */
async function gatherProfileData(supabase: any, profileId: string) {
  const [
    profile,
    interests,
    conversations,
    memories,
    notes,
    dates,
    giftHistory,
    giftIdeas,
  ] = await Promise.all([
    supabase.from('date_profiles').select('*').eq('id', profileId).single(),
    supabase.from('date_profile_interests').select('*').eq('date_profile_id', profileId).order('created_at', { ascending: false }),
    supabase.from('date_profile_conversations').select('*').eq('date_profile_id', profileId).order('conversation_date', { ascending: false }).limit(20),
    supabase.from('date_profile_memories').select('*').eq('date_profile_id', profileId).order('memory_date', { ascending: false }).limit(10),
    supabase.from('date_profile_notes').select('*').eq('date_profile_id', profileId).order('created_at', { ascending: false }).limit(10),
    supabase.from('date_profile_dates').select('*').eq('date_profile_id', profileId).order('date', { ascending: false }).limit(10),
    supabase.from('date_profile_gift_history').select('*').eq('date_profile_id', profileId).order('date_given', { ascending: false }),
    supabase.from('date_profile_gift_ideas').select('*').eq('date_profile_id', profileId).eq('status', 'idea').order('created_at', { ascending: false }),
  ]);

  if (profile.error) throw profile.error;

  return {
    profile: profile.data,
    interests: interests.data || [],
    conversations: conversations.data || [],
    memories: memories.data || [],
    notes: notes.data || [],
    dates: dates.data || [],
    giftHistory: giftHistory.data || [],
    giftIdeas: giftIdeas.data || [],
  };
}

/**
 * Calculate data quality score
 */
function calculateDataQuality(data: any): number {
  let score = 0;
  
  // Profile completeness (20 points)
  const profileFields = [data.profile.name, data.profile.favorite_color, data.profile.favorite_food];
  score += (profileFields.filter(f => f).length / profileFields.length) * 20;
  
  // Data richness (80 points)
  if (data.interests.length > 0) score += Math.min(data.interests.length / 5, 1) * 20;
  if (data.conversations.length > 0) score += Math.min(data.conversations.length / 10, 1) * 15;
  if (data.memories.length > 0) score += Math.min(data.memories.length / 5, 1) * 15;
  if (data.notes.length > 0) score += Math.min(data.notes.length / 5, 1) * 10;
  if (data.dates.length > 0) score += Math.min(data.dates.length / 5, 1) * 10;
  if (data.giftHistory.length > 0) score += Math.min(data.giftHistory.length / 3, 1) * 5;
  if (data.giftIdeas.length > 0) score += Math.min(data.giftIdeas.length / 3, 1) * 5;
  
  return Math.round(score);
}

/**
 * Build user prompt
 */
function buildUserPrompt(data: any): string {
  const sections = [];
  
  sections.push('# Profile Analysis Request\n');
  sections.push('## Basic Information:');
  sections.push(`- Name: ${data.profile.name || 'Not provided'}`);
  if (data.profile.age) sections.push(`- Age: ${data.profile.age}`);
  if (data.profile.favorite_color) sections.push(`- Favorite Color: ${data.profile.favorite_color}`);
  if (data.profile.favorite_flower) sections.push(`- Favorite Flower: ${data.profile.favorite_flower}`);
  if (data.profile.favorite_food) sections.push(`- Favorite Food: ${data.profile.favorite_food}`);
  sections.push('');
  
  if (data.interests.length > 0) {
    sections.push('## Interests:');
    data.interests.forEach((i: any) => sections.push(`- ${i.category}: ${i.name}`));
    sections.push('');
  }
  
  if (data.conversations.length > 0) {
    sections.push('## Recent Conversations:');
    data.conversations.forEach((c: any) => sections.push(`- ${c.topic}: ${c.summary || ''}`));
    sections.push('');
  }
  
  if (data.memories.length > 0) {
    sections.push('## Memories:');
    data.memories.forEach((m: any) => sections.push(`- ${m.title}: ${m.description || ''}`));
    sections.push('');
  }
  
  if (data.giftHistory.length > 0) {
    sections.push('## Previous Gifts (avoid these):');
    data.giftHistory.forEach((g: any) => sections.push(`- ${g.title}`));
    sections.push('');
  }
  
  sections.push('Generate 3-5 personalized gift suggestions based on this data.');
  return sections.join('\n');
}

/**
 * System prompt
 */
function getSystemPrompt(): string {
  return `You are an expert gift recommendation AI. Analyze the profile data and generate 3-5 personalized gift suggestions.

Return ONLY valid JSON in this exact format:
{
  "suggestions": [
    {
      "title": "Gift name",
      "reason": "Why this gift",
      "price": "$XX or range",
      "occasion": "Birthday/Anniversary/etc",
      "confidence_score": 85-100,
      "product_link": "URL or null"
    }
  ]
}

Make suggestions specific, thoughtful, and based on the profile data provided.`;
}

/**
 * Save suggestions to database
 */
async function saveSuggestions(supabase: any, profileId: string, suggestions: any[], batchId: string) {
  // Expire old suggestions first
  await supabase
    .from('date_profile_ai_gift_suggestions')
    .update({ status: 'expired' })
    .eq('date_profile_id', profileId)
    .in('status', ['pending', 'saved']);

  // Insert new suggestions
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // Expire in 24 hours
  
  const records = suggestions.map(s => ({
    date_profile_id: profileId,
    generation_batch_id: batchId,
    title: s.title,
    reason: s.reason,
    price: s.price,
    occasion: s.occasion,
    confidence_score: s.confidence_score,
    product_link: s.product_link,
    status: 'pending',
    expires_at: expiresAt.toISOString(),
  }));

  const { error } = await supabase
    .from('date_profile_ai_gift_suggestions')
    .insert(records);

  if (error) throw error;
}

/**
 * Log generation
 */
async function logGeneration(supabase: any, data: any) {
  const { error } = await supabase
    .from('ai_gift_generation_log')
    .insert({
      date_profile_id: data.profileId,
      batch_id: data.batchId,
      suggestions_count: data.suggestionsCount || 0,
      generation_duration_ms: data.duration || 0,
      model_used: data.model || 'gpt-4o-mini',
      prompt_tokens: data.promptTokens || 0,
      completion_tokens: data.completionTokens || 0,
      total_cost: data.cost || 0,
      status: data.status,
      error_message: data.errorMessage,
    });

  if (error) console.error('Error logging generation:', error);
}

/**
 * Calculate cost
 */
function calculateCost(usage: any): number {
  const INPUT_COST = 0.15 / 1_000_000;
  const OUTPUT_COST = 0.60 / 1_000_000;
  return usage.prompt_tokens * INPUT_COST + usage.completion_tokens * OUTPUT_COST;
}
