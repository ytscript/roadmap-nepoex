'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiSave } from 'react-icons/fi'
import { useUser } from '@/hooks/useUser'
import { supabase } from '@/lib/supabase'

interface Profile {
  username: string
  avatar_url: string
  full_name: string
  bio: string
  github_url: string
  website_url: string
  location: string
  twitter_url: string
  linkedin_url: string
  custom_avatar_url: string
}

export default function EditProfilePage() {
  const router = useRouter()
  const { user, loading: userLoading } = useUser()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (userLoading) return // Kullanıcı yüklenene kadar bekle
    
    if (!user && !userLoading) {
      router.push('/giris')
      return
    }

    const fetchProfile = async () => {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        setProfile(data)
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchProfile()
    }
  }, [user, userLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !profile) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          bio: profile.bio,
          website_url: profile.website_url,
          location: profile.location,
          twitter_url: profile.twitter_url,
          linkedin_url: profile.linkedin_url,
          custom_avatar_url: profile.custom_avatar_url || profile.avatar_url
        })
        .eq('id', user.id)

      if (error) throw error

      router.push('/profil')
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading || userLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] text-white pt-24">
        <div className="max-w-2xl mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-white/10 rounded w-1/4" />
            <div className="space-y-4">
              <div className="h-12 bg-white/10 rounded" />
              <div className="h-12 bg-white/10 rounded" />
              <div className="h-24 bg-white/10 rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) return null

  return (
    <main className="min-h-screen bg-[#1a1a2e] text-white pt-24">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl p-8 backdrop-blur-sm border border-purple-500/20"
        >
          <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Büyü Kitabını Düzenle
          </h1>
          <p className="text-gray-400 mb-8">Kendini diğer büyücülere nasıl tanıtmak istediğini seç</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Ad Soyad */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Büyücü İsmi
              </label>
              <input
                type="text"
                value={profile.full_name}
                onChange={e => setProfile({ ...profile, full_name: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-purple-500/20 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                placeholder="Gandalf the Grey"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Büyücü Manifestosu
              </label>
              <textarea
                value={profile.bio}
                onChange={e => setProfile({ ...profile, bio: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 bg-white/5 border border-purple-500/20 rounded-lg focus:outline-none focus:border-purple-500 text-white resize-none"
                placeholder="Kodun karanlık sanatlarında uzmanlaşmış bir büyücüyüm..."
              />
            </div>

            {/* Avatar URL */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Özel Profil Resmi URL'i
              </label>
              <input
                type="url"
                value={profile.custom_avatar_url || ''}
                onChange={e => setProfile({ ...profile, custom_avatar_url: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-purple-500/20 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                placeholder="https://example.com/your-avatar.jpg"
              />
              <p className="mt-1 text-sm text-gray-400">Boş bırakırsanız GitHub profil resminiz kullanılacaktır</p>
            </div>

            {/* Twitter */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Twitter Profili
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">twitter.com/</span>
                <input
                  type="text"
                  value={(profile.twitter_url || '').replace('https://twitter.com/', '')}
                  onChange={e => setProfile({ ...profile, twitter_url: `https://twitter.com/${e.target.value}` })}
                  className="w-full pl-28 pr-4 py-2 bg-white/5 border border-purple-500/20 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                  placeholder="username"
                />
              </div>
            </div>

            {/* LinkedIn */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                LinkedIn Profili
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">linkedin.com/in/</span>
                <input
                  type="text"
                  value={(profile.linkedin_url || '').replace('https://linkedin.com/in/', '')}
                  onChange={e => setProfile({ ...profile, linkedin_url: `https://linkedin.com/in/${e.target.value}` })}
                  className="w-full pl-32 pr-4 py-2 bg-white/5 border border-purple-500/20 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                  placeholder="username"
                />
              </div>
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Büyü Portalı
              </label>
              <input
                type="url"
                value={profile.website_url || ''}
                onChange={e => setProfile({ ...profile, website_url: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-purple-500/20 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                placeholder="https://your-magical-realm.com"
              />
            </div>

            {/* Konum */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Büyü Kulesi
              </label>
              <input
                type="text"
                value={profile.location || ''}
                onChange={e => setProfile({ ...profile, location: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-purple-500/20 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                placeholder="Isengard"
              />
            </div>

            {/* Butonlar */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.push('/profil')}
                className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Büyüyü İptal Et
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform-gpu hover:scale-105"
              >
                <FiSave className="w-4 h-4" />
                {saving ? 'Büyü Yapılıyor...' : 'Büyüyü Tamamla'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  )
} 