import GeoJSON from 'ol/format/GeoJSON'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useEffect, useMemo, useRef } from 'react'
import { useMapLayer } from './use-map-layer'
import useSWR from 'swr'
import { fetcher } from '@/lib/fetcher'
import { Map } from 'ol'
import { useMapLayerStore } from '@/providers/MapLayerStoreProvider'
import { GeoserverLayer } from '@/store/mapLayerStore'

export function useCustomMapLayer(
  map: Map | null,
  layerMetadata: GeoserverLayer,
) {
  const sourceRef = useRef<VectorSource>(new VectorSource())

  const layer = useMemo(
    () =>
      new VectorLayer({
        style: {
          'stroke-color': 'red',
          'stroke-width': 2,
        },
      }),
    [],
  )

  const mapLayer = useMapLayer(map, layer, layerMetadata)
  const { enabled } = mapLayer

  const { data } = useSWR(enabled ? '/ag_analysis_object.json' : null, fetcher)

  const alignIndex = useMapLayerStore((state) => {
    const layer = state.layers[layerMetadata.id]
    return layer?.source === 'custom' ? layer.alignIndex : 0
  })
  const { setAlignIndex } = useMapLayerStore()

  const clamp = (num: number, min: number, max: number) => {
    return Math.min(Math.max(num, min), max)
  }

  const formattedFeatures = useMemo(() => {
    if (!data) return []

    return Object.values(data.features).map((feature) => {
      const clamped = clamp(
        alignIndex,
        feature.meta_data.align_index * -1,
        feature.meta_data.align_index,
      )

      // Skip 0 -> does not exist
      const index = String(clamped < 0 ? clamped : clamped + 1)

      return {
        id: feature.meta_data.feature_id,
        type: 'Feature',
        geometry: feature.geometries[index]?.geometry || null,
        properties: feature.meta_data,
      }
    })
  }, [data, alignIndex])

  // Update the vector source with new features when data is fetched
  useEffect(() => {
    if (!sourceRef.current || !data) return

    layer.setSource(sourceRef.current)

    const featureCollection = {
      type: 'FeatureCollection',
      features: formattedFeatures,
    }

    const features = new GeoJSON().readFeatures(featureCollection, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',
    })

    sourceRef.current.clear()
    sourceRef.current.addFeatures(features)
  }, [sourceRef, data, layer, formattedFeatures])

  return { ...mapLayer, alignIndex, setAlignIndex }
}
