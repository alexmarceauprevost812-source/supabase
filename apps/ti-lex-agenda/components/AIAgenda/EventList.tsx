import { Calendar } from 'lucide-react'
import { AgendaEvent } from './types'
import { EventCard } from './EventCard'

const DAYS_FR = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
const MONTHS_FR = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
]

interface EventListProps {
  events: AgendaEvent[]
  selectedDate: Date
  onDeleteEvent: (id: string) => void
}

export function EventList({ events, selectedDate, onDeleteEvent }: EventListProps) {
  const dateStr = selectedDate.toISOString().split('T')[0]
  const dayEvents = events
    .filter((e) => e.date === dateStr)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  const today = new Date()
  const isToday = dateStr === today.toISOString().split('T')[0]

  return (
    <div className="flex-1 overflow-auto">
      {/* Day Header */}
      <div className="px-5 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">
            {isToday ? "Aujourd'hui" : DAYS_FR[selectedDate.getDay()]}
          </h2>
          <p className="text-xs text-white/40 mt-0.5">
            {selectedDate.getDate()} {MONTHS_FR[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            {' · '}
            {dayEvents.length} événement{dayEvents.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Events */}
      <div className="px-4 pb-24 space-y-2">
        {dayEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-white/20">
            <Calendar size={40} className="mb-3" />
            <p className="text-sm font-medium">Aucun événement</p>
            <p className="text-xs mt-1">Appuyez sur + pour ajouter</p>
          </div>
        ) : (
          dayEvents.map((event) => (
            <EventCard key={event.id} event={event} onDelete={onDeleteEvent} />
          ))
        )}
      </div>
    </div>
  )
}
