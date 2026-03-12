'use server'

import {
  OpenLayersMap,
  MapContainer,
} from '@/components/openlayers-map/openlayers-map'
import { GeoserverMapForm } from '../../components/forms/goeserver-map-form'
import { FeatureCountBadge } from '../../components/feature-count-badge'
import { Button } from '@/components/ui/button'
import { GeoserverMapMainButton } from '../../components/geoserver-map-main-button'
import {
  ChevronsLeftRightIcon,
  PenIcon,
  PlusIcon,
  StarIcon,
} from 'lucide-react'
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
import { GeoserverLayerForm } from '@/admin/components/forms/goeserver-layer-form'

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

      <PageContent className="space-y-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          Layers
          <GeoserverLayerForm data={{ geoserverMapId: geoserverMap.id }}>
            <Button variant="secondary" size="sm">
              <PlusIcon />
              Add layer
            </Button>
          </GeoserverLayerForm>
        </h3>
        {geoserverMap.layers.length > 0 && (
          <div className="flex gap-4">
            {geoserverMap?.layers?.map((layer) => (
              <FeatureCountBadge key={layer.id} layer={layer} />
            ))}
          </div>
        )}
      </PageContent>

      <PageContent className="grow flex">
        <MapContainer>
          <OpenLayersMap layers={geoserverMap.layers} />
        </MapContainer>
      </PageContent>
    </PageContainer>
  )
}
