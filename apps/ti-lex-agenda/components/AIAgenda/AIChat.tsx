import { Bot, Send, User, Sparkles } from 'lucide-react'
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
    <div className="w-full h-full bg-[#0d0d14] flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">ti-lex IA</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-[10px] text-white/30">En ligne</p>
            </div>
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
              className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${
                msg.role === 'assistant'
                  ? 'bg-gradient-to-br from-cyan-400 to-blue-600'
                  : 'bg-white/10'
              }`}
            >
              {msg.role === 'assistant' ? (
                <Bot size={13} className="text-white" />
              ) : (
                <User size={13} className="text-white/60" />
              )}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                msg.role === 'assistant'
                  ? 'bg-white/[0.06] text-white/80 rounded-tl-md'
                  : 'bg-cyan-500 text-black font-medium rounded-tr-md'
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
        {['Optimiser', 'Pause ?', 'Conflits'].map((action) => (
          <button
            key={action}
            onClick={() => onSendMessage(action)}
            className="text-[10px] px-2.5 py-1.5 rounded-full border border-cyan-400/20 text-cyan-400/70 hover:bg-cyan-400/10 hover:text-cyan-400 transition-colors"
          >
            {action}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-2 bg-white/[0.05] border border-white/[0.08] rounded-2xl px-4 py-2.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Demandez à ti-lex..."
            className="flex-1 bg-transparent text-xs text-white placeholder:text-white/20 outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-7 h-7 rounded-full bg-cyan-500 text-black flex items-center justify-center disabled:opacity-20 hover:bg-cyan-400 transition-colors"
          >
            <Send size={12} />
          </button>
        </div>
      </form>
    </div>
  )
}
