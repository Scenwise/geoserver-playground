import ScenwiseLogo from '@/components/scenwise-logo'
import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { db } from '@/lib/db'
import { geoserverMaps } from '@/lib/db/schema'
import {
  ArrowLeft,
  ChevronsLeftRight,
  Gauge,
  Map,
  StarIcon,
  View,
} from 'lucide-react'
import Link from 'next/link'
import { ColoredBadge } from '@/components/colored-badge'
import { ModeToggle } from '@/components/mode-toggle'

type AdminSidebarItem = {
  title: string
  icon: React.ComponentType
  badge?: { icon?: React.ComponentType; label: string }
  href?: string
}

type AdminSidebarGroup = {
  label?: string
  action?: React.ReactNode
  items: AdminSidebarItem[]
}

export default async function AdminSidebar() {
  const tools: AdminSidebarItem[] = [
    {
      title: 'Compare',
      icon: ChevronsLeftRight,
      href: '/admin/compare',
    },
    {
      title: 'Streetview',
      icon: View,
      href: '/admin/streetview',
    },
  ]

  const dbMaps = await db
    .select()
    .from(geoserverMaps)
    .orderBy(geoserverMaps.name)

  const maps: AdminSidebarItem[] = dbMaps.map((map) => ({
    title: map.name,
    icon: Map,
    href: `/admin/maps/${map.id}`,
    badge: map.isMain ? { icon: StarIcon, label: 'Main' } : undefined,
  }))

  const items: AdminSidebarGroup[] = [
    {
      items: [
        {
          title: 'Dashboard',
          icon: Gauge,
          href: '/admin',
        } satisfies AdminSidebarItem,
      ],
    },
    { label: 'Tools', items: tools },
    { label: 'Maps', items: maps },
  ]

  return (
    <Sidebar variant="inset" className="*:bg-background">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex gap-2 items-center px-2 text-base">
            <ScenwiseLogo />
            <span>
              <span className="font-semibold">SmartNavigator</span> Admin
            </span>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {items.map((group, index) => (
          <SidebarGroup key={index}>
            {group.label && (
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            )}
            {group.action && (
              <SidebarGroupAction>{group.action}</SidebarGroupAction>
            )}

            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      asChild
                      disabled={!item.href}
                    >
                      <Link
                        href={item.href ?? '#'}
                        className="flex items-center gap-2"
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        {item.badge && (
                          <ColoredBadge className="ml-auto">
                            {item.badge.icon && (
                              <item.badge.icon className="w-3 h-3 mr-1" />
                            )}
                            {item.badge.label}
                          </ColoredBadge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button color="primary" asChild>
                <Link href="/">
                  <ArrowLeft />
                  Main application
                </Link>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu>
          <SidebarMenuItem>
            <ModeToggle />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
