'use client'

import { useRouter } from 'next/navigation'
import { FiGithub } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/hooks/useUser'

export default function LoginButton() {
  const router = useRouter()
  const { user } = useUser()

  // GitHub ile giriş yap
  const handleGitHubLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'read:user user:email read:org user:follow'
      }
    })
  }

  // Google ile giriş yap
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    })
  }

  // Çıkış yap
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  if (user) {
    return (
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500/10 text-red-400 rounded-full hover:bg-red-500/20 transition-colors"
      >
        Çıkış Yap
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <button
        onClick={handleGitHubLogin}
        className="flex items-center justify-center gap-2 px-4 py-2.5 w-full bg-purple-500/10 text-purple-400 rounded-xl hover:bg-purple-500/20 transition-colors"
      >
        <FiGithub className="w-5 h-5" />
        <span>GitHub ile Giriş Yap</span>
      </button>

      <button
        onClick={handleGoogleLogin}
        className="flex items-center justify-center gap-2 px-4 py-2.5 w-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-300 dark:border-gray-600"
      >
        <FcGoogle className="w-5 h-5" />
        <span>Google ile Giriş Yap</span>
      </button>
    </div>
  )
} 