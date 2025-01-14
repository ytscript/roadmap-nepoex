'use client'

import { useState, useCallback, useMemo, memo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog } from '@headlessui/react'
import { VscRocket, VscStarFull, VscCircleFilled, VscCheck, VscLock, VscClose, VscBook, VscLink, VscGithub } from 'react-icons/vsc'
import { useUser } from '@/hooks/useUser'
import { fetchRoadmapCards, fetchUserProgress, markTopicAsCompleted, unmarkTopicAsCompleted, isCardUnlocked, RoadmapCard as RoadmapCardType } from '@/lib/supabase/roadmap'
import { toast } from 'sonner'
import { useRoadmapStore } from '@/store/roadmap'

const levelColors = {
  beginner: 'from-green-500 to-emerald-500',
  intermediate: 'from-blue-500 to-purple-500',
  advanced: 'from-purple-500 to-pink-500'
}

const levelBorders = {
  beginner: 'border-green-500/20',
  intermediate: 'border-blue-500/20',
  advanced: 'border-purple-500/20'
}

const resourceTypeIcons = {
  article: <VscBook className="w-4 h-4" />,
  video: <VscRocket className="w-4 h-4" />,
  github: <VscGithub className="w-4 h-4" />,
  demo: <VscLink className="w-4 h-4" />
}

// Performans için ayrı komponentlere bölelim
const TopicItem = memo(({ topic, showStatus = true }: { 
  topic: RoadmapCardType['topics'][0]
  showStatus?: boolean
}) => (
  <div className="flex items-center justify-between gap-2 text-sm bg-white/5 p-2 rounded-lg">
    <div className="flex items-center gap-2">
      <VscCircleFilled className={`w-3 h-3 ${topic.completed ? 'text-green-500' : 'text-gray-500'}`} />
      <span className={topic.completed ? 'text-gray-300' : 'text-gray-500'}>
        {topic.title}
      </span>
    </div>
    {showStatus && (
      <span className={`text-xs px-2 py-1 rounded-full ${
        topic.completed 
          ? 'bg-green-500/20 text-green-400'
          : 'bg-gray-500/20 text-gray-400'
      }`}>
        {topic.completed ? 'Tamamlandı' : 'Öğreniliyor'}
      </span>
    )}
  </div>
))

TopicItem.displayName = 'TopicItem'

