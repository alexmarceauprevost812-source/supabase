import { Plus, Bot } from 'lucide-react'
import { useState } from 'react'
import { AddEventModal } from './AddEventModal'
import { AIChat } from './AIChat'
import { CalendarSidebar } from './CalendarSidebar'
import { EventList } from './EventList'
import { EventNotification } from './EventNotification'
import { LockScreen } from './LockScreen'
import { useAgendaStore } from './useAgendaStore'

export function AIAgendaApp() {
  const {
    events,
    selectedDate,
    setSelectedDate,
    addEvent,
    removeEvent,
    messages,
    sendMessage,
  } = useAgendaStore()

  const [isLocked, setIsLocked] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAI, setShowAI] = useState(false)

  if (isLocked) {
    return <LockScreen onUnlock={() => setIsLocked(false)} />
  }

  return (
    <div className="flex h-full bg-[#0a0a0f] text-white">
      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.15)]">
              <span className="text-[10px] font-black text-white">tl</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight">ti-lex</h1>
              <p className="text-[10px] text-white/25">Agenda IA</p>
            </div>
          </div>
          <button
            onClick={() => setShowAI(!showAI)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              showAI
                ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                : 'bg-white/[0.06] text-white/40 hover:bg-white/10'
            }`}
          >
            <Bot size={18} />
          </button>
        </div>

        {/* Calendar */}
        <CalendarSidebar
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          events={events}
        />

        {/* Event List */}
        <EventList events={events} selectedDate={selectedDate} onDeleteEvent={removeEvent} />

        {/* FAB - Floating Action Button (Samsung style) */}
        <button
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black flex items-center justify-center shadow-[0_4px_20px_rgba(34,211,238,0.4)] hover:shadow-[0_4px_30px_rgba(34,211,238,0.5)] transition-all hover:scale-105 active:scale-95 z-20"
          style={showAI ? { right: '344px' } : undefined}
        >
          <Plus size={24} strokeWidth={2.5} />
        </button>
      </div>

      {/* AI Chat Panel (slide in) */}
      {showAI && <AIChat messages={messages} onSendMessage={sendMessage} />}

      {/* Add Event Modal */}
      {showAddModal && (
        <AddEventModal
          selectedDate={selectedDate}
          onAdd={addEvent}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Event Notification - 5 min before */}
      <EventNotification events={events} />
    </div>
  )
}
