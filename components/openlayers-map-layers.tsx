import { cn } from '@/lib/utils'
import { Map } from 'ol'
import { Toggle } from './ui/toggle'
import { BusIcon, ChevronUpIcon, Layers2Icon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { useState } from 'react'
import { Switch } from './ui/switch'
import { usePublicTransportLayer } from '@/hooks/use-public-transport-layer'
import { Spinner } from './ui/spinner'

export function OpenLayersMapLayers({
  mapRef,
  className,
}: {
  mapRef: React.RefObject<Map | null>
  className?: string
}) {
  const [open, setOpen] = useState(false)

  const {
    enabled: publicTransportEnabled,
    toggle: togglePublicTransport,
    isLoading,
    error,
    data,
  } = usePublicTransportLayer(mapRef)

  return (
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
          className="bg-background/80 ring-2 ring-background backdrop-blur-lg shadow-lg min-w-60"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel>Layers</DropdownMenuLabel>
            <DropdownMenuItem onSelect={togglePublicTransport}>
              {isLoading ? <Spinner /> : <BusIcon />}

              <div className="grow">
                <div>Public transport</div>

                {!data && !error && !isLoading && (
                  <div className="text-xs text-muted-foreground">
                    Show bus and tram stops
                  </div>
                )}

                {data && (
                  <div className="text-xs text-muted-foreground">
                    {data.elements.length} stops
                  </div>
                )}
                {error && (
                  <div className="text-xs text-destructive">
                    Error loading layer
                  </div>
                )}
              </div>

              <Switch
                size="sm"
                id="public-transport"
                checked={publicTransportEnabled}
              />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
