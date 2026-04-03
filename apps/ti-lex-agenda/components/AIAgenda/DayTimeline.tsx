import { Clock, Plus, ZoomIn, ZoomOut } from 'lucide-react'
import { useState, useMemo } from 'react'
import { AgendaEvent } from './types'
import { EventCard } from './EventCard'

type ZoomLevel = 15 | 30 | 60

interface DayTimelineProps {
  events: AgendaEvent[]
  selectedDate: Date
  onDeleteEvent: (id: string) => void
  onAddEventAtTime: (time: string) => void
}

const ZOOM_LABELS: Record<ZoomLevel, string> = {
  15: '15 min',
  30: '30 min',
  60: '1 heure',
}

const DAYS_FR = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
const MONTHS_FR = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
]

function formatTime(hour: number, minute: number): string {
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}

export function DayTimeline({ events, selectedDate, onDeleteEvent, onAddEventAtTime }: DayTimelineProps) {
  const [zoom, setZoom] = useState<ZoomLevel>(60)

  const dateStr = selectedDate.toISOString().split('T')[0]
  const dayEvents = events.filter((e) => e.date === dateStr)
  const today = new Date()
  const isToday = dateStr === today.toISOString().split('T')[0]

  // Generate time slots based on zoom level
  const timeSlots = useMemo(() => {
    const slots: { hour: number; minute: number; label: string }[] = []
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += zoom) {
        slots.push({
          hour: h,
          minute: m,
          label: formatTime(h, m),
        })
      }
    }
    return slots
  }, [zoom])

  // Get events that start in a given slot
  function getEventsForSlot(hour: number, minute: number) {
    return dayEvents.filter((e) => {
      const [eh, em] = e.startTime.split(':').map(Number)
      if (zoom === 60) return eh === hour
      if (zoom === 30) return eh === hour && Math.floor(em / 30) === Math.floor(minute / 30)
      return eh === hour && Math.floor(em / 15) === Math.floor(minute / 15)
    })
  }

  const currentHour = today.getHours()
  const currentMinute = today.getMinutes()

  const cycleZoom = (direction: 'in' | 'out') => {
    const levels: ZoomLevel[] = [60, 30, 15]
    const idx = levels.indexOf(zoom)
    if (direction === 'in' && idx < levels.length - 1) setZoom(levels[idx + 1])
    if (direction === 'out' && idx > 0) setZoom(levels[idx - 1])
  }

  // Slot height based on zoom
  const slotHeight = zoom === 15 ? 48 : zoom === 30 ? 56 : 72

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Day Header */}
      <div className="px-5 py-3 flex items-center justify-between border-b border-white/[0.06]">
        <div>
          <h2 className="text-lg font-bold text-white">
            {isToday ? "Aujourd'hui" : DAYS_FR[selectedDate.getDay()]}
          </h2>
          <p className="text-xs text-white/40 mt-0.5">
            {selectedDate.getDate()} {MONTHS_FR[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            {' · '}{dayEvents.length} événement{dayEvents.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => cycleZoom('out')}
            disabled={zoom === 60}
            className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center text-white/40 hover:bg-white/10 hover:text-white disabled:opacity-20 transition-all"
          >
            <ZoomOut size={14} />
          </button>
          <span className="text-[11px] font-semibold text-cyan-400 min-w-[52px] text-center bg-cyan-400/10 px-2 py-1 rounded-full">
            {ZOOM_LABELS[zoom]}
          </span>
          <button
            onClick={() => cycleZoom('in')}
            disabled={zoom === 15}
            className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center text-white/40 hover:bg-white/10 hover:text-white disabled:opacity-20 transition-all"
          >
            <ZoomIn size={14} />
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-auto relative">
        {/* Current time indicator */}
        {isToday && (
          <div
            className="absolute left-0 right-0 z-20 pointer-events-none"
            style={{
              top: `${((currentHour * 60 + currentMinute) / zoom) * slotHeight}px`,
            }}
          >
            <div className="flex items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] ml-[52px]" />
              <div className="flex-1 h-[2px] bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.4)]" />
            </div>
          </div>
        )}

        {timeSlots.map(({ hour, minute, label }) => {
          const slotEvents = getEventsForSlot(hour, minute)
          const isNow = isToday && hour === currentHour && (
            zoom === 60 ||
            (zoom === 30 && Math.floor(currentMinute / 30) === Math.floor(minute / 30)) ||
            (zoom === 15 && Math.floor(currentMinute / 15) === Math.floor(minute / 15))
          )
          const isMainHour = minute === 0

          return (
            <div
              key={label}
              className={`flex group transition-colors ${
                isNow ? 'bg-cyan-500/[0.04]' : ''
              }`}
              style={{ minHeight: `${slotHeight}px` }}
            >
              {/* Time label */}
              <div className={`w-14 flex-shrink-0 pr-2 pt-1 text-right ${
                isMainHour ? 'border-t border-white/[0.08]' : ''
              }`}>
                <span className={`text-[11px] font-mono ${
                  isNow
                    ? 'text-cyan-400 font-bold'
                    : isMainHour
                      ? 'text-white/40'
                      : 'text-white/15'
                }`}>
                  {label}
                </span>
              </div>

              {/* Slot content */}
              <div className={`flex-1 px-2 py-1 border-l ${
                isMainHour ? 'border-t border-white/[0.08]' : 'border-white/[0.03]'
              } border-white/[0.06] relative`}>
                {/* Events in this slot */}
                {slotEvents.map((event) => (
                  <div key={event.id} className="mb-1">
                    <EventCard event={event} onDelete={onDeleteEvent} />
                  </div>
                ))}

                {/* Add event button - appears on hover */}
                <button
                  onClick={() => onAddEventAtTime(label)}
                  className="absolute top-1 right-2 w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-cyan-500 hover:text-black text-cyan-400 transition-all z-10"
                >
                  <Plus size={12} strokeWidth={3} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
