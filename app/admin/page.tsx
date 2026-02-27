import { PageContainer, PageContent } from '@/components/page/page-container'
import {
  PageHeader,
  PageHeaderContent,
  PageHeaderTitle,
} from '@/components/page/page-header'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { db } from '@/lib/db'
import { geoserverMaps } from '@/lib/db/schema'
import { ChevronsLeftRightIcon, ViewIcon } from 'lucide-react'
import Link from 'next/link'
import { GeoserverMapItem } from './components/geoserver-map-item'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function Home() {
  const dbMaps = await db
    .select()
    .from(geoserverMaps)
    .orderBy(geoserverMaps.name)

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderTitle>Dashboard</PageHeaderTitle>
        </PageHeaderContent>
      </PageHeader>

      <PageContent className="grid grid-cols-2 2xl:grid-cols-3 gap-6 grow">
        <Card className="bg-secondary ring-0">
          <CardHeader>
            <CardTitle>Maps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dbMaps.map((map) => (
              <GeoserverMapItem key={map.id} map={map} />
            ))}
          </CardContent>
        </Card>

        <Card className="bg-secondary ring-0">
          <CardHeader>
            <CardTitle>Tools</CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-2 auto-rows-fr gap-4">
            <Item asChild variant="outline" className="p-4 bg-card">
              <Link href="/admin/compare">
                <ItemHeader>
                  <ChevronsLeftRightIcon className="size-10 m-1 mb-3" />
                </ItemHeader>
                <ItemContent>
                  <ItemTitle className="text-base font-semibold">
                    Compare Maps
                  </ItemTitle>
                  <ItemDescription>
                    Compare two map versions side by side
                  </ItemDescription>
                </ItemContent>
              </Link>
            </Item>

            <Item asChild variant="outline" className="p-4 bg-card">
              <Link href="/admin/streetview">
                <ItemHeader>
                  <ViewIcon className="size-10 m-1 mb-3" />
                </ItemHeader>
                <ItemContent>
                  <ItemTitle className="text-base font-semibold">
                    Streetview
                  </ItemTitle>
                  <ItemDescription>
                    View street-level imagery for a location
                  </ItemDescription>
                </ItemContent>
              </Link>
            </Item>
          </CardContent>
        </Card>
      </PageContent>
    </PageContainer>
  )
}
