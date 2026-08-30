import { useTheme } from 'next-themes'
import { useMemo } from 'react'
import { PaletteIcon, SatelliteIcon, CarIcon, GlobeIcon } from 'lucide-react'

export const MAP_STYLES = {
  basic: {
    label: 'Basic',
    icon: PaletteIcon,
    url: {
      light: 'mapbox://styles/mapbox/light-v11',
      dark: 'mapbox://styles/mapbox/dark-v11',
    },
  },
  streets: {
    label: 'Streets',
    icon: CarIcon,
    url: {
      light: 'mapbox://styles/mapbox/streets-v12',
      dark: 'mapbox://styles/mapbox/streets-v12',
    },
  },
  satellite: {
    label: 'Satellite',
    icon: SatelliteIcon,
    url: {
      light: 'mapbox://styles/mapbox/satellite-v9',
      dark: 'mapbox://styles/mapbox/satellite-v9',
    },
  },
  globe: {
    label: 'Globe',
    icon: GlobeIcon,
    url: {
      light: null,
      dark: null,
    },
  },
} as const

export type MapStyle = keyof typeof MAP_STYLES

export function useMapStyle(style: MapStyle = 'basic') {
  const { resolvedTheme } = useTheme()

  const styleUrl = useMemo(() => {
    const s = MAP_STYLES[style]
    if (!s.url.light) return MAP_STYLES.basic.url.light
    const themeKey = (resolvedTheme ?? 'light') as 'light' | 'dark'
    return s.url[themeKey] as string
  }, [resolvedTheme, style])

  return { styleUrl }
}
