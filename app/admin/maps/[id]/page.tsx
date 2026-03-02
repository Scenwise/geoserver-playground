'use server'

import { OpenLayersMap, MapContainer } from '@/components/openlayers-map'
import { db } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { GeoserverMapForm } from '../../components/goeserver-map-form'
import { geoserverMaps } from '@/lib/db/schema/geoserver'
import { FeatureCountBadge } from '../../components/feature-count-badge'
import { Button } from '@/components/ui/button'
import { GeoserverMapMainButton } from '../../components/geoserver-map-main-button'
import { ChevronsLeftRightIcon, PenIcon, StarIcon } from 'lucide-react'
import Link from 'next/link'
import { ColoredBadge } from '@/components/colored-badge'
import { PageContainer, PageContent } from '@/components/page/page-container'
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/components/page/page-header'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export default async function MapPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [map] = await db
    .select()
    .from(geoserverMaps)
    .where(eq(geoserverMaps.id, Number(id)))

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <div className="flex items-center gap-2">
            <PageHeaderTitle>{map?.name}</PageHeaderTitle>

            {map.isMain && (
              <Tooltip>
                <TooltipTrigger>
                  <ColoredBadge className="bg-purple-100 text-purple-700  dark:bg-purple-900 dark:text-purple-300  ">
                    <StarIcon />
                    Main map
                  </ColoredBadge>
                </TooltipTrigger>

                <TooltipContent side="right">
                  This map will be used in the main application
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {map?.description && (
            <PageHeaderDescription>{map.description}</PageHeaderDescription>
          )}
        </PageHeaderContent>

        <PageHeaderActions>
          <GeoserverMapMainButton map={{ id: map?.id, isMain: map?.isMain }} />
          <GeoserverMapForm data={map}>
            <Button variant="secondary">
              <PenIcon />
              Edit
            </Button>
          </GeoserverMapForm>
          <Button asChild variant="secondary">
            <Link href={`/admin/compare?map1=${map?.id}`}>
              <ChevronsLeftRightIcon />
              Compare
            </Link>
          </Button>
        </PageHeaderActions>
      </PageHeader>

      <PageContent className="flex gap-4">
        <FeatureCountBadge id={map?.geoserverNodes || ''} type="nodes" />
        <FeatureCountBadge id={map?.geoserverEdges || ''} type="edges" />
      </PageContent>

      <PageContent className="grow flex">
        <MapContainer>
          <OpenLayersMap
            edgeLayerId={map.geoserverEdges}
            nodeLayerId={map.geoserverNodes}
          />
        </MapContainer>
      </PageContent>
    </PageContainer>
  )
}
