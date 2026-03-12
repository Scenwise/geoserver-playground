import { useMapLayer } from '@/hooks/use-map-layer'
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu'
import { SplineIcon, GitCommitIcon, ChevronRightIcon } from 'lucide-react'
import { LayersControlPublicTransport } from './layers-control-public-transport'
import { Map } from 'ol'
import { cn } from '@/lib/utils'
import { useCustomMapLayer } from '@/hooks/use-custom-map-layer'

export type MapLayer = ReturnType<typeof useMapLayer | typeof useCustomMapLayer>

export function LayersControlMain({
  map,
  mapLayers,
  setSelected,
}: {
  map: Map | null
  mapLayers?: MapLayer[]
  setSelected: (selected: string | null) => void
}) {
  return (
    <>
      <DropdownMenuLabel>Map layers</DropdownMenuLabel>

      {mapLayers?.map((layer) => (
        <DropdownMenuItem
          key={layer.metadata?.type + '' + layer.metadata?.id}
          onSelect={() => setSelected(layer.metadata?.id ?? null)}
          className={layer.enabled ? '' : 'line-through text-muted-foreground'}
        >
          {layer.metadata?.type === 'edges' ? (
            <SplineIcon />
          ) : (
            <GitCommitIcon />
          )}

          <span className={cn('first-letter:capitalize grow')}>
            {layer.metadata?.type}s
          </span>

          {layer.opacity < 1 && (
            <div className="rounded-full size-2 bg-purple-500"></div>
          )}

          <ChevronRightIcon />
        </DropdownMenuItem>
      ))}

      <DropdownMenuSeparator />

      <DropdownMenuLabel>Additional layers</DropdownMenuLabel>

      <LayersControlPublicTransport map={map} />
    </>
  )
}
