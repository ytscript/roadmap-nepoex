'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiPlay } from 'react-icons/fi'

interface Video {
  title: string
  link: string
  thumbnail: string
  publishDate: string
}

export default function LatestVideos() {
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // YouTube kanal ID'si
        const channelId = 'UCfMpP3ttrT7Si80tsU7VFbQ' // Örnek ID, kendi kanal ID'nizi kullanın
        
        // RSS feed URL'i
        const feedUrl = `https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
        
        const response = await fetch(feedUrl)
        const data = await response.json()
        
        const formattedVideos = data.items.slice(0, 6).map((item: any) => ({
          title: item.title,
          link: item.link,
          thumbnail: item.thumbnail,
          publishDate: new Date(item.pubDate).toLocaleDateString('tr-TR')
        }))

        setVideos(formattedVideos)
      } catch (error) {
        console.error('Video yüklenirken hata:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVideos()
  }, [])

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="aspect-video bg-purple-500/10 animate-pulse rounded-xl"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {videos.map((video, index) => (
        <motion.a
          key={video.link}
          href={video.link}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -5 }}
          className="group relative aspect-video rounded-xl overflow-hidden"
        >
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <FiPlay className="w-12 h-12 text-white" />
          </div>
          
          {/* Title */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="text-white font-medium line-clamp-2">
              {video.title}
            </h3>
            <p className="text-sm text-gray-300 mt-1">
              {video.publishDate}
            </p>
          </div>
        </motion.a>
      ))}
    </div>
  )
} 