'use client'

import { useRef, useEffect, useState } from 'react'

import 'ol/ol.css'
import { Map, View } from 'ol'
import { type MapOptions } from 'ol/Map'
import TileLayer from 'ol/layer/Tile'
import { TileWMS } from 'ol/source'
import { MapboxVectorLayer } from 'ol-mapbox-style'
import { State } from 'ol/View'
import { useMapStyle } from '@/hooks/use-map-style'
import { Button } from './ui/button'
import { Minus, PaletteIcon, Plus, SatelliteIcon } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group'
import { ButtonGroup } from './ui/button-group'
import { cn } from '@/lib/utils'

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

interface OpenLayersProps {
  mapRef?: React.RefObject<Map | null>
  initialView?: Partial<State>
  onUpdateView?: (view: State) => void
  edgeLayerId?: string
  nodeLayerId?: string
}

export function OpenLayersMap({
  mapRef = useRef<Map>(null),
  initialView,
  onUpdateView,
  edgeLayerId,
  nodeLayerId,
}: OpenLayersProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)

  const [view] = useState<Partial<State>>(
    () =>
      initialView || {
        center: [497598, 6785131],
        zoom: 17,
      },
  )

  const { styleUrl, isSatellite, setIsSatellite } = useMapStyle(mapRef)

  // Initialize the map on component mount
  useEffect(() => {
    if (!mapContainerRef.current) return

    const map = new Map({
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

    mapRef.current = map

    // Update center on map move
    map.on('moveend', () => {
      const view = map.getView()
      onUpdateView?.(view.getState())
    })

    return () => map.setTarget(undefined)
  }, [])

  // Update the map view state
  useEffect(() => {
    if (!mapRef.current || !view) return

    const mapView = mapRef.current.getView()
    const currentZoom = mapView.getZoom()
    const currentCenter = mapView.getCenter()

    const targetZoom = view.zoom !== currentZoom ? view.zoom : undefined
    const targetCenter =
      view.center &&
      (view.center[0] !== currentCenter?.[0] ||
        view.center[1] !== currentCenter?.[1])
        ? view.center
        : undefined

    if (targetZoom || targetCenter) {
      mapView.animate({
        zoom: targetZoom,
        center: targetCenter,
        duration: 100,
      })
    }
  }, [view])

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
          <Plus />
        </Button>
        <Button onClick={() => zoom(-1)} variant="outline" size="icon">
          <Minus />
        </Button>
      </ButtonGroup>

      <ToggleGroup
        type="single"
        variant="outline"
        className="bg-background self-end place-self-end z-10 mb-3 mr-3 ring-2 ring-background shadow"
        value={isSatellite ? 'satellite' : 'default'}
      >
        <ToggleGroupItem value="default" onClick={() => setIsSatellite(false)}>
          <PaletteIcon />
          Basic
        </ToggleGroupItem>
        <ToggleGroupItem value="satellite" onClick={() => setIsSatellite(true)}>
          <SatelliteIcon />
          Satellite
        </ToggleGroupItem>
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
        'rounded-xl basis-0 grow overflow-hidden shadow-centered bg-card border-4 border-white dark:ring-white/10',
        className,
      )}
    >
      {children}
    </div>
  )
}
