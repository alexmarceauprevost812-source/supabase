import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ViewMode } from './types'

interface CalendarSidebarProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

const DAYS = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di']
const MONTHS = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1 // Monday = 0
}

export function CalendarSidebar({
  selectedDate,
  onDateChange,
  viewMode,
  onViewModeChange,
}: CalendarSidebarProps) {
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

  const isSelected = (day: number) =>
    day === selectedDate.getDate() && month === selectedDate.getMonth()

  return (
    <div className="w-72 border-r border-border-default bg-surface-100 p-4 flex flex-col gap-4">
      {/* View Mode Switcher */}
      <div className="flex rounded-lg bg-surface-200 p-1 gap-1">
        {(['day', 'week', 'month'] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => onViewModeChange(mode)}
            className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium capitalize transition-all ${
              viewMode === mode
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-foreground-light hover:text-foreground hover:bg-surface-300'
            }`}
          >
            {mode === 'day' ? 'Jour' : mode === 'week' ? 'Semaine' : 'Mois'}
          </button>
        ))}
      </div>

      {/* Mini Calendar */}
      <div className="bg-surface-200 rounded-xl p-3">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={prevMonth}
            className="p-1 rounded-md hover:bg-surface-300 text-foreground-light"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-semibold text-foreground">
            {MONTHS[month]} {year}
          </span>
          <button
            onClick={nextMonth}
            className="p-1 rounded-md hover:bg-surface-300 text-foreground-light"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-0.5">
          {DAYS.map((day) => (
            <div key={day} className="text-center text-[10px] font-medium text-foreground-muted py-1">
              {day}
            </div>
          ))}
          {days.map((day, i) => (
            <button
              key={i}
              disabled={day === null}
              onClick={() => day && onDateChange(new Date(year, month, day))}
              className={`text-center text-xs py-1.5 rounded-md transition-all ${
                day === null
                  ? ''
                  : isSelected(day)
                    ? 'bg-brand-500 text-white font-bold'
                    : isToday(day)
                      ? 'bg-brand-400/20 text-brand-600 font-semibold'
                      : 'text-foreground-light hover:bg-surface-300'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Category Legend */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
          Catégories
        </h3>
        {[
          { label: 'Réunion', color: 'bg-blue-500' },
          { label: 'Tâche', color: 'bg-purple-500' },
          { label: 'Rappel', color: 'bg-amber-500' },
          { label: 'Focus', color: 'bg-emerald-500' },
          { label: 'Pause', color: 'bg-gray-400' },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
            <span className="text-xs text-foreground-light">{label}</span>
          </div>
        ))}
      </div>

      {/* AI Insight */}
      <div className="mt-auto bg-gradient-to-br from-brand-500/10 to-purple-500/10 border border-brand-500/20 rounded-xl p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">IA</span>
          </div>
          <span className="text-xs font-semibold text-foreground">Insight IA</span>
        </div>
        <p className="text-[11px] text-foreground-light leading-relaxed">
          Votre journée est bien équilibrée avec 2h de focus et des pauses régulières. Productivité
          estimée: 85%
        </p>
      </div>
    </div>
  )
}
