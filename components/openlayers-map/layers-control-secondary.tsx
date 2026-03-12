import { DropdownMenuItem, DropdownMenuLabel } from '../ui/dropdown-menu'
import { ArrowLeftIcon } from 'lucide-react'
import { Slider } from '../ui/slider'
import { Switch } from '../ui/switch'
import { useMapLayerStore } from '@/store/mapLayerStore'

export function LayersControlSecondary({
  mapLayerId,
  setSelected,
}: {
  mapLayerId: string
  setSelected: (selected: string | null) => void
}) {
  const { toggleLayer, setOpacity, setAlignIndex } = useMapLayerStore()
  const { type, enabled, opacity, source } = useMapLayerStore(
    (state) => state.layers[mapLayerId],
  )
  const alignIndex = useMapLayerStore((state) => {
    const layer = state.layers[mapLayerId]
    return layer?.source === 'custom' ? layer.alignIndex : 0
  })

  return (
    <>
      <DropdownMenuItem
        className="first-letter:capitalize"
        onSelect={() => setSelected(null)}
      >
        <ArrowLeftIcon className="text-muted-foreground" />
        <DropdownMenuLabel className="first-letter:capitalize px-0">
          {type}
        </DropdownMenuLabel>
      </DropdownMenuItem>
      <DropdownMenuItem inset onSelect={() => toggleLayer(mapLayerId)}>
        <span className="grow">Visible</span>
        <Switch size="sm" id="public-transport" checked={enabled} />
      </DropdownMenuItem>

      <DropdownMenuItem
        inset
        disabled={!enabled}
        className="flex-col gap-3 py-2 items-stretch"
      >
        <div className="flex items-center justify-between gap-2">
          <span>Opacity</span>
          <span className="text-xs text-muted-foreground">
            {Math.round(opacity * 100)}%
          </span>
        </div>
        <Slider
          value={[opacity]}
          onValueChange={([value]) => setOpacity(mapLayerId, value)}
          min={0}
          max={1}
          step={0.1}
        />
      </DropdownMenuItem>

      {source === 'custom' && (
        <DropdownMenuItem
          inset
          disabled={!enabled}
          className="flex-col gap-3 py-2 items-stretch"
        >
          <div className="flex items-center justify-between gap-2">
            <span>Alignment</span>
            <span className="text-xs text-muted-foreground">{alignIndex}</span>
          </div>
          <Slider
            value={[alignIndex]}
            onValueChange={([value]) => setAlignIndex(mapLayerId, value)}
            min={-50}
            max={50}
            step={1}
          />
        </DropdownMenuItem>
      )}
    </>
  )
}
