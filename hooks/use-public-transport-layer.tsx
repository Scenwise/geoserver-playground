import { fetcher } from '@/lib/fetcher'
import { Feature, Map, MapBrowserEvent, Overlay } from 'ol'
import { FeatureLike } from 'ol/Feature'
import { Point } from 'ol/geom'
import VectorLayer from 'ol/layer/Vector'
import { transform } from 'ol/proj'
import VectorSource from 'ol/source/Vector'
import { Fill, Stroke, Style } from 'ol/style'
import CircleStyle from 'ol/style/Circle'
import { RefObject, useEffect, useRef, useState } from 'react'
import useSWRImmutable from 'swr/immutable'

// TODO: this bbox should ideally come from the geoserver layer's native bounding box
const nativeBoundingBox = {
  minx: 4.45633202791214,
  maxx: 4.479648470878601,
  miny: 51.91293712307457,
  maxy: 51.92055399089509,
  crs: 'EPSG:4326',
}

const bbox = `${nativeBoundingBox.miny},${nativeBoundingBox.minx},${nativeBoundingBox.maxy},${nativeBoundingBox.maxx}`

export function usePublicTransportLayer(mapRef: RefObject<Map | null>) {
  const [enabled, setEnabled] = useState(false)

  const { data, error, isLoading } = useSWRImmutable(
    enabled ? 'https://overpass-api.de/api/interpreter' : null,
    (url) =>
      fetcher(url, {
        method: 'POST',
        body: `
          [out:json];
          node["public_transport"="platform"](${bbox});
          out;
        `,
      }),
  )

  const sourceRef = useRef<VectorSource>(new VectorSource())
  const layerRef = useRef<VectorLayer>(
    new VectorLayer({
      style: new Style({
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({ color: 'green' }),
          stroke: new Stroke({ color: 'white', width: 2 }),
        }),
      }),
    }),
  )

  const popupRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<Overlay>(null)

  // Initialize the vector source and layer when the component mounts
  useEffect(() => {
    if (!mapRef.current || !enabled) return

    const map = mapRef.current
    const layer = layerRef.current

    layer.setSource(sourceRef.current)
    map.addLayer(layerRef.current)

    if (!overlayRef.current) {
      overlayRef.current = new Overlay({
        element: popupRef.current!,
        offset: [0, -10],
        positioning: 'bottom-center',
      })
    }

    map.addOverlay(overlayRef.current)

    return () => {
      map.removeLayer(layer)
      map.removeOverlay(overlayRef.current!)
    }
  }, [mapRef, enabled])

  // Update the vector source with new features when data is fetched
  useEffect(() => {
    if (!sourceRef.current || !data) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const features = data.elements.map((element: any) => {
      const coordinate = transform(
        [element.lon, element.lat],
        'EPSG:4326',
        'EPSG:3857',
      )

      return new Feature({
        geometry: new Point(coordinate),
        ...element.tags,
      })
    })

    sourceRef.current.clear()
    sourceRef.current.addFeatures(features)
  }, [sourceRef, data])

  // Handle click events on the map to show popups for features
  const [selectedFeature, setSelectedFeature] = useState<FeatureLike | null>(
    null,
  )

  useEffect(() => {
    if (!mapRef.current || !enabled) return
    const map = mapRef.current

    const handler = (event: MapBrowserEvent) => {
      const feature = map.forEachFeatureAtPixel(
        event.pixel,
        (feature) => feature,
      )

      if (!feature || feature.getGeometry()?.getType() !== 'Point') {
        setSelectedFeature(null)
        overlayRef.current?.setPosition(undefined)
        return
      }

      const geometry = feature.getGeometry()
      if (geometry?.getType() !== 'Point') return

      const coordinate = (geometry as Point).getCoordinates()

      overlayRef.current?.setPosition(coordinate)
      setSelectedFeature(feature)
    }

    map.on('singleclick', handler)

    return () => {
      map.un('singleclick', handler)
    }
  }, [mapRef, enabled])

  const popup = (
    <div ref={popupRef}>
      {selectedFeature && <StopPopup feature={selectedFeature} />}
    </div>
  )

  return {
    enabled,
    toggle: () => setEnabled((enabled) => !enabled),
    popup,
    isLoading,
    error,
    data,
  }
}

function StopPopup({ feature }: { feature: FeatureLike }) {
  const subtitle = [
    feature.get('tram') === 'yes' && 'tram stop',
    feature.get('bus') === 'yes' && 'bus stop',
    feature.get('tactile_paving') === 'yes' && 'tactile paving available',
    feature.get('wheelchair') === 'yes' && 'wheelchair accessible',
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="bg-background shadow-lg rounded-lg p-2 text-sm border">
      <div className="font-semibold">
        {feature.get('name') || 'Unnamed stop'}
      </div>

      <div className="text-xs text-muted-foreground first-letter:capitalize ">
        {subtitle}
      </div>
    </div>
  )
}
