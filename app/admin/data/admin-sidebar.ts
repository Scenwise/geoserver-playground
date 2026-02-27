import { ChevronsLeftRightIcon, ViewIcon } from 'lucide-react'

export type AdminSidebarItem = {
  title: string
  icon: React.ComponentType
  badge?: { icon?: React.ComponentType; label: string }
  href?: string
  description?: string
}

export type AdminSidebarGroup = {
  label?: string
  action?: React.ReactNode
  items: AdminSidebarItem[]
}

export const tools: Record<string, AdminSidebarItem> = {
  compare: {
    title: 'Compare',
    icon: ChevronsLeftRightIcon,
    href: '/admin/compare',
    description: 'Compare two map versions side by side.',
  },
  streetview: {
    title: 'Streetview',
    icon: ViewIcon,
    href: '/admin/streetview',
    description: 'View location street-level imagery and segmentation.',
  },
}
