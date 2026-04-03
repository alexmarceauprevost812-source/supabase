import { useState, useEffect } from 'react'

interface MascotPopupProps {
  onComplete: () => void
}

/**
 * Raccoon mascot with deal-with-it glasses.
 * Phase 1: Appears big center screen (1.5s)
 * Phase 2: Shrinks and slides to bottom-right with speech bubble
 * Phase 3: Speech bubble stays visible, then onComplete fires
 */
export function MascotPopup({ onComplete }: MascotPopupProps) {
  const [phase, setPhase] = useState<'big' | 'slide' | 'bubble' | 'done'>('big')

  useEffect(() => {
    // Phase 1: Big entrance (1.5s)
    const t1 = setTimeout(() => setPhase('slide'), 1500)
    // Phase 2: Slide to corner (0.8s)
    const t2 = setTimeout(() => setPhase('bubble'), 2300)
    // Phase 3: Show bubble, then fire onComplete after 1s
    const t3 = setTimeout(() => {
      setPhase('done')
      onComplete()
    }, 5000)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-[90] pointer-events-none">
      {/* Dark flash overlay for big entrance */}
      {phase === 'big' && (
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          style={{ animation: 'mascotFlash 1.5s ease-out forwards' }}
        />
      )}

      {/* Raccoon SVG */}
      <div
        className="absolute"
        style={{
          ...(phase === 'big'
            ? {
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) scale(1)',
                animation: 'mascotEntrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
              }
            : phase === 'slide'
              ? {
                  animation: 'mascotSlide 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                }
              : {
                  bottom: '100px',
                  right: '24px',
                  transform: 'scale(0.45)',
                }),
          transformOrigin: 'center center',
          transition: phase === 'bubble' || phase === 'done' ? 'none' : undefined,
        }}
      >
        <svg width="280" height="320" viewBox="0 0 280 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Body */}
          <ellipse cx="140" cy="220" rx="75" ry="90" fill="#8B7355" />
          <ellipse cx="140" cy="220" rx="55" ry="70" fill="#A89070" />

          {/* Belly lighter */}
          <ellipse cx="140" cy="240" rx="40" ry="50" fill="#C4B39A" />

          {/* Arms raised up - rock on! */}
          {/* Left arm */}
          <path d="M75 200 Q50 140 55 100" stroke="#8B7355" strokeWidth="28" strokeLinecap="round" fill="none" />
          <path d="M75 200 Q50 140 55 100" stroke="#A89070" strokeWidth="20" strokeLinecap="round" fill="none" />
          {/* Left hand - rock gesture */}
          <circle cx="55" cy="92" r="14" fill="#8B7355" />
          {/* Left fingers up */}
          <rect x="42" y="62" width="6" height="22" rx="3" fill="#8B7355" transform="rotate(-15 45 73)" />
          <rect x="60" y="60" width="6" height="24" rx="3" fill="#8B7355" transform="rotate(10 63 72)" />

          {/* Right arm */}
          <path d="M205 200 Q230 140 225 100" stroke="#8B7355" strokeWidth="28" strokeLinecap="round" fill="none" />
          <path d="M205 200 Q230 140 225 100" stroke="#A89070" strokeWidth="20" strokeLinecap="round" fill="none" />
          {/* Right hand - rock gesture */}
          <circle cx="225" cy="92" r="14" fill="#8B7355" />
          {/* Right fingers up */}
          <rect x="213" y="60" width="6" height="24" rx="3" fill="#8B7355" transform="rotate(-10 216 72)" />
          <rect x="232" y="62" width="6" height="22" rx="3" fill="#8B7355" transform="rotate(15 235 73)" />

          {/* Head */}
          <ellipse cx="140" cy="130" rx="60" ry="55" fill="#8B7355" />

          {/* Face mask (white/light fur) */}
          <ellipse cx="140" cy="135" rx="45" ry="40" fill="#D4C4A8" />

          {/* Dark eye patches (raccoon mask) */}
          <ellipse cx="112" cy="120" rx="22" ry="16" fill="#3D3020" />
          <ellipse cx="168" cy="120" rx="22" ry="16" fill="#3D3020" />

          {/* Eyes (white) */}
          <ellipse cx="112" cy="118" rx="10" ry="11" fill="white" />
          <ellipse cx="168" cy="118" rx="10" ry="11" fill="white" />

          {/* Pupils */}
          <circle cx="114" cy="117" r="5" fill="#111" />
          <circle cx="170" cy="117" r="5" fill="#111" />

          {/* Eye shine */}
          <circle cx="116" cy="114" r="2" fill="white" />
          <circle cx="172" cy="114" r="2" fill="white" />

          {/* Ears */}
          <ellipse cx="95" cy="82" rx="18" ry="22" fill="#8B7355" />
          <ellipse cx="95" cy="84" rx="12" ry="16" fill="#D4C4A8" />
          <ellipse cx="185" cy="82" rx="18" ry="22" fill="#8B7355" />
          <ellipse cx="185" cy="84" rx="12" ry="16" fill="#D4C4A8" />

          {/* Nose */}
          <ellipse cx="140" cy="140" rx="8" ry="6" fill="#1a1a1a" />

          {/* Nose stripe */}
          <line x1="140" y1="95" x2="140" y2="134" stroke="#5C4A35" strokeWidth="4" />

          {/* Mouth - big smile */}
          <path d="M125 152 Q140 165 155 152" stroke="#3D3020" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Whiskers */}
          <line x1="100" y1="142" x2="70" y2="138" stroke="#5C4A35" strokeWidth="1.5" />
          <line x1="100" y1="148" x2="72" y2="152" stroke="#5C4A35" strokeWidth="1.5" />
          <line x1="180" y1="142" x2="210" y2="138" stroke="#5C4A35" strokeWidth="1.5" />
          <line x1="180" y1="148" x2="208" y2="152" stroke="#5C4A35" strokeWidth="1.5" />

          {/* === DEAL WITH IT GLASSES === */}
          <g style={{ animation: phase === 'big' ? 'glassesDown 0.8s 0.4s ease-out both' : undefined }}>
            {/* Left lens */}
            <rect x="88" y="108" width="30" height="18" rx="1" fill="#111" />
            {/* Right lens */}
            <rect x="152" y="108" width="30" height="18" rx="1" fill="#111" />
            {/* Bridge */}
            <rect x="118" y="113" width="34" height="5" fill="#111" />
            {/* Left arm */}
            <rect x="75" y="112" width="15" height="4" fill="#111" />
            {/* Right arm */}
            <rect x="182" y="112" width="15" height="4" fill="#111" />
            {/* Pixel shine on lenses */}
            <rect x="92" y="112" width="4" height="4" fill="#444" />
            <rect x="96" y="112" width="4" height="4" fill="#666" />
            <rect x="100" y="116" width="4" height="4" fill="#444" />
            <rect x="156" y="112" width="4" height="4" fill="#444" />
            <rect x="160" y="112" width="4" height="4" fill="#666" />
            <rect x="164" y="116" width="4" height="4" fill="#444" />
          </g>

          {/* Glow effect behind (futuristic) */}
          <ellipse cx="140" cy="180" rx="90" ry="30" fill="white" opacity="0.03" />
        </svg>
      </div>

      {/* Speech bubble - appears in bubble phase */}
      {(phase === 'bubble' || phase === 'done') && (
        <div
          className="absolute pointer-events-auto"
          style={{
            bottom: '220px',
            right: '10px',
            animation: 'bubblePop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          }}
        >
          <div className="relative bg-white rounded-2xl px-5 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.3)] max-w-[220px]">
            <p className="text-sm font-bold text-gray-800 leading-relaxed">
              T'as prévu quoi ?{' '}
              <span className="inline-block" style={{ animation: 'winkEmoji 2s ease-in-out infinite' }}>
                😉
              </span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Prendre rendez-vous avec moi{' '}
              <span className="inline-block" style={{ animation: 'winkEmoji 2s ease-in-out infinite 0.5s' }}>
                😉
              </span>
              <span className="inline-block" style={{ animation: 'coolEmoji 1.5s ease-in-out infinite' }}>
                😎
              </span>
            </p>
            {/* Bubble tail */}
            <div
              className="absolute -bottom-2 right-8 w-0 h-0"
              style={{
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '10px solid white',
              }}
            />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes mascotEntrance {
          0% {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0) rotate(-20deg);
            opacity: 0;
          }
          60% {
            transform: translate(-50%, -50%) scale(1.15) rotate(5deg);
            opacity: 1;
          }
          100% {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes mascotSlide {
          0% {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            top: auto;
            bottom: 100px;
            left: auto;
            right: 24px;
            transform: translate(0, 0) scale(0.45);
          }
        }

        @keyframes mascotFlash {
          0% { opacity: 0; }
          20% { opacity: 0.7; }
          100% { opacity: 0; }
        }

        @keyframes glassesDown {
          0% {
            transform: translateY(-60px);
            opacity: 0;
          }
          70% {
            transform: translateY(3px);
            opacity: 1;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes bubblePop {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes winkEmoji {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3) rotate(10deg); }
        }

        @keyframes coolEmoji {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.2) rotate(-5deg); }
          75% { transform: scale(1.1) rotate(5deg); }
        }
      `}</style>
    </div>
  )
}
