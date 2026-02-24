'use client';

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
import { State } from 'ol/View';

export default function Home() {
  return (
    <div className="min-h-svh flex px-4 pt-4 items-stretch">
      ADMIN Dashboard
    </div>
  );
}
