'use client'

import { coordinateToLatLng, latLngToCoordinate } from '@/lib/google-maps'
import { cn } from '@/lib/utils'
import { SquareMousePointerIcon } from 'lucide-react'
import { Coordinate } from 'ol/coordinate'
import { useEffect, useRef } from 'react'

export function StreetviewPanorama({
  position,
  onPositionChange,
  className = '',
}: {
  position?: Coordinate
  onPositionChange: (position: Coordinate, heading: number) => void
  className?: string
}) {
  const containerRef = useRef(null)
  const panoramaRef = useRef<google.maps.StreetViewPanorama>(null)

  function createPanorama(targetPosition: google.maps.LatLng) {
    if (!containerRef.current || !window.google) return

    return new window.google.maps.StreetViewPanorama(containerRef.current!, {
      position: targetPosition,
      pov: { heading: 0, pitch: 0 },
      zoom: 1,
      fullscreenControl: false,
      addressControl: false,
      linksControl: false,
      zoomControl: false,
      panControl: false,
      imageDateControl: false,
    })
  }

  // Initialize Street View panorama when position is set
  useEffect(() => {
    if (panoramaRef.current || !position) return

    const targetPosition = coordinateToLatLng(position)
    const panorama = createPanorama(targetPosition)

    if (!panorama) return

    const updatePanoramaPosition = () => {
      const position = panorama.getPosition()
      const pov = panorama.getPov()
      if (!position || !pov) return
      onPositionChange(latLngToCoordinate(position), pov.heading)
    }

    panorama.addListener('position_changed', updatePanoramaPosition)
    panorama.addListener('pov_changed', updatePanoramaPosition)

    panoramaRef.current = panorama
  }, [onPositionChange, position])

  // Update panorama position when prop changes
  useEffect(() => {
    const panorama = panoramaRef.current
    if (!panorama || !position) return

    const targetPosition = coordinateToLatLng(position)
    const currentPosition = panorama.getPosition()

    if (!currentPosition?.equals(targetPosition)) {
      panorama.setPosition(targetPosition)
    }
  }, [position])

  return (
    <div
      ref={containerRef}
      className={cn(
        'w-full h-full rounded-2xl flex items-center justify-center p-6 text-center flex-col gap-4',
        className,
        position ? 'shadow-lg' : 'border-2 border-dashed border-border',
      )}
    >
      <SquareMousePointerIcon className="size-10 text-muted-foreground" />
      <p className="text-muted-foreground text-sm">
        Click a location on the map to open streetview.
      </p>
    </div>
  )
}
