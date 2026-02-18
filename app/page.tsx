'use client';

import { useRef, useEffect } from 'react';
import mapboxgl, { LngLatLike } from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import styles from './page.module.css';

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const center: LngLatLike = [4.4711501, 51.922963];

export default function Home() {
  const mapRef = useRef<mapboxgl.Map>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mapboxgl.accessToken = accessToken;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      center,
      zoom: 12,
    });

    // mapRef.current?.on('load', () => {
    //   console.log('Map loaded');

    //   mapRef.current!.addSource('wms-test-source', {
    //     type: 'raster',
    //     // use the tiles option to specify a WMS tile source URL
    //     // https://docs.mapbox.comhttps://docs.mapbox.com/style-spec/reference/sources/
    //     tiles: [
    //       // 'https://geoserver.scenwise.nl/geoserver/scenwise/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.3.0&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=scenwise:skeleton_graph_nodes',
    //       'https://geoserver.scenwise.nl/geoserver/scenwise/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&STYLES=&TRANSPARENT=TRUE&LAYERS=scenwise:skeleton_graph_nodes&TILED=true&WIDTH=256&HEIGHT=256&CRS=EPSG:4326&BBOX={bbox-epsg-3857}',
    //     ],
    //     tileSize: 256,
    //   });
    //   mapRef.current!.addLayer({
    //     id: 'wms-test-layer',
    //     type: 'raster',
    //     source: 'wms-test-source',
    //     paint: {},
    //     slot: 'middle',
    //   });
    // });

    return () => {
      mapRef.current!.remove();
    };
  }, []);

  return (
    <main className={styles.mainStyle}>
      <div className={styles.mapContainer} ref={mapContainerRef} />
    </main>
  );
}
