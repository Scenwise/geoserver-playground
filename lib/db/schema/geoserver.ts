import { defineRelations } from 'drizzle-orm'
import { boolean, integer, pgTable, varchar } from 'drizzle-orm/pg-core'

export const geoserverMaps = pgTable('geoserver_maps', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull().unique(),
  version: integer().notNull(),
  geoserverEdges: varchar({ length: 255 }).notNull().unique(),
  geoserverNodes: varchar({ length: 255 }).notNull().unique(),
  isMain: boolean().unique(),
  description: varchar({ length: 255 }),
})

export const geoserverRelations = defineRelations({ geoserverMaps }, () => ({}))
