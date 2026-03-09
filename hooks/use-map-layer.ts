import { Map } from 'ol'
import { Layer } from 'ol/layer'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { RefObject, useEffect, useRef, useState } from 'react'
import GeoJSON from 'ol/format/GeoJSON'
import { fetcher } from '@/lib/fetcher'
import useSWR from 'swr'

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

    const map = mapRef.current
    const layer = layerRef.current

    map.addLayer(layer)

    return () => {
      map.removeLayer(layer)
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

export function useGeoJSONLayer(
  mapRef: RefObject<Map | null>,
  layer: VectorLayer,
  metadata?: { id: string; type: 'node' | 'edge'; defaultEnabled?: boolean },
) {
  const sourceRef = useRef<VectorSource>(new VectorSource())

  const mapLayer = useMapLayer(mapRef, layer, metadata)
  const { enabled } = mapLayer

  const { data } = useSWR(
    enabled ? `/api/geoserver/geojson/${metadata?.id}` : null,
    fetcher,
  )

  // Update the vector source with new features when data is fetched
  useEffect(() => {
    if (!sourceRef.current || !data) return

    layer.setSource(sourceRef.current)

    const features = new GeoJSON().readFeatures(data, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',
    })

    sourceRef.current.clear()
    sourceRef.current.addFeatures(features)
  }, [sourceRef, data, layer])

  return mapLayer
}