const RoadmapCard = memo(({ 
  item, 
  index, 
  onSelect
}: { 
  item: RoadmapCardType
  index: number
  onSelect: () => void
}) => {
  const animationProps = useMemo(() => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: index * 0.1 + 0.4 }
  }), [index])

  return (
    <motion.div
      {...animationProps}
      onClick={onSelect}
      className={`bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl p-6 backdrop-blur-sm border ${levelBorders[item.level]} cursor-pointer group hover:border-purple-500/40 transition-colors`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold mb-1 group-hover:text-purple-400 transition-colors">
            {item.title}
          </h3>
          <div className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${levelColors[item.level]} inline-flex items-center gap-1`}>
            <VscStarFull className="w-3 h-3" />
            <span>
              {item.level === 'beginner' ? 'Başlangıç' : item.level === 'intermediate' ? 'Orta Seviye' : 'İleri Seviye'}
            </span>
          </div>
        </div>
        {item.status === 'locked' ? (
          <VscLock className="w-6 h-6 text-gray-500" />
        ) : item.status === 'completed' ? (
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <VscCheck className="w-4 h-4 text-black" />
          </div>
        ) : (
          <VscRocket className="w-6 h-6 text-blue-400" />
        )}
      </div>
      
      <div className="space-y-2">
        {item.topics.map((topic, i) => (
          <TopicItem
            key={i}
            topic={topic}
            showStatus={false}
          />
        ))}
      </div>

      {/* XP Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-400">XP İlerlemesi</span>
          <span className="text-xs font-medium">{item.xp} XP</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className={`h-full bg-gradient-to-r ${levelColors[item.level]}`}
            initial={{ width: 0 }}
            animate={{ width: `${(item.topics.filter(t => t.completed).length / item.topics.length) * 100}%` }}
            transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  )
})

RoadmapCard.displayName = 'RoadmapCard'

// Modal içindeki topic kartı için ayrı komponent
const TopicCard = memo(({ 
  topic, 
  onStatusChange,
  isVisible = true
}: { 
  topic: RoadmapCardType['topics'][0]
  onStatusChange: () => void
  isVisible?: boolean
}) => {
  if (!isVisible) return null

  return (
    <div className={`bg-white/5 rounded-lg p-4 border transition-colors ${
      topic.completed ? 'border-green-500/20' : 'border-purple-500/10'
    }`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-medium mb-2">{topic.title}</h4>
          <p className="text-sm text-gray-400 mb-3">{topic.description}</p>
          <button
            onClick={onStatusChange}
            className={`text-sm px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all ${
              topic.completed 
                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
            }`}
          >
            {topic.completed ? (
              <>
                <VscCheck className="w-4 h-4" />
                Tamamlandı
              </>
            ) : (
              <>
                <VscRocket className="w-4 h-4" />
                Tamamla
              </>
            )}
          </button>
        </div>
      </div>

      {/* Konu Kaynakları */}
      {topic.resources && topic.resources.length > 0 && (
        <div className="space-y-2 mt-4 pt-4 border-t border-white/5">
          <h5 className="text-sm font-medium text-gray-300">Kaynaklar</h5>
          <div className="flex flex-wrap gap-2">
            {topic.resources.map((resource, j) => (
              <a
                key={j}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-sm text-gray-400 hover:text-white transition-colors"
              >
                {resourceTypeIcons[resource.type]}
                <span>{resource.title}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
})

TopicCard.displayName = 'TopicCard'

// Modal içeriği için ayrı komponent
const ModalContent = memo(({ 
  item, 
  onClose,
  onTopicStatusChange 
}: { 
  item: RoadmapCardType
  onClose: () => void
  onTopicStatusChange: (index: number) => void
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleTopics, setVisibleTopics] = useState<boolean[]>([])

  // Görünür topic'leri hesapla
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const newVisibleTopics = [...visibleTopics]
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute('data-index'))
          if (!isNaN(index)) {
            newVisibleTopics[index] = entry.isIntersecting
          }
        })
        setVisibleTopics(newVisibleTopics)
      },
      {
        root: containerRef.current,
        rootMargin: '50px 0px',
        threshold: 0
      }
    )

    const elements = containerRef.current?.querySelectorAll('[data-index]')
    elements?.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [item.topics.length])

  return (
    <Dialog.Panel 
      as={motion.div}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-[#1a1a2e] rounded-xl p-6 max-w-3xl w-full border border-purple-500/20 shadow-xl max-h-[90vh] overflow-hidden flex flex-col"
    >
      {/* Modal Başlık */}
      <div className="flex items-start justify-between mb-6 flex-shrink-0">
        <div>
          <Dialog.Title className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {item.title}
          </Dialog.Title>
          <div className={`mt-2 text-xs px-2 py-1 rounded-full bg-gradient-to-r ${levelColors[item.level]} inline-flex items-center gap-1`}>
            <VscStarFull className="w-3 h-3" />
            <span>
              {item.level === 'beginner' ? 'Başlangıç' : item.level === 'intermediate' ? 'Orta Seviye' : 'İleri Seviye'}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/5 rounded-lg transition-colors"
        >
          <VscClose className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      {/* Modal İçerik - Scrollable Alan */}
      <div 
        ref={containerRef}
        className="overflow-y-auto flex-1 scroll-smooth"
        style={{
          scrollbarGutter: 'stable',
          scrollbarWidth: 'thin',
          msOverflowStyle: 'none'
        }}
      >
        <div className="space-y-6">
          {/* Açıklama */}
          <div>
            <h3 className="text-lg font-medium mb-2">Açıklama</h3>
            <p className="text-gray-400">{item.description}</p>
          </div>

          {/* Tahmini Süre */}
          {item.estimated_time && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <VscRocket className="w-4 h-4" />
              <span>Tahmini Süre: {item.estimated_time}</span>
            </div>
          )}

          {/* Konular */}
          <div>
            <h3 className="text-lg font-medium mb-4">Konular</h3>
            <div className="space-y-4">
              {item.topics.map((topic, i) => (
                <div key={i} data-index={i}>
                  <TopicCard
                    topic={topic}
                    onStatusChange={() => onTopicStatusChange(i)}
                    isVisible={visibleTopics[i]}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Dialog.Panel>
  )
})

ModalContent.displayName = 'ModalContent'

export default function BackendRoadmap() {
  const { user } = useUser()
  const [selectedItem, setSelectedItem] = useState<RoadmapCardType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const { getCards, setCards, updateTopicStatus } = useRoadmapStore()
  const roadmapItems = useRoadmapStore(state => state.backendCards)

  // Verileri sadece ilk yüklemede ve store boşsa çek
  useEffect(() => {
    async function loadRoadmapData() {
      // Store'da veri varsa tekrar çekme
      if (roadmapItems.length > 0) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const cards = await fetchRoadmapCards('backend')
        
        if (user) {
          const progress = await fetchUserProgress(user.id)
          
          const updatedCards = cards.map(card => {
            const cardProgress = progress.filter(p => p.card_id === card.id)
            const updatedTopics = card.topics.map(topic => ({
              ...topic,
              completed: cardProgress.some(p => p.topic_id === topic.id)
            }))
            
            return {
              ...card,
              topics: updatedTopics
            }
          })
          
          setCards('backend', updatedCards)
        } else {
          setCards('backend', cards)
        }
      } catch (error) {
        console.error('Error loading roadmap data:', error)
        toast.error('Yol haritası yüklenirken bir hata oluştu')
      } finally {
        setIsLoading(false)
      }
    }

    loadRoadmapData()
  }, [user]) // sadece user değiştiğinde çalışsın

  // Topic durumunu güncelleme
  const handleTopicStatusChange = async (itemId: string, topicId: string, completed: boolean) => {
    if (!user) {
      toast.error('Bu işlemi gerçekleştirmek için giriş yapmalısınız')
      return
    }

    try {
      if (completed) {
        await unmarkTopicAsCompleted(user.id, itemId, topicId)
      } else {
        await markTopicAsCompleted(user.id, itemId, topicId)
      }

      // Store'u güncelle
      updateTopicStatus('backend', itemId, topicId, completed)

      // Seçili kartı güncelle
      if (selectedItem?.id === itemId) {
        const updatedItem = getCards('backend').find(item => item.id === itemId)
        if (updatedItem) {
          setSelectedItem(updatedItem)
        }
      }

      toast.success(completed ? 'Konu tamamlanmadı olarak işaretlendi' : 'Konu tamamlandı olarak işaretlendi')
    } catch (error) {
      console.error('Error toggling topic status:', error)
      toast.error('İşlem sırasında bir hata oluştu')
    }
  }

  // Kart seçildiğinde kilidi kontrol et
  const handleSelectItem = async (item: RoadmapCardType) => {
    try {
      const isUnlocked = await isCardUnlocked(item.id);
      if (!isUnlocked) {
        toast.error('Bu kartı açmak için önceki kartları tamamlamalısınız');
        return;
      }
      setSelectedItem(item);
    } catch (error) {
      console.error('Error checking card unlock status:', error);
      toast.error('Kart durumu kontrol edilirken bir hata oluştu');
    }
  };

  const { totalXP, maxXP, progress } = useMemo(() => {
    // Tüm kartlardaki tamamlanan topic'lerin XP'sini topla
    const total = roadmapItems.reduce((acc, item) => {
      const completedTopicsCount = item.topics.filter(t => t.completed).length;
      return acc + (completedTopicsCount * 25);
    }, 0);

    // Tüm kartlardaki toplam topic sayısını hesapla ve 25 ile çarp
    const totalTopicsCount = roadmapItems.reduce((acc, item) => acc + item.topics.length, 0);
    const max = totalTopicsCount * 25;

    return {
      totalXP: total,
      maxXP: max,
      progress: max > 0 ? (total / max) * 100 : 0
    };
  }, [roadmapItems]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#1a1a2e] text-white pt-24 pb-12">
      {/* Arkaplan Efekti */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      </div>

      {/* Ana İçerik */}
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Başlık ve İlerleme */}
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Backend Galaktik Yolculuğu
          </motion.h1>
          <motion.p 
            className="text-gray-400 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Sunucu tarafı geliştirme yolculuğunda ilerleyerek bir backend ustası olun! 🚀
          </motion.p>

          {/* XP Progress */}
          <motion.div 
            className="max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Galaktik XP</span>
              <span className="text-sm font-medium">{totalXP} / {maxXP} XP</span>
            </div>
            <div className="h-4 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
          </motion.div>
        </div>

        {/* Roadmap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmapItems.map((item, index) => (
            <RoadmapCard
              key={item.id}
              item={item}
              index={index}
              onSelect={() => handleSelectItem(item)}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence mode="wait">
        {selectedItem && (
          <Dialog
            open={!!selectedItem}
            onClose={() => setSelectedItem(null)}
            className="relative z-50"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
            
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <ModalContent
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
                onTopicStatusChange={(index) => 
                  handleTopicStatusChange(selectedItem.id, selectedItem.topics[index].id, selectedItem.topics[index].completed)
                }
              />
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </main>
  );
}
