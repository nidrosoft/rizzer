import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY not configured')
    }

    const { imageUrl, imageBase64, prompt } = await req.json()

    if (!imageUrl && !imageBase64) {
      throw new Error('Either imageUrl or imageBase64 must be provided')
    }

    console.log('🖼️ Analyzing image with GPT-4 Vision')

    const startTime = Date.now()

    // Prepare the image content
    const imageContent = imageUrl 
      ? { type: 'image_url', image_url: { url: imageUrl } }
      : { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }

    // Default prompt for dating context if none provided
    const analysisPrompt = prompt || `Analyze this image in the context of dating and relationships. 
    Describe what you see and provide relevant advice or insights that could help with:
    - Understanding the situation
    - Planning a date
    - Gift ideas
    - Conversation starters
    - Social cues
    
    Be specific, helpful, and supportive.`

    // Call OpenAI GPT-4 Vision API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Supports vision
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: analysisPrompt },
              imageContent,
            ],
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('OpenAI Vision API error:', error)
      throw new Error(`Vision API error: ${error}`)
    }

    const data = await response.json()
    const analysis = data.choices[0].message.content
    const duration = Date.now() - startTime

    console.log('✅ Image analysis complete:', {
      analysis_length: analysis.length,
      duration_ms: duration,
      tokens: data.usage.total_tokens
    })

    return new Response(
      JSON.stringify({
        success: true,
        analysis: analysis,
        tokens_used: data.usage.total_tokens,
        duration_ms: duration,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )

  } catch (error) {
    console.error('❌ Error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }
})
