import { useState, useCallback } from 'react'
import { AgendaEvent, AIMessage, ViewMode } from './types'

const SAMPLE_EVENTS: AgendaEvent[] = [
  {
    id: '1',
    title: 'Sprint Planning',
    description: 'Weekly sprint planning session with the team',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    category: 'meeting',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Deep Work: API Development',
    description: 'Focus time for backend API implementation',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:30',
    endTime: '12:30',
    category: 'focus',
    priority: 'high',
  },
  {
    id: '3',
    title: 'Lunch Break',
    description: 'Take a break and recharge',
    date: new Date().toISOString().split('T')[0],
    startTime: '12:30',
    endTime: '13:30',
    category: 'break',
    priority: 'low',
  },
  {
    id: '4',
    title: 'Code Review',
    description: 'Review pull requests from the team',
    date: new Date().toISOString().split('T')[0],
    startTime: '14:00',
    endTime: '15:00',
    category: 'task',
    priority: 'medium',
  },
  {
    id: '5',
    title: 'Deploy Reminder',
    description: 'Deploy staging environment changes',
    date: new Date().toISOString().split('T')[0],
    startTime: '16:00',
    endTime: '16:30',
    category: 'reminder',
    priority: 'medium',
    aiSuggested: true,
  },
]

const AI_RESPONSES: Record<string, string> = {
  optimize:
    'I analyzed your schedule and suggest moving "Code Review" to 13:30 right after lunch, so you can maintain your deep work flow in the morning without interruption.',
  suggest:
    'Based on your workload, I recommend adding a 15-minute break at 15:00. Studies show short breaks improve afternoon productivity by 25%.',
  conflict:
    'I noticed you have no buffer between "Sprint Planning" and "Deep Work". Consider adding a 15-minute transition period.',
  default:
    "I can help you optimize your schedule, suggest breaks, detect conflicts, or create new events. What would you like to do?",
}

function getAIResponse(input: string): string {
  const lower = input.toLowerCase()
  if (lower.includes('optim') || lower.includes('improve') || lower.includes('better')) {
    return AI_RESPONSES.optimize
  }
  if (lower.includes('suggest') || lower.includes('recommend') || lower.includes('add')) {
    return AI_RESPONSES.suggest
  }
  if (lower.includes('conflict') || lower.includes('overlap') || lower.includes('issue')) {
    return AI_RESPONSES.conflict
  }
  return AI_RESPONSES.default
}

export function useAgendaStore() {
  const [events, setEvents] = useState<AgendaEvent[]>(SAMPLE_EVENTS)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<ViewMode>('day')
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content:
        "Hello! I'm your AI scheduling assistant. I can help you optimize your agenda, suggest breaks, detect conflicts, and manage your events. How can I help you today?",
      timestamp: new Date(),
    },
  ])

  const addEvent = useCallback((event: Omit<AgendaEvent, 'id'>) => {
    setEvents((prev) => [...prev, { ...event, id: crypto.randomUUID() }])
  }, [])

  const removeEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const sendMessage = useCallback((content: string) => {
    const userMsg: AIMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    const assistantMsg: AIMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: getAIResponse(content),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg, assistantMsg])
  }, [])

  return {
    events,
    selectedDate,
    setSelectedDate,
    viewMode,
    setViewMode,
    addEvent,
    removeEvent,
    messages,
    sendMessage,
  }
}
