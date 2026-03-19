'use client'

import type { Agent } from '@/lib/types'

interface SidebarProps {
  agents: Agent[]
  selectedAgent: Agent | null
  onSelectAgent: (agent: Agent) => void
  onNewAgent: () => void
  onClose: () => void
}

export function Sidebar({ agents, selectedAgent, onSelectAgent, onNewAgent, onClose }: SidebarProps) {
  return (
    <aside className="w-72 bg-alex-card border-r border-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-alex-primary to-alex-accent flex items-center justify-center text-sm font-bold">
            A
          </div>
          <span className="font-bold text-lg">AlexGPT</span>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-gray-700 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>

      <div className="p-3">
        <button
          onClick={onNewAgent}
          className="w-full px-4 py-2.5 rounded-xl bg-alex-primary/20 border border-alex-primary/30 hover:bg-alex-primary/30 transition-colors text-alex-accent font-medium flex items-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Cr&eacute;er un agent
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <p className="text-xs text-gray-500 uppercase tracking-wider px-2 mb-2">Mes Agents</p>
        {agents.map((agent) => (
          <button
            key={agent.id}
            onClick={() => onSelectAgent(agent)}
            className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center gap-3 ${
              selectedAgent?.id === agent.id
                ? 'bg-alex-primary/20 text-white'
                : 'hover:bg-gray-700/50 text-gray-400'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-alex-primary/60 to-alex-accent/60 flex items-center justify-center text-xs font-bold shrink-0">
              {agent.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="font-medium text-sm truncate">{agent.name}</p>
              <p className="text-xs text-gray-500 truncate">{agent.description}</p>
            </div>
          </button>
        ))}
      </div>
    </aside>
  )
}
