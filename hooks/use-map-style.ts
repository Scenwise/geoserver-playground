import { useTheme } from 'next-themes'
import { Map } from 'ol'
import LayerGroup from 'ol/layer/Group'
import { RefObject, useEffect, useMemo, useState } from 'react'
import apply from 'ol-mapbox-style'
import { IconComponent } from '@/lib/types'
import { MapPinIcon, PaletteIcon, SatelliteIcon, CarIcon } from 'lucide-react'

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

export const MAP_STYLES = {
  basic: { label: 'Basic', icon: PaletteIcon },
  streets: { label: 'Streets', icon: CarIcon },
  satellite: { label: 'Satellite', icon: SatelliteIcon },
}

export type MapStyle = keyof typeof MAP_STYLES

/**
 * Custom hook to manage the map style based on the current theme and satellite mode.
 * It updates the map's base layer whenever the theme or satellite mode changes.
 *
 * @param mapRef - A ref to the OpenLayers Map instance that needs to be updated when the style changes.
 *
 * @returns styleUrl - The URL of the current map style being used.
 * @returns style - The current map style ('basic', 'streets', or 'satellite').
 * @returns setStyle - A function to update the map style.
 */
export function useMapStyle(mapRef: RefObject<Map | null>) {
  const { resolvedTheme } = useTheme()
  const [style, setStyle] = useState<MapStyle>('satellite')

  const styleUrl = useMemo(() => {
    if (style === 'streets') return 'mapbox://styles/mapbox/streets-v12'
    if (style === 'satellite') return 'mapbox://styles/mapbox/satellite-v9'

    // Else, return the basic style based on the theme
    return resolvedTheme === 'dark'
      ? 'mapbox://styles/mapbox/dark-v11'
      : 'mapbox://styles/mapbox/light-v11'
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

  return { styleUrl, style, setStyle }
}
