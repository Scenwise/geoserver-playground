'use server'

import { db } from '@/lib/db'
import { geoserverMaps } from '@/lib/db/schema/geoserver'
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
    return await db.query.geoserverMaps.findFirst({
      where: { isMain: true },
    })
  } catch (error) {
    console.error('Error fetching main GeoServer map:', error)
    return null
  }
})

export type UpsertGeoserverMap =
  | typeof geoserverMaps.$inferSelect
  | typeof geoserverMaps.$inferInsert

const geogerverMapInsertSchema = createInsertSchema(geoserverMaps)
export const insertGeoServerMap = async (
  data: z.infer<typeof geogerverMapInsertSchema>,
) => {
  await verifySession()

  await db.insert(geoserverMaps).values(data)

  refresh()
}

const geoserverMapUpdateSchema = createUpdateSchema(geoserverMaps)
export const updateGeoServerMap = async (
  id: number,
  data: z.infer<typeof geoserverMapUpdateSchema>,
) => {
  await verifySession()

  await db.update(geoserverMaps).set(data).where(eq(geoserverMaps.id, id))

  refresh()
}

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
