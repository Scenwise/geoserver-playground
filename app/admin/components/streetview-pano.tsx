'use client'

import { coordinateToLatLng, latLngToCoordinate } from '@/lib/google-maps'
import { SquareMousePointerIcon } from 'lucide-react'
import { Coordinate } from 'ol/coordinate'
import { useEffect, useRef } from 'react'

export function StreetviewPano({
  position,
  onPositionChange,
}: {
  position?: Coordinate
  onPositionChange?: (position: Coordinate) => void
}) {
  const containerRef = useRef(null)
  const panoramaRef = useRef<google.maps.StreetViewPanorama>(null)

  useEffect(() => {
    if (!containerRef.current || !window.google || !position) return

    const transformed = coordinateToLatLng(position)
    if (panoramaRef.current) {
      updatePanoramaPosition(transformed)
    } else {
      initializePanorama(transformed)
    }
  }, [position])

  function initializePanorama(position: google.maps.LatLng) {
    const panorama = new window.google.maps.StreetViewPanorama(
      containerRef.current!,
      {
        position,
        pov: { heading: 0, pitch: 0 },
        zoom: 1,
      },
    )

    panorama.addListener('position_changed', () => {
      const newPos = panorama.getPosition()
      if (newPos) onPositionChange?.(latLngToCoordinate(newPos))
    })

    panoramaRef.current = panorama
  }

  function updatePanoramaPosition(position: google.maps.LatLng) {
    const panorama = panoramaRef.current!
    const currentPosition = panorama.getPosition()

    if (!currentPosition?.equals(position)) {
      panorama.setPosition(position)
    }
  }

  return (
    <div
      ref={containerRef}
      className="w-full aspect-4/3 rounded-2xl border-2 border-dashed border-border flex items-center justify-center p-6 text-center flex-col gap-4"
    >
      <SquareMousePointerIcon className="size-10 text-muted-foreground" />
      <p className="text-muted-foreground text-sm">
        Click a location on the map to open StreetView.
      </p>
    </div>
  )
}
