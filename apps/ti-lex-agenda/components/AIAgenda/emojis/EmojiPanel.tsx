import { Download, X, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { EMOJI_PACKS, EMOJI_CATEGORIES, EmojiPack } from './emojiPacks'
import { EmojiRenderer } from './EmojiRenderer'

interface EmojiPanelProps {
  onClose: () => void
  onSelectEmoji: (emojiId: string, packStyle: 'retro' | 'flat' | 'futuristic') => void
}

export function EmojiPanel({ onClose, onSelectEmoji }: EmojiPanelProps) {
  const [selectedPack, setSelectedPack] = useState<EmojiPack>(EMOJI_PACKS[2]) // Default: futuristic
  const [selectedCategory, setSelectedCategory] = useState<string>('arrows')
  const [downloadedPacks, setDownloadedPacks] = useState<Set<string>>(new Set(['future2026']))

  const handleDownload = (packId: string) => {
    setDownloadedPacks((prev) => new Set(prev).add(packId))
  }

  const filteredEmojis = selectedPack.emojis.filter((e) => e.category === selectedCategory)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-lg bg-[#111118] border border-white/[0.08] rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] overflow-hidden"
        style={{ animation: 'slideUp 0.3s ease-out' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-cyan-400" />
            <h2 className="text-sm font-bold text-white">Émojis ti-lex</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={14} />
          </button>
        </div>

        {/* Pack Selector */}
        <div className="px-4 py-3 flex gap-2 overflow-x-auto border-b border-white/[0.06]">
          {EMOJI_PACKS.map((pack) => {
            const isActive = selectedPack.id === pack.id
            const isDownloaded = downloadedPacks.has(pack.id)

            return (
              <button
                key={pack.id}
                onClick={() => {
                  if (isDownloaded) setSelectedPack(pack)
                }}
                className={`relative flex-shrink-0 px-4 py-2.5 rounded-2xl border transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 border-cyan-400/40 shadow-[0_0_15px_rgba(34,211,238,0.1)]'
                    : isDownloaded
                      ? 'border-white/[0.08] hover:bg-white/[0.05]'
                      : 'border-white/[0.04] opacity-60'
                }`}
              >
                <div className="flex items-center gap-2">
                  {/* Pack style indicator */}
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-[8px] font-black ${
                      pack.style === 'retro'
                        ? 'bg-[#c0c0c0] text-[#000080] border border-[#808080]'
                        : pack.style === 'flat'
                          ? 'bg-[#2d89ef] text-white'
                          : 'bg-gradient-to-br from-cyan-400 to-purple-500 text-white'
                    }`}
                    style={pack.style === 'retro' ? { imageRendering: 'pixelated' as const, fontFamily: 'monospace' } : undefined}
                  >
                    {pack.style === 'retro' ? '98' : pack.style === 'flat' ? 'W8' : '✦'}
                  </div>
                  <div className="text-left">
                    <p className={`text-[11px] font-bold ${isActive ? 'text-cyan-400' : 'text-white/70'}`}>
                      {pack.name}
                    </p>
                    <p className="text-[9px] text-white/30">{pack.year}</p>
                  </div>
                </div>

                {/* Download badge */}
                {!isDownloaded && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDownload(pack.id)
                    }}
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-black shadow-[0_0_10px_rgba(34,211,238,0.4)] hover:scale-110 transition-transform"
                  >
                    <Download size={10} strokeWidth={3} />
                  </button>
                )}
              </button>
            )
          })}
        </div>

        {/* Category tabs */}
        <div className="px-4 py-2 flex gap-1">
          {EMOJI_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-white/10 text-white'
                  : 'text-white/30 hover:text-white/60'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Emoji Grid */}
        <div className="px-4 py-3 grid grid-cols-8 gap-2 max-h-[280px] overflow-auto">
          {filteredEmojis.map((emoji) => (
            <button
              key={emoji.id}
              onClick={() => onSelectEmoji(emoji.id, selectedPack.style)}
              className="group relative w-full aspect-square rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.08] hover:border-white/[0.15] hover:scale-110 active:scale-95 transition-all"
              title={emoji.name}
            >
              <EmojiRenderer
                emojiId={emoji.id}
                style={selectedPack.style}
                size={28}
                animated={emoji.animated}
              />
              {/* Animated badge */}
              {emoji.animated && (
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-purple-500 border border-[#111118] flex items-center justify-center">
                  <span className="text-[6px] text-white font-bold">⚡</span>
                </div>
              )}
              {/* Tooltip */}
              <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-md text-[8px] text-white/70 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                {emoji.name}
              </div>
            </button>
          ))}
        </div>

        {/* Pack info bar */}
        <div className="px-5 py-3 border-t border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                selectedPack.style === 'retro'
                  ? 'bg-gray-400'
                  : selectedPack.style === 'flat'
                    ? 'bg-blue-400'
                    : 'bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.6)]'
              }`}
            />
            <p className="text-[10px] text-white/30">
              {selectedPack.description}
            </p>
          </div>
          <p className="text-[10px] text-white/20">
            {selectedPack.emojis.filter((e) => e.animated).length} animés
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
