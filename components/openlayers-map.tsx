'use client'

import { useRef, useEffect, useState, Ref, useCallback } from 'react'

import 'ol/ol.css'
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import { TileWMS } from 'ol/source'
import { MapboxVectorLayer } from 'ol-mapbox-style'
import { State } from 'ol/View'
import { useMapStyle } from '@/hooks/use-map-style'
import { cn } from '@/lib/utils'
import { OpenLayersMapStyle } from './openlayers-map-style'
import { OpenLayersMapZoom } from './openlayers-map-zoom'
import { OpenLayersMapLayers } from './openlayers-map-layers'
import { useMapLayer } from '@/hooks/use-map-layer'

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

interface OpenLayersProps {
  ref?: Ref<Map>
  initialView?: Partial<State>
  edgeLayerId?: string
  nodeLayerId?: string
}

export function OpenLayersMap({
  ref,
  initialView,
  edgeLayerId,
  nodeLayerId,
}: OpenLayersProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<Map | null>(null)

  const [view] = useState<Partial<State>>(
    () =>
      initialView || {
        center: [497598, 6785131],
        zoom: 17,
      },
  )

  const vectorLayerRef = useRef<MapboxVectorLayer | null>(null)

  const { styleUrl } = useMapStyle()

  const createMap = useCallback(() => {
    const vectorLayer = new MapboxVectorLayer({
      styleUrl,
      accessToken,
    })
    vectorLayerRef.current = vectorLayer

    return new Map({
      target: mapContainerRef.current!,
      layers: [vectorLayer],
      view: new View({
        projection: 'EPSG:3857',
        ...view,
      }),
      controls: [],
    })
  }, [styleUrl, view])

  // Initialize the map on component mount
  useEffect(() => {
    if (!mapContainerRef.current) return

    const map = createMap()
    mapRef.current = map

    if (typeof ref === 'function') {
      ref(map)
    } else if (ref) {
      ref.current = map
    }

    return () => {
      map.setTarget(undefined)

      if (typeof ref === 'function') {
        ref(null)
      } else if (ref) {
        ref.current = null
      }
    }
  }, [createMap, ref])

  const geoserverTileLayer = (layers: string) =>
    new TileLayer({
      source: new TileWMS({
        url: 'https://geoserver.scenwise.nl/geoserver/scenwise/wms',
        params: { layers, tiled: true },
        serverType: 'geoserver',
      }),
    })

  const edgeLayer = useMapLayer(mapRef, geoserverTileLayer(edgeLayerId ?? ''), {
    id: edgeLayerId ?? '',
    type: 'edge',
    defaultEnabled: true,
  })

  const nodeLayer = useMapLayer(mapRef, geoserverTileLayer(nodeLayerId ?? ''), {
    id: nodeLayerId ?? '',
    type: 'node',
    defaultEnabled: true,
  })

  return (
    <div className="w-full h-full grid place-items-center *:row-1 *:col-1 *:z-10">
      <div className="w-full h-full" ref={mapContainerRef} />

      <OpenLayersMapZoom
        className="self-start place-self-end mt-3 mr-3"
        mapRef={mapRef}
      />

      <div className="flex gap-3 self-end place-self-end mb-3 mr-3">
        <OpenLayersMapStyle mapRef={mapRef} />

        <OpenLayersMapLayers
          mapRef={mapRef}
          mapLayers={[edgeLayer, nodeLayer]}
        />
      </div>
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
