import { getMainGeoserverMap } from '@/admin/actions/geoserver-map'
import { OpenLayersMap } from '@/components/openlayers-map/openlayers-map'
import { Item, ItemFooter } from '@/components/ui/item'

export default async function Home() {
  const mainMap = await getMainGeoserverMap()

  return (
    <main className="grow flex px-4 lg:px-6 pb-4 lg:pb-6 items-stretch">
      <Item className="flex-col grow gap-2 items-stretch p-0">
        <ItemFooter className="rounded-xl basis-0 grow overflow-hidden shadow-lg bg-card ring-4 ring-white dark:ring-white/10 p-0">
          <OpenLayersMap mapData={mainMap} />
        </ItemFooter>
      </Item>
    </main>
  )
}
