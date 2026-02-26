'use client';

import { Button } from '@/components/ui/button';
import { setGeoServerMapMain } from '../actions/geoserver-map';
import { StarIcon } from 'lucide-react';

export function GeoserverMapMainButton({
  map: { id, isMain },
}: {
  map: { id: number; isMain: boolean | null };
}) {
  if (isMain) return null;

  return (
    <Button variant="secondary" onClick={() => setGeoServerMapMain(id)}>
      <StarIcon />
      Make main
    </Button>
  );
}
