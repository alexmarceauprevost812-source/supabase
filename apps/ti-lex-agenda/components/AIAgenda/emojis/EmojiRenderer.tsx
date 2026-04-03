/**
 * SVG Emoji Renderer - renders emojis in 3 visual styles:
 * - win98 (pixel art, chunky, retro colors)
 * - win8 (flat, clean, Metro colors)
 * - future2026 (glowing, gradient, animated)
 */

interface EmojiRendererProps {
  emojiId: string
  style: 'retro' | 'flat' | 'futuristic'
  size?: number
  animated?: boolean
}

// Color palettes per style
const PALETTES = {
  retro: {
    primary: '#000080',
    secondary: '#c0c0c0',
    accent: '#ff0000',
    bg: '#c0c0c0',
    stroke: '#000000',
    yellow: '#ffff00',
    green: '#008000',
    blue: '#0000ff',
  },
  flat: {
    primary: '#2d89ef',
    secondary: '#603cba',
    accent: '#e3a21a',
    bg: '#00a300',
    stroke: '#2d2d2d',
    yellow: '#ffc40d',
    green: '#00a300',
    blue: '#2d89ef',
  },
  futuristic: {
    primary: '#22d3ee',
    secondary: '#a855f7',
    accent: '#f59e0b',
    bg: '#111118',
    stroke: '#22d3ee',
    yellow: '#fbbf24',
    green: '#34d399',
    blue: '#60a5fa',
  },
}

