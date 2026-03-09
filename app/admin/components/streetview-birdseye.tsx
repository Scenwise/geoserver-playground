'use client'

import { coordinateToLatLng, latLngToCoordinate } from '@/lib/google-maps'
import { Coordinate } from 'ol/coordinate'
import { useEffect, useRef } from 'react'

export function StreetviewBirdseye({
  position,
  onPositionChange,
}: {
  position: Coordinate
  onPositionChange: (position: Coordinate, heading: number) => void
  className?: string
}) {
  const containerRef = useRef(null)
  const panoramaRef = useRef<google.maps.Map>(null)

  function createPanorama(targetPosition: google.maps.LatLng) {
    if (!containerRef.current || !window.google) return

    return new window.google.maps.Map(containerRef.current, {
      center: targetPosition,
      zoom: 18,
      fullscreenControl: false,
      scaleControl: false,
      zoomControl: false,
      panControl: false,
      cameraControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      mapTypeId: 'satellite',
    })
  }

  // Initialize Street View panorama when position is set
  useEffect(() => {
    if (panoramaRef.current) return

    const targetPosition = coordinateToLatLng(position)
    const panorama = createPanorama(targetPosition)

    if (!panorama) return

    const updatePanoramaPosition = () => {
      const position = panorama.getCenter()

      // Heading is undefined at initial load, default to 0
      const heading = panorama.getHeading() ?? 0

      if (!position) return
      onPositionChange(latLngToCoordinate(position), heading ?? 0)
    }

    panorama.addListener('dragend', updatePanoramaPosition)
    panorama.addListener('heading_changed', updatePanoramaPosition)

    panoramaRef.current = panorama
  }, [onPositionChange, position])

  // Update panorama position when prop changes
  useEffect(() => {
    const panorama = panoramaRef.current
    if (!panorama) return

    const targetPosition = coordinateToLatLng(position)
    const currentPosition = panorama.getCenter()

    if (!currentPosition?.equals(targetPosition)) {
      panorama.setCenter(targetPosition)
    }
  }, [position])

  return <div ref={containerRef}></div>
}
