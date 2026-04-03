export interface EmojiItem {
  id: string
  name: string
  category: 'arrows' | 'tools' | 'objects' | 'symbols' | 'faces' | 'time'
  animated?: boolean
}

export interface EmojiPack {
  id: string
  name: string
  description: string
  year: string
  emojis: EmojiItem[]
  style: 'retro' | 'flat' | 'futuristic'
}

const ARROW_EMOJIS: EmojiItem[] = [
  { id: 'arrow-up', name: 'Flèche haut', category: 'arrows', animated: true },
  { id: 'arrow-down', name: 'Flèche bas', category: 'arrows', animated: true },
  { id: 'arrow-left', name: 'Flèche gauche', category: 'arrows', animated: true },
  { id: 'arrow-right', name: 'Flèche droite', category: 'arrows', animated: true },
  { id: 'arrow-rotate', name: 'Flèche rotation 360', category: 'arrows', animated: true },
  { id: 'arrow-bounce', name: 'Flèche rebond', category: 'arrows', animated: true },
  { id: 'arrow-loop', name: 'Flèche boucle infinie', category: 'arrows', animated: true },
  { id: 'arrow-zigzag', name: 'Flèche zigzag', category: 'arrows', animated: true },
]

const TOOL_EMOJIS: EmojiItem[] = [
  { id: 'wrench', name: 'Clé à molette', category: 'tools', animated: true },
  { id: 'hammer', name: 'Marteau', category: 'tools', animated: true },
  { id: 'gear', name: 'Engrenage', category: 'tools', animated: true },
  { id: 'bolt', name: 'Éclair', category: 'tools', animated: true },
  { id: 'magnet', name: 'Aimant', category: 'tools', animated: true },
  { id: 'paintbrush', name: 'Pinceau', category: 'tools', animated: true },
  { id: 'scissors', name: 'Ciseaux', category: 'tools', animated: true },
  { id: 'clipboard', name: 'Presse-papier', category: 'tools' },
]

const OBJECT_EMOJIS: EmojiItem[] = [
  { id: 'calendar', name: 'Calendrier', category: 'objects' },
  { id: 'clock', name: 'Horloge', category: 'objects', animated: true },
  { id: 'bell', name: 'Cloche', category: 'objects', animated: true },
  { id: 'folder', name: 'Dossier', category: 'objects' },
  { id: 'mail', name: 'Courrier', category: 'objects' },
  { id: 'star', name: 'Étoile', category: 'objects', animated: true },
  { id: 'rocket', name: 'Fusée', category: 'objects', animated: true },
  { id: 'bulb', name: 'Ampoule', category: 'objects', animated: true },
]

const SYMBOL_EMOJIS: EmojiItem[] = [
  { id: 'check', name: 'Validé', category: 'symbols', animated: true },
  { id: 'cross', name: 'Annulé', category: 'symbols' },
  { id: 'warning', name: 'Attention', category: 'symbols', animated: true },
  { id: 'info', name: 'Info', category: 'symbols' },
  { id: 'heart', name: 'Cœur', category: 'symbols', animated: true },
  { id: 'fire', name: 'Feu', category: 'symbols', animated: true },
  { id: 'sparkle', name: 'Étincelle', category: 'symbols', animated: true },
  { id: 'infinity', name: 'Infini', category: 'symbols', animated: true },
]

const ALL_EMOJIS = [...ARROW_EMOJIS, ...TOOL_EMOJIS, ...OBJECT_EMOJIS, ...SYMBOL_EMOJIS]

export const EMOJI_PACKS: EmojiPack[] = [
  {
    id: 'win98',
    name: 'Windows 98',
    description: 'Émojis rétro pixel art style Windows 98',
    year: '1998',
    style: 'retro',
    emojis: ALL_EMOJIS,
  },
  {
    id: 'win8',
    name: 'Windows 8',
    description: 'Émojis flat design style Metro UI',
    year: '2012',
    style: 'flat',
    emojis: ALL_EMOJIS,
  },
  {
    id: 'future2026',
    name: 'Futuriste 2026',
    description: 'Émojis modernes avec effets lumineux',
    year: '2026',
    style: 'futuristic',
    emojis: ALL_EMOJIS,
  },
]

export const EMOJI_CATEGORIES = [
  { id: 'arrows', label: 'Flèches', icon: '→' },
  { id: 'tools', label: 'Outils', icon: '🔧' },
  { id: 'objects', label: 'Objets', icon: '📦' },
  { id: 'symbols', label: 'Symboles', icon: '✦' },
] as const
