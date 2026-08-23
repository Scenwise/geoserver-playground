'use client'

import { useEffect, useRef, useState } from 'react'
import { Coordinate } from 'ol/coordinate'
import { coordinateToLatLng } from '@/lib/google-maps'

interface GlobeViewProps {
  center?: Coordinate
  zoom?: number
  heading?: number
  className?: string
}

export function GlobeView({
  center,
  zoom = 17,
  heading = 0,
  className,
}: GlobeViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const [tilt, setTilt] = useState(45)

  useEffect(() => {
    if (!containerRef.current || !window.google?.maps) return

    const latLng = center
      ? coordinateToLatLng(center)
      : new google.maps.LatLng(52.3676, 4.9041)

    const gmap = new google.maps.Map(containerRef.current, {
      center: latLng,
      zoom,
      tilt: 45,
      heading,
      mapTypeId: 'satellite',
      disableDefaultUI: false,
      rotateControl: true,
      tiltInteractionEnabled: true,
      fullscreenControl: false,
      streetViewControl: false,
      gestureHandling: 'greedy',
    })

    mapRef.current = gmap

    // Keep tilt state in sync when user tilts via gesture
    gmap.addListener('tilt_changed', () => {
      setTilt(gmap.getTilt() ?? 45)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync center when it changes
  useEffect(() => {
    if (!mapRef.current || !center) return
    mapRef.current.setCenter(coordinateToLatLng(center))
  }, [center])

  // Sync heading
  useEffect(() => {
    if (!mapRef.current) return
    mapRef.current.setHeading(heading)
  }, [heading])

  function setMapTilt(value: number) {
    setTilt(value)
    mapRef.current?.setTilt(value)
  }

  return (
    <div className={className} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* Tilt controls overlay */}
      <div style={{
        position: 'absolute',
        bottom: '120px',
        right: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        zIndex: 10,
      }}>
        <button
          onClick={() => setMapTilt(Math.min(tilt + 15, 90))}
          style={{
            width: '32px',
            height: '32px',
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
          }}
          title="Tilt down"
        >
          ↓
        </button>
        <button
          onClick={() => setMapTilt(Math.max(tilt - 15, 0))}
          style={{
            width: '32px',
            height: '32px',
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
          }}
          title="Tilt up"
        >
          ↑
        </button>
      </div>
    </div>
  )
}
