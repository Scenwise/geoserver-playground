import { ButtonGroup } from '@/components/ui/button-group'
import { Map } from 'ol'
import { Button } from '@/components/ui/button'
import { MinusIcon, PlusIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ZoomControl({
  map,
  className,
}: {
  map: Map | null
  className?: string
}) {
  function zoom(value: number) {
    if (!map) return

    const view = map.getView()
    view.animate({ zoom: view.getZoom()! + value, duration: 100 })
  }

  return (
    <ButtonGroup
      orientation="vertical"
      className={cn(
        'ring-2 ring-background bg-background rounded-lg shadow',
        className,
      )}
    >
      <Button onClick={() => zoom(1)} variant="outline" size="icon">
        <PlusIcon />
      </Button>
      <Button onClick={() => zoom(-1)} variant="outline" size="icon">
        <MinusIcon />
      </Button>
    </ButtonGroup>
  )
}
