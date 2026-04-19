import { SegmentationKeyframe } from '@/store/segmentationStore'

export function interpolate(a: number, b: number, fraction: number): number {
  return a + fraction * (b - a)
}

export function interpolatePosition(
  posA: google.maps.LatLng,
  posB: google.maps.LatLng,
  fraction: number,
): google.maps.LatLng {
  const lat = interpolate(posA.lat(), posB.lat(), fraction)
  const lng = interpolate(posA.lng(), posB.lng(), fraction)
  return new google.maps.LatLng(lat, lng)
}

export function interpolateBearing(
  bearingA: number,
  bearingB: number,
  fraction: number,
): number {
  // Ensure we take the shortest path around the circle
  const delta = ((bearingB - bearingA + 540) % 360) - 180
  return (bearingA + fraction * delta + 360) % 360
}

export function interpolateSegmentationKeyframe(
  kfA: Omit<SegmentationKeyframe, 'stepsToNext'>,
  kfB: Omit<SegmentationKeyframe, 'stepsToNext'>,
  steps: number,
): SegmentationKeyframe[] {
  if (steps <= 0) return [kfA]

  const keyframes: SegmentationKeyframe[] = []
  for (let i = 0; i < steps; i++) {
    const fraction = (i + 1) / (steps + 1)
    keyframes.push({
      position: interpolatePosition(kfA.position, kfB.position, fraction),
      bearing: interpolateBearing(kfA.bearing, kfB.bearing, fraction),
      zoom: interpolate(kfA.zoom, kfB.zoom, fraction),
      interpolated: true,
    })
  }

  return keyframes
}
