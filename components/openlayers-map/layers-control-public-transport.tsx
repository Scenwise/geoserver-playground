import { BusIcon } from 'lucide-react'
import { DropdownMenuItem } from '../ui/dropdown-menu'
import { Spinner } from '../ui/spinner'
import { Switch } from '../ui/switch'
import { usePublicTransportLayer } from '@/hooks/use-public-transport-layer'
import { Map } from 'ol'

export function LayersControlPublicTransport({ map }: { map: Map | null }) {
  const {
    enabled: publicTransportEnabled,
    toggle: togglePublicTransport,
    isLoading,
    error,
    data,
  } = usePublicTransportLayer(map)

  return (
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
          <div className="text-xs text-destructive">Error loading layer</div>
        )}
      </div>

      <Switch
        size="sm"
        id="public-transport"
        checked={publicTransportEnabled}
      />
    </DropdownMenuItem>
  )
}
