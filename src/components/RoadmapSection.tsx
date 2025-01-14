'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FiBook, FiYoutube, FiGithub } from 'react-icons/fi'
import { GiSpellBook, GiWizardStaff, GiCauldron, GiScrollUnfurled, GiPortal } from 'react-icons/gi'
import { BsRocketTakeoff, BsStars, BsChevronDown } from 'react-icons/bs'
import { LuWand } from 'react-icons/lu'
import { FaBookOpen, FaYoutube, FaGithub, FaDiscord, FaMedium, FaStackOverflow, FaTwitter } from 'react-icons/fa'
import { SiUdemy, SiCoursera, SiFrontendmentor, SiFreecodecamp } from 'react-icons/si'
import { TbBrandNextjs } from 'react-icons/tb'

const learningPaths = [
  {
    id: 'frontend',
    title: 'Frontend Büyücülüğü',
    description: 'Modern web uygulamaları geliştirmeyi öğrenin',
    icon: <GiWizardStaff className="w-8 h-8" />,
    color: 'from-purple-500 to-pink-500',
    topics: ['HTML & CSS', 'JavaScript', 'React', 'Next.js', 'TypeScript'],
    duration: '6-8 ay',
    projects: 12,
    difficulty: 'Başlangıç-Orta',
    popularity: 95
  },
  {
    id: 'backend',
    title: 'Backend Karanlık Sanatları',
    description: 'Sunucu tarafı programlama ve API geliştirme',
    icon: <GiCauldron className="w-8 h-8" />,
    color: 'from-blue-500 to-cyan-500',
    topics: ['Node.js', 'Express', 'PostgreSQL', 'API Design', 'Security'],
    duration: '8-10 ay',
    projects: 10,
    difficulty: 'Orta',
    popularity: 88
  },
  {
    id: 'mobile',
    title: 'Mobil Büyü Sanatları',
    description: 'iOS ve Android uygulama geliştirme',
    icon: <GiSpellBook className="w-8 h-8" />,
    color: 'from-green-500 to-emerald-500',
    topics: ['React Native', 'Flutter', 'Mobile UI/UX', 'App Store'],
    duration: '6-8 ay',
    projects: 8,
    difficulty: 'Orta',
    popularity: 82
  },
  {
    id: 'devops',
    title: 'DevOps Yüzük İşleme Sanatı',
    description: 'Deployment, CI/CD ve cloud servisleri',
    icon: <GiPortal className="w-8 h-8" />,
    color: 'from-orange-500 to-red-500',
    topics: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Monitoring'],
    duration: '8-12 ay',
    projects: 15,
    difficulty: 'İleri',
    popularity: 78
  },
  {
    id: 'ai-ml',
    title: 'Yapay Zeka Büyücülüğü',
    description: 'Makine öğrenimi ve yapay zeka',
    icon: <GiScrollUnfurled className="w-8 h-8" />,
    color: 'from-indigo-500 to-purple-500',
    topics: ['Python', 'TensorFlow', 'PyTorch', 'Deep Learning'],
    duration: '10-12 ay',
    projects: 10,
    difficulty: 'İleri',
    popularity: 90
  },
  {
    id: 'blockchain',
    title: 'Blockchain Simyası',
    description: 'Web3 ve blockchain geliştirme',
    icon: <LuWand className="w-8 h-8" />,
    color: 'from-yellow-500 to-orange-500',
    topics: ['Ethereum', 'Solidity', 'Web3.js', 'Smart Contracts'],
    duration: '6-8 ay',
    projects: 8,
    difficulty: 'Orta-İleri',
    popularity: 75
  }
]

