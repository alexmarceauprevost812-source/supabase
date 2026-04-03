import { Plus, Bot, Bell, ChevronLeft } from 'lucide-react'
import { useState, useCallback } from 'react'
import { AddEventModal } from './AddEventModal'
import { AIChat } from './AIChat'
import { CalendarSidebar } from './CalendarSidebar'
import { DayTimeline } from './DayTimeline'
import { EventNotification } from './EventNotification'
import { LockScreen } from './LockScreen'
import { useAgendaStore } from './useAgendaStore'

type AppView = 'month' | 'day'

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
  const [view, setView] = useState<AppView>('month')
  const [isZooming, setIsZooming] = useState(false)
  const [prefillTime, setPrefillTime] = useState<string | undefined>()
  const [notifEnabled, setNotifEnabled] = useState(true)

  // Zoom transition into day view
  const handleDayClick = useCallback((date: Date) => {
    setSelectedDate(date)
    setIsZooming(true)
    setTimeout(() => {
      setView('day')
      setTimeout(() => setIsZooming(false), 50)
    }, 400)
  }, [setSelectedDate])

  // Back to month view
  const handleBackToMonth = useCallback(() => {
    setIsZooming(true)
    setTimeout(() => {
      setView('month')
      setTimeout(() => setIsZooming(false), 50)
    }, 300)
  }, [])

  // Add event at specific time from timeline
  const handleAddAtTime = useCallback((time: string) => {
    setPrefillTime(time)
    setShowAddModal(true)
  }, [])

  const handleOpenAddModal = useCallback(() => {
    setPrefillTime(undefined)
    setShowAddModal(true)
  }, [])

  if (isLocked) {
    return <LockScreen onUnlock={() => setIsLocked(false)} />
  }

  return (
    <div className="flex h-full bg-[#0a0a0f] text-white">
      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-5 py-3 z-10">
          <div className="flex items-center gap-2.5">
            {view === 'day' ? (
              <button
                onClick={handleBackToMonth}
                className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-all"
              >
                <ChevronLeft size={18} />
              </button>
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.15)]">
                <span className="text-[10px] font-black text-white">tl</span>
              </div>
            )}
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight">ti-lex</h1>
              <p className="text-[10px] text-white/25">
                {view === 'day' ? 'Vue journée' : 'Agenda IA'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <button
              onClick={() => setNotifEnabled(!notifEnabled)}
              className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                notifEnabled
                  ? 'bg-amber-400/15 text-amber-400'
                  : 'bg-white/[0.06] text-white/20'
              }`}
            >
              <Bell size={16} style={notifEnabled ? { animation: 'bellSwing 2s ease-in-out infinite' } : undefined} />
              {notifEnabled && (
                <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
              )}
            </button>

            {/* AI Toggle */}
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
        </div>

        {/* Content with zoom transition */}
        <div
          className={`flex-1 flex flex-col min-h-0 transition-all duration-400 ${
            isZooming
              ? view === 'month'
                ? 'scale-110 opacity-0'
                : 'scale-90 opacity-0'
              : 'scale-100 opacity-100'
          }`}
          style={{ transitionDuration: '400ms', transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
        >
          {view === 'month' ? (
            <>
              {/* Calendar Month View */}
              <CalendarSidebar
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                onDayClick={handleDayClick}
                events={events}
              />

              {/* Quick event count below calendar */}
              <div className="px-5 py-4 flex-1">
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
                  <p className="text-xs text-white/30 mb-3 uppercase tracking-wider font-semibold">
                    Cliquez sur un jour pour voir le planning
                  </p>
                  <div className="flex gap-3">
                    <div className="flex-1 bg-white/[0.04] rounded-xl p-3 text-center">
                      <span className="text-2xl font-black text-cyan-400">{events.length}</span>
                      <p className="text-[10px] text-white/30 mt-1">Total événements</p>
                    </div>
                    <div className="flex-1 bg-white/[0.04] rounded-xl p-3 text-center">
                      <span className="text-2xl font-black text-amber-400">
                        {events.filter((e) => e.date === new Date().toISOString().split('T')[0]).length}
                      </span>
                      <p className="text-[10px] text-white/30 mt-1">Aujourd'hui</p>
                    </div>
                    <div className="flex-1 bg-white/[0.04] rounded-xl p-3 text-center">
                      <span className="text-2xl font-black text-purple-400">
                        {events.filter((e) => e.priority === 'high').length}
                      </span>
                      <p className="text-[10px] text-white/30 mt-1">Priorité haute</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Day Timeline View */
            <DayTimeline
              events={events}
              selectedDate={selectedDate}
              onDeleteEvent={removeEvent}
              onAddEventAtTime={handleAddAtTime}
            />
          )}
        </div>

        {/* FAB */}
        <button
          onClick={handleOpenAddModal}
          className="fixed bottom-6 w-14 h-14 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black flex items-center justify-center shadow-[0_4px_20px_rgba(34,211,238,0.4)] hover:shadow-[0_4px_30px_rgba(34,211,238,0.5)] transition-all hover:scale-105 active:scale-95 z-20"
          style={{ right: showAI ? '344px' : '24px' }}
        >
          <Plus size={24} strokeWidth={2.5} />
        </button>
      </div>

      {/* AI Chat Panel */}
      {showAI && <AIChat messages={messages} onSendMessage={sendMessage} />}

      {/* Add Event Modal */}
      {showAddModal && (
        <AddEventModal
          selectedDate={selectedDate}
          onAdd={addEvent}
          onClose={() => setShowAddModal(false)}
          prefillTime={prefillTime}
        />
      )}

      {/* Event Notification */}
      {notifEnabled && <EventNotification events={events} />}

      <style jsx>{`
        @keyframes bellSwing {
          0%, 100% { transform: rotate(0deg); }
          10% { transform: rotate(12deg); }
          20% { transform: rotate(-10deg); }
          30% { transform: rotate(6deg); }
          40% { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  )
}
