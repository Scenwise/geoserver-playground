import { IconComponent } from '@/lib/types'
import { cn } from '@/lib/utils'
import { SegmentationKeyframe } from '@/store/segmentationStore'
import { MapPinIcon, Rotate3DIcon, ScanSearchIcon } from 'lucide-react'

export function KeyframeMetadata({
  keyframe,
  className = '',
}: {
  keyframe: SegmentationKeyframe
  className?: string
}) {
  return (
    <div className={cn('flex gap-2 flex-wrap ', className)}>
      <KeyframeMetadataEntry
        icon={MapPinIcon}
        label="Position"
        value={`[${keyframe?.position?.lat()?.toFixed(5)}, ${keyframe?.position?.lng()?.toFixed(5)}]`}
      />

      <KeyframeMetadataEntry
        icon={ScanSearchIcon}
        label="Zoom"
        value={Math.round(keyframe?.zoom)}
      />

      <KeyframeMetadataEntry
        icon={Rotate3DIcon}
        label="Heading"
        value={`${Math.round(keyframe?.bearing)}°`}
      />
    </div>
  )
}

function KeyframeMetadataEntry({
  icon,
  label,
  value,
}: {
  icon: IconComponent
  label: string
  value: string | number
}) {
  const Icon = icon
  return (
    <div className="flex items-center gap-1 text-muted-foreground bg-muted rounded-sm py-1 px-2 text-xs font-mono">
      <Icon className="size-3" />
      {label}: {value}
    </div>
  )
}
