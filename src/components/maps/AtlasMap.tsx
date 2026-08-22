"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { CircleMarker, GeoJSON, MapContainer, useMap } from "react-leaflet";
import type { Layer, PathOptions } from "leaflet";
import L from "leaflet";
import { ATLAS_COLORS, otbnColor } from "@/lib/otbnColors";
import {
  atlasStepById,
  type AtlasFitTarget,
  type AtlasStepId,
} from "@/lib/atlasSteps";
import { withBasePath } from "@/lib/paths";
import type {
  OtbnCollection,
  OtbnFeature,
  OtbnProvinceFilter,
} from "@/lib/otbnCopy";

type FC<P> = GeoJSON.FeatureCollection<GeoJSON.Geometry, P>;

type LandProps = { kind: string; nam: string };
type EcoProps = { ecorregion: string };
type ProvProps = { nam: string; label_lon?: number; label_lat?: number };
type CityProps = { nam: string; provincia?: string; fna?: string };
type BosqueProps = { nam: string };

type AtlasData = {
  land: FC<LandProps>;
  ecoregion: FC<EcoProps>;
  provincias: FC<ProvProps>;
  bosque: FC<BosqueProps>;
  ciudades: FC<CityProps>;
  otbn: OtbnCollection;
};

type Props = {
  step?: AtlasStepId;
  provinceFilter?: OtbnProvinceFilter;
  highlightZona?: number | null;
  className?: string;
  interactive?: boolean;
  explorer?: boolean;
};

const PATHS = {
  land: "/data/atlas-land.geojson",
  ecoregion: "/data/atlas-ecoregion-bosques.geojson",
  provincias: "/data/atlas-provincias.geojson",
  bosque: "/data/atlas-bosque-fill.geojson",
  ciudades: "/data/atlas-ciudades.geojson",
  otbn: "/data/otbn-zonas.geojson",
} as const;

const FIT_MAX_ZOOM: Record<AtlasFitTarget, number> = {
  argentina: 5,
  ecoregion: 6.5,
  provincias: 7,
};

function fetchJson<T>(path: string): Promise<T> {
  return fetch(withBasePath(path)).then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status} ${path}`);
    return res.json() as Promise<T>;
  });
}

function collectionBounds(data: GeoJSON.FeatureCollection): L.LatLngBounds | null {
  const layer = L.geoJSON(data as GeoJSON.GeoJsonObject);
  const bounds = layer.getBounds();
  return bounds.isValid() ? bounds : null;
}

const HATCH_PATTERN_ID = "atlas-hatch-coral";

function ExtraAttribution() {
  const map = useMap();
  useEffect(() => {
    const text = "IGN · ecorregiones · OTBN provinciales";
    map.attributionControl?.addAttribution(text);
    return () => {
      map.attributionControl?.removeAttribution(text);
    };
  }, [map]);
  return null;
}

function CoralHatchPattern() {
  const map = useMap();

  useLayoutEffect(() => {
    const ns = "http://www.w3.org/2000/svg";

    const inject = () => {
      const svgs = map.getPanes().overlayPane.querySelectorAll("svg");
      svgs.forEach((svg) => {
        if (svg.querySelector(`#${HATCH_PATTERN_ID}`)) return;
        let defs = svg.querySelector("defs");
        if (!defs) {
          defs = document.createElementNS(ns, "defs");
          svg.insertBefore(defs, svg.firstChild);
        }
        const pattern = document.createElementNS(ns, "pattern");
        pattern.setAttribute("id", HATCH_PATTERN_ID);
        pattern.setAttribute("patternUnits", "userSpaceOnUse");
        pattern.setAttribute("width", "7");
        pattern.setAttribute("height", "7");
        pattern.setAttribute("patternTransform", "rotate(-38)");
        const line = document.createElementNS(ns, "line");
        line.setAttribute("x1", "0");
        line.setAttribute("y1", "0");
        line.setAttribute("x2", "0");
        line.setAttribute("y2", "7");
        line.setAttribute("stroke", ATLAS_COLORS.coral);
        line.setAttribute("stroke-width", "1.4");
        pattern.appendChild(line);
        defs.appendChild(pattern);
      });
    };

    inject();
    const observer = new MutationObserver(inject);
    observer.observe(map.getPanes().overlayPane, { childList: true });
    return () => observer.disconnect();
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

