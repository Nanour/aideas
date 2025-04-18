'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

interface AnalysisResult {
  marketSize: string
  businessModel: string
  monetizationStrategies: string[]
  competitors: string[]
}

export default function EvaluatePage() {
  const searchParams = useSearchParams()
  const idea = searchParams.get('idea')
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/evaluate?idea=${encodeURIComponent(idea || '')}`)
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to analyze the idea')
        }

        // Validate the response structure
        if (!data.marketSize || !data.businessModel || !Array.isArray(data.monetizationStrategies) || !Array.isArray(data.competitors)) {
          throw new Error('Invalid response format from the server')
        }

        setAnalysis(data)
      } catch (error) {
        console.error('Error fetching analysis:', error)
        setError(error instanceof Error ? error.message : 'Failed to analyze the idea')
      } finally {
        setLoading(false)
      }
    }

    if (idea) {
      fetchAnalysis()
    }
  }, [idea])

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-xl">Analyzing your idea...</div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-xl text-red-500">{error}</div>
        <button
          onClick={() => window.history.back()}
          className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Go Back
        </button>
      </main>
    )
  }

  if (!analysis) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-xl text-red-500">No analysis available</div>
        <button
          onClick={() => window.history.back()}
          className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Go Back
        </button>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">Analysis Results</h1>
        <div className="mb-8">
          <h2 className="text-xl font-semibold">Your Idea:</h2>
          <p className="mt-2 text-gray-600">{idea}</p>
        </div>

        <div className="grid gap-8">
          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Market Size</h2>
            <p className="text-gray-600">{analysis.marketSize}</p>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Business Model</h2>
            <p className="text-gray-600">{analysis.businessModel}</p>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Monetization Strategies</h2>
            <ul className="list-inside list-disc text-gray-600">
              {analysis.monetizationStrategies.map((strategy, index) => (
                <li key={index}>{strategy}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Competitors</h2>
            <ul className="list-inside list-disc text-gray-600">
              {analysis.competitors.map((competitor, index) => (
                <li key={index}>{competitor}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => window.history.back()}
            className="rounded-lg bg-blue-500 px-6 py-3 text-white hover:bg-blue-600"
          >
            Analyze Another Idea
          </button>
        </div>
      </div>
    </main>
  )
} 