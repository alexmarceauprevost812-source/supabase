'use client'

import { useState } from 'react'
import type { Agent } from '@/lib/types'

interface AgentCreatorProps {
  onSave: (agent: Agent) => void
  onCancel: () => void
}

const PRESET_PROMPTS = [
  {
    label: 'Codeur Expert',
    prompt: 'Tu es un expert en programmation. Tu écris du code propre, bien commenté et optimisé. Tu expliques tes choix techniques.',
  },
  {
    label: 'Designer Créatif',
    prompt: 'Tu es un designer créatif spécialisé en UI/UX. Tu proposes des designs modernes et tu connais les tendances actuelles.',
  },
  {
    label: 'Tuteur Patient',
    prompt: 'Tu es un tuteur patient et pédagogue. Tu expliques les concepts étape par étape avec des exemples simples.',
  },
  {
    label: 'Assistant Général',
    prompt: 'Tu es un assistant IA polyvalent. Tu aides avec toutes sortes de tâches de manière efficace et amicale.',
  },
]

export function AgentCreator({ onSave, onCancel }: AgentCreatorProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')

  const handleSave = () => {
    if (!name.trim()) return

    const agent: Agent = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim() || `Agent personnalisé: ${name}`,
      avatar_url: null,
      system_prompt: systemPrompt.trim() || 'Tu es un assistant IA utile.',
      user_id: '',
      created_at: new Date().toISOString(),
    }

    onSave(agent)
  }

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-lg animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-alex-primary to-alex-accent bg-clip-text text-transparent">
          Cr&eacute;er un nouvel agent
        </h2>

        <div className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Nom de l&apos;agent
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: CodeMaster, DesignBot..."
              className="w-full bg-alex-card border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-alex-primary transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Que fait cet agent ?"
              className="w-full bg-alex-card border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-alex-primary transition-colors"
            />
          </div>

          {/* Preset prompts */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Mod&egrave;les rapides
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_PROMPTS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setSystemPrompt(preset.prompt)}
                  className={`text-left px-3 py-2 rounded-lg border text-xs transition-colors ${
                    systemPrompt === preset.prompt
                      ? 'border-alex-primary bg-alex-primary/20 text-white'
                      : 'border-gray-700 hover:border-gray-600 text-gray-400'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* System Prompt */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Instructions (System Prompt)
            </label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="D&eacute;crivez la personnalit&eacute; et les comp&eacute;tences de votre agent..."
              rows={4}
              className="w-full bg-alex-card border border-gray-700 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-alex-primary transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-700 hover:bg-gray-800 transition-colors text-sm"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-alex-primary to-alex-accent font-semibold hover:opacity-90 disabled:opacity-30 transition-all text-sm"
            >
              Cr&eacute;er l&apos;agent
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
