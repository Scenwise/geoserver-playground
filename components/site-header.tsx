import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ModeDropdown } from './mode-toggle'

import ScenwiseLogo from './scenwise-logo'

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <ScenwiseLogo />

        <h1 className="text-base font-semibold">SmartNavigator</h1>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <Link href="/admin">Admin</Link>
          </Button>

          <ModeDropdown />
        </div>
      </div>
    </header>
  )
}
