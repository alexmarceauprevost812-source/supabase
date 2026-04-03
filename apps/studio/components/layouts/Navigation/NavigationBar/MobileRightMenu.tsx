import { useParams } from 'common'
import {
  generateProductRoutes,
  generateToolRoutes,
} from 'components/layouts/Navigation/NavigationBar/NavigationBar.utils'
import { useIsFeatureEnabled } from 'hooks/misc/useIsFeatureEnabled'
import { useSelectedProjectQuery } from 'hooks/misc/useSelectedProject'
import { Star, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, cn, Separator } from 'ui'
import type { Route } from 'components/ui/ui.types'

const LOCAL_STORAGE_KEY = 'mobile-frequent-apps'

interface AppUsage {
  key: string
  count: number
  lastUsed: number
}

function getFrequentApps(): AppUsage[] {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function trackAppUsage(key: string) {
  const apps = getFrequentApps()
  const existing = apps.find((a) => a.key === key)
  if (existing) {
    existing.count += 1
    existing.lastUsed = Date.now()
  } else {
    apps.push({ key, count: 1, lastUsed: Date.now() })
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(apps))
}

function getSortedFrequentKeys(): string[] {
  const apps = getFrequentApps()
  return apps
    .sort((a, b) => b.count - a.count || b.lastUsed - a.lastUsed)
    .map((a) => a.key)
}

interface MobileRightMenuProps {
  open: boolean
  onClose: () => void
}

function MobileAppLink({
  route,
  active,
  onClose,
  isFrequent,
}: {
  route: Route
  active: boolean
  onClose: () => void
  isFrequent?: boolean
}) {
  const handleClick = () => {
    trackAppUsage(route.key)
    onClose()
  }

  if (!route.link || route.disabled) {
    return (
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-3 text-sm rounded-lg',
          'text-foreground-lighter opacity-50 cursor-not-allowed'
        )}
      >
        <span className="flex-shrink-0 [&_svg]:w-5 [&_svg]:h-5">{route.icon}</span>
        <span className="flex-1">{route.label}</span>
      </div>
    )
  }

  return (
    <Link
      href={route.link}
      onClick={handleClick}
      className={cn(
        'flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors',
        active
          ? 'bg-surface-300 text-foreground font-medium'
          : 'text-foreground-light hover:bg-surface-200 hover:text-foreground'
      )}
    >
      <span className="flex-shrink-0 [&_svg]:w-5 [&_svg]:h-5">{route.icon}</span>
      <span className="flex-1">{route.label}</span>
      {isFrequent && <Star size={12} className="text-warning-500 fill-warning-500" />}
    </Link>
  )
}

export function MobileRightMenu({ open, onClose }: MobileRightMenuProps) {
  const router = useRouter()
  const { ref } = useParams()
  const { data: project } = useSelectedProjectQuery()

  const {
    projectAuthAll: authEnabled,
    projectEdgeFunctionAll: edgeFunctionsEnabled,
    projectStorageAll: storageEnabled,
    realtimeAll: realtimeEnabled,
  } = useIsFeatureEnabled([
    'project_auth:all',
    'project_edge_function:all',
    'project_storage:all',
    'realtime:all',
  ])

  const activeRoute = router.pathname.split('/')[3]

  const toolRoutes = generateToolRoutes(ref, project)
  const productRoutes = generateProductRoutes(ref, project, {
    auth: authEnabled,
    edgeFunctions: edgeFunctionsEnabled,
    storage: storageEnabled,
    realtime: realtimeEnabled,
  })

  const allRoutes = [...toolRoutes, ...productRoutes]
  const frequentKeys = getSortedFrequentKeys()

  // Sort routes: frequent first, then the rest
  const frequentRoutes = frequentKeys
    .map((key) => allRoutes.find((r) => r.key === key))
    .filter(Boolean) as Route[]

  const otherRoutes = allRoutes.filter((r) => !frequentKeys.includes(r.key))

  // Handle swipe to close (swipe right to close)
  const touchStartX = useRef<number | null>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current !== null) {
        const deltaX = e.changedTouches[0].clientX - touchStartX.current
        if (deltaX > 80) {
          onClose()
        }
        touchStartX.current = null
      }
    },
    [onClose]
  )

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Right drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 bottom-0 z-[70] w-[280px] bg-dash-sidebar border-l border-default',
          'transform transition-transform duration-300 ease-out md:hidden',
          'flex flex-col',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-default">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Star size={14} className="text-warning-500" />
            Applications fréquentes
          </h2>
          <Button
            type="text"
            icon={<X size={18} />}
            className="!p-1"
            onClick={onClose}
          />
        </div>

        {/* Scrollable menu content */}
        <div className="flex-1 overflow-y-auto py-2 px-2">
          {frequentRoutes.length > 0 && (
            <>
              <div className="space-y-0.5">
                <p className="px-4 py-1 text-xs font-medium text-foreground-muted uppercase tracking-wider">
                  Les plus utilisées
                </p>
                {frequentRoutes.map((route) => (
                  <MobileAppLink
                    key={route.key}
                    route={route}
                    active={activeRoute === route.key}
                    onClose={onClose}
                    isFrequent
                  />
                ))}
              </div>
              <Separator className="my-2" />
            </>
          )}

          <div className="space-y-0.5">
            <p className="px-4 py-1 text-xs font-medium text-foreground-muted uppercase tracking-wider">
              {frequentRoutes.length > 0 ? 'Toutes les applications' : 'Applications'}
            </p>
            {(frequentRoutes.length > 0 ? otherRoutes : allRoutes).map((route) => (
              <MobileAppLink
                key={route.key}
                route={route}
                active={activeRoute === route.key}
                onClose={onClose}
              />
            ))}
          </div>
        </div>

        {/* Footer hint */}
        <div className="px-4 py-3 border-t border-default">
          <p className="text-xs text-foreground-muted text-center">
            Les apps les plus utilisées apparaissent en premier
          </p>
        </div>
      </div>
    </>
  )
}

export default MobileRightMenu
