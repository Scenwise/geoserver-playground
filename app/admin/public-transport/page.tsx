import { MapContainer, OpenLayersMap } from '@/components/openlayers-map'
import { PageContainer, PageContent } from '@/components/page/page-container'
import {
  PageHeader,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/components/page/page-header'
import { safeJson } from '@/lib/safe-json'
import { OVMap } from '../components/ov-map'
import { tools } from '../data/admin-sidebar'

export default async function PublicTransportPage() {
  // const response1 = await fetch(
  //   `https://geoserver.scenwise.nl/geoserver/rest/workspaces/scenwise/datastores/skeleton-edge-v1/featuretypes/skeleton_graph_edges.json`,
  // )

  // console.log(await response1.text())

  // const { json, error } = await safeJson(response1)

  // TODO: this bbox should ideally come from the geoserver layer's native bounding box
  const nativeBoundingBox = {
    minx: 4.45633202791214,
    maxx: 4.479648470878601,
    miny: 51.91293712307457,
    maxy: 51.92055399089509,
    crs: 'EPSG:4326',
  }

  const bbox = `${nativeBoundingBox.miny},${nativeBoundingBox.minx},${nativeBoundingBox.maxy},${nativeBoundingBox.maxx}`

  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: `
    [out:json];
    node["public_transport"="platform"](${bbox});
    out;
  `,
  })

  const { json, error, body } = await safeJson(response)

  if (error) {
    console.error(
      'Error fetching bus stops from Overpass API:',
      error.message,
      body,
    )
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderTitle>Public transport</PageHeaderTitle>
          <PageHeaderDescription>
            {tools.publicTransport.description}
          </PageHeaderDescription>
        </PageHeaderContent>
      </PageHeader>

      {/* <PageContent className="flex gap-4 max-h-40 overflow-y-auto">
        {error ? (
          <pre className="text-destructive">
            Could not load bus stops from Overpass API: {error.message}
          </pre>
        ) : (
          <pre className="text-wrap">{JSON.stringify(json, null, 2)}</pre>
        )}
      </PageContent> */}

      <PageContent className="grow flex">
        <MapContainer>
          <OVMap stops={json?.elements ?? []} />
        </MapContainer>
      </PageContent>
    </PageContainer>
  )
}
