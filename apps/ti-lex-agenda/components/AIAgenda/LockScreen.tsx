import { Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react'
import { useState, useCallback } from 'react'

const UNLOCK_PASSWORD = 'Tilex'

interface LockScreenProps {
  onUnlock: () => void
}

export function LockScreen({ onUnlock }: LockScreenProps) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (success || !password) return
      setError(false)

      if (password === UNLOCK_PASSWORD) {
        setSuccess(true)
        setTimeout(() => onUnlock(), 600)
      } else {
        setError(true)
        setTimeout(() => {
          setPassword('')
          setError(false)
        }, 1200)
      }
    },
    [password, success, onUnlock]
  )

  return (
    <div className="h-screen flex items-center justify-center bg-[#0a0a0f] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-b from-cyan-500/15 to-transparent blur-3xl" />
      <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-t from-purple-500/10 to-transparent blur-3xl" />

      <div className="relative flex flex-col items-center gap-8 w-full max-w-xs px-6">
        {/* Logo + Brand */}
        <div className="flex flex-col items-center gap-4">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${
              success
                ? 'bg-gradient-to-br from-emerald-400 to-green-500 scale-110 shadow-[0_0_40px_rgba(16,185,129,0.4)]'
                : error
                  ? 'bg-gradient-to-br from-red-500 to-rose-500 shadow-[0_0_40px_rgba(239,68,68,0.3)]'
                  : 'bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_40px_rgba(34,211,238,0.2)]'
            }`}
            style={error ? { animation: 'shake 0.4s ease-in-out' } : undefined}
          >
            {success ? (
              <ShieldCheck size={40} className="text-white" />
            ) : (
              <Lock size={40} className="text-white" />
            )}
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-black tracking-tight text-white">ti-lex</h1>
            <p className="text-xs text-white/30 mt-1 tracking-[0.3em] uppercase">
              Agenda IA Privé
            </p>
          </div>
        </div>

        {/* Status text */}
        <p
          className={`text-sm font-medium ${
            success ? 'text-emerald-400' : error ? 'text-red-400' : 'text-white/50'
          }`}
        >
          {success
            ? 'Bienvenue !'
            : error
              ? 'Mot de passe incorrect'
              : 'Entrez votre mot de passe'}
        </p>

        {/* Password input */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
            />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setError(false)
                setPassword(e.target.value)
              }}
              placeholder="Mot de passe"
              autoFocus
              disabled={success}
              className={`w-full pl-11 pr-12 py-4 text-base bg-white/[0.05] border rounded-2xl text-white placeholder:text-white/20 outline-none transition-all disabled:opacity-50 ${
                error
                  ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                  : success
                    ? 'border-emerald-400/50 shadow-[0_0_15px_rgba(52,211,153,0.15)]'
                    : 'border-white/[0.08] focus:border-cyan-400/40 focus:shadow-[0_0_20px_rgba(34,211,238,0.1)]'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={success || !password}
            className={`w-full py-3.5 font-bold text-sm rounded-2xl transition-all disabled:opacity-30 ${
              success
                ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(52,211,153,0.3)]'
                : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]'
            }`}
          >
            {success ? 'Déverrouillé !' : 'Déverrouiller'}
          </button>
        </form>

        {/* Hint */}
        <p className="text-[10px] text-white/15 text-center leading-relaxed">
          Première lettre en majuscule
        </p>

        {/* Bottom label */}
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <p className="text-[10px] text-white/20 tracking-widest uppercase">Mode privé</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-10px); }
          40%, 80% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  )
}
