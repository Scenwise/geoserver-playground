import { useMapLayer } from '@/hooks/use-map-layer'
import { GeoserverLayer } from '@/store/mapLayerStore'
import { Map } from 'ol'
import TileLayer from 'ol/layer/Tile'
import { TileWMS } from 'ol/source'
import { useMemo } from 'react'

export function GeoserverTileLayer({
  map,
  layer,
}: {
  map: Map | null
  layer: GeoserverLayer
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

  useMapLayer(map, olLayer, layer)

  return null
}
