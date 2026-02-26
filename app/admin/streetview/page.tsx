import Script from 'next/script'
import { getMainGeoServerMap } from '../actions/geoserver-map'
import { StreetviewClientPage } from './client-page'

export default async function StreetviewPage() {
  const mainMap = await getMainGeoServerMap()

  return (
    <>
      <StreetviewClientPage map={mainMap} />

      <Script
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBV_2uZSYF39j9I6elryKUkOLerNVVnoqU&v=weekly"
        defer
        async
      />
    </>
  )
}
