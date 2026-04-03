import { Clock, Globe, Lock, Sparkles, Trash2, Users } from 'lucide-react'
import { AgendaEvent, EventCategory } from './types'

const CATEGORY_STYLES: Record<EventCategory, { accent: string; bg: string; icon: string }> = {
  meeting: { accent: 'bg-blue-400', bg: 'bg-blue-400/10', icon: '📋' },
  task: { accent: 'bg-purple-400', bg: 'bg-purple-400/10', icon: '✅' },
  reminder: { accent: 'bg-amber-400', bg: 'bg-amber-400/10', icon: '🔔' },
  focus: { accent: 'bg-emerald-400', bg: 'bg-emerald-400/10', icon: '🎯' },
  break: { accent: 'bg-gray-400', bg: 'bg-gray-400/10', icon: '☕' },
}

interface EventCardProps {
  event: AgendaEvent
  onDelete: (id: string) => void
}

export function EventCard({ event, onDelete }: EventCardProps) {
  const style = CATEGORY_STYLES[event.category]

  return (
    <div className="group flex items-stretch gap-3 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] hover:border-white/[0.1] transition-all">
      {/* Color accent bar */}
      <div className={`w-1 rounded-l-2xl ${style.accent}`} />

      <div className="flex-1 py-3 pr-3 flex items-center gap-3">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-xl ${style.bg} flex items-center justify-center text-lg flex-shrink-0`}>
          {style.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-white truncate">{event.title}</h4>
            {event.aiSuggested && (
              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded-full">
                <Sparkles size={8} />
                IA
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1 text-white/40">
              <Clock size={11} />
              <span className="text-[11px]">
                {event.startTime} — {event.endTime}
              </span>
            </div>
            {/* Visibility badge */}
            <span className={`inline-flex items-center gap-0.5 text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
              event.visibility === 'private'
                ? 'text-emerald-400 bg-emerald-400/10'
                : event.visibility === 'friends'
                  ? 'text-cyan-400 bg-cyan-400/10'
                  : 'text-amber-400 bg-amber-400/10'
            }`}>
              {event.visibility === 'private' && <Lock size={7} />}
              {event.visibility === 'friends' && <Users size={7} />}
              {event.visibility === 'public' && <Globe size={7} />}
              {event.visibility === 'private' ? 'Privé' : event.visibility === 'friends' ? 'Amis' : 'Public'}
            </span>
            {/* Invited count */}
            {event.invitedFriends.length > 0 && (
              <span className="text-[8px] text-white/25">
                +{event.invitedFriends.length} invité{event.invitedFriends.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Priority dot + delete */}
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              event.priority === 'high'
                ? 'bg-red-400'
                : event.priority === 'medium'
                  ? 'bg-amber-400'
                  : 'bg-green-400'
            }`}
          />
          <button
            onClick={() => onDelete(event.id)}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/20 text-white/20 hover:text-red-400 transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
