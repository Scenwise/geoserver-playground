'use server'

import { db } from '@/lib/db'
import { geoserverMapLayers, geoserverMaps } from '@/lib/db/schema/geoserver'
import { eq } from 'drizzle-orm'
import { createInsertSchema, createUpdateSchema } from 'drizzle-orm/zod'
import z from 'zod'
import { refresh } from 'next/cache'
import { verifySession } from '@/lib/auth/session'
import { cache } from 'react'

export const getGeoserverMaps = cache(async () => {
  await verifySession()

  try {
    return await db.query.geoserverMaps.findMany({
      orderBy: { name: 'asc' },
    })
  } catch (error) {
    console.error('Error fetching GeoServer maps:', error)
    return []
  }
})

export const getGeoserverMapById = cache(async (id: number) => {
  await verifySession()

  try {
    const data = await db.query.geoserverMaps.findFirst({
      where: { id },
      with: { layers: true },
    })
    return data ?? null
  } catch (error) {
    console.error(`Error fetching GeoServer map with id ${id}:`, error)
    return null
  }
})

export const getMainGeoserverMap = cache(async () => {
  await verifySession()

  try {
    const data = await db.query.geoserverMaps.findFirst({
      where: { isMain: true },
      with: { layers: true },
    })
    return data ?? null
  } catch (error) {
    console.error('Error fetching main GeoServer map:', error)
    return null
  }
})

export const setGeoServerMapMain = async (id: number) => {
  await verifySession()

  await db
    .update(geoserverMaps)
    .set({ isMain: null })
    .where(eq(geoserverMaps.isMain, true))
  await db
    .update(geoserverMaps)
    .set({ isMain: true })
    .where(eq(geoserverMaps.id, id))

  refresh()
}

export const setGeoServerInitialView = async (
  id: number,
  initialX: number,
  initialY: number,
  initialZoom: number,
) => {
  await verifySession()

  await db
    .update(geoserverMaps)
    .set({ initialX, initialY, initialZoom })
    .where(eq(geoserverMaps.id, id))

  refresh()
}

export type UpsertGeoserverMap =
  | typeof geoserverMaps.$inferSelect
  | typeof geoserverMaps.$inferInsert

const _geoserverMapInsertSchema = createInsertSchema(geoserverMaps)
export const insertGeoServerMap = async (
  data: z.infer<typeof _geoserverMapInsertSchema>,
) => {
  await verifySession()

  await db.insert(geoserverMaps).values(data)

  refresh()
}

const _geoserverMapUpdateSchema = createUpdateSchema(geoserverMaps)
export const updateGeoServerMap = async (
  id: number,
  data: z.infer<typeof _geoserverMapUpdateSchema>,
) => {
  await verifySession()

  await db.update(geoserverMaps).set(data).where(eq(geoserverMaps.id, id))

  refresh()
}

export type UpsertGeoserverLayer =
  | typeof geoserverMapLayers.$inferSelect
  | typeof geoserverMapLayers.$inferInsert

const _geoserverLayerInsertSchema = createInsertSchema(geoserverMapLayers)
export const insertGeoServerLayer = async (
  data: z.infer<typeof _geoserverLayerInsertSchema>,
) => {
  await verifySession()

  await db.insert(geoserverMapLayers).values(data)

  refresh()
}

const _geoserverLayerUpdateSchema = createUpdateSchema(geoserverMapLayers)
export const updateGeoServerLayer = async (
  id: number,
  data: z.infer<typeof _geoserverLayerUpdateSchema>,
) => {
  await verifySession()

  await db
    .update(geoserverMapLayers)
    .set(data)
    .where(eq(geoserverMapLayers.id, id))

  refresh()
}
