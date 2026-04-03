export interface WordEffect {
  id: string
  triggerWord: string
  effectType: EffectType
  enabled: boolean
  soundEnabled: boolean
  customVoiceUrl?: string // recorded voice blob URL
}

export type EffectType =
  | 'balloons'
  | 'confetti'
  | 'fireworks'
  | 'hearts'
  | 'stars'
  | 'snow'

export interface EffectConfig {
  label: string
  emoji: string
  description: string
  colors: string[]
}

export const EFFECT_CONFIGS: Record<EffectType, EffectConfig> = {
  balloons: {
    label: 'Ballons',
    emoji: '🎈',
    description: 'Des ballons colorés survolent l\'écran',
    colors: ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#ec4899'],
  },
  confetti: {
    label: 'Confettis',
    emoji: '🎉',
    description: 'Pluie de confettis festifs',
    colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500'],
  },
  fireworks: {
    label: 'Feux d\'artifice',
    emoji: '🎆',
    description: 'Explosion de lumières',
    colors: ['#fbbf24', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#22d3ee'],
  },
  hearts: {
    label: 'Cœurs',
    emoji: '❤️',
    description: 'Des cœurs flottent sur l\'écran',
    colors: ['#ef4444', '#ec4899', '#f43f5e', '#fb7185', '#fda4af'],
  },
  stars: {
    label: 'Étoiles',
    emoji: '⭐',
    description: 'Des étoiles scintillantes',
    colors: ['#fbbf24', '#fcd34d', '#fde68a', '#22d3ee', '#a855f7'],
  },
  snow: {
    label: 'Neige',
    emoji: '❄️',
    description: 'Flocons de neige qui tombent',
    colors: ['#ffffff', '#e0f2fe', '#bae6fd', '#e2e8f0', '#cbd5e1'],
  },
}

export const DEFAULT_WORD_EFFECTS: WordEffect[] = [
  { id: '1', triggerWord: 'félicitations', effectType: 'confetti', enabled: true, soundEnabled: true },
  { id: '2', triggerWord: 'joyeux anniversaire', effectType: 'balloons', enabled: true, soundEnabled: true },
  { id: '3', triggerWord: 'bravo', effectType: 'fireworks', enabled: true, soundEnabled: true },
  { id: '4', triggerWord: 'je t\'aime', effectType: 'hearts', enabled: true, soundEnabled: false },
  { id: '5', triggerWord: 'bonne nuit', effectType: 'stars', enabled: true, soundEnabled: false },
  { id: '6', triggerWord: 'événement parfait', effectType: 'confetti', enabled: true, soundEnabled: true },
]
