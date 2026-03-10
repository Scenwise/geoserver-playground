import { DropdownMenuItem, DropdownMenuLabel } from '../ui/dropdown-menu'
import { MapLayer } from './layers-control-main'
import { ArrowLeftIcon } from 'lucide-react'
import { Slider } from '../ui/slider'
import { Switch } from '../ui/switch'

export function LayersControlSecondary({
  mapLayer,
  setSelected,
}: {
  mapLayer: MapLayer
  setSelected: (selected: string | null) => void
}) {
  return (
    <>
      <DropdownMenuItem
        className="first-letter:capitalize"
        onSelect={() => setSelected(null)}
      >
        <ArrowLeftIcon className="text-muted-foreground" />
        <DropdownMenuLabel className="first-letter:capitalize px-0">
          {mapLayer.metadata?.type}s
        </DropdownMenuLabel>
      </DropdownMenuItem>
      <DropdownMenuItem inset onSelect={mapLayer.toggle}>
        <span className="grow">Visible</span>
        <Switch size="sm" id="public-transport" checked={mapLayer.enabled} />
      </DropdownMenuItem>

      <DropdownMenuItem
        inset
        disabled={!mapLayer.enabled}
        className="flex-col gap-3 py-2 items-stretch"
      >
        <div className="flex items-center justify-between gap-2">
          <span>Opacity</span>
          <span className="text-xs text-muted-foreground">
            {Math.round(mapLayer.opacity * 100)}%
          </span>
        </div>
        <Slider
          value={[mapLayer.opacity]}
          onValueChange={([value]) => mapLayer.setOpacity(value)}
          min={0}
          max={1}
          step={0.1}
        />
      </DropdownMenuItem>
    </>
  )
}
