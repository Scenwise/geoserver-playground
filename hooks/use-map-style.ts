import { useTheme } from 'next-themes';
import { Map } from 'ol';
import LayerGroup from 'ol/layer/Group';
import { useEffect, useMemo, useState } from 'react';
import apply from 'ol-mapbox-style';

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

/**
 * Custom hook to manage the map style based on the current theme and satellite mode.
 * It updates the map's base layer whenever the theme or satellite mode changes.
 *
 * @param mapRef - A ref to the OpenLayers Map instance that needs to be updated when the style changes.
 *
 * @returns styleUrl - The URL of the current map style being used.
 * @returns setIsSatellite - A function to toggle satellite mode on or off.
 */
export function useMapStyle(mapRef: React.RefObject<Map | null>) {
  const { theme } = useTheme();
  const [isSatellite, setIsSatellite] = useState(false);

  const styleUrl = useMemo(() => {
    if (isSatellite) return 'mapbox://styles/mapbox/satellite-v9';
    return theme === 'dark'
      ? 'mapbox://styles/mapbox/dark-v11'
      : 'mapbox://styles/mapbox/light-v11';
  }, [theme, isSatellite]);

  // Change the base layer to trigger a style update when the theme changes
  useEffect(() => {
    if (!mapRef.current) return;

    const layers = mapRef.current.getLayers();
    layers.removeAt(0);

    const layerGroup = new LayerGroup();
    apply(layerGroup, styleUrl, { accessToken });

    layers.insertAt(0, layerGroup);
  }, [styleUrl]);

  return { styleUrl, isSatellite, setIsSatellite };
}
