import { TabsContent } from '@/components/ui/tabs'
import { Coordinate } from 'ol/coordinate'
import { StreetviewPanorama } from './streetview-panorama'
import { StreetviewBirdseye } from './streetview-birdseye'
import { SquareMousePointerIcon } from 'lucide-react'
import { TabsCard } from './tabs-card'

export function StreetviewContainer({
  position,
  onPositionChange,
  className = '',
}: {
  position?: Coordinate
  onPositionChange: (
    position: Coordinate,
    heading: number,
    zoom: number,
  ) => void
  className?: string
}) {
  const tabs = [
    { label: 'Street view', value: 'streetview' },
    { label: "Bird's-eye view", value: 'birdseye' },
  ]

  return (
    <TabsCard tabs={tabs} className={className}>
      <TabsContent value="streetview" asChild>
        {position ? (
          <StreetviewPanorama
            position={position}
            onPositionChange={onPositionChange}
          />
        ) : (
          <StreetviewFallback />
        )}
      </TabsContent>

      <TabsContent value="birdseye" asChild>
        {position ? (
          <StreetviewBirdseye
            position={position}
            onPositionChange={onPositionChange}
          />
        ) : (
          <StreetviewFallback />
        )}
      </TabsContent>
    </TabsCard>
  )
}

function StreetviewFallback() {
  return (
    <div className="flex h-full border-2 border-dashed border-border rounded-xl flex-col items-center justify-center p-6 gap-4 text-center">
      <SquareMousePointerIcon className="size-10 text-muted-foreground" />
      <p className="text-muted-foreground text-sm">
        Click a location on the map to open streetview.
      </p>
    </div>
  )
}
