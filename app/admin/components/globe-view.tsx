'use client'

import { CSSProperties, useEffect, useRef, useState } from 'react'
import { Coordinate } from 'ol/coordinate'
import { coordinateToLatLng } from '@/lib/google-maps'

interface GlobeViewProps {
  center?: Coordinate
  zoom?: number
  heading?: number
  className?: string
  style?: CSSProperties
}

function waitForGoogleMaps(cb: () => void, retries = 20) {
  if (window.google?.maps) {
    cb()
    return
  }
  if (retries <= 0) return
  setTimeout(() => waitForGoogleMaps(cb, retries - 1), 250)
}

export function GlobeView({
  center,
  zoom = 17,
  heading = 0,
  className,
  style,
}: GlobeViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const [tilt, setTiltState] = useState(45)

  useEffect(() => {
    if (!containerRef.current) return

    waitForGoogleMaps(() => {
      if (!containerRef.current) return

      const latLng = center
        ? coordinateToLatLng(center)
        : new google.maps.LatLng(52.3676, 4.9041)

      const gmap = new google.maps.Map(containerRef.current, {
        center: latLng,
        zoom,
        tilt: 45,
        heading,
        mapTypeId: 'satellite',
        disableDefaultUI: true,
        rotateControl: true,
        zoomControl: true,
        gestureHandling: 'greedy',
      })

      mapRef.current = gmap

      gmap.addListener('tilt_changed', () => {
        setTiltState(gmap.getTilt() ?? 45)
      })
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!mapRef.current || !center) return
    mapRef.current.setCenter(coordinateToLatLng(center))
  }, [center])

  useEffect(() => {
    if (!mapRef.current) return
    mapRef.current.setHeading(heading)
  }, [heading])

  function applyTilt(value: number) {
    const clamped = Math.max(0, Math.min(90, value))
    setTiltState(clamped)
    mapRef.current?.setTilt(clamped)
  }

  return (
    <div className={className} style={{ width: '100%', height: '100%', position: 'relative', ...style }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      <div style={{
        position: 'absolute',
        bottom: '80px',
        right: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        zIndex: 10,
      }}>
        <button
          onClick={() => applyTilt(tilt + 15)}
          style={{
            width: '32px', height: '32px',
            background: 'white', border: '1px solid #ccc',
            borderRadius: '4px', cursor: 'pointer',
            fontSize: '18px', fontWeight: 'bold',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
          }}
          title={`Increase tilt (${tilt}°)`}
        >↑</button>
        <button
          onClick={() => applyTilt(tilt - 15)}
          style={{
            width: '32px', height: '32px',
            background: 'white', border: '1px solid #ccc',
            borderRadius: '4px', cursor: 'pointer',
            fontSize: '18px', fontWeight: 'bold',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
          }}
          title={`Decrease tilt (${tilt}°)`}
        >↓</button>
      </div>
    </div>
  )
}