function FitCamera({
  data,
  target,
  provinceFilter,
  explorer,
}: {
  data: AtlasData;
  target: AtlasFitTarget;
  provinceFilter: OtbnProvinceFilter;
  explorer: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let bounds: L.LatLngBounds | null = null;

    if (explorer && provinceFilter !== "all") {
      const features = data.provincias.features.filter(
        (f) => f.properties.nam === provinceFilter,
      );
      bounds = collectionBounds({ type: "FeatureCollection", features });
    } else if (target === "argentina") {
      const features = data.land.features.filter((f) => f.properties.kind === "provincia");
      bounds = collectionBounds({ type: "FeatureCollection", features });
    } else if (target === "ecoregion") {
      bounds = collectionBounds(data.ecoregion);
    } else {
      bounds = collectionBounds(data.provincias);
    }

    if (!bounds) return;
    map.fitBounds(bounds, {
      padding: [36, 36],
      maxZoom: explorer && provinceFilter !== "all" ? 8 : FIT_MAX_ZOOM[target],
      animate: !reduce,
      duration: 0.85,
    });
  }, [map, data, target, provinceFilter, explorer]);

  return null;
}

function AtlasLabels({
  provincias,
  showProvinces,
  showCities,
  ciudades,
}: {
  provincias: FC<ProvProps>;
  ciudades: FC<CityProps>;
  showProvinces: boolean;
  showCities: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    const markers: L.Marker[] = [];

    if (showProvinces) {
      for (const feature of provincias.features) {
        const { nam, label_lon, label_lat } = feature.properties;
        if (label_lon == null || label_lat == null) continue;
        markers.push(
          L.marker([label_lat, label_lon], {
            icon: L.divIcon({
              className: "atlas-label atlas-label-prov",
              html: `<span>${nam}</span>`,
              iconSize: [0, 0],
            }),
            interactive: false,
            zIndexOffset: 400,
          }).addTo(map),
        );
      }
    }

    if (showCities) {
      for (const feature of ciudades.features) {
        const geom = feature.geometry;
        if (geom.type !== "Point") continue;
        const [lon, lat] = geom.coordinates;
        markers.push(
          L.marker([lat, lon], {
            icon: L.divIcon({
              className: "atlas-label atlas-label-city",
              html: `<span>${feature.properties.nam}</span>`,
              iconSize: [0, 0],
              iconAnchor: [-8, 6],
            }),
            interactive: false,
            zIndexOffset: 500,
          }).addTo(map),
        );
      }
    }

    return () => {
      for (const marker of markers) marker.remove();
    };
  }, [map, provincias, ciudades, showProvinces, showCities]);

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

function coralFillStyle(): PathOptions {
  return {
    fillColor: ATLAS_COLORS.coral,
    fillOpacity: 0.55,
    color: ATLAS_COLORS.coral,
    weight: 0.8,
    opacity: 0.9,
  };
}

function provinceOutlineStyle(coral: boolean): PathOptions {
  return {
    fill: false,
    color: coral ? ATLAS_COLORS.coral : ATLAS_COLORS.stroke,
    weight: coral ? 1.7 : 1.35,
    opacity: 1,
  };
}

function provinceHatchStyle(): PathOptions {
  return {
    fillColor: `url(#${HATCH_PATTERN_ID})`,
    fillOpacity: 1,
    color: ATLAS_COLORS.coral,
    weight: 0,
    opacity: 0,
  };
}

function ecoregionOutlineStyle(): PathOptions {
  return {
    fill: false,
    color: ATLAS_COLORS.coral,
    weight: 2,
    opacity: 1,
  };
}

