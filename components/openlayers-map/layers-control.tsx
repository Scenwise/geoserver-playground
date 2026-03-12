import { cn } from '@/lib/utils'
import { Map } from 'ol'
import { Toggle } from '../ui/toggle'
import { ChevronUpIcon, Layers2Icon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { useState } from 'react'
import { usePublicTransportLayer } from '@/hooks/use-public-transport-layer'
import { useMapLayer } from '@/hooks/use-map-layer'
import { LayersControlMain } from './layers-control-main'
import { LayersControlSecondary } from './layers-control-secondary'

export type MapLayer = ReturnType<typeof useMapLayer>

export function LayersControl({
  map,
  className,
}: {
  map: Map | null
  className?: string
  mapLayers?: MapLayer[]
}) {
  const [open, setOpen] = useState(false)

  const { popup } = usePublicTransportLayer(map)

  const [selectedId, setSelectedId] = useState<number | null>(null)

  return (
    <>
      <div
        className={cn(
          'bg-background ring-2 ring-background shadow rounded-lg',
          className,
        )}
      >
        <DropdownMenu open={open} modal={false}>
          <DropdownMenuTrigger asChild>
            <Toggle
              variant="outline"
              pressed={open}
              onPressedChange={() => setOpen((open) => !open)}
            >
              <Layers2Icon />
              <ChevronUpIcon
                className={cn('transition-transform', { 'rotate-180': open })}
              />
            </Toggle>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            side="top"
            sideOffset={3 * 4}
            className="bg-background/80 ring-2 ring-background backdrop-blur-lg shadow-lg min-w-60 transition-[max-height] duration-300 overflow-hidden"
          >
            <DropdownMenuGroup>
              {selectedId !== null ? (
                <LayersControlSecondary
                  mapLayerId={selectedId}
                  setSelected={setSelectedId}
                />
              ) : (
                <LayersControlMain map={map} setSelected={setSelectedId} />
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {popup}
    </>
  )
}
