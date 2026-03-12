import { useCustomMapLayer } from '@/hooks/use-custom-map-layer'
import { GeoserverLayer } from '@/store/mapLayerStore'
import { Map } from 'ol'

export function CustomLayer({
  map,
  layer,
}: {
  map: Map | null
  layer: GeoserverLayer
}) {
  useCustomMapLayer(map, layer)

  return null
}
