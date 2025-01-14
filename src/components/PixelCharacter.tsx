'use client'
import { motion } from 'framer-motion'

interface PixelCharacterProps {
  animation: 'loading' | 'idle' | 'jumping'
}

export default function PixelCharacter({ animation }: PixelCharacterProps) {
  return (
    <motion.div
      animate={animation === 'loading' ? {
        y: [0, -10, 0],
        rotate: [0, 360, 0]
      } : animation === 'jumping' ? {
        y: [0, -20, 0]
      } : {}}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="relative w-16 h-16"
    >
      <div className="w-full h-full bg-purple-500 rounded-lg">
        {/* Basit bir pixel karakter - daha sonra daha detaylı bir sprite ekleyebiliriz */}
        <div className="absolute inset-2 bg-white rounded-md" />
        <div className="absolute inset-4 bg-purple-300 rounded-sm" />
      </div>
    </motion.div>
  )
} 