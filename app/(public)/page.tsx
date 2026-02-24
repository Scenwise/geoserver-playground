'use client';

import { MapboxMap } from '@/components/mapbox-map';
import { Item, ItemFooter } from '@/components/ui/item';
import { useState } from 'react';
import { State } from 'ol/View';

export default function Home() {
  const [view, setView] = useState<Partial<State>>({
    center: [497598, 6785131],
    zoom: 17,
  });

  return (
    <main className="grow flex px-4 lg:px-6 pb-4 lg:pb-6 items-stretch">
      <Item className="flex-col grow gap-2 items-stretch p-0">
        <ItemFooter className="rounded-xl basis-0 grow overflow-hidden shadow-lg bg-card ring-4 ring-white dark:ring-white/10 p-0">
          <MapboxMap view={view} onUpdateView={setView} />
        </ItemFooter>
      </Item>
    </main>
  );
}
