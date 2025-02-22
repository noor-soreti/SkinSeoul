import OpenAI from 'https://deno.land/x/openai@v4.24.0/mod.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts"

Deno.serve(async (req) => {
  const apiKey = Deno.env.get('OPENAI_API_KEY')
  const openai = new OpenAI({
    apiKey: apiKey,
  })

  // Documentation here: https://github.com/openai/openai-node
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      { 
        role: 'user', 
        content: 'how many sides are there to a dice?' }
    ],
    // Choose model from here: https://platform.openai.com/docs/models
    model: 'gpt-4o',
    stream: false,
  })

  const reply = chatCompletion.choices[0].message.content

  return new Response(JSON.stringify({ message: reply }), {
    headers: { 
      'Content-Type': 'application/json',
      ...corsHeaders 
    },
  })
})


// const RoutineEvent = z.object({
//   morning_routine: z.array(
//     z.object({ step: z.literal("Cleanser"), product: z.string() })
//       .or(z.object({ step: z.literal("Toner"), product: z.string() }))
//       .or(z.object({ step: z.literal("Essence"), product: z.string() }))
//       .or(z.object({ step: z.literal("Moisturizer"), product: z.string() }))
//       .or(z.object({ step: z.literal("Sunscreen"), product: z.string() }))
//   ),
//   evening_routine: z.array(
//     z.object({ step: z.literal("Double Cleanse"), product: z.string() })
//       .or(z.object({ step: z.literal("Cleanser"), product: z.string() }))
//       .or(z.object({ step: z.literal("Toner"), product: z.string() }))
//       .or(z.object({ step: z.literal("Essence"), product: z.string() }))
//       .or(z.object({ step: z.literal("Moisturizer"), product: z.string() }))
//   )
// });

// Deno.serve(async (req) => {

  // // handle CORS
  // if (req.method === 'OPTIONS') {
  //   return new Response('ok', { headers: corsHeaders })
  // }
  
//   try {
//     const { userData } = await req.json()
//     const openai = new OpenAI({
//       apiKey: Deno.env.get('OPENAI_API_KEY')
//     })

//     const chatCompletion = await openai.chat.completions.create({
//       model: "gpt-4",
//       messages: [
//           {
//               role: "system",
//               content: `You are a Korean skincare expert.Analyze the user's skin from the provided image and identify any visible issues such as acne, hyperpigmentation, redness, and wrinkles.
//                           Then, recommend a skincare routine using only Korean skincare products from these brands:
//                           - Laneige
//                           - Innisfree
//                           - Etude House
//                           - Missha
//                           - Some By Mi
//                           - Dr. Jart+
//                           - Beauty of Joseon
//                           - Pyunkang Yul
//                           - Mediheal
//                           - Isntree
//                           - Klairs
//                           - Neogen
//                           - ROUND LAB
//                           - Sulwhasoo
//                           - The History of Whoo
//                           - Banila Co
//                           - Belif
//                           - Skin1004
//                           - Purito
//                           - Torriden
//                           - Anua
//                           - TIRTIR
//                           -  Goodal
//                           - Dr. Ceuracle
//                           - Amorepacific
//                           - Holika Holika
//                           - TonyMoly
//                           - VT Cosmetics
//                           - Illiyoon
                          
//                       **Output MUST be in JSON format** and follow this exact structure:  
//                         {
//                             "morning_routine": [
//                               { "step": "Cleanser", "product": "Product Name" },
//                               { "step": "Toner", "product": "Product Name" },
//                               { "step": "Essence", "product": "Product Name" },
//                               { "step": "Moisturizer", "product": "Product Name" },
//                               { "step": "Sunscreen", "product": "Product Name" }
//                             ],
//                             "evening_routine": [
//                               { "step": "Double Cleanse", "product": "Product Name" },
//                               { "step": "Cleanser", "product": "Product Name" },
//                               { "step": "Toner", "product": "Product Name" },
//                               { "step": "Essence", "product": "Product Name" },
//                               { "step": "Moisturizer", "product": "Product Name" }
//                             ]
//                         }`
//           },
//         {
//           role: "user",
//           content: [
//             { 
//               type: "text", 
//               text: `Build a Korean skincare routine with only Korean skincare products based on the following user details:
//               - Age: ${userData.age}
//               - Skincare Goals: ${userData.goals}
//               `
//        },
//             // {
//             //   type: "image_url",
//             //   image_url: {
//             //     "url": "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.redd.it%2Fx1f4q8vxfty91.jpg&f=1&nofb=1&ipt=945430cbe0baf1b40571fe5799c0be03f2dfb3764b5d196f731cca376ce738f7&ipo=images",
//             //   },
//             // },
//           ],
//         },
//       ],
//       stream: false,
//     })

//     const response = chatCompletion.choices[0].message.content
//     // Parse and validate the response
//     if (!response) {
//       throw new Error('No response from OpenAI')
//     }
//     const parsedResponse = JSON.parse(response)
//     const validatedResponse = RoutineEvent.parse(parsedResponse)

//     return new Response(JSON.stringify(validatedResponse), {
//       headers: {
//         ...corsHeaders,
//         'Content-Type': 'application/json',
//       },
//     })
//   } catch (error: unknown) {
//     const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
//     return new Response(JSON.stringify({ error: errorMessage }), {
//       headers: {
//         ...corsHeaders,
//         'Content-Type': 'application/json',
//       },
//     })
//   }
// })