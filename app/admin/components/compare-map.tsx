import { MapContainer } from '@/components/map-container';
import { MapboxMap } from '@/components/mapbox-map';
import { Button } from '@/components/ui/button';
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemMedia,
} from '@/components/ui/item';
import { ResizablePanel } from '@/components/ui/resizable';
import { db } from '@/lib/db';
import { geoserverMaps } from '@/lib/db/schema';
import Link from 'next/link';
import { eq } from 'drizzle-orm';
import { CompareMapSelector } from './compare-map-selector';
import { ChevronRightIcon, MapIcon } from 'lucide-react';

export async function CompareMap({
  id,
  paramKey,
}: {
  id?: string;
  paramKey: string;
}) {
  const maps = await db
    .select()
    .from(geoserverMaps)
    .orderBy(geoserverMaps.name);

  const map = id ? maps.find((m) => m.id === parseInt(id)) : undefined;

  return (
    <CompareMapContainer>
      <CompareMapSelector map={map} maps={maps} paramKey={paramKey} />

      {map && (
        <Item variant="outline">
          <ItemMedia variant="icon">
            <MapIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="overflow-visible">{map?.name}</ItemTitle>
            {map?.description && (
              <ItemDescription>{map.description}</ItemDescription>
            )}
          </ItemContent>
          <ItemActions>
            {map && (
              <Button asChild variant="secondary" size="sm">
                <Link href={`/admin/maps/${map?.id}`}>
                  Details
                  <ChevronRightIcon />
                </Link>
              </Button>
            )}
          </ItemActions>
        </Item>
      )}

      <MapContainer className="grow">
        <MapboxMap
          key={`map-${map?.id}`}
          edgeLayerId={map?.geoserverEdges}
          nodeLayerId={map?.geoserverNodes}
        />
      </MapContainer>
    </CompareMapContainer>
  );
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
  );
}
