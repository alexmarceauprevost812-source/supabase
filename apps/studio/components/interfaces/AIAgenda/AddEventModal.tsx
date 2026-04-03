import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import { AgendaEvent, EventCategory, EventPriority } from './types'

interface AddEventModalProps {
  selectedDate: Date
  onAdd: (event: Omit<AgendaEvent, 'id'>) => void
  onClose: () => void
  prefillTime?: string
}

export function AddEventModal({ selectedDate, onAdd, onClose, prefillTime }: AddEventModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startTime, setStartTime] = useState(prefillTime || '09:00')
  const [endTime, setEndTime] = useState(() => {
    if (!prefillTime) return '10:00'
    const [h, m] = prefillTime.split(':').map(Number)
    const endH = m >= 0 ? h + 1 : h
    return `${endH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
  })
  const [category, setCategory] = useState<EventCategory>('task')
  const [priority, setPriority] = useState<EventPriority>('medium')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd({
      title,
      description,
      date: selectedDate.toISOString().split('T')[0],
      startTime,
      endTime,
      category,
      priority,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1a1a24] border border-white/[0.08] rounded-3xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <h3 className="text-base font-bold text-white">Nouvel événement</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-white/40"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">
              Titre
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nom de l'événement"
              className="w-full px-4 py-2.5 text-sm bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 outline-none focus:border-cyan-400/50 focus:shadow-[0_0_15px_rgba(34,211,238,0.1)] transition-all"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Détails..."
              rows={2}
              className="w-full px-4 py-2.5 text-sm bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 outline-none focus:border-cyan-400/50 transition-all resize-none"
            />
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">
                Début
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-white/[0.05] border border-white/[0.08] rounded-xl text-white outline-none focus:border-cyan-400/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">
                Fin
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-white/[0.05] border border-white/[0.08] rounded-xl text-white outline-none focus:border-cyan-400/50 transition-all"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">
              Catégorie
            </label>
            <div className="flex gap-2 flex-wrap">
              {([
                { value: 'meeting', label: 'Réunion', icon: '📋' },
                { value: 'task', label: 'Tâche', icon: '✅' },
                { value: 'reminder', label: 'Rappel', icon: '🔔' },
                { value: 'focus', label: 'Focus', icon: '🎯' },
                { value: 'break', label: 'Pause', icon: '☕' },
              ] as const).map(({ value, label, icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCategory(value)}
                  className={`text-xs px-3 py-2 rounded-xl border transition-all flex items-center gap-1.5 ${
                    category === value
                      ? 'bg-cyan-500/20 text-cyan-400 border-cyan-400/40'
                      : 'border-white/[0.08] text-white/40 hover:bg-white/[0.05]'
                  }`}
                >
                  <span>{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">
              Priorité
            </label>
            <div className="flex gap-2">
              {([
                { value: 'high', label: 'Haute', color: 'red' },
                { value: 'medium', label: 'Moyenne', color: 'amber' },
                { value: 'low', label: 'Basse', color: 'green' },
              ] as const).map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPriority(value)}
                  className={`flex-1 text-xs py-2.5 rounded-xl border transition-all ${
                    priority === value
                      ? 'bg-cyan-500/20 text-cyan-400 border-cyan-400/40'
                      : 'border-white/[0.08] text-white/40 hover:bg-white/[0.05]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)]"
          >
            <Plus size={16} />
            Créer
          </button>
        </form>
      </div>
    </div>
  )
}
