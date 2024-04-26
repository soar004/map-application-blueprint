import * as React from "react";
import { Map, View } from "ol";
import { useGeographic } from "ol/proj";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { MutableRefObject, useEffect, useRef } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import "ol/ol.css";
import "./app.css";

// Enable geographic coordinates for OpenLayers
useGeographic();

export function Application() {
  // Create a ref for the map container div
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    // Create a new map
    const map = new Map({
      // Set the view with center coordinates and zoom level
      view: new View({ center: [10, 60], zoom: 8 }),
      layers: [
        // Add a tile layer with OpenStreetMap as the source
        new TileLayer({ source: new OSM() }),
        // Add a vector layer with a point feature
        new VectorLayer({
          source: new VectorSource({
            features: new GeoJSON().readFeatures({
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: { type: "Point", coordinates: [10, 60] },
                },
              ],
            }),
          }),
        }),
      ],
    });

    // Set the target of the map to the map container div
    map.setTarget(mapRef.current);

    // Clean up on unmount
    return () => {
      map.setTarget(undefined);
    };
  }, []);

  // Render the map container div
  return <div ref={mapRef}></div>;
}
