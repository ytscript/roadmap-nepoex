'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.getSession()
      if (error) console.error('Error:', error.message)
      
      // Kullanıcıyı ana sayfaya yönlendir
      router.push('/')
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Giriş yapılıyor...</p>
      </div>
    </div>
  )
} 