import { fetcher } from '@/lib/fetcher'
import { Feature, Map } from 'ol'
import { Point } from 'ol/geom'
import VectorLayer from 'ol/layer/Vector'
import { transform } from 'ol/proj'
import VectorSource from 'ol/source/Vector'
import { Fill, Stroke, Style } from 'ol/style'
import CircleStyle from 'ol/style/Circle'
import { RefObject, useEffect, useRef, useState } from 'react'
import useSWR from 'swr'

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

  const { data, error, isLoading } = useSWR(
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
      source: sourceRef.current,
      style: new Style({
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({ color: 'green' }),
          stroke: new Stroke({ color: 'white', width: 2 }),
        }),
      }),
    }),
  )

  // Initialize the vector source and layer when the component mounts
  useEffect(() => {
    if (!mapRef.current || !enabled) return

    mapRef.current.addLayer(layerRef.current)

    return () => {
      mapRef.current?.removeLayer(layerRef.current)
    }
  }, [mapRef, enabled])

  // Update the vector source with new features when data is fetched
  useEffect(() => {
    if (!sourceRef.current || !data) return

    const features = data.elements.map((element: any) => {
      const coordinate = transform(
        [element.lon, element.lat],
        'EPSG:4326',
        'EPSG:3857',
      )

      return new Feature({
        geometry: new Point(coordinate),
        name: element.tags?.name,
      })
    })

    sourceRef.current.clear()
    sourceRef.current.addFeatures(features)
  }, [sourceRef, data])

  return {
    enabled,
    toggle: () => setEnabled((enabled) => !enabled),
    isLoading,
    error,
    data,
  }
}
