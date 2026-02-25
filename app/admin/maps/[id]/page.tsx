import { MapContainer } from '@/components/map-container';
import { MapboxMap } from '@/components/mapbox-map';
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { GitCommitIcon, SplineIcon } from 'lucide-react';
import { GeoserverMapForm } from '../../components/goeserver-map-form';
import { geoserverMaps } from '@/lib/db/schema';
import { FeatureCountBadge } from '../../components/feature-count-badge';

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
          <h1 className="scroll-m-24 text-3xl font-semibold tracking-tight sm:text-3xl">
            {map?.name}
          </h1>

          <div className="flex flex-wrap gap-2">
            <FeatureCountBadge id={map?.geoserverNodes || ''} type="nodes" />
            <FeatureCountBadge id={map?.geoserverEdges || ''} type="edges" />
          </div>
        </div>

        <GeoserverMapForm data={map} />
      </header>

      <MapContainer className="grow">
        <MapboxMap
          edgeLayerId={map.geoserverEdges}
          nodeLayerId={map.geoserverNodes}
        />
      </MapContainer>
    </div>
  );
}
