import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { fetcher } from '@/lib/fetcher'
import { cn } from '@/lib/utils'
import {
  SegmentationKeyframe,
  useSegmentationStore,
} from '@/store/segmentationStore'
import { PauseIcon, PlayIcon, RefreshCwIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import { TabsCard } from './tabs-card'
import { TabsContent } from '@/components/ui/tabs'
import { KeyframeMetadata } from './keyframe-metadata'

function buildSwrKey(url: string, keyframes: SegmentationKeyframe[]) {
  return `streetview-segmentation-${url}-${keyframes
    .map(
      (kf) =>
        ${kf.position.lat().toFixed(5)},${kf.position.lng().toFixed(5)},${Math.round(kf.zoom)},${Math.round(kf.bearing)},${kf.stepsToNext},
    )
    .join('|')}`
}

function buildRequestBody(keyframes: SegmentationKeyframe[]) {
  return keyframes.map((kf, index) => ({
    order_index: index,
    binary: false,
    return_type: 'image',
    source: 'street_view',
    coords: [kf.position.lat(), kf.position.lng()],
    zoom: Math.round(kf.zoom),
    bearing: kf.bearing,
  }))
}

function useSegmentation(url: string, keyframes: SegmentationKeyframe[]) {
  return useSWR(
    buildSwrKey(url, keyframes),
    () => {
      return fetcher(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildRequestBody(keyframes)),
      })
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      keepPreviousData: true,
    },
  )
}

const SIDEPATH_API = 'http://159.223.223.232:10000/segment_sidepath_batch'
const TACTILE_API = 'http://159.223.223.232:10000/segment_tactile_batch'

export function StreetviewSegmentation2({
  className = '',
}: {
  className?: string
}) {
  const { getInterpolatedKeyframes, setSelectedIndex, selectedIndex } =
    useSegmentationStore()

  const keyframes = getInterpolatedKeyframes()

  const {
    data: sidepathResponse,
    isLoading: isSidepathLoading,
    error: sidepathError,
    mutate: mutateSidepath,
  } = useSegmentation(SIDEPATH_API, keyframes)

  const {
    data: tactileResponse,
    isLoading: isTactileLoading,
    error: tactileError,
    mutate: mutateTactile,
  } = useSegmentation(TACTILE_API, keyframes)

  // Animate through keyframes when new segmentation result is available
  const [activeTab, setActiveTab] = useState('sidepath')
  const [isAnimating, setIsAnimating] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // When isAnimating is enabled, loop through keyframes every second
  const togglePlayback = () => {
    if (!tactileResponse || !sidepathResponse) return

    if (isAnimating) {
      clearInterval(intervalRef.current!)
      intervalRef.current = null
      setIsAnimating(false)
    } else {
      intervalRef.current = setInterval(() => {
        const { selectedIndex, setSelectedIndex } =
          useSegmentationStore.getState()
        setSelectedIndex((selectedIndex + 1) % keyframes.length)
      }, 1000)
      setIsAnimating(true)
    }
  }

  // Clean up on unmount
  useEffect(() => () => clearInterval(intervalRef.current!), [])

  function selectFrame(index: number) {
    setSelectedIndex(index)
    setIsAnimating(false)
  }

  const isLoading = isTactileLoading || isSidepathLoading
  const error = tactileError || sidepathError

  const mutate = () => {
    mutateSidepath()
    mutateTactile()
  }

  const tabs = [
    { label: 'Sidepath', value: 'sidepath' },
    { label: 'Tactile', value: 'tactile' },
  ]

  const selectedKeyframe = keyframes[selectedIndex]

  function getCoverageRingColor(index: number): string {
    const response = activeTab === 'sidepath' ? sidepathResponse : tactileResponse
    if (!response) return 'ring-accent'
    const detail: ImageDetail | undefined = response[String(index)]
    if (!detail || detail.image_pixels === 0) return 'ring-accent'
    const pct = (detail.mask_pixels / detail.image_pixels) * 100
    return pct > 15 ? 'ring-green-500' : 'ring-red-500'
  }

  return (
    <div className={cn('flex flex-col rounded-2xl bg-accent', className)}>
      <TabsCard tabs={tabs} onValueChange={setActiveTab}>
        {isLoading && (
          <div className="absolute inset-0 z-20 bg-black/30 flex flex-col items-center justify-center">
            <Spinner color="white" className="size-10" />
            <p className="text-sm text-white mt-2">Running segmentation…</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 z-20 bg-red-100/80 flex flex-col items-center justify-center p-4">
            <p className="text-sm text-red-700">Segmentation failed</p>
            <Button
              onClick={() => mutate()}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <RefreshCwIcon className="size-3" />
              Retry
            </Button>
          </div>
        )}

        <TabsContent value="sidepath" asChild>
          {sidepathResponse && <ResultImage response={sidepathResponse} />}
        </TabsContent>

        <TabsContent value="tactile" asChild>
          {tactileResponse && <ResultImage response={tactileResponse} />}
        </TabsContent>
      </TabsCard>

      <div className="p-4 gap-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => togglePlayback()}
            disabled={
              keyframes.length === 0 || !sidepathResponse || !tactileResponse
            }
          >
            {isAnimating ? <PauseIcon /> : <PlayIcon />}
          </Button>

          <div className="grow flex justify-between items-center h-0.5 bg-primary/20">
            {keyframes.map((kf, index) => (
              <Button
                key={index}
                onClick={() => selectFrame(index)}
                size="sm"
                variant="default"
                className={cn(
                  'aspect-1 rounded-full p-0 border-0 ring-2',
                  getCoverageRingColor(index),
                  kf.interpolated ? 'size-2' : 'size-3',
                  selectedIndex !== index ? 'bg-muted-foreground!' : '',
                )}
              ></Button>
            ))}
          </div>
        </div>

        <div>
          <KeyframeMetadata keyframe={selectedKeyframe} />
          {(() => {
            const response = activeTab === 'sidepath' ? sidepathResponse : tactileResponse
            const detail: ImageDetail | undefined = response?.[String(selectedIndex)]
            if (!detail || detail.image_pixels === 0) return null
            const pct = ((detail.mask_pixels / detail.image_pixels) * 100).toFixed(1)
            return (
              <p className="text-xs text-muted-foreground mt-1">
                Coverage: {pct}%
              </p>
            )
          })()}
        </div>
      </div>
    </div>
  )
}

type ImageDetail = { image_str: string; image_pixels: number; mask_pixels: number }

function ResultImage({ response }: { response: Record<string, ImageDetail> }) {
  const images = Object.values(response).map((v) => v.image_str)
  const { selectedIndex } = useSegmentationStore()

  return (
    <>
      <div className="h-full">
        <img
          src={`data:image/png;base64,${images[selectedIndex ?? 0]}`}
          alt="Segmentation overlay"
          className="w-full h-full"
        />
      </div>
    </>
  )
}