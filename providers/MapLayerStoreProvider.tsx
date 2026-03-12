'use client'

import {
  createMapLayerStore,
  MapLayerStore,
  MapLayerStoreInstance,
} from '@/store/mapLayerStore'
import { createContext, useContext, useState } from 'react'
import { useStore } from 'zustand/react'

const MapLayerStoreContext = createContext<MapLayerStoreInstance | null>(null)

export function MapLayerStoreProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [store] = useState(createMapLayerStore)
  return (
    <MapLayerStoreContext.Provider value={store}>
      {children}
    </MapLayerStoreContext.Provider>
  )
}

export function useMapLayerStore(): MapLayerStore
export function useMapLayerStore<T>(selector: (state: MapLayerStore) => T): T
export function useMapLayerStore<T>(selector?: (state: MapLayerStore) => T) {
  const store = useContext(MapLayerStoreContext)
  if (!store) throw new Error('Missing MapLayerStoreProvider')
  return useStore(store, selector ?? ((s) => s as T))
}
