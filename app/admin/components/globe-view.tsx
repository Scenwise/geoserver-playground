'use client'

import { CSSProperties, useEffect, useRef, useState } from 'react'
import { Coordinate } from 'ol/coordinate'
import { coordinateToLatLng } from '@/lib/google-maps'

const MAX_TILT = 67.5

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
  const [tilt, setTiltState] = useState(0)

  useEffect(() => {
    if (!containerRef.current) return

    console.log('[GlobeView] waiting for google.maps...')
    waitForGoogleMaps(() => {
      if (!containerRef.current) return
      console.log('[GlobeView] google.maps ready, initializing map')

      const latLng = center
        ? coordinateToLatLng(center)
        : new google.maps.LatLng(52.3676, 4.9041)

      const gmap = new google.maps.Map(containerRef.current, {
        center: latLng,
        zoom,
        tilt: 0,
        heading,
        mapTypeId: 'satellite',
        mapId: 'DEMO_MAP_ID',
        disableDefaultUI: true,
        rotateControl: true,
        zoomControl: true,
        gestureHandling: 'greedy',
      })

      mapRef.current = gmap
      console.log('[GlobeView] map created')

      gmap.addListener('tilesloaded', () => {
        console.log('[GlobeView] tilesloaded, tilt:', gmap.getTilt())
      })

      gmap.addListener('tilt_changed', () => {
        const t = gmap.getTilt() ?? 0
        console.log('[GlobeView] tilt_changed ->', t)
        setTiltState(t)
      })
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!mapRef.current || !center) return
    mapRef.current.moveCamera({ center: coordinateToLatLng(center) })
  }, [center])

  useEffect(() => {
    if (!mapRef.current) return
    mapRef.current.moveCamera({ heading })
  }, [heading])

  function applyTilt(value: number) {
    const clamped = Math.max(0, Math.min(MAX_TILT, value))
    console.log('[GlobeView] applyTilt ->', clamped)
    setTiltState(clamped)
    mapRef.current?.moveCamera({ tilt: clamped })
    console.log('[GlobeView] getTilt() after moveCamera:', mapRef.current?.getTilt())
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
