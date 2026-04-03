import { useCallback } from 'react'
import { WordEffect, EffectType } from './wordEffects'

/**
 * Scans text for trigger words and returns the matching effect type.
 * Plays custom voice if available.
 */
export function useWordEffects(effects: WordEffect[]) {
  const checkText = useCallback(
    (text: string): EffectType | null => {
      const lower = text.toLowerCase()

      for (const effect of effects) {
        if (!effect.enabled) continue
        if (lower.includes(effect.triggerWord.toLowerCase())) {
          // Play voice if available
          if (effect.soundEnabled && effect.customVoiceUrl) {
            try {
              const audio = new Audio(effect.customVoiceUrl)
              audio.volume = 0.7
              audio.play().catch(() => {})
            } catch {
              // audio not available
            }
          }
          return effect.effectType
        }
      }

      return null
    },
    [effects]
  )

  return { checkText }
}
