'use client'
import { useEffect } from 'react'
import { useTheme } from '@/context/ThemeContext'

interface AdUnitProps {
  className?: string
  slotId: string
}

export default function AdUnit({ className, slotId }: AdUnitProps) {
  const { isDark } = useTheme()

  useEffect(() => {
    // Google AdSense kodunu yükle
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (err) {
      console.error('AdSense yüklenirken hata:', err)
    }
  }, [])

  return (
    <div className={`ad-container relative group ${className}`}>
      {/* Reklam yüklenene kadar gösterilecek placeholder */}
      <div className={`absolute inset-0 flex items-center justify-center ${
        isDark ? 'bg-white/5' : 'bg-gray-50'
      }`}>
        <span className={`text-sm ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Reklam Yükleniyor...
        </span>
      </div>
      
      {/* AdSense reklam birimi */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-YOUR_CLIENT_ID"
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
} 