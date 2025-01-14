'use client'
import { useEffect, useState, useRef } from 'react'
import confetti from 'canvas-confetti'

export default function DrawingEasterEgg() {
  const [isDrawing, setIsDrawing] = useState(false)
  const [points, setPoints] = useState<{ x: number; y: number }[]>([])
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      setIsDrawing(true)
      setPoints([{ x: e.clientX, y: e.clientY }])
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawing) return
      setPoints(prev => [...prev, { x: e.clientX, y: e.clientY }])
    }

    const handleMouseUp = () => {
      if (isDrawing) {
        // N harfini kontrol et
        checkForN()
      }
      setIsDrawing(false)
      
      // 2 saniye sonra çizimi temizle
      timeoutRef.current = setTimeout(() => {
        setPoints([])
      }, 2000)
    }

    const checkForN = () => {
      if (points.length < 10) return

      // Basit N harfi kontrolü
      // Sol dikey çizgi
      const hasLeftLine = points.some(p => p.x < window.innerWidth * 0.4)
      // Sağ dikey çizgi
      const hasRightLine = points.some(p => p.x > window.innerWidth * 0.6)
      // Çapraz çizgi
      const hasDiagonal = points.some(p => 
        p.x > window.innerWidth * 0.4 && 
        p.x < window.innerWidth * 0.6
      )

      if (hasLeftLine && hasRightLine && hasDiagonal) {
        triggerEasterEgg()
      }
    }

    const triggerEasterEgg = () => {
      // Konfeti efekti
      const duration = 3 * 1000
      const end = Date.now() + duration

      const frame = () => {
        confetti({
          particleCount: 7,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#9333EA', '#DB2777', '#2563EB']
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }
      
      frame()

      // Ses efekti
      const audio = new Audio('/sounds/magic.mp3')
      audio.volume = 0.3
      audio.play().catch(console.error)
    }

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [isDrawing, points])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <svg className="w-full h-full">
        {points.map((point, i) => {
          if (i === 0) return null
          const prevPoint = points[i - 1]
          return (
            <line
              key={i}
              x1={prevPoint.x}
              y1={prevPoint.y}
              x2={point.x}
              y2={point.y}
              stroke="#9333EA"
              strokeWidth="2"
              strokeLinecap="round"
              className="opacity-50"
            />
          )
        })}
      </svg>
    </div>
  )
} 