export default function RoadmapSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [professorPosition, setProfessorPosition] = useState({ x: -100, y: 0 })
  const [selectedCard, setSelectedCard] = useState<{ x: number, y: number } | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [exitAnimation, setExitAnimation] = useState(false)
  const router = useRouter()

  const handleCardClick = async (path: any, event: React.MouseEvent) => {
    if (isAnimating) return
    event.preventDefault()

    const card = event.currentTarget.getBoundingClientRect()
    const cardCenterX = card.left + (card.width / 2)
    const cardBottomY = card.bottom
    const scrollY = window.scrollY

    setIsAnimating(true)
    setSelectedCardId(path.id)
    
    // Scroll'u dondur ve mevcut pozisyonu koru
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    document.body.style.overflowX = 'hidden'
    
    setSelectedCard({ x: cardCenterX, y: cardBottomY })
    setProfessorPosition({ x: cardCenterX - 50, y: cardBottomY - 50 })

    // Profesörün gelmesini bekle
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Kart animasyonunun tamamlanmasını bekle
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Çıkış animasyonunu başlat
    setExitAnimation(true)
    
    // Çıkış animasyonunun tamamlanmasını bekle
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Scroll'u tekrar etkinleştir ve pozisyonu geri yükle
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    document.body.style.overflow = ''
    document.body.style.overflowX = ''
    window.scrollTo(0, scrollY)
    
    router.push(`/roadmap/${path.id}`)
  }

  const filteredPaths = learningPaths.filter(path => {
    if (selectedDifficulty && !path.difficulty.toLowerCase().includes(selectedDifficulty.toLowerCase())) return false
    if (searchQuery && !path.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !path.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !path.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()))) return false
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Başlık */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Yazılım Büyücülüğü Yolları
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Hangi yazılım alanında uzmanlaşmak istediğinizi seçin ve size özel hazırlanmış öğrenme yolculuğunuza başlayın.
            Her yol, sizi adım adım ileri seviyeye taşıyacak büyüler içerir.
          </p>
        </div>

        {/* Filtreler */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Arama */}
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Öğrenme yolu ara... (frontend, backend, mobil vb.)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white placeholder-gray-400"
              />
            </div>

            {/* Zorluk */}
            <div>
              <select
                value={selectedDifficulty || ''}
                onChange={(e) => setSelectedDifficulty(e.target.value || null)}
                className="w-full px-4 py-3 bg-[#1a1a2e] border border-purple-500/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238B5CF6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem'
                }}
              >
                <option value="" className="bg-[#1a1a2e] text-white hover:bg-purple-500/20">Tüm Seviyeler</option>
                <option value="başlangıç" className="bg-[#1a1a2e] text-white hover:bg-purple-500/20">Başlangıç</option>
                <option value="orta" className="bg-[#1a1a2e] text-white hover:bg-purple-500/20">Orta</option>
                <option value="ileri" className="bg-[#1a1a2e] text-white hover:bg-purple-500/20">İleri</option>
              </select>
            </div>
          </div>
        </div>

        {/* Profesör Animasyonu */}
        <AnimatePresence>
          {isAnimating && (
            <motion.div
              initial={{ x: -200, y: window.innerHeight / 2 }}
              animate={exitAnimation ? 
                { 
                  x: window.innerWidth + 100,
                  y: professorPosition.y,
                  opacity: 1
                } :
                { 
                  x: professorPosition.x,
                  y: professorPosition.y,
                  opacity: 1
                }
              }
              transition={exitAnimation ? 
                { duration: 1, ease: "linear" } :
                { duration: 1, ease: "easeInOut" }
              }
              className="fixed z-[100] left-0 top-0"
              style={{ pointerEvents: 'none' }}
            >
              <Image
                src="/prof.gif"
                alt="Professor"
                width={100}
                height={100}
                priority
                className="w-24 h-24 object-contain"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Roadmap Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPaths.map((path) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 20 }}
              animate={selectedCardId === path.id ? 
                exitAnimation ? 
                  {
                    x: window.innerWidth - 650,
                    y: 0,
                    rotate: -5,
                    opacity: 1,
                    transition: { duration: 1, ease: "linear" }
                  } : 
                  {
                    opacity: 1,
                    y: [0, -20, -10],
                    rotate: [0, 0, -5],
                    transition: {
                      y: { duration: 0.3, delay: 1 },
                      rotate: { duration: 0.2, delay: 1.3 }
                    }
                  } 
                : {
                  opacity: 1,
                  y: 0,
                  rotate: 0
                }
              }
              className="relative group"
              onClick={(e) => handleCardClick(path, e)}
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-xl"
                   style={{ 
                     background: `linear-gradient(to right, ${path.color.split(' ')[0].replace('from-', '')}, ${path.color.split(' ')[1].replace('to-', '')})` 
                   }} />
              
              <motion.a
                href={`/roadmap/${path.id}`}
                className="block relative bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="p-6">
                  {/* Başlık ve İkon */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className={`text-2xl font-bold mb-2 ${
                        path.id === 'frontend' ? 'text-pink-400' :
                        path.id === 'backend' ? 'text-cyan-400' :
                        path.id === 'mobile' ? 'text-emerald-400' :
                        path.id === 'devops' ? 'text-orange-400' :
                        path.id === 'ai-ml' ? 'text-purple-400' :
                        'text-yellow-400'
                      } drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]`}>
                        {path.title}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {path.description}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${path.color} bg-opacity-10`}>
                      {path.icon}
                    </div>
                  </div>

                  {/* Konular */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {path.topics.map((topic, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-white/5 rounded-full text-xs text-gray-300"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Alt Bilgiler */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <BsRocketTakeoff className="w-4 h-4" />
                        <span>Süre: {path.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <GiSpellBook className="w-4 h-4" />
                        <span>{path.projects} Proje</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <LuWand className="w-4 h-4" />
                        <span>{path.difficulty}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <BsStars className="w-4 h-4 text-yellow-400" />
                        <span>{path.popularity}% Popüler</span>
                      </div>
                    </div>
                  </div>

                  {/* Başla Butonu */}
                  <div className="mt-6">
                    <motion.div
                      className="flex items-center justify-between px-4 py-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      <span className="text-sm font-medium text-white">Yolculuğa Başla</span>
                      <motion.span
                        className="text-white"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </motion.div>
                  </div>
                </div>
              </motion.a>
            </motion.div>
          ))}
        </div>

        {/* Sonuç Bulunamadı */}
        {filteredPaths.length === 0 && (
          <div className="text-center py-12">
            <GiSpellBook className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              Büyü Yolu Bulunamadı ✨
            </h3>
            <p className="text-gray-500">
              Farklı bir arama terimi veya zorluk seviyesi deneyin 🔮
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
