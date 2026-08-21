"use client";

import { useEffect, useMemo, useState } from "react";
import { GeoJSON, MapContainer, Marker, useMap } from "react-leaflet";
import type { Layer, PathOptions } from "leaflet";
import L from "leaflet";
import { ATLAS_COLORS } from "@/lib/otbnColors";
import {
  BURNED_FILL_OPACITY,
  BURNED_STROKE,
  BURNED_STROKE_WEIGHT,
  burnedColorForHa,
} from "@/lib/burnedColors";
import {
  cumulativeHa,
  maxCumulativeHa,
  monthHa,
  type BurnedCollection,
  type BurnedProperties,
} from "@/lib/burnedMap";
import { formatHa } from "@/lib/format";
import { withBasePath } from "@/lib/paths";

type LandProps = { kind: string; nam: string };
type LandCollection = GeoJSON.FeatureCollection<GeoJSON.Geometry, LandProps>;

type Props = {
  monthIndex: number;
  className?: string;
};

const FIRE_ICON = L.divIcon({
  className: "burned-fire-icon",
  html: "🔥",
  iconSize: [22, 22],
  iconAnchor: [11, 14],
});

function ExtraAttribution() {
  const map = useMap();
  useEffect(() => {
    const text = "CONAE AQD · IGN";
    map.attributionControl?.addAttribution(text);
    return () => {
      map.attributionControl?.removeAttribution(text);
    };
  }, [map]);
  return null;
}

function InvalidateSize() {
  const map = useMap();
  useEffect(() => {
    const container = map.getContainer();
    const refresh = () => map.invalidateSize({ animate: false });
    const id = window.setTimeout(refresh, 80);
    const observer = new ResizeObserver(() => refresh());
    observer.observe(container);
    window.addEventListener("resize", refresh);
    return () => {
      window.clearTimeout(id);
      observer.disconnect();
      window.removeEventListener("resize", refresh);
    };
  }, [map]);
  return null;
}

function FitCamera({ burned }: { burned: BurnedCollection }) {
  const map = useMap();
  useEffect(() => {
    const features = burned.features.filter(
      (f) => f.properties.nam !== "Islas del Atlántico Sur",
    );
    const layer = L.geoJSON({ type: "FeatureCollection", features } as GeoJSON.GeoJsonObject);
    const bounds = layer.getBounds();
    if (!bounds.isValid()) return;
    map.fitBounds(bounds, {
      padding: [36, 36],
      maxZoom: 7,
      animate: false,
    });
  }, [map, burned]);
  return null;
}

function landStyle(feature: GeoJSON.Feature<GeoJSON.Geometry, LandProps> | undefined): PathOptions {
  const isCountry = feature?.properties.kind === "pais";
  return {
    fillColor: isCountry ? ATLAS_COLORS.neighbor : ATLAS_COLORS.land,
    fillOpacity: isCountry ? 0.72 : 1,
    color: ATLAS_COLORS.stroke,
    weight: isCountry ? 0.45 : 0.7,
    opacity: isCountry ? 0.35 : 1,
  };
}

function featureCenter(
  feature: GeoJSON.Feature<GeoJSON.Geometry, BurnedProperties>,
): [number, number] | null {
  const layer = L.geoJSON(feature as GeoJSON.GeoJsonObject);
  const bounds = layer.getBounds();
  if (!bounds.isValid()) return null;
  const center = bounds.getCenter();
  return [center.lat, center.lng];
}

