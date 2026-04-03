import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState, useCallback, useRef } from 'react'
import { AgendaEvent } from './types'

interface CalendarSidebarProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
  onDayClick: (date: Date) => void
  events: AgendaEvent[]
}

const DAYS = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM']
const MONTHS = [
  'JANVIER', 'FÉVRIER', 'MARS', 'AVRIL', 'MAI', 'JUIN',
  'JUILLET', 'AOÛT', 'SEPTEMBRE', 'OCTOBRE', 'NOVEMBRE', 'DÉCEMBRE',
]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

export function CalendarSidebar({ selectedDate, onDateChange, onDayClick, events }: CalendarSidebarProps) {
  const year = selectedDate.getFullYear()
  const month = selectedDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const today = new Date()

  const [revealedCount, setRevealedCount] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const [pageAnim, setPageAnim] = useState<'none' | 'left' | 'right'>('none')
  const touchStartX = useRef(0)
  const touchDragging = useRef(false)

  const prevMonth = useCallback(() => {
    setPageAnim('right')
    setTimeout(() => {
      onDateChange(new Date(year, month - 1, 1))
      setRevealedCount(0)
      setAnimKey((k) => k + 1)
      setPageAnim('none')
    }, 350)
  }, [year, month, onDateChange])

  const nextMonth = useCallback(() => {
    setPageAnim('left')
    setTimeout(() => {
      onDateChange(new Date(year, month + 1, 1))
      setRevealedCount(0)
      setAnimKey((k) => k + 1)
      setPageAnim('none')
    }, 350)
  }, [year, month, onDateChange])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchDragging.current = true
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchDragging.current) return
    touchDragging.current = false
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextMonth()
      else prevMonth()
    }
  }, [nextMonth, prevMonth])

  const days: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)
  // Fill remaining cells to complete the grid
  while (days.length % 7 !== 0) days.push(null)
  const totalRows = days.length / 7

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  const isPast = (day: number) => {
    const d = new Date(year, month, day)
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    return d < t
  }

  const isSelected = (day: number) =>
    day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()

  const pastDays = days.filter((d) => d !== null && isPast(d)) as number[]

  useEffect(() => {
    setRevealedCount(0)
    if (pastDays.length === 0) return
    let count = 0
    const interval = setInterval(() => {
      count++
      setRevealedCount(count)
      if (count >= pastDays.length) clearInterval(interval)
    }, 60)
    return () => clearInterval(interval)
  }, [animKey, month, year, pastDays.length])

  function getPastIndex(day: number): number {
    return pastDays.indexOf(day)
  }

  function getEventCount(day: number) {
    const dateStr = new Date(year, month, day).toISOString().split('T')[0]
    return events.filter((e) => e.date === dateStr).length
  }

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(year, month, day)
    onDateChange(clickedDate)
    onDayClick(clickedDate)
  }

  return (
    <div
      className="bg-black overflow-hidden touch-pan-y select-none w-full flex-1 flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Page turn animation wrapper */}
      <div
        className="transition-all duration-300 ease-out flex-1 flex flex-col"
        style={{
          transform:
            pageAnim === 'left'
              ? 'translateX(-100%) rotateY(15deg) scale(0.95)'
              : pageAnim === 'right'
                ? 'translateX(100%) rotateY(-15deg) scale(0.95)'
                : 'translateX(0) rotateY(0deg) scale(1)',
          opacity: pageAnim !== 'none' ? 0 : 1,
          transformOrigin: pageAnim === 'left' ? 'left center' : 'right center',
        }}
      >

      {/* Month Header */}
      <div className="flex items-center justify-between px-2 py-3 border-b border-white/20">
        <button
          onClick={prevMonth}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:bg-white/10 active:bg-white/20 transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-black text-white tracking-wider">
          {MONTHS[month]} {year}
        </h2>
        <button
          onClick={nextMonth}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:bg-white/10 active:bg-white/20 transition-all"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Day Names — grid header with white borders */}
      <div className="grid grid-cols-7 border-b border-white/30">
        {DAYS.map((day, i) => (
          <div
            key={i}
            className={`text-center text-[11px] font-bold tracking-wider py-2 ${
              i < 6 ? 'border-r border-white/15' : ''
            } text-white/50`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid — quadrillé with white borders */}
      <div className="flex-1 grid grid-cols-7" style={{ gridTemplateRows: `repeat(${totalRows}, 1fr)` }}>
        {days.map((day, i) => {
          if (day === null) {
            return (
              <div
                key={i}
                className={`border-b border-white/10 ${i % 7 < 6 ? 'border-r border-r-white/10' : ''} bg-black`}
              />
            )
          }

          const past = isPast(day)
          const todayDay = isToday(day)
          const selected = isSelected(day)
          const pastIdx = past ? getPastIndex(day) : -1
          const xRevealed = past && pastIdx < revealedCount
          const evtCount = getEventCount(day)

          return (
            <button
              key={i}
              onClick={() => handleDayClick(day)}
              className={`relative flex flex-col items-center justify-center transition-all duration-300 border-b border-white/10 ${
                i % 7 < 6 ? 'border-r border-r-white/10' : ''
              } ${
                selected
                  ? 'bg-orange-500 z-10'
                  : todayDay
                    ? 'bg-yellow-400/90 z-10'
                    : past
                      ? 'bg-black'
                      : 'bg-black hover:bg-white/[0.04] active:bg-white/[0.08]'
              }`}
            >
              {/* PAST: Full cell X mark */}
              {past && !selected && (
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{
                    opacity: xRevealed ? 1 : 0,
                    transform: xRevealed ? 'scale(1)' : 'scale(0.2)',
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                >
                  <svg width="100%" height="100%" viewBox="0 0 50 50" className="absolute inset-0">
                    <line x1="8" y1="8" x2="42" y2="42" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />
                    <line x1="42" y1="8" x2="8" y2="42" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />
                  </svg>
                </div>
              )}

              {/* TODAY: Yellow glow pulse */}
              {todayDay && !selected && (
                <div
                  className="absolute inset-0 border-2 border-yellow-300/60"
                  style={{ animation: 'todayPulse 2s ease-in-out infinite' }}
                />
              )}

              {/* Day number */}
              <span
                className={`text-lg font-bold relative z-10 transition-all duration-300 ${
                  selected
                    ? 'text-white'
                    : todayDay
                      ? 'text-black font-black text-xl'
                      : past
                        ? xRevealed ? 'text-red-500/40' : 'text-red-400/60'
                        : 'text-white'
                }`}
              >
                {day}
              </span>

              {/* Event count badge */}
              {evtCount > 0 && (
                <span
                  className={`text-[9px] font-bold mt-0.5 relative z-10 ${
                    selected
                      ? 'text-white/80'
                      : todayDay
                        ? 'text-black/50'
                        : past
                          ? 'text-red-400/30'
                          : 'text-white/40'
                  }`}
                >
                  {evtCount} évén.
                </span>
              )}
            </button>
          )
        })}
      </div>

      </div>{/* close page turn wrapper */}

      <style jsx>{`
        @keyframes todayPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}
