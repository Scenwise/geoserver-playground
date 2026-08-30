'use client'

import { CSSProperties, useEffect, useRef, useState } from 'react'
import { Coordinate } from 'ol/coordinate'
import { coordinateToLatLng } from '@/lib/google-maps'

const MAX_TILT = 67.5

interface GlobeViewProps {
  center?: Coordinate
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Map3DElement = any

export function GlobeView({
  center,
  heading = 0,
  className,
  style,
}: GlobeViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<Map3DElement>(null)
  const [tilt, setTiltState] = useState(0)

  useEffect(() => {
    if (!containerRef.current) return

    console.log('[GlobeView] waiting for google.maps...')
    waitForGoogleMaps(() => {
      if (!containerRef.current) return
      console.log('[GlobeView] loading maps3d library')

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      google.maps.importLibrary('maps3d').then((lib: any) => {
        if (!containerRef.current) return

        const { Map3DElement } = lib

        const latLng = center
          ? coordinateToLatLng(center)
          : new google.maps.LatLng(52.3676, 4.9041)

        const map: Map3DElement = new Map3DElement({
          center: { lat: latLng.lat(), lng: latLng.lng(), altitude: 0 },
          range: 1800,
          tilt: 0,
          heading,
          mode: 'HYBRID',
          defaultUIHidden: false,
        })

        map.style.width = '100%'
        map.style.height = '100%'

        containerRef.current.appendChild(map)
        mapRef.current = map

        console.log('[GlobeView] Map3DElement created')
      })
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!mapRef.current || !center) return
    const latLng = coordinateToLatLng(center)
    mapRef.current.center = { lat: latLng.lat(), lng: latLng.lng(), altitude: 0 }
  }, [center])

  useEffect(() => {
    if (!mapRef.current) return
    mapRef.current.heading = heading
  }, [heading])

  function applyTilt(value: number) {
    const clamped = Math.max(0, Math.min(MAX_TILT, value))
    setTiltState(clamped)
    if (mapRef.current) {
      mapRef.current.tilt = clamped
      console.log('[GlobeView] tilt set to', clamped)
    }
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
        alignItems: 'center',
        gap: '4px',
        zIndex: 10,
        background: 'white',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '8px 6px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
      }}>
        <span style={{ fontSize: '10px', color: '#555', fontWeight: 600, letterSpacing: '0.04em' }}>
          TILT
        </span>
        <span style={{ fontSize: '11px', color: '#333', fontWeight: 600 }}>
          {Math.round(tilt)}°
        </span>
        <span style={{ fontSize: '10px', color: '#aaa' }}>{MAX_TILT}°</span>
        <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <input
            type="range"
            min={0}
            max={MAX_TILT}
            step={0.5}
            value={tilt}
            onChange={(e) => applyTilt(Number(e.target.value))}
            style={{
              width: '100px',
              cursor: 'pointer',
              accentColor: '#1a73e8',
              transform: 'rotate(-90deg)',
            }}
          />
        </div>
        <span style={{ fontSize: '10px', color: '#aaa' }}>0°</span>
      </div>
    </div>
  )
}
