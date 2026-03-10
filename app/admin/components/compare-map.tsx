import {
  MapContainer,
  OpenLayersMap,
} from '@/components/openlayers-map/openlayers-map'
import { ResizablePanel } from '@/components/ui/resizable'
import { geoserverMaps } from '@/lib/db/schema/geoserver'
import { useEffect, useRef } from 'react'

import { Map } from 'ol'
import { State } from 'ol/View'

export function CompareMap({
  map,
  view,
  onViewChange,
}: {
  map: typeof geoserverMaps.$inferSelect | null
  view?: Partial<State>
  onViewChange?: (view: State) => void
}) {
  const mapRef = useRef<Map | null>(null)

  // Register view change listener
  useEffect(() => {
    if (!mapRef.current || !onViewChange) return

    mapRef.current.on('moveend', () => {
      const view = mapRef.current?.getView()
      if (view) onViewChange?.(view.getState())
    })
  }, [onViewChange])

  // Update the map view state
  useEffect(() => {
    if (!mapRef.current || !view) return

    const mapView = mapRef.current.getView()

    const currentZoom = mapView.getZoom()
    const targetZoom = view.zoom !== currentZoom ? view.zoom : undefined
    if (targetZoom) {
      mapView.animate({
        zoom: targetZoom,
        duration: 100,
      })
    }

    const currentCenter = mapView.getCenter()
    const targetCenter =
      view.center &&
      (view.center[0] !== currentCenter?.[0] ||
        view.center[1] !== currentCenter?.[1])
        ? view.center
        : undefined

    if (targetCenter) {
      mapView.animate({
        center: targetCenter,
        duration: 100,
      })
    }
  }, [view])

  return (
    <ResizablePanel
      className="p-4 flex flex-col h-full items-stretch gap-4"
      minSize="35%"
      defaultSize="50%"
    >
      <MapContainer className="grow">
        <OpenLayersMap
          key={`map-${map?.id}`}
          edgeLayerId={map?.geoserverEdges}
          nodeLayerId={map?.geoserverNodes}
          ref={mapRef}
        />
      </MapContainer>
    </ResizablePanel>
  )
}
