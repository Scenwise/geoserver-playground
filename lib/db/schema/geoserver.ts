import { defineRelations } from 'drizzle-orm'
import { boolean, integer, pgEnum, pgTable, varchar } from 'drizzle-orm/pg-core'

export const geoserverMaps = pgTable('geoserver_maps', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull().unique(),
  version: integer().notNull(),
  isMain: boolean().unique(),
  description: varchar({ length: 255 }),
})

export const layerTypeEnum = pgEnum('layer_type', ['nodes', 'edges'])
export const geoserverMapLayers = pgTable('geoserver_map_layers', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  geoserverMapId: integer()
    .notNull()
    .references(() => geoserverMaps.id, { onDelete: 'cascade' }),
  layerId: varchar({ length: 255 }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  type: layerTypeEnum().notNull(),
})

export const geoserverRelations = defineRelations(
  { geoserverMaps, geoserverMapLayers },
  (r) => ({
    geoserverMaps: {
      layers: r.many.geoserverMapLayers(),
    },
    geoserverMapLayers: {
      map: r.one.geoserverMaps({
        from: r.geoserverMapLayers.geoserverMapId,
        to: r.geoserverMaps.id,
      }),
    },
  }),
)