function otbnStyle(
  feature: OtbnFeature | undefined,
  otbnMax: number,
  highlightZona: number | null,
  provinceFilter: OtbnProvinceFilter,
): PathOptions {
  const zona = feature?.properties.zona ?? 0;
  const provincia = feature?.properties.provincia;
  if (provinceFilter !== "all" && provincia !== provinceFilter) {
    return { fillOpacity: 0, opacity: 0, weight: 0 };
  }
  if (zona > otbnMax) {
    return { fillOpacity: 0, opacity: 0, weight: 0 };
  }
  const color = otbnColor(zona);
  const dimmed = highlightZona != null && highlightZona !== zona;
  return {
    fillColor: color,
    fillOpacity: dimmed ? 0.12 : 0.62,
    color,
    weight: dimmed ? 0.5 : 1.1,
    opacity: dimmed ? 0.25 : 0.95,
  };
}

function bindTooltip(layer: Layer, html: string) {
  layer.bindTooltip(html, {
    sticky: true,
    direction: "right",
    offset: [14, 0],
    opacity: 0.96,
    className: "atlas-tooltip",
  });
  layer.on("click", (event) => {
    const target = event.originalEvent?.target;
    if (target instanceof HTMLElement || target instanceof SVGElement) {
      target.blur();
    }
  });
}

