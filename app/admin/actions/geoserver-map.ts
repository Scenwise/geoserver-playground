'use server';

import { db } from '@/lib/db';
import { geoserverMaps } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { createInsertSchema, createUpdateSchema } from 'drizzle-orm/zod';
import z from 'zod';
import { refresh } from 'next/cache';

export type UpsertGeoserverMap =
  | typeof geoserverMaps.$inferSelect
  | typeof geoserverMaps.$inferInsert;

const geogerverMapInsertSchema = createInsertSchema(geoserverMaps);
export async function insertGeoServerMap(
  data: z.infer<typeof geogerverMapInsertSchema>,
) {
  await db.insert(geoserverMaps).values(data);
  refresh();
}

const geoserverMapUpdateSchema = createUpdateSchema(geoserverMaps);
export async function updateGeoServerMap(
  id: number,
  data: z.infer<typeof geoserverMapUpdateSchema>,
) {
  await db.update(geoserverMaps).set(data).where(eq(geoserverMaps.id, id));
  refresh();
}

export async function setGeoServerMapMain(id: number) {
  await db
    .update(geoserverMaps)
    .set({ isMain: null })
    .where(eq(geoserverMaps.isMain, true));
  await db
    .update(geoserverMaps)
    .set({ isMain: true })
    .where(eq(geoserverMaps.id, id));

  refresh();
}
