import { MAP_STYLES, MapStyle, useMapStyle } from '@/hooks/use-map-style'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'
import { RefObject, useEffect, useState } from 'react'
import { Map } from 'ol'
import { apply } from 'ol-mapbox-style'
import LayerGroup from 'ol/layer/Group'

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

export function OpenLayersMapStyle({
  mapRef,
  className,
}: {
  mapRef: RefObject<Map | null>
  className?: string
}) {
  const [style, setStyle] = useState<MapStyle>('basic')
  const { styleUrl } = useMapStyle(style)

  function onValueChange(value: string) {
    if (MAP_STYLES[value as MapStyle]) {
      setStyle(value as MapStyle)
    }
  }

  useEffect(() => {
    if (!mapRef.current) return

    const layers = mapRef.current.getLayers()

    // Remove existing layer
    layers.removeAt(0)

    // Add new style layer
    const layerGroup = new LayerGroup()
    apply(layerGroup, styleUrl, { accessToken })
    layers.insertAt(0, layerGroup)
  }, [styleUrl, mapRef])

  return (
    <ToggleGroup
      type="single"
      variant="outline"
      className={cn('bg-background ring-2 ring-background shadow', className)}
      value={style}
      onValueChange={onValueChange}
    >
      {Object.entries(MAP_STYLES).map(([key, { label, icon: Icon }]) => (
        <ToggleGroupItem key={key} value={key}>
          <Icon />
          {label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
