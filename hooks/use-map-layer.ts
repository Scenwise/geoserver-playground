import { Map } from 'ol'
import { Layer } from 'ol/layer'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useEffect, useRef } from 'react'
import GeoJSON from 'ol/format/GeoJSON'
import { fetcher } from '@/lib/fetcher'
import useSWR from 'swr'
import { LayerState } from '@/store/mapLayerStore'
import { useMapLayerStore } from '@/providers/MapLayerStoreProvider'

/**
 * Custom hook to manage the visibility of a map layer in an OpenLayers map.
 */
export function useMapLayer(
  map: Map | null,
  layer: Layer,
  metadata?: {
    id: string
    source: LayerState['source']
    type: 'nodes' | 'edges'
    defaultEnabled?: boolean
  },
) {
  const layerRef = useRef<Layer>(layer)

  const { registerLayer, unregisterLayer, toggleLayer, setOpacity } =
    useMapLayerStore()
  const layerState = useMapLayerStore((state) =>
    metadata?.id ? state.layers[metadata.id] : undefined,
  )

  // Register/unregister in store
  useEffect(() => {
    if (!metadata?.id) return
    registerLayer(
      metadata.id,
      metadata.source,
      metadata.type,
      metadata.defaultEnabled,
    )
    return () => unregisterLayer(metadata.id)
  }, [metadata?.id])

  // Add/remove OL layer
  useEffect(() => {
    if (!map) return
    const olLayer = layerRef.current
    map.addLayer(olLayer)
    return () => {
      map.removeLayer(olLayer)
    }
  }, [map])

  // Keep layerRef in sync with the latest layer instance changes
  useEffect(() => {
    layerRef.current = layer
  }, [layer])

  // Sync visibility to OL
  useEffect(() => {
    if (layerState?.enabled === undefined) return
    layerRef.current.setVisible(layerState.enabled)
  }, [layerState?.enabled])

  // Sync opacity to OL
  useEffect(() => {
    if (layerState?.opacity === undefined) return
    layerRef.current.setOpacity(layerState.opacity)
  }, [layerState?.opacity])

  return {
    enabled: layerState?.enabled ?? false,
    opacity: layerState?.opacity ?? 1,
    toggle: () => metadata?.id && toggleLayer(metadata?.id),
    setOpacity: (opacity: number) =>
      metadata?.id && setOpacity(metadata?.id, opacity),
    metadata,
  }
}

export function useGeoJSONLayer(
  map: Map | null,
  layer: VectorLayer,
  metadata?: {
    id: string
    source: LayerState['source']
    type: 'nodes' | 'edges'
    defaultEnabled?: boolean
  },
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
