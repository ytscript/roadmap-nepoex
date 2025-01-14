'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { FiCode, FiYoutube, FiCoffee, FiZap, FiGithub, FiTwitter } from 'react-icons/fi'
import RetroHero from '@/components/RetroHero'
import PixelCharacter from '@/components/PixelCharacter'
import MemeCard from '@/components/MemeCard'
import EasterEgg from '@/components/EasterEgg'
import PixelCursor from '@/components/PixelCursor'
import StarTrail from '@/components/StarTrail'
import LatestVideos from '@/components/LatestVideos'
import { supabase } from '@/lib/supabase'

const blogPosts = [
  {
    title: "Yazılımcının Kahve Molası",
    description: "Modern web geliştirmede sık yapılan 10 hata ve çözümleri. Junior'dan Senior'a püf noktalar!",
    image: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg",
    tags: ['Web', 'Best Practices']
  },
  {
    title: "TypeScript ile Zaman Yolculuğu",
    description: "JavaScript'ten TypeScript'e geçiş hikayem ve öğrendiğim değerli dersler.",
    image: "https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg",
    tags: ['TypeScript', 'Tecrübe']
  },
  {
    title: "React'in Karanlık Tarafı",
    description: "Büyük ölçekli React uygulamalarında performans optimizasyonu ve memory leak'ler.",
    image: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg",
    tags: ['React', 'Performance']
  },
  {
    title: "AI ile Pair Programming",
    description: "GitHub Copilot ve ChatGPT ile geliştirme sürecimi nasıl 2 kat hızlandırdım?",
    image: "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg",
    tags: ['AI', 'Productivity']
  },
  {
    title: "Next.js 14 ile Yeni Bir Dönem",
    description: "Server Actions, Parallel Routes ve daha fazlası. Next.js 14'ün tüm yenilikleri!",
    image: "https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg",
    tags: ['Next.js', 'Frontend']
  },
  {
    title: "State Management Savaşları",
    description: "Redux mu, Zustand mı, Jotai mi? 2024'te hangi state yönetim çözümünü seçmeliyiz?",
    image: "https://images.pexels.com/photos/4709285/pexels-photo-4709285.jpeg",
    tags: ['React', 'Architecture']
  }
]

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [partyMode, setPartyMode] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const [recentPosts, setRecentPosts] = useState<Array<{
    id: string
    title: string
    description: string
    image_url: string
    category: string
    slug: string
  }>>([])

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000)
  }, [])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    console.log(`%c
    ███╗   ██╗███████╗██████╗  ██████╗ ███████╗██╗  ██╗
    ████╗  ██║██╔════╝██╔══██╗██╔═══██╗██╔════╝╚██╗██╔╝
    ██╔██╗ ██║█████╗  ██████╔╝██║   ██║█████╗   ╚███╔╝ 
    ██║╚██╗██║██╔══╝  ██╔═══╝ ██║   ██║██╔══╝   ██╔██╗ 
    ██║ ╚████║███████╗██║     ╚██████╔╝███████╗██╔╝ ██╗
    ╚═╝  ╚═══╝╚══════╝╚═╝      ╚═════╝ ╚══════╝╚═╝  ╚═╝
    
    🚀 Hadi biraz hack'leyelim! 😎
    `, 'color: #9333EA; font-family: monospace; font-size: 12px;')
  }, [])

  useEffect(() => {
    fetchRecentPosts()
  }, [])

  const fetchRecentPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, description, image_url, category, slug')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(3)

      if (error) throw error
      setRecentPosts(data || [])
    } catch (error) {
      console.error('Error fetching recent posts:', error)
    }
  }

  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setClickCount(prev => {
      const newCount = prev + 1
      console.log('Click count:', newCount) // Debug için

      if (newCount === 10) {
        setPartyMode(true)
        import('canvas-confetti').then(confetti => {
          confetti.default({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          })
        })

        // 3 saniye sonra party mode'u kapat
        setTimeout(() => {
          setPartyMode(false)
        }, 3000)

        return 0
      }
      return newCount
    })
  }, [])

  return (
    <div className="min-h-screen overflow-hidden relative cursor-none home-page bg-[#1a1a2e] text-white select-none">
      <EasterEgg />
      {/* Synthwave Sun Effect */}
      <div className="fixed bottom-0 left-0 right-0 h-[40vh] bg-gradient-to-t from-purple-600/20 via-orange-400/10 to-transparent" />

      <main className="relative">
        {/* Loading Screen */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1a2e]"
            >
              <PixelCharacter animation="loading" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center relative">
          {isMounted && <RetroHero />}
          <div className="text-center z-10">
            <div 
              onClick={handleLogoClick}
              className={`cursor-pointer ${partyMode ? 'animate-bounce' : ''}`}
            >
              <h1 className="text-7xl font-bold mb-6 retro-text">
                {"< Kod && Eğlence />"}
              </h1>
              <p className="text-xl mb-8 text-purple-300">
                Yazılım öğrenmenin en eğlenceli yolu! 🚀
              </p>
            </div>
            
            <div className="flex gap-4 justify-center mt-8">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="pixel-btn"
                onClick={() => window.open('https://youtube.com/@nepoex', '_blank')}
              >
                <span className="pixel-btn-text clickable">YouTube</span>
                <FiYoutube className="ml-2" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="pixel-btn"
                onClick={() => window.open('/blog')}
              >
                <span className="pixel-btn-text">Blog</span>
                <FiCoffee className="ml-2" />
              </motion.button>
            </div>
          </div>
        </section>

        {/* Latest Videos Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 glitch-text">
              Son Videolar
            </h2>
            <LatestVideos />
          </div>
        </section>

        {/* Blog Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4 glitch-text">
              Kod Günlüğü
            </h2>
            <p className="text-center text-gray-400 mb-12 text-lg">
              Yazılım dünyasından içgörüler, tecrübeler ve teknik derinlemesine analizler
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <motion.article
                  key={post.id}
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

            {/* Devamını Göster Butonu */}
            <div className="text-center mt-12">
              <Link 
                href="/blog" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-full transition-colors group"
              >
                <span>Tüm Yazıları Gör</span>
                <svg 
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
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
              </Link>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8 glitch-text">
              Yazılım Dünyasına Katıl!
            </h2>
            <p className="text-xl mb-8 text-gray-400">
              Yeni videolar, blog yazıları ve yazılım dünyasından komik anlar için abone ol.
              <br />
              <span className="text-purple-400">%100 spam-free, sadece kaliteli içerik!</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="eposta@adresin.com"
                className="px-6 py-3 rounded-full bg-white/5 border border-purple-500/20 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
              <button className="pixel-btn">
                Abone Ol!
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-20 px-4 border-t border-purple-500/10">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex justify-center space-x-8 mb-8">
              <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400">
                <FiGithub className="w-6 h-6" />
              </a>
              <a href="https://youtube.com/@yourusername" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400">
                <FiYoutube className="w-6 h-6" />
              </a>
              <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400">
                <FiTwitter className="w-6 h-6" />
              </a>
            </div>
            <p className="text-gray-400">
              © 2024 Nepoex. Tüm hakları saklıdır. 
              <br />
              <span className="text-sm">Yazılım dünyasına eğlenceli bir bakış 🚀</span>
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
} 