import { useState, useCallback } from 'react'
import { AgendaEvent, AIMessage, PrivacySettings } from './types'

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
    visibility: 'private',
    invitedFriends: ['f1', 'f2'],
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
    visibility: 'private',
    invitedFriends: [],
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
    visibility: 'friends',
    invitedFriends: ['f1', 'f5'],
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
    visibility: 'private',
    invitedFriends: [],
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
    visibility: 'private',
    invitedFriends: [],
  },
]

const DEFAULT_PRIVACY: PrivacySettings = {
  defaultVisibility: 'private',
  showOnlineStatus: false,
  allowFriendRequests: true,
  shareCalendar: false,
}

const AI_RESPONSES: Record<string, string> = {
  optimize:
    'J\'ai analysé ton emploi du temps. Je suggère de déplacer "Code Review" à 13h30 juste après le déjeuner, pour garder ton flow de deep work le matin sans interruption.',
  suggest:
    'Selon ta charge de travail, je recommande d\'ajouter une pause de 15 min à 15h00. Les études montrent que les pauses courtes améliorent la productivité de 25%.',
  conflict:
    'J\'ai remarqué qu\'il n\'y a pas de buffer entre "Sprint Planning" et "Deep Work". Ajoute une période de transition de 15 minutes.',
  privacy:
    'Ton agenda est en mode privé 🔒. Seul toi peux voir tes événements. Pour partager avec des amis, change la visibilité dans les paramètres ou lors de la création d\'un événement.',
  default:
    'Je peux optimiser ton planning, suggérer des pauses, détecter les conflits ou créer de nouveaux événements. Que veux-tu faire ?',
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
  if (lower.includes('priv') || lower.includes('sécu') || lower.includes('visib') || lower.includes('partag')) {
    return AI_RESPONSES.privacy
  }
  return AI_RESPONSES.default
}

export function useAgendaStore() {
  const [events, setEvents] = useState<AgendaEvent[]>(SAMPLE_EVENTS)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(DEFAULT_PRIVACY)
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content:
        "Salut ! Je suis ti-lex, ton assistant IA de planification. Je peux optimiser ton agenda, suggérer des pauses, détecter les conflits et gérer tes événements. 🔒 Mode privé activé par défaut. Comment puis-je t'aider ?",
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
    privacySettings,
    setPrivacySettings,
    addEvent,
    removeEvent,
    messages,
    sendMessage,
  }
}
