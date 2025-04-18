'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Product {
  name: string
  description: string
  categories: string[]
  popularity: number
}

const categories = [
  'All', 'AI', 'Medical', 'E-commerce', 'Education', 'Finance', 
  'Entertainment', 'Productivity', 'Social Media', 'Gaming',
  'Development', 'Design', 'Marketing', 'Healthcare', 'Security'
]

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchTrendingProducts()
  }, [selectedCategory])

  const fetchTrendingProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/trending?category=${selectedCategory === 'All' ? '' : selectedCategory}`)
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/evaluate?idea=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AIdeas
        </h1>
        <p className="text-2xl text-gray-600 text-center max-w-2xl">
          The best tool to evaluate your ideas — your dream starts here.
        </p>
        
        <form onSubmit={handleSearch} className="w-full max-w-2xl">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter your AI startup idea..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-3 text-lg text-white hover:bg-blue-600 transition-colors"
            >
              <Search size={24} />
              Evaluate Your Idea
            </button>
          </div>
        </form>

        <div className="mt-16 w-full max-w-6xl">
          <h2 className="mb-8 text-3xl font-semibold text-center">Trending Products</h2>
          
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-8">Loading products...</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product, index) => (
                <div key={index} className="rounded-lg border p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <p className="mt-2 text-gray-600">{product.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.categories.map((category) => (
                      <span
                        key={category}
                        className="rounded-full bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-800"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${product.popularity}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{product.popularity}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
} 