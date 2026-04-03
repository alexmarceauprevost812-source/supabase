import { Lock, ShieldCheck, Delete, Sparkles } from 'lucide-react'
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
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-transparent to-purple-500/5" />

      <div className="relative flex flex-col items-center gap-8">
        {/* Logo */}
        <div
          className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 ${
            success
              ? 'bg-gradient-to-br from-emerald-500 to-green-500 scale-110'
              : error
                ? 'bg-gradient-to-br from-red-500 to-rose-500 animate-shake'
                : 'bg-gradient-to-br from-brand-500 to-purple-500'
          }`}
        >
          {success ? (
            <ShieldCheck size={36} className="text-white" />
          ) : (
            <Lock size={36} className="text-white" />
          )}
        </div>

        {/* Title */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles size={16} className="text-brand-500" />
            <h1 className="text-xl font-bold text-foreground">AI Agenda</h1>
            <Sparkles size={16} className="text-purple-500" />
          </div>
          <p className="text-sm text-foreground-muted">
            {success
              ? 'Déverrouillé !'
              : error
                ? 'Code incorrect, réessayez'
                : 'Entrez le code à 4 chiffres'}
          </p>
        </div>

        {/* PIN Dots */}
        <div className="flex gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                error
                  ? 'bg-red-500'
                  : success
                    ? 'bg-emerald-500'
                    : i < code.length
                      ? 'bg-brand-500 scale-110'
                      : 'bg-surface-300 border-2 border-border-default'
              }`}
            />
          ))}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((key) => {
            if (key === '') return <div key="empty" />

            if (key === 'del') {
              return (
                <button
                  key="del"
                  onClick={handleDelete}
                  disabled={success}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-foreground-muted hover:bg-surface-200 active:bg-surface-300 transition-all disabled:opacity-40"
                >
                  <Delete size={20} />
                </button>
              )
            }

            return (
              <button
                key={key}
                onClick={() => handleDigit(key)}
                disabled={success}
                className="w-16 h-16 rounded-2xl bg-surface-200 border border-border-default flex items-center justify-center text-xl font-semibold text-foreground hover:bg-surface-300 active:bg-brand-500 active:text-white active:border-brand-500 transition-all shadow-sm disabled:opacity-40"
              >
                {key}
              </button>
            )
          })}
        </div>

        {/* Hint */}
        <p className="text-[11px] text-foreground-muted/50">Mode privé activé</p>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          20%,
          60% {
            transform: translateX(-8px);
          }
          40%,
          80% {
            transform: translateX(8px);
          }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  )
}
