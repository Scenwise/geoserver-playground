import { useTheme } from 'next-themes'
import { useMemo } from 'react'
import { PaletteIcon, SatelliteIcon, CarIcon } from 'lucide-react'

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
}

export type MapStyle = keyof typeof MAP_STYLES

export function useMapStyle(style: MapStyle = 'basic') {
  const { resolvedTheme } = useTheme()

  const styleUrl = useMemo(() => {
    const themeKey = (resolvedTheme ?? 'light') as 'light' | 'dark'
    return MAP_STYLES[style].url[themeKey]
  }, [resolvedTheme, style])

  return { styleUrl }
}
