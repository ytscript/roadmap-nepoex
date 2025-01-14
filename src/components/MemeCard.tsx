'use client'
import { motion } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'

interface MemeCardProps {
  title: string
  description: string
  image: string
  tags: string[]
}

export default function MemeCard({ title, description, image, tags }: MemeCardProps) {
  const { isDark } = useTheme()

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`rounded-xl overflow-hidden ${
        isDark ? 'bg-white/5' : 'bg-white'
      } shadow-lg hover:shadow-xl transition-all`}
    >
      <div className="aspect-square relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
          {description}
        </p>
        <div className="mt-4 flex gap-2">
          {tags.map(tag => (
            <span
              key={tag}
              className={`px-2 py-1 rounded-full text-sm ${
                isDark 
                  ? 'bg-purple-500/20 text-purple-300' 
                  : 'bg-purple-100 text-purple-600'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
} 