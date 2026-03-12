'use client'

import {
  useRef,
  useState,
  Ref,
  useCallback,
  useMemo,
  useImperativeHandle,
} from 'react'

import 'ol/ol.css'
import { Map, View } from 'ol'
import { MapboxVectorLayer } from 'ol-mapbox-style'
import { useMapStyle } from '@/hooks/use-map-style'
import { cn } from '@/lib/utils'
import { StyleControl } from './style-control'
import { ZoomControl } from './zoom-control'
import { LayersControl } from './layers-control'
import { GeoserverTileLayer } from './tile-layers'
import { Layer } from 'ol/layer'
import { CustomLayer } from './custom-layers'
import { MapLayerStoreProvider } from '@/providers/MapLayerStoreProvider'
import { getGeoserverMapById } from '@/admin/actions/geoserver-map'

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

export type MapHandle = {
  addLayer: (layer: Layer) => void
  getMap: () => Map | null
}

interface OpenLayersMapProps {
  ref?: Ref<MapHandle>
  onMapReady?: (map: Map) => void
  mapData?: Awaited<ReturnType<typeof getGeoserverMapById>>
}

export function OpenLayersMap(props: OpenLayersMapProps) {
  return (
    <MapLayerStoreProvider>
      <OpenLayersMapInner {...props} />
    </MapLayerStoreProvider>
  )
}

function OpenLayersMapInner({ ref, onMapReady, mapData }: OpenLayersMapProps) {
  const vectorLayerRef = useRef<MapboxVectorLayer | null>(null)
  const { styleUrl } = useMapStyle()

  const [map, setMap] = useState<Map | null>(null)
  const mapRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return
      const vectorLayer = new MapboxVectorLayer({
        styleUrl,
        accessToken,
      })
      vectorLayerRef.current = vectorLayer

      const olMap = new Map({
        target: node,
        layers: [vectorLayer],
        view: new View({
          projection: 'EPSG:3857',
          center:
            mapData?.initialX && mapData?.initialY
              ? [mapData.initialX, mapData.initialY]
              : [497598, 6785131],
          zoom: mapData?.initialZoom ?? 17,
        }),
        controls: [],
      })

      setMap(olMap)
      onMapReady?.(olMap)

      return () => {
        olMap.setTarget(undefined)
        setMap(null)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useImperativeHandle(ref, () => {
    return {
      addLayer: (layer) => map?.addLayer(layer),
      getMap: () => map,
    }
  }, [map])

  const tileLayers = useMemo(() => {
    if (!mapData?.layers) return []

    return mapData.layers.filter((layer) => layer.source === 'geoserver-tile')
  }, [mapData?.layers])

  const customLayers = useMemo(() => {
    if (!mapData?.layers) return []

    return mapData.layers.filter((layer) => layer.source === 'custom')
  }, [mapData?.layers])

  return (
    <div className="w-full h-full grid place-items-center *:row-1 *:col-1 *:z-10 @container">
      <div className="w-full h-full" ref={mapRef} />

      <ZoomControl className="self-start place-self-end mt-3 mr-3" map={map} />

      <div className="flex gap-3 self-end place-self-end mb-3 mr-3">
        <StyleControl map={map} />

        <LayersControl map={map} />
      </div>

      {tileLayers.map((layer) => (
        <GeoserverTileLayer map={map} layer={layer} key={layer.id} />
      ))}

      {customLayers.map((layer) => (
        <CustomLayer map={map} layer={layer} key={layer.id} />
      ))}
    </div>
  )
}

export function MapContainer({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-xl basis-0 grow overflow-hidden shadow-centered bg-card border-4 border-white dark:border-white/10',
        className,
      )}
    >
      {children}
    </div>
  )
}