export function AtlasMap({
  step = "otbn-3",
  provinceFilter = "all",
  highlightZona = null,
  className = "",
  interactive = false,
  explorer = false,
}: Props) {
  const [instance, setInstance] = useState(0);
  const [data, setData] = useState<AtlasData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const config = atlasStepById(step);
  const otbnMax = explorer ? 3 : config.otbnMax;
  const showEcoregion = explorer ? false : config.showEcoregion;
  const showEcoregionOutline = explorer ? true : config.showEcoregionOutline;
  const showBosqueFill = explorer ? false : config.showBosqueFill;
  const showProvinces = explorer ? true : config.showProvinces;
  const showProvinceHatch = explorer ? false : config.showProvinceHatch;
  const showCities = explorer ? true : config.showCities;
  const fit = explorer ? "provincias" : config.fit;

  useEffect(() => {
    setInstance((n) => n + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetchJson<FC<LandProps>>(PATHS.land),
      fetchJson<FC<EcoProps>>(PATHS.ecoregion),
      fetchJson<FC<ProvProps>>(PATHS.provincias),
      fetchJson<FC<BosqueProps>>(PATHS.bosque),
      fetchJson<FC<CityProps>>(PATHS.ciudades),
      fetchJson<OtbnCollection>(PATHS.otbn),
    ])
      .then(([land, ecoregion, provincias, bosque, ciudades, otbn]) => {
        if (!cancelled) {
          setData({ land, ecoregion, provincias, bosque, ciudades, otbn });
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Error al cargar el atlas");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-[#C9C6C1] text-[#1A1A1A] ${className}`}>
        <p className="text-sm opacity-80">No se pudo cargar el mapa ({error}).</p>
      </div>
    );
  }

  if (!data || instance === 0) {
    return (
      <div className={`flex items-center justify-center bg-[#C9C6C1] text-[#1A1A1A] ${className}`}>
        <p className="text-sm opacity-70" aria-live="polite">
          Cargando atlas…
        </p>
      </div>
    );
  }

  return (
    <div className={`atlas-map relative isolate overflow-hidden ${className}`}>
      <svg aria-hidden className="pointer-events-none absolute h-0 w-0 overflow-hidden">
        <defs>
          <pattern
            id={HATCH_PATTERN_ID}
            patternUnits="userSpaceOnUse"
            width="7"
            height="7"
            patternTransform="rotate(-38)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="7"
              stroke={ATLAS_COLORS.coral}
              strokeWidth="1.4"
            />
          </pattern>
        </defs>
      </svg>
      <MapContainer
        key={`atlas-map-${instance}`}
        center={[-42.5, -66]}
        zoom={4}
        className="h-full w-full [&_.leaflet-control-attribution]:text-[10px] [&_.leaflet-control-attribution]:text-[#1A1A1A]"
        scrollWheelZoom={interactive}
        dragging={interactive}
        doubleClickZoom={interactive}
        zoomControl={interactive}
        boxZoom={interactive}
        keyboard={interactive}
        touchZoom={interactive}
        attributionControl
        zoomSnap={0.25}
      >
        <InvalidateSize />
        <ExtraAttribution />
        <CoralHatchPattern />
        <FitCamera
          data={data}
          target={fit}
          provinceFilter={provinceFilter}
          explorer={explorer}
        />
        <GeoJSON
          data={
            {
              type: "FeatureCollection",
              features: data.land.features.filter((f) => f.properties.kind === "pais"),
            } as GeoJSON.GeoJsonObject
          }
          interactive={false}
          style={(feat) =>
            landStyle(feat as GeoJSON.Feature<GeoJSON.Geometry, LandProps>)
          }
        />
        <GeoJSON
          data={
            {
              type: "FeatureCollection",
              features: data.land.features.filter((f) => f.properties.kind !== "pais"),
            } as GeoJSON.GeoJsonObject
          }
          style={(feat) =>
            landStyle(feat as GeoJSON.Feature<GeoJSON.Geometry, LandProps>)
          }
          onEachFeature={(feature, layer) => {
            const nam = (feature as GeoJSON.Feature<GeoJSON.Geometry, LandProps>)
              .properties?.nam;
            if (nam) bindTooltip(layer, nam);
          }}
        />
        {showProvinceHatch ? (
          <GeoJSON
            data={data.provincias as GeoJSON.GeoJsonObject}
            style={() => provinceHatchStyle()}
            interactive={false}
          />
        ) : null}
        {showEcoregion ? (
          <GeoJSON
            data={data.ecoregion as GeoJSON.GeoJsonObject}
            style={() => coralFillStyle()}
            onEachFeature={(_feature, layer) => {
              bindTooltip(layer, "<strong>Bosques Patagónicos</strong>");
            }}
          />
        ) : null}
        {showBosqueFill ? (
          <GeoJSON
            data={data.bosque as GeoJSON.GeoJsonObject}
            style={() => coralFillStyle()}
            onEachFeature={(_feature, layer) => {
              bindTooltip(layer, "<strong>Bosques Patagónicos</strong>");
            }}
          />
        ) : null}
        {otbnMax > 0 ? (
          <GeoJSON
            key={`otbn-${otbnMax}-${highlightZona ?? "all"}-${provinceFilter}`}
            data={data.otbn as GeoJSON.GeoJsonObject}
            style={(feat) =>
              otbnStyle(
                feat as OtbnFeature | undefined,
                otbnMax,
                highlightZona,
                provinceFilter,
              )
            }
            onEachFeature={(feature, layer) => {
              const props = (feature as OtbnFeature).properties;
              if (!props) return;
              bindTooltip(
                layer,
                `<strong>${props.provincia}</strong><br/>Categoría ${props.zona_codigo} — ${props.zona_nombre}`,
              );
            }}
          />
        ) : null}
        {showEcoregionOutline ? (
          <GeoJSON
            data={data.ecoregion as GeoJSON.GeoJsonObject}
            style={() => ecoregionOutlineStyle()}
            interactive={false}
          />
        ) : null}
        {showProvinces ? (
          <GeoJSON
            data={data.provincias as GeoJSON.GeoJsonObject}
            style={() => provinceOutlineStyle(showProvinceHatch)}
            interactive={false}
          />
        ) : null}
        {showCities
          ? data.ciudades.features.map((feature) => {
              if (feature.geometry.type !== "Point") return null;
              const [lon, lat] = feature.geometry.coordinates;
              return (
                <CircleMarker
                  key={feature.properties.nam}
                  center={[lat, lon]}
                  radius={3.5}
                  pathOptions={{
                    color: ATLAS_COLORS.stroke,
                    weight: 1,
                    fillColor: ATLAS_COLORS.land,
                    fillOpacity: 1,
                    interactive: false,
                  }}
                />
              );
            })
          : null}
        <AtlasLabels
          provincias={data.provincias}
          ciudades={data.ciudades}
          showProvinces={showProvinces}
          showCities={showCities}
        />
      </MapContainer>
    </div>
  );
}
