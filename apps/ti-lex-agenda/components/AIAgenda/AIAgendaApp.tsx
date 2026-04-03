import { Plus, Bot, Bell, ChevronLeft, Smile, Power, Shield, Wand2, Info, Lock } from 'lucide-react'
import { useState, useCallback } from 'react'
import { AboutCreator } from './AboutCreator'
import { AuthScreen } from './AuthScreen'
import { AddEventModal } from './AddEventModal'
import { AIChat } from './AIChat'
import { CalendarSidebar } from './CalendarSidebar'
import { DayTimeline } from './DayTimeline'
import { ScreenEffect } from './effects/ScreenEffect'
import { useWordEffects } from './effects/useWordEffects'
import { DEFAULT_WORD_EFFECTS, EffectType, WordEffect } from './effects/wordEffects'
import { WordEffectsSettings } from './effects/WordEffectsSettings'
import { EmojiAnimations } from './emojis/EmojiAnimations'
import { EmojiPanel } from './emojis/EmojiPanel'
import { EventNotification } from './EventNotification'
import { FriendsPanel } from './FriendsPanel'
import { LockScreen } from './LockScreen'
import { MascotPopup } from './MascotPopup'
import { PrivacySettingsPanel } from './PrivacySettings'
import { SecuritySettings, SecurityConfig, DEFAULT_SECURITY } from './SecuritySettings'
import { TVShutdown } from './TVShutdown'
import { TVStartup } from './TVStartup'
import { useAgendaStore } from './useAgendaStore'

type AppView = 'month' | 'day'

