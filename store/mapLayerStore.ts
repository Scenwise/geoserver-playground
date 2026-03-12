import { geoserverMapLayers } from '@/lib/db/schema/geoserver'
import { createStore } from 'zustand'

export type GeoserverLayer = typeof geoserverMapLayers.$inferSelect

export interface BaseLayerState extends GeoserverLayer {
  enabled: boolean
  opacity: number
}

export interface GeoserverTileLayerState extends BaseLayerState {
  source: 'geoserver-tile'
}

export interface GeoserverGeojsonLayerState extends BaseLayerState {
  source: 'geoserver-geojson'
}

export interface CustomLayerState extends BaseLayerState {
  source: 'custom'
  alignIndex: number
}

export type LayerState =
  | GeoserverTileLayerState
  | GeoserverGeojsonLayerState
  | CustomLayerState

export interface MapLayerStore {
  layers: Record<number, LayerState>
  registerLayer: (layer: GeoserverLayer, defaultEnabled?: boolean) => void
  unregisterLayer: (id: number) => void
  setEnabled: (id: number, enabled: boolean) => void
  toggleLayer: (id: number) => void
  setOpacity: (id: number, opacity: number) => void
  setAlignIndex: (id: number, alignIndex: number) => void
}

export const createMapLayerStore = () =>
  createStore<MapLayerStore>((set) => ({
    layers: {},
    registerLayer: (layer, defaultEnabled = false) =>
      set((state) => ({
        layers: {
          ...state.layers,
          [layer.id]: {
            ...layer,
            enabled: defaultEnabled,
            opacity: 1,
            alignIndex: 0,
          },
        },
      })),
    unregisterLayer: (id) =>
      set((state) => {
        const { [id]: _, ...rest } = state.layers
        return { layers: rest }
      }),
    setEnabled: (id, enabled) =>
      set((state) => ({
        layers: { ...state.layers, [id]: { ...state.layers[id], enabled } },
      })),
    toggleLayer: (id) =>
      set((state) => ({
        layers: {
          ...state.layers,
          [id]: { ...state.layers[id], enabled: !state.layers[id].enabled },
        },
      })),
    setOpacity: (id, opacity) =>
      set((state) => ({
        layers: { ...state.layers, [id]: { ...state.layers[id], opacity } },
      })),
    setAlignIndex: (id, alignIndex) =>
      set((state) => {
        const layer = state.layers[id]
        if (layer?.source !== 'custom') return state
        return {
          layers: {
            ...state.layers,
            [id]: { ...layer, alignIndex },
          },
        }
      }),
  }))

export type MapLayerStoreInstance = ReturnType<typeof createMapLayerStore>
