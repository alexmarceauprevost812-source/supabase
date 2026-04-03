import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AgendaEvent } from './types'

interface CalendarSidebarProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
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

export function CalendarSidebar({ selectedDate, onDateChange, events }: CalendarSidebarProps) {
  const year = selectedDate.getFullYear()
  const month = selectedDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const today = new Date()

  const prevMonth = () => onDateChange(new Date(year, month - 1, 1))
  const nextMonth = () => onDateChange(new Date(year, month + 1, 1))

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

  const isSelected = (day: number) =>
    day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()

  function getEventDotsForDay(day: number) {
    const dateStr = new Date(year, month, day).toISOString().split('T')[0]
    const dayEvents = events.filter((e) => e.date === dateStr)
    const categories = [...new Set(dayEvents.map((e) => e.category))]
    return categories.slice(0, 3)
  }

  return (
    <div className="bg-[#111118] rounded-2xl p-5 mx-4 mt-4">
      {/* Month Header */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={prevMonth}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-white/50 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <h2 className="text-base font-semibold text-white">
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
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map((day, i) => (
          <div key={i} className="text-center text-[11px] font-medium text-white/30 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {days.map((day, i) => {
          const dots = day ? getEventDotsForDay(day) : []
          const past = day ? isPast(day) : false
          const todayDay = day ? isToday(day) : false
          const selected = day ? isSelected(day) : false

          return (
            <button
              key={i}
              disabled={day === null}
              onClick={() => day && onDateChange(new Date(year, month, day))}
              className={`relative flex flex-col items-center py-1 rounded-xl transition-all ${
                day === null
                  ? ''
                  : selected
                    ? 'bg-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                    : todayDay
                      ? 'bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                      : past
                        ? 'opacity-40'
                        : 'hover:bg-white/[0.05]'
              }`}
            >
              {/* Past days: X mark */}
              {day !== null && past && !selected && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <svg width="20" height="20" viewBox="0 0 20 20" className="text-red-500/60">
                    <line x1="4" y1="4" x2="16" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="16" y1="4" x2="4" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              )}

              <span
                className={`text-sm leading-6 relative z-10 ${
                  day === null
                    ? ''
                    : selected
                      ? 'text-white font-bold'
                      : todayDay
                        ? 'text-black font-black'
                        : past
                          ? 'text-white/40 line-through'
                          : 'text-white/70'
                }`}
              >
                {day}
              </span>

              {/* Today: "O" ring indicator */}
              {todayDay && !selected && (
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-black bg-amber-300 z-20" />
              )}

              {dots.length > 0 && (
                <div className="flex gap-[3px] mt-0.5">
                  {dots.map((cat, j) => (
                    <div
                      key={j}
                      className={`w-[4px] h-[4px] rounded-full ${
                        selected ? 'bg-white' : todayDay ? 'bg-black/40' : CATEGORY_COLORS[cat]
                      }`}
                    />
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
