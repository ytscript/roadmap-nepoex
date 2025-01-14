'use client'

import { useState, useEffect } from 'react'
import { adminService } from '@/lib/supabase/admin'
import { toast } from 'sonner'
import { VscVerified, VscUnverified, VscGithub, VscTwitter, VscGlobe, VscLocation } from 'react-icons/vsc'
import { FaLinkedin } from 'react-icons/fa'

interface User {
  id: string
  username: string
  avatar_url: string
  full_name: string
  bio: string | null
  github_url: string | null
  twitter_url: string | null
  website_url: string | null
  location: string | null
  linkedin_url: string | null
  custom_avatar_url: string | null
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const data = await adminService.getAllUsers()
      setUsers(data)
    } catch (error) {
      toast.error('Kullanıcılar yüklenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      await adminService.updateUserRole(userId, newRole)
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ))
      toast.success('Kullanıcı rolü güncellendi')
    } catch (error) {
      toast.error('Rol güncellenirken bir hata oluştu')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="bg-[#1a1a2e]/50 rounded-xl border border-purple-500/20 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-purple-500/10">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Kullanıcı</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Sosyal</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Rol</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Kayıt Tarihi</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-500/10">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-purple-500/5">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={user.custom_avatar_url || user.avatar_url} 
                      alt={user.full_name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="text-gray-300 font-medium">{user.full_name}</div>
                      <div className="text-gray-500 text-sm">@{user.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {user.github_url && (
                      <a href={user.github_url} target="_blank" rel="noopener noreferrer"
                         className="text-gray-400 hover:text-purple-400 transition-colors">
                        <VscGithub size={18} />
                      </a>
                    )}
                    {user.twitter_url && (
                      <a href={user.twitter_url} target="_blank" rel="noopener noreferrer"
                         className="text-gray-400 hover:text-purple-400 transition-colors">
                        <VscTwitter size={18} />
                      </a>
                    )}
                    {user.website_url && (
                      <a href={user.website_url} target="_blank" rel="noopener noreferrer"
                         className="text-gray-400 hover:text-purple-400 transition-colors">
                        <VscGlobe size={18} />
                      </a>
                    )}
                    {user.linkedin_url && (
                      <a href={user.linkedin_url} target="_blank" rel="noopener noreferrer"
                         className="text-gray-400 hover:text-purple-400 transition-colors">
                        <FaLinkedin size={18} />
                      </a>
                    )}
                    {user.location && (
                      <span className="text-gray-400 flex items-center gap-1 text-sm">
                        <VscLocation size={16} />
                        {user.location}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs
                    ${user.role === 'admin' 
                      ? 'bg-purple-500/20 text-purple-400' 
                      : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    {user.role === 'admin' ? <VscVerified /> : <VscUnverified />}
                    {user.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400 text-sm">
                  {new Date(user.created_at).toLocaleDateString('tr-TR')}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleRoleChange(
                      user.id, 
                      user.role === 'admin' ? 'user' : 'admin'
                    )}
                    className="text-xs px-3 py-1 rounded-lg bg-purple-500/20 
                             text-purple-400 hover:bg-purple-500/30 transition-colors"
                  >
                    {user.role === 'admin' ? 'Yetkiyi Al' : 'Admin Yap'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 