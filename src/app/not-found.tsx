'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface StarPosition {
  top: number
  left: number
  size?: number
  delay?: number
}

// Statik yıldız pozisyonları - Farklı boyutlarda
const STARS: StarPosition[] = [
  { top: 15, left: 25, size: 2, delay: 0.2 },
  { top: 35, left: 45, size: 1, delay: 0.5 },
  { top: 75, left: 85, size: 3, delay: 0.3 },
  { top: 55, left: 15, size: 1, delay: 0.7 },
  { top: 85, left: 35, size: 2, delay: 0.4 },
  { top: 25, left: 65, size: 1, delay: 0.6 },
  { top: 45, left: 95, size: 2, delay: 0.2 },
  { top: 65, left: 75, size: 1, delay: 0.5 },
  { top: 95, left: 55, size: 3, delay: 0.3 },
  { top: 5, left: 5, size: 1, delay: 0.8 },
  { top: 30, left: 80, size: 2, delay: 0.4 },
  { top: 80, left: 30, size: 1, delay: 0.6 },
  { top: 20, left: 50, size: 2, delay: 0.3 },
  { top: 50, left: 20, size: 1, delay: 0.7 },
  { top: 70, left: 60, size: 3, delay: 0.2 },
  { top: 60, left: 70, size: 1, delay: 0.5 },
  { top: 40, left: 10, size: 2, delay: 0.4 },
  { top: 10, left: 40, size: 1, delay: 0.6 },
  { top: 90, left: 90, size: 2, delay: 0.3 },
  { top: 15, left: 85, size: 1, delay: 0.7 }
]

// Uzay cisimleri - Daha fazla ve çeşitli
const SPACE_OBJECTS = [
  { top: 10, left: 15, rotation: 45, scale: 0.8, color: 'purple' },
  { top: 70, left: 80, rotation: -30, scale: 1.2, color: 'blue' },
  { top: 30, left: 75, rotation: 15, scale: 0.9, color: 'pink' },
  { top: 85, left: 25, rotation: -45, scale: 1.1, color: 'indigo' },
  { top: 20, left: 60, rotation: 60, scale: 0.7, color: 'violet' },
  { top: 60, left: 35, rotation: -15, scale: 1.0, color: 'purple' }
]

const GLITCH_COLORS = ['#ff00ff', '#00ffff', '#ff0000', '#0000ff']

export default function NotFound() {
  const [showAnswer, setShowAnswer] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [glitchColor, setGlitchColor] = useState(GLITCH_COLORS[0])

  useEffect(() => {
    const timer = setTimeout(() => setShowAnswer(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  // Glitch efekti için renk değişimi
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchColor(GLITCH_COLORS[Math.floor(Math.random() * GLITCH_COLORS.length)])
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // Paralaks efekti için mouse takibi
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20,
        y: (e.clientY / window.innerHeight) * 20
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0f0f2e] via-[#1a1a2e] to-[#2a1a3a] overflow-hidden">
      {/* Arka plan gradyanı */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,0,255,0.1),transparent_70%)]" />
      
      {/* Uzay cisimleri */}
      {SPACE_OBJECTS.map((obj, i) => (
        <motion.div
          key={`space-obj-${i}`}
          className="absolute opacity-20"
          style={{
            top: `${obj.top}%`,
            left: `${obj.left}%`,
            zIndex: 1
          }}
          initial={{ rotate: obj.rotation, scale: obj.scale }}
          animate={{
            rotate: obj.rotation + 360,
            x: mousePosition.x * (obj.scale * 2),
            y: mousePosition.y * (obj.scale * 2)
          }}
          transition={{
            rotate: {
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "linear"
            },
            x: { type: "spring", stiffness: 50 },
            y: { type: "spring", stiffness: 50 }
          }}
        >
          <div 
            className={`w-32 h-32 rounded-full blur-xl`}
            style={{
              background: `radial-gradient(circle at center, ${obj.color}50, transparent 70%)`
            }}
          />
        </motion.div>
      ))}

      {/* Yıldızlar */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        {STARS.map((star, i) => (
          <motion.div
            key={`star-${i}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0.5, 1, 0],
              scale: [0, 1, 0.8, 1, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: star.delay,
              ease: "easeInOut"
            }}
            className="absolute bg-white rounded-full"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${star.size || 1}px`,
              height: `${star.size || 1}px`,
              boxShadow: `0 0 ${(star.size || 1) * 2}px ${(star.size || 1)}px rgba(255,255,255,0.8)`
            }}
          />
        ))}
      </div>

      {/* Ana içerik */}
      <div className="relative flex items-center justify-center min-h-screen p-4" style={{ zIndex: 3 }}>
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <motion.h1 
              className="text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-purple-300 to-purple-500 mb-4 leading-none select-none"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{ textShadow: `3px 3px 0 ${glitchColor}` }}
            >
              404
            </motion.h1>
            
            <motion.div
              className="absolute inset-0 text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-purple-300 to-purple-500 mb-4 leading-none select-none"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.2 }}
              transition={{ duration: 0.5 }}
              style={{ filter: 'blur(15px)' }}
            >
              404
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-purple-200 mb-8 backdrop-blur-sm bg-purple-500/5 p-6 rounded-2xl border border-purple-500/10"
          >
            <p className="mb-2">Oops! Sanırım bir bug'a yakalandın! 🐛</p>
            <p>Bu sayfa henüz kodlanmamış veya başka bir evrene ışınlanmış olabilir... 👾</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
            className="mb-8 relative"
          >
            <div className="text-2xl text-purple-200 mb-4">
              Bir yazılımcının en sevdiği sayı:
            </div>
            <motion.div
              initial={{ rotate: 0, scale: 0.8 }}
              animate={{ 
                rotate: 360,
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                rotate: { delay: 1.5, duration: 1 },
                scale: { delay: 1.5, duration: 4, repeat: Infinity }
              }}
              className="text-9xl font-bold text-purple-400 mb-4 relative select-none"
              style={{ textShadow: `3px 3px 0 ${glitchColor}` }}
            >
              <span className="relative z-10">42</span>
              <div className="absolute inset-0 text-9xl font-bold text-purple-400 blur-xl opacity-50">42</div>
            </motion.div>
            
            {showAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg text-purple-300"
              >
                Ama bu sayfayı debug etmek için yeterli değil gibi... 🤔
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            whileHover={{ scale: 1.05 }}
            className="relative inline-block"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <Link 
              href="/"
              className="relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-full transition-all group overflow-hidden"
            >
              <span className="relative z-10">Güvenli Moda Dön</span>
              <motion.svg 
                className="w-5 h-5 relative z-10"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M14 5l7 7m0 0l-7 7m7-7H3" 
                />
              </motion.svg>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 