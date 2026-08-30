import { MAP_STYLES, MapStyle, useMapStyle } from '@/hooks/use-map-style'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'
import { Map } from 'ol'
import { apply } from 'ol-mapbox-style'
import LayerGroup from 'ol/layer/Group'
import { useMapSettingsStore } from '@/store/mapSettingsStore'

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

export function StyleControl({
  map,
  className,
  globeActive,
  onGlobeToggle,
}: {
  map: Map | null
  className?: string
  globeActive?: boolean
  onGlobeToggle?: (enabled: boolean) => void
}) {
  const { mapStyle: style, setMapStyle: setStyle } = useMapSettingsStore()
  const { styleUrl } = useMapStyle(style)

  function onValueChange(value: string) {
    if (value === 'globe') {
      onGlobeToggle?.(true)
      return
    }
    if (MAP_STYLES[value as MapStyle]) {
      onGlobeToggle?.(false)
      setStyle(value as MapStyle)
    }
  }

  useEffect(() => {
    if (!map) return

    const layers = map.getLayers()

    // Remove existing layer
    layers.removeAt(0)

    // Add new style layer
    const layerGroup = new LayerGroup()
    apply(layerGroup, styleUrl, { accessToken })
    layers.insertAt(0, layerGroup)
  }, [styleUrl, map])

  const currentValue = globeActive ? 'globe' : style

  return (
    <ToggleGroup
      type="single"
      variant="outline"
      className={cn('bg-background ring-2 ring-background shadow', className)}
      value={currentValue}
      onValueChange={onValueChange}
    >
      {Object.entries(MAP_STYLES).map(([key, { label, icon: Icon }]) => (
        <ToggleGroupItem key={key} value={key}>
          <Icon />
          <span className="hidden @sm:block">{label}</span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
