import { Fingerprint, Hash, KeyRound, Lock, Shield, X } from 'lucide-react'
import { useState } from 'react'

export type LockMethod = 'none' | 'password' | 'pin' | 'fingerprint'

export interface SecurityConfig {
  lockEnabled: boolean
  lockMethod: LockMethod
  password: string
  pin: string
}

export const DEFAULT_SECURITY: SecurityConfig = {
  lockEnabled: false,
  lockMethod: 'none',
  password: 'Tilex',
  pin: '1234',
}

interface SecuritySettingsProps {
  config: SecurityConfig
  onUpdate: (config: SecurityConfig) => void
  onClose: () => void
}

const LOCK_OPTIONS: { value: LockMethod; label: string; desc: string; icon: React.ReactNode }[] = [
  {
    value: 'none',
    label: 'Désactivé',
    desc: 'Pas de verrouillage à l\'ouverture',
    icon: <Lock size={18} className="opacity-30" />,
  },
  {
    value: 'password',
    label: 'Mot de passe',
    desc: 'Déverrouiller avec un mot (clavier)',
    icon: <KeyRound size={18} />,
  },
  {
    value: 'pin',
    label: 'Code NIP à 4 chiffres',
    desc: 'Déverrouiller avec un code numérique',
    icon: <Hash size={18} />,
  },
  {
    value: 'fingerprint',
    label: 'Empreinte digitale',
    desc: 'Déverrouiller avec le pouce (si disponible)',
    icon: <Fingerprint size={18} />,
  },
]

export function SecuritySettings({ config, onUpdate, onClose }: SecuritySettingsProps) {
  const [local, setLocal] = useState(config)
  const [newPassword, setNewPassword] = useState(config.password)
  const [newPin, setNewPin] = useState(config.pin)
  const [showPassword, setShowPassword] = useState(false)

  const selectMethod = (method: LockMethod) => {
    setLocal((prev) => ({
      ...prev,
      lockMethod: method,
      lockEnabled: method !== 'none',
    }))
  }

  const handleSave = () => {
    onUpdate({
      ...local,
      password: newPassword || 'Tilex',
      pin: newPin || '1234',
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#111118] border border-white/[0.08] rounded-3xl w-full max-w-md shadow-2xl max-h-[85vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] sticky top-0 bg-[#111118] z-10 rounded-t-3xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <Shield size={16} className="text-cyan-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Sécurité de l'agenda</h3>
              <p className="text-[10px] text-white/30">ti-lex IA · Verrouillage</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center text-white/40 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Info */}
          <div className="flex items-start gap-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-3">
            <Lock size={14} className="text-cyan-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-cyan-300/80 leading-relaxed">
              Choisissez comment protéger votre agenda <strong>ti-lex IA</strong>.
              Le verrouillage s'active à chaque ouverture de l'application.
              Désactivez-le si vous ne voulez pas de code à l'entrée.
            </p>
          </div>

          {/* Lock method selection */}
          <div>
            <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-3">
              Méthode de verrouillage
            </label>
            <div className="space-y-2">
              {LOCK_OPTIONS.map((opt) => {
                const isActive = local.lockMethod === opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() => selectMethod(opt.value)}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${
                      isActive
                        ? opt.value === 'none'
                          ? 'bg-white/[0.06] border-white/[0.15] text-white'
                          : 'bg-cyan-500/15 border-cyan-400/30 text-cyan-400'
                        : 'border-white/[0.06] hover:bg-white/[0.03] text-white/40'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isActive && opt.value !== 'none' ? 'bg-cyan-500/20' : 'bg-white/[0.05]'
                    }`}>
                      {opt.icon}
                    </div>
                    <div className="flex-1">
                      <p className={`text-xs font-semibold ${isActive ? '' : 'text-white/50'}`}>
                        {opt.label}
                      </p>
                      <p className={`text-[10px] mt-0.5 ${isActive ? 'opacity-60' : 'text-white/20'}`}>
                        {opt.desc}
                      </p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isActive ? 'border-cyan-400' : 'border-white/15'
                    }`}>
                      {isActive && <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Password config (if password selected) */}
          {local.lockMethod === 'password' && (
            <div>
              <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Tilex"
                  className="w-full px-4 py-3 text-sm bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 outline-none focus:border-cyan-400/40 transition-all pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              <p className="text-[9px] text-white/20 mt-1.5">Première lettre en majuscule recommandée</p>
            </div>
          )}

          {/* PIN config (if PIN selected) */}
          {local.lockMethod === 'pin' && (
            <div>
              <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">
                Code NIP (4 chiffres)
              </label>
              <input
                type="text"
                value={newPin}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 4)
                  setNewPin(v)
                }}
                placeholder="1234"
                maxLength={4}
                className="w-full px-4 py-3 text-sm bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 outline-none focus:border-cyan-400/40 transition-all tracking-[0.5em] text-center text-lg font-mono"
              />
            </div>
          )}

          {/* Fingerprint info */}
          {local.lockMethod === 'fingerprint' && (
            <div className="flex items-center gap-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl p-3">
              <Fingerprint size={20} className="text-purple-400 flex-shrink-0" />
              <p className="text-[11px] text-purple-300/80 leading-relaxed">
                L'empreinte digitale utilise l'authentification biométrique de votre appareil.
                Assurez-vous que votre appareil supporte cette fonctionnalité.
              </p>
            </div>
          )}

          {/* Save */}
          <button
            onClick={handleSave}
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm rounded-2xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.15)]"
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  )
}
