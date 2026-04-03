import { useEffect, useState } from 'react'

interface TVShutdownProps {
  onComplete: () => void
}

/**
 * Old 80s TV shutdown effect:
 * Phase 1 (0-1.5s): Static noise / snow on black & white screen
 * Phase 2 (1.5-2s): Screen shrinks to horizontal line then dot, then off
 */
export function TVShutdown({ onComplete }: TVShutdownProps) {
  const [phase, setPhase] = useState<'static' | 'shrink' | 'done'>('static')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('shrink'), 1500)
    const t2 = setTimeout(() => {
      setPhase('done')
      onComplete()
    }, 2000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [onComplete])

  if (phase === 'done') return null

  return (
    <div className="fixed inset-0 z-[200] bg-black">
      {/* Static noise phase */}
      {phase === 'static' && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Canvas-like static noise using CSS */}
          <div className="absolute inset-0 tv-static" />

          {/* Scan lines overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
            }}
          />

          {/* Horizontal scan bar moving down */}
          <div
            className="absolute left-0 right-0 h-12 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.06), transparent)',
              animation: 'tvScanBar 0.8s linear infinite',
            }}
          />

          {/* VHS tracking lines */}
          <div
            className="absolute left-0 right-0 h-3"
            style={{
              background: 'rgba(255,255,255,0.1)',
              animation: 'tvTrackingLine 0.3s steps(1) infinite',
            }}
          />

          {/* Screen flicker */}
          <div
            className="absolute inset-0"
            style={{
              animation: 'tvFlicker 0.1s steps(2) infinite',
              background: 'rgba(255,255,255,0.02)',
            }}
          />

          {/* Slight rounded screen edges (CRT effect) */}
          <div
            className="absolute inset-0"
            style={{
              boxShadow: 'inset 0 0 80px 40px rgba(0,0,0,0.6)',
            }}
          />

          {/* Brief white flash at start */}
          <div
            className="absolute inset-0 bg-white"
            style={{ animation: 'tvInitFlash 0.15s ease-out forwards' }}
          />
        </div>
      )}

      {/* Shrink phase - screen collapses to line then dot */}
      {phase === 'shrink' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* The shrinking screen */}
          <div
            className="bg-white/80 rounded-sm"
            style={{
              animation: 'tvShrink 0.5s cubic-bezier(0.4, 0, 1, 1) forwards',
            }}
          />

          {/* Glow around the shrinking line */}
          <div
            className="absolute"
            style={{
              animation: 'tvGlow 0.5s ease-out forwards',
            }}
          />
        </div>
      )}

      <style jsx>{`
        /* === STATIC NOISE === */
        .tv-static {
          background-image:
            url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 256px 256px;
          filter: contrast(300%) brightness(60%) grayscale(100%);
          animation: tvStaticMove 0.1s steps(4) infinite;
          opacity: 0.7;
        }

        @keyframes tvStaticMove {
          0% { background-position: 0 0; }
          25% { background-position: -50px -30px; }
          50% { background-position: 30px -60px; }
          75% { background-position: -20px 40px; }
          100% { background-position: 60px -10px; }
        }

        /* === SCAN BAR === */
        @keyframes tvScanBar {
          from { top: -48px; }
          to { top: 100%; }
        }

        /* === TRACKING LINE === */
        @keyframes tvTrackingLine {
          0% { top: 10%; }
          10% { top: 30%; }
          20% { top: 55%; }
          30% { top: 15%; }
          40% { top: 70%; }
          50% { top: 40%; }
          60% { top: 80%; }
          70% { top: 25%; }
          80% { top: 60%; }
          90% { top: 45%; }
          100% { top: 10%; }
        }

        /* === FLICKER === */
        @keyframes tvFlicker {
          0% { opacity: 0.02; }
          50% { opacity: 0.05; }
          100% { opacity: 0.02; }
        }

        /* === INITIAL FLASH === */
        @keyframes tvInitFlash {
          0% { opacity: 0.6; }
          100% { opacity: 0; }
        }

        /* === SHRINK TO LINE TO DOT === */
        @keyframes tvShrink {
          0% {
            width: 100vw;
            height: 100vh;
            border-radius: 0;
            opacity: 1;
          }
          40% {
            width: 100vw;
            height: 3px;
            border-radius: 2px;
            opacity: 1;
          }
          70% {
            width: 60vw;
            height: 2px;
            border-radius: 1px;
            opacity: 0.9;
          }
          90% {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            opacity: 1;
          }
          100% {
            width: 0px;
            height: 0px;
            border-radius: 50%;
            opacity: 0;
          }
        }

        /* === GLOW === */
        @keyframes tvGlow {
          0% {
            width: 100vw;
            height: 4px;
            box-shadow: 0 0 40px 20px rgba(255,255,255,0.3);
          }
          50% {
            width: 60vw;
            height: 2px;
            box-shadow: 0 0 30px 15px rgba(255,255,255,0.2);
          }
          90% {
            width: 10px;
            height: 10px;
            box-shadow: 0 0 20px 10px rgba(255,255,255,0.4);
          }
          100% {
            width: 0px;
            height: 0px;
            box-shadow: none;
          }
        }
      `}</style>
    </div>
  )
}
