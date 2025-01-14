'use client'

import { useState, useEffect } from 'react'
import { VscAdd, VscEdit, VscTrash, VscChevronDown, VscChevronRight } from 'react-icons/vsc'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchRoadmapCards } from '@/lib/supabase/roadmap'
import { toast } from 'sonner'

interface Resource {
  id: string
  title: string
  url: string
  type: 'article' | 'video' | 'github' | 'demo'
}

interface Topic {
  id: string
  title: string
  description: string
  order_number: number
  resources: Resource[]
}

interface RoadmapCard {
  id: string
  title: string
  description: string
  category: 'frontend' | 'backend' | 'devops' | 'mobile'
  level: 'beginner' | 'intermediate' | 'advanced'
  status: 'in-progress' | 'locked' | 'completed'
  order_number: number
  estimated_time: string
  topics: Topic[]
}

export default function RoadmapManagement() {
  const [selectedCategory, setSelectedCategory] = useState<RoadmapCard['category']>('frontend')
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [cardsByCategory, setCardsByCategory] = useState<Record<RoadmapCard['category'], RoadmapCard[]>>({
    frontend: [],
    backend: [],
    devops: [],
    mobile: []
  })
  const [loading, setLoading] = useState(true)

  const categories = [
    { id: 'frontend' as const, title: 'Frontend', color: 'from-blue-400 to-purple-400' },
    { id: 'backend' as const, title: 'Backend', color: 'from-green-400 to-teal-400' },
    { id: 'devops' as const, title: 'DevOps', color: 'from-orange-400 to-red-400' },
    { id: 'mobile' as const, title: 'Mobile', color: 'from-purple-400 to-pink-400' }
  ]

  useEffect(() => {
    const loadCards = async () => {
      if (cardsByCategory[selectedCategory].length > 0) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await fetchRoadmapCards(selectedCategory)
        setCardsByCategory(prev => ({
          ...prev,
          [selectedCategory]: data
        }))
      } catch (error) {
        console.error('Kartlar yüklenirken hata:', error)
        toast.error('Kartlar yüklenirken bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    loadCards()
  }, [selectedCategory, cardsByCategory])

  const currentCards = cardsByCategory[selectedCategory]

  return (
    <div className="space-y-6">
      {/* Kategori Seçimi */}
      <div className="flex gap-4 mb-8">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === category.id
                ? `bg-gradient-to-r ${category.color} text-white`
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {category.title}
          </button>
        ))}
      </div>

      {/* Kart Ekleme Butonu */}
      <button
        onClick={() => setIsAddingCard(true)}
        className="w-full p-4 rounded-xl border-2 border-dashed border-purple-500/20 
                   hover:border-purple-500/40 hover:bg-purple-500/5 transition-colors
                   text-gray-400 hover:text-purple-400 flex items-center justify-center gap-2"
      >
        <VscAdd />
        Yeni Kart Ekle
      </button>

      {/* Kartlar Listesi */}
      <div className="space-y-4">
        <AnimatePresence>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : currentCards.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              Bu kategoride henüz kart bulunmuyor
            </div>
          ) : (
            currentCards.map(card => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-[#1a1a2e]/50 rounded-xl border border-purple-500/20 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-200">{card.title}</h3>
                      <p className="text-sm text-gray-400">{card.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setExpandedCard(expandedCard === card.id ? null : card.id)}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                      >
                        {expandedCard === card.id ? <VscChevronDown /> : <VscChevronRight />}
                      </button>
                      <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-blue-400">
                        <VscEdit />
                      </button>
                      <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-red-400">
                        <VscTrash />
                      </button>
                    </div>
                  </div>

                  {/* Kart Detayları */}
                  <AnimatePresence>
                    {expandedCard === card.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 pt-4 border-t border-purple-500/20"
                      >
                        {/* Başlıklar */}
                        <div className="space-y-4">
                          {card.topics.map(topic => (
                            <div key={topic.id} className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h4 className="text-gray-300">{topic.title}</h4>
                                <div className="flex items-center gap-2">
                                  <button className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400">
                                    Düzenle
                                  </button>
                                  <button className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400">
                                    Sil
                                  </button>
                                </div>
                              </div>

                              {/* Kaynaklar */}
                              <div className="pl-4 space-y-2">
                                {topic.resources.map(resource => (
                                  <div key={resource.id} className="flex items-center justify-between text-sm">
                                    <a 
                                      href={resource.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-gray-400 hover:text-purple-400 transition-colors"
                                    >
                                      {resource.title}
                                    </a>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                                        {resource.type}
                                      </span>
                                      <button className="text-gray-400 hover:text-red-400">
                                        <VscTrash size={14} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Yeni Kaynak Ekleme */}
                              <button className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-400">
                                + Yeni Kaynak Ekle
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Yeni Başlık Ekleme */}
                        <button className="mt-4 text-sm px-3 py-1 rounded bg-purple-500/20 text-purple-400">
                          + Yeni Başlık Ekle
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 