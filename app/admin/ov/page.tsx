import { MapContainer, OpenLayersMap } from '@/components/openlayers-map'
import { PageContainer, PageContent } from '@/components/page/page-container'
import {
  PageHeader,
  PageHeaderContent,
  PageHeaderTitle,
} from '@/components/page/page-header'
import { safeJson } from '@/lib/safe-json'
import { OVMap } from '../components/ov-map'

export default async function OVPage() {
  // const response = await fetch(
  //   `https://geoserver.scenwise.nl/geoserver/rest/workspaces/scenwise/datastores/skeleton-edge-v1/featuretypes/skeleton_graph_edges.json`,
  // )
  // const { json, error } = await safeJson(response)

  const nativeBoundingBox = {
    minx: 4.45633202791214,
    maxx: 4.479648470878601,
    miny: 51.91293712307457,
    maxy: 51.92055399089509,
    crs: 'EPSG:4326',
  }

  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: `
    [out:json];
    node["highway"="bus_stop"](${nativeBoundingBox.miny},${nativeBoundingBox.minx},${nativeBoundingBox.maxy},${nativeBoundingBox.maxx});
    out;
  `,
  })
  const { json, error } = await safeJson(response)

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderTitle>OV</PageHeaderTitle>
        </PageHeaderContent>
      </PageHeader>

      <PageContent className="flex gap-4 max-h-40 overflow-y-auto">
        {error ? (
          <pre className="text-destructive">
            Could not load bus stops from Overpass API: {error.message}
          </pre>
        ) : (
          <pre className="text-wrap">{JSON.stringify(json, null, 2)}</pre>
        )}
      </PageContent>

      <PageContent className="grow flex">
        <MapContainer>
          <OVMap stops={json?.elements ?? []} />
        </MapContainer>
      </PageContent>
    </PageContainer>
  )
}
