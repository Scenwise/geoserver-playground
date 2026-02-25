import { MapContainer } from '@/components/map-container';
import { MapboxMap } from '@/components/mapbox-map';
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { GitCommitIcon, SplineIcon } from 'lucide-react';
import { GeoserverMapForm } from '../../components/goeserver-map-form';
import { geoserverMaps } from '@/lib/db/schema';

export default async function MapPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  console.log('Fetching data for map with id:', id);

  const [map] = await db
    .select()
    .from(geoserverMaps)
    .where(eq(geoserverMaps.id, Number(id)));

  const edgeData = await fetch(
    `https://geoserver.scenwise.nl/geoserver/scenwise/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${map?.geoserverEdges}&outputFormat=application%2Fjson&maxFeatures=0`,
  );

  const nodeData = await fetch(
    `https://geoserver.scenwise.nl/geoserver/scenwise/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${map?.geoserverNodes}&outputFormat=application%2Fjson&maxFeatures=0`,
  );

  let edges = {};
  let nodes = {};
  try {
    edges = await edgeData.json();
    nodes = await nodeData.json();
  } catch (error) {
    console.error('Failed to parse edge or node data:', error);
  }

  return (
    <div className="min-h-svh flex flex-col px-4 pt-12 pb-4 space-y-6">
      <header className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="scroll-m-24 text-3xl font-semibold tracking-tight sm:text-3xl">
            {map?.name}
          </h1>

          <div className="flex gap-2">
            <Badge variant="secondary">
              <GitCommitIcon />
              {nodes?.totalFeatures} nodes ({map.geoserverNodes})
            </Badge>

            <Badge variant="secondary">
              <SplineIcon />
              {edges?.totalFeatures} edges ({map.geoserverEdges})
            </Badge>
          </div>
        </div>

        <GeoserverMapForm data={map} />
      </header>

      <MapContainer className="grow">
        <MapboxMap />
      </MapContainer>
    </div>
  );
}
