import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu'
import { SplineIcon, GitCommitIcon, ChevronRightIcon } from 'lucide-react'
import { LayersControlPublicTransport } from './layers-control-public-transport'
import { Map } from 'ol'
import { cn } from '@/lib/utils'
import { useShallow } from 'zustand/react/shallow'
import { useMapLayerStore } from '@/providers/MapLayerStoreProvider'

export function LayersControlMain({
  map,
  setSelected,
}: {
  map: Map | null
  setSelected: (selected: number | null) => void
}) {
  const layers = useMapLayerStore(
    useShallow((state) => Object.values(state.layers)),
  )

  return (
    <>
      <DropdownMenuLabel>Map layers</DropdownMenuLabel>

      {layers?.map((layer) => (
        <DropdownMenuItem
          key={layer.type + '' + layer.id}
          onSelect={() => setSelected(layer.id)}
          className={layer.enabled ? '' : 'line-through text-muted-foreground'}
        >
          {layer.type === 'edges' ? <SplineIcon /> : <GitCommitIcon />}

          <span className={cn('first-letter:capitalize grow')}>
            {layer.name}
          </span>

          {layer.opacity < 1 && layer.enabled && (
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
