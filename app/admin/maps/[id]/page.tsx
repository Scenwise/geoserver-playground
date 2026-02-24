import { MapContainer } from '@/components/map-container';
import { MapboxMap } from '@/components/mapbox-map';
import { MAP_CONFIG } from '@/data/maps';

export default async function MapPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const map = MAP_CONFIG.find((map) => map.id === id);

  const edgeData = await fetch(
    `https://geoserver.scenwise.nl/geoserver/scenwise/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${map?.edges}&outputFormat=application%2Fjson&maxFeatures=0`,
  );
  const edges = await edgeData.json();

  const nodeData = await fetch(
    `https://geoserver.scenwise.nl/geoserver/scenwise/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${map?.nodes}&outputFormat=application%2Fjson&maxFeatures=0`,
  );
  const nodes = await nodeData.json();

  return (
    <div className="min-h-svh flex flex-col px-4 pt-12 pb-4 space-y-12">
      <header className="space-y-2">
        <h1 className="scroll-m-24 text-3xl font-semibold tracking-tight sm:text-3xl">
          {map?.name}
        </h1>

        <p className="text-muted-foreground text-[1.05rem] sm:text-base sm:text-balance md:max-w-[80%]">
          {edges?.totalFeatures} edges, {nodes?.totalFeatures} nodes
        </p>
      </header>

      <MapContainer className="grow">
        <MapboxMap />
      </MapContainer>
    </div>
  );
}
