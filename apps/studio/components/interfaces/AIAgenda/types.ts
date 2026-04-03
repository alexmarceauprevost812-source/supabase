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
  visibility: EventVisibility
  invitedFriends: string[] // friend IDs
}

export type EventCategory = 'meeting' | 'task' | 'reminder' | 'focus' | 'break'
export type EventPriority = 'high' | 'medium' | 'low'
export type ViewMode = 'day' | 'week' | 'month'

/** Privacy: always private by default */
export type EventVisibility = 'private' | 'friends' | 'public'

export interface AIMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface Contact {
  id: string
  name: string
  avatar: string // initials or emoji
  source: SocialSource
  online?: boolean
}

export type SocialSource = 'tilex' | 'facebook' | 'instagram' | 'manual'

export interface PrivacySettings {
  defaultVisibility: EventVisibility
  showOnlineStatus: boolean
  allowFriendRequests: boolean
  shareCalendar: boolean
}
