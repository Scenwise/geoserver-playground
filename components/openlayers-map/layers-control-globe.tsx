import { GlobeIcon } from 'lucide-react'
import { DropdownMenuItem } from '../ui/dropdown-menu'
import { Switch } from '../ui/switch'
import { Slider } from '../ui/slider'
import { useGlobeLayer } from '@/hooks/use-globe-layer'
import { Map } from 'ol'

export function LayersControlGlobe({
  map,
  onGlobeChange,
}: {
  map: Map | null
  onGlobeChange?: (enabled: boolean, tilt: number) => void
}) {
  const { enabled, tilt, setTilt, toggle, resetView } = useGlobeLayer(map)

  function handleToggle() {
    const next = !enabled
    toggle()
    onGlobeChange?.(next, tilt)
  }

  function handleTiltChange([value]: number[]) {
    setTilt(value)
    onGlobeChange?.(enabled, value)
  }

  return (
    <>
      <DropdownMenuItem onSelect={handleToggle}>
        <GlobeIcon />
        <div className="grow">
          <div>Globe view</div>
          {enabled ? (
            <div className="text-xs text-muted-foreground">
              Hold Ctrl + drag to rotate
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">
              Tilted 3D satellite view
            </div>
          )}
        </div>
        <Switch size="sm" checked={enabled} />
      </DropdownMenuItem>

      {enabled && (
        <DropdownMenuItem
          className="flex-col gap-3 py-2 items-stretch"
          onSelect={(e) => e.preventDefault()}
        >
          <div className="flex items-center justify-between gap-2 pl-6">
            <span className="text-sm">Tilt</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{tilt}°</span>
              <button
                className="text-xs text-primary underline"
                onClick={(e) => {
                  e.stopPropagation()
                  resetView()
                }}
              >
                Reset
              </button>
            </div>
          </div>
          <Slider
            className="pl-6"
            value={[tilt]}
            onValueChange={handleTiltChange}
            min={0}
            max={90}
            step={5}
          />
        </DropdownMenuItem>
      )}
    </>
  )
}
