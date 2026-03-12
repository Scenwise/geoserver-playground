import { useMapLayer } from '@/hooks/use-map-layer'
import { Map } from 'ol'
import TileLayer from 'ol/layer/Tile'
import { TileWMS } from 'ol/source'
import { useMemo } from 'react'

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
  const olLayer = useMemo(
    () =>
      new TileLayer({
        source: new TileWMS({
          url: 'https://geoserver.scenwise.nl/geoserver/scenwise/wms',
          params: { layers: layer.layerId, tiled: true },
          serverType: 'geoserver',
        }),
      }),
    [layer.layerId],
  )

  useMapLayer(map, olLayer, {
    id: layer.layerId,
    source: 'geoserver-tile',
    type: layer.type,
    defaultEnabled: true,
  })

  return null
}
