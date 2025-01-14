'use client'
import { motion } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'
import { useEffect, useState } from 'react'

export default function RetroHero() {
  const { isDark } = useTheme()
  const [positions, setPositions] = useState<Array<{left: number, top: number}>>([])
  
  useEffect(() => {
    // Pozisyonları client-side'da oluştur
    setPositions(Array(20).fill(0).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100
    })))
  }, [])
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Retro Grid Lines */}
      <div className="absolute inset-0 flex justify-center perspective">
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{
            duration: 1.5,
            ease: "easeOut"
          }}
          className="w-full h-[200vh] origin-top"
          style={{
            background: `linear-gradient(180deg, 
              ${isDark ? 'rgba(123, 31, 162, 0.1)' : 'rgba(147, 51, 234, 0.05)'} 0%, 
              ${isDark ? 'rgba(123, 31, 162, 0)' : 'rgba(147, 51, 234, 0)'} 100%)`,
            backgroundSize: '100% 8px',
            transform: 'rotateX(60deg)',
          }}
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0">
        {positions.map((pos, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.2, 1],
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className={`absolute w-2 h-2 rounded-full ${
              isDark ? 'bg-purple-500' : 'bg-purple-300'
            }`}
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
            }}
          />
        ))}
      </div>
    </div>
  )
} 