ALTER TABLE "geoserver_map_layers" ALTER COLUMN "source" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "geoserver_map_layers" ALTER COLUMN "source" DROP DEFAULT;--> statement-breakpoint
DROP TYPE "layer_source";--> statement-breakpoint
CREATE TYPE "layer_source" AS ENUM('geoserver-tile', 'geoserver-geojson', 'custom');--> statement-breakpoint

-- Rename "geoserver-vector" to "geoserver-tile" in existing data
UPDATE "geoserver_map_layers" SET "source" = 'geoserver-tile' WHERE "source" = 'geoserver-vector';--> statement-breakpoint

ALTER TABLE "geoserver_map_layers" ALTER COLUMN "source" SET DATA TYPE "layer_source" USING "source"::"layer_source";--> statement-breakpoint
ALTER TABLE "geoserver_map_layers" ALTER COLUMN "source" SET DEFAULT 'geoserver-tile'::"layer_source";