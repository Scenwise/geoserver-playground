'use client'

import { useEffect, useRef } from 'react'
import { Coordinate } from 'ol/coordinate'
import { coordinateToLatLng } from '@/lib/google-maps'

interface GlobeViewProps {
  center?: Coordinate
  zoom?: number
  tilt?: number
  heading?: number
  className?: string
}

export function GlobeView({
  center,
  zoom = 17,
  tilt = 45,
  heading = 0,
  className,
}: GlobeViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<google.maps.Map | null>(null)

  useEffect(() => {
    if (!containerRef.current || !window.google?.maps) return

    const latLng = center
      ? coordinateToLatLng(center)
      : new google.maps.LatLng(52.3676, 4.9041)

    mapRef.current = new google.maps.Map(containerRef.current, {
      center: latLng,
      zoom,
      tilt,
      heading,
      mapTypeId: 'satellite',
      disableDefaultUI: false,
      rotateControl: true,
      fullscreenControl: false,
      streetViewControl: false,
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync center when it changes
  useEffect(() => {
    if (!mapRef.current || !center) return
    mapRef.current.setCenter(coordinateToLatLng(center))
  }, [center])

  // Sync tilt
  useEffect(() => {
    if (!mapRef.current) return
    mapRef.current.setTilt(tilt)
  }, [tilt])

  // Sync heading
  useEffect(() => {
    if (!mapRef.current) return
    mapRef.current.setHeading(heading)
  }, [heading])

  return <div ref={containerRef} className={className} style={{ width: '100%', height: '100%' }} />
}
