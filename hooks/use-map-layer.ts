import { Map } from 'ol'
import { Layer } from 'ol/layer'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useEffect, useRef, useState } from 'react'
import GeoJSON from 'ol/format/GeoJSON'
import { fetcher } from '@/lib/fetcher'
import useSWR from 'swr'

/**
 * Custom hook to manage the visibility of a map layer in an OpenLayers map.
 */
export function useMapLayer(
  map: Map | null,
  layer: Layer,
  metadata?: { id: string; type: 'nodes' | 'edges'; defaultEnabled?: boolean },
) {
  const [enabled, setEnabled] = useState(metadata?.defaultEnabled ?? false)
  const [opacity, setOpacity] = useState(1)
  const layerRef = useRef<Layer>(layer)

  // Initialize the layer when the component mounts
  useEffect(() => {
    if (!map) return

    const layer = layerRef.current

    map.addLayer(layer)

    return () => {
      map.removeLayer(layer)
    }
  }, [map])

  // Keep layerRef in sync with the latest layer instance changes
  useEffect(() => {
    layerRef.current = layer
  }, [layer])

  useEffect(() => {
    layerRef.current.setVisible(enabled)
  }, [enabled])

  useEffect(() => {
    layerRef.current.setOpacity(opacity)
  }, [opacity])

  return {
    enabled,
    toggle: () => setEnabled((prev) => !prev),
    opacity,
    setOpacity,
    metadata,
  }
}

export function useGeoJSONLayer(
  map: Map | null,
  layer: VectorLayer,
  metadata?: { id: string; type: 'nodes' | 'edges'; defaultEnabled?: boolean },
) {
  const sourceRef = useRef<VectorSource>(new VectorSource())

  const mapLayer = useMapLayer(map, layer, metadata)
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
