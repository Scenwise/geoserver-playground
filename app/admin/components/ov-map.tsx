'use client'

import { OpenLayersMap } from '@/components/openlayers-map'
import { Feature, Map } from 'ol'
import { Point } from 'ol/geom'
import VectorLayer from 'ol/layer/Vector'
import { transform } from 'ol/proj'
import VectorSource from 'ol/source/Vector'
import { Style, Fill, Stroke } from 'ol/style'
import CircleStyle from 'ol/style/Circle'
import { useEffect, useRef } from 'react'

export function OVMap({ stops }: { stops: any[] }) {
  const mapRef = useRef<Map>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Add your OpenLayers map initialization and layer setup here, using the `stops` data to create features and add them to the map.
    const ovSource = new VectorSource({
      features: stops.map((stop) => {
        const coordinate = transform(
          [stop.lon, stop.lat],
          'EPSG:4326',
          'EPSG:3857',
        )

        const feature = new Feature({
          geometry: new Point(coordinate),
          name: stop.tags.name,
        })
        return feature
      }),
    })

    const ovLayer = new VectorLayer({
      source: ovSource,
      style: new Style({
        // simple circle style for bus stops
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({ color: 'blue' }),
          stroke: new Stroke({ color: 'white', width: 1 }),
        }),
      }),
    })

    mapRef.current.addLayer(ovLayer)
  }, [mapRef])

  return <OpenLayersMap ref={mapRef} />
}
