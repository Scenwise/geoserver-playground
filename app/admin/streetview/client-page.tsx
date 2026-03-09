'use client'

import { geoserverMaps } from '@/lib/db/schema/geoserver'

import { OpenLayersMap, MapContainer } from '@/components/openlayers-map'
import { PageContainer, PageContent } from '@/components/page/page-container'
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/components/page/page-header'
import { useEffect, useRef, useState } from 'react'
import { Feature, Map } from 'ol'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import { Icon, Style } from 'ol/style'
import { Point } from 'ol/geom'
import { Coordinate } from 'ol/coordinate'
import { StreetviewSegmentation } from '@/admin/components/streetview-segmentation'
import { Button } from '@/components/ui/button'
import { RefreshCcwIcon } from 'lucide-react'
import { tools } from '@/admin/data/admin-sidebar'
import { StreetviewView } from '../components/streetview-view'

export function StreetviewClientPage({
  map,
}: {
  map: typeof geoserverMaps.$inferSelect | null
}) {
  const [swappedLayout, setSwappedLayout] = useState(false)

  const [position, setPosition] = useState<Coordinate>()

  const mapRef = useRef<Map | null>(null)
  const clickSource = useRef<VectorSource>(new VectorSource())

  function initializeStreetViewLayer() {
    const clickLayer = new VectorLayer({
      source: clickSource.current,
      style: (feature) =>
        new Style({
          image: new Icon({
            anchor: [0.5, 0.5],
            scale: 0.5,
            src: '/streetview-indicator.png',
            rotation: (feature.get('heading') * Math.PI) / 180,
          }),
        }),
    })

    mapRef.current!.addLayer(clickLayer)
  }

  function updatePosition(position: Coordinate, heading = 0) {
    setPosition(position)

    clickSource.current.clear()
    const feature = new Feature({ geometry: new Point(position), heading })
    clickSource.current.addFeature(feature)

    // Keep the map centered on the new position
    mapRef.current!.getView().animate({
      center: position,
      duration: 100,
    })
  }

  useEffect(() => {
    if (!mapRef.current) return

    initializeStreetViewLayer()

    mapRef.current.on('click', (evt) => {
      updatePosition(evt.coordinate)
    })
  }, [mapRef])

  return (
    <PageContainer className="max-h-screen">
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderTitle>Streetview</PageHeaderTitle>
          <PageHeaderDescription>
            {tools.streetview.description}
          </PageHeaderDescription>
        </PageHeaderContent>

        <PageHeaderActions>
          <Button
            onClick={() => setSwappedLayout(!swappedLayout)}
            variant="secondary"
          >
            <RefreshCcwIcon />
            Swap layout
          </Button>
        </PageHeaderActions>
      </PageHeader>
      <PageContent className="grow grid gap-6 grid-cols-3 grid-rows-2">
        <MapContainer
          className={
            swappedLayout ? 'col-[3/4] row-[1/2]' : 'col-[1/3] row-[1/3]'
          }
        >
          <OpenLayersMap
            ref={mapRef}
            nodeLayerId={map?.geoserverNodes}
            edgeLayerId={map?.geoserverEdges}
          />
        </MapContainer>

        <StreetviewView
          className={
            swappedLayout ? 'col-[1/3] row-[1/3]' : 'col-[3/4] row-[1/2]'
          }
          position={position}
          onPositionChange={updatePosition}
        />

        <StreetviewSegmentation
          className="col-[3/4] row-[2/3]"
          position={position}
        />
      </PageContent>
    </PageContainer>
  )
}
