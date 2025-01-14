'use client'
import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

interface UserProfile {
  username: string
  full_name: string
  avatar_url: string
  role: string | null
  bio: string | null
  github_url: string | null
  twitter_url: string | null
  linkedin_url: string | null
  website_url: string | null
  location: string | null
  custom_avatar_url: string | null
  created_at: string | null
  updated_at: string | null
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const syncUserProfile = async (userId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return

      // Metadata ve user bilgilerini al
      const metadata = session.user.user_metadata
      const provider = session.user.app_metadata.provider
      const currentTime = new Date().toISOString()

      // Provider'a göre profil verilerini hazırla
      let profileData = {
        id: userId,
        username: '',
        avatar_url: '',
        full_name: '',
        bio: '🧙‍♂️ Henüz büyü kitabımı yazmadım...',
        github_url: null,
        location: null,
        website_url: null,
        twitter_url: null,
        linkedin_url: null,
        custom_avatar_url: null,
        created_at: currentTime,
        updated_at: currentTime,
        role: 'user'
      }

      if (provider === 'github') {
        profileData = {
          ...profileData,
          username: metadata.user_name || metadata.login || metadata.preferred_username,
          avatar_url: metadata.avatar_url,
          full_name: metadata.name || metadata.full_name,
          bio: metadata.description || metadata.bio || profileData.bio,
          github_url: metadata.html_url || `https://github.com/${metadata.user_name || metadata.login}`,
          location: metadata.location,
          website_url: metadata.blog || metadata.website || metadata.html_url,
          twitter_url: metadata.twitter_username ? `https://twitter.com/${metadata.twitter_username}` : null
        }
      } else if (provider === 'google') {
        profileData = {
          ...profileData,
          username: metadata.name?.replace(/\s+/g, '').toLowerCase() || metadata.email?.split('@')[0],
          avatar_url: metadata.picture || metadata.avatar_url,
          full_name: metadata.name || metadata.full_name,
          bio: profileData.bio,
          website_url: metadata.email ? `mailto:${metadata.email}` : null,
          location: null
        }
      }

      // Debug için metadata'yı logla
      console.log('Provider:', provider)
      console.log('Raw Metadata:', metadata)
      console.log('Processed Profile:', profileData)

      // Profil var mı kontrol et
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single()

      if (!existingProfile) {
        // Yeni profil oluştur
        await supabase.from('profiles').insert(profileData)
      } else {
        // Mevcut profili güncelle - created_at ve role hariç tüm alanları güncelle
        const { created_at, role, ...updateData } = profileData
        await supabase.from('profiles').update(updateData).eq('id', userId)
      }
    } catch (error) {
      console.error('Error syncing user profile:', error)
    }
  }

  useEffect(() => {
    // Mevcut oturumu kontrol et
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        syncUserProfile(session.user.id)
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Oturum değişikliklerini dinle
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await syncUserProfile(session.user.id)
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name, avatar_url, role, bio, github_url, twitter_url, linkedin_url, website_url, location, custom_avatar_url, created_at, updated_at')
        .eq('id', userId)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        scopes: 'read:user user:email'
      }
    })
    if (error) console.error('Error signing in:', error)
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Error signing out:', error)
  }

  const isAdmin = useMemo(() => {
    return profile?.role === 'admin'
  }, [profile])

  return {
    user,
    profile,
    loading,
    signIn,
    signOut,
    isAdmin
  }
} 