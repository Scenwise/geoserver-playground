'use server'

import { geoserverMaps } from '@/lib/db/schema/geoserver'
import { CompareMapDropdown } from './compare-map-dropdown'
import { GeoserverMapItem } from './geoserver-map-item'
import { getGeoserverMaps } from '../actions/geoserver-map'

export async function CompareMapSelector({
  map,
  paramKey,
}: {
  map: typeof geoserverMaps.$inferSelect | null
  paramKey: string
}) {
  const geoserverMaps = await getGeoserverMaps()

  return (
    <div className="grow flex flex-col items-stretch gap-2">
      <CompareMapDropdown map={map} maps={geoserverMaps} paramKey={paramKey} />

      {map && <GeoserverMapItem map={map} />}
    </div>
  )
}
