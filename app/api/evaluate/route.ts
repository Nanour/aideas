import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const idea = searchParams.get('idea')

  if (!idea) {
    return NextResponse.json({ error: 'Idea parameter is required' }, { status: 400 })
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an expert startup analyst. Analyze the following AI startup idea and provide:
          1. Market size estimate
          2. Potential business model
          3. Monetization strategies
          4. Key competitors
          
          Format the response as a JSON object with these exact keys:
          - marketSize: string
          - businessModel: string
          - monetizationStrategies: string[]
          - competitors: string[]`,
        },
        {
          role: 'user',
          content: idea,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const content = completion.choices[0].message.content
    if (!content) {
      throw new Error('No content received from OpenAI')
    }

    let analysis
    try {
      analysis = JSON.parse(content)
    } catch (e) {
      throw new Error('Invalid JSON response from OpenAI')
    }

    // Validate the response structure
    if (!analysis.marketSize || !analysis.businessModel || 
        !Array.isArray(analysis.monetizationStrategies) || 
        !Array.isArray(analysis.competitors)) {
      throw new Error('Invalid response structure from OpenAI')
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error calling OpenAI API:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze the idea' },
      { status: 500 }
    )
  }
} 