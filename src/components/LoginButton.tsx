'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FiGithub } from 'react-icons/fi'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/hooks/useUser'

export default function LoginButton() {
  const router = useRouter()
  const { user } = useUser()

  // GitHub ile giriş yap
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'read:user user:email' // GitHub profil bilgilerini okuma izni
      }
    })
  }

  // Çıkış yap
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  // GitHub profil bilgilerini kaydet
  const syncGitHubProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return

      // GitHub metadata'dan bilgileri al
      const metadata = session.user.user_metadata
      
      // Profil var mı kontrol et
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .single()

      if (!existingProfile) {
        // Yeni profil oluştur
        await supabase.from('profiles').insert({
          id: session.user.id,
          username: metadata.login || metadata.user_name,
          avatar_url: metadata.avatar_url,
          full_name: metadata.full_name || metadata.name,
          bio: metadata.bio || '🧙‍♂️ Henüz büyü kitabımı yazmadım...',
          github_url: metadata.html_url,
          location: metadata.location,
          website_url: metadata.blog || metadata.website,
        })
      } else {
        // Mevcut profili güncelle
        await supabase.from('profiles').update({
          username: metadata.login || metadata.user_name,
          avatar_url: metadata.avatar_url,
          full_name: metadata.full_name || metadata.name,
          github_url: metadata.html_url,
          location: metadata.location,
          website_url: metadata.blog || metadata.website,
        }).eq('id', session.user.id)
      }
    } catch (error) {
      console.error('Error syncing GitHub profile:', error)
    }
  }

  // Giriş yapıldığında profili senkronize et
  useEffect(() => {
    if (user) {
      syncGitHubProfile()
    }
  }, [user])

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
    <button
      onClick={handleLogin}
      className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 rounded-full hover:bg-purple-500/20 transition-colors"
    >
      <FiGithub className="w-4 h-4" />
      <span>GitHub ile Giriş Yap</span>
    </button>
  )
} 