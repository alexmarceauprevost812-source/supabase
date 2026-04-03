import { useParams } from 'common'
import { Camera, Image, Menu, Settings, Wallet } from 'lucide-react'
import Link from 'next/link'
import { Button, cn } from 'ui'

const ICON_SIZE = 18
const ICON_STROKE_WIDTH = 1.5

interface MobileTopBarProps {
  onOpenLeftMenu: () => void
  onOpenRightMenu: () => void
}

export function MobileTopBar({ onOpenLeftMenu, onOpenRightMenu }: MobileTopBarProps) {
  const { ref: projectRef } = useParams()

  return (
    <div className="flex md:hidden w-full">
      <nav
        className={cn(
          'w-full h-12 px-2',
          'border-b bg-dash-sidebar border-default',
          'flex items-center justify-between',
          'shadow-[0_0_30px_0_rgba(0,0,0,0.07)]'
        )}
      >
        {/* Left: Hamburger for left menu */}
        <div className="flex items-center gap-1">
          <Button
            type="text"
            icon={<Menu size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />}
            className="!p-2 rounded-lg"
            onClick={onOpenLeftMenu}
            title="Outils"
          />
        </div>

        {/* Center: Quick access apps */}
        <div className="flex items-center gap-1">
          {/* Portefeuille / Wallet */}
          {projectRef ? (
            <Link href={`/project/${projectRef}/settings/general`}>
              <Button
                type="text"
                asChild
                icon={<Wallet size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />}
                className="!p-2 rounded-lg"
                title="Portefeuille"
              />
            </Link>
          ) : (
            <Button
              type="text"
              icon={<Wallet size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />}
              className="!p-2 rounded-lg"
              title="Portefeuille"
            />
          )}

          {/* Paramètres / Settings */}
          <Link
            href={
              projectRef ? `/project/${projectRef}/settings/general` : '/account/me'
            }
          >
            <Button
              type="text"
              asChild
              icon={<Settings size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />}
              className="!p-2 rounded-lg"
              title="Paramètres"
            />
          </Link>

          {/* Appareil photo / Camera */}
          {projectRef && (
            <Link href={`/project/${projectRef}/storage/files`}>
              <Button
                type="text"
                asChild
                icon={<Camera size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />}
                className="!p-2 rounded-lg"
                title="Appareil photo"
              />
            </Link>
          )}

          {/* Photos */}
          {projectRef && (
            <Link href={`/project/${projectRef}/storage/files`}>
              <Button
                type="text"
                asChild
                icon={<Image size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />}
                className="!p-2 rounded-lg"
                title="Photos"
              />
            </Link>
          )}
        </div>

        {/* Right: Open right menu (frequent apps) */}
        <div className="flex items-center gap-1">
          <Button
            type="text"
            className="!p-2 rounded-lg text-xs font-medium text-foreground-light"
            onClick={onOpenRightMenu}
            title="Applications fréquentes"
          >
            <div className="flex items-center gap-1">
              <div className="grid grid-cols-2 gap-[2px]">
                <div className="w-1.5 h-1.5 rounded-[1px] bg-foreground-muted" />
                <div className="w-1.5 h-1.5 rounded-[1px] bg-foreground-muted" />
                <div className="w-1.5 h-1.5 rounded-[1px] bg-foreground-muted" />
                <div className="w-1.5 h-1.5 rounded-[1px] bg-foreground-muted" />
              </div>
            </div>
          </Button>
        </div>
      </nav>
    </div>
  )
}

export default MobileTopBar
