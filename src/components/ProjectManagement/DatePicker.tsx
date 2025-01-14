import { useState, useEffect, useRef } from 'react'
import { VscCalendar, VscChevronLeft, VscChevronRight } from 'react-icons/vsc'
import { motion, AnimatePresence } from 'framer-motion'

interface DatePickerProps {
  value: string
  onChange: (date: string) => void
  className?: string
}

type ViewMode = 'days' | 'months' | 'years'

export default function DatePicker({ value, onChange, className = '' }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(value ? new Date(value) : new Date())
  const [viewMode, setViewMode] = useState<ViewMode>('days')
  const containerRef = useRef<HTMLDivElement>(null)

  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ]

  const generateYearRange = () => {
    const currentYear = currentDate.getFullYear()
    const startYear = currentYear - 6
    const years = []
    for (let i = 0; i < 12; i++) {
      years.push(startYear + i)
    }
    return years
  }

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    onChange(formatDate(newDate))
    setIsOpen(false)
  }

  const handleMonthSelect = (monthIndex: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1))
    setViewMode('days')
  }

  const handleYearSelect = (year: number) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1))
    setViewMode('months')
  }

  const handlePrevious = () => {
    if (viewMode === 'days') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
    } else if (viewMode === 'months') {
      setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth()))
    } else {
      setCurrentDate(new Date(currentDate.getFullYear() - 12, currentDate.getMonth()))
    }
  }

  const handleNext = () => {
    if (viewMode === 'days') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
    } else if (viewMode === 'months') {
      setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth()))
    } else {
      setCurrentDate(new Date(currentDate.getFullYear() + 12, currentDate.getMonth()))
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setViewMode('days')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const renderCalendar = () => {
    if (viewMode === 'years') {
      return (
        <div className="grid grid-cols-3 gap-1">
          {generateYearRange().map(year => (
            <button
              type="button"
              key={year}
              onClick={() => handleYearSelect(year)}
              className={`h-10 rounded-lg flex items-center justify-center text-sm transition-colors ${
                year === currentDate.getFullYear()
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                  : 'hover:bg-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      )
    }

    if (viewMode === 'months') {
      return (
        <div className="grid grid-cols-3 gap-1">
          {months.map((month, index) => (
            <button
              type="button"
              key={month}
              onClick={() => handleMonthSelect(index)}
              className={`h-10 rounded-lg flex items-center justify-center text-sm transition-colors ${
                index === currentDate.getMonth()
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                  : 'hover:bg-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {month.slice(0, 3)}
            </button>
          ))}
        </div>
      )
    }

    const days = []
    const totalDays = daysInMonth(currentDate)
    const firstDay = firstDayOfMonth(currentDate)
    
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8" />)
    }

    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const isSelected = value === formatDate(date)
      const isToday = formatDate(date) === formatDate(new Date())

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateSelect(day)}
          className={`h-8 w-8 rounded-lg flex items-center justify-center text-sm transition-colors ${
            isSelected
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
              : isToday
              ? 'bg-purple-500/20 text-purple-400'
              : 'hover:bg-white/10 text-gray-400 hover:text-white'
          }`}
        >
          {day}
        </button>
      )
    }

    return (
      <>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'].map(day => (
            <div key={day} className="h-8 flex items-center justify-center text-xs text-gray-500">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </>
    )
  }

  const getHeaderText = () => {
    if (viewMode === 'years') {
      const years = generateYearRange()
      return `${years[0]} - ${years[years.length - 1]}`
    }
    if (viewMode === 'months') {
      return currentDate.getFullYear().toString()
    }
    return `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 bg-white/5 border border-purple-500/20 rounded-lg focus:outline-none focus:border-purple-500/40 text-white hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-2"
      >
        <VscCalendar className="text-gray-400" />
        <span className="flex-1">
          {value ? new Date(value).toLocaleDateString('tr-TR') : 'Tarih seçin'}
        </span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 bottom-full mb-2 p-4 bg-[#1a1a2e] rounded-xl border border-purple-500/20 shadow-xl w-[280px]"
          >
            {/* Ay ve Yıl Navigasyonu */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={handlePrevious}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
              >
                <VscChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode(viewMode === 'days' ? 'months' : 'years')}
                className="text-white font-medium hover:bg-white/10 px-2 py-1 rounded-lg transition-colors"
              >
                {getHeaderText()}
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
              >
                <VscChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Takvim */}
            {renderCalendar()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 