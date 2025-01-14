'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { FiBookOpen, FiZap, FiStar, FiMenu, FiX } from 'react-icons/fi'

interface TableOfContentsProps {
  items: Array<{
    id: string
    title: string
    level: number
  }>
}

const TreeBranch = ({ level }: { level: number }) => {
  if (level === 0) return null

  return (
    <div 
      className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center"
      style={{ width: `${level * 16}px` }}
    >
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-purple-500/20">
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-1 h-1 bg-purple-400/30 rounded-full"
          animate={{
            x: ['0%', '100%'],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30" />
    </div>
  )
}

// Arka plan efektini ayrı bir component olarak çıkaralım
const BackgroundGlow = () => {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-xl -z-10">
      {/* Sabit gradient katmanı */}
      <div className="absolute inset-0 bg-[#1E1E2E] opacity-80" />
      
      {/* Blur edilmiş sabit gradientler */}
      <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-pink-500/5 rounded-full blur-3xl" />
      
      {/* Animasyonlu glow efekti */}
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          background: `
            radial-gradient(circle at 30% 30%, rgba(147,51,234,0.1), transparent 40%),
            radial-gradient(circle at 70% 70%, rgba(219,39,119,0.1), transparent 40%)
          `,
          filter: 'blur(32px)',
          transform: 'translate3d(0, 0, 0)', // GPU hızlandırma
          willChange: 'transform', // Performans optimizasyonu
        }}
      />
      
      {/* İnce detay çizgileri */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
    </div>
  )
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const [isHovered, setIsHovered] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Aktif başlığı takip et
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -80% 0px' }
    )

    items.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [items])

  // Büyülü parçacık efekti - Fixed pozisyonlu container içinde
  const Particles = () => (
    <div className="fixed inset-0 pointer-events-none" style={{ perspective: '1000px' }}>
      <div className="absolute left-8 top-1/2 -translate-y-1/2 w-72">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            initial={{ 
              x: 0, 
              y: 0, 
              scale: 0,
              opacity: 0 
            }}
            animate={{
              x: [0, (Math.random() - 0.5) * 100],
              y: [0, (Math.random() - 0.5) * 100],
              z: [0, Math.random() * -50],
              scale: [0, 1, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              repeatType: 'loop',
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transformStyle: 'preserve-3d'
            }}
          />
        ))}
      </div>
    </div>
  )

  // Scroll fonksiyonunu özelleştirelim
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (!element) return

    // Sabit offset değeri (header yüksekliği + ekstra boşluk)
    const offset = 100 // Bu değeri header yüksekliğine göre ayarlayabilirsiniz

    const elementTop = window.pageYOffset + element.getBoundingClientRect().top
    const targetPosition = elementTop - offset

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    })
  }

  return (
    <>
      {/* Mobil Menu Butonu */}
      <div className="lg:hidden fixed right-4 bottom-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-4 bg-[#1E1E2E]/80 rounded-full backdrop-blur-sm border border-purple-500/10 shadow-lg"
        >
          {isMobileMenuOpen ? (
            <FiX className="w-6 h-6 text-purple-400" />
          ) : (
            <FiMenu className="w-6 h-6 text-purple-400" />
          )}
        </button>
      </div>

      {/* Mobil İçindekiler Menüsü */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="lg:hidden fixed inset-x-4 bottom-20 z-50 max-h-[70vh] overflow-y-auto rounded-xl bg-[#1E1E2E]/95 backdrop-blur-lg border border-purple-500/10 shadow-2xl"
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <FiBookOpen className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                  İçindekiler
                </h3>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {items.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block py-2 px-4 rounded-lg transition-colors ${
                      activeId === item.id
                        ? 'bg-purple-500/10 text-purple-400'
                        : 'text-gray-400 hover:bg-purple-500/5 hover:text-purple-400'
                    }`}
                    style={{ paddingLeft: `${item.level * 16 + 16}px` }}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToHeading(item.id)
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <span className="text-sm">{item.title}</span>
                  </a>
                ))}
              </nav>

              {/* Alt Bilgi */}
              <div className="mt-4 pt-4 border-t border-purple-500/10">
                <div className="text-xs text-gray-500 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500/50 animate-pulse" />
                  <span>Büyülü navigasyon</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobil Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Fixed parçacıklar */}
      <AnimatePresence>
        {isHovered && <Particles />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:block fixed left-8 w-72"
        style={{ 
          bottom: '0',
          maxHeight: 'calc(100vh - 6rem)',
          overflowY: 'auto',
          willChange: 'transform',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div className="relative bg-[#1E1E2E]/80 rounded-t-xl p-6 border border-purple-500/10 backdrop-blur-sm">
          <BackgroundGlow />

          {/* Header */}
          <div className="relative flex items-center gap-3 mb-6">
            <motion.div
              className="p-2 bg-purple-500/10 rounded-lg"
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            >
              <FiBookOpen className="w-5 h-5 text-purple-400" />
            </motion.div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 text-transparent bg-clip-text bg-[length:200%_100%]" style={{
              animation: isHovered ? 'gradient-shift 3s linear infinite' : 'none'
            }}>
              İçindekiler
            </h3>
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <FiStar className="w-4 h-4 text-purple-400/50" />
            </motion.div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1 relative pl-6">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <TreeBranch level={item.level} />
                <a
                  href={`#${item.id}`}
                  className={`group flex items-center gap-2 py-1.5 transition-all relative ${
                    activeId === item.id ? 'text-purple-400' : ''
                  }`}
                  style={{ paddingLeft: item.level > 0 ? '12px' : '0' }}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToHeading(item.id)
                  }}
                >
                  {/* Başlık */}
                  <span className={`text-sm transition-colors ${
                    activeId === item.id 
                      ? 'text-purple-400 font-medium' 
                      : 'text-gray-400 group-hover:text-purple-400'
                  }`}>
                    {item.title}
                  </span>

                  {/* Hover efekti */}
                  <motion.div
                    className="absolute -left-4 right-0 top-0 bottom-0 bg-purple-500/5 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    layoutId={activeId === item.id ? "activeIndicator" : undefined}
                  />

                  {/* Aktif gösterge */}
                  {activeId === item.id && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -left-4 right-0 top-0 bottom-0 bg-purple-500/10 rounded-r-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}

                  {/* Büyülü parçacıklar (aktif başlık için) */}
                  {activeId === item.id && (
                    <div className="absolute left-0 w-1 h-full">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
                          animate={{
                            y: [0, -10, 0],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                          style={{ top: `${30 + i * 30}%` }}
                        />
                      ))}
                    </div>
                  )}
                </a>
              </motion.div>
            ))}

            {/* Ana bağlantı çizgisi */}
            <motion.div
              className="absolute left-0 top-0 w-px h-full"
              style={{
                background: 'linear-gradient(180deg, transparent, rgba(147,51,234,0.2) 20%, rgba(147,51,234,0.2) 80%, transparent)'
              }}
              animate={{
                scaleY: [0.8, 1.2, 0.8],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </nav>

          {/* Dekoratif alt element */}
          <div className="mt-6 pt-6 border-t border-purple-500/10">
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-purple-500/50"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                Büyülü navigasyon aktif
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  )
} 