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

    const { goals, age } = await req.json()
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
      messages: [
        { 
          role: 'system', 
          content: `You are a Korean skincare expert. Recommend a skincare routine using only Korean skincare products from these brands:
                        - Laneige
                        - Innisfree
                        - Etude House
                        - Missha
                        - Some By Mi
                        - Dr. Jart+
                        - Beauty of Joseon
                        - Pyunkang Yul
                        - Mediheal
                        - Isntree
                        - Klairs
                        - Neogen
                        - ROUND LAB
                        - Sulwhasoo
                        - The History of Whoo
                        - Banila Co
                        - Belif
                        - Skin1004
                        - Purito
                        - Torriden
                        - Anua
                        - TIRTIR
                        -  Goodal
                        - Dr. Ceuracle
                        - Amorepacific
                        - Holika Holika
                        - TonyMoly
                        - VT Cosmetics
                        - Illiyoon

                      **Output MUST be in JSON format** and follow this exact structure:  
                        {
                            "morning_routine": [
                              { "step": "Cleanser", "product": "Product Name" },
                              { "step": "Toner", "product": "Product Name" },
                              { "step": "Essence", "product": "Product Name" },
                              { "step": "Moisturizer", "product": "Product Name" },
                              { "step": "Sunscreen", "product": "Product Name" }
                            ],
                            "evening_routine": [
                              { "step": "Double Cleanse", "product": "Product Name" },
                              { "step": "Cleanser", "product": "Product Name" },
                              { "step": "Toner", "product": "Product Name" },
                              { "step": "Essence", "product": "Product Name" },
                              { "step": "Moisturizer", "product": "Product Name" }
                            ]
                        }`
        },
        { 
          role: 'user', 
          content: [
            {
              type: 'text',
              text: `Build a Korean skincare routine with only Korean skincare products based on the following user details:
                        - Age: ${age}
                        - Goals: ${goals}
                    `
            }
          ]
        }
      ],
      // Choose model from here: https://platform.openai.com/docs/models
      model: "gpt-4o-mini",
      stream: false,
    })
  
    const reply = chatCompletion.choices[0].message.content
    console.log('OpenAI raw response:', reply);

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