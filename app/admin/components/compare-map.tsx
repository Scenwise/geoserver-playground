import { OpenLayersMap, MapContainer } from '@/components/openlayers-map'
import { ResizablePanel } from '@/components/ui/resizable'
import { db } from '@/lib/db'
import { geoserverMaps } from '@/lib/db/schema'
import { CompareMapSelector } from './compare-map-selector'
import { GeoserverMapItem } from './geoserver-map-item'

export async function CompareMap({
  id,
  paramKey,
}: {
  id?: string
  paramKey: string
}) {
  const maps = await db.select().from(geoserverMaps).orderBy(geoserverMaps.name)

  const map = id ? maps.find((m) => m.id === parseInt(id)) : undefined

  return (
    <CompareMapContainer>
      <CompareMapSelector map={map} maps={maps} paramKey={paramKey} />

      {map && <GeoserverMapItem map={map} />}

      <MapContainer className="grow">
        <OpenLayersMap
          key={`map-${map?.id}`}
          edgeLayerId={map?.geoserverEdges}
          nodeLayerId={map?.geoserverNodes}
        />
      </MapContainer>
    </CompareMapContainer>
  )
}

function CompareMapContainer({ children }: { children: React.ReactNode }) {
  return (
    <ResizablePanel
      className="p-4 flex flex-col h-full items-stretch gap-4"
      minSize="35%"
      defaultSize="50%"
    >
      {children}
    </ResizablePanel>
  )
}
