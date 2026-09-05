'use client'

import { CSSProperties, useEffect, useRef, useState } from 'react'
import { Coordinate } from 'ol/coordinate'
import { coordinateToLatLng } from '@/lib/google-maps'
import { GeoserverLayer } from '@/store/mapLayerStore'

const MAX_TILT = 67.5
const TILT_SENSITIVITY = 0.4

// Colors cycled per layer index
const LAYER_COLORS = [
  { fill: '#e53935cc', stroke: '#e53935' },
  { fill: '#1e88e5cc', stroke: '#1e88e5' },
  { fill: '#43a047cc', stroke: '#43a047' },
  { fill: '#fb8c00cc', stroke: '#fb8c00' },
  { fill: '#8e24aacc', stroke: '#8e24aa' },
]

interface GlobeViewProps {
  center?: Coordinate
  heading?: number
  className?: string
  style?: CSSProperties
  layers?: GeoserverLayer[]
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

async function addGeoJsonToMap(
  map: Map3DElement,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  geojson: { features: { geometry: any }[] },
  colorIndex: number,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { Polygon3DElement, Polyline3DElement } = await (google.maps as any).importLibrary('maps3d')
  const color = LAYER_COLORS[colorIndex % LAYER_COLORS.length]
  const elements: unknown[] = []

  for (const feature of geojson.features) {
    const geom = feature.geometry
    if (!geom) continue

    if (geom.type === 'Polygon' || geom.type === 'MultiPolygon') {
      const rings =
        geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates
      for (const polygon of rings) {
        for (const ring of polygon) {
          const el = new Polygon3DElement({
            altitudeMode: 'CLAMP_TO_GROUND',
            fillColor: color.fill,
            strokeColor: color.stroke,
            strokeWidth: 2,
            drawsOccludedSegments: false,
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          el.outerCoordinates = (ring as any[]).map(([lng, lat]: [number, number]) => ({ lat, lng, altitude: 0 }))
          map.append(el)
          elements.push(el)
        }
      }
    } else if (geom.type === 'LineString' || geom.type === 'MultiLineString') {
      const lines =
        geom.type === 'LineString' ? [geom.coordinates] : geom.coordinates
      for (const coords of lines) {
        const el = new Polyline3DElement({
          altitudeMode: 'CLAMP_TO_GROUND',
          strokeColor: color.stroke,
          strokeWidth: 3,
          drawsOccludedSegments: false,
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        el.coordinates = (coords as any[]).map(([lng, lat]: [number, number]) => ({ lat, lng, altitude: 0 }))
        map.append(el)
        elements.push(el)
      }
    }
  }

  return elements
}

export function GlobeView({
  center,
  heading = 0,
  className,
  style,
  layers = [],
}: GlobeViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<Map3DElement>(null)
  const tiltRef = useRef(0)
  const [tilt, setTiltState] = useState(0)
  const [isTilting, setIsTilting] = useState(false)

  const centerRef = useRef(center)
  useEffect(() => { centerRef.current = center }, [center])

  // Init Map3DElement once
  useEffect(() => {
    if (!containerRef.current) return

    waitForGoogleMaps(() => {
      if (!containerRef.current) return

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      google.maps.importLibrary('maps3d').then((lib: any) => {
        if (!containerRef.current) return

        const { Map3DElement } = lib

        const latLng = centerRef.current
          ? coordinateToLatLng(centerRef.current)
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

  // Sync center
  useEffect(() => {
    if (!mapRef.current || !center) return
    const latLng = coordinateToLatLng(center)
    mapRef.current.center = { lat: latLng.lat(), lng: latLng.lng(), altitude: 0 }
  }, [center])

  // Sync heading
  useEffect(() => {
    if (!mapRef.current) return
    mapRef.current.heading = heading
  }, [heading])

  // Load WFS GeoJSON layers onto the 3D map
  useEffect(() => {
    if (!layers.length) return

    let cancelled = false
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const addedElements: any[][] = []

    async function loadLayers() {
      // Wait until map is ready
      let attempts = 0
      while (!mapRef.current && attempts++ < 40) {
        await new Promise((r) => setTimeout(r, 250))
      }
      if (!mapRef.current || cancelled) return

      for (let i = 0; i < layers.length; i++) {
        const layer = layers[i]
        try {
          const res = await fetch(
            `https://geoserver.scenwise.nl/geoserver/scenwise/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${layer.layerId}&outputFormat=application/json`,
          )
          if (!res.ok || cancelled) continue
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const geojson: { features: { geometry: any }[] } = await res.json()
          if (cancelled || !mapRef.current) break
          const els = await addGeoJsonToMap(mapRef.current, geojson, i)
          addedElements.push(els as unknown[])
        } catch {
          // skip failed layers silently
        }
      }
    }

    loadLayers()

    return () => {
      cancelled = true
      // Remove all added 3D elements on cleanup
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      addedElements.forEach((group) => group.forEach((el: any) => el.remove?.()))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layers])

  // Alt/Option + drag to tilt (leaves Cmd/Ctrl free for map's native rotation)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let dragging = false
    let lastY = 0

    function applyTilt(delta: number) {
      const next = Math.max(0, Math.min(MAX_TILT, tiltRef.current + delta))
      tiltRef.current = next
      setTiltState(next)
      if (mapRef.current) mapRef.current.tilt = next
    }

    function onMouseDown(e: MouseEvent) {
      if (!e.altKey) return
      dragging = true
      lastY = e.clientY
      setIsTilting(true)
      e.preventDefault()
      e.stopPropagation()
    }

    function onMouseMove(e: MouseEvent) {
      if (!dragging) return
      const delta = (lastY - e.clientY) * TILT_SENSITIVITY
      lastY = e.clientY
      applyTilt(delta)
    }

    function onMouseUp() {
      if (!dragging) return
      dragging = false
      setIsTilting(false)
    }

    el.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      el.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        cursor: isTilting ? 'ns-resize' : undefined,
        ...style,
      }}
    >
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
        background: 'rgba(0,0,0,0.55)',
        color: 'white',
        fontSize: '12px',
        padding: '4px 10px',
        borderRadius: '20px',
        whiteSpace: 'nowrap',
        opacity: isTilting ? 1 : 0,
        transition: 'opacity 0.2s',
      }}>
        Tilt {Math.round(tilt)}° — hold Alt/Option + drag
      </div>
    </div>
  )
}
