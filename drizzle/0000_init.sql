CREATE TABLE "geoserver_maps" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "geoserver_maps_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"version" integer NOT NULL,
	"geoserverEdges" varchar(255) NOT NULL,
	"geoserverNodes" varchar(255) NOT NULL,
	CONSTRAINT "geoserver_maps_name_unique" UNIQUE("name"),
	CONSTRAINT "geoserver_maps_geoserverEdges_unique" UNIQUE("geoserverEdges"),
	CONSTRAINT "geoserver_maps_geoserverNodes_unique" UNIQUE("geoserverNodes")
);
