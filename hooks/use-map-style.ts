import { useTheme } from 'next-themes'
import { Map } from 'ol'
import LayerGroup from 'ol/layer/Group'
import { RefObject, useEffect, useMemo } from 'react'
import apply from 'ol-mapbox-style'
import { PaletteIcon, SatelliteIcon, CarIcon } from 'lucide-react'

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

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

/**
 * Custom hook to manage the map style based on the current theme and map style.
 * It updates the map's base layer whenever the theme or style changes.
 *
 * @param mapRef - A ref to the OpenLayers Map instance that needs to be updated when the style changes.
 * @param style - The desired map style ('basic', 'streets', or 'satellite').
 *
 * @returns styleUrl - The URL of the current map style being used.
 */
export function useMapStyle(
  mapRef: RefObject<Map | null>,
  style: MapStyle = 'basic',
) {
  const { resolvedTheme } = useTheme()

  const styleUrl = useMemo(() => {
    const themeKey = (resolvedTheme ?? 'light') as 'light' | 'dark'
    return MAP_STYLES[style].url[themeKey]
  }, [resolvedTheme, style])

  // Change the base layer to trigger a style update when the theme changes
  useEffect(() => {
    if (!mapRef?.current) return

    const layers = mapRef.current.getLayers()
    layers.removeAt(0)

    const layerGroup = new LayerGroup()
    apply(layerGroup, styleUrl, { accessToken })

    layers.insertAt(0, layerGroup)
  }, [mapRef, styleUrl])

  return { styleUrl }
}
