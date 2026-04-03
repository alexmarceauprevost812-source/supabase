/**
 * Global CSS animations for emoji effects.
 * Include this component once in the app to inject all animation keyframes.
 */
export function EmojiAnimations() {
  return (
    <style jsx global>{`
      /* === DIRECTIONAL ARROWS === */
      @keyframes emojiArrowUp {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-6px); }
      }
      @keyframes emojiArrowDown {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(6px); }
      }
      @keyframes emojiArrowLeft {
        0%, 100% { transform: translateX(0); }
        50% { transform: translateX(-6px); }
      }
      @keyframes emojiArrowRight {
        0%, 100% { transform: translateX(0); }
        50% { transform: translateX(6px); }
      }
      @keyframes emojiZigzag {
        0%, 100% { transform: translate(0, 0); }
        25% { transform: translate(3px, -3px); }
        50% { transform: translate(-3px, 3px); }
        75% { transform: translate(3px, 3px); }
      }

      /* === ROTATION / SPIN === */
      .emoji-spin {
        animation: emojiSpin 3s linear infinite;
      }
      @keyframes emojiSpin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      /* === BOUNCE === */
      .emoji-bounce {
        animation: emojiBounce 1s cubic-bezier(0.36, 0.07, 0.19, 0.97) infinite;
      }
      @keyframes emojiBounce {
        0%, 100% { transform: translateY(0); }
        30% { transform: translateY(-8px); }
        50% { transform: translateY(0); }
        70% { transform: translateY(-4px); }
      }

      /* === SWING (bell) === */
      .emoji-swing {
        animation: emojiSwing 1.5s ease-in-out infinite;
        transform-origin: top center;
      }
      @keyframes emojiSwing {
        0%, 100% { transform: rotate(0deg); }
        15% { transform: rotate(14deg); }
        30% { transform: rotate(-12deg); }
        45% { transform: rotate(8deg); }
        60% { transform: rotate(-4deg); }
        75% { transform: rotate(0deg); }
      }

      /* === PULSE (heart) === */
      .emoji-pulse {
        animation: emojiPulse 1s ease-in-out infinite;
      }
      @keyframes emojiPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
      }

      /* === TWINKLE (star, sparkle) === */
      .emoji-twinkle {
        animation: emojiTwinkle 2s ease-in-out infinite;
      }
      @keyframes emojiTwinkle {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(0.85); }
      }

      /* === FLICKER (fire) === */
      .emoji-flicker {
        animation: emojiFlicker 0.3s ease-in-out infinite alternate;
      }
      @keyframes emojiFlicker {
        from { transform: scaleY(1) scaleX(1); }
        to { transform: scaleY(1.05) scaleX(0.97); }
      }

      /* === BLINK (warning) === */
      .emoji-blink {
        animation: emojiBlink 1.5s steps(2, end) infinite;
      }
      @keyframes emojiBlink {
        0%, 49% { opacity: 1; }
        50%, 100% { opacity: 0.3; }
      }

      /* === POP (check) === */
      .emoji-pop {
        animation: emojiPop 2s ease-in-out infinite;
      }
      @keyframes emojiPop {
        0%, 80%, 100% { transform: scale(1); }
        90% { transform: scale(1.3); }
      }

      /* === FLOW (infinity) === */
      .emoji-flow {
        animation: emojiFlow 3s linear infinite;
      }
      @keyframes emojiFlow {
        from { filter: hue-rotate(0deg); }
        to { filter: hue-rotate(360deg); }
      }

      /* === TOOL ANIMATIONS === */
      @keyframes emojiWrench {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-30deg); }
        75% { transform: rotate(30deg); }
      }
      @keyframes emojiHammer {
        0%, 50%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-35deg); }
      }
      @keyframes emojiBolt {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.4; transform: scale(0.9); }
      }
      @keyframes emojiPaint {
        0%, 100% { transform: rotate(0deg) translateX(0); }
        25% { transform: rotate(-5deg) translateX(-2px); }
        75% { transform: rotate(5deg) translateX(2px); }
      }
      @keyframes emojiSnip {
        0%, 100% { transform: scaleX(1); }
        50% { transform: scaleX(0.85); }
      }
      @keyframes emojiGlow {
        0%, 100% { filter: brightness(1); }
        50% { filter: brightness(1.5) drop-shadow(0 0 4px #fbbf24); }
      }
    `}</style>
  )
}
