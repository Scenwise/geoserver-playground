import { MapStyle } from '@/hooks/use-map-style'
import { create } from 'zustand'

export interface MapSettingsStore {
  mapStyle: MapStyle
  setMapStyle: (style: MapStyle) => void
}

export const useMapSettingsStore = create<MapSettingsStore>((set) => ({
  mapStyle: 'basic',
  setMapStyle: (style) => set({ mapStyle: style }),
}))
