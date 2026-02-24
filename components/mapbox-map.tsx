'use client';

import { useRef, useEffect, useState } from 'react';

import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { TileWMS } from 'ol/source';
import apply, { MapboxVectorLayer } from 'ol-mapbox-style';
import { useTheme } from 'next-themes';
import LayerGroup from 'ol/layer/Group';
import { State } from 'ol/View';

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

interface MapboxMapProps {
  initialView?: Partial<State>;
  onUpdateView?: (view: State) => void;
}

export function MapboxMap({ initialView, onUpdateView }: MapboxMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map>(null);

  const { theme } = useTheme();

  const [view] = useState<Partial<State>>(
    () =>
      initialView || {
        center: [497598, 6785131],
        zoom: 17,
      },
  );

  // Initialize the map on component mount
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new Map({
      target: mapContainerRef.current!,
      layers: [
        new MapboxVectorLayer({
          styleUrl: mapStyle(theme),
          accessToken,
        }),
        new TileLayer({
          source: new TileWMS({
            url: 'https://geoserver.scenwise.nl/geoserver/scenwise/wms',
            params: { LAYERS: 'scenwise:skeleton_graph_edges', TILED: true },
            serverType: 'geoserver',
          }),
        }),
        new TileLayer({
          source: new TileWMS({
            url: 'https://geoserver.scenwise.nl/geoserver/scenwise/wms',
            params: { LAYERS: 'scenwise:skeleton_graph_nodes', TILED: true },
            serverType: 'geoserver',
          }),
        }),
      ],
      view: new View({
        projection: 'EPSG:3857',
        ...view,
      }),
    });

    mapRef.current = map;

    // Update center on map move
    map.on('moveend', () => {
      const view = map.getView();
      onUpdateView?.(view.getState());
    });

    return () => map.setTarget(undefined);
  }, []);

  // Update the map view state
  useEffect(() => {
    if (!mapRef.current || !view) return;

    const mapView = mapRef.current.getView();
    const currentZoom = mapView.getZoom();
    const currentCenter = mapView.getCenter();

    const targetZoom = view.zoom !== currentZoom ? view.zoom : undefined;
    const targetCenter =
      view.center && view.center.length === 2 ? view.center : undefined;

    if (targetZoom || targetCenter) {
      mapView.animate({
        zoom: targetZoom,
        center: targetCenter,
        duration: 100,
      });
    }
  }, [view]);

  // Change the base layer to trigger a style update when the theme changes
  useEffect(() => {
    if (!mapRef.current) return;

    const layers = mapRef.current.getLayers();
    layers.removeAt(0);

    const layerGroup = new LayerGroup();
    apply(layerGroup, mapStyle(theme), { accessToken });

    layers.insertAt(0, layerGroup);
  }, [theme]);

  return <div className="w-full h-full" ref={mapContainerRef} />;
}

const mapStyle = (theme?: string) =>
  theme === 'dark'
    ? 'mapbox://styles/mapbox/dark-v11'
    : 'mapbox://styles/mapbox/light-v11';
