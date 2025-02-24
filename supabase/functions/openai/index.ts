import OpenAI from 'https://deno.land/x/openai@v4.24.0/mod.ts'

console.info('OpenAI Edge Function started')

Deno.serve(async (req) => {
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      })
    }

    const { query } = await req.json()
    const apiKey = Deno.env.get('OPENAI_API_KEY')

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not found' }), 
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    })
    
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: query }],
      // Choose model from here: https://platform.openai.com/docs/models
      model: "gpt-4o-mini",
      stream: false,
    })
  
    const reply = chatCompletion.choices[0].message.content

    return new Response(
      JSON.stringify({ message: reply }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    )
  } catch (error: unknown) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }), 
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    )
  }
})