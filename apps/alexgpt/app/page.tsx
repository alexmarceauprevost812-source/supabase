'use client'

import { useState } from 'react'
import { ChatInterface } from '@/components/ChatInterface'
import { Sidebar } from '@/components/Sidebar'
import { AgentCreator } from '@/components/AgentCreator'
import { WelcomeScreen } from '@/components/WelcomeScreen'
import type { Agent } from '@/lib/types'

const DEFAULT_AGENT: Agent = {
  id: 'alexgpt-default',
  name: 'AlexGPT',
  description: 'Assistant IA principal - je peux coder, créer et vous aider avec tout.',
  avatar_url: null,
  system_prompt: 'Tu es AlexGPT, un assistant IA expert en programmation et création. Tu aides les utilisateurs à coder, structurer des projets, et créer ce qu\'ils veulent. Réponds en français.',
  user_id: '',
  created_at: new Date().toISOString(),
}

export default function Home() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [showAgentCreator, setShowAgentCreator] = useState(false)
  const [agents, setAgents] = useState<Agent[]>([DEFAULT_AGENT])
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleCreateAgent = (agent: Agent) => {
    setAgents((prev) => [...prev, agent])
    setShowAgentCreator(false)
    setSelectedAgent(agent)
  }

  return (
    <div className="flex h-screen">
      {sidebarOpen && (
        <Sidebar
          agents={agents}
          selectedAgent={selectedAgent}
          onSelectAgent={setSelectedAgent}
          onNewAgent={() => setShowAgentCreator(true)}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 flex flex-col">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute top-4 left-4 z-10 p-2 rounded-lg bg-alex-card hover:bg-alex-primary/20 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
        )}

        {showAgentCreator ? (
          <AgentCreator
            onSave={handleCreateAgent}
            onCancel={() => setShowAgentCreator(false)}
          />
        ) : selectedAgent ? (
          <ChatInterface agent={selectedAgent} />
        ) : (
          <WelcomeScreen onSelectAgent={() => setSelectedAgent(DEFAULT_AGENT)} />
        )}
      </main>
    </div>
  )
}
