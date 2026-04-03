import { Award, Code, Heart, MapPin, Shield, X } from 'lucide-react'

interface AboutCreatorProps {
  onClose: () => void
}

export function AboutCreator({ onClose }: AboutCreatorProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#111118] border border-white/[0.08] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header gradient */}
        <div className="relative h-28 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 overflow-hidden">
          {/* Subtle pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 1px, transparent 8px)',
          }} />
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-black/30 transition-all z-10"
          >
            <X size={14} />
          </button>
          {/* Fleur de lys subtle */}
          <div className="absolute bottom-2 right-4 text-white/10 text-5xl">⚜</div>
        </div>

        {/* Avatar */}
        <div className="relative -mt-14 px-5">
          <div className="w-24 h-24 rounded-2xl border-4 border-[#111118] overflow-hidden bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
            {/* SVG portrait based on the photo */}
            <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
              {/* Background */}
              <rect width="96" height="96" fill="#1a1a24" />

              {/* Shoulders / body with safety vest */}
              <ellipse cx="48" cy="105" rx="45" ry="35" fill="#222" />
              {/* Safety vest stripes */}
              <path d="M25 80 Q48 72 71 80 L68 96 Q48 88 28 96Z" fill="#c4ff00" opacity="0.7" />
              <path d="M30 85 Q48 78 66 85" stroke="#87ceeb" strokeWidth="2" fill="none" opacity="0.5" />

              {/* Neck */}
              <rect x="38" y="62" width="20" height="12" rx="4" fill="#d4a574" />

              {/* Head */}
              <ellipse cx="48" cy="42" rx="22" ry="26" fill="#d4a574" />

              {/* Beard */}
              <path d="M30 48 Q34 60 48 65 Q62 60 66 48 Q62 55 48 58 Q34 55 30 48Z" fill="#8B4513" opacity="0.7" />
              <path d="M32 45 Q48 62 64 45" fill="#8B4513" opacity="0.5" />

              {/* Cap */}
              <path d="M24 36 Q26 18 48 16 Q70 18 72 36 L68 38 Q66 26 48 24 Q30 26 28 38Z" fill="#1a5c2a" />
              <rect x="24" y="34" width="48" height="5" rx="2" fill="#1a5c2a" />
              {/* Cap brim */}
              <path d="M26 37 Q24 38 22 37 L24 34 Q48 32 72 34 L74 37 Q72 38 70 37Z" fill="#145020" />

              {/* Sunglasses (sport style with blue mirror) */}
              <path d="M30 36 L42 35 Q44 35 44 37 L43 42 Q42 44 40 44 L32 44 Q29 44 29 41 L29 38 Q29 36 30 36Z" fill="white" />
              <path d="M54 35 L66 36 Q67 36 67 38 L67 41 Q67 44 64 44 L56 44 Q54 44 53 42 L52 37 Q52 35 54 35Z" fill="white" />
              {/* Blue mirror lenses */}
              <path d="M31 37 L41 36 Q43 36 43 38 L42 42 Q41 43 39 43 L33 43 Q30 43 30 40 L30 39 Q30 37 31 37Z" fill="url(#lens)" />
              <path d="M55 36 L65 37 Q66 37 66 39 L66 40 Q66 43 63 43 L57 43 Q55 43 54 41 L53 38 Q53 36 55 36Z" fill="url(#lens)" />
              {/* Bridge */}
              <rect x="43" y="37" width="10" height="2" rx="1" fill="white" />

              {/* Gradient for lenses */}
              <defs>
                <linearGradient id="lens" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>

              {/* Smile */}
              <path d="M40 50 Q48 56 56 50" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.8" />

              {/* Hand waving (right side) */}
              <g transform="translate(72, 50)">
                <path d="M0 10 Q-5 0 0 -10 Q5 -5 8 0" fill="#d4a574" />
                {/* Fingers */}
                <rect x="-2" y="-18" width="4" height="10" rx="2" fill="#d4a574" />
                <rect x="2" y="-20" width="4" height="12" rx="2" fill="#d4a574" transform="rotate(10 4 -14)" />
                <rect x="6" y="-18" width="4" height="10" rx="2" fill="#d4a574" transform="rotate(20 8 -13)" />
                <rect x="-6" y="-16" width="4" height="9" rx="2" fill="#d4a574" transform="rotate(-10 -4 -12)" />
              </g>
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 pb-5 pt-3">
          {/* Name + title */}
          <h2 className="text-lg font-black text-white">Alex Marceau Prévost</h2>
          <p className="text-xs text-cyan-400 font-semibold mt-0.5">Créateur de ti-lex IA</p>

          {/* Location */}
          <div className="flex items-center gap-1.5 mt-2">
            <MapPin size={12} className="text-white/30" />
            <p className="text-[11px] text-white/40">Lac-Saint-Jean, Québec, Canada 🇨🇦</p>
          </div>

          {/* Bio */}
          <div className="mt-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Code size={14} className="text-cyan-400" />
              <span className="text-xs font-bold text-white/70">À propos</span>
            </div>
            <p className="text-[11px] text-white/40 leading-relaxed">
              31 ans, passionné de technologie et de code. Développeur par passe-temps,
              créateur de <strong className="text-cyan-400">ti-lex IA</strong> — un agenda intelligent
              propulsé par l'intelligence artificielle, conçu pour simplifier la vie quotidienne.
            </p>
          </div>

          {/* Product badge */}
          <div className="mt-3 bg-gradient-to-r from-blue-600/15 to-cyan-500/15 border border-blue-500/20 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">
                ⚜
              </div>
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  Produit québécois
                  <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full">Fier</span>
                </p>
                <p className="text-[10px] text-white/30 mt-0.5">
                  Fait avec <Heart size={8} className="inline text-red-400" /> au Lac-Saint-Jean
                </p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={14} className="text-amber-400" />
              <span className="text-xs font-bold text-white/70">Droits d'auteur</span>
            </div>
            <p className="text-[10px] text-white/30 leading-relaxed">
              © 2026 Alex Marceau Prévost. Tous droits réservés.
            </p>
            <p className="text-[10px] text-white/30 leading-relaxed mt-1">
              <strong className="text-white/50">ti-lex IA</strong> est une marque et un produit original
              créé et développé par Alex Marceau Prévost. Toute reproduction, modification ou
              distribution non autorisée est strictement interdite.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <Award size={12} className="text-amber-400" />
              <p className="text-[9px] text-amber-400/70 font-medium">
                Produit original · Propriété intellectuelle protégée
              </p>
            </div>
          </div>

          {/* Version */}
          <div className="mt-3 flex items-center justify-center gap-2 py-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <span className="text-[6px] font-black text-white">tl</span>
            </div>
            <p className="text-[10px] text-white/20">ti-lex IA v1.0 · Alex GPT Agenda</p>
          </div>
        </div>
      </div>
    </div>
  )
}
