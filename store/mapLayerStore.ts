import { createStore } from 'zustand'

export interface BaseLayerState {
  id: string
  type: 'nodes' | 'edges'
  enabled: boolean
  opacity: number
}

export interface GeoserverTileLayerState extends BaseLayerState {
  source: 'geoserver-tile'
}

export interface CustomLayerState extends BaseLayerState {
  source: 'custom'
  alignIndex: number
}

export type LayerState = GeoserverTileLayerState | CustomLayerState

export interface MapLayerStore {
  layers: Record<string, LayerState>
  registerLayer: (
    id: string,
    source: LayerState['source'],
    type: 'nodes' | 'edges',
    defaultEnabled?: boolean,
  ) => void
  unregisterLayer: (id: string) => void
  setEnabled: (id: string, enabled: boolean) => void
  toggleLayer: (id: string) => void
  setOpacity: (id: string, opacity: number) => void
  setAlignIndex: (id: string, alignIndex: number) => void
}

export const createMapLayerStore = () =>
  createStore<MapLayerStore>((set) => ({
    layers: {},
    registerLayer: (id, source, type, defaultEnabled = false) =>
      set((state) => ({
        layers: {
          ...state.layers,
          [id]: {
            id,
            source,
            type,
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
