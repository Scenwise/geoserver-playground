'use client'

import { useRef, useEffect, useState, Ref, useCallback } from 'react'

import 'ol/ol.css'
import { Map, View } from 'ol'
import { type MapOptions } from 'ol/Map'
import TileLayer from 'ol/layer/Tile'
import { TileWMS } from 'ol/source'
import { MapboxVectorLayer } from 'ol-mapbox-style'
import { State } from 'ol/View'
import { MAP_STYLES, MapStyle, useMapStyle } from '@/hooks/use-map-style'
import { Button } from './ui/button'
import { MinusIcon, PaletteIcon, PlusIcon, SatelliteIcon } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group'
import { ButtonGroup } from './ui/button-group'
import { cn } from '@/lib/utils'

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

  const { styleUrl, style, setStyle } = useMapStyle(mapRef)

  useEffect(() => {
    console.log(styleUrl)
  }, [styleUrl])

  const createMap = useCallback(() => {
    return new Map({
      target: mapContainerRef.current!,
      layers: [
        new MapboxVectorLayer({
          styleUrl,
          accessToken,
        }),
        edgeLayerId &&
          new TileLayer({
            source: new TileWMS({
              url: 'https://geoserver.scenwise.nl/geoserver/scenwise/wms',
              params: { layers: edgeLayerId, tiled: true },
              serverType: 'geoserver',
            }),
          }),
        nodeLayerId &&
          new TileLayer({
            source: new TileWMS({
              url: 'https://geoserver.scenwise.nl/geoserver/scenwise/wms',
              params: { layers: nodeLayerId, tiled: true },
              serverType: 'geoserver',
            }),
          }),
      ].filter(Boolean) as MapOptions['layers'],
      view: new View({
        projection: 'EPSG:3857',
        ...view,
      }),
      controls: [],
    })
  }, [edgeLayerId, nodeLayerId, styleUrl, view])

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

  function zoom(value: number) {
    if (!mapRef.current) return

    const view = mapRef.current.getView()
    view.animate({ zoom: view.getZoom()! + value, duration: 100 })
  }

  return (
    <div className="w-full h-full grid place-items-center *:row-1 *:col-1 *:z-10">
      <div className="w-full h-full" ref={mapContainerRef} />

      <ButtonGroup
        orientation="vertical"
        className="self-start place-self-end mt-3 mr-3 ring-2 ring-background bg-background rounded-lg shadow"
      >
        <Button onClick={() => zoom(1)} variant="outline" size="icon">
          <PlusIcon />
        </Button>
        <Button onClick={() => zoom(-1)} variant="outline" size="icon">
          <MinusIcon />
        </Button>
      </ButtonGroup>

      <ToggleGroup
        type="single"
        variant="outline"
        className="bg-background self-end place-self-end z-10 mb-3 mr-3 ring-2 ring-background shadow"
        value={style}
        onValueChange={(value: string | null) =>
          value && setStyle(value as MapStyle)
        }
      >
        {Object.entries(MAP_STYLES).map(([key, { label, icon: Icon }]) => (
          <ToggleGroupItem key={key} value={key}>
            <Icon />
            {label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
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
