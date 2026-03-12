import { useMapLayer } from '@/hooks/use-map-layer'
import { Map } from 'ol'
import TileLayer from 'ol/layer/Tile'
import { TileWMS } from 'ol/source'

export function GeoserverTileLayer({
  map,
  layer,
}: {
  map: Map | null
  layer: {
    id: number
    name: string
    type: 'nodes' | 'edges'
    geoserverMapId: number
    layerId: string
  }
}) {
  const geoserverTileLayer = (layers: string) =>
    new TileLayer({
      source: new TileWMS({
        url: 'https://geoserver.scenwise.nl/geoserver/scenwise/wms',
        params: { layers, tiled: true },
        serverType: 'geoserver',
      }),
    })

  useMapLayer(map, geoserverTileLayer(layer.layerId), {
    id: layer.layerId,
    type: layer.type,
    defaultEnabled: true,
  })

  return null
}
