'use client'

import { useState, useRef, useEffect } from 'react'
import type { Agent } from '@/lib/types'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export function ChatInterface({ agent }: { agent: Agent }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: generateResponse(userMessage.content, agent),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000 + Math.random() * 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-alex-primary to-alex-accent flex items-center justify-center text-sm font-bold">
          {agent.name.charAt(0)}
        </div>
        <div>
          <h2 className="font-semibold">{agent.name}</h2>
          <p className="text-xs text-gray-500">{agent.description}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-20 animate-fade-in">
            <p className="text-lg">Envoyez un message pour commencer</p>
            <p className="text-sm mt-1">Je suis pr&ecirc;t &agrave; vous aider &agrave; coder et cr&eacute;er.</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex animate-fade-in ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-alex-primary text-white rounded-br-md'
                  : 'bg-alex-card border border-gray-800 rounded-bl-md'
              }`}
            >
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-alex-card border border-gray-800 px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex gap-1.5">
                <span className="typing-dot w-2 h-2 rounded-full bg-alex-accent" />
                <span className="typing-dot w-2 h-2 rounded-full bg-alex-accent" />
                <span className="typing-dot w-2 h-2 rounded-full bg-alex-accent" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-800 p-4">
        <div className="flex gap-3 max-w-3xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Demandez quelque chose \u00e0 ${agent.name}...`}
            rows={1}
            className="flex-1 bg-alex-card border border-gray-700 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-alex-primary transition-colors placeholder-gray-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-4 py-3 rounded-xl bg-alex-primary hover:bg-alex-primary/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

function generateResponse(userInput: string, agent: Agent): string {
  const input = userInput.toLowerCase()

  if (input.includes('code') || input.includes('fonction') || input.includes('program')) {
    return `Bien s\u00fbr ! Je peux vous aider \u00e0 coder. Dites-moi :\n\n1. Quel langage de programmation ?\n2. Que doit faire le code ?\n3. Y a-t-il des contraintes particuli\u00e8res ?\n\nJe vais vous cr\u00e9er un code propre et bien structur\u00e9.`
  }

  if (input.includes('agent') || input.includes('cr\u00e9er') || input.includes('nouveau')) {
    return `Pour cr\u00e9er un nouvel agent IA, utilisez le bouton "Cr\u00e9er un agent" dans la barre lat\u00e9rale. Vous pourrez :\n\n- Lui donner un nom\n- D\u00e9finir sa personnalit\u00e9\n- Choisir ses comp\u00e9tences\n\nChaque agent peut \u00eatre sp\u00e9cialis\u00e9 dans un domaine diff\u00e9rent !`
  }

  if (input.includes('bonjour') || input.includes('salut') || input.includes('hey')) {
    return `Bonjour ! Je suis ${agent.name}, votre assistant IA. Comment puis-je vous aider aujourd'hui ? Je peux :\n\n- \u00c9crire du code\n- Cr\u00e9er des structures de projets\n- R\u00e9pondre \u00e0 vos questions\n- Et bien plus encore !`
  }

  return `J'ai bien re\u00e7u votre message. En mode d\u00e9mo, mes r\u00e9ponses sont limit\u00e9es. Pour des r\u00e9ponses IA compl\u00e8tes, connectez l'API Claude dans le fichier .env.local.\n\nVotre message : "${userInput}"`
}
