import { Plus, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { AddEventModal } from './AddEventModal'
import { AIChat } from './AIChat'
import { CalendarSidebar } from './CalendarSidebar'
import { DayView } from './DayView'
import { LockScreen } from './LockScreen'
import { useAgendaStore } from './useAgendaStore'

export function AIAgendaApp() {
  const {
    events,
    selectedDate,
    setSelectedDate,
    viewMode,
    setViewMode,
    addEvent,
    removeEvent,
    messages,
    sendMessage,
  } = useAgendaStore()

  const [isLocked, setIsLocked] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)

  if (isLocked) {
    return <LockScreen onUnlock={() => setIsLocked(false)} />
  }

  return (
    <div className="flex h-full bg-background">
      {/* Left Sidebar - Calendar */}
      <CalendarSidebar
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-border-default bg-surface-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center shadow-sm">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground">AI Agenda</h1>
              <p className="text-[11px] text-foreground-muted">
                Planification intelligente propulsée par l'IA
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
          >
            <Plus size={16} />
            Ajouter
          </button>
        </div>

        {/* Day View */}
        <DayView events={events} selectedDate={selectedDate} onDeleteEvent={removeEvent} />
      </div>

      {/* Right Sidebar - AI Chat */}
      <AIChat messages={messages} onSendMessage={sendMessage} />

      {/* Add Event Modal */}
      {showAddModal && (
        <AddEventModal
          selectedDate={selectedDate}
          onAdd={addEvent}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  )
}
