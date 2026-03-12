CREATE TYPE "layer_source" AS ENUM('geoserver-vector', 'geoserver-geojson', 'custom');--> statement-breakpoint
ALTER TABLE "geoserver_map_layers" ADD COLUMN "source" "layer_source" DEFAULT 'geoserver-vector'::"layer_source" NOT NULL;--> statement-breakpoint
ALTER TABLE "geoserver_maps" ADD COLUMN "initialX" integer;--> statement-breakpoint
ALTER TABLE "geoserver_maps" ADD COLUMN "initialY" integer;--> statement-breakpoint
ALTER TABLE "geoserver_maps" ADD COLUMN "initialZoom" integer;