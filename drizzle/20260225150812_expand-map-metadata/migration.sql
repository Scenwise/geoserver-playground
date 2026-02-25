ALTER TABLE "geoserver_maps" ADD COLUMN "isMain" boolean;--> statement-breakpoint
ALTER TABLE "geoserver_maps" ADD COLUMN "description" varchar(255);--> statement-breakpoint
ALTER TABLE "geoserver_maps" ADD CONSTRAINT "geoserver_maps_isMain_key" UNIQUE("isMain");