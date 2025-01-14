'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function PixelCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const posRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>()

  useEffect(() => {
    const follow = () => {
      if (!cursorRef.current) return

      posRef.current.x += (mouseRef.current.x - posRef.current.x) * 0.15
      posRef.current.y += (mouseRef.current.y - posRef.current.y) * 0.15

      const distX = Math.abs(mouseRef.current.x - posRef.current.x)
      const distY = Math.abs(mouseRef.current.y - posRef.current.y)

      cursorRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`

      if (distX + distY > 2) {
        cursorRef.current.classList.add('is-moving')
      } else {
        cursorRef.current.classList.remove('is-moving')
      }

      rafRef.current = requestAnimationFrame(follow)
    }

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }

    window.addEventListener('mousemove', handleMouse)
    follow()

    return () => {
      window.removeEventListener('mousemove', handleMouse)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-50 will-change-transform"
      style={{ transform: 'translate3d(0, 0, 0)' }}
    >
      <div className="relative w-8 h-8">
        {/* Ana Asa Resmi */}
        <Image
          src="/images/wand-cursor.png"
          alt="Magic Wand"
          width={32}
          height={32}
          className="w-8 h-8"
        />

        {/* Hareket Efekti - Yıldızlar */}
        <div className="group-[.is-moving]:block hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-0 top-0"
              initial={{ 
                x: 0, 
                y: 0, 
                scale: 0.5,
                opacity: 0.8 
              }}
              animate={{ 
                x: -(i * 10), 
                y: Math.sin(i) * 10,
                scale: 0,
                opacity: 0 
              }}
              transition={{ 
                duration: 0.5,
                delay: i * 0.1,
                repeat: Infinity 
              }}
            >
              <div className="w-1 h-1 bg-yellow-200 rounded-full" />
            </motion.div>
          ))}
        </div>

        {/* Parıltı Efekti */}
        <motion.div
          className="absolute left-0 top-0"
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1.2, opacity: 0 }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <div className="w-4 h-4 bg-yellow-300/30 rounded-full blur-sm" />
        </motion.div>
      </div>
    </div>
  )
} 