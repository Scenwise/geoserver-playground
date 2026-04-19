'use client'

import {
  OpenLayersMap,
  MapContainer,
} from '@/components/openlayers-map/openlayers-map'
import { PageContainer, PageContent } from '@/components/page/page-container'
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/components/page/page-header'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Feature, Map, MapBrowserEvent } from 'ol'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import { Circle, Fill, Icon, Stroke, Style } from 'ol/style'
import { Point } from 'ol/geom'
import { Coordinate } from 'ol/coordinate'
import { Button } from '@/components/ui/button'
import { RefreshCcwIcon } from 'lucide-react'
import { tools } from '@/admin/data/admin-sidebar'
import { StreetviewContainer } from '../components/streetview-container'
import { getMainGeoserverMap } from '../actions/geoserver-map'
import { StreetviewPath } from '../components/steetview-path'
import { StreetviewSegmentation2 } from '../components/streetview-segmentation-2'
import { useSegmentationStore } from '@/store/segmentationStore'
import { latLngToCoordinate } from '@/lib/google-maps'

export function StreetviewClientPage({
  map,
}: {
  map: Awaited<ReturnType<typeof getMainGeoserverMap>>
}) {
  const [swappedLayout, setSwappedLayout] = useState(false)
  const [isSegmentationMode, setIsSegmentationMode] = useState(false)

  const [location, setLocation] = useState<
    { position: Coordinate; heading: number; zoom: number } | undefined
  >()

  const [mapRef, setMap] = useState<Map | null>(null)
  const clickSource = useRef<VectorSource>(new VectorSource())
  const keyframeSource = useRef<VectorSource>(new VectorSource())

  const initializeStreetViewLayers = useCallback(() => {
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
    mapRef?.addLayer(clickLayer)

    const keyframeLayer = new VectorLayer({
      zIndex: 10000,
      source: keyframeSource.current,
      style: (feature) =>
        new Style({
          image: new Circle({
            radius: feature.get('isKeyframe') ? 7 : 5,
            fill: new Fill({
              color: `rgb(0, 255, 0)`,
            }),
            stroke: feature.get('isSelected')
              ? new Stroke({ color: 'rgb(0, 155, 0)', width: 2 })
              : undefined,
          }),
        }),
    })
    mapRef?.addLayer(keyframeLayer)
  }, [mapRef])

  const lastPosition = useRef<string>('')
  const updatePosition = useCallback(
    (position: Coordinate, heading = 0, zoom = 1) => {
      const key = `${position[0]},${position[1]},${heading},${zoom}`
      if (key === lastPosition.current) return
      lastPosition.current = key

      setLocation({ position, heading, zoom })

      clickSource.current.clear()
      const feature = new Feature({ geometry: new Point(position), heading })
      clickSource.current.addFeature(feature)

      // Keep the map centered on the new position
      mapRef?.getView().animate({
        center: position,
        duration: 100,
      })
    },
    [mapRef],
  )

  // Show interpolated keyframes as green dots on the map for debugging
  const { getInterpolatedKeyframes, selectedIndex } = useSegmentationStore()
  const keyframes = getInterpolatedKeyframes()

  useEffect(() => {
    keyframeSource.current.clear()
    keyframes.forEach((kf) => {
      const feature = new Feature({
        geometry: new Point(latLngToCoordinate(kf.position)),
        isKeyframe: !kf.interpolated,
        isSelected: keyframes.indexOf(kf) === selectedIndex,
      })
      keyframeSource.current.addFeature(feature)
    })
  }, [keyframes, selectedIndex])

  useEffect(() => {
    if (!mapRef) return

    initializeStreetViewLayers()

    const handler = (evt: MapBrowserEvent) => {
      updatePosition(evt.coordinate)
    }

    mapRef.on('click', handler)
    return () => mapRef.un('click', handler)
  }, [initializeStreetViewLayers, mapRef, updatePosition])

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
      <PageContent className="grow grid gap-6 grid-cols-2 grid-rows-[1fr_1fr_auto]">
        <MapContainer
          className={
            swappedLayout ? 'col-[2/3] row-[1/2]' : 'col-[1/2] row-[1/3]'
          }
        >
          <OpenLayersMap onMapReady={setMap} mapData={map} />
        </MapContainer>

        {!isSegmentationMode ? (
          <StreetviewContainer
            className={
              swappedLayout ? 'col-[1/2] row-[1/3]' : 'col-[2/3] row-[1/3]'
            }
            position={location?.position}
            onPositionChange={updatePosition}
          />
        ) : (
          <StreetviewSegmentation2 className="col-[2/3] row-[1/3]" />
        )}

        <StreetviewPath
          className="col-[1/3] row-[3/4]"
          location={location}
          isSegmentationMode={isSegmentationMode}
          onModeChange={setIsSegmentationMode}
        />
      </PageContent>
    </PageContainer>
  )
}
