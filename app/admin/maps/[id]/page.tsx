import { MapContainer } from '@/components/map-container';
import { MapboxMap } from '@/components/mapbox-map';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { GeoserverMapForm } from '../../components/goeserver-map-form';
import { geoserverMaps } from '@/lib/db/schema';
import { FeatureCountBadge } from '../../components/feature-count-badge';
import { Button } from '@/components/ui/button';
import { setGeoServerMapMain } from '../../actions/geoserver-map';
import { GeoserverMapMainButton } from '../../components/geoserver-map-main-button';
import { ChevronsLeftRightIcon, PenIcon, StarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default async function MapPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [map] = await db
    .select()
    .from(geoserverMaps)
    .where(eq(geoserverMaps.id, Number(id)));

  return (
    <div className="min-h-svh flex flex-col px-4 pt-12 pb-4 space-y-6">
      <header className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="scroll-m-24 text-3xl font-semibold tracking-tight sm:text-3xl">
              {map?.name}
            </h1>
            {map.isMain && (
              <Badge
                variant="secondary"
                className="bg-purple-50 text-purple-700 border border-purple-700 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-300 "
              >
                <StarIcon />
                Main map
              </Badge>
            )}
          </div>

          {map?.description && (
            <p className="text-muted-foreground">{map.description}</p>
          )}
        </div>

        <div className="flex gap-2 items-center">
          <GeoserverMapMainButton map={{ id: map?.id, isMain: map?.isMain }} />
          <GeoserverMapForm data={map}>
            <Button variant="outline" size="sm">
              <PenIcon />
              Edit
            </Button>
          </GeoserverMapForm>
          <Button asChild variant="outline" size="sm">
            <Link href={`/admin/compare`}>
              <ChevronsLeftRightIcon />
              Compare
            </Link>
          </Button>
        </div>
      </header>

      <div className="flex gap-4">
        <FeatureCountBadge id={map?.geoserverNodes || ''} type="nodes" />
        <FeatureCountBadge id={map?.geoserverEdges || ''} type="edges" />
      </div>

      <MapContainer className="grow">
        <MapboxMap
          edgeLayerId={map.geoserverEdges}
          nodeLayerId={map.geoserverNodes}
        />
      </MapContainer>
    </div>
  );
}
