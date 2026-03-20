import { createClient } from 'jsr:@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { content, role } = await req.json()

    if (!content || !role) {
      return new Response(
        JSON.stringify({ error: 'Missing content or role' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Sauvegarder le message
    const { data, error } = await supabase
      .from('messages')
      .insert([{ content, role }])
      .select()
      .single()

    if (error) {
      throw error
    }

    // Générer une réponse (placeholder — remplacer par un appel IA)
    let reply = 'Message reçu !'
    if (role === 'user') {
      reply = `Réponse à : "${content}"`

      // Sauvegarder la réponse bot
      await supabase
        .from('messages')
        .insert([{ content: reply, role: 'bot' }])
    }

    return new Response(
      JSON.stringify({ message: data, reply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
