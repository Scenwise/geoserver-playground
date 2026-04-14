import { MapContainer } from '@/components/openlayers-map/openlayers-map'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { fetcher } from '@/lib/fetcher'
import { coordinateToLatLng } from '@/lib/google-maps'
import { cn } from '@/lib/utils'
import { BrainCogIcon, InfoIcon, RefreshCwIcon } from 'lucide-react'
import { Coordinate } from 'ol/coordinate'
import useSWR from 'swr'

/** Stable SWR cache key that changes whenever position or heading changes */
function buildSwrKey(
  position: Coordinate | undefined,
  heading: number,
  zoom: number,
): string | null {
  if (!position) return null
  return `segment:${position[0]},${position[1]},${heading},${zoom}`
}

function buildRequestBody(
  lat: number,
  lng: number,
  heading: number,
  zoom: number,
) {
  return [
    {
      order_index: 0,
      binary: false,
      return_type: 'image',
      source: 'street_view',
      coords: [lat, lng],
      zoom: Math.round(zoom),
      bearing: heading,
    },
  ]
}

const SEGMENTATION_API = 'http://159.223.223.232:10000/segment_sidepath_batch'

export function StreetviewSegmentation({
  position,
  heading = 0,
  zoom = 1,
  className = '',
}: {
  position?: Coordinate
  heading?: number
  zoom?: number
  className?: string
}) {
  const location = coordinateToLatLng(position)

  const swrKey = buildSwrKey(position, heading, zoom)

  const {
    data: segmentResponse,
    isLoading,
    error,
    mutate,
  } = useSWR(
    swrKey,
    () => {
      return fetcher(SEGMENTATION_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          buildRequestBody(location!.lat(), location!.lng(), heading, zoom),
        ),
      })
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      keepPreviousData: true,
    },
  )

  return (
    <div className={cn('flex flex-col rounded-2xl bg-accent', className)}>
      <div className="flex items-center justify-between gap-1 p-3">
        <span className="text-xs font-medium text-primary/50">
          Segmentation result
        </span>

        {location && (
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon className="size-4 text-primary/50" />
            </TooltipTrigger>
            <TooltipContent className="font-mono">
              coords: [{location?.lat().toFixed(5)},{' '}
              {location?.lng().toFixed(5)}]
              <br />
              zoom: {Math.round(zoom)}
              <br />
              bearing: {heading}
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {!position ? (
        <StreetviewFallback />
      ) : (
        <MapContainer className="relative overflow-hidden">
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

          {segmentResponse && <ResultImage segmentResponse={segmentResponse} />}
        </MapContainer>
      )}
    </div>
  )
}

function ResultImage({
  segmentResponse,
}: {
  segmentResponse: Record<string, string>
}) {
  const imageEntries = Object.entries(segmentResponse) as [string, string][]

  return (
    <>
      {imageEntries?.map(([key, b64]) => (
        <div key={key} className="flex flex-col gap-2">
          <img
            src={`data:image/png;base64,${b64}`}
            alt="Segmentation overlay"
            className="w-full object-cover"
          />
        </div>
      ))}
    </>
  )
}

function StreetviewFallback() {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border p-8 text-center h-full',
      )}
    >
      <BrainCogIcon className="size-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        Click a location on the map to run segmentation
      </p>
    </div>
  )
}
