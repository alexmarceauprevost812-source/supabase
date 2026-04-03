import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState, useCallback, useRef } from 'react'
import { AgendaEvent } from './types'

interface CalendarSidebarProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
  onDayClick: (date: Date) => void
  events: AgendaEvent[]
}

const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]

const CATEGORY_COLORS: Record<string, string> = {
  meeting: 'bg-blue-400',
  task: 'bg-purple-400',
  reminder: 'bg-amber-400',
  focus: 'bg-emerald-400',
  break: 'bg-gray-400',
}

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

  // Animated X cascade: track which past days have been "revealed"
  const [revealedCount, setRevealedCount] = useState(0)
  const [animKey, setAnimKey] = useState(0)

  // Page turn animation state
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

  // Touch swipe handlers for page-turn effect
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchDragging.current = true
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchDragging.current) return
    touchDragging.current = false
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextMonth() // swipe left → next month
      else prevMonth() // swipe right → prev month
    }
  }, [nextMonth, prevMonth])

  const days: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  const isPast = (day: number) => {
    const d = new Date(year, month, day)
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    return d < t
  }

  const isFuture = (day: number) => {
    const d = new Date(year, month, day)
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    return d > t
  }

  const isSelected = (day: number) =>
    day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()

  // Count past days for cascade animation
  const pastDays = days.filter((d) => d !== null && isPast(d))
  const pastDayNumbers = pastDays as number[]

  // Cascade animation: reveal X marks one by one
  useEffect(() => {
    setRevealedCount(0)
    if (pastDayNumbers.length === 0) return

    let count = 0
    const interval = setInterval(() => {
      count++
      setRevealedCount(count)
      if (count >= pastDayNumbers.length) clearInterval(interval)
    }, 60) // 60ms between each X appearing

    return () => clearInterval(interval)
  }, [animKey, month, year, pastDayNumbers.length])

  function getPastIndex(day: number): number {
    return pastDayNumbers.indexOf(day)
  }

  function getEventDotsForDay(day: number) {
    const dateStr = new Date(year, month, day).toISOString().split('T')[0]
    const dayEvents = events.filter((e) => e.date === dateStr)
    const categories = [...new Set(dayEvents.map((e) => e.category))]
    return categories.slice(0, 3)
  }

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(year, month, day)
    onDateChange(clickedDate)
    onDayClick(clickedDate)
  }

  return (
    <div
      className="bg-[#111118] rounded-none px-4 py-3 overflow-hidden touch-pan-y select-none w-full flex-1 flex flex-col"
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
          perspective: '800px',
        }}
      >
      {/* Month Header */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={prevMonth}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-white/50 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <h2 className="text-xl font-bold text-white">
          {MONTHS[month]} {year}
        </h2>
        <button
          onClick={nextMonth}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-white/50 transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7">
        {DAYS.map((day, i) => (
          <div key={i} className="text-center text-sm font-semibold text-white/40 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 flex-1 content-stretch">
        {days.map((day, i) => {
          if (day === null) return <div key={i} />

          const dots = getEventDotsForDay(day)
          const past = isPast(day)
          const todayDay = isToday(day)
          const future = isFuture(day)
          const selected = isSelected(day)
          const pastIdx = past ? getPastIndex(day) : -1
          const xRevealed = past && pastIdx < revealedCount

          return (
            <button
              key={i}
              onClick={() => handleDayClick(day)}
              className={`relative flex flex-col items-center justify-center rounded-xl transition-all duration-300 ${
                selected
                  ? 'bg-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.3)] scale-110 z-10'
                  : todayDay
                    ? 'z-10'
                    : future
                      ? 'hover:bg-white/[0.06] hover:scale-105'
                      : ''
              }`}
            >
              {/* TODAY: Yellow glow effect */}
              {todayDay && !selected && (
                <>
                  <div className="absolute inset-0 rounded-xl bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.5),0_0_40px_rgba(251,191,36,0.2)]" />
                  <div
                    className="absolute inset-[-3px] rounded-2xl border-2 border-amber-400/40"
                    style={{ animation: 'todayPulse 2s ease-in-out infinite' }}
                  />
                </>
              )}

              {/* PAST: Animated X mark (small to big cascade) */}
              {past && !selected && (
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{
                    opacity: xRevealed ? 1 : 0,
                    transform: xRevealed ? 'scale(1)' : 'scale(0.2)',
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <line
                      x1="5" y1="5" x2="19" y2="19"
                      stroke="#ef4444"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeOpacity="0.7"
                    />
                    <line
                      x1="19" y1="5" x2="5" y2="19"
                      stroke="#ef4444"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeOpacity="0.7"
                    />
                  </svg>
                </div>
              )}

              {/* Day number */}
              <span
                className={`text-lg leading-7 relative z-10 transition-all duration-300 ${
                  selected
                    ? 'text-white font-bold'
                    : todayDay
                      ? 'text-black font-black'
                      : past
                        ? xRevealed
                          ? 'text-white/20'
                          : 'text-white/50'
                        : 'text-white/80'
                }`}
              >
                {day}
              </span>

              {/* Event dots */}
              {dots.length > 0 && (
                <div className="flex gap-[3px] mt-0.5 relative z-10">
                  {dots.map((cat, j) => (
                    <div
                      key={j}
                      className={`w-[6px] h-[6px] rounded-full ${
                        selected
                          ? 'bg-white'
                          : todayDay
                            ? 'bg-black/50'
                            : past
                              ? 'bg-white/20'
                              : CATEGORY_COLORS[cat]
                      }`}
                    />
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>
      </div>{/* close page turn animation wrapper */}

      <style jsx>{`
        @keyframes todayPulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.08);
          }
        }
      `}</style>
    </div>
  )
}
