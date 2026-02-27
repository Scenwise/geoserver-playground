import { Button } from '@/components/ui/button'
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from '@/components/ui/item'
import { geoserverMaps } from '@/lib/db/schema'
import { MapIcon, ChevronRightIcon } from 'lucide-react'
import Link from 'next/link'

export function GeoserverMapItem({
  map,
}: {
  map?: typeof geoserverMaps.$inferSelect
}) {
  return (
    <Item variant="outline" className="bg-card">
      <ItemMedia variant="icon">
        <MapIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="overflow-visible">{map?.name}</ItemTitle>
        {map?.description && (
          <ItemDescription>{map.description}</ItemDescription>
        )}
      </ItemContent>
      <ItemActions>
        {map && (
          <Button asChild variant="secondary" size="sm">
            <Link href={`/admin/maps/${map?.id}`}>
              Details
              <ChevronRightIcon />
            </Link>
          </Button>
        )}
      </ItemActions>
    </Item>
  )
}
