import { supabase } from '@/lib/supabase'

interface UserProfile {
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

export const adminService = {
  // Tüm kullanıcıları getir
  async getAllUsers(): Promise<UserProfile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching users:', error)
      throw error
    }

    return data
  },

  // Kullanıcı rolünü güncelle
  async updateUserRole(userId: string, newRole: 'user' | 'admin'): Promise<boolean> {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', userId)

    if (error) {
      console.error('Error updating user role:', error)
      throw error
    }

    return true
  }
} 