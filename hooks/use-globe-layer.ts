import { Map } from 'ol'
import DragRotateAndZoom from 'ol/interaction/DragRotateAndZoom'
import { useEffect, useRef, useState } from 'react'

export function useGlobeLayer(map: Map | null) {
  const [enabled, setEnabled] = useState(false)
  const [tilt, setTilt] = useState(90)
  const interactionRef = useRef<DragRotateAndZoom | null>(null)

  useEffect(() => {
    if (!map) return

    if (enabled) {
      const interaction = new DragRotateAndZoom()
      interactionRef.current = interaction
      map.addInteraction(interaction)
    } else {
      if (interactionRef.current) {
        map.removeInteraction(interactionRef.current)
        interactionRef.current = null
      }
      map.getView().setRotation(0)
    }

    return () => {
      if (interactionRef.current) {
        map.removeInteraction(interactionRef.current)
        interactionRef.current = null
      }
    }
  }, [map, enabled])

  function resetView() {
    if (!map) return
    map.getView().setRotation(0)
    setTilt(90)
  }

  return {
    enabled,
    tilt,
    setTilt,
    toggle: () => setEnabled((v) => !v),
    resetView,
  }
}
