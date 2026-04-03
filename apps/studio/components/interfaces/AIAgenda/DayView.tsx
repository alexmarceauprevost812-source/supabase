import { AgendaEvent } from './types'
import { EventCard } from './EventCard'

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7) // 7:00 - 20:00

interface DayViewProps {
  events: AgendaEvent[]
  selectedDate: Date
  onDeleteEvent: (id: string) => void
}

function formatDate(date: Date): string {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
  const months = [
    'janvier',
    'février',
    'mars',
    'avril',
    'mai',
    'juin',
    'juillet',
    'août',
    'septembre',
    'octobre',
    'novembre',
    'décembre',
  ]
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

export function DayView({ events, selectedDate, onDeleteEvent }: DayViewProps) {
  const dateStr = selectedDate.toISOString().split('T')[0]
  const dayEvents = events.filter((e) => e.date === dateStr)

  function getEventsForHour(hour: number) {
    return dayEvents.filter((e) => {
      const startHour = parseInt(e.startTime.split(':')[0])
      return startHour === hour
    })
  }

  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const isToday = dateStr === now.toISOString().split('T')[0]

  return (
    <div className="flex-1 overflow-auto">
      <div className="px-6 py-4 border-b border-border-default bg-surface-100">
        <h2 className="text-lg font-bold text-foreground">{formatDate(selectedDate)}</h2>
        <p className="text-sm text-foreground-light mt-0.5">
          {dayEvents.length} événement{dayEvents.length !== 1 ? 's' : ''} prévu
          {dayEvents.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="relative">
        {HOURS.map((hour) => {
          const hourEvents = getEventsForHour(hour)
          const isCurrentHour = isToday && hour === currentHour

          return (
            <div
              key={hour}
              className={`flex border-b border-border-default/50 min-h-[72px] ${
                isCurrentHour ? 'bg-brand-500/5' : ''
              }`}
            >
              <div className="w-16 flex-shrink-0 py-2 px-3 text-right">
                <span
                  className={`text-xs font-medium ${
                    isCurrentHour ? 'text-brand-500' : 'text-foreground-muted'
                  }`}
                >
                  {hour.toString().padStart(2, '0')}:00
                </span>
              </div>
              <div className="flex-1 py-1.5 px-2 space-y-1.5 border-l border-border-default/50">
                {hourEvents.map((event) => (
                  <EventCard key={event.id} event={event} onDelete={onDeleteEvent} />
                ))}
              </div>
            </div>
          )
        })}

        {/* Current time indicator */}
        {isToday && currentHour >= 7 && currentHour <= 20 && (
          <div
            className="absolute left-16 right-0 flex items-center pointer-events-none z-10"
            style={{
              top: `${((currentHour - 7) * 72) + (currentMinute / 60) * 72}px`,
            }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 -ml-1.5" />
            <div className="flex-1 h-0.5 bg-red-500" />
          </div>
        )}
      </div>
    </div>
  )
}
