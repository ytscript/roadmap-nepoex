'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { VscTerminalCmd, VscCode, VscGithub, VscBook, VscSymbolVariable, VscGraph, VscGitPullRequest, VscIssues, VscLocation, VscTwitter, VscVmActive } from 'react-icons/vsc'
import { FaLinkedin, FaMapPin  } from "react-icons/fa";
import { CgTerminal } from 'react-icons/cg'
import { BiCodeBlock } from 'react-icons/bi'
import { TbBrandGit } from 'react-icons/tb'
import { useUser } from '@/hooks/useUser'
import { supabase } from '@/lib/supabase'
import GitHubRepos from '@/components/GitHubRepos'
import RoadmapSection from '@/components/RoadmapSection'
import { Dialog } from '@headlessui/react'
import Link from 'next/link'

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
  xp: number
}

interface BlogPost {
  id: string
  title: string
  slug: string
  image_url: string
  published_at: string
}

interface BlogPostResponse {
  blog_posts: BlogPost
}

const navigationItems = [
  { id: 'dashboard', icon: <CgTerminal className="w-6 h-6" />, label: 'Terminal' },
  { id: 'roadmap', icon: <VscCode className="w-6 h-6" />, label: 'Roadmap' },
  { id: 'todo', icon: <VscIssues className="w-6 h-6" />, label: 'Yapılacaklar' },
  { id: 'favorites', icon: <BiCodeBlock className="w-6 h-6" />, label: 'Favoriler' },
  { id: 'reading', icon: <VscBook className="w-6 h-6" />, label: 'Okuma Listesi' },
  { id: 'repos', icon: <VscGithub className="w-6 h-6" />, label: 'GitHub' }
]

type ActiveSection = 'dashboard' | 'roadmap' | 'favorites' | 'reading' | 'stats' | 'repos' | 'edit' | 'todo'

const codingTips = [
  "Evrenin ve tüm hataların cevabı: 42",
  "Havlunuzu yanınızda bulundurun, debug zor olabilir!",
  "Sonsuz döngüye girdiğinizde panik yapmayın",
  "Stack Overflow bile bazen yanıt veremeyebilir",
  "Legacy kod okumak Vogon şiirinden daha kolay",
  "Git push --force kullanmak, Galaktik Otostop Rehberi'ni silmek kadar tehlikelidir",
  "Her yazılımcı kendi kodunun Douglas Adams'ıdır",
  "Derin Düşünce bile bazen Stack Overflow'a bakar",
  "Babel'in çeviremediği kod, yazılmamalıydı",
  "Sonsuz Olasılık Sürücüsü çalışırken kahvenizi soğutmayı unutmayın"
]

const achievementLevels = [
  { title: 'Çaylak Galaktik Gezgin', xp: 0 },
  { title: 'Havlusu Hazır Programcı', xp: 1000 },
  { title: 'Babel Balığı Tercümanı', xp: 2000 },
  { title: 'Sonsuz Olasılık Debugger\'ı', xp: 3000 },
  { title: 'Galaktik Kod Gezgini', xp: 4000 },
  { title: 'Derin Düşünce Programcısı', xp: 5000 },
  { title: 'Altın Kalp Yazılımcısı', xp: 6000 }
]

