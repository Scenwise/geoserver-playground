import { MAP_STYLES, MapStyle } from '@/hooks/use-map-style'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'

export function OpenLayersMapStyle({
  style,
  onStyleChange,
  className,
}: {
  style: MapStyle
  onStyleChange: (style: MapStyle) => void
  className?: string
}) {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      className={cn('bg-background ring-2 ring-background shadow', className)}
      value={style}
      onValueChange={(value: string | null) =>
        value && onStyleChange(value as MapStyle)
      }
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
