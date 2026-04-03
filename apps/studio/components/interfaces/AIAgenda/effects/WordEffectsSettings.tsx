import { Mic, MicOff, Plus, Trash2, Volume2, VolumeX, Wand2, X } from 'lucide-react'
import { useState, useRef, useCallback } from 'react'
import { WordEffect, EffectType, EFFECT_CONFIGS } from './wordEffects'
import { ScreenEffect } from './ScreenEffect'

interface WordEffectsSettingsProps {
  effects: WordEffect[]
  onUpdate: (effects: WordEffect[]) => void
  onClose: () => void
}

const EFFECT_TYPES: EffectType[] = ['balloons', 'confetti', 'fireworks', 'hearts', 'stars', 'snow']

export function WordEffectsSettings({ effects, onUpdate, onClose }: WordEffectsSettingsProps) {
  const [localEffects, setLocalEffects] = useState(effects)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newWord, setNewWord] = useState('')
  const [newType, setNewType] = useState<EffectType>('confetti')
  const [previewEffect, setPreviewEffect] = useState<EffectType | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingForId, setRecordingForId] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const toggleEffect = (id: string) => {
    setLocalEffects((prev) =>
      prev.map((e) => (e.id === id ? { ...e, enabled: !e.enabled } : e))
    )
  }

  const toggleSound = (id: string) => {
    setLocalEffects((prev) =>
      prev.map((e) => (e.id === id ? { ...e, soundEnabled: !e.soundEnabled } : e))
    )
  }

  const removeEffect = (id: string) => {
    setLocalEffects((prev) => prev.filter((e) => e.id !== id))
  }

  const addEffect = () => {
    if (!newWord.trim()) return
    const effect: WordEffect = {
      id: crypto.randomUUID(),
      triggerWord: newWord.trim().toLowerCase(),
      effectType: newType,
      enabled: true,
      soundEnabled: false,
    }
    setLocalEffects((prev) => [...prev, effect])
    setNewWord('')
    setShowAddForm(false)
  }

  const startRecording = useCallback(async (effectId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setLocalEffects((prev) =>
          prev.map((e) => (e.id === effectId ? { ...e, customVoiceUrl: url, soundEnabled: true } : e))
        )
        stream.getTracks().forEach((t) => t.stop())
        setIsRecording(false)
        setRecordingForId(null)
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingForId(effectId)

      // Auto stop after 3 seconds
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop()
        }
      }, 3000)
    } catch {
      // Mic not available
      setIsRecording(false)
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
  }, [])

  const handleSave = () => {
    onUpdate(localEffects)
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div className="bg-[#111118] border border-white/[0.08] rounded-3xl w-full max-w-md shadow-2xl max-h-[85vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Wand2 size={16} className="text-purple-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Effets sur les mots</h3>
                <p className="text-[10px] text-white/30">Style Messenger · ti-lex IA</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center text-white/40 hover:text-white">
              <X size={14} />
            </button>
          </div>

          {/* Info banner */}
          <div className="px-5 pt-4">
            <div className="flex items-start gap-2.5 bg-purple-500/10 border border-purple-500/20 rounded-2xl p-3">
              <span className="text-lg">✨</span>
              <p className="text-[11px] text-purple-300/80 leading-relaxed">
                Quand un <strong>mot déclencheur</strong> est écrit, un <strong>effet plein écran</strong> apparaît pendant 2 secondes.
                Ajoutez votre propre voix enregistrée pour chaque mot !
              </p>
            </div>
          </div>

          {/* Effects list */}
          <div className="flex-1 overflow-auto px-5 py-3 space-y-2">
            {localEffects.map((effect) => {
              const config = EFFECT_CONFIGS[effect.effectType]
              const recording = isRecording && recordingForId === effect.id

              return (
                <div
                  key={effect.id}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                    effect.enabled
                      ? 'bg-white/[0.04] border-white/[0.08]'
                      : 'bg-white/[0.01] border-white/[0.04] opacity-50'
                  }`}
                >
                  {/* Effect emoji */}
                  <button
                    onClick={() => setPreviewEffect(effect.effectType)}
                    className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center text-lg hover:bg-white/10 hover:scale-110 active:scale-95 transition-all"
                    title="Aperçu"
                  >
                    {config.emoji}
                  </button>

                  {/* Word + type */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      "{effect.triggerWord}"
                    </p>
                    <p className="text-[10px] text-white/30 mt-0.5">{config.label}</p>
                  </div>

                  {/* Voice record button */}
                  <button
                    onClick={() => recording ? stopRecording() : startRecording(effect.id)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      recording
                        ? 'bg-red-500 text-white animate-pulse'
                        : effect.customVoiceUrl
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-white/[0.06] text-white/20 hover:text-white/50'
                    }`}
                    title={recording ? 'Arrêter' : 'Enregistrer voix'}
                  >
                    {recording ? <MicOff size={12} /> : <Mic size={12} />}
                  </button>

                  {/* Sound toggle */}
                  <button
                    onClick={() => toggleSound(effect.id)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      effect.soundEnabled ? 'bg-amber-500/20 text-amber-400' : 'bg-white/[0.06] text-white/20'
                    }`}
                  >
                    {effect.soundEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
                  </button>

                  {/* Enable toggle */}
                  <button
                    onClick={() => toggleEffect(effect.id)}
                    className={`w-9 h-5 rounded-full transition-colors relative ${
                      effect.enabled ? 'bg-purple-500' : 'bg-white/10'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                      effect.enabled ? 'left-[18px]' : 'left-0.5'
                    }`} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => removeEffect(effect.id)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white/10 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              )
            })}
          </div>

          {/* Add new effect */}
          {showAddForm ? (
            <div className="px-5 py-3 border-t border-white/[0.06] space-y-3">
              <input
                type="text"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                placeholder="Mot déclencheur..."
                className="w-full px-4 py-2.5 text-sm bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 outline-none focus:border-purple-400/50"
                autoFocus
              />
              <div className="flex gap-1.5 flex-wrap">
                {EFFECT_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setNewType(type)}
                    className={`text-[10px] px-2.5 py-1.5 rounded-full border flex items-center gap-1 transition-all ${
                      newType === type
                        ? 'bg-purple-500/20 text-purple-400 border-purple-400/30'
                        : 'border-white/[0.06] text-white/30 hover:bg-white/[0.05]'
                    }`}
                  >
                    {EFFECT_CONFIGS[type].emoji} {EFFECT_CONFIGS[type].label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-2.5 text-xs font-medium text-white/40 border border-white/[0.08] rounded-xl hover:bg-white/[0.05]"
                >
                  Annuler
                </button>
                <button
                  onClick={addEffect}
                  className="flex-1 py-2.5 text-xs font-bold bg-purple-500 text-white rounded-xl hover:bg-purple-400"
                >
                  Ajouter
                </button>
              </div>
            </div>
          ) : (
            <div className="px-5 py-3 border-t border-white/[0.06] flex gap-2">
              <button
                onClick={() => setShowAddForm(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-dashed border-purple-400/30 rounded-xl text-xs text-purple-400/60 hover:text-purple-400 hover:bg-purple-500/10 transition-all"
              >
                <Plus size={14} />
                Ajouter un mot déclencheur
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)]"
              >
                Sauvegarder
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Preview effect */}
      {previewEffect && (
        <ScreenEffect effectType={previewEffect} onComplete={() => setPreviewEffect(null)} />
      )}
    </>
  )
}
