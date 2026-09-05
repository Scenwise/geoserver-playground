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

async function getTotalCount(id: string): Promise<number> {
  const url = `${BASE}?service=WFS&version=2.0.0&request=GetFeature&typeName=${id}&outputFormat=application/json&count=1&startIndex=0`
  const res = await fetch(url)
  const data: { numberMatched?: number; totalFeatures?: number } = await res.json()
  return data.numberMatched ?? data.totalFeatures ?? 0
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  let total: number
  try {
    total = await getTotalCount(id)
  } catch (err) {
    console.error(`Failed to get feature count for "${id}":`, err)
    return Response.json({ error: 'Failed to reach GeoServer' }, { status: 502 })
  }

  const offsets = Array.from(
    { length: Math.ceil(total / PAGE_SIZE) },
    (_, i) => i * PAGE_SIZE,
  )

  let pages: unknown[][]
  try {
    pages = await Promise.all(offsets.map((startIndex) => fetchPage(id, startIndex)))
  } catch (err) {
    console.error(`GeoServer fetch failed for layer "${id}":`, err)
    return Response.json({ error: 'Failed to fetch from GeoServer', detail: String(err) }, { status: 502 })
  }

  const allFeatures = pages.flat()
  return Response.json({ type: 'FeatureCollection', features: allFeatures })
}

