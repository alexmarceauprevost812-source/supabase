import { useEffect, useState, useMemo } from 'react'
import { EffectType, EFFECT_CONFIGS } from './wordEffects'

interface ScreenEffectProps {
  effectType: EffectType
  onComplete: () => void
}

interface Particle {
  id: number
  x: number
  y: number
  size: number
  color: string
  delay: number
  duration: number
  rotation: number
  // type-specific
  drift?: number
  wobble?: number
}

function generateParticles(type: EffectType, count: number): Particle[] {
  const config = EFFECT_CONFIGS[type]
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: type === 'snow' ? -10 - Math.random() * 20 : type === 'balloons' ? 110 + Math.random() * 20 : Math.random() * 100,
    size: 12 + Math.random() * 24,
    color: config.colors[Math.floor(Math.random() * config.colors.length)],
    delay: Math.random() * 1.2,
    duration: 1.5 + Math.random() * 1.5,
    rotation: Math.random() * 360,
    drift: (Math.random() - 0.5) * 40,
    wobble: Math.random() * 20,
  }))
}

export function ScreenEffect({ effectType, onComplete }: ScreenEffectProps) {
  const [visible, setVisible] = useState(true)
  const particles = useMemo(() => {
    const count = effectType === 'fireworks' ? 40 : effectType === 'snow' ? 50 : 30
    return generateParticles(effectType, count)
  }, [effectType])

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onComplete, 300)
    }, 2500)
    return () => clearTimeout(timer)
  }, [onComplete])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[80] pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            animationFillMode: 'both',
            animationTimingFunction: effectType === 'snow' ? 'linear' : 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            animation: `${getAnimationName(effectType)} ${p.duration}s ${p.delay}s both`,
          }}
        >
          {renderParticle(effectType, p)}
        </div>
      ))}

      {/* Central text flash */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ animation: 'effectTextFlash 0.8s ease-out both' }}
      >
        <span className="text-6xl" style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))' }}>
          {EFFECT_CONFIGS[effectType].emoji}
        </span>
      </div>

      <style jsx>{`
        @keyframes effectBalloonRise {
          0% { transform: translateY(0) translateX(0) scale(0.3); opacity: 0; }
          10% { opacity: 1; transform: translateY(-10vh) scale(1); }
          100% { transform: translateY(-120vh) translateX(${30}px) scale(0.8); opacity: 0.6; }
        }

        @keyframes effectConfettiFall {
          0% { transform: translateY(-20px) rotate(0deg) scale(0); opacity: 0; }
          15% { opacity: 1; transform: translateY(0) scale(1); }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }

        @keyframes effectFirework {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          20% { transform: scale(1.5) rotate(180deg); opacity: 1; }
          50% { transform: scale(1) rotate(360deg); opacity: 0.8; }
          100% { transform: scale(0) rotate(540deg); opacity: 0; }
        }

        @keyframes effectHeartFloat {
          0% { transform: translateY(20vh) scale(0) rotate(-20deg); opacity: 0; }
          20% { opacity: 1; transform: translateY(10vh) scale(1.2) rotate(0deg); }
          60% { transform: translateY(-30vh) scale(1) rotate(15deg); opacity: 0.8; }
          100% { transform: translateY(-80vh) scale(0.6) rotate(-10deg); opacity: 0; }
        }

        @keyframes effectStarTwinkle {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          30% { transform: scale(1.3) rotate(180deg); opacity: 1; }
          60% { transform: scale(0.8) rotate(360deg); opacity: 0.6; }
          100% { transform: scale(0) rotate(540deg); opacity: 0; }
        }

        @keyframes effectSnowFall {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          100% { transform: translateY(110vh) translateX(30px) rotate(360deg); opacity: 0.2; }
        }

        @keyframes effectTextFlash {
          0% { transform: scale(0); opacity: 0; }
          40% { transform: scale(1.5); opacity: 1; }
          70% { transform: scale(1.2); opacity: 0.8; }
          100% { transform: scale(3); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

function getAnimationName(type: EffectType): string {
  switch (type) {
    case 'balloons': return 'effectBalloonRise'
    case 'confetti': return 'effectConfettiFall'
    case 'fireworks': return 'effectFirework'
    case 'hearts': return 'effectHeartFloat'
    case 'stars': return 'effectStarTwinkle'
    case 'snow': return 'effectSnowFall'
  }
}

function renderParticle(type: EffectType, p: Particle) {
  const s = p.size

  switch (type) {
    case 'balloons':
      return (
        <svg width={s} height={s * 1.3} viewBox="0 0 30 40">
          <ellipse cx="15" cy="15" rx="12" ry="15" fill={p.color} />
          <ellipse cx="15" cy="15" rx="12" ry="15" fill="white" opacity="0.15" />
          <ellipse cx="11" cy="10" rx="3" ry="4" fill="white" opacity="0.3" transform="rotate(-20 11 10)" />
          <path d="M15 30 Q14 35 13 40 M15 30 Q16 35 17 40" stroke={p.color} strokeWidth="0.8" fill="none" />
        </svg>
      )

    case 'confetti':
      const shapes = ['rect', 'circle', 'strip']
      const shape = shapes[p.id % 3]
      if (shape === 'circle') {
        return <div style={{ width: s * 0.4, height: s * 0.4, borderRadius: '50%', backgroundColor: p.color }} />
      }
      if (shape === 'strip') {
        return <div style={{ width: s * 0.15, height: s * 0.6, backgroundColor: p.color, borderRadius: 2, transform: `rotate(${p.rotation}deg)` }} />
      }
      return <div style={{ width: s * 0.4, height: s * 0.3, backgroundColor: p.color, borderRadius: 1, transform: `rotate(${p.rotation}deg)` }} />

    case 'fireworks':
      return (
        <svg width={s} height={s} viewBox="0 0 30 30">
          <circle cx="15" cy="15" r="4" fill={p.color} />
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <line
              key={deg}
              x1="15" y1="15"
              x2={15 + Math.cos(deg * Math.PI / 180) * 12}
              y2={15 + Math.sin(deg * Math.PI / 180) * 12}
              stroke={p.color} strokeWidth="2" strokeLinecap="round"
            />
          ))}
        </svg>
      )

    case 'hearts':
      return (
        <svg width={s} height={s} viewBox="0 0 30 30">
          <path d="M15 25 C5 18 0 10 5 5 C10 0 15 5 15 10 C15 5 20 0 25 5 C30 10 25 18 15 25Z" fill={p.color} />
        </svg>
      )

    case 'stars':
      return (
        <svg width={s} height={s} viewBox="0 0 30 30">
          <path d="M15 2L17.5 11L27 11L19.5 17L22 27L15 21L8 27L10.5 17L3 11L12.5 11Z" fill={p.color} />
        </svg>
      )

    case 'snow':
      return (
        <svg width={s * 0.6} height={s * 0.6} viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="4" fill={p.color} opacity="0.8" />
          {[0, 60, 120].map((deg) => (
            <g key={deg}>
              <line
                x1="10" y1="10"
                x2={10 + Math.cos(deg * Math.PI / 180) * 8}
                y2={10 + Math.sin(deg * Math.PI / 180) * 8}
                stroke={p.color} strokeWidth="1" opacity="0.5"
              />
              <line
                x1="10" y1="10"
                x2={10 + Math.cos((deg + 180) * Math.PI / 180) * 8}
                y2={10 + Math.sin((deg + 180) * Math.PI / 180) * 8}
                stroke={p.color} strokeWidth="1" opacity="0.5"
              />
            </g>
          ))}
        </svg>
      )
  }
}
