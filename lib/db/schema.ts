import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';

export const geoserverMaps = pgTable('geoserver_maps', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull().unique(),
  version: integer().notNull(),
  geoserverEdges: varchar({ length: 255 }).notNull().unique(),
  geoserverNodes: varchar({ length: 255 }).notNull().unique(),
});
