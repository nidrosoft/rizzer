/**
 * Generate Rizz Lines Edge Function
 * Generates AI-powered rizz lines for a specific category
 * 
 * Usage:
 * POST /functions/v1/generate-rizz-lines
 * Body: { "categoryId": 123, "userId": "uuid" }
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
    const { categoryId, userId } = await req.json();

    if (!categoryId || !userId) {
      throw new Error('categoryId and userId are required');
    }

    console.log(`🎯 Generating rizz lines for category ${categoryId}, user ${userId}`);

    // Generate rizz lines
    const result = await generateRizzLines(supabase, openaiApiKey, categoryId, userId);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('❌ Error in generate-rizz-lines:', error);
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
 * Generate rizz lines for a category
 */
async function generateRizzLines(
  supabase: any, 
  openaiApiKey: string, 
  categoryId: number, 
  userId: string
) {
  const startTime = Date.now();
  const batchId = crypto.randomUUID();

  try {
    // 1. Fetch category details
    console.log(`📂 Fetching category ${categoryId}...`);
    const { data: category, error: categoryError } = await supabase
      .from('rizz_categories')
      .select('*')
      .eq('id', categoryId)
      .eq('user_id', userId)
      .single();

    if (categoryError) throw new Error(`Category not found: ${categoryError.message}`);
    if (!category) throw new Error('Category not found');

    console.log(`✅ Category found: "${category.title}"`);

    // 2. Build AI prompt
    const systemPrompt = getSystemPrompt();
    const userPrompt = buildUserPrompt(category);

    console.log(`🤖 Calling OpenAI API...`);

    // 3. Call OpenAI API
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
        temperature: 0.9, // High creativity
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const aiResponse = await response.json();
    console.log(`✅ OpenAI response received`);

    // 4. Parse AI response
    const parsed = JSON.parse(aiResponse.choices[0].message.content);
    
    if (!parsed.lines || !Array.isArray(parsed.lines)) {
      throw new Error('Invalid AI response format');
    }

    const lines = parsed.lines;
    console.log(`✅ Generated ${lines.length} rizz lines`);

    // 5. Save lines to database
    const savedLines = await saveLines(supabase, lines, categoryId, userId, batchId);

    // 6. Log generation metrics
    const duration = Date.now() - startTime;
    await logGeneration(supabase, {
      userId,
      categoryId,
      batchId,
      linesCount: lines.length,
      duration,
      model: 'gpt-4o-mini',
      promptTokens: aiResponse.usage.prompt_tokens,
      completionTokens: aiResponse.usage.completion_tokens,
      cost: calculateCost(aiResponse.usage),
      status: 'success',
    });

    console.log(`✅ Generation complete in ${duration}ms`);

    return {
      success: true,
      data: savedLines,
      batchId,
      duration_ms: duration,
      tokens: aiResponse.usage,
    };
  } catch (error: any) {
    console.error(`❌ Error generating rizz lines:`, error);

    // Log failed generation
    await logGeneration(supabase, {
      userId,
      categoryId,
      batchId,
      status: 'failed',
      errorMessage: error.message,
    });

    throw error;
  }
}

/**
 * System prompt for AI
 */
function getSystemPrompt(): string {
  return `You are a creative rizz line generator. Your job is to create smooth, charming, and witty pickup lines or conversation starters based on the given category.

**Guidelines:**
1. Be creative and original - avoid clichés
2. Match the tone and context of the category
3. Keep lines concise (1-3 sentences max)
4. Make them natural and conversational
5. Vary the style: some flirty, some funny, some smooth
6. Ensure they're appropriate and respectful
7. Add confidence scores (85-100) based on how well they fit

**Output Format:**
Return ONLY valid JSON in this exact format:
{
  "lines": [
    {
      "content": "The actual rizz line here",
      "confidence_score": 92,
      "tags": ["flirty", "morning", "cute"],
      "tone": "playful"
    }
  ]
}

Generate 5 unique rizz lines.`;
}

/**
 * Build user prompt from category
 */
function buildUserPrompt(category: any): string {
  const sections = [];
  
  sections.push(`Category: "${category.title}"`);
  
  if (category.description) {
    sections.push(`Description: "${category.description}"`);
  }
  
  if (category.emoji) {
    sections.push(`Emoji: ${category.emoji}`);
  }
  
  sections.push('');
  sections.push('Generate 5 creative rizz lines that fit this category perfectly.');
  sections.push('Make them natural, charming, and varied in style.');
  
  return sections.join('\n');
}

/**
 * Save generated lines to database
 */
async function saveLines(
  supabase: any,
  lines: any[],
  categoryId: number,
  userId: string,
  batchId: string
) {
  const records = lines.map(line => ({
    user_id: userId,
    category_id: categoryId,
    content: line.content,
    is_ai_generated: true,
    ai_model: 'gpt-4o-mini',
    ai_prompt_version: 'v1',
    generation_batch_id: batchId,
    confidence_score: line.confidence_score || 90,
    tags: line.tags || [],
    tone: line.tone || 'neutral',
    is_saved: false,
    is_favorite: false,
    times_used: 0,
    times_copied: 0,
  }));

  const { data, error } = await supabase
    .from('rizz_messages')
    .insert(records)
    .select();

  if (error) throw new Error(`Failed to save lines: ${error.message}`);

  return data;
}

/**
 * Log generation metrics
 */
async function logGeneration(supabase: any, data: any) {
  const { error } = await supabase
    .from('rizz_generation_log')
    .insert({
      user_id: data.userId,
      category_id: data.categoryId,
      batch_id: data.batchId,
      lines_count: data.linesCount || 0,
      generation_duration_ms: data.duration || 0,
      model_used: data.model || 'gpt-4o-mini',
      prompt_tokens: data.promptTokens || 0,
      completion_tokens: data.completionTokens || 0,
      total_cost: data.cost || 0,
      status: data.status,
      error_message: data.errorMessage,
    });

  if (error) {
    console.error('⚠️ Error logging generation:', error);
  }
}

/**
 * Calculate cost based on token usage
 */
function calculateCost(usage: any): number {
  // GPT-4o-mini pricing (as of 2024)
  const INPUT_COST = 0.15 / 1_000_000;  // $0.15 per 1M tokens
  const OUTPUT_COST = 0.60 / 1_000_000; // $0.60 per 1M tokens
  
  return usage.prompt_tokens * INPUT_COST + usage.completion_tokens * OUTPUT_COST;
}
