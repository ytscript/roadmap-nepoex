'use client'
import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'

const SECRET_CODE = 'beef' // veya 'nepo'

export default function EasterEgg() {
  const [sequence, setSequence] = useState<string[]>([])
  const [isPartyMode, setIsPartyMode] = useState(false)

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const newSequence = [...sequence, event.key.toLowerCase()]
      
      // Son 4 karakteri al
      if (newSequence.length > 4) {
        newSequence.shift()
      }
      
      setSequence(newSequence)

      // Gizli kodu kontrol et
      if (newSequence.join('') === SECRET_CODE) {
        // Party mode'u aktifleştir
        setIsPartyMode(true)
        
        // Konfeti efekti
        const duration = 3 * 1000
        const end = Date.now() + duration

        const frame = () => {
          confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#9333EA', '#DB2777', '#2563EB']
          })
          confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#9333EA', '#DB2777', '#2563EB']
          })

          if (Date.now() < end) {
            requestAnimationFrame(frame)
          }
        }
        
        frame()

        // 8-bit zafer sesi
        const audio = new Audio('/sounds/powerup.mp3')
        audio.volume = 0.3
        audio.play().catch(console.error)

        // Sayfadaki tüm yazıları rainbow efekti ile göster
        document.body.classList.add('rainbow-text')
        
        // 3 saniye sonra efektleri kaldır
        setTimeout(() => {
          setIsPartyMode(false)
          document.body.classList.remove('rainbow-text')
        }, 3000)

        setSequence([])
      }
    }

    window.addEventListener('keypress', handleKeyPress)
    return () => window.removeEventListener('keypress', handleKeyPress)
  }, [sequence])

  // Debug için tuş sırasını göster (geliştirme aşamasında)
  useEffect(() => {
    console.log('Current sequence:', sequence.join(''))
  }, [sequence])

  if (isPartyMode) {
    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10" />
      </div>
    )
  }

  return null
} 