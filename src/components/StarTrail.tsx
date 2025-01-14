'use client'
import { useEffect, useRef } from 'react'

const COLORS = ['#E23636', '#F9F3EE', '#E1F8DC', '#B8AFE6', '#AEE1CD', '#5EB0E5']
const FONT_SIZES = ['1.1rem', '1.4rem', '0.8rem', '1.7rem']
const DIST_TO_DRAW = 50
const DELAY = 1000

export default function StarTrail() {
  const lastPosRef = useRef({ x: 0, y: 0 })
  const vh = useRef(0)

  useEffect(() => {
    vh.current = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

    const rand = (min: number, max: number) => 
      Math.floor(Math.random() * (max - min + 1)) + min

    const selRand = <T,>(arr: T[]): T => 
      arr[rand(0, arr.length - 1)]

    const distanceTo = (x1: number, y1: number, x2: number, y2: number) =>
      Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))

    const shouldDraw = (x: number, y: number) =>
      distanceTo(lastPosRef.current.x, lastPosRef.current.y, x, y) >= DIST_TO_DRAW

    const addStar = (x: number, y: number) => {
      const star = document.createElement('div')
      star.innerHTML = '★' // veya '⭐' veya '✦'
      star.className = 'star'
      star.style.top = `${y + window.pageYOffset + rand(-20, 20)}px`
      star.style.left = `${x}px`
      star.style.color = selRand(COLORS)
      star.style.fontSize = selRand(FONT_SIZES)
      document.body.appendChild(star)

      const fontSize = 10 + 5 * parseFloat(getComputedStyle(star).fontSize)
      const moveDistance = (y + fontSize) > vh.current ? vh.current - y : fontSize

      star.animate({
        translate: `0 ${moveDistance}px`,
        opacity: 0,
        transform: `rotateX(${rand(1, 500)}deg) rotateY(${rand(1, 500)}deg)`
      }, {
        duration: DELAY,
        fill: 'forwards'
      })

      setTimeout(() => {
        star.remove()
      }, DELAY)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      if (shouldDraw(clientX, clientY)) {
        addStar(clientX, clientY)
        lastPosRef.current = { x: clientX, y: clientY }
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return null
} 