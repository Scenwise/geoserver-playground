'use server'

import { OpenLayersMap, MapContainer } from '@/components/openlayers-map'
import { GeoserverMapForm } from '../../components/goeserver-map-form'
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
import { getGeoserverMapById } from '../../actions/geoserver-map'
import { notFound } from 'next/navigation'

export default async function MapPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const geoserverMap = await getGeoserverMapById(parseInt(id))

  if (!geoserverMap) notFound()

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <div className="flex items-center gap-2">
            <PageHeaderTitle>{geoserverMap?.name}</PageHeaderTitle>

            {geoserverMap?.isMain && (
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

          {geoserverMap?.description && (
            <PageHeaderDescription>
              {geoserverMap.description}
            </PageHeaderDescription>
          )}
        </PageHeaderContent>

        <PageHeaderActions>
          <GeoserverMapMainButton
            map={{ id: geoserverMap?.id, isMain: geoserverMap?.isMain }}
          />
          <GeoserverMapForm data={geoserverMap}>
            <Button variant="secondary">
              <PenIcon />
              Edit
            </Button>
          </GeoserverMapForm>
          <Button asChild variant="secondary">
            <Link href={`/admin/compare?map1=${geoserverMap?.id}`}>
              <ChevronsLeftRightIcon />
              Compare
            </Link>
          </Button>
        </PageHeaderActions>
      </PageHeader>

      <PageContent className="flex gap-4">
        <FeatureCountBadge
          id={geoserverMap?.geoserverNodes || ''}
          type="nodes"
        />
        <FeatureCountBadge
          id={geoserverMap?.geoserverEdges || ''}
          type="edges"
        />
      </PageContent>

      <PageContent className="grow flex">
        <MapContainer>
          <OpenLayersMap
            edgeLayerId={geoserverMap.geoserverEdges}
            nodeLayerId={geoserverMap.geoserverNodes}
          />
        </MapContainer>
      </PageContent>
    </PageContainer>
  )
}
