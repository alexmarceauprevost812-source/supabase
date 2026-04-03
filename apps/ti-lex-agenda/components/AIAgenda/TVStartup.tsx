import { useEffect, useState } from 'react'

interface TVStartupProps {
  onComplete: () => void
}

/**
 * Old 80s TV turning ON effect (reverse of shutdown):
 * Phase 1 (0-0.5s): Black screen, small white dot appears center
 * Phase 2 (0.5-1.5s): Dot expands to horizontal line, then full screen with static
 * Phase 3 (1.5-2.5s): Static noise clears, ti-lex logo fades in
 * Phase 4 (2.5-3.5s): Logo pulses, then transitions to app
 */
export function TVStartup({ onComplete }: TVStartupProps) {
  const [phase, setPhase] = useState<'dot' | 'expand' | 'static' | 'logo' | 'done'>('dot')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('expand'), 500)
    const t2 = setTimeout(() => setPhase('static'), 1200)
    const t3 = setTimeout(() => setPhase('logo'), 2000)
    const t4 = setTimeout(() => {
      setPhase('done')
      onComplete()
    }, 3500)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [onComplete])

  if (phase === 'done') return null

  return (
    <div className="fixed inset-0 z-[300] bg-black overflow-hidden">
      {/* CRT screen curvature */}
      <div
        className="absolute inset-0 pointer-events-none z-50"
        style={{
          boxShadow: 'inset 0 0 100px 50px rgba(0,0,0,0.5)',
          borderRadius: '8px',
        }}
      />

      {/* Phase 1: White dot in center */}
      {phase === 'dot' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="bg-white rounded-full"
            style={{
              animation: 'tvDotAppear 0.5s ease-out forwards',
            }}
          />
        </div>
      )}

      {/* Phase 2: Expand from dot to line to full screen */}
      {phase === 'expand' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="bg-white"
            style={{
              animation: 'tvExpand 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            }}
          />
          {/* Glow effect */}
          <div
            className="absolute"
            style={{
              animation: 'tvExpandGlow 0.7s ease-out forwards',
            }}
          />
        </div>
      )}

      {/* Phase 3: Full screen static noise */}
      {phase === 'static' && (
        <div className="absolute inset-0" style={{ animation: 'tvStaticFadeIn 0.3s ease-out forwards' }}>
          {/* Static noise */}
          <div className="absolute inset-0 tv-startup-static" />

          {/* Scan lines */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)',
            }}
          />

          {/* Horizontal scan bar */}
          <div
            className="absolute left-0 right-0 h-16"
            style={{
              background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.05), transparent)',
              animation: 'tvScanDown 0.6s linear infinite',
            }}
          />

          {/* Slight green/blue tint like old CRT */}
          <div className="absolute inset-0 bg-cyan-900/10" />
        </div>
      )}

      {/* Phase 4: Logo appears through static */}
      {phase === 'logo' && (
        <div className="absolute inset-0">
          {/* Fading static */}
          <div className="absolute inset-0 tv-startup-static" style={{ animation: 'tvStaticFadeOut 1s ease-in forwards' }} />

          {/* Scan lines (lighter) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 6px)',
            }}
          />

          {/* Logo */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ animation: 'tvLogoAppear 0.8s ease-out forwards' }}
          >
            {/* Glow circle behind logo */}
            <div
              className="absolute w-48 h-48 rounded-full bg-cyan-400/10 blur-3xl"
              style={{ animation: 'tvLogoPulse 1.5s ease-in-out infinite' }}
            />

            {/* Logo icon */}
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.3)] mb-5">
              <span className="text-2xl font-black text-white">tl</span>
            </div>

            {/* Brand name */}
            <h1 className="text-4xl font-black text-white tracking-tight relative z-10">
              ti-lex
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <p className="text-sm text-cyan-400/70 font-medium tracking-[0.2em] uppercase">
                Agenda IA
              </p>
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            </div>

            {/* Produit québécois */}
            <p className="text-[10px] text-white/15 mt-6 tracking-widest uppercase">
              ⚜ Produit québécois
            </p>
          </div>

          {/* Brief screen flicker */}
          <div
            className="absolute inset-0 bg-white pointer-events-none"
            style={{ animation: 'tvFlicker 0.15s steps(2) 0.2s both' }}
          />
        </div>
      )}

      <style jsx>{`
        /* === DOT APPEAR === */
        @keyframes tvDotAppear {
          0% { width: 0; height: 0; opacity: 0; }
          50% { width: 6px; height: 6px; opacity: 1; box-shadow: 0 0 20px 10px rgba(255,255,255,0.5); }
          100% { width: 8px; height: 8px; opacity: 1; box-shadow: 0 0 30px 15px rgba(255,255,255,0.4); }
        }

        /* === EXPAND FROM DOT TO FULL === */
        @keyframes tvExpand {
          0% { width: 8px; height: 8px; border-radius: 50%; }
          30% { width: 90vw; height: 3px; border-radius: 2px; }
          60% { width: 100vw; height: 3px; border-radius: 0; }
          100% { width: 100vw; height: 100vh; border-radius: 0; }
        }

        @keyframes tvExpandGlow {
          0% { width: 20px; height: 20px; box-shadow: 0 0 30px 15px rgba(255,255,255,0.4); }
          30% { width: 92vw; height: 6px; box-shadow: 0 0 40px 20px rgba(255,255,255,0.3); }
          100% { width: 100vw; height: 100vh; box-shadow: none; }
        }

        /* === STATIC NOISE === */
        .tv-startup-static {
          background-image:
            url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 256px 256px;
          filter: contrast(250%) brightness(50%) grayscale(100%);
          animation: tvStaticJump 0.08s steps(3) infinite;
          opacity: 0.8;
        }

        @keyframes tvStaticJump {
          0% { background-position: 0 0; }
          33% { background-position: -40px -20px; }
          66% { background-position: 20px -50px; }
          100% { background-position: -30px 30px; }
        }

        @keyframes tvStaticFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes tvStaticFadeOut {
          from { opacity: 0.7; }
          to { opacity: 0; }
        }

        /* === SCAN BAR === */
        @keyframes tvScanDown {
          from { top: -64px; }
          to { top: 100%; }
        }

        /* === LOGO === */
        @keyframes tvLogoAppear {
          0% { opacity: 0; transform: scale(0.8); filter: brightness(3) blur(4px); }
          40% { opacity: 1; filter: brightness(1.5) blur(1px); }
          100% { opacity: 1; transform: scale(1); filter: brightness(1) blur(0); }
        }

        @keyframes tvLogoPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }

        /* === FLICKER === */
        @keyframes tvFlicker {
          0% { opacity: 0.3; }
          50% { opacity: 0; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
