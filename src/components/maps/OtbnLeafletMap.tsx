"use client";

import { useEffect, useMemo, useState } from "react";
import { GeoJSON, MapContainer, TileLayer, useMap } from "react-leaflet";
import type { Layer, PathOptions } from "leaflet";
import L from "leaflet";
import { otbnColor } from "@/lib/otbnColors";
import type {
  OtbnCollection,
  OtbnFeature,
  OtbnProvinceFilter,
} from "@/lib/otbnCopy";

type Props = {
  highlightZona?: number | null;
  provinceFilter?: OtbnProvinceFilter;
  className?: string;
  interactive?: boolean;
};

function FitBounds({ data }: { data: OtbnCollection }) {
  const map = useMap();

  useEffect(() => {
    if (!data.features.length) return;
    const layer = L.geoJSON(data as GeoJSON.GeoJsonObject);
    const bounds = layer.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [28, 28], maxZoom: 9, animate: true });
    }
  }, [map, data]);

  return null;
}

function featureStyle(
  feature: OtbnFeature | undefined,
  highlightZona: number | null,
): PathOptions {
  const zona = feature?.properties.zona ?? 0;
  const dimmed = highlightZona != null && highlightZona !== zona;
  const color = otbnColor(zona);
  return {
    fillColor: color,
    fillOpacity: dimmed ? 0.12 : 0.58,
    color,
    weight: dimmed ? 0.6 : 1.25,
    opacity: dimmed ? 0.25 : 0.95,
  };
}

export function OtbnLeafletMap({
  highlightZona = null,
  provinceFilter = "all",
  className = "",
  interactive = true,
}: Props) {
  const [instance, setInstance] = useState(0);
  const [data, setData] = useState<OtbnCollection | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Key nueva en cada mount (evita "Map container is being reused" con Strict Mode).
  useEffect(() => {
    setInstance((n) => n + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/data/otbn-zonas.geojson")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<OtbnCollection>;
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Error al cargar el mapa");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!data) return null;
    const features = data.features.filter((f) => {
      if (provinceFilter === "all") return true;
      return f.properties.provincia === provinceFilter;
    });
    return { type: "FeatureCollection" as const, features };
  }, [data, provinceFilter]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-black/20 ${className}`}>
        <p className="text-sm opacity-80">No se pudo cargar el mapa ({error}).</p>
      </div>
    );
  }

  if (!filtered || instance === 0) {
    return (
      <div className={`flex items-center justify-center bg-black/10 ${className}`}>
        <p className="text-sm opacity-70" aria-live="polite">
          Cargando mapa OTBN…
        </p>
      </div>
    );
  }

  return (
    <div className={`relative isolate overflow-hidden ${className}`}>
      <MapContainer
        key={`otbn-map-${instance}`}
        center={[-46.5, -71.5]}
        zoom={5}
        className="h-full w-full [&_.leaflet-control-attribution]:text-[10px]"
        scrollWheelZoom={interactive}
        dragging={interactive}
        doubleClickZoom={interactive}
        zoomControl={interactive}
        attributionControl
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds data={filtered} />
        <GeoJSON
          key={`${provinceFilter}-${highlightZona ?? "all"}`}
          data={filtered as GeoJSON.GeoJsonObject}
          style={(feat) =>
            featureStyle(feat as OtbnFeature | undefined, highlightZona)
          }
          onEachFeature={(feature, layer: Layer) => {
            const props = (feature as OtbnFeature).properties;
            if (!props) return;
            layer.bindTooltip(
              `<strong>${props.provincia}</strong><br/>Categoría ${props.zona_codigo} — ${props.zona_nombre}`,
              { sticky: true, opacity: 0.95 },
            );
          }}
        />
      </MapContainer>
    </div>
  );
}
