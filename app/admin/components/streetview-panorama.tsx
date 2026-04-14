'use client'

import { coordinateToLatLng, latLngToCoordinate } from '@/lib/google-maps'
import { Coordinate } from 'ol/coordinate'
import { useEffect, useRef } from 'react'

export function StreetviewPanorama({
  position,
  onPositionChange,
}: {
  position: Coordinate
  onPositionChange: (
    position: Coordinate,
    heading: number,
    zoom: number,
  ) => void
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

  const isProgrammaticUpdate = useRef(false)
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(null)

  // Initialize Street View panorama when position is set
  useEffect(() => {
    if (panoramaRef.current || !position) return

    const targetPosition = coordinateToLatLng(position)
    const panorama = createPanorama(targetPosition)

    if (!panorama) return

    const updatePanoramaPosition = () => {
      if (isProgrammaticUpdate.current) return
      const position = panorama.getPosition()
      const pov = panorama.getPov()
      const zoom = panorama.getZoom()
      if (!position || pov === undefined || zoom === undefined) return

      // wait until user stops moving
      clearTimeout(debounceTimer.current!)
      debounceTimer.current = setTimeout(() => {
        onPositionChange(latLngToCoordinate(position), pov.heading, zoom)
      }, 300)
    }

    panorama.addListener('position_changed', updatePanoramaPosition)
    panorama.addListener('pov_changed', updatePanoramaPosition)
    panorama.addListener('zoom_changed', updatePanoramaPosition)

    panoramaRef.current = panorama
  }, [onPositionChange, position])

  // Update panorama position when prop changes
  useEffect(() => {
    const panorama = panoramaRef.current
    if (!panorama) return

    const targetPosition = coordinateToLatLng(position)
    const currentPosition = panorama.getPosition()

    if (!currentPosition?.equals(targetPosition)) {
      isProgrammaticUpdate.current = true
      panorama.setPosition(targetPosition)
      setTimeout(() => {
        isProgrammaticUpdate.current = false
      }, 500)
    }
  }, [position])

  return <div ref={containerRef}></div>
}
