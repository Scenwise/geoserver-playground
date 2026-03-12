'use client'

import { ResizablePanelGroup, ResizableHandle } from '@/components/ui/resizable'
import { CompareMap } from './compare-map'
import { useState } from 'react'
import { State } from 'ol/View'
import { getGeoserverMapById } from '../actions/geoserver-map'

export function CompareMaps({
  map1,
  map2,
}: {
  map1: Awaited<ReturnType<typeof getGeoserverMapById>>
  map2: Awaited<ReturnType<typeof getGeoserverMapById>>
}) {
  const [view, setView] = useState<Partial<State>>({
    center: [497598, 6785131],
    zoom: 17,
  })

  return (
    <ResizablePanelGroup
      orientation="horizontal"
      className="min-h-0 grow -mb-4"
    >
      <CompareMap
        key={`map-left-${map1?.id}`}
        map={map1}
        view={view}
        onViewChange={setView}
      />

      <ResizableHandle className="my-4" withHandle />

      <CompareMap
        key={`map-right-${map2?.id}`}
        map={map2}
        view={view}
        onViewChange={setView}
      />
    </ResizablePanelGroup>
  )
}
