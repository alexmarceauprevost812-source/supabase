export interface Agent {
  id: string
  name: string
  description: string
  avatar_url: string | null
  system_prompt: string
  user_id: string
  created_at: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  agent_id: string
  user_id: string
  created_at: string
}

export interface Conversation {
  id: string
  title: string
  agent_id: string
  user_id: string
  created_at: string
  messages: Message[]
}
