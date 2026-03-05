import {
  BusIcon,
  ChevronsLeftRightIcon,
  LucideProps,
  ViewIcon,
} from 'lucide-react'
import { ForwardRefExoticComponent, RefAttributes } from 'react'

type IconComponent = ForwardRefExoticComponent<
  Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
>

export type AdminSidebarItem = {
  title: string
  icon: IconComponent
  badge?: { icon?: IconComponent; label: string }
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
  publicTransport: {
    title: 'Public transport',
    icon: BusIcon,
    href: '/admin/public-transport',
    description: 'View public transport data and network structure.',
  },
}
