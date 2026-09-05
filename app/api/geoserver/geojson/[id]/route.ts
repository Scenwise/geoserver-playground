import { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  let res: Response
  try {
    res = await fetch(
      `https://geoserver.scenwise.nl/geoserver/scenwise/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${id}&outputFormat=application/json`,
    )
  } catch (err) {
    console.error(`GeoServer fetch failed for layer "${id}":`, err)
    return Response.json({ error: 'Failed to reach GeoServer' }, { status: 502 })
  }

  if (!res.ok) {
    const text = await res.text()
    console.error(`GeoServer returned ${res.status} for layer "${id}":`, text)
    return Response.json(
      { error: `GeoServer error: ${res.status}`, detail: text },
      { status: res.status },
    )
  }

  const data = await res.json()
  return Response.json(data)
}
