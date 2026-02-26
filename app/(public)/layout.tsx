import { SiteHeader } from '@/components/site-header'
import React from 'react'

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main
      style={
        {
          '--header-height': 'calc(var(--spacing) * 16)',
        } as React.CSSProperties
      }
      className="min-h-svh flex flex-col"
    >
      <SiteHeader />
      {children}
    </main>
  )
}
