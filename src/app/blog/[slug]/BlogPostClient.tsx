'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiCalendar, FiTag, FiShare2, FiList, FiEye } from 'react-icons/fi'
import { BsBookmark, BsBookmarkFill, BsBook, BsBookFill } from 'react-icons/bs'
import { supabase } from '@/lib/supabase'
import Markdown from 'react-markdown'
import Link from 'next/link'
import CodeBlock from '@/components/CodeBlock'
import Footer from '@/components/Footer'
import TableOfContents from '@/components/TableOfContents'
import Comments from '@/components/Comments'
import { useRouter } from 'next/navigation'

interface BlogPost {
  id: string
  title: string
  content: string
  image_url: string
  category: string
  published_at: string
  views: number
  slug: string
  tags: { id: string; name: string; slug: string }[]
}

interface TableOfContentsItem {
  id: string
  title: string
  level: number
}

export default function BlogPostClient({ slug }: { slug: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isFavorited, setIsFavorited] = useState(false)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [toc, setToc] = useState<TableOfContentsItem[]>([])
  const [readingProgress, setReadingProgress] = useState(0)
  const articleRef = useRef<HTMLElement>(null)
  const [isInReadingList, setIsInReadingList] = useState(false)

  // Okuma ilerlemesini takip et
  useEffect(() => {
    const handleScroll = () => {
      if (!articleRef.current) return

      const element = articleRef.current
      const totalHeight = element.clientHeight - window.innerHeight
      const windowScrollTop = window.scrollY - element.offsetTop
      
      if (windowScrollTop <= 0) {
        setReadingProgress(0)
        return
      }
      
      if (windowScrollTop > totalHeight) {
        setReadingProgress(100)
        return
      }

      setReadingProgress((windowScrollTop / totalHeight) * 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // İçindekiler tablosunu oluştur
  useEffect(() => {
    if (!post?.content) return

    const headings = post.content.match(/#{2,4}\s.+/g) || []
    const tocItems = headings.map(heading => {
      const level = (heading.match(/#/g) || []).length - 1
      const title = heading.replace(/#{2,4}\s/, '')
      const id = title.toLowerCase().replace(/\s+/g, '-')
      return { id, title, level }
    })

    setToc(tocItems)
  }, [post?.content])

  // İlgili yazıları getir
  const fetchRelatedPosts = async (category: string, currentPostId: string) => {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('category', category)
      .eq('status', 'published')
      .neq('id', currentPostId)
      .limit(3)

    if (data) setRelatedPosts(data)
  }

  // Favori durumunu kontrol et
  const checkFavoriteStatus = async () => {
    try {
      const { data: session } = await supabase.auth.getSession()
      if (!session?.session?.user || !post) return

      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', session.session.user.id)
        .eq('post_id', post.id)
        .single()

      setIsFavorited(!!data)
    } catch (error) {
      console.error('Error checking favorite status:', error)
    }
  }

  // Favori işlemi
  const handleFavorite = async () => {
    try {
      const { data: session } = await supabase.auth.getSession()
      if (!session?.session?.user || !post) {
        router.push('/giris') // Giriş sayfasına yönlendir
        return
      }

      if (isFavorited) {
        // Favorilerden kaldır
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', session.session.user.id)
          .eq('post_id', post.id)

        if (error) throw error
        setIsFavorited(false)
      } else {
        // Favorilere ekle
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: session.session.user.id,
            post_id: post.id
          })

        if (error) throw error
        setIsFavorited(true)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  // Okuma listesi durumunu kontrol et
  const checkReadingListStatus = async () => {
    try {
      const { data: session } = await supabase.auth.getSession()
      if (!session?.session?.user || !post) return

      const { data } = await supabase
        .from('reading_list')
        .select('id')
        .eq('user_id', session.session.user.id)
        .eq('post_id', post.id)
        .single()

      setIsInReadingList(!!data)
    } catch (error) {
      console.error('Error checking reading list status:', error)
    }
  }

  // Okuma listesi işlemi
  const handleReadingList = async () => {
    try {
      const { data: session } = await supabase.auth.getSession()
      if (!session?.session?.user || !post) {
        router.push('/giris') // Giriş sayfasına yönlendir
        return
      }

      if (isInReadingList) {
        // Okuma listesinden kaldır
        const { error } = await supabase
          .from('reading_list')
          .delete()
          .eq('user_id', session.session.user.id)
          .eq('post_id', post.id)

        if (error) throw error
        setIsInReadingList(false)
      } else {
        // Okuma listesine ekle
        const { error } = await supabase
          .from('reading_list')
          .insert({
            user_id: session.session.user.id,
            post_id: post.id
          })

        if (error) throw error
        setIsInReadingList(true)
      }
    } catch (error) {
      console.error('Error toggling reading list:', error)
    }
  }

  useEffect(() => {
    if (post) {
      checkFavoriteStatus()
      checkReadingListStatus()
    }
  }, [post])

  useEffect(() => {
    if (!loading && !post) {
      router.replace('/404')
    }
  }, [loading, post, router])

  useEffect(() => {
    fetchPost()
  }, [slug])

  const fetchPost = async () => {
    try {
      // Önce yazıyı getir
      const { data: initialData, error: initialError } = await supabase
        .from('blog_posts')
        .select(`
          *,
          tags:post_tags(
            tag:tags(*)
          )
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

      if (initialError) throw initialError

      // Görüntülenme sayısını artır
      const { data: updatedData, error: updateError } = await supabase
        .from('blog_posts')
        .update({ views: (initialData.views || 0) + 1 })
        .eq('id', initialData.id)
        .select(`
          *,
          tags:post_tags(
            tag:tags(*)
          )
        `)
        .single()

      if (updateError) {
        console.error('Error updating views:', updateError)
        // Hata olsa bile orijinal veriyi göster
        const formattedPost = {
          ...initialData,
          tags: initialData.tags?.map((t: any) => t.tag) || []
        }
        setPost(formattedPost)
      } else {
        // Güncellenmiş veriyi göster
        const formattedPost = {
          ...updatedData,
          tags: updatedData.tags?.map((t: any) => t.tag) || []
        }
        setPost(formattedPost)
      }

      if (initialData) {
        fetchRelatedPosts(initialData.category, initialData.id)
      }
    } catch (error) {
      console.error('Error fetching post:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#1a1a2e] text-white pt-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-white/10 rounded w-3/4" />
            <div className="aspect-video bg-white/10 rounded-xl" />
            <div className="space-y-4">
              <div className="h-4 bg-white/10 rounded w-1/4" />
              <div className="h-4 bg-white/10 rounded w-full" />
              <div className="h-4 bg-white/10 rounded w-2/3" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!post) {
    return null
  }

  return (
    <main className="min-h-screen bg-[#1a1a2e] text-white pt-24">
      {/* Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-purple-500 transition-all duration-300 z-50"
        style={{ width: `${readingProgress}%` }}
      />
      
      <div className="relative max-w-4xl mx-auto px-4">
        {/* Back to Blog Button */}
        <Link
          href="/blog"
          className="fixed left-8 top-24 z-40 flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-sm transition-all hover:scale-105 text-sm text-gray-400 hover:text-white"
        >
          <FiList className="w-4 h-4" />
          Blog'a Dön
        </Link>

        {/* Table of Contents */}
        <TableOfContents items={toc} />

        <article ref={articleRef} className="relative">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-5xl font-bold mb-8 glitch-text">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <FiCalendar />
                <span>{new Date(post.published_at).toLocaleDateString('tr-TR')}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiTag />
                <span>{post.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiEye />
                <span>{post.views || 0} görüntülenme</span>
              </div>
            </div>

            {/* Etiketler */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map(tag => (
                  <Link
                    key={tag.id}
                    href={`/blog?tag=${tag.slug}`}
                    className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm hover:bg-purple-500/20 transition-colors"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12"
          >
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full aspect-video object-cover rounded-xl"
            />
          </motion.div>

          {/* Favorite ve Reading List Butonları */}
          <div className="fixed lg:right-8 lg:top-1/2 lg:-translate-y-1/2 right-4 bottom-20 z-40 flex flex-col gap-4">
            <div className="group relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleFavorite}
                className={`p-4 rounded-full ${
                  isFavorited ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-gray-400 hover:bg-purple-500/20 hover:text-purple-400'
                } transition-colors transform-gpu backdrop-blur-sm`}
              >
                {isFavorited ? (
                  <BsBookmarkFill className="w-6 h-6" />
                ) : (
                  <BsBookmark className="w-6 h-6" />
                )}
              </motion.button>
              <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-2 bg-black/80 text-sm rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap backdrop-blur-sm z-50">
                {isFavorited ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
              </span>
            </div>

            <div className="group relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleReadingList}
                className={`p-4 rounded-full ${
                  isInReadingList ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-gray-400 hover:bg-blue-500/20 hover:text-blue-400'
                } transition-colors transform-gpu backdrop-blur-sm`}
              >
                {isInReadingList ? (
                  <BsBookFill className="w-6 h-6" />
                ) : (
                  <BsBook className="w-6 h-6" />
                )}
              </motion.button>
              <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-2 bg-black/80 text-sm rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap backdrop-blur-sm z-50">
                {isInReadingList ? 'Okuma Listesinden Çıkar' : 'Okuma Listesine Ekle'}
              </span>
            </div>
          </div>

          {/* Content with anchor links */}
          <motion.div className="prose prose-lg prose-invert max-w-none">
            <Markdown
              components={{
                h2: ({ children }) => {
                  const id = String(children).toLowerCase().replace(/\s+/g, '-')
                  return <h2 id={id}>{children}</h2>
                },
                h3: ({ children }) => {
                  const id = String(children).toLowerCase().replace(/\s+/g, '-')
                  return <h3 id={id}>{children}</h3>
                },
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  const filename = props['data-filename']
                  return !inline && match ? (
                    <CodeBlock
                      language={match[1]}
                      value={String(children).replace(/\n$/, '')}
                      filename={filename}
                    />
                  ) : (
                    <code {...props} className={className}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {post.content}
            </Markdown>
          </motion.div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-16 pt-8 border-t border-purple-500/20"
            >
              <h3 className="text-2xl font-bold mb-8">İlgini Çekebilecek Diğerleri</h3>
              <div className="grid md:grid-cols-3 gap-8">
                {relatedPosts.map(relatedPost => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="group block"
                  >
                    <div className="aspect-video rounded-lg overflow-hidden mb-4">
                      <img
                        src={relatedPost.image_url}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="font-bold group-hover:text-purple-400 transition-colors">
                      {relatedPost.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Share Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 pt-8 border-t border-purple-500/20"
          >
            <h3 className="text-xl font-bold mb-4">Paylaş</h3>
            <div className="flex gap-4">
              {/* Twitter */}
              <button className="px-4 py-2 bg-[#1DA1F2]/10 text-[#1DA1F2] rounded-full hover:bg-[#1DA1F2]/20 transition-colors">
                Twitter
              </button>
              {/* LinkedIn */}
              <button className="px-4 py-2 bg-[#0A66C2]/10 text-[#0A66C2] rounded-full hover:bg-[#0A66C2]/20 transition-colors">
                LinkedIn
              </button>
            </div>
          </motion.div>
        </article>
      </div>

      {/* Yorumlar */}
      <Comments postSlug={slug} />

      <Footer />
    </main>
  )
} 