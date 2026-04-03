import { Globe, Lock, Plus, Users, UserPlus, X } from 'lucide-react'
import { useState } from 'react'
import { FriendsPanel } from './FriendsPanel'
import { AgendaEvent, EventCategory, EventPriority, EventVisibility } from './types'

interface AddEventModalProps {
  selectedDate: Date
  onAdd: (event: Omit<AgendaEvent, 'id'>) => void
  onClose: () => void
  prefillTime?: string
  defaultVisibility?: EventVisibility
}

const VISIBILITY_OPTIONS: { value: EventVisibility; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'private', label: 'Privé', icon: <Lock size={12} />, color: 'text-emerald-400 bg-emerald-400/15 border-emerald-400/30' },
  { value: 'friends', label: 'Amis', icon: <Users size={12} />, color: 'text-cyan-400 bg-cyan-400/15 border-cyan-400/30' },
  { value: 'public', label: 'Public', icon: <Globe size={12} />, color: 'text-amber-400 bg-amber-400/15 border-amber-400/30' },
]

export function AddEventModal({ selectedDate, onAdd, onClose, prefillTime, defaultVisibility = 'private' }: AddEventModalProps) {
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
  const [visibility, setVisibility] = useState<EventVisibility>(defaultVisibility)
  const [invitedFriends, setInvitedFriends] = useState<string[]>([])
  const [showFriends, setShowFriends] = useState(false)

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
      visibility,
      invitedFriends,
    })
    onClose()
  }

  const toggleFriend = (id: string) => {
    setInvitedFriends((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    )
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div className="bg-[#1a1a24] border border-white/[0.08] rounded-3xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] sticky top-0 bg-[#1a1a24] z-10 rounded-t-3xl">
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
              <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">Titre</label>
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
              <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">Description</label>
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
                <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">Début</label>
                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-white/[0.05] border border-white/[0.08] rounded-xl text-white outline-none focus:border-cyan-400/50 transition-all" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">Fin</label>
                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-white/[0.05] border border-white/[0.08] rounded-xl text-white outline-none focus:border-cyan-400/50 transition-all" />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">Catégorie</label>
              <div className="flex gap-2 flex-wrap">
                {([
                  { value: 'meeting', label: 'Réunion', icon: '📋' },
                  { value: 'task', label: 'Tâche', icon: '✅' },
                  { value: 'reminder', label: 'Rappel', icon: '🔔' },
                  { value: 'focus', label: 'Focus', icon: '🎯' },
                  { value: 'break', label: 'Pause', icon: '☕' },
                ] as const).map(({ value, label, icon }) => (
                  <button key={value} type="button" onClick={() => setCategory(value)}
                    className={`text-xs px-3 py-2 rounded-xl border transition-all flex items-center gap-1.5 ${
                      category === value ? 'bg-cyan-500/20 text-cyan-400 border-cyan-400/40' : 'border-white/[0.08] text-white/40 hover:bg-white/[0.05]'
                    }`}>
                    <span>{icon}</span>{label}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">Priorité</label>
              <div className="flex gap-2">
                {([
                  { value: 'high', label: 'Haute' },
                  { value: 'medium', label: 'Moyenne' },
                  { value: 'low', label: 'Basse' },
                ] as const).map(({ value, label }) => (
                  <button key={value} type="button" onClick={() => setPriority(value)}
                    className={`flex-1 text-xs py-2.5 rounded-xl border transition-all ${
                      priority === value ? 'bg-cyan-500/20 text-cyan-400 border-cyan-400/40' : 'border-white/[0.08] text-white/40 hover:bg-white/[0.05]'
                    }`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* === VISIBILITY (Privacy) === */}
            <div>
              <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">
                🔒 Visibilité
              </label>
              <div className="flex gap-2">
                {VISIBILITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setVisibility(opt.value)}
                    className={`flex-1 flex items-center justify-center gap-1.5 text-xs py-2.5 rounded-xl border transition-all ${
                      visibility === opt.value ? opt.color : 'border-white/[0.08] text-white/40 hover:bg-white/[0.05]'
                    }`}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>
              {/* Privacy hint */}
              <p className="text-[9px] text-white/20 mt-1.5 flex items-center gap-1">
                <Lock size={8} />
                {visibility === 'private' && 'Seul vous pouvez voir cet événement'}
                {visibility === 'friends' && 'Vos amis affiliés peuvent voir cet événement'}
                {visibility === 'public' && '⚠️ Tout le monde peut voir cet événement'}
              </p>
            </div>

            {/* === INVITE FRIENDS === */}
            <div>
              <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">
                👥 Inviter des amis
              </label>

              {/* Invited friends chips */}
              {invitedFriends.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {invitedFriends.map((id) => (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 text-[10px] bg-cyan-500/15 text-cyan-400 border border-cyan-400/20 px-2 py-1 rounded-full"
                    >
                      Ami #{id.slice(1)}
                      <button type="button" onClick={() => toggleFriend(id)} className="hover:text-white">
                        <X size={8} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowFriends(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-white/[0.1] rounded-xl text-xs text-white/30 hover:text-white/60 hover:border-white/[0.2] hover:bg-white/[0.03] transition-all"
              >
                <UserPlus size={14} />
                {invitedFriends.length > 0
                  ? `${invitedFriends.length} invité${invitedFriends.length > 1 ? 's' : ''} · Modifier`
                  : 'Inviter depuis ti-lex, Facebook, Instagram'
                }
              </button>
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

      {/* Friends selection panel */}
      {showFriends && (
        <FriendsPanel
          onClose={() => setShowFriends(false)}
          selectedFriends={invitedFriends}
          onToggleFriend={toggleFriend}
          mode="select"
        />
      )}
    </>
  )
}
