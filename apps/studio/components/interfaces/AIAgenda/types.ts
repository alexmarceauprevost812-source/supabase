export interface AgendaEvent {
  id: string
  title: string
  description: string
  date: string // ISO date string
  startTime: string // HH:mm
  endTime: string // HH:mm
  category: EventCategory
  priority: EventPriority
  aiSuggested?: boolean
}

export type EventCategory = 'meeting' | 'task' | 'reminder' | 'focus' | 'break'
export type EventPriority = 'high' | 'medium' | 'low'
export type ViewMode = 'day' | 'week' | 'month'

export interface AIMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}
