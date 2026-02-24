'use client';

import { MapboxMap } from '@/components/mapbox-map';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemTitle,
} from '@/components/ui/item';
import { useState } from 'react';
import { State } from 'ol/View';

export default function Home() {
  const [view, setView] = useState<Partial<State>>({
    center: [497598, 6785131],
    zoom: 17,
  });

  return (
    <div className="min-h-svh flex p-4 items-stretch">
      <Item className="flex-col grow gap-2 items-stretch pb-0">
        <ItemContent className="basis-0 grow-0">
          <ItemTitle>Map v1.1</ItemTitle>
          <ItemDescription>Based on first version algorithm.</ItemDescription>
        </ItemContent>

        <ItemFooter className="rounded-xl basis-0 grow overflow-hidden shadow-xl bg-card ring-4 ring-white dark:ring-white/10">
          <MapboxMap initialView={view} onUpdateView={setView} />
        </ItemFooter>
      </Item>

      <Item className="flex-col grow gap-2 items-stretch pb-0">
        <ItemContent className="basis-0 grow-0">
          <ItemTitle>Map v1.2</ItemTitle>
          <ItemDescription>Based on first version algorithm.</ItemDescription>
        </ItemContent>

        <ItemFooter className="rounded-xl basis-0 grow overflow-hidden shadow-lg bg-card ring-4 ring-white dark:ring-white/10">
          <MapboxMap initialView={view} onUpdateView={setView} />
        </ItemFooter>
      </Item>
    </div>
  );
}
