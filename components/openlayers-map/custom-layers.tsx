import { useCustomMapLayer } from '@/hooks/use-custom-map-layer'
import { Map } from 'ol'

export function CustomLayer({ map }: { map: Map | null }) {
  useCustomMapLayer(map)

  return null
}
