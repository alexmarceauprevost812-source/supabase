import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import { AgendaEvent, EventCategory, EventPriority } from './types'

interface AddEventModalProps {
  selectedDate: Date
  onAdd: (event: Omit<AgendaEvent, 'id'>) => void
  onClose: () => void
}

export function AddEventModal({ selectedDate, onAdd, onClose }: AddEventModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface-100 border border-border-default rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-default">
          <h3 className="text-base font-semibold text-foreground">Nouvel événement</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-200 text-foreground-muted"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground-light mb-1.5">Titre</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nom de l'événement"
              className="w-full px-3 py-2 text-sm bg-surface-200 border border-border-default rounded-lg text-foreground placeholder:text-foreground-muted outline-none focus:ring-2 focus:ring-brand-500/40"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground-light mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Détails de l'événement"
              rows={2}
              className="w-full px-3 py-2 text-sm bg-surface-200 border border-border-default rounded-lg text-foreground placeholder:text-foreground-muted outline-none focus:ring-2 focus:ring-brand-500/40 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-foreground-light mb-1.5">
                Début
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-surface-200 border border-border-default rounded-lg text-foreground outline-none focus:ring-2 focus:ring-brand-500/40"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground-light mb-1.5">Fin</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-surface-200 border border-border-default rounded-lg text-foreground outline-none focus:ring-2 focus:ring-brand-500/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground-light mb-1.5">
              Catégorie
            </label>
            <div className="flex gap-2 flex-wrap">
              {(
                [
                  { value: 'meeting', label: 'Réunion', color: 'blue' },
                  { value: 'task', label: 'Tâche', color: 'purple' },
                  { value: 'reminder', label: 'Rappel', color: 'amber' },
                  { value: 'focus', label: 'Focus', color: 'emerald' },
                  { value: 'break', label: 'Pause', color: 'gray' },
                ] as const
              ).map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCategory(value)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    category === value
                      ? 'bg-brand-500 text-white border-brand-500'
                      : 'border-border-default text-foreground-light hover:bg-surface-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground-light mb-1.5">
              Priorité
            </label>
            <div className="flex gap-2">
              {(
                [
                  { value: 'high', label: 'Haute' },
                  { value: 'medium', label: 'Moyenne' },
                  { value: 'low', label: 'Basse' },
                ] as const
              ).map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPriority(value)}
                  className={`flex-1 text-xs py-1.5 rounded-lg border transition-all ${
                    priority === value
                      ? 'bg-brand-500 text-white border-brand-500'
                      : 'border-border-default text-foreground-light hover:bg-surface-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
          >
            <Plus size={16} />
            Créer l'événement
          </button>
        </form>
      </div>
    </div>
  )
}