export function BurnedMap({ monthIndex, className = "" }: Props) {
  const [instance, setInstance] = useState(0);
  const [land, setLand] = useState<LandCollection | null>(null);
  const [data, setData] = useState<BurnedCollection | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setInstance((n) => n + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch(withBasePath("/data/atlas-land.geojson")).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<LandCollection>;
      }),
      fetch(withBasePath("/data/atlas-quemado.geojson")).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<BurnedCollection>;
      }),
    ])
      .then(([landJson, burnedJson]) => {
        if (!cancelled) {
          setLand(landJson);
          setData(burnedJson);
        }
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

  const maxHa = useMemo(() => (data ? maxCumulativeHa(data) : 0), [data]);
  const months = data?.months ?? [];
  const safeIndex = Math.min(Math.max(monthIndex, 0), Math.max(months.length - 1, 0));

  const fires = useMemo(() => {
    if (!data) return [];
    return data.features.flatMap((feature) => {
      if (monthHa(feature.properties.ha, months, safeIndex) <= 0) return [];
      const center = featureCenter(feature);
      if (!center) return [];
      return [{ id: feature.properties.in1, center }];
    });
  }, [data, months, safeIndex]);

  const neighborLand = useMemo(() => {
    if (!land) return null;
    return {
      type: "FeatureCollection" as const,
      features: land.features.filter((f) => f.properties.kind === "pais"),
    };
  }, [land]);

  const argentinaLand = useMemo(() => {
    if (!land) return null;
    return {
      type: "FeatureCollection" as const,
      features: land.features.filter((f) => f.properties.kind !== "pais"),
    };
  }, [land]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-[#C9C6C1] text-[#1A1A1A] ${className}`}>
        <p className="text-sm opacity-80">No se pudo cargar el mapa ({error}).</p>
      </div>
    );
  }

  if (!data || !land || !neighborLand || !argentinaLand || instance === 0) {
    return (
      <div className={`flex items-center justify-center bg-[#C9C6C1] text-[#1A1A1A] ${className}`}>
        <p className="text-sm opacity-70" aria-live="polite">
          Cargando hectáreas quemadas…
        </p>
      </div>
    );
  }

  return (
    <div className={`atlas-map relative isolate overflow-hidden ${className}`}>
      <MapContainer
        key={`burned-map-${instance}`}
        center={[-42.5, -66]}
        zoom={4}
        className="h-full w-full [&_.leaflet-control-attribution]:text-[10px] [&_.leaflet-control-attribution]:text-[#1A1A1A]"
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        zoomControl={false}
        boxZoom={false}
        keyboard={false}
        touchZoom={false}
        attributionControl
        zoomSnap={0.25}
      >
        <InvalidateSize />
        <ExtraAttribution />
        <FitCamera burned={data} />
        <GeoJSON
          data={neighborLand as GeoJSON.GeoJsonObject}
          interactive={false}
          style={(feat) =>
            landStyle(feat as GeoJSON.Feature<GeoJSON.Geometry, LandProps>)
          }
        />
        <GeoJSON
          data={argentinaLand as GeoJSON.GeoJsonObject}
          style={(feat) =>
            landStyle(feat as GeoJSON.Feature<GeoJSON.Geometry, LandProps>)
          }
          onEachFeature={(feature, layer) => {
            const nam = (feature as GeoJSON.Feature<GeoJSON.Geometry, LandProps>)
              .properties?.nam;
            if (nam) {
              layer.bindTooltip(nam, {
                sticky: true,
                direction: "right",
                offset: [14, 0],
                opacity: 0.96,
                className: "atlas-tooltip",
              });
            }
          }}
        />
        <GeoJSON
          key={`burned-${safeIndex}`}
          data={data as GeoJSON.GeoJsonObject}
          style={(feat) => {
            const props = (feat as GeoJSON.Feature<GeoJSON.Geometry, BurnedProperties> | undefined)
              ?.properties;
            if (!props) {
              return {
                fillColor: "#FFFFFF",
                fillOpacity: BURNED_FILL_OPACITY,
                color: BURNED_STROKE,
                weight: BURNED_STROKE_WEIGHT,
                opacity: 1,
              } satisfies PathOptions;
            }
            const cum = cumulativeHa(props.ha, months, safeIndex);
            return {
              fillColor: burnedColorForHa(cum, maxHa),
              fillOpacity: BURNED_FILL_OPACITY,
              color: BURNED_STROKE,
              weight: BURNED_STROKE_WEIGHT,
              opacity: 1,
            } satisfies PathOptions;
          }}
          onEachFeature={(feature, layer: Layer) => {
            const props = (feature as GeoJSON.Feature<GeoJSON.Geometry, BurnedProperties>)
              .properties;
            if (!props) return;
            const cum = cumulativeHa(props.ha, months, safeIndex);
            const month = monthHa(props.ha, months, safeIndex);
            layer.bindTooltip(
              `<strong>${props.nam}</strong><br/>${props.provincia}<br/>Este mes: ${formatHa(month)} ha<br/>Acumulado: ${formatHa(cum)} ha`,
              {
                sticky: true,
                direction: "right",
                offset: [14, 0],
                opacity: 0.96,
                className: "atlas-tooltip",
              },
            );
            layer.on("click", (event) => {
              const target = event.originalEvent?.target;
              if (target instanceof HTMLElement || target instanceof SVGElement) {
                target.blur();
              }
            });
          }}
        />
        {fires.map((fire) => (
          <Marker
            key={fire.id}
            position={fire.center}
            icon={FIRE_ICON}
            interactive={false}
            keyboard={false}
          />
        ))}
      </MapContainer>
    </div>
  );
}
