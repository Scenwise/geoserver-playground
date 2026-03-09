import { cn } from '@/lib/utils'
import { Map } from 'ol'
import { Toggle } from './ui/toggle'
import {
  BusIcon,
  ChevronUpIcon,
  GitCommitIcon,
  Layers2Icon,
  SplineIcon,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { useState } from 'react'
import { Switch } from './ui/switch'
import { usePublicTransportLayer } from '@/hooks/use-public-transport-layer'
import { Spinner } from './ui/spinner'
import { useMapLayer } from '@/hooks/use-map-layer'

export type MapLayer = ReturnType<typeof useMapLayer>

export function OpenLayersMapLayers({
  mapRef,
  className,
  mapLayers,
}: {
  mapRef: React.RefObject<Map | null>
  className?: string
  mapLayers?: MapLayer[]
}) {
  const [open, setOpen] = useState(false)

  const {
    enabled: publicTransportEnabled,
    toggle: togglePublicTransport,
    isLoading,
    error,
    data,
    popup,
  } = usePublicTransportLayer(mapRef)

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
            className="bg-background/80 ring-2 ring-background backdrop-blur-lg shadow-lg min-w-60"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel>Map layers</DropdownMenuLabel>

              {mapLayers?.map((layer) => (
                <DropdownMenuItem
                  key={layer.metadata?.type + '' + layer.metadata?.id}
                  onSelect={layer.toggle}
                >
                  {layer.metadata?.type === 'edge' ? (
                    <SplineIcon />
                  ) : (
                    <GitCommitIcon />
                  )}
                  <span className="first-letter:capitalize grow">
                    {layer.metadata?.type}s
                  </span>

                  <Switch
                    size="sm"
                    id="public-transport"
                    checked={layer.enabled}
                  />
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />

              <DropdownMenuLabel>Additional layers</DropdownMenuLabel>

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

      {popup}
    </>
  )
}
