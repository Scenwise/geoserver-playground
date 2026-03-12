'use client'

import {
  MapContainer,
  OpenLayersMap,
} from '@/components/openlayers-map/openlayers-map'
import {
  getGeoserverMapById,
  setGeoServerInitialView,
} from '../actions/geoserver-map'
import { Button } from '@/components/ui/button'
import { useEffect, useMemo, useState } from 'react'
import { Map } from 'ol'
import { PageContent } from '@/components/page/page-container'
import { Separator } from '@/components/ui/separator'
import { FullscreenIcon, SquareCheckIcon } from 'lucide-react'

export function GeoserverMapEditor({
  map: mapData,
}: {
  map: Awaited<ReturnType<typeof getGeoserverMapById>>
}) {
  const [map, setMap] = useState<Map | null>(null)

  const [center, setCenter] = useState<[number, number]>()
  const [zoom, setZoom] = useState<number>()
  useEffect(() => {
    if (!map) return

    const handler = () => {
      const view = map.getView()
      if (view) {
        setCenter(view.getCenter()?.map(Math.round) as [number, number])
        setZoom(Math.round(view.getZoom() ?? 0))
      }
    }

    map.on('moveend', handler)
    return () => map.un('moveend', handler)
  }, [map])

  const isAtDefaultView = useMemo(() => {
    if (!mapData || !center || zoom === undefined) return false

    const { initialX, initialY, initialZoom } = mapData
    const [currentX, currentY] = center
    return (
      currentX === initialX && currentY === initialY && zoom === initialZoom
    )
  }, [center, zoom, mapData])

  const hasInitialView = useMemo(() => {
    if (!mapData) return false

    const { initialX, initialY, initialZoom } = mapData
    return !!(initialX && initialY && initialZoom)
  }, [mapData])

  function goToInitialView() {
    if (!map) return

    if (!mapData?.initialX || !mapData?.initialY || !mapData?.initialZoom)
      return

    const view = map.getView()
    view.animate({
      center: [mapData.initialX, mapData.initialY],
      zoom: mapData.initialZoom,
      duration: 500,
    })
  }

  function setInitialView() {
    if (!mapData?.id || !center || zoom === undefined) return

    setGeoServerInitialView(mapData.id, center[0], center[1], zoom)
  }

  return (
    <PageContent className="grow flex flex-col rounded-2xl bg-accent p-0 mx-4">
      <div className="flex justify-end gap-1 p-2">
        <Button
          onClick={setInitialView}
          disabled={isAtDefaultView}
          size="sm"
          variant="ghost"
        >
          <SquareCheckIcon />
          Set initial viewport
        </Button>
        <Separator orientation="vertical" className="my-1" />
        <Button
          onClick={goToInitialView}
          disabled={!hasInitialView || isAtDefaultView}
          size="sm"
          variant="ghost"
        >
          <FullscreenIcon />
          Go to initial viewport
        </Button>
      </div>

      <MapContainer>
        <OpenLayersMap mapData={mapData} onMapReady={setMap} />
      </MapContainer>
    </PageContent>
  )
}
