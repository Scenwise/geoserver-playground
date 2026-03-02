import { PageContainer } from '@/components/page/page-container'
import { CompareMapSelector } from '../components/compare-map-selector'
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/components/page/page-header'
import { CompareMapSwap } from '../components/compare-map-swap'
import { CompareMaps } from '../components/compare-maps'
import { geoserverMaps } from '@/lib/db/schema/geoserver'
import { db } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { tools } from '../data/admin-sidebar'

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ map1?: string; map2?: string }>
}) {
  const { map1, map2 } = await searchParams

  const getMap = (id?: string) =>
    id
      ? db
          .select()
          .from(geoserverMaps)
          .where(eq(geoserverMaps.id, parseInt(id)))
          .then((maps) => maps[0])
      : undefined

  const [map1Data, map2Data] = await Promise.all([getMap(map1), getMap(map2)])

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderTitle>Compare maps</PageHeaderTitle>
          <PageHeaderDescription>
            {tools.compare.description}
          </PageHeaderDescription>
        </PageHeaderContent>

        <PageHeaderActions>
          <CompareMapSwap />
        </PageHeaderActions>
      </PageHeader>

      <div className="grid grid-cols-2 gap-8.25 px-4 mb-2">
        <CompareMapSelector map={map1Data} paramKey="map1" />
        <CompareMapSelector map={map2Data} paramKey="map2" />
      </div>

      <CompareMaps map1={map1Data} map2={map2Data} />
    </PageContainer>
  )
}
