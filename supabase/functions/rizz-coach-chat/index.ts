import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const SYSTEM_PROMPT = `You are Rizz Coach, an expert dating and relationship advisor. Your role is to help users with:

**Core Expertise:**
- Dating advice and conversation skills
- Relationship guidance and communication
- Confidence building and self-improvement
- Flirting techniques and social dynamics
- Date planning and romantic gestures

**Personality:**
- Friendly, supportive, and encouraging
- Direct but empathetic
- Confident without being arrogant
- Uses emojis naturally (but not excessively)
- Speaks like a knowledgeable friend, not a therapist

**Response Style:**
- Keep responses concise and actionable (200-400 words)
- Use bullet points and formatting for clarity
- Provide specific, practical advice
- Ask follow-up questions when more context is needed
- Reference conversation history when relevant
- Be encouraging and build confidence

**Guidelines:**
- Always be respectful and ethical
- Never encourage manipulation or dishonesty
- Promote healthy, consensual relationships
- If asked about something outside dating/relationships, gently redirect
- Use markdown formatting for better readability
- Keep tone conversational and warm

**Examples of Good Responses:**
- "That's a great question! Here's what I'd suggest..."
- "I can tell you're nervous about this. Let's break it down..."
- "Based on what you've shared, here are 3 things you can try..."
- "Tell me more about [specific detail] so I can give you better advice"

Remember: Your goal is to help users build genuine connections and confidence, not just "get dates."`;

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  created_at?: string
}

interface RequestBody {
  message: string
  conversation_id: string
  user_id: string
  conversation_history?: ChatMessage[]
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    const { message, conversation_id, user_id, conversation_history = [] }: RequestBody = await req.json()

    // Validate inputs
    if (!message || !conversation_id || !user_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: message, conversation_id, user_id' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Build conversation context (last 10 messages)
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversation_history.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ]

    console.log('🤖 Calling OpenAI with', messages.length, 'messages')

    const startTime = Date.now()

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.8,
        max_tokens: 800,
        top_p: 0.9,
        frequency_penalty: 0.3,
        presence_penalty: 0.3,
      }),
    })

    if (!openaiResponse.ok) {
      const error = await openaiResponse.text()
      console.error('OpenAI API error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to generate AI response', details: error }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const data = await openaiResponse.json()
    const aiMessage = data.choices[0].message.content
    const generationTime = Date.now() - startTime

    console.log('✅ AI response generated in', generationTime, 'ms')
    console.log('📊 Tokens used:', data.usage)

    // Return response
    return new Response(
      JSON.stringify({
        success: true,
        message: aiMessage,
        model_used: data.model,
        tokens_used: data.usage.total_tokens,
        generation_time_ms: generationTime,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )

  } catch (error) {
    console.error('Error in rizz-coach-chat function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }
})