export function EmojiRenderer({ emojiId, style, size = 32, animated = true }: EmojiRendererProps) {
  const p = PALETTES[style]
  const isRetro = style === 'retro'
  const isFuture = style === 'futuristic'
  const sw = isRetro ? 2.5 : isFuture ? 1.5 : 2

  // Animation wrapper
  const animClass = animated ? getAnimationClass(emojiId) : ''
  const animStyle = animated ? getAnimationStyle(emojiId) : {}

  return (
    <div className={`inline-flex items-center justify-center ${animClass}`} style={{ width: size, height: size, ...animStyle }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        style={{
          imageRendering: isRetro ? 'pixelated' : 'auto',
          filter: isFuture ? `drop-shadow(0 0 3px ${p.primary}50)` : 'none',
        }}
      >
        {renderEmoji(emojiId, p, sw, isRetro, isFuture)}
      </svg>
    </div>
  )
}

function getAnimationClass(id: string): string {
  switch (id) {
    case 'arrow-rotate':
    case 'gear':
      return 'emoji-spin'
    case 'arrow-bounce':
    case 'rocket':
      return 'emoji-bounce'
    case 'bell':
      return 'emoji-swing'
    case 'heart':
      return 'emoji-pulse'
    case 'star':
    case 'sparkle':
      return 'emoji-twinkle'
    case 'fire':
      return 'emoji-flicker'
    case 'warning':
      return 'emoji-blink'
    case 'check':
      return 'emoji-pop'
    case 'clock':
      return ''
    case 'infinity':
      return 'emoji-flow'
    case 'arrow-loop':
      return 'emoji-spin'
    default:
      return ''
  }
}

function getAnimationStyle(id: string): React.CSSProperties {
  switch (id) {
    case 'arrow-up':
      return { animation: 'emojiArrowUp 1.5s ease-in-out infinite' }
    case 'arrow-down':
      return { animation: 'emojiArrowDown 1.5s ease-in-out infinite' }
    case 'arrow-left':
      return { animation: 'emojiArrowLeft 1.5s ease-in-out infinite' }
    case 'arrow-right':
      return { animation: 'emojiArrowRight 1.5s ease-in-out infinite' }
    case 'arrow-zigzag':
      return { animation: 'emojiZigzag 2s ease-in-out infinite' }
    case 'wrench':
      return { animation: 'emojiWrench 1.5s ease-in-out infinite' }
    case 'hammer':
      return { animation: 'emojiHammer 0.8s ease-in-out infinite' }
    case 'bolt':
      return { animation: 'emojiBolt 1s steps(2, end) infinite' }
    case 'magnet':
      return { animation: 'emojiPulse 1.5s ease-in-out infinite' }
    case 'paintbrush':
      return { animation: 'emojiPaint 2s ease-in-out infinite' }
    case 'scissors':
      return { animation: 'emojiSnip 1s ease-in-out infinite' }
    case 'bulb':
      return { animation: 'emojiGlow 2s ease-in-out infinite' }
    default:
      return {}
  }
}

function renderEmoji(
  id: string,
  p: (typeof PALETTES)['retro'],
  sw: number,
  isRetro: boolean,
  isFuture: boolean
) {
  switch (id) {
    // === ARROWS ===
    case 'arrow-up':
      return (
        <>
          <path d="M16 28V6" stroke={p.primary} strokeWidth={sw} strokeLinecap={isRetro ? 'square' : 'round'} />
          <path d="M8 14L16 4L24 14" stroke={p.primary} strokeWidth={sw} strokeLinecap={isRetro ? 'square' : 'round'} strokeLinejoin={isRetro ? 'miter' : 'round'} />
          {isFuture && <path d="M8 14L16 4L24 14" stroke={p.primary} strokeWidth={1} opacity={0.3} />}
        </>
      )
    case 'arrow-down':
      return (
        <>
          <path d="M16 4V26" stroke={p.primary} strokeWidth={sw} strokeLinecap={isRetro ? 'square' : 'round'} />
          <path d="M8 18L16 28L24 18" stroke={p.primary} strokeWidth={sw} strokeLinecap={isRetro ? 'square' : 'round'} strokeLinejoin={isRetro ? 'miter' : 'round'} />
        </>
      )
    case 'arrow-left':
      return (
        <>
          <path d="M28 16H6" stroke={p.primary} strokeWidth={sw} strokeLinecap={isRetro ? 'square' : 'round'} />
          <path d="M14 8L4 16L14 24" stroke={p.primary} strokeWidth={sw} strokeLinecap={isRetro ? 'square' : 'round'} strokeLinejoin={isRetro ? 'miter' : 'round'} />
        </>
      )
    case 'arrow-right':
      return (
        <>
          <path d="M4 16H26" stroke={p.primary} strokeWidth={sw} strokeLinecap={isRetro ? 'square' : 'round'} />
          <path d="M18 8L28 16L18 24" stroke={p.primary} strokeWidth={sw} strokeLinecap={isRetro ? 'square' : 'round'} strokeLinejoin={isRetro ? 'miter' : 'round'} />
        </>
      )
    case 'arrow-rotate':
      return (
        <path d="M16 4A12 12 0 1 1 4 16M16 4L20 8M16 4L12 8" stroke={p.primary} strokeWidth={sw} strokeLinecap={isRetro ? 'square' : 'round'} fill="none" />
      )
    case 'arrow-bounce':
      return (
        <>
          <path d="M16 4V20" stroke={p.primary} strokeWidth={sw} strokeLinecap={isRetro ? 'square' : 'round'} />
          <path d="M8 14L16 22L24 14" stroke={p.primary} strokeWidth={sw} strokeLinecap={isRetro ? 'square' : 'round'} fill="none" />
          <path d="M6 28H26" stroke={p.accent} strokeWidth={sw} strokeLinecap={isRetro ? 'square' : 'round'} />
        </>
      )
    case 'arrow-loop':
      return (
        <path d="M8 16A8 8 0 0 1 24 16A8 8 0 0 1 8 16M24 12V16H20" stroke={p.primary} strokeWidth={sw} strokeLinecap={isRetro ? 'square' : 'round'} fill="none" />
      )
    case 'arrow-zigzag':
      return (
        <path d="M6 6L16 14L6 22L26 28" stroke={p.accent} strokeWidth={sw} strokeLinecap={isRetro ? 'square' : 'round'} strokeLinejoin={isRetro ? 'miter' : 'round'} fill="none" />
      )

    // === TOOLS ===
    case 'wrench':
      return (
        <>
          <path d="M8 24L20 12" stroke={p.stroke} strokeWidth={sw + 1} strokeLinecap={isRetro ? 'square' : 'round'} />
          <circle cx="22" cy="10" r="5" stroke={p.primary} strokeWidth={sw} fill={isFuture ? p.primary + '30' : isRetro ? p.secondary : 'none'} />
        </>
      )
    case 'hammer':
      return (
        <>
          <path d="M10 26L20 14" stroke={p.stroke} strokeWidth={sw + 1} strokeLinecap={isRetro ? 'square' : 'round'} />
          <rect x="16" y="4" width="12" height="8" rx={isRetro ? 0 : 2} fill={p.primary} stroke={p.stroke} strokeWidth={sw * 0.5} />
        </>
      )
    case 'gear':
      return (
        <>
          <circle cx="16" cy="16" r="5" stroke={p.primary} strokeWidth={sw} fill={isFuture ? p.primary + '20' : 'none'} />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const rad = (deg * Math.PI) / 180
            const x1 = 16 + Math.cos(rad) * 7
            const y1 = 16 + Math.sin(rad) * 7
            const x2 = 16 + Math.cos(rad) * 11
            const y2 = 16 + Math.sin(rad) * 11
            return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke={p.primary} strokeWidth={sw} strokeLinecap={isRetro ? 'square' : 'round'} />
          })}
        </>
      )
    case 'bolt':
      return <path d="M18 2L8 16H16L14 30L24 16H16L18 2Z" fill={p.yellow} stroke={p.stroke} strokeWidth={isRetro ? 1.5 : 1} strokeLinejoin={isRetro ? 'miter' : 'round'} />
    case 'magnet':
      return (
        <>
          <path d="M10 8V18A6 6 0 0 0 22 18V8" stroke={p.accent} strokeWidth={sw + 1} strokeLinecap={isRetro ? 'square' : 'round'} fill="none" />
          <rect x="7" y="4" width="6" height="6" rx={isRetro ? 0 : 1} fill={p.accent} />
          <rect x="19" y="4" width="6" height="6" rx={isRetro ? 0 : 1} fill={p.blue} />
        </>
      )
    case 'paintbrush':
      return (
        <>
          <path d="M8 26L18 14" stroke={p.stroke} strokeWidth={sw + 1} strokeLinecap={isRetro ? 'square' : 'round'} />
          <path d="M16 16L22 6L26 10L20 18Z" fill={p.primary} stroke={p.stroke} strokeWidth={isRetro ? 1 : 0.5} />
          {isFuture && <circle cx="8" cy="26" r="2" fill={p.secondary} />}
        </>
      )
    case 'scissors':
      return (
        <>
          <circle cx="10" cy="22" r="4" stroke={p.primary} strokeWidth={sw} fill="none" />
          <circle cx="22" cy="22" r="4" stroke={p.primary} strokeWidth={sw} fill="none" />
          <path d="M12 19L22 6" stroke={p.stroke} strokeWidth={sw} strokeLinecap={isRetro ? 'square' : 'round'} />
          <path d="M20 19L10 6" stroke={p.stroke} strokeWidth={sw} strokeLinecap={isRetro ? 'square' : 'round'} />
        </>
      )
    case 'clipboard':
      return (
        <>
          <rect x="6" y="6" width="20" height="22" rx={isRetro ? 0 : 3} fill={isFuture ? p.primary + '15' : isRetro ? p.secondary : 'white'} stroke={p.primary} strokeWidth={sw} />
          <rect x="11" y="3" width="10" height="5" rx={isRetro ? 0 : 1} fill={p.primary} />
          <line x1="10" y1="15" x2="22" y2="15" stroke={p.stroke} strokeWidth={1.5} />
          <line x1="10" y1="20" x2="22" y2="20" stroke={p.stroke} strokeWidth={1.5} />
          <line x1="10" y1="25" x2="18" y2="25" stroke={p.stroke} strokeWidth={1.5} />
        </>
      )

    // === OBJECTS ===
    case 'calendar':
      return (
        <>
          <rect x="4" y="6" width="24" height="22" rx={isRetro ? 0 : 3} fill={isFuture ? p.primary + '15' : 'white'} stroke={p.primary} strokeWidth={sw} />
          <rect x="4" y="6" width="24" height="7" rx={isRetro ? 0 : 3} fill={p.primary} />
          <line x1="10" y1="3" x2="10" y2="9" stroke={p.stroke} strokeWidth={sw} strokeLinecap={isRetro ? 'square' : 'round'} />
          <line x1="22" y1="3" x2="22" y2="9" stroke={p.stroke} strokeWidth={sw} strokeLinecap={isRetro ? 'square' : 'round'} />
          <rect x="8" y="17" width="4" height="3" rx={isRetro ? 0 : 0.5} fill={p.accent} />
          <rect x="14" y="17" width="4" height="3" rx={isRetro ? 0 : 0.5} fill={p.stroke} opacity={0.3} />
          <rect x="20" y="17" width="4" height="3" rx={isRetro ? 0 : 0.5} fill={p.stroke} opacity={0.3} />
          <rect x="8" y="22" width="4" height="3" rx={isRetro ? 0 : 0.5} fill={p.stroke} opacity={0.3} />
        </>
      )
    case 'clock':
      return (
        <>
          <circle cx="16" cy="16" r="12" stroke={p.primary} strokeWidth={sw} fill={isFuture ? p.primary + '10' : isRetro ? p.secondary : 'white'} />
          <line x1="16" y1="16" x2="16" y2="8" stroke={p.stroke} strokeWidth={sw} strokeLinecap={isRetro ? 'square' : 'round'} />
          <line x1="16" y1="16" x2="22" y2="16" stroke={p.accent} strokeWidth={sw - 0.5} strokeLinecap={isRetro ? 'square' : 'round'} />
          <circle cx="16" cy="16" r="1.5" fill={p.accent} />
        </>
      )
    case 'bell':
      return (
        <>
          <path d="M16 4C12 4 8 8 8 14V20L5 24H27L24 20V14C24 8 20 4 16 4Z" fill={p.yellow} stroke={p.stroke} strokeWidth={isRetro ? 1.5 : 1} strokeLinejoin={isRetro ? 'miter' : 'round'} />
          <circle cx="16" cy="28" r="2.5" fill={p.accent} />
          {isFuture && <path d="M8 14V20L5 24H27L24 20V14" stroke={p.primary} strokeWidth={0.5} opacity={0.5} />}
        </>
      )
    case 'folder':
      return (
        <>
          <path d={`M4 10${isRetro ? 'H14L16 7H28V26H4Z' : 'C4 8 5 7 7 7H13L16 10H26C27.5 10 28 11 28 12V24C28 25.5 27 26 26 26H6C4.5 26 4 25 4 24V10Z'}`} fill={isFuture ? p.primary + '25' : p.yellow} stroke={p.primary} strokeWidth={sw * 0.7} />
        </>
      )
    case 'mail':
      return (
        <>
          <rect x="4" y="8" width="24" height="16" rx={isRetro ? 0 : 2} fill={isFuture ? p.primary + '15' : 'white'} stroke={p.primary} strokeWidth={sw} />
          <path d="M4 8L16 18L28 8" stroke={p.primary} strokeWidth={sw} strokeLinejoin={isRetro ? 'miter' : 'round'} fill="none" />
        </>
      )
    case 'star':
      return <path d="M16 2L19.5 12L30 12L21.5 18.5L24.5 29L16 22.5L7.5 29L10.5 18.5L2 12L12.5 12Z" fill={p.yellow} stroke={p.stroke} strokeWidth={isRetro ? 1.5 : 1} strokeLinejoin={isRetro ? 'miter' : 'round'} />
    case 'rocket':
      return (
        <>
          <path d="M16 2C16 2 10 10 10 20L16 24L22 20C22 10 16 2 16 2Z" fill={isFuture ? p.primary + '40' : isRetro ? p.secondary : 'white'} stroke={p.primary} strokeWidth={sw} strokeLinejoin={isRetro ? 'miter' : 'round'} />
          <circle cx="16" cy="14" r="2.5" fill={p.accent} />
          <path d="M10 20L6 24L10 22" fill={p.accent} stroke={p.accent} strokeWidth={1} />
          <path d="M22 20L26 24L22 22" fill={p.accent} stroke={p.accent} strokeWidth={1} />
          <path d="M13 24L16 30L19 24" fill={p.yellow} stroke={p.accent} strokeWidth={0.5} />
        </>
      )
    case 'bulb':
      return (
        <>
          <path d="M12 22V24H20V22C24 19 24 12 16 8C8 12 8 19 12 22Z" fill={p.yellow} stroke={p.stroke} strokeWidth={isRetro ? 1.5 : 1} />
          <rect x="12" y="24" width="8" height="4" rx={isRetro ? 0 : 1} fill={p.stroke} opacity={0.3} />
          {isFuture && (
            <>
              <line x1="16" y1="2" x2="16" y2="5" stroke={p.yellow} strokeWidth={1.5} />
              <line x1="6" y1="10" x2="8.5" y2="11.5" stroke={p.yellow} strokeWidth={1.5} />
              <line x1="26" y1="10" x2="23.5" y2="11.5" stroke={p.yellow} strokeWidth={1.5} />
            </>
          )}
        </>
      )

    // === SYMBOLS ===
    case 'check':
      return (
        <>
          {isFuture && <circle cx="16" cy="16" r="13" fill={p.green + '15'} stroke={p.green} strokeWidth={1} />}
          {isRetro && <rect x="3" y="3" width="26" height="26" fill="white" stroke={p.green} strokeWidth={2} />}
          <path d="M8 16L14 22L24 10" stroke={p.green} strokeWidth={sw + 1} strokeLinecap={isRetro ? 'square' : 'round'} strokeLinejoin={isRetro ? 'miter' : 'round'} fill="none" />
        </>
      )
    case 'cross':
      return (
        <>
          {isFuture && <circle cx="16" cy="16" r="13" fill="#ef444415" stroke="#ef4444" strokeWidth={1} />}
          {isRetro && <rect x="3" y="3" width="26" height="26" fill="white" stroke={p.accent} strokeWidth={2} />}
          <path d="M9 9L23 23M23 9L9 23" stroke={p.accent} strokeWidth={sw + 1} strokeLinecap={isRetro ? 'square' : 'round'} />
        </>
      )
    case 'warning':
      return (
        <>
          <path d="M16 3L30 28H2Z" fill={p.yellow} stroke={p.stroke} strokeWidth={isRetro ? 1.5 : 1} strokeLinejoin={isRetro ? 'miter' : 'round'} />
          <line x1="16" y1="12" x2="16" y2="20" stroke={p.stroke} strokeWidth={sw} strokeLinecap={isRetro ? 'square' : 'round'} />
          <circle cx="16" cy="24" r="1.5" fill={p.stroke} />
        </>
      )
    case 'info':
      return (
        <>
          <circle cx="16" cy="16" r="13" fill={isFuture ? p.blue + '20' : isRetro ? p.secondary : p.blue} stroke={p.blue} strokeWidth={sw} />
          <circle cx="16" cy="10" r="2" fill={isFuture ? p.blue : 'white'} />
          <line x1="16" y1="15" x2="16" y2="24" stroke={isFuture ? p.blue : 'white'} strokeWidth={sw + 0.5} strokeLinecap={isRetro ? 'square' : 'round'} />
        </>
      )
    case 'heart':
      return <path d="M16 28L4 16C0 10 4 4 10 4C12.5 4 14.5 5 16 7.5C17.5 5 19.5 4 22 4C28 4 32 10 28 16Z" fill={p.accent} stroke={p.stroke} strokeWidth={isRetro ? 1.5 : 0.8} />
    case 'fire':
      return (
        <>
          <path d="M16 2C16 2 8 10 8 18C8 24 12 28 16 28C20 28 24 24 24 18C24 10 16 2 16 2Z" fill={p.accent} stroke={p.stroke} strokeWidth={isRetro ? 1.5 : 0.8} />
          <path d="M16 12C16 12 12 16 12 20C12 23 14 26 16 26C18 26 20 23 20 20C20 16 16 12 16 12Z" fill={p.yellow} />
        </>
      )
    case 'sparkle':
      return (
        <>
          <path d="M16 2L18 12L28 14L18 16L16 28L14 16L4 14L14 12Z" fill={p.yellow} stroke={p.stroke} strokeWidth={isRetro ? 1 : 0.5} />
          {isFuture && (
            <>
              <circle cx="8" cy="6" r="1" fill={p.primary} />
              <circle cx="26" cy="8" r="1.5" fill={p.secondary} />
              <circle cx="24" cy="24" r="1" fill={p.primary} />
            </>
          )}
        </>
      )
    case 'infinity':
      return <path d="M8 16C8 12 11 10 14 12C16 13.5 16 18.5 18 20C21 22 24 20 24 16C24 12 21 10 18 12C16 13.5 16 18.5 14 20C11 22 8 20 8 16Z" stroke={isFuture ? p.primary : p.primary} strokeWidth={sw + 0.5} fill="none" strokeLinecap={isRetro ? 'square' : 'round'} />

    default:
      return <circle cx="16" cy="16" r="12" fill={p.secondary} stroke={p.primary} strokeWidth={sw} />
  }
}