export function AIAgendaApp() {
  const {
    events,
    selectedDate,
    setSelectedDate,
    privacySettings,
    setPrivacySettings,
    addEvent,
    removeEvent,
    messages,
    sendMessage,
  } = useAgendaStore()

  const [showStartup, setShowStartup] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [securityConfig, setSecurityConfig] = useState<SecurityConfig>(DEFAULT_SECURITY)
  const [isLocked, setIsLocked] = useState(false) // disabled by default
  const [showSecurity, setShowSecurity] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showContacts, setShowContacts] = useState(false)
  const [showAI, setShowAI] = useState(false)
  const [showEmojis, setShowEmojis] = useState(false)
  const [view, setView] = useState<AppView>('month')
  const [isZooming, setIsZooming] = useState(false)
  const [prefillTime, setPrefillTime] = useState<string | undefined>()
  const [notifEnabled, setNotifEnabled] = useState(true)
  const [showMascot, setShowMascot] = useState(false)
  const [showTVOff, setShowTVOff] = useState(false)
  const [wordEffects, setWordEffects] = useState<WordEffect[]>(DEFAULT_WORD_EFFECTS)
  const [showWordEffectSettings, setShowWordEffectSettings] = useState(false)
  const [activeScreenEffect, setActiveScreenEffect] = useState<EffectType | null>(null)
  const [showAbout, setShowAbout] = useState(false)

  const { checkText } = useWordEffects(wordEffects)

  // Wrap sendMessage to detect trigger words
  const handleSendMessage = useCallback((content: string) => {
    sendMessage(content)
    const effect = checkText(content)
    if (effect) setActiveScreenEffect(effect)
  }, [sendMessage, checkText])

  // Wrap addEvent to detect trigger words in title/description
  const handleAddEvent = useCallback((event: Parameters<typeof addEvent>[0]) => {
    addEvent(event)
    const text = `${event.title} ${event.description}`
    const effect = checkText(text)
    if (effect) setActiveScreenEffect(effect)
  }, [addEvent, checkText])

  // Zoom transition into day view
  const handleDayClick = useCallback((date: Date) => {
    setSelectedDate(date)
    setIsZooming(true)
    setTimeout(() => {
      setView('day')
      setTimeout(() => setIsZooming(false), 50)
    }, 400)
  }, [setSelectedDate])

  // Back = TV shutdown effect then lock the app
  const handleBack = useCallback(() => {
    setShowTVOff(true)
  }, [])

  const handleTVShutdownComplete = useCallback(() => {
    setShowTVOff(false)
    setView('month')
    if (securityConfig.lockEnabled) setIsLocked(true)
    setShowAI(false)
    setShowEmojis(false)
  }, [securityConfig.lockEnabled])

  // Back to month view (from day view, no TV effect)
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
    setShowMascot(true)
  }, [])

  const handleOpenAddModal = useCallback(() => {
    setPrefillTime(undefined)
    setShowMascot(true)
  }, [])

  const handleMascotComplete = useCallback(() => {
    setShowAddModal(true)
  }, [])

  const handleSelectEmoji = useCallback((emojiId: string, packStyle: string) => {
    // Could integrate emoji into event creation or chat
    sendMessage(`[émoji: ${emojiId} (${packStyle})]`)
    setShowEmojis(false)
  }, [sendMessage])

  // Phase 1: TV Startup animation (old 80s TV turning ON)
  if (showStartup) {
    return <TVStartup onComplete={() => setShowStartup(false)} />
  }

  // Phase 2: Auth screen (inscription / connexion / invité)
  if (!isAuthenticated) {
    return <AuthScreen onAuth={() => setIsAuthenticated(true)} />
  }

  // Phase 3: Lock screen (only if enabled in security settings)
  if (isLocked && securityConfig.lockEnabled) {
    return (
      <LockScreen
        onUnlock={() => setIsLocked(false)}
        method={securityConfig.lockMethod}
        password={securityConfig.password}
        pin={securityConfig.pin}
      />
    )
  }

  return (
    <div className="app-container h-full bg-black text-white relative overflow-hidden">
      {/* Global emoji animations */}
      <EmojiAnimations />

      {/* Main Panel - full width */}
      <div className="w-full h-full flex flex-col relative overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-3 py-2 z-10">
          <div className="flex items-center gap-2.5">
            {view === 'day' ? (
              <button
                onClick={handleBackToMonth}
                className="w-12 h-12 rounded-full bg-white/[0.06] flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-all"
              >
                <ChevronLeft size={24} />
              </button>
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.15)]">
                <span className="text-sm font-black text-white">tl</span>
              </div>
            )}
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight">ti-lex</h1>
              <p className="text-[10px] text-white/25">
                {view === 'day' ? 'Vue journée' : 'Agenda IA'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto flex-shrink-0">
            {/* Security Settings */}
            <button
              onClick={() => setShowSecurity(true)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                securityConfig.lockEnabled
                  ? 'bg-cyan-500/15 text-cyan-400'
                  : 'bg-white/[0.06] text-white/30 hover:bg-white/10'
              }`}
              title="Sécurité de l'agenda"
            >
              <Lock size={20} />
            </button>

            {/* About / Copyright */}
            <button
              onClick={() => setShowAbout(true)}
              className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400/60 hover:bg-amber-500/20 hover:text-amber-400 transition-all"
              title="À propos · Droits d'auteur"
            >
              <Info size={20} />
            </button>

            {/* Privacy Settings */}
            <button
              onClick={() => setShowPrivacy(true)}
              className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400/60 hover:bg-emerald-500/20 hover:text-emerald-400 transition-all"
              title="Paramètres de confidentialité"
            >
              <Shield size={20} />
            </button>

            {/* Power Off / Back button */}
            <button
              onClick={handleBack}
              className="w-12 h-12 rounded-full bg-white/[0.06] flex items-center justify-center text-white/20 hover:bg-red-500/20 hover:text-red-400 transition-all"
              title="Fermer (effet TV)"
            >
              <Power size={20} />
            </button>

            {/* Word Effects Button */}
            <button
              onClick={() => setShowWordEffectSettings(true)}
              className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400/60 hover:bg-purple-500/20 hover:text-purple-400 transition-all"
              title="Effets sur les mots"
            >
              <Wand2 size={20} />
            </button>

            {/* Emoji Button */}
            <button
              onClick={() => setShowEmojis(!showEmojis)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                showEmojis
                  ? 'bg-purple-500/20 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                  : 'bg-white/[0.06] text-white/40 hover:bg-white/10'
              }`}
            >
              <Smile size={22} />
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setNotifEnabled(!notifEnabled)}
              className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                notifEnabled
                  ? 'bg-amber-400/15 text-amber-400'
                  : 'bg-white/[0.06] text-white/20'
              }`}
            >
              <Bell size={22} style={notifEnabled ? { animation: 'bellSwing 2s ease-in-out infinite' } : undefined} />
              {notifEnabled && (
                <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
              )}
            </button>

            {/* AI Toggle */}
            <button
              onClick={() => setShowAI(!showAI)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                showAI
                  ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                  : 'bg-white/[0.06] text-white/40 hover:bg-white/10'
              }`}
            >
              <Bot size={22} />
            </button>
          </div>
        </div>

        {/* Content with zoom transition */}
        <div
          className={`flex-1 flex flex-col min-h-0 transition-all ${
            isZooming
              ? view === 'month'
                ? 'scale-110 opacity-0'
                : 'scale-90 opacity-0'
              : 'scale-100 opacity-100'
          }`}
          style={{ transitionDuration: '400ms', transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
        >
          {view === 'month' ? (
            /* Calendar Month View — fills 100% of screen */
            <CalendarSidebar
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              onDayClick={handleDayClick}
              events={events}
            />
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

        {/* FAB — big + button orange */}
        <button
          onClick={handleOpenAddModal}
          className="fixed bottom-8 right-5 w-20 h-20 rounded-full bg-orange-500 hover:bg-orange-400 text-white flex items-center justify-center shadow-[0_6px_30px_rgba(249,115,22,0.5)] hover:shadow-[0_6px_40px_rgba(249,115,22,0.6)] transition-all hover:scale-110 active:scale-95 z-20"
        >
          <Plus size={36} strokeWidth={3} />
        </button>
      </div>

      {/* AI Chat Panel - overlay on mobile */}
      {showAI && (
        <div className="absolute inset-0 z-40 bg-[#0d0d14]">
          <AIChat messages={messages} onSendMessage={handleSendMessage} />
        </div>
      )}

      {/* Add Event Modal */}
      {showAddModal && (
        <AddEventModal
          selectedDate={selectedDate}
          onAdd={handleAddEvent}
          onClose={() => { setShowAddModal(false); setShowMascot(false) }}
          prefillTime={prefillTime}
          defaultVisibility={privacySettings.defaultVisibility}
        />
      )}

      {/* Mascot Popup */}
      {showMascot && (
        <MascotPopup onComplete={handleMascotComplete} />
      )}

      {/* Emoji Panel */}
      {showEmojis && (
        <EmojiPanel
          onClose={() => setShowEmojis(false)}
          onSelectEmoji={handleSelectEmoji}
        />
      )}

      {/* About / Copyright */}
      {showAbout && <AboutCreator onClose={() => setShowAbout(false)} />}

      {/* Security Settings */}
      {showSecurity && (
        <SecuritySettings
          config={securityConfig}
          onUpdate={(cfg) => { setSecurityConfig(cfg); if (cfg.lockEnabled) setIsLocked(false) }}
          onClose={() => setShowSecurity(false)}
        />
      )}

      {/* Word Effects Settings */}
      {showWordEffectSettings && (
        <WordEffectsSettings
          effects={wordEffects}
          onUpdate={setWordEffects}
          onClose={() => setShowWordEffectSettings(false)}
        />
      )}

      {/* Screen Effect (triggered by word) */}
      {activeScreenEffect && (
        <ScreenEffect effectType={activeScreenEffect} onComplete={() => setActiveScreenEffect(null)} />
      )}

      {/* Privacy Settings Panel */}
      {showPrivacy && (
        <PrivacySettingsPanel
          settings={privacySettings}
          onUpdate={setPrivacySettings}
          onClose={() => setShowPrivacy(false)}
        />
      )}

      {/* Contacts / Friends Panel */}
      {showContacts && (
        <FriendsPanel
          onClose={() => setShowContacts(false)}
          selectedFriends={[]}
          onToggleFriend={() => {}}
          mode="browse"
        />
      )}

      {/* TV Shutdown Effect */}
      {showTVOff && <TVShutdown onComplete={handleTVShutdownComplete} />}

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
