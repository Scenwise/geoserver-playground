import { Map } from 'ol'
import { Layer } from 'ol/layer'
import { RefObject, useEffect, useRef, useState } from 'react'

/**
 * Custom hook to manage the visibility of a map layer in an OpenLayers map.
 */
export function useMapLayer(
  mapRef: RefObject<Map | null>,
  layer: Layer,
  metadata?: { id: string; type: 'node' | 'edge'; defaultEnabled?: boolean },
) {
  const [enabled, setEnabled] = useState(metadata?.defaultEnabled ?? false)
  const layerRef = useRef<Layer>(layer)

  // Initialize the layer when the component mounts
  useEffect(() => {
    if (!mapRef.current) return

    layerRef.current.setVisible(enabled)
    mapRef.current.addLayer(layerRef.current)

    return () => {
      mapRef.current?.removeLayer(layerRef.current)
    }
  }, [mapRef])

  useEffect(() => {
    layerRef.current.setVisible(enabled)
  }, [enabled])

  return {
    enabled,
    toggle: () => setEnabled((prev) => !prev),
    metadata,
  }
}
