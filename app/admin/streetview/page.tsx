import Script from 'next/script'
import { StreetviewClientPage } from './client-page'
import { getMainGeoserverMap } from '../actions/geoserver-map'

const API_KEY = process.env.NEXT_GOOGLE_MAPS_API_KEY

export default async function StreetviewPage() {
  const mainMap = await getMainGeoserverMap()

  return (
    <>
      <StreetviewClientPage map={mainMap} />

      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${API_KEY}&v=weekly`}
        defer
        async
      />
    </>
  )
}
