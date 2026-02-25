import ScenwiseLogo from '@/components/scenwise-logo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
} from '@/components/ui/sidebar';
import { db } from '@/lib/db';
import { geoserverMaps } from '@/lib/db/schema';
import { ArrowLeft, ChevronsLeftRight, Gauge, Map, View } from 'lucide-react';
import Link from 'next/link';
import { GeoserverMapForm } from './goeserver-map-form';

type AdminSidebarItem = {
  title: string;
  icon: React.ComponentType;
  badge?: string;
  href?: string;
};

type AdminSidebarGroup = {
  label?: string;
  action?: React.ReactNode;
  items: AdminSidebarItem[];
};

export default async function AdminSidebar() {
  const tools: AdminSidebarItem[] = [
    {
      title: 'Compare',
      icon: ChevronsLeftRight,
      href: '/admin/compare',
    },
    {
      title: 'Street View',
      icon: View,
      badge: 'Soon',
    },
  ];

  const dbMaps = await db
    .select()
    .from(geoserverMaps)
    .orderBy(geoserverMaps.name);

  const maps: AdminSidebarItem[] = dbMaps.map((map) => ({
    title: map.name,
    icon: Map,
    href: `/admin/maps/${map.id}`,
  }));

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
    { label: 'Maps', items: maps, action: <GeoserverMapForm /> },
    { label: 'Tools', items: tools },
  ];

  return (
    <Sidebar variant="inset">
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
              <SidebarGroupAction asChild>{group.action}</SidebarGroupAction>
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
                          <Badge className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 ml-auto">
                            {item.badge}
                          </Badge>
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
              <Button color="primary" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft />
                  Main application
                </Link>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
