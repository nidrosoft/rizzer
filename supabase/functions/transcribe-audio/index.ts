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

    // Get the audio file from the request
    const formData = await req.formData()
    const audioFile = formData.get('audio') as File
    const language = formData.get('language') as string || 'en' // Default to English

    if (!audioFile) {
      throw new Error('No audio file provided')
    }

    console.log('🎤 Transcribing audio:', {
      size: audioFile.size,
      type: audioFile.type,
      language: language
    })

    const startTime = Date.now()

    // Create form data for OpenAI Whisper API
    const openaiFormData = new FormData()
    openaiFormData.append('file', audioFile)
    openaiFormData.append('model', 'whisper-1')
    openaiFormData.append('language', language)
    openaiFormData.append('response_format', 'json')

    // Call OpenAI Whisper API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: openaiFormData,
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('OpenAI Whisper API error:', error)
      throw new Error(`Whisper API error: ${error}`)
    }

    const data = await response.json()
    const duration = Date.now() - startTime

    console.log('✅ Transcription complete:', {
      text_length: data.text.length,
      duration_ms: duration
    })

    return new Response(
      JSON.stringify({
        success: true,
        text: data.text,
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
