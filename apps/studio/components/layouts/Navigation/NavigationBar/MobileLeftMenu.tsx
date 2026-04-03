import { useParams } from 'common'
import {
  generateOtherRoutes,
  generateProductRoutes,
  generateSettingsRoutes,
  generateToolRoutes,
} from 'components/layouts/Navigation/NavigationBar/NavigationBar.utils'
import { useFlag } from 'common'
import { useIsFeatureEnabled } from 'hooks/misc/useIsFeatureEnabled'
import { useSelectedProjectQuery } from 'hooks/misc/useSelectedProject'
import { Home } from 'icons'
import { isUndefined } from 'lodash'
import { ChevronRight, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, cn, Separator } from 'ui'
import {
  useIsAPIDocsSidePanelEnabled,
  useIsPlatformWebhooksEnabled,
  useUnifiedLogsPreview,
} from 'components/interfaces/App/FeaturePreview/FeaturePreviewContext'
import type { Route } from 'components/ui/ui.types'

const ICON_SIZE = 20
const ICON_STROKE_WIDTH = 1.5

interface MobileLeftMenuProps {
  open: boolean
  onClose: () => void
}

function MobileMenuLink({
  route,
  active,
  onClose,
}: {
  route: Route
  active: boolean
  onClose: () => void
}) {
  if (!route.link || route.disabled) {
    return (
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-3 text-sm rounded-lg',
          'text-foreground-lighter opacity-50 cursor-not-allowed'
        )}
      >
        <span className="flex-shrink-0 [&_svg]:w-5 [&_svg]:h-5">{route.icon}</span>
        <span>{route.label}</span>
      </div>
    )
  }

  return (
    <Link
      href={route.link}
      onClick={onClose}
      className={cn(
        'flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors',
        active
          ? 'bg-surface-300 text-foreground font-medium'
          : 'text-foreground-light hover:bg-surface-200 hover:text-foreground'
      )}
    >
      <span className="flex-shrink-0 [&_svg]:w-5 [&_svg]:h-5">{route.icon}</span>
      <span className="flex-1">{route.label}</span>
      {active && <ChevronRight size={14} className="text-foreground-muted" />}
    </Link>
  )
}

export function MobileLeftMenu({ open, onClose }: MobileLeftMenuProps) {
  const router = useRouter()
  const { ref } = useParams()
  const { data: project } = useSelectedProjectQuery()

  const isNewAPIDocsEnabled = useIsAPIDocsSidePanelEnabled()
  const { isEnabled: isUnifiedLogsEnabled } = useUnifiedLogsPreview()

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

  const showReports = useIsFeatureEnabled('reports:all')
  const authOverviewPageEnabled = useFlag('authOverviewPage')

  const activeRoute = router.pathname.split('/')[3]

  const toolRoutes = generateToolRoutes(ref, project)
  const productRoutes = generateProductRoutes(ref, project, {
    auth: authEnabled,
    edgeFunctions: edgeFunctionsEnabled,
    storage: storageEnabled,
    realtime: realtimeEnabled,
    authOverviewPage: authOverviewPageEnabled,
  })
  const otherRoutes = generateOtherRoutes(ref, project, {
    unifiedLogs: isUnifiedLogsEnabled,
    showReports,
    apiDocsSidePanel: isNewAPIDocsEnabled,
  })
  const settingsRoutes = generateSettingsRoutes(ref)

  // Handle swipe to close
  const touchStartX = useRef<number | null>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current !== null) {
        const deltaX = e.changedTouches[0].clientX - touchStartX.current
        if (deltaX < -80) {
          onClose()
        }
        touchStartX.current = null
      }
    },
    [onClose]
  )

  // Close on escape key
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

      {/* Left drawer */}
      <div
        className={cn(
          'fixed top-0 left-0 bottom-0 z-[70] w-[280px] bg-dash-sidebar border-r border-default',
          'transform transition-transform duration-300 ease-out md:hidden',
          'flex flex-col',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-default">
          <h2 className="text-sm font-semibold text-foreground">Outils</h2>
          <Button
            type="text"
            icon={<X size={18} />}
            className="!p-1"
            onClick={onClose}
          />
        </div>

        {/* Scrollable menu content */}
        <div className="flex-1 overflow-y-auto py-2 px-2">
          {/* Home */}
          {ref && (
            <>
              <MobileMenuLink
                route={{
                  key: 'HOME',
                  label: 'Aperçu du projet',
                  icon: <Home size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
                  link: `/project/${ref}`,
                }}
                active={isUndefined(activeRoute) && !isUndefined(router.query.ref)}
                onClose={onClose}
              />
              <Separator className="my-2" />
            </>
          )}

          {/* Tool routes */}
          <div className="space-y-0.5">
            <p className="px-4 py-1 text-xs font-medium text-foreground-muted uppercase tracking-wider">
              Éditeurs
            </p>
            {toolRoutes.map((route) => (
              <MobileMenuLink
                key={route.key}
                route={route}
                active={activeRoute === route.key}
                onClose={onClose}
              />
            ))}
          </div>

          <Separator className="my-2" />

          {/* Product routes */}
          <div className="space-y-0.5">
            <p className="px-4 py-1 text-xs font-medium text-foreground-muted uppercase tracking-wider">
              Produits
            </p>
            {productRoutes.map((route) => (
              <MobileMenuLink
                key={route.key}
                route={route}
                active={activeRoute === route.key}
                onClose={onClose}
              />
            ))}
          </div>

          <Separator className="my-2" />

          {/* Other routes */}
          <div className="space-y-0.5">
            <p className="px-4 py-1 text-xs font-medium text-foreground-muted uppercase tracking-wider">
              Autres
            </p>
            {otherRoutes.map((route) => (
              <MobileMenuLink
                key={route.key}
                route={route}
                active={activeRoute === route.key}
                onClose={onClose}
              />
            ))}
          </div>

          <Separator className="my-2" />

          {/* Settings routes */}
          <div className="space-y-0.5">
            {settingsRoutes.map((route) => (
              <MobileMenuLink
                key={route.key}
                route={route}
                active={activeRoute === route.key}
                onClose={onClose}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default MobileLeftMenu
