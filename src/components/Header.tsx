'use client'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FiHome, FiBookOpen, FiUser } from 'react-icons/fi'
import { VscSignOut } from 'react-icons/vsc'
import { CgProfile } from 'react-icons/cg'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { useUser } from '@/hooks/useUser'
import { supabase } from '@/lib/supabase'

export default function Header() {
  const router = useRouter()
  const { user, loading } = useUser()
  const [profile, setProfile] = useState<{ full_name: string; avatar_url: string; custom_avatar_url: string } | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return
      const { data } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, custom_avatar_url')
        .eq('id', user.id)
        .single()
      setProfile(data)
    }

    fetchProfile()
  }, [user])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/giris')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-purple-500/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-purple-400">
          Nepoex
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <Link 
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors"
          >
            <FiHome className="w-4 h-4" />
            <span>Ana Sayfa</span>
          </Link>
          <Link 
            href="/blog"
            className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors"
          >
            <FiBookOpen className="w-4 h-4" />
            <span>Blog</span>
          </Link>
          <Link 
            href="/hakkimda"
            className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors"
          >
            <FiUser className="w-4 h-4" />
            <span>Hakkımda</span>
          </Link>

          {/* Profil Dropdown */}
          {!loading && (
            user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 rounded-full hover:bg-purple-500/20 transition-colors"
                >
                  <img 
                    src={profile?.custom_avatar_url || profile?.avatar_url} 
                    alt={profile?.full_name || 'Profil'}
                    className="w-6 h-6 rounded-full ring-2 ring-purple-500/20"
                  />
                  <span>{profile?.full_name || 'Profil'}</span>
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-[#1a1a2e] border border-purple-500/20 rounded-xl overflow-hidden shadow-xl"
                    >
                      <Link
                        href="/profil"
                        className="flex items-center gap-2 px-4 py-3 text-gray-300 hover:bg-purple-500/20 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <CgProfile className="w-5 h-5" />
                        <span>Profilim</span>
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-4 py-3 text-gray-300 hover:bg-purple-500/20 transition-colors"
                      >
                        <VscSignOut className="w-5 h-5" />
                        <span>Çıkış Yap</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => supabase.auth.signInWithOAuth({
                  provider: 'github',
                  options: {
                    redirectTo: `${window.location.origin}/auth/callback`
                  }
                })}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 rounded-full hover:bg-purple-500/20 transition-colors"
              >
                <CgProfile className="w-5 h-5" />
                <span>Giriş Yap</span>
              </button>
            )
          )}
        </nav>
      </div>
    </header>
  )
} 