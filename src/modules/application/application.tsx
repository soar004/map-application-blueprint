import { Map, View } from "ol";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";
import React from "react";
import "ol/ol.css";
import "./application.css";
import { Layer } from "ol/layer";
import { MapContext } from "../map/mapContext";

useGeographic();

const map = new Map({
  layers: [new TileLayer({ source: new OSM() })],
  view: new View({
    center: [11, 59],
    zoom: 10,
  }),
});

export function MapApplication() {
  const [layers, setLayers] = useState<Layer[]>([
    new TileLayer({ source: new OSM() }),
  ]);

  useEffect(() => map.setLayers(layers), [layers]);

  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    map.setTarget(mapRef.current);
  }, []);

  useEffect(() => {
    map.setLayers(layers);
  }, [layers]);

  return (
    <MapContext.Provider value={{ map, layers, setLayers }}>
      <header>
        <h1>Project Name</h1>
      </header>

      <nav>
        {/* Add link for focusing on the user here */}

        {/* Place checkboxes here if you want them */}
      </nav>
      <main>
        <div ref={mapRef} className={"map"}></div>
        {/* Place the aside/sidebar if you want that. */}
      </main>
    </MapContext.Provider>
  );
}

export default MapApplication;
