import { Bot, Send, User } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { AIMessage } from './types'

interface AIChatProps {
  messages: AIMessage[]
  onSendMessage: (content: string) => void
}

export function AIChat({ messages, onSendMessage }: AIChatProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    onSendMessage(input.trim())
    setInput('')
  }

  return (
    <div className="w-80 border-l border-border-default bg-surface-100 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border-default bg-gradient-to-r from-brand-500/10 to-purple-500/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center shadow-sm">
            <Bot size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Assistant IA</h3>
            <p className="text-[10px] text-foreground-muted">Planification intelligente</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-3 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center ${
                msg.role === 'assistant'
                  ? 'bg-gradient-to-br from-brand-500 to-purple-500'
                  : 'bg-surface-300'
              }`}
            >
              {msg.role === 'assistant' ? (
                <Bot size={12} className="text-white" />
              ) : (
                <User size={12} className="text-foreground-light" />
              )}
            </div>
            <div
              className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                msg.role === 'assistant'
                  ? 'bg-surface-200 text-foreground'
                  : 'bg-brand-500 text-white'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-3 py-2 flex gap-1.5 flex-wrap">
        {['Optimiser', 'Suggérer une pause', 'Détecter conflits'].map((action) => (
          <button
            key={action}
            onClick={() => onSendMessage(action)}
            className="text-[10px] px-2 py-1 rounded-full border border-brand-500/30 text-brand-600 hover:bg-brand-500/10 transition-colors"
          >
            {action}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-border-default">
        <div className="flex items-center gap-2 bg-surface-200 rounded-xl px-3 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Demandez à l'IA..."
            className="flex-1 bg-transparent text-xs text-foreground placeholder:text-foreground-muted outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-1.5 rounded-lg bg-brand-500 text-white disabled:opacity-40 hover:bg-brand-600 transition-colors"
          >
            <Send size={12} />
          </button>
        </div>
      </form>
    </div>
  )
}
