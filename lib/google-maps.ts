import { Coordinate } from 'ol/coordinate'
import { transform } from 'ol/proj'

const OL_PROJECTION = 'EPSG:3857' // OpenLayers uses EPSG:3857
const SV_PROJECTION = 'EPSG:4326' // Street View uses EPSG:4326

/**
 * Converts an OpenLayers Coordinate (in EPSG:3857) to a google.maps.LatLng (in EPSG:4326)
 */
export function coordinateToLatLng(coordinate: undefined): undefined
export function coordinateToLatLng(coordinate: Coordinate): google.maps.LatLng
export function coordinateToLatLng(
  coordinate: Coordinate | undefined,
): google.maps.LatLng | undefined
export function coordinateToLatLng(
  coordinate: Coordinate | undefined,
): google.maps.LatLng | undefined {
  if (!coordinate) return undefined
  const [lng, lat] = transform(coordinate, OL_PROJECTION, SV_PROJECTION)
  return new google.maps.LatLng(lat, lng)
}

/**
 * Converts a google.maps.LatLng (in EPSG:4326) to an OpenLayers Coordinate (in EPSG:3857)
 */
export function latLngToCoordinate(latLng: undefined): undefined
export function latLngToCoordinate(latLng: google.maps.LatLng): Coordinate
export function latLngToCoordinate(
  latLng: google.maps.LatLng | undefined,
): Coordinate | undefined
export function latLngToCoordinate(
  latLng: google.maps.LatLng | undefined,
): Coordinate | undefined {
  if (!latLng) return undefined
  const [lng, lat] = transform(
    [latLng.lng(), latLng.lat()],
    SV_PROJECTION,
    OL_PROJECTION,
  )
  return [lng, lat]
}
