'use client'
import Link from 'next/link'
import { FiGithub, FiYoutube, FiTwitter } from 'react-icons/fi'

export default function Footer() {
  return (
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
  )
} 