import { Eye, EyeOff, Globe, Lock, Shield, Users, X } from 'lucide-react'
import { useState } from 'react'
import { EventVisibility, PrivacySettings as PrivacySettingsType } from './types'

interface PrivacySettingsProps {
  settings: PrivacySettingsType
  onUpdate: (settings: PrivacySettingsType) => void
  onClose: () => void
}

const VISIBILITY_OPTIONS: { value: EventVisibility; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
  {
    value: 'private',
    label: 'Privé',
    desc: 'Seul vous pouvez voir vos événements',
    icon: <Lock size={18} />,
    color: 'text-emerald-400 bg-emerald-400/15 border-emerald-400/30',
  },
  {
    value: 'friends',
    label: 'Amis',
    desc: 'Vos amis affiliés peuvent voir vos événements',
    icon: <Users size={18} />,
    color: 'text-cyan-400 bg-cyan-400/15 border-cyan-400/30',
  },
  {
    value: 'public',
    label: 'Public',
    desc: 'Tout le monde peut voir vos événements',
    icon: <Globe size={18} />,
    color: 'text-amber-400 bg-amber-400/15 border-amber-400/30',
  },
]

export function PrivacySettingsPanel({ settings, onUpdate, onClose }: PrivacySettingsProps) {
  const [localSettings, setLocalSettings] = useState(settings)

  const updateField = <K extends keyof PrivacySettingsType>(key: K, value: PrivacySettingsType[K]) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    onUpdate(localSettings)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#111118] border border-white/[0.08] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Shield size={16} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Paramètres de confidentialité</h3>
              <p className="text-[10px] text-white/30">ti-lex IA · Mode sécurisé</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10"
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Security banner */}
          <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3">
            <Lock size={16} className="text-emerald-400 flex-shrink-0" />
            <p className="text-[11px] text-emerald-300/80 leading-relaxed">
              <strong>ti-lex IA</strong> protège votre vie privée. Tous les événements sont <strong>privés par défaut</strong>.
              Modifiez la visibilité uniquement si nécessaire.
            </p>
          </div>

          {/* Default Visibility */}
          <div>
            <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-3">
              Visibilité par défaut des événements
            </label>
            <div className="space-y-2">
              {VISIBILITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateField('defaultVisibility', opt.value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${
                    localSettings.defaultVisibility === opt.value
                      ? opt.color
                      : 'border-white/[0.06] hover:bg-white/[0.03]'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    localSettings.defaultVisibility === opt.value ? '' : 'bg-white/[0.05] text-white/30'
                  }`}>
                    {opt.icon}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${
                      localSettings.defaultVisibility === opt.value ? '' : 'text-white/60'
                    }`}>
                      {opt.label}
                    </p>
                    <p className={`text-[10px] mt-0.5 ${
                      localSettings.defaultVisibility === opt.value ? 'opacity-70' : 'text-white/25'
                    }`}>
                      {opt.desc}
                    </p>
                  </div>
                  {localSettings.defaultVisibility === opt.value && (
                    <div className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-current" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle options */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-3">
              Options de confidentialité
            </label>

            <ToggleRow
              icon={<Eye size={15} />}
              label="Statut en ligne"
              description="Les amis voient quand vous êtes actif"
              enabled={localSettings.showOnlineStatus}
              onChange={(v) => updateField('showOnlineStatus', v)}
            />

            <ToggleRow
              icon={<Users size={15} />}
              label="Demandes d'amis"
              description="Autoriser les demandes d'amis"
              enabled={localSettings.allowFriendRequests}
              onChange={(v) => updateField('allowFriendRequests', v)}
            />

            <ToggleRow
              icon={<EyeOff size={15} />}
              label="Partage calendrier"
              description="Les amis peuvent voir votre calendrier"
              enabled={localSettings.shareCalendar}
              onChange={(v) => updateField('shareCalendar', v)}
            />
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm rounded-2xl transition-all shadow-[0_0_20px_rgba(52,211,153,0.2)]"
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  )
}

function ToggleRow({
  icon,
  label,
  description,
  enabled,
  onChange,
}: {
  icon: React.ReactNode
  label: string
  description: string
  enabled: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-all text-left"
    >
      <div className="text-white/30">{icon}</div>
      <div className="flex-1">
        <p className="text-xs font-medium text-white/70">{label}</p>
        <p className="text-[10px] text-white/25">{description}</p>
      </div>
      <div className={`w-10 h-5 rounded-full transition-colors relative ${enabled ? 'bg-emerald-500' : 'bg-white/10'}`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${enabled ? 'left-[22px]' : 'left-0.5'}`} />
      </div>
    </button>
  )
}
