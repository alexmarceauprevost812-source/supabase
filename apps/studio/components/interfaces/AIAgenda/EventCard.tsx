import { Clock, Sparkles, Trash2 } from 'lucide-react'
import { AgendaEvent, EventCategory } from './types'

const CATEGORY_STYLES: Record<EventCategory, { bg: string; border: string; dot: string }> = {
  meeting: {
    bg: 'bg-blue-500/10',
    border: 'border-l-blue-500',
    dot: 'bg-blue-500',
  },
  task: {
    bg: 'bg-purple-500/10',
    border: 'border-l-purple-500',
    dot: 'bg-purple-500',
  },
  reminder: {
    bg: 'bg-amber-500/10',
    border: 'border-l-amber-500',
    dot: 'bg-amber-500',
  },
  focus: {
    bg: 'bg-emerald-500/10',
    border: 'border-l-emerald-500',
    dot: 'bg-emerald-500',
  },
  break: {
    bg: 'bg-gray-400/10',
    border: 'border-l-gray-400',
    dot: 'bg-gray-400',
  },
}

const PRIORITY_BADGE: Record<string, string> = {
  high: 'bg-red-500/15 text-red-600',
  medium: 'bg-amber-500/15 text-amber-600',
  low: 'bg-green-500/15 text-green-600',
}

interface EventCardProps {
  event: AgendaEvent
  onDelete: (id: string) => void
}

export function EventCard({ event, onDelete }: EventCardProps) {
  const style = CATEGORY_STYLES[event.category]

  return (
    <div
      className={`group relative rounded-lg border-l-4 ${style.border} ${style.bg} p-3 transition-all hover:shadow-md hover:scale-[1.01]`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {event.aiSuggested && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-brand-600 bg-brand-500/15 px-1.5 py-0.5 rounded-full">
                <Sparkles size={10} />
                IA
              </span>
            )}
            <span
              className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${PRIORITY_BADGE[event.priority]}`}
            >
              {event.priority === 'high'
                ? 'Haute'
                : event.priority === 'medium'
                  ? 'Moyenne'
                  : 'Basse'}
            </span>
          </div>
          <h4 className="text-sm font-semibold text-foreground truncate">{event.title}</h4>
          <p className="text-xs text-foreground-light mt-0.5 line-clamp-1">{event.description}</p>
          <div className="flex items-center gap-1 mt-2 text-foreground-muted">
            <Clock size={12} />
            <span className="text-[11px]">
              {event.startTime} - {event.endTime}
            </span>
          </div>
        </div>
        <button
          onClick={() => onDelete(event.id)}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-destructive-300/20 text-foreground-muted hover:text-destructive-500 transition-all"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
