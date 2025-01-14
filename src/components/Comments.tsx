'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMessageSquare, FiHeart, FiSend, FiTrash, FiGithub, FiClock } from 'react-icons/fi'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/hooks/useUser'
import confetti from 'canvas-confetti'

interface Comment {
  id: string
  content: string
  created_at: string
  user_id: string
  post_slug: string
  likes: number
  user_name: string
  user_avatar_url: string
}

interface DatabaseComment extends Omit<Comment, 'user_name' | 'user_avatar_url'> {
  user: {
    user_name: string | null
    user_avatar_url: string | null
  }
}

export default function Comments({ postSlug }: { postSlug: string }) {
  const [pendingComments, setPendingComments] = useState<Comment[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const { user, signIn } = useUser()

  useEffect(() => {
    fetchComments()
    if (user) {
      fetchPendingComments()
    }
  }, [postSlug, user])

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments_with_user')
      .select('*')
      .eq('post_slug', postSlug)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })

    if (data) setComments(data)
    setIsLoading(false)
  }

  const fetchPendingComments = async () => {
    if (!user) return
    
    const { data } = await supabase
      .from('comments_with_user')
      .select('*')
      .eq('post_slug', postSlug)
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (data) {
      setPendingComments(data)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newComment.trim()) return

    try {
      // Onaylanmamış yorum kontrolü
      if (pendingComments.length > 0) {
        const modal = document.createElement('div')
        modal.innerHTML = `
          <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div class="bg-[#1a1a2e] p-6 rounded-xl max-w-md w-full mx-4 relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-yellow-500/10 opacity-50 animate-pulse"></div>
              <div class="relative">
                <div class="flex items-center gap-3 mb-4">
                  <div class="p-2 bg-purple-500/10 rounded-lg">
                    <svg class="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                    </svg>
                  </div>
                  <h3 class="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">İstisna: BekleyenBüyüHatası</h3>
                </div>
                <div class="font-mono text-sm bg-black/20 p-3 rounded-lg mb-4 text-pink-400">
                  hataFırlat("🧙‍♂️ Eşzamansız büyü işlemi henüz tamamlanmadı!");
                </div>
                <p class="text-gray-300 mb-6">
                  <span class="text-purple-400">// Önceki büyünüz hala Büyük Konsey tarafından inceleniyor</span><br>
                  🪄 Uzak galaksiden gönderdiğiniz büyü parşömeniniz hala inceleme aşamasında! Yeni bir büyü yapmadan önce mevcut büyünüzün Kadim Büyü Kitabı'na eklenmesini bekleyin.
                  <span class="block mt-2 text-yellow-400">büyüDurumu: parşömen_incelemede ✨</span>
                </p>
                <button class="w-full px-4 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 rounded-lg hover:from-purple-500/30 hover:to-pink-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] font-medium">
                  bekle(büyüİncelemesi.tamamlandı()) 🔮
                </button>
              </div>
            </div>
          </div>
        `
        document.body.appendChild(modal)
        
        const closeModal = () => {
          document.body.removeChild(modal)
        }
        
        modal.querySelector('button')?.addEventListener('click', closeModal)
        modal.addEventListener('click', (e) => {
          if (e.target === modal) closeModal()
        })
        
        return
      }

      // Rate limit kontrolü
      const { data: isAllowed, error: rateError } = await supabase
        .rpc('check_rate_limit', {
          p_user_id: user.id,
          p_action: 'comment',
          p_max_count: 5,
          p_window_minutes: 60
        })

      if (rateError) throw rateError
      if (!isAllowed) {
        const modal = document.createElement('div')
        modal.innerHTML = `
          <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div class="bg-[#1a1a2e] p-6 rounded-xl max-w-md w-full mx-4 relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10 opacity-50 animate-pulse"></div>
              <div class="relative">
                <div class="flex items-center gap-3 mb-4">
                  <div class="p-2 bg-red-500/10 rounded-lg">
                    <svg class="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                  </div>
                  <h3 class="text-xl font-semibold bg-gradient-to-r from-red-400 to-orange-400 text-transparent bg-clip-text">HızAşımıHatası</h3>
                </div>
                <div class="font-mono text-sm bg-black/20 p-3 rounded-lg mb-4 text-orange-400">
                  Hata: Büyü yığını maksimum boyuta ulaştı - büyü.yap() içinde
                </div>
                <p class="text-gray-300 mb-6">
                  <span class="text-orange-400">// İşlemci sıcaklığı kritik seviyede!</span><br>
                  🪄 Büyü çalışma zamanınız geçici olarak aşırı yüklendi! Son bir saatte çok fazla özyinelemeli büyü çağrısı yaptınız. Çöp toplayıcı çalışana kadar bekleyin.
                  <span class="block mt-2 font-mono text-red-400">Bellek kullanımı: 98% ⚠️</span>
                </p>
                <button class="w-full px-4 py-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400 rounded-lg hover:from-red-500/30 hover:to-orange-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] font-medium">
                  zamanAyarla(manaYenile, birSaat) 🔮
                </button>
              </div>
            </div>
          </div>
        `
        document.body.appendChild(modal)
        
        const closeModal = () => {
          document.body.removeChild(modal)
        }
        
        modal.querySelector('button')?.addEventListener('click', closeModal)
        modal.addEventListener('click', (e) => {
          if (e.target === modal) closeModal()
        })
        return
      }

      const { data, error } = await supabase
        .from('comments')
        .insert({
          content: newComment.trim(),
          post_slug: postSlug,
          user_id: user.id,
          status: 'pending'
        })
        .select()
        .single()

      if (error) throw error

      // Add user info to the comment
      const commentWithUser = {
        ...data,
        user: {
          name: user.user_metadata.name || user.user_metadata.user_name,
          avatar_url: user.user_metadata.avatar_url || user.user_metadata.user_avatar
        }
      }

      // Yeni yorumu bekleyen yorumlar listesine ekle
      setPendingComments([commentWithUser, ...pendingComments])
      setNewComment('')
      showConfetti()
    } catch (error) {
      console.error('Error posting comment:', error)
    }
  }

  const handleLike = async (commentId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .rpc('toggle_comment_like', { 
          p_comment_id: commentId,
          p_user_id: user.id 
        })

      if (error) throw error

      // Like mesajı
      const modal = document.createElement('div')
      modal.innerHTML = `
        <div class="fixed inset-0 flex items-center justify-center z-50 animate-fadeOut">
          <div class="px-4 py-2 bg-purple-500/10 rounded-lg text-purple-400 font-mono text-sm">
            likes.toggle()
            // Like durumu güncellendi ⭐
          </div>
        </div>
      `
      document.body.appendChild(modal)
      setTimeout(() => document.body.removeChild(modal), 1500)

      await fetchComments()
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleDelete = async (commentId: string) => {
    if (!user) return
    
    try {
      // Silme onayı
      const modal = document.createElement('div')
      modal.innerHTML = `
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div class="bg-[#1a1a2e] p-6 rounded-xl max-w-md w-full mx-4 relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-r from-red-500/10 via-purple-500/10 to-pink-500/10 opacity-50 animate-pulse"></div>
            <div class="relative">
              <div class="flex items-center gap-3 mb-4">
                <div class="p-2 bg-red-500/10 rounded-lg">
                  <svg class="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 class="text-xl font-semibold bg-gradient-to-r from-red-400 to-pink-400 text-transparent bg-clip-text">DELETE FROM comments</h3>
              </div>
              <div class="font-mono text-sm bg-black/20 p-3 rounded-lg mb-4 text-pink-400">
                async function evanesco() {
                  try {
                    await db.comments.delete();
                    return "Yorum yok edildi! 🪄✨";
                  } catch (e) {
                    return "Büyü başarısız oldu! 🎭";
                  }
                }
              </div>
              <p class="text-gray-300 mb-6">
                <span class="text-red-400">// UYARI: Bu işlem geri alınamaz!</span><br>
                Bu yorumu gerçekten veritabanından silmek istiyor musunuz?
              </p>
              <div class="flex gap-3">
                <button class="flex-1 px-4 py-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 rounded-lg hover:from-red-500/30 hover:to-pink-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] font-medium delete-confirm">
                  DROP TABLE comments 🗑️
                </button>
                <button class="flex-1 px-4 py-3 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] font-medium delete-cancel">
                  ROLLBACK
                </button>
              </div>
            </div>
          </div>
        </div>
      `
      document.body.appendChild(modal)

      return new Promise((resolve) => {
        const confirmDelete = async () => {
          document.body.removeChild(modal)
          
          const { error } = await supabase
            .rpc('delete_comment_with_rate_limit', { comment_id: commentId })

          if (error) throw error

          // Silme başarılı efekti
          const deleteEffect = document.createElement('div')
          deleteEffect.innerHTML = `
            <div class="fixed inset-0 flex items-center justify-center z-50 animate-fadeOut">
              <div class="px-4 py-2 bg-red-500/10 rounded-lg text-red-400 font-mono text-sm">
                await Promise.all([
                  evanesco(comment),
                  temizle(rateLimits)
                ]);
                // EVANESCO! Yorum başarıyla yok edildi! 🪄✨
              </div>
            </div>
          `
          document.body.appendChild(deleteEffect)
          setTimeout(() => document.body.removeChild(deleteEffect), 2000)

          setComments(comments.filter(c => c.id !== commentId))
          resolve(true)
        }

        const cancelDelete = () => {
          document.body.removeChild(modal)
          resolve(false)
        }

        modal.querySelector('.delete-confirm')?.addEventListener('click', confirmDelete)
        modal.querySelector('.delete-cancel')?.addEventListener('click', cancelDelete)
      })

    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  const showConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#9333ea', '#db2777', '#4f46e5']
    })
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-16 pt-8 border-t border-purple-500/10"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <FiMessageSquare className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
            Yorumlar
          </h3>
        </div>

        {/* Yorum Formu */}
        {user ? (
          <motion.form 
            onSubmit={handleSubmit} 
            className="mb-12 relative group"
            initial={false}
            animate={newComment.trim() ? "active" : "inactive"}
          >
            <div className="relative">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Düşüncelerini paylaş..."
                className="w-full px-4 py-3 bg-white/5 rounded-xl border border-purple-500/10 focus:border-purple-500/30 outline-none transition-colors resize-none min-h-[120px] text-gray-200"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-xl" />
            </div>

            <div className="flex justify-end mt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={!newComment.trim()}
                className="px-6 py-2.5 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <FiSend className="w-4 h-4" />
                  Gönder
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            </div>
          </motion.form>
        ) : (
          <div className="mb-12 p-8 rounded-xl bg-white/5 text-center relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-gray-400 mb-4">
                Yorum yapmak için giriş yapmalısın
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={signIn}
                className="px-6 py-2.5 bg-[#2D333B] text-white rounded-full hover:bg-[#373E47] transition-colors flex items-center gap-2 mx-auto"
              >
                <FiGithub className="w-5 h-5" />
                GitHub ile Giriş Yap
              </motion.button>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}

        {/* Yorumlar Listesi */}
        <div className="space-y-6">
          <AnimatePresence>
            {/* Bekleyen Yorumlar */}
            {pendingComments.map((comment, index) => (
              <motion.div
                key={`pending-${comment.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="p-6 rounded-xl bg-white/5 border border-purple-500/10 relative overflow-hidden opacity-50">
                  {/* Onay Bekliyor Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                    <div className="flex items-center gap-2 text-yellow-500 text-sm">
                      <FiClock className="w-4 h-4 animate-pulse" />
                      <span>Onay Bekliyor</span>
                    </div>
                  </div>

                  {/* Normal yorum içeriği */}
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={comment.user_avatar_url || '/default-avatar.png'}
                      alt={comment.user_name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/20"
                    />
                    <div>
                      <div className="font-medium text-purple-400">
                        {comment.user_name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date(comment.created_at).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4 pl-[52px]">{comment.content}</p>

                  {/* Hover Efekti */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                </div>
              </motion.div>
            ))}

            {/* Onaylanmış Yorumlar */}
            {comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="p-6 rounded-xl bg-white/5 border border-purple-500/10 relative overflow-hidden">
                  {/* Kullanıcı Bilgisi */}
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={comment.user_avatar_url || '/default-avatar.png'}
                      alt={comment.user_name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/20"
                    />
                    <div>
                      <div className="font-medium text-purple-400">
                        {comment.user_name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date(comment.created_at).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Yorum İçeriği */}
                  <p className="text-gray-300 mb-4 pl-[52px]">{comment.content}</p>

                  {/* Aksiyon Butonları */}
                  <div className="flex items-center gap-4 pl-[52px]">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleLike(comment.id)}
                      className="flex items-center gap-2 text-sm text-gray-400 hover:text-purple-400 transition-colors group/like"
                    >
                      <FiHeart className="w-4 h-4 group-hover/like:fill-purple-400" />
                      {comment.likes}
                    </motion.button>
                    {user?.id === comment.user_id && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(comment.id)}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors group/delete"
                      >
                        <FiTrash className="w-4 h-4" />
                        Sil
                      </motion.button>
                    )}
                  </div>

                  {/* Hover Efekti */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Yükleniyor */}
          {isLoading && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-[200px] bg-white/5 rounded-xl" />
                </div>
              ))}
            </div>
          )}

          {/* Yorum Yok */}
          {!isLoading && comments.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-gray-400"
            >
              <FiMessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Henüz yorum yapılmamış. İlk yorumu sen yap!</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
} 