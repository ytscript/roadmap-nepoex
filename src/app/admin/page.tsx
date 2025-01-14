'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/hooks/useUser'
import { useRouter } from 'next/navigation'
import { VscPerson, VscRocket, VscGraph, VscBook, VscSignOut } from 'react-icons/vsc'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import UserManagement from './components/UserManagement'
import RoadmapManagement from './components/RoadmapManagement'

// Admin sayfası bileşenleri
const Sidebar = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    { id: 'users', icon: <VscPerson />, title: 'Kullanıcılar' },
    { id: 'roadmaps', icon: <VscRocket />, title: 'Yol Haritaları' },
    { id: 'topics', icon: <VscBook />, title: 'Konular' },
    { id: 'stats', icon: <VscGraph />, title: 'İstatistikler' }
  ]

  return (
    <div className="w-64 bg-[#1a1a2e] border-r border-purple-500/20 p-4">
      <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
        Admin Panel
      </h2>
      <nav className="space-y-2">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              activeSection === item.id 
                ? 'bg-purple-500/20 text-purple-400' 
                : 'hover:bg-white/5 text-gray-400'
            }`}
          >
            {item.icon}
            <span>{item.title}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

export default function AdminPage() {
  const { user, isAdmin, loading } = useUser()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('users')

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      toast.error('Bu sayfaya erişim yetkiniz yok')
      router.push('/')
      return
    }
  }, [user, isAdmin, loading])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-[#1a1a2e] text-white" style={{ paddingTop: "4rem" }}>
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h1 className="text-3xl font-bold mb-8">
              {activeSection === 'users' && 'Kullanıcı Yönetimi'}
              {activeSection === 'roadmaps' && 'Yol Haritası Yönetimi'}
              {activeSection === 'topics' && 'Konu Yönetimi'}
              {activeSection === 'stats' && 'İstatistikler'}
            </h1>

            {activeSection === 'users' && <UserManagement />}
            {activeSection === 'roadmaps' && <RoadmapManagement />}
            {activeSection === 'topics' && <div>Konu yönetimi gelecek</div>}
            {activeSection === 'stats' && <div>İstatistikler gelecek</div>}
          </motion.div>
        </div>
      </main>
    </div>
  )
} 