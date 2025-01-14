'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/useUser'
import LoginButton from '@/components/LoginButton'

export default function LoginPage() {
  const router = useRouter()
  const { user } = useUser()

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Arkaplan deseni */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-blue-500/20 dark:from-purple-900/20 dark:via-transparent dark:to-blue-900/20" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      
      {/* Kart */}
      <div className="max-w-md w-full space-y-8 p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-lg relative">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Hoş Geldiniz! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Yolculuğunuza başlamak için giriş yapın
          </p>
        </div>

        <div className="space-y-6">
          <LoginButton />

          <div className="text-sm text-center text-gray-500 dark:text-gray-400">
            <p>Giriş yaparak:</p>
            <ul className="mt-2 space-y-1">
              <li>✨ İlerlemenizi kaydedebilir</li>
              <li>🎯 Hedeflerinizi belirleyebilir</li>
              <li>🚀 Yol haritanızı özelleştirebilirsiniz</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
} 