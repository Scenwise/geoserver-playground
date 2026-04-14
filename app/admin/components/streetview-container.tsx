import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Coordinate } from 'ol/coordinate'
import { StreetviewPanorama } from './streetview-panorama'
import { StreetviewBirdseye } from './streetview-birdseye'
import { cn } from '@/lib/utils'
import { SquareMousePointerIcon } from 'lucide-react'

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
    <Tabs
      defaultValue="streetview"
      className={cn(
        'w-full h-full bg-card shadow-centered overflow-hidden rounded-2xl gap-0',
        className,
      )}
    >
      <TabsList className="w-full p-0  rounded-none pb-7 h-16! -mb-7 overflow-hidden">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="shadow-none! rounded-b-none rounded-t-2xl pb-7 -mb-7 h-16"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="bg-card p-2 grow rounded-2xl relative z-10 *:rounded-[calc(var(--radius-2xl)-8px)] *:size-full ">
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
      </div>
    </Tabs>
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
