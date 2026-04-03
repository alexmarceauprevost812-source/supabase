import { Bell, Clock, X } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { AgendaEvent } from './types'

interface EventNotificationProps {
  events: AgendaEvent[]
}

interface ActiveNotification {
  event: AgendaEvent
  id: string
}

export function EventNotification({ events }: EventNotificationProps) {
  const [notification, setNotification] = useState<ActiveNotification | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [notifiedIds, setNotifiedIds] = useState<Set<string>>(new Set())

  const dismiss = useCallback(() => {
    setIsVisible(false)
    setTimeout(() => setNotification(null), 500)
  }, [])

  useEffect(() => {
    const checkEvents = () => {
      const now = new Date()
      const todayStr = now.toISOString().split('T')[0]
      const currentMinutes = now.getHours() * 60 + now.getMinutes()

      for (const event of events) {
        if (event.date !== todayStr) continue
        if (notifiedIds.has(event.id)) continue

        const [hours, mins] = event.startTime.split(':').map(Number)
        const eventMinutes = hours * 60 + mins
        const diff = eventMinutes - currentMinutes

        // Notify 5 minutes before
        if (diff >= 0 && diff <= 5) {
          setNotifiedIds((prev) => new Set(prev).add(event.id))
          setNotification({ event, id: crypto.randomUUID() })
          setIsVisible(true)

          // Auto dismiss after 10 seconds
          setTimeout(() => {
            setIsVisible(false)
            setTimeout(() => setNotification(null), 500)
          }, 10000)
          break
        }
      }
    }

    checkEvents()
    const interval = setInterval(checkEvents, 30000) // Check every 30s
    return () => clearInterval(interval)
  }, [events, notifiedIds])

  // Demo trigger: double-click anywhere to test notification with first event
  useEffect(() => {
    const handleDblClick = () => {
      const testEvent = events[0]
      if (!testEvent) return
      setNotification({ event: testEvent, id: crypto.randomUUID() })
      setIsVisible(true)
      setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => setNotification(null), 500)
      }, 10000)
    }

    window.addEventListener('dblclick', handleDblClick)
    return () => window.removeEventListener('dblclick', handleDblClick)
  }, [events])

  if (!notification) return null

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={dismiss} />

      {/* Flying character SVG */}
      <div
        className="absolute pointer-events-none"
        style={isVisible ? { animation: 'flyAcross 3s ease-in-out infinite' } : undefined}
      >
        <svg width="200" height="300" viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Body - suit */}
          <rect x="55" y="120" width="90" height="120" rx="10" fill="#1e3a5f" />
          {/* Suit lapels */}
          <path d="M100 120 L75 180 L55 120" fill="#16304f" />
          <path d="M100 120 L125 180 L145 120" fill="#16304f" />
          {/* Tie */}
          <path d="M95 120 L100 200 L105 120" fill="#111" />
          {/* Shirt collar */}
          <path d="M85 115 L100 135 L115 115" fill="white" />
          {/* Head */}
          <ellipse cx="100" cy="85" rx="40" ry="45" fill="#f4c99b" />
          {/* Hair */}
          <path d="M60 75 Q65 30 100 35 Q135 30 140 75 Q130 50 100 55 Q70 50 60 75" fill="#1a1a1a" />
          {/* Eyes */}
          <ellipse cx="85" cy="80" rx="10" ry="12" fill="white" />
          <ellipse cx="115" cy="80" rx="10" ry="12" fill="white" />
          <circle cx="88" cy="80" r="4" fill="#222" />
          <circle cx="118" cy="80" r="4" fill="#222" />
          {/* Eyebrows */}
          <path d="M73 68 Q85 60 97 68" stroke="#1a1a1a" strokeWidth="3" fill="none" />
          <path d="M103 68 Q115 60 127 68" stroke="#1a1a1a" strokeWidth="3" fill="none" />
          {/* Mouth - big smile */}
          <path d="M82 100 Q100 118 118 100" stroke="#1a1a1a" strokeWidth="2" fill="white" />
          {/* Chin */}
          <path d="M80 108 Q100 130 120 108" fill="#e8b88a" />
          {/* Right arm pointing up */}
          <path d="M145 140 L170 80 L175 75" stroke="#f4c99b" strokeWidth="14" strokeLinecap="round" fill="none" />
          {/* Pointing finger */}
          <circle cx="175" cy="70" r="6" fill="#f4c99b" />
          <rect x="173" y="45" width="5" height="25" rx="2" fill="#f4c99b" />
          {/* Left arm */}
          <path d="M55 150 L40 200 Q38 210 50 210" stroke="#1e3a5f" strokeWidth="12" strokeLinecap="round" fill="none" />
          {/* Left hand */}
          <circle cx="50" cy="210" r="8" fill="#f4c99b" />
          {/* Legs */}
          <rect x="70" y="235" width="22" height="50" rx="5" fill="#16304f" />
          <rect x="108" y="235" width="22" height="50" rx="5" fill="#16304f" />
          {/* Shoes */}
          <ellipse cx="81" cy="290" rx="18" ry="8" fill="#111" />
          <ellipse cx="119" cy="290" rx="18" ry="8" fill="#111" />
          {/* Badge on suit */}
          <rect x="110" y="135" width="12" height="8" rx="1" fill="#c0392b" />
          <rect x="110" y="135" width="12" height="3" rx="1" fill="#e74c3c" />
        </svg>
      </div>

      {/* Notification Card */}
      <div
        className={`relative z-10 max-w-sm w-full mx-4 transition-all duration-500 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-8'
        }`}
      >
        <div className="bg-[#1a1a24] border border-cyan-400/30 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(34,211,238,0.15)]">
          {/* Top accent */}
          <div className="h-1.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500" />

          <div className="p-6">
            {/* Close button */}
            <button
              onClick={dismiss}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/20 transition-all"
            >
              <X size={14} />
            </button>

            {/* Bell icon animated */}
            <div className="flex justify-center mb-4">
              <div
                className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.3)]"
                style={{ animation: 'bellRing 0.5s ease-in-out infinite alternate' }}
              >
                <Bell size={28} className="text-white" />
              </div>
            </div>

            {/* Message */}
            <div className="text-center mb-5">
              <h2
                className="text-2xl font-black text-white mb-2"
                style={{ animation: 'pulseText 1s ease-in-out infinite' }}
              >
                TIK TAK !
              </h2>
              <p className="text-base font-bold text-cyan-400">
                Prépare-toi, tu vas être en retard !
              </p>
            </div>

            {/* Event details */}
            <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                  <Clock size={20} className="text-cyan-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-white">
                    {notification.event.title}
                  </h3>
                  <p className="text-xs text-white/40 mt-0.5">
                    {notification.event.startTime} — {notification.event.endTime}
                  </p>
                </div>
              </div>
              {notification.event.description && (
                <p className="text-xs text-white/30 mt-2 pl-[52px]">
                  {notification.event.description}
                </p>
              )}
            </div>

            {/* Countdown label */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-bold text-amber-400">Dans 5 minutes</span>
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            </div>

            {/* Dismiss button */}
            <button
              onClick={dismiss}
              className="w-full mt-5 py-3 bg-white/[0.06] hover:bg-white/10 border border-white/[0.08] rounded-2xl text-sm font-semibold text-white/60 hover:text-white transition-all"
            >
              OK, j'ai compris !
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes flyAcross {
          0% {
            transform: translate(-400px, 100px) rotate(-15deg) scale(0.6);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          50% {
            transform: translate(0px, -30px) rotate(5deg) scale(1);
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            transform: translate(400px, 100px) rotate(15deg) scale(0.6);
            opacity: 0;
          }
        }
        @keyframes bellRing {
          0% {
            transform: rotate(-15deg);
          }
          100% {
            transform: rotate(15deg);
          }
        }
        @keyframes pulseText {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  )
}
