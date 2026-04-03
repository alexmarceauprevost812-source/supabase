import { ArrowRight, Eye, EyeOff, Mail, Lock, User, UserCircle } from 'lucide-react'
import { useState } from 'react'

type AuthMode = 'menu' | 'signup' | 'login' | 'forgot' | 'guest'

interface AuthScreenProps {
  onAuth: () => void
}

export function AuthScreen({ onAuth }: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>('menu')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) return setError('Entrez votre nom')
    if (!isValidEmail(email)) return setError('Email invalide')
    if (password.length < 6) return setError('Mot de passe: 6 caractères minimum')
    setSuccess('Compte créé ! Bienvenue ' + name.split(' ')[0])
    setTimeout(onAuth, 1200)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!isValidEmail(email)) return setError('Email invalide')
    if (!password) return setError('Entrez votre mot de passe')
    setSuccess('Connexion réussie !')
    setTimeout(onAuth, 1000)
  }

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!isValidEmail(email)) return setError('Email invalide')
    setSuccess('Lien de réinitialisation envoyé à ' + email)
    setTimeout(() => setMode('login'), 2000)
  }

  const handleGuest = () => {
    setSuccess('Mode invité activé')
    setTimeout(onAuth, 800)
  }

  // === MAIN MENU ===
  if (mode === 'menu') {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0a0f] overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-b from-cyan-500/10 to-transparent blur-3xl" />
        <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[350px] h-[350px] rounded-full bg-gradient-to-t from-purple-500/8 to-transparent blur-3xl" />

        <div
          className="relative flex flex-col items-center gap-8 w-full max-w-sm px-6"
          style={{ animation: 'authFadeIn 0.6s ease-out' }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.2)]">
              <span className="text-xl font-black text-white">tl</span>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-black text-white tracking-tight">ti-lex</h1>
              <p className="text-xs text-white/30 mt-0.5 tracking-[0.2em] uppercase">Agenda IA</p>
            </div>
          </div>

          {/* Menu buttons */}
          <div className="w-full space-y-3">
            {/* Inscription */}
            <button
              onClick={() => setMode('signup')}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm rounded-2xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]"
            >
              <Mail size={16} />
              Créer un compte
            </button>

            {/* Connexion */}
            <button
              onClick={() => setMode('login')}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-white font-semibold text-sm rounded-2xl transition-all"
            >
              <Lock size={16} />
              Connexion
            </button>

            {/* Mot de passe oublié */}
            <button
              onClick={() => setMode('forgot')}
              className="w-full text-center py-2 text-xs text-white/30 hover:text-cyan-400 transition-colors"
            >
              Mot de passe oublié ?
            </button>
          </div>

          {/* Divider */}
          <div className="w-full flex items-center gap-3">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-[10px] text-white/20 uppercase tracking-wider">ou</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Mode invité */}
          <button
            onClick={handleGuest}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 border border-dashed border-white/[0.1] hover:border-white/[0.2] hover:bg-white/[0.03] text-white/40 hover:text-white/70 font-medium text-sm rounded-2xl transition-all"
          >
            <UserCircle size={16} />
            Continuer en mode invité
          </button>

          {/* Footer */}
          <p className="text-[9px] text-white/15 text-center leading-relaxed mt-2">
            ⚜ Produit québécois · © 2026 Alex Marceau Prévost
          </p>
        </div>

        <style jsx>{`
          @keyframes authFadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    )
  }

  // === FORMS (Signup, Login, Forgot) ===
  return (
    <div className="h-screen flex items-center justify-center bg-[#0a0a0f] overflow-hidden">
      <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-b from-cyan-500/10 to-transparent blur-3xl" />

      <div
        className="relative w-full max-w-sm px-6"
        style={{ animation: 'authSlideIn 0.4s ease-out' }}
      >
        {/* Back button */}
        <button
          onClick={() => { setMode('menu'); setError(''); setSuccess('') }}
          className="mb-6 flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          ← Retour
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <span className="text-[9px] font-black text-white">tl</span>
            </div>
            <h2 className="text-lg font-bold text-white">
              {mode === 'signup' && 'Créer un compte'}
              {mode === 'login' && 'Connexion'}
              {mode === 'forgot' && 'Mot de passe oublié'}
            </h2>
          </div>
          <p className="text-xs text-white/30 mt-1">
            {mode === 'signup' && 'Rejoignez ti-lex IA pour gérer votre agenda'}
            {mode === 'login' && 'Connectez-vous à votre compte ti-lex'}
            {mode === 'forgot' && 'Entrez votre email pour réinitialiser'}
          </p>
        </div>

        <form onSubmit={mode === 'signup' ? handleSignup : mode === 'login' ? handleLogin : handleForgot} className="space-y-4">
          {/* Name (signup only) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-1.5">
                Nom complet
              </label>
              <div className="relative">
                <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Marceau"
                  className="w-full pl-10 pr-4 py-3 text-sm bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder:text-white/15 outline-none focus:border-cyan-400/40 focus:shadow-[0_0_15px_rgba(34,211,238,0.08)] transition-all"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-1.5">
              Adresse email
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@ti-lex.com"
                className="w-full pl-10 pr-4 py-3 text-sm bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder:text-white/15 outline-none focus:border-cyan-400/40 focus:shadow-[0_0_15px_rgba(34,211,238,0.08)] transition-all"
              />
            </div>
          </div>

          {/* Password (not for forgot) */}
          {mode !== 'forgot' && (
            <div>
              <label className="block text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 text-sm bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder:text-white/15 outline-none focus:border-cyan-400/40 focus:shadow-[0_0_15px_rgba(34,211,238,0.08)] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
              <span className="text-[10px] text-red-400">{error}</span>
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2">
              <span className="text-[10px] text-emerald-400">{success}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm rounded-2xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.15)]"
          >
            {mode === 'signup' && 'Créer mon compte'}
            {mode === 'login' && 'Se connecter'}
            {mode === 'forgot' && 'Envoyer le lien'}
            <ArrowRight size={14} />
          </button>
        </form>

        {/* Bottom links */}
        <div className="mt-5 text-center">
          {mode === 'signup' && (
            <p className="text-xs text-white/25">
              Déjà un compte ?{' '}
              <button onClick={() => setMode('login')} className="text-cyan-400 hover:text-cyan-300 font-medium">
                Se connecter
              </button>
            </p>
          )}
          {mode === 'login' && (
            <div className="space-y-2">
              <p className="text-xs text-white/25">
                Pas de compte ?{' '}
                <button onClick={() => setMode('signup')} className="text-cyan-400 hover:text-cyan-300 font-medium">
                  Créer un compte
                </button>
              </p>
              <button onClick={() => setMode('forgot')} className="text-[11px] text-white/20 hover:text-white/40">
                Mot de passe oublié ?
              </button>
            </div>
          )}
          {mode === 'forgot' && (
            <p className="text-xs text-white/25">
              Retour à la{' '}
              <button onClick={() => setMode('login')} className="text-cyan-400 hover:text-cyan-300 font-medium">
                connexion
              </button>
            </p>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes authSlideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
