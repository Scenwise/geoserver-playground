'use client'

import { ComputerIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useState, useEffect } from 'react'

export function ModeToggle() {
  const { theme } = useTheme()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <InternalToggleGroup />

  return <InternalToggleGroup theme={theme} />
}

// To avoid SSR hydration mismatch, render a toggle group without value on the
// server, and only render the one with value on the client after mounting.
function InternalToggleGroup({ theme }: { theme?: string }) {
  const { setTheme } = useTheme()

  const themes = [
    { value: 'light', icon: <SunIcon /> },
    { value: 'dark', icon: <MoonIcon /> },
    { value: 'system', icon: <ComputerIcon /> },
  ]

  return (
    <ToggleGroup
      type="single"
      value={theme || undefined}
      onValueChange={(value) => setTheme && setTheme(value)}
      variant="outline"
      className="grow w-full"
      size="sm"
    >
      {themes.map((t) => (
        <ToggleGroupItem key={t.value} value={t.value} className="grow">
          {t.icon}
          {t.value}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
