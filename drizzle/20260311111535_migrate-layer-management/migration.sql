DO $$ BEGIN
  CREATE TYPE "layer_type" AS ENUM('nodes', 'edges');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
CREATE TABLE "geoserver_map_layers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "geoserver_map_layers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"geoserverMapId" integer NOT NULL,
	"layerId" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" "layer_type" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "geoserver_maps" DROP CONSTRAINT "geoserver_maps_geoserverEdges_unique";--> statement-breakpoint
ALTER TABLE "geoserver_maps" DROP CONSTRAINT "geoserver_maps_geoserverNodes_unique";--> statement-breakpoint
ALTER TABLE "geoserver_maps" DROP COLUMN "geoserverEdges";--> statement-breakpoint
ALTER TABLE "geoserver_maps" DROP COLUMN "geoserverNodes";--> statement-breakpoint
ALTER TABLE "geoserver_map_layers" ADD CONSTRAINT "geoserver_map_layers_geoserverMapId_geoserver_maps_id_fkey" FOREIGN KEY ("geoserverMapId") REFERENCES "geoserver_maps"("id") ON DELETE CASCADE;