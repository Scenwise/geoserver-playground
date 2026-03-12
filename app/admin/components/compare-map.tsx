import {
  MapContainer,
  OpenLayersMap,
} from '@/components/openlayers-map/openlayers-map'
import { ResizablePanel } from '@/components/ui/resizable'
import { useEffect, useState } from 'react'

import { Map } from 'ol'
import { State } from 'ol/View'
import { getGeoserverMapById } from '../actions/geoserver-map'

export function CompareMap({
  map,
  view,
  onViewChange,
}: {
  map: Awaited<ReturnType<typeof getGeoserverMapById>>
  view?: Partial<State>
  onViewChange: (view: State) => void
}) {
  // const mapRef = useRef<Map | null>(null)
  const [mapRef, setMap] = useState<Map | null>(null)

  // Register view change listener
  useEffect(() => {
    if (!mapRef) return

    const handler = () => {
      const view = mapRef.getView()
      if (view) onViewChange(view.getState())
    }

    mapRef.on('moveend', handler)
    return () => mapRef.un('moveend', handler)
  }, [mapRef, onViewChange])

  // Update the map view state
  useEffect(() => {
    if (!mapRef || !view) return

    const mapView = mapRef.getView()

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
  }, [view, mapRef])

  return (
    <ResizablePanel
      className="p-4 flex flex-col h-full items-stretch gap-4"
      minSize="35%"
      defaultSize="50%"
    >
      <MapContainer className="grow">
        <OpenLayersMap
          key={`map-${map?.id}`}
          layers={map?.layers}
          onMapReady={setMap}
        />
      </MapContainer>
    </ResizablePanel>
  )
}
