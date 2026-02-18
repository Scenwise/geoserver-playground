'use client';

import { useRef, useEffect } from 'react';
import mapboxgl, { LngLatLike } from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

interface MapboxMapProps {
  center: LngLatLike;
  onUpdateCenter?: (center: LngLatLike) => void;
}

export function MapboxMap({ center, onUpdateCenter }: MapboxMapProps) {
  const mapRef = useRef<mapboxgl.Map>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mapboxgl.accessToken = accessToken;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      center: center,
      zoom: 12,
      config: { basemap: { theme: 'monochrome' } },
    });

    mapRef.current?.on('load', () => {
      console.log('Map loaded');

      mapRef.current!.addSource('wms-test-source', {
        type: 'raster',
        // use the tiles option to specify a WMS tile source URL
        // https://docs.mapbox.comhttps://docs.mapbox.com/style-spec/reference/sources/
        tiles: [
          // 'https://geoserver.scenwise.nl/geoserver/scenwise/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.3.0&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=scenwise:skeleton_graph_nodes',
          'https://geoserver.scenwise.nl/geoserver/scenwise/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&STYLES=&TRANSPARENT=TRUE&LAYERS=scenwise:skeleton_graph_nodes&TILED=true&WIDTH=256&HEIGHT=256&CRS=EPSG:4258&BBOX={bbox-epsg-3857}',
        ],
        tileSize: 256,
      });

      mapRef.current!.addLayer({
        id: 'wms-test-layer',
        type: 'raster',
        source: 'wms-test-source',
        paint: {},
        slot: 'middle',
      });
    });

    // Listen for map movement and update the center state
    mapRef.current.on('moveend', () => {
      const newCenter = mapRef.current!.getCenter();
      onUpdateCenter?.([newCenter.lng, newCenter.lat]);
    });

    return () => {
      mapRef.current!.remove();
    };
  }, []);

  // Update map center when the `center` prop changes
  useEffect(() => {
    const currentCenter = mapRef.current?.getCenter();
    if (
      mapRef.current &&
      (!currentCenter ||
        currentCenter.lng !== center[0] ||
        currentCenter.lat !== center[1])
    ) {
      mapRef.current.flyTo({ center });
    }
  }, [center]);

  return <div className="w-full h-full" ref={mapContainerRef} />;
}
