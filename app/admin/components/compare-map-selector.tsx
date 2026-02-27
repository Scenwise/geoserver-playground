'use server'

import { db } from '@/lib/db'
import { geoserverMaps } from '@/lib/db/schema'
import { CompareMapDropdown } from './compare-map-dropdown'
import { GeoserverMapItem } from './geoserver-map-item'

export async function CompareMapSelector({
  map,
  paramKey,
}: {
  map?: typeof geoserverMaps.$inferSelect
  paramKey: string
}) {
  const maps = await db.select().from(geoserverMaps).orderBy(geoserverMaps.name)

  return (
    <div className="grow flex flex-col items-stretch gap-2">
      <CompareMapDropdown map={map} maps={maps} paramKey={paramKey} />

      {map && <GeoserverMapItem map={map} />}
    </div>
  )
}
