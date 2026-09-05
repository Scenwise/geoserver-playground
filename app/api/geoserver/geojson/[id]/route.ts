import { NextRequest } from 'next/server'

const BASE = 'https://geoserver.scenwise.nl/geoserver/scenwise/ows'
const PAGE_SIZE = 1000

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const allFeatures: unknown[] = []
  let startIndex = 0

  while (true) {
    const url = `${BASE}?service=WFS&version=2.0.0&request=GetFeature&typeName=${id}&outputFormat=application/json&count=${PAGE_SIZE}&startIndex=${startIndex}`
    let res: Response
    try {
      res = await fetch(url)
    } catch (err) {
      console.error(`GeoServer fetch failed for layer "${id}" at startIndex ${startIndex}:`, err)
      return Response.json({ error: 'Failed to reach GeoServer' }, { status: 502 })
    }

    if (!res.ok) {
      const text = await res.text()
      console.error(`GeoServer returned ${res.status} for layer "${id}":`, text)
      return Response.json({ error: `GeoServer error: ${res.status}`, detail: text }, { status: res.status })
    }

    let page: { features?: unknown[]; numberReturned?: number }
    try {
      page = await res.json()
    } catch (err) {
      console.error(`Invalid JSON from GeoServer for layer "${id}" at startIndex ${startIndex}:`, err)
      return Response.json({ error: 'Invalid response from GeoServer' }, { status: 502 })
    }

    const features = page.features ?? []
    allFeatures.push(...features)

    if (features.length < PAGE_SIZE) break
    startIndex += PAGE_SIZE
  }

  return Response.json({ type: 'FeatureCollection', features: allFeatures })
}
