import { Search, UserPlus, X } from 'lucide-react'
import { useState } from 'react'
import { Contact, SocialSource } from './types'

// Sample friends data
const SAMPLE_CONTACTS: Contact[] = [
  { id: 'f1', name: 'Marie Dupont', avatar: 'MD', source: 'tilex', online: true },
  { id: 'f2', name: 'Alex Martin', avatar: 'AM', source: 'facebook', online: true },
  { id: 'f3', name: 'Sophie Bernard', avatar: 'SB', source: 'instagram', online: false },
  { id: 'f4', name: 'Lucas Petit', avatar: 'LP', source: 'tilex', online: false },
  { id: 'f5', name: 'Emma Laurent', avatar: 'EL', source: 'facebook', online: true },
  { id: 'f6', name: 'Hugo Moreau', avatar: 'HM', source: 'instagram', online: false },
  { id: 'f7', name: 'Léa Thomas', avatar: 'LT', source: 'tilex', online: true },
  { id: 'f8', name: 'Nathan Robert', avatar: 'NR', source: 'manual', online: false },
]

const SOURCE_STYLES: Record<SocialSource, { label: string; bg: string; text: string }> = {
  tilex: { label: 'ti-lex', bg: 'bg-cyan-500/20', text: 'text-cyan-400' },
  facebook: { label: 'Facebook', bg: 'bg-blue-500/20', text: 'text-blue-400' },
  instagram: { label: 'Instagram', bg: 'bg-pink-500/20', text: 'text-pink-400' },
  manual: { label: 'Manuel', bg: 'bg-white/10', text: 'text-white/50' },
}

interface FriendsPanelProps {
  onClose: () => void
  selectedFriends: string[]
  onToggleFriend: (id: string) => void
  mode: 'select' | 'browse'
}

export function FriendsPanel({ onClose, selectedFriends, onToggleFriend, mode }: FriendsPanelProps) {
  const [search, setSearch] = useState('')
  const [activeSource, setActiveSource] = useState<SocialSource | 'all'>('all')

  const filtered = SAMPLE_CONTACTS.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase())
    const matchesSource = activeSource === 'all' || c.source === activeSource
    return matchesSearch && matchesSource
  })

  const onlineCount = SAMPLE_CONTACTS.filter((c) => c.online).length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#111118] border border-white/[0.08] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div>
            <h3 className="text-sm font-bold text-white">
              {mode === 'select' ? 'Inviter des amis' : 'Contacts affiliés'}
            </h3>
            <p className="text-[10px] text-white/30 mt-0.5">
              {SAMPLE_CONTACTS.length} contacts · {onlineCount} en ligne
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center text-white/40 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2">
            <Search size={14} className="text-white/20" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un contact..."
              className="flex-1 bg-transparent text-xs text-white placeholder:text-white/20 outline-none"
            />
          </div>
        </div>

        {/* Source filter tabs */}
        <div className="px-4 pb-2 flex gap-1.5 overflow-x-auto">
          {[
            { id: 'all' as const, label: 'Tous', icon: '👥' },
            { id: 'tilex' as const, label: 'ti-lex', icon: '⚡' },
            { id: 'facebook' as const, label: 'Facebook', icon: '📘' },
            { id: 'instagram' as const, label: 'Instagram', icon: '📸' },
          ].map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActiveSource(id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-medium flex-shrink-0 transition-all ${
                activeSource === id
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30'
                  : 'bg-white/[0.04] text-white/30 border border-transparent hover:bg-white/[0.06]'
              }`}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </div>

        {/* Social connect buttons */}
        <div className="px-4 py-2 flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-600/20 border border-blue-500/20 rounded-xl text-[10px] font-medium text-blue-400 hover:bg-blue-600/30 transition-all">
            <UserPlus size={12} />
            Connecter Facebook
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-pink-600/20 border border-pink-500/20 rounded-xl text-[10px] font-medium text-pink-400 hover:bg-pink-600/30 transition-all">
            <UserPlus size={12} />
            Connecter Instagram
          </button>
        </div>

        {/* Contact list */}
        <div className="px-4 py-2 max-h-[300px] overflow-auto space-y-1">
          {filtered.length === 0 ? (
            <p className="text-center text-xs text-white/20 py-8">Aucun contact trouvé</p>
          ) : (
            filtered.map((contact) => {
              const isSelected = selectedFriends.includes(contact.id)
              const src = SOURCE_STYLES[contact.source]

              return (
                <button
                  key={contact.id}
                  onClick={() => mode === 'select' && onToggleFriend(contact.id)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all text-left ${
                    isSelected
                      ? 'bg-cyan-500/10 border border-cyan-400/20'
                      : 'hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
                      isSelected ? 'bg-cyan-500 text-black' : 'bg-white/10 text-white/50'
                    }`}>
                      {contact.avatar}
                    </div>
                    {/* Online indicator */}
                    {contact.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#111118]" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white/80 truncate">{contact.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${src.bg} ${src.text}`}>
                        {src.label}
                      </span>
                      {contact.online && (
                        <span className="text-[9px] text-emerald-400">En ligne</span>
                      )}
                    </div>
                  </div>

                  {/* Selection indicator */}
                  {mode === 'select' && (
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-cyan-500 border-cyan-400'
                        : 'border-white/20'
                    }`}>
                      {isSelected && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5L4.5 7.5L8 3" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  )}
                </button>
              )
            })
          )}
        </div>

        {/* Bottom info */}
        <div className="px-5 py-3 border-t border-white/[0.06] flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
          <p className="text-[10px] text-white/25">
            Mode privé · Contacts visibles uniquement par vous
          </p>
        </div>
      </div>
    </div>
  )
}