// Arkaplan komponenti
const Background = () => {
  return (
    <div className="fixed inset-0 z-0">
      <svg className="background__lights" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 1920 1080" xmlSpace="preserve" preserveAspectRatio="none">
        <g className="lines">
          <rect className="line" x="1253.6" width="4.5" height="1080"/>
          <rect className="line" x="873.3" width="1.8" height="1080"/>
          <rect className="line" x="1100" width="1.8" height="1080"/>
          <rect className="line" x="1547.1" width="4.5" height="1080"/>
          <rect className="line" x="615" width="4.5" height="1080"/>
          <rect className="line" x="684.6" width="1.8" height="1080"/>
          <rect className="line" x="1369.4" width="1.8" height="1080"/>
          <rect className="line" x="1310.2" width="0.9" height="1080"/>
          <rect className="line" x="1233.4" width="0.9" height="1080"/>
          <rect className="line" x="124.2" width="0.9" height="1080"/>
          <rect className="line" x="1818.4" width="4.5" height="1080"/>
          <rect className="line" x="70.3" width="4.5" height="1080"/>
          <rect className="line" x="1618.6" width="1.8" height="1080"/>
          <rect className="line" x="455.9" width="1.8" height="1080"/>
          <rect className="line" x="328.7" width="1.8" height="1080"/>
          <rect className="line" x="300.8" width="4.6" height="1080"/>
          <rect className="line" x="1666.4" width="0.9" height="1080"/>
        </g>
        <g className="lights">
          <path className="light1 light" d="M619.5,298.4H615v19.5h4.5V298.4z M619.5,674.8H615v9.8h4.5V674.8z M619.5,135.1H615v5.6h4.5V135.1z M619.5,55.5H615v68.7h4.5V55.5z"/>
          <path className="light2 light" d="M1258.2,531.9h-4.5v8.1h4.5V531.9z M1258.2,497.9h-4.5v17.9h4.5V497.9z M1258.2,0h-4.5v25.3h4.5V0z M1258.2,252.2h-4.5v42.4h4.5V252.2z"/>
          <path className="light3 light" d="M875.1,123.8h-1.8v4h1.8V123.8z M875.1,289.4h-1.8v24.1h1.8V289.4z M875.1,0h-1.8v31.4h1.8V0z M875.1,50.2h-1.8v11.5h1.8V50.2z"/>
          <path className="light4 light" d="M1101.8,983.8h-1.8v8.2h1.8V983.8z M1101.8,1075.9h-1.8v4.1h1.8V1075.9z M1101.8,873.7h-1.8v4.2h1.8V873.7z M1101.8,851h-1.8v18.2h1.8V851z"/>
          <path className="light5 light" d="M686.4,822.7h-1.8v3.8h1.8V822.7z M686.4,928.4h-1.8v23h1.8V928.4z M686.4,1043.8h-1.8v36.2h1.8V1043.8z"/>
          <path className="light6 light" d="M1551.6,860.9h-4.4v-34.1h4.4V860.9z M1551.6,533.5h-4.4v-13.9h4.4V533.5z M1551.6,1080h-4.4v-89.1h4.4V1080z"/>
          <path className="light7 light" d="M1311.1,707.7h-0.9V698h0.9V707.7z M1311.1,436.8h-0.9v-58.9h0.9V436.8z M1311.1,140.7h-0.9V48h0.9V140.7z"/>
          <path className="light8 light" d="M125.1,514.5h-0.9v-9.7h0.9V514.5z M125.1,243.6h-0.9v-58.9h0.9V243.6z"/>
          <path className="light9 light" d="M305.4,806.7h-4.6v-42.5h4.6V806.7z M305.4,398.5h-4.6v-17.3h4.6V398.5z M305.4,1080h-4.6V968.8h4.6V1080z"/>
          <path className="light10 light" d="M1822.9,170.7h-4.5v13.7h4.5V170.7z M1822.9,435.1h-4.5v6.8h4.5V435.1z M1822.9,55.9h-4.5v4h4.5V55.9z M1822.9,0h-4.5v48.3h4.5V0z"/>
          <path className="light11 light" d="M1666.4,331.5h0.9v9.7h-0.9V331.5z M1666.4,602.4h0.9v58.9h-0.9V602.4z M1666.4,898.5h0.9v92.7h-0.9V898.5z"/>
          <path className="light12 light" d="M1620.4,200.7h-1.8v6.4h1.8V200.7z M1620.4,469.1h-1.8v39h1.8V469.1z M1620.4,0h-1.8v51h1.8V0z M1620.4,81.3h-1.8V100h1.8V81.3z"/>
          <path className="light13 light" d="M74.8,201h-4.5v16.2h4.5V201z M74.8,512.3h-4.5v8.1h4.5V512.3z M74.8,65.8h-4.5v4.6h4.5V65.8z M74.8,0h-4.5v56.8h4.5V0z"/>
          <path className="light14 light" d="M1371.2,655.3h-1.8v6.3h1.8V655.3z M1371.2,829.7h-1.8v37.9h1.8V829.7z M1371.2,1020.3h-1.8v59.7h1.8V1020.3z"/>
          <path className="light15 light" d="M1234.3,898.1h-0.9v-4.9h0.9V898.1z M1234.3,762.5h-0.9v-29.5h0.9V762.5z M1234.3,614.4h-0.9v-46.4h0.9V614.4z"/>
          <path className="light16 light" d="M457.7,1010.8h-1.8v-18.1h1.8V1010.8z M457.7,507.5h-1.8V398h1.8V507.5z"/>
          <path className="light17 light" d="M330.5,170.7h-1.8v13.7h1.8V170.7z M330.5,435.1h-1.8v6.8h1.8V435.1z M330.5,55.9h-1.8v4h1.8V55.9z M330.5,0h-1.8v48.3h1.8V0z"/>
        </g>
      </svg>
    </div>
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading: userLoading } = useUser()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [favorites, setFavorites] = useState<BlogPost[]>([])
  const [readingList, setReadingList] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard')
  const [showTip, setShowTip] = useState(false)
  const [randomTip, setRandomTip] = useState('')
  const [showTipDialog, setShowTipDialog] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    location: '',
    github_url: '',
    twitter_url: '',
    linkedin_url: '',
    website_url: ''
  })

  // Form değişikliklerini takip et
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Profil güncelleme
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !profile) return

    setError(null)
    setSuccess(null)
    setSaving(true)

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          bio: formData.bio,
          website_url: formData.website_url,
          location: formData.location,
          twitter_url: formData.twitter_url,
          linkedin_url: formData.linkedin_url,
          github_url: formData.github_url
        })
        .eq('id', user.id)
        .select()

      if (error) {
        setError('Profil güncellenirken bir hata oluştu: ' + error.message)
        return
      }

      setSuccess('Profil başarıyla güncellendi!')
      
      // Profili güncelle ve 2 saniye sonra dashboard'a dön
      setProfile(prev => ({ ...prev!, ...formData }))
      setTimeout(() => {
        setActiveSection('dashboard')
        setSuccess(null)
      }, 2000)
    } catch (error) {
      setError('Profil güncellenirken bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setSaving(false)
    }
  }

  // Profil verilerini form state'ine yükle
  useEffect(() => {
    if (profile && !formData.full_name) {  // Sadece form boşsa yükle
      setFormData({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        github_url: profile.github_url || '',
        twitter_url: profile.twitter_url || '',
        linkedin_url: profile.linkedin_url || '',
        website_url: profile.website_url || ''
      })
    }
  }, [profile])

  useEffect(() => {
    if (userLoading) return
    
    if (!user && !userLoading) {
      router.push('/giris')
      return
    }

    const fetchProfile = async () => {
      try {
        if (!user?.id) return

        // Profil bilgilerini getir
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        setProfile(profileData)

        // Favorileri getir
        const { data: favoritesData } = await supabase
          .from('favorites')
          .select('blog_posts(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        const typedFavoritesData = favoritesData as unknown as BlogPostResponse[]
        setFavorites(typedFavoritesData?.map(f => f.blog_posts) || [])

        // Okuma listesini getir
        const { data: readingListData } = await supabase
          .from('reading_list')
          .select('blog_posts(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        const typedReadingListData = readingListData as unknown as BlogPostResponse[]
        setReadingList(typedReadingListData?.map(r => r.blog_posts) || [])
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

  const handleDontPanic = () => {
    const tip = codingTips[Math.floor(Math.random() * codingTips.length)]
    setRandomTip(tip)
    setShowTipDialog(true)
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'edit':
        return (
          <div>
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-3">
              <TbBrandGit className="w-8 h-8" /> Profili Düzenle
            </h2>
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl p-6 backdrop-blur-sm border border-purple-500/20">
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400">
                      {success}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Tam Ad</label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-purple-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/40"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Biyografi</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full bg-white/5 border border-purple-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/40"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Konum</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-purple-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/40"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">GitHub URL</label>
                    <div className="flex">
                      <span className="bg-white/5 border-y border-l border-purple-500/20 rounded-l-lg px-4 py-2 text-gray-400">
                        https://github.com/
                      </span>
                      <input
                        type="text"
                        name="github_url"
                        value={formData.github_url.replace('https://github.com/', '')}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          github_url: `https://github.com/${e.target.value}`
                        }))}
                        className="flex-1 bg-white/5 border border-purple-500/20 rounded-r-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/40"
                        placeholder="kullanıcı-adı"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Twitter URL</label>
                    <div className="flex">
                      <span className="bg-white/5 border-y border-l border-purple-500/20 rounded-l-lg px-4 py-2 text-gray-400">
                        https://twitter.com/
                      </span>
                      <input
                        type="text"
                        name="twitter_url"
                        value={formData.twitter_url.replace('https://twitter.com/', '')}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          twitter_url: `https://twitter.com/${e.target.value}`
                        }))}
                        className="flex-1 bg-white/5 border border-purple-500/20 rounded-r-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/40"
                        placeholder="kullanıcı-adı"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">LinkedIn URL</label>
                    <div className="flex">
                      <span className="bg-white/5 border-y border-l border-purple-500/20 rounded-l-lg px-4 py-2 text-gray-400">
                        https://linkedin.com/in/
                      </span>
                      <input
                        type="text"
                        name="linkedin_url"
                        value={formData.linkedin_url.replace('https://linkedin.com/in/', '')}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          linkedin_url: `https://linkedin.com/in/${e.target.value}`
                        }))}
                        className="flex-1 bg-white/5 border border-purple-500/20 rounded-r-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/40"
                        placeholder="kullanıcı-adı"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Website URL</label>
                    <input
                      type="url"
                      name="website_url"
                      value={formData.website_url}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-purple-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/40"
                    />
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setActiveSection('dashboard')}
                      className="px-6 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg hover:from-purple-400 hover:to-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )
      case 'roadmap':
        return (
          <div>
            
            <RoadmapSection />
          </div>
        )
      case 'favorites':
        return (
          <div>
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-3">
              <span className="text-2xl">✨</span> Favori Büyüler
            </h2>
            <div className="grid gap-6">
              {favorites.map(post => (
                <motion.article
                  key={post.id}
                  whileHover={{ scale: 1.02 }}
                  className="group bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl overflow-hidden hover:border-purple-500/40 transition-colors cursor-pointer border border-purple-500/20"
                  onClick={() => router.push(`/blog/${post.slug}`)}
                >
                  <div className="flex items-center gap-4">
                    <img 
                      src={post.image_url} 
                      alt={post.title}
                      className="w-24 h-24 object-cover"
                    />
                    <div className="flex-1 p-4">
                      <h3 className="font-bold mb-2 group-hover:text-purple-400 transition-colors">{post.title}</h3>
                      <time className="text-sm text-gray-400">
                        {new Date(post.published_at).toLocaleDateString('tr-TR')}
                      </time>
                    </div>
                  </div>
                </motion.article>
              ))}
              {favorites.length === 0 && (
                <p className="text-gray-400">Henüz favori büyünüz yok. 🪄</p>
              )}
            </div>
          </div>
        )
      case 'reading':
        return (
          <div>
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-3">
              <span className="text-2xl">📚</span> Büyü Kitabı
            </h2>
            <div className="grid gap-6">
              {readingList.map(post => (
                <motion.article
                  key={post.id}
                  whileHover={{ scale: 1.02 }}
                  className="group bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl overflow-hidden hover:border-purple-500/40 transition-colors cursor-pointer border border-purple-500/20"
                  onClick={() => router.push(`/blog/${post.slug}`)}
                >
                  <div className="flex items-center gap-4">
                    <img 
                      src={post.image_url} 
                      alt={post.title}
                      className="w-24 h-24 object-cover"
                    />
                    <div className="flex-1 p-4">
                      <h3 className="font-bold mb-2 group-hover:text-purple-400 transition-colors">{post.title}</h3>
                      <time className="text-sm text-gray-400">
                        {new Date(post.published_at).toLocaleDateString('tr-TR')}
                      </time>
                    </div>
                  </div>
                </motion.article>
              ))}
              {readingList.length === 0 && (
                <p className="text-gray-400">Büyü kitabınız henüz boş. 📖✨</p>
              )}
            </div>
          </div>
        )
      case 'repos':
        return (
          <div>
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-3">
              <VscGithub className="w-8 h-8" /> GitHub Projeleri
            </h2>
            {profile?.github_url ? (
              <GitHubRepos github_url={profile.github_url} />
            ) : (
              <div className="text-center p-8 bg-purple-500/10 rounded-xl border border-purple-500/20">
                <p className="text-gray-400 mb-4">GitHub profilinizi henüz bağlamadınız.</p>
                <p className="text-sm text-gray-500">Profil düzenleme sayfasından GitHub profilinizi ekleyebilirsiniz.</p>
              </div>
            )}
          </div>
        )
      case 'stats':
        return (
          <div>
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-3">
              <span className="text-2xl">📊</span> İstatistikler
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl p-6 backdrop-blur-sm border border-purple-500/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-400">Toplam Satır</h3>
                  <VscCode className="w-6 h-6 text-purple-400" />
                </div>
                <p className="text-3xl font-bold">42,138</p>
                <div className="mt-2 text-sm text-gray-400">
                  Son 30 günde +2,847 satır
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl p-6 backdrop-blur-sm border border-purple-500/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-400">Commit Sayısı</h3>
                  <VscGithub className="w-6 h-6 text-blue-400" />
                </div>
                <p className="text-3xl font-bold">1,337</p>
                <div className="mt-2 text-sm text-gray-400">
                  Bu hafta 23 commit
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 backdrop-blur-sm border border-green-500/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-400">PR/MR Sayısı</h3>
                  <VscGitPullRequest className="w-6 h-6 text-green-400" />
                </div>
                <p className="text-3xl font-bold">256</p>
                <div className="mt-2 text-sm text-gray-400">
                  %98.4 kabul oranı
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-6 backdrop-blur-sm border border-orange-500/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-400">Çözülen Issue</h3>
                  <VscIssues className="w-6 h-6 text-orange-400" />
                </div>
                <p className="text-3xl font-bold">482</p>
                <div className="mt-2 text-sm text-gray-400">
                  Son issue: 2 saat önce
                </div>
              </motion.div>
            </div>
          </div>
        )
      case 'todo':
        return (
          <div>
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-3">
              <VscIssues className="w-8 h-8" /> Yapılacaklar
            </h2>
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl p-8 backdrop-blur-sm border border-purple-500/20">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-4">Proje Takip Sistemine Hoş Geldiniz! 🚀</h3>
                <p className="text-gray-400 mb-8">
                  Projelerinizi ve görevlerinizi yönetmek için gelişmiş proje takip sistemimizi kullanabilirsiniz.
                </p>
                <Link
                  href="/projetakip"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all"
                >
                  <VscIssues className="w-5 h-5" />
                  <span>Proje Takip Sistemine Git</span>
                </Link>
              </div>
            </div>
          </div>
        )
    }
  }

  const renderDashboard = () => {
    if (!profile) return null

    return (
      <div className="space-y-8">
        {/* Hoşgeldin Mesajı */}
        <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl p-8 backdrop-blur-sm border border-purple-500/20">
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                Hoş geldin, Galaktik Gezgin {profile?.full_name} 🚀
              </h2>
              <p className="text-gray-400">
                Bugün hangi kodları yazacağız? Unutma, büyük kod, büyük sorumluluk getirir! ✨
              </p>
            </div>
            <div className="text-right">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleDontPanic}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl hover:from-yellow-400 hover:to-orange-400 transition-all shadow-lg shadow-orange-500/20"
              >
                <span className="text-xl">🌌</span>
                <span>DON'T PANIC!</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl p-6 backdrop-blur-sm border border-purple-500/20"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400">Galaktik XP</h3>
              <VscSymbolVariable className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-3xl font-bold">42.42k</p>
            <div className="mt-2 text-sm text-gray-400">
              Derin Düşünce seviyesine yaklaşıyorsun
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl p-6 backdrop-blur-sm border border-purple-500/20"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400">Debug Sayısı</h3>
              <VscGraph className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-3xl font-bold">1337</p>
            <div className="mt-2 text-sm text-gray-400">
              Vogon şiirinden daha karmaşık 5 bug çözdün
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 backdrop-blur-sm border border-green-500/20"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400">Commit Sayısı</h3>
              <VscGithub className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-3xl font-bold">42k</p>
            <div className="mt-2 text-sm text-gray-400">
              Sonsuz Olasılık Sürücüsü gibi çalışıyorsun
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-6 backdrop-blur-sm border border-orange-500/20"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400">Babel Balığı Puanı</h3>
              <VscSymbolVariable className="w-6 h-6 text-orange-400" />
            </div>
            <p className="text-3xl font-bold">42</p>
            <div className="mt-2 text-sm text-gray-400">
              Legacy kodları anlayabiliyorsun!
            </div>
          </motion.div>
        </div>

        {/* Son Aktiviteler ve Hızlı Erişim */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Son Aktiviteler */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl p-6 backdrop-blur-sm border border-purple-500/20"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="text-2xl">⚡</span> Son Aktiviteler
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                <div className="text-2xl">
                  <VscTerminalCmd className="w-8 h-8 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Sonsuz Olasılık Motoru</h3>
                  <p className="text-sm text-gray-400">Recursive fonksiyonu optimize ettin!</p>
                </div>
                <time className="text-sm text-gray-400">2 saat önce</time>
              </div>
              <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                <div className="text-2xl">
                  <VscBook className="w-8 h-8 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Yeni Rozet: Legacy Kod Ustası</h3>
                  <p className="text-sm text-gray-400">Eski kodu başarıyla refactor ettin</p>
                </div>
                <time className="text-sm text-gray-400">5 saat önce</time>
              </div>
              <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                <div className="text-2xl">
                  <VscGraph className="w-8 h-8 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Galaktik Başarı</h3>
                  <p className="text-sm text-gray-400">42 gün boyunca sıfır production hatası!</p>
                </div>
                <time className="text-sm text-gray-400">1 gün önce</time>
              </div>
            </div>
          </motion.div>

          {/* Hızlı Erişim */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl p-6 backdrop-blur-sm border border-purple-500/20"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="text-2xl">🎯</span> Hızlı Erişim
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {navigationItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as ActiveSection)}
                  className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-xl hover:bg-purple-500/20 transition-colors group"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span className="text-sm text-gray-400 group-hover:text-purple-300">
                    {item.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (loading || userLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] text-white pt-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-32 bg-white/10 rounded-xl" />
            <div className="space-y-4">
              <div className="h-4 bg-white/10 rounded w-1/4" />
              <div className="h-4 bg-white/10 rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) return null

  return (
    <main className="min-h-screen bg-[#1a1a2e] text-white pt-24">
      <Background />
      <div className="max-w-[90rem] mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-[320px,1fr] gap-8">
          {/* Sol Taraf - Profil */}
          <div className="space-y-6 lg:sticky lg:top-24 h-[calc(100vh-8rem)]">
            {/* Profil Kartı */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl p-6 backdrop-blur-sm border border-purple-500/20"
            >
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative mb-4">
                  <img 
                    src={profile.custom_avatar_url || profile.avatar_url} 
                    alt={profile.full_name}
                    className="w-24 h-24 rounded-xl ring-2 ring-purple-500/20"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-purple-500/20 px-2 py-1 rounded-md text-xs backdrop-blur-sm">
                    {profile.xp >= 5000 ? 'Derin Düşünce Programcısı' : 'Galaktik Kod Gezgini'}
                  </div>
                </div>

                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-1">
                  {profile.full_name}
                </h1>
                <p className="text-gray-400 text-sm mb-3">@{profile.username}</p>
                <p className="text-gray-400 text-sm mb-4">{profile.bio}</p>

                <button
                  onClick={() => setActiveSection('edit')}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 rounded-full hover:bg-purple-500/20 transition-colors group mb-6"
                >
                  <TbBrandGit className="w-5 h-5" />
                  <span>Profili Düzenle</span>
                </button>

                {/* Sosyal Medya Linkleri */}
                <div className="flex flex-wrap justify-center gap-3">
                  {profile.location && (
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                      <FaMapPin  className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile.github_url && (
                    <a 
                      href={profile.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full hover:bg-purple-500/20 hover:text-purple-400 transition-colors"
                    >
                      <VscGithub className="w-4 h-4" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {profile.twitter_url && (
                    <a 
                      href={profile.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full hover:bg-blue-500/20 hover:text-blue-400 transition-colors"
                    >
                      <VscTwitter className="w-4 h-4" />
                      <span>Twitter</span>
                    </a>
                  )}
                  {profile.linkedin_url && (
                    <a 
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full hover:bg-blue-700/20 hover:text-blue-400 transition-colors"
                    >
                      <FaLinkedin  className="w-4 h-4" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {profile.website_url && (
                    <a 
                      href={profile.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full hover:bg-purple-500/20 hover:text-purple-400 transition-colors"
                    >
                      <VscVmActive className="w-4 h-4" />
                      <span>Website</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Navigasyon */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl backdrop-blur-sm border border-purple-500/20 overflow-hidden"
            >
              {navigationItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as ActiveSection)}
                  className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors ${
                    activeSection === item.id
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'hover:bg-white/5 text-gray-300'
                  }`}
                  whileHover={{ x: 5 }}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </motion.div>
          </div>

          {/* Sağ Taraf - Dinamik İçerik */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {activeSection === 'dashboard' ? renderDashboard() : renderActiveSection()}
          </motion.div>
        </div>
      </div>

      <Dialog
        open={showTipDialog}
        onClose={() => setShowTipDialog(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-[#1a1a2e] rounded-xl p-8 max-w-lg w-full border border-purple-500/20 shadow-xl">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="text-4xl">🚀</div>
              <Dialog.Title className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Galaktik Rehber Diyor Ki:
              </Dialog.Title>
              <Dialog.Description className="text-lg text-gray-300">
                {randomTip}
              </Dialog.Description>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowTipDialog(false)}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full font-medium hover:from-purple-400 hover:to-blue-400 transition-all"
              >
                Anladım!
              </motion.button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </main>
  )
} 