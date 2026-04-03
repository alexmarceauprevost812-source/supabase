import { Delete, Eye, EyeOff, Fingerprint, Lock, ShieldCheck } from 'lucide-react'
import { useState, useCallback } from 'react'
import { LockMethod } from './SecuritySettings'

interface LockScreenProps {
  onUnlock: () => void
  method: LockMethod
  password: string
  pin: string
}

export function LockScreen({ onUnlock, method, password: correctPassword, pin: correctPin }: LockScreenProps) {
  const [input, setInput] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)

  const checkCode = useCallback(
    (value: string) => {
      const correct = method === 'pin' ? correctPin : correctPassword
      if (value === correct) {
        setSuccess(true)
        setTimeout(() => onUnlock(), 600)
      } else {
        setError(true)
        setTimeout(() => {
          setInput('')
          setError(false)
        }, 1000)
      }
    },
    [method, correctPassword, correctPin, onUnlock]
  )

  // Password submit
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (success || !input) return
    checkCode(input)
  }

  // PIN digit
  const handlePinDigit = (digit: string) => {
    if (success) return
    setError(false)
    const newPin = input + digit
    if (newPin.length <= 4) {
      setInput(newPin)
      if (newPin.length === 4) checkCode(newPin)
    }
  }

  // Fingerprint (simulated)
  const handleFingerprint = () => {
    setSuccess(true)
    setTimeout(() => onUnlock(), 600)
  }

  const iconColor = success
    ? 'bg-gradient-to-br from-emerald-400 to-green-500 scale-110 shadow-[0_0_40px_rgba(16,185,129,0.4)]'
    : error
      ? 'bg-gradient-to-br from-red-500 to-rose-500 shadow-[0_0_40px_rgba(239,68,68,0.3)]'
      : 'bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_40px_rgba(34,211,238,0.2)]'

  return (
    <div className="h-screen flex items-center justify-center bg-[#0a0a0f] overflow-hidden">
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-b from-cyan-500/15 to-transparent blur-3xl" />
      <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-t from-purple-500/10 to-transparent blur-3xl" />

      <div className="relative flex flex-col items-center gap-8 w-full max-w-xs px-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${iconColor}`}
            style={error ? { animation: 'shake 0.4s ease-in-out' } : undefined}
          >
            {success ? (
              <ShieldCheck size={40} className="text-white" />
            ) : method === 'fingerprint' ? (
              <Fingerprint size={40} className="text-white" />
            ) : (
              <Lock size={40} className="text-white" />
            )}
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-black tracking-tight text-white">ti-lex</h1>
            <p className="text-xs text-white/30 mt-1 tracking-[0.3em] uppercase">Agenda IA Privé</p>
          </div>
        </div>

        {/* Status */}
        <p className={`text-sm font-medium ${success ? 'text-emerald-400' : error ? 'text-red-400' : 'text-white/50'}`}>
          {success
            ? 'Bienvenue !'
            : error
              ? method === 'pin' ? 'Code incorrect' : 'Mot de passe incorrect'
              : method === 'pin'
                ? 'Entrez votre code NIP'
                : method === 'fingerprint'
                  ? 'Touchez pour déverrouiller'
                  : 'Entrez votre mot de passe'}
        </p>

        {/* === PASSWORD MODE === */}
        {method === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="w-full space-y-4">
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={input}
                onChange={(e) => { setError(false); setInput(e.target.value) }}
                placeholder="Mot de passe"
                autoFocus
                disabled={success}
                className={`w-full pl-11 pr-12 py-4 text-base bg-white/[0.05] border rounded-2xl text-white placeholder:text-white/20 outline-none transition-all disabled:opacity-50 ${
                  error ? 'border-red-500/50' : success ? 'border-emerald-400/50' : 'border-white/[0.08] focus:border-cyan-400/40'
                }`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button type="submit" disabled={success || !input}
              className={`w-full py-3.5 font-bold text-sm rounded-2xl transition-all disabled:opacity-30 ${
                success ? 'bg-emerald-500 text-white' : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.2)]'
              }`}>
              {success ? 'Déverrouillé !' : 'Déverrouiller'}
            </button>
          </form>
        )}

        {/* === PIN MODE === */}
        {method === 'pin' && (
          <>
            <div className="flex gap-5">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                  error ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
                    : success ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                    : i < input.length ? 'bg-cyan-400 scale-125 shadow-[0_0_10px_rgba(34,211,238,0.5)]'
                    : 'bg-white/10 border border-white/20'
                }`} />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {['1','2','3','4','5','6','7','8','9','','0','del'].map((key) => {
                if (key === '') return <div key="empty" />
                if (key === 'del') return (
                  <button key="del" onClick={() => { setInput((p) => p.slice(0, -1)); setError(false) }} disabled={success}
                    className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/5 transition-all disabled:opacity-30">
                    <Delete size={22} />
                  </button>
                )
                return (
                  <button key={key} onClick={() => handlePinDigit(key)} disabled={success}
                    className="w-[72px] h-[72px] rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-2xl font-light text-white hover:bg-white/10 active:bg-cyan-500/30 transition-all disabled:opacity-30">
                    {key}
                  </button>
                )
              })}
            </div>
          </>
        )}

        {/* === FINGERPRINT MODE === */}
        {method === 'fingerprint' && (
          <button
            onClick={handleFingerprint}
            disabled={success}
            className="w-24 h-24 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center hover:bg-cyan-500/20 hover:border-cyan-400/30 active:scale-95 transition-all disabled:opacity-50"
            style={{ animation: 'fingerprintPulse 2s ease-in-out infinite' }}
          >
            <Fingerprint size={40} className="text-cyan-400" />
          </button>
        )}

        {/* Bottom */}
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
        @keyframes fingerprintPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,211,238,0.2); }
          50% { box-shadow: 0 0 0 15px rgba(34,211,238,0); }
        }
      `}</style>
    </div>
  )
}
