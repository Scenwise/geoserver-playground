import { interpolateSegmentationKeyframe } from '@/lib/interpolate'
import { create } from 'zustand'

export type SegmentationKeyframe = {
  position: google.maps.LatLng
  bearing: number
  zoom: number
  stepsToNext?: number | null
  interpolated?: boolean
}

export interface SegmentationStore {
  keyframes: SegmentationKeyframe[]
  selectedIndex: number
  addKeyframe: (keyframe: SegmentationKeyframe) => void
  removeKeyframe: (index: number) => void
  setStepsToNext: (index: number, steps: number | null) => void
  clearKeyframes: () => void
  setSelectedIndex: (index: number) => void
  getInterpolatedKeyframes: () => SegmentationKeyframe[]
  reset: () => void
}

export const useSegmentationStore = create<SegmentationStore>(
  (set, get, store) => ({
    keyframes: [],
    selectedIndex: 0,
    addKeyframe: (keyframe) =>
      set((state) => ({ keyframes: [...state.keyframes, keyframe] })),
    removeKeyframe: (index) =>
      set((state) => {
        const keyframes = [...state.keyframes]
        if (index < 0 || index >= keyframes.length) return { keyframes }
        keyframes.splice(index, 1)
        return { keyframes }
      }),
    setStepsToNext: (index, steps) =>
      set((state) => {
        const keyframes = [...state.keyframes]
        if (index < 0 || index >= keyframes.length) return { keyframes }
        keyframes[index] = { ...keyframes[index], stepsToNext: steps }
        return { keyframes }
      }),
    clearKeyframes: () => set({ keyframes: [], selectedIndex: 0 }),
    setSelectedIndex: (index) => set({ selectedIndex: index }),
    getInterpolatedKeyframes: (): SegmentationKeyframe[] => {
      const { keyframes } = get()

      const interpolated: SegmentationKeyframe[] = []
      for (let i = 0; i < keyframes.length - 1; i++) {
        const { stepsToNext, ...kfA } = keyframes[i]
        const { stepsToNext: _, ...kfB } = keyframes[i + 1]

        interpolated.push(
          kfA,
          ...interpolateSegmentationKeyframe(kfA, kfB, stepsToNext ?? 0),
        )
      }

      if (keyframes.length > 0) {
        const { stepsToNext: _, ...lastKf } = keyframes[keyframes.length - 1]
        interpolated.push(lastKf)
      }

      return interpolated
    },
    reset: () => {
      set(store.getInitialState())
    },
  }),
)
