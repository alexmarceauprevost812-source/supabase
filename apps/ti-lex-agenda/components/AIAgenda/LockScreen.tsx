import { Lock, ShieldCheck, Delete } from 'lucide-react'
import { useState, useCallback } from 'react'

const UNLOCK_CODE = '1234'

interface LockScreenProps {
  onUnlock: () => void
}

export function LockScreen({ onUnlock }: LockScreenProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleDigit = useCallback(
    (digit: string) => {
      if (success) return
      setError(false)

      const newCode = code + digit
      if (newCode.length <= 4) {
        setCode(newCode)

        if (newCode.length === 4) {
          if (newCode === UNLOCK_CODE) {
            setSuccess(true)
            setTimeout(() => onUnlock(), 600)
          } else {
            setError(true)
            setTimeout(() => {
              setCode('')
              setError(false)
            }, 800)
          }
        }
      }
    },
    [code, success, onUnlock]
  )

  const handleDelete = useCallback(() => {
    setCode((prev) => prev.slice(0, -1))
    setError(false)
  }, [])

  return (
    <div className="h-screen flex items-center justify-center bg-[#0a0a0f] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-b from-cyan-500/15 to-transparent blur-3xl" />
      <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-t from-purple-500/10 to-transparent blur-3xl" />

      <div className="relative flex flex-col items-center gap-10">
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
            <h1 className="text-3xl font-black tracking-tight text-white">
              ti-lex
            </h1>
            <p className="text-xs text-white/30 mt-1 tracking-[0.3em] uppercase">
              Agenda IA Privé
            </p>
          </div>
        </div>

        {/* Status text */}
        <p className={`text-sm font-medium ${
          success ? 'text-emerald-400' : error ? 'text-red-400' : 'text-white/50'
        }`}>
          {success
            ? 'Bienvenue !'
            : error
              ? 'Code incorrect'
              : 'Entrez votre code PIN'}
        </p>

        {/* PIN Dots */}
        <div className="flex gap-5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                error
                  ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
                  : success
                    ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                    : i < code.length
                      ? 'bg-cyan-400 scale-125 shadow-[0_0_10px_rgba(34,211,238,0.5)]'
                      : 'bg-white/10 border border-white/20'
              }`}
            />
          ))}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((key) => {
            if (key === '') return <div key="empty" />

            if (key === 'del') {
              return (
                <button
                  key="del"
                  onClick={handleDelete}
                  disabled={success}
                  className="w-18 h-18 w-[72px] h-[72px] rounded-full flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/5 active:bg-white/10 transition-all disabled:opacity-30"
                >
                  <Delete size={22} />
                </button>
              )
            }

            return (
              <button
                key={key}
                onClick={() => handleDigit(key)}
                disabled={success}
                className="w-[72px] h-[72px] rounded-full bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] flex items-center justify-center text-2xl font-light text-white hover:bg-white/10 active:bg-cyan-500/30 active:border-cyan-400/50 active:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all disabled:opacity-30"
              >
                {key}
              </button>
            )
          })}
        </div>

        {/* Bottom label */}
        <div className="flex items-center gap-2 mt-4">
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
