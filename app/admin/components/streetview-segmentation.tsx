import { ColoredBadge } from '@/components/colored-badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { BrainCogIcon, ImageDownIcon } from 'lucide-react'
import { Coordinate } from 'ol/coordinate'

export function StreetviewSegmentation({
  position,
  className = '',
}: {
  position?: Coordinate
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* <Button disabled className="w-full">
        <ImageDownIcon />
        Perform segmentation
      </Button> */}

      <div className="w-full grow rounded-2xl border-2 border-dashed border-border flex items-center justify-center p-6 text-center flex-col gap-4">
        <BrainCogIcon className="size-10 text-muted-foreground" />
        <p className="text-muted-foreground text-sm">Segmentation result</p>
        <ColoredBadge>Coming soon</ColoredBadge>
      </div>
    </div>
  )
}
