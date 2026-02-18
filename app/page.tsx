'use client';

import { LngLatLike } from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import { ModeToggle } from '@/components/mode-toggle';
import { MapboxMap } from '@/components/mapbox-map';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemTitle,
} from '@/components/ui/item';
import { useState } from 'react';

export default function Home() {
  const [center, setCenter] = useState<LngLatLike>([4.4711501, 51.922963]);

  return (
    <main className="min-h-svh flex px-4 pt-4 items-stretch">
      <aside className="w-1/4 h-full rounded-xl">
        <ModeToggle />
      </aside>

      <Item className="flex-col grow gap-2 items-stretch pb-0">
        <ItemContent className="basis-0 grow-0">
          <ItemTitle>Map v1.1</ItemTitle>
          <ItemDescription>Based on first version algorithm.</ItemDescription>
        </ItemContent>

        <ItemFooter className="rounded-t-xl basis-0 grow overflow-hidden shadow-lg bg-card ring-2 ring-white dark:ring-white/10">
          <MapboxMap center={center} onUpdateCenter={setCenter} />
        </ItemFooter>
      </Item>

      <Item className="flex-col grow gap-2 items-stretch pb-0">
        <ItemContent className="basis-0 grow-0">
          <ItemTitle>Map v1.2</ItemTitle>
          <ItemDescription>Based on first version algorithm.</ItemDescription>
        </ItemContent>

        <ItemFooter className="rounded-t-xl basis-0 grow overflow-hidden shadow-lg bg-card ring-2 ring-white dark:ring-white/10">
          <MapboxMap center={center} onUpdateCenter={setCenter} />
        </ItemFooter>
      </Item>
    </main>
  );
}
