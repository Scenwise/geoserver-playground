import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { coordinateToLatLng } from '@/lib/google-maps'
import { cn } from '@/lib/utils'
import {
  SegmentationKeyframe,
  useSegmentationStore,
} from '@/store/segmentationStore'
import {
  ArrowRightIcon,
  BrainCogIcon,
  EditIcon,
  Trash2Icon,
} from 'lucide-react'
import { Coordinate } from 'ol/coordinate'
import { KeyframeMetadata } from './keyframe-metadata'

type LocationKeyframe = {
  position: Coordinate
  heading: number
  zoom: number
}

export function StreetviewPath({
  location,
  isSegmentationMode,
  onModeChange,
  className,
}: {
  location?: LocationKeyframe
  isSegmentationMode: boolean
  onModeChange: (isSegmentationMode: boolean) => void
  className?: string
}) {
  const { keyframes, addKeyframe, clearKeyframes } = useSegmentationStore()

  const newKeyframe = location
    ? {
        position: coordinateToLatLng(location.position),
        bearing: location.heading,
        zoom: location.zoom,
        stepsToNext: 5,
      }
    : null

  return (
    <div className={cn('rounded-2xl bg-accent flex flex-col', className)}>
      <div className="flex justify-between items-center pt-4 px-4">
        <h3 className="text-sm font-medium grow">Path</h3>

        <Button variant="ghost" size="sm" onClick={clearKeyframes}>
          <Trash2Icon className="size-4" />
          Clear path
        </Button>

        <Separator orientation="vertical" className="mx-2 h-4" />

        {isSegmentationMode ? (
          <Button size="sm" onClick={() => onModeChange(false)}>
            <EditIcon className="size-4" />
            Back to path editing
          </Button>
        ) : (
          <Button size="sm" onClick={() => onModeChange(true)}>
            <BrainCogIcon className="size-4" />
            Apply segmentation
            <ArrowRightIcon className="size-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 p-4 overflow-x-auto overflow-y-visible">
        {keyframes.map((kf, index) => (
          <KeyframeCard
            key={index}
            keyframe={kf}
            index={index}
            numberOfFrames={keyframes.length}
            isSegmentationMode={isSegmentationMode}
          />
        ))}

        {/* <KeyframeCard
          keyframe={newKeyframe!}
          numberOfFrames={keyframes.length}
          isSegmentationMode={isSegmentationMode}
        /> */}

        {/* Add keyframe button */}
        {location && !isSegmentationMode && (
          <Button
            variant="outline"
            size="sm"
            className="h-full p-6 max-w-70 border border-border border-dashed rounded-xl bg-transparent flex-col items-start p-3"
            onClick={() => addKeyframe(newKeyframe!)}
          >
            + Add keyframe <br></br>
            <KeyframeMetadata keyframe={newKeyframe!} />
          </Button>
        )}
      </div>
    </div>
  )
}

function KeyframeCard({
  keyframe,
  index,
  numberOfFrames,
  isSegmentationMode,
}: {
  keyframe: SegmentationKeyframe
  index?: number
  numberOfFrames: number
  isSegmentationMode: boolean
}) {
  const { setStepsToNext, removeKeyframe } = useSegmentationStore()

  return (
    <>
      <div
        className={cn(
          'p-3 min-w-0 max-w-70 shrink-0 shadow-centered bg-card rounded-xl space-y-2',
          index === undefined && 'border-2 border-green-500',
        )}
      >
        <div className="flex justify-between items-center">
          <div className="font-medium text-xs">
            {index !== undefined ? `Keyframe ${index + 1}` : 'New Keyframe'}
          </div>

          {index !== undefined && (
            <Button
              variant="destructive"
              size="icon-xs"
              onClick={() => removeKeyframe(index)}
            >
              <Trash2Icon />
            </Button>
          )}
        </div>

        <KeyframeMetadata keyframe={keyframe} />
      </div>

      <div className="flex flex-col items-center gap-1" key={index + 'input'}>
        {index !== undefined && index < numberOfFrames - 1 && (
          <Input
            disabled={isSegmentationMode}
            className="w-10 text-center"
            value={keyframe.stepsToNext ?? ''}
            onChange={(event) => {
              const steps = parseInt(event.target.value, 10)
              setStepsToNext(index, !isNaN(steps) ? steps : null)
            }}
            placeholder="Steps to next"
            min={0}
            max={10}
          />
        )}
        {(!isSegmentationMode ||
          (index !== undefined && index < numberOfFrames - 1)) && (
          <ArrowRightIcon className="size-4" />
        )}
      </div>
    </>
  )
}
