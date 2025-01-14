'use client'

import { useEffect, useState, useRef, useCallback, Suspense } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiTag } from 'react-icons/fi'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

interface BlogPost {
  id: string
  title: string
  description: string
  image_url: string
  category: string
  published_at: string
  slug: string
  views: number
  tags: { id: string; name: string; slug: string }[]
}

// Kategoriler
const categories = [
  'Tümü',
  'JavaScript',
  'React',
  'Next.js',
  'TypeScript',
  'Backend',
  'DevOps',
  'Kariyer'
]

const POSTS_PER_PAGE = 6

function BlogContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const currentCategory = searchParams.get('category') || 'Tümü'
  const searchQuery = searchParams.get('search') || ''

  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  // Intersection Observer için ref
  const observerRef = useRef<IntersectionObserver>()
  const lastPostRef = useCallback((node: HTMLElement | null) => {
    if (loading) return
    
    if (observerRef.current) observerRef.current.disconnect()
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1)
      }
    })
    
    if (node) observerRef.current.observe(node)
  }, [loading, hasMore])

  const fetchPosts = async (pageNum: number) => {
    try {
      setLoading(true)
      
      const from = (pageNum - 1) * POSTS_PER_PAGE
      const to = from + POSTS_PER_PAGE - 1

      let query = supabase
        .from('blog_posts')
        .select(`
          *,
          tags:post_tags(
            tag:tags(*)
          )
        `, { count: 'exact' })
        .eq('status', 'published')
        .order('published_at', { ascending: false })

      // Kategori filtresi
      if (currentCategory !== 'Tümü') {
        query = query.eq('category', currentCategory)
      }

      // Arama filtresi
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      }

      // Sayfalama
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      // Etiketleri düzenle
      const formattedPosts = data?.map(post => ({
        ...post,
        tags: post.tags?.map((t: any) => t.tag) || []
      }))

      if (formattedPosts.length < POSTS_PER_PAGE || (count && from + formattedPosts.length >= count)) {
        setHasMore(false)
      }

      if (pageNum === 1) {
        setPosts(formattedPosts || [])
      } else {
        setPosts(prev => [...prev, ...(formattedPosts || [])])
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  // Sayfa değiştiğinde yeni postları getir
  useEffect(() => {
    fetchPosts(page)
  }, [page])

  // URL parametreleri değiştiğinde postları güncelle
  useEffect(() => {
    setPosts([])
    setHasMore(true)
    setPage(1)
    fetchPosts(1)
  }, [currentCategory, searchQuery])

  // Kategori değiştiğinde sıfırdan başla
  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('category', category)
    router.push(`/blog?${params.toString()}`)
  }

  // Arama yapıldığında sıfırdan başla
  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (query) {
      params.set('search', query)
    } else {
      params.delete('search')
    }
    router.push(`/blog?${params.toString()}`)
  }

  return (
    <div>
      {/* Arama ve Filtreler */}
      <div className="mb-12 space-y-6">
        {/* Arama */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Blog yazılarında ara..."
              defaultValue={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full bg-white/5 border border-purple-500/20 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
        </div>

        {/* Kategori Filtreleri */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-full transition-all ${
                currentCategory === category
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-purple-500/20'
              }`}
            >
              <span className="flex items-center gap-2">
                <FiTag />
                {category}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, index) => (
          <motion.article
            key={post.id}
            ref={index === posts.length - 1 ? lastPostRef : null}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-all group"
          >
            <Link href={`/blog/${post.slug}`} className="block">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <span>{post.category}</span>
                  <span>•</span>
                  <span>{new Date(post.published_at).toLocaleDateString('tr-TR')}</span>
                  <span>•</span>
                  <span>{post.views || 0} görüntülenme</span>
                </div>
                <h2 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-400 mb-4">{post.description}</p>
                <span className="text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center gap-2">
                  Devamını Oku 
                  <svg 
                    className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17 8l4 4m0 0l-4 4m4-4H3" 
                    />
                  </svg>
                </span>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="mt-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}

      {/* Sonuç bulunamadı mesajı */}
      {!loading && posts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-400 text-lg">
            Aramanızla eşleşen blog yazısı bulunamadı 😢
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#1a1a2e] text-white pt-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6 glitch-text">
            Kod Günlüğü
          </h1>
          <p className="text-xl text-purple-300">
            Yazılım dünyasından içgörüler ve deneyimler
          </p>
        </motion.div>

        <Suspense fallback={
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        }>
          <BlogContent />
        </Suspense>
      </div>
    </main>
  )
} 