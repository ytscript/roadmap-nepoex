'use client'
import { useEffect, useState } from 'react'

const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

export default function KonamiCode() {
  const [sequence, setSequence] = useState<string[]>([])
  const [isRainbowMode, setIsRainbowMode] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const newSequence = [...sequence, event.key]
      if (newSequence.length > konamiCode.length) {
        newSequence.shift() // En eski tuşu çıkar
      }
      setSequence(newSequence)

      // Konami kodu tamamlandı mı kontrol et
      if (newSequence.join(',') === konamiCode.join(',')) {
        // Rainbow mode'u aç
        setIsRainbowMode(true)
        
        // Ses efekti
        const audio = new Audio('/sounds/8bit-victory.mp3')
        audio.volume = 0.5 // Sesi biraz kısalım
        audio.play().catch(err => console.log('Ses çalınamadı:', err))

        // 5 saniye sonra rainbow mode'u kapat
        setTimeout(() => {
          setIsRainbowMode(false)
        }, 5000)

        // Sequence'i sıfırla
        setSequence([])
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [sequence])

  // Rainbow mode aktifken body'e class ekle
  useEffect(() => {
    if (isRainbowMode) {
      document.body.classList.add('rainbow-mode')
    } else {
      document.body.classList.remove('rainbow-mode')
    }
  }, [isRainbowMode])

  // Debug için tuş sırasını göster (geliştirme aşamasında)
  useEffect(() => {
    console.log('Current sequence:', sequence)
  }, [sequence])

  return null
} 