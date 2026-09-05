import { NextRequest } from 'next/server'

const BASE = 'https://geoserver.scenwise.nl/geoserver/scenwise/ows'
const PAGE_SIZE = 1000
const MAX_RETRIES = 3

async function fetchPage(id: string, startIndex: number): Promise<unknown[]> {
  const url = `${BASE}?service=WFS&version=2.0.0&request=GetFeature&typeName=${id}&outputFormat=application/json&count=${PAGE_SIZE}&startIndex=${startIndex}`

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    let res: Response
    try {
      res = await fetch(url)
    } catch (err) {
      if (attempt === MAX_RETRIES) throw new Error(`Network error after ${MAX_RETRIES} attempts: ${err}`)
      continue
    }

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`GeoServer ${res.status}: ${text}`)
    }

    let page: { features?: unknown[] }
    try {
      page = await res.json()
    } catch (err) {
      if (attempt === MAX_RETRIES) throw new Error(`Invalid JSON after ${MAX_RETRIES} attempts: ${err}`)
      continue
    }

    return page.features ?? []
  }

  return []
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const allFeatures: unknown[] = []
  let startIndex = 0

  while (true) {
    let features: unknown[]
    try {
      features = await fetchPage(id, startIndex)
    } catch (err) {
      console.error(`GeoServer fetch failed for layer "${id}" at startIndex ${startIndex}:`, err)
      return Response.json({ error: 'Failed to fetch from GeoServer', detail: String(err) }, { status: 502 })
    }

    allFeatures.push(...features)
    if (features.length < PAGE_SIZE) break
    startIndex += PAGE_SIZE
  }

  return Response.json({ type: 'FeatureCollection', features: allFeatures })
}

