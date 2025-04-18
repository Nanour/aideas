import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const categories = [
  'AI', 'Medical', 'E-commerce', 'Education', 'Finance', 
  'Entertainment', 'Productivity', 'Social Media', 'Gaming',
  'Development', 'Design', 'Marketing', 'Healthcare', 'Security'
]

// Fallback data with real product names and more accurate popularity scores
const fallbackProducts = [
  {
    name: "ChatGPT",
    description: "AI-powered conversational assistant",
    categories: ["AI"],
    popularity: 95,
    metrics: {
      monthlyUsers: "100M+",
      marketShare: "Leading AI assistant",
      growthRate: "Rapid"
    }
  },
  {
    name: "Slack",
    description: "Team communication and collaboration platform",
    categories: ["Productivity"],
    popularity: 90,
    metrics: {
      dailyUsers: "20M+",
      companies: "Fortune 100 companies",
      marketShare: "Leading team chat"
    }
  },
  {
    name: "Zoom",
    description: "Video conferencing and virtual meeting platform",
    categories: ["Productivity"],
    popularity: 88,
    metrics: {
      dailyParticipants: "300M+",
      marketShare: "Leading video conferencing",
      growthRate: "Stable"
    }
  },
  {
    name: "Shopify",
    description: "E-commerce platform for online stores",
    categories: ["E-commerce"],
    popularity: 85,
    metrics: {
      merchants: "1.7M+",
      marketShare: "Leading e-commerce platform",
      growthRate: "Steady"
    }
  },
  {
    name: "Notion",
    description: "All-in-one workspace for notes, tasks, and projects",
    categories: ["Productivity"],
    popularity: 82,
    metrics: {
      users: "30M+",
      marketShare: "Leading workspace tool",
      growthRate: "Rapid"
    }
  },
  {
    name: "Figma",
    description: "Collaborative interface design tool",
    categories: ["Design"],
    popularity: 80
  },
  {
    name: "GitHub",
    description: "Platform for version control and collaboration",
    categories: ["Development"],
    popularity: 78
  },
  {
    name: "TikTok",
    description: "Short-form video sharing platform",
    categories: ["Social Media", "Entertainment"],
    popularity: 75
  },
  {
    name: "Spotify",
    description: "Music streaming service",
    categories: ["Entertainment"],
    popularity: 72
  },
  {
    name: "Netflix",
    description: "Streaming entertainment service",
    categories: ["Entertainment"],
    popularity: 70
  },
  {
    name: "Adobe Photoshop",
    description: "Professional image editing software",
    categories: ["Design"],
    popularity: 68
  },
  {
    name: "Microsoft Teams",
    description: "Business communication platform",
    categories: ["Productivity"],
    popularity: 65
  },
  {
    name: "Salesforce",
    description: "Customer relationship management platform",
    categories: ["Marketing"],
    popularity: 62
  },
  {
    name: "WordPress",
    description: "Content management system",
    categories: ["Development"],
    popularity: 60
  },
  {
    name: "LinkedIn",
    description: "Professional networking platform",
    categories: ["Social Media"],
    popularity: 58
  },
  {
    name: "Dropbox",
    description: "Cloud storage and file sharing",
    categories: ["Productivity"],
    popularity: 55
  },
  {
    name: "Trello",
    description: "Project management tool",
    categories: ["Productivity"],
    popularity: 52
  },
  {
    name: "Canva",
    description: "Graphic design platform",
    categories: ["Design"],
    popularity: 50
  },
  {
    name: "Discord",
    description: "Voice and text chat platform",
    categories: ["Social Media", "Gaming"],
    popularity: 48
  },
  {
    name: "Twitch",
    description: "Live streaming platform",
    categories: ["Gaming", "Entertainment"],
    popularity: 45
  },
  {
    name: "Epic Games Store",
    description: "Digital video game storefront",
    categories: ["Gaming"],
    popularity: 42
  },
  {
    name: "Epic EHR",
    description: "Electronic health records system",
    categories: ["Medical", "Healthcare"],
    popularity: 40
  },
  {
    name: "Cerner",
    description: "Healthcare information technology",
    categories: ["Medical", "Healthcare"],
    popularity: 38
  },
  {
    name: "Stripe",
    description: "Online payment processing",
    categories: ["Finance", "E-commerce"],
    popularity: 35
  },
  {
    name: "PayPal",
    description: "Online payment system",
    categories: ["Finance", "E-commerce"],
    popularity: 32
  },
  {
    name: "MongoDB",
    description: "NoSQL database program",
    categories: ["Development"],
    popularity: 30
  },
  {
    name: "Docker",
    description: "Containerization platform",
    categories: ["Development"],
    popularity: 28
  },
  {
    name: "Kubernetes",
    description: "Container orchestration system",
    categories: ["Development"],
    popularity: 25
  },
  {
    name: "AWS",
    description: "Cloud computing platform",
    categories: ["Development"],
    popularity: 22
  },
  {
    name: "Google Cloud",
    description: "Cloud computing services",
    categories: ["Development"],
    popularity: 20
  }
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an expert software analyst. Provide a list of 50 popular software products.
          For each product, include:
          - name: string
          - description: string
          - categories: string[] (choose from: ${categories.join(', ')})
          - popularity: number (1-100, based on:
            * Market share (40%)
            * User base size (30%)
            * Growth rate (20%)
            * Industry recognition (10%)
          )
          - metrics: {
            * key metric 1: string
            * key metric 2: string
            * key metric 3: string
          }
          
          Return ONLY the JSON array, no markdown formatting or additional text.
          Sort by popularity in descending order.`,
        },
        {
          role: 'user',
          content: category ? `List 50 popular software products in the ${category} category` : 'List 50 popular software products across all categories',
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    })

    const content = completion.choices[0].message.content
    if (!content) {
      throw new Error('No content received from OpenAI')
    }

    let products
    try {
      // Clean the response to ensure it's valid JSON
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim()
      products = JSON.parse(cleanContent)
      
      // Ensure products is an array
      if (!Array.isArray(products)) {
        products = fallbackProducts
      }
      
      // Ensure we have exactly 50 items
      if (products.length < 50) {
        const additionalItems = fallbackProducts.slice(products.length)
        products = [...products, ...additionalItems]
      }
    } catch (e) {
      console.error('Error parsing OpenAI response:', e)
      products = fallbackProducts
    }

    // Filter by category if specified
    if (category && category !== 'All') {
      products = products.filter(product => 
        product.categories.includes(category)
      )
    }

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error calling OpenAI API:', error)
    return NextResponse.json(fallbackProducts)
  }
} 