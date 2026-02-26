'use client'

import { MapContainer } from '@/components/map-container'
import { MapboxMap } from '@/components/mapbox-map'
import { PageContainer, PageContent } from '@/components/page/page-container'
import {
  PageHeader,
  PageHeaderContent,
  PageHeaderTitle,
} from '@/components/page/page-header'
import Script from 'next/script'
import { StreetviewPano } from '../components/streetview-pano'
import { useEffect, useRef, useState } from 'react'
import { Feature, Map } from 'ol'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import { Icon, Style } from 'ol/style'
import { Point } from 'ol/geom'
import { Coordinate } from 'ol/coordinate'

export default function StreetviewPage() {
  const [position, setPosition] = useState<Coordinate>()

  const mapRef = useRef<Map | null>(null)
  const clickSource = useRef<VectorSource>(new VectorSource())

  useEffect(() => {
    if (!mapRef.current) return

    initializeStreetViewLayer()

    mapRef.current.on('click', (evt) => {
      updatePosition(evt.coordinate)
    })
  }, [mapRef])

  function initializeStreetViewLayer() {
    const clickLayer = new VectorLayer({
      source: clickSource.current,
      style: new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: 'https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png',
        }),
      }),
    })

    mapRef.current!.addLayer(clickLayer)
  }

  function updatePosition(position: Coordinate) {
    setPosition(position)

    clickSource.current.clear()

    const feature = new Feature({ geometry: new Point(position) })
    clickSource.current.addFeature(feature)

    // Keep the map centered on the new position
    mapRef.current!.getView().animate({
      center: position,
      duration: 100,
    })
  }

  return (
    <>
      <PageContainer>
        <PageHeader>
          <PageHeaderContent>
            <PageHeaderTitle>Streetview</PageHeaderTitle>
          </PageHeaderContent>
        </PageHeader>

        <PageContent className="flex grow gap-6">
          <MapContainer>
            <MapboxMap mapRef={mapRef} />
          </MapContainer>

          <div className="w-1/3">
            <StreetviewPano
              position={position}
              onPositionChange={updatePosition}
            />
          </div>
        </PageContent>
      </PageContainer>

      <Script
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBV_2uZSYF39j9I6elryKUkOLerNVVnoqU&v=weekly"
        defer
        async
      />
    </>
  )
}
