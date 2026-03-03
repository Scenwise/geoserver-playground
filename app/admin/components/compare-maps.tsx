'use client'

import { ResizablePanelGroup, ResizableHandle } from '@/components/ui/resizable'
import { geoserverMaps } from '@/lib/db/schema/geoserver'
import { CompareMap } from './compare-map'
import { useState } from 'react'
import { State } from 'ol/View'

export function CompareMaps({
  map1,
  map2,
}: {
  map1: typeof geoserverMaps.$inferSelect | null
  map2: typeof geoserverMaps.$inferSelect | null
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
