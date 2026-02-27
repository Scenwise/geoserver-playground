import Script from 'next/script'
import { getMainGeoServerMap } from '../actions/geoserver-map'
import { StreetviewClientPage } from './client-page'

export default async function StreetviewPage() {
  const mainMap = await getMainGeoServerMap()

  const API_KEY = process.env.NEXT_GOOGLE_MAPS_API_KEY

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
