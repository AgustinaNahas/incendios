"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { ATLAS_COLORS, OTBN_COLORS } from "@/lib/otbnColors";
import { atlasStepById, type AtlasFitTarget, type AtlasOtbnPaint, type AtlasStepId } from "@/lib/atlasSteps";
import {
  MAPBOX_STYLE,
  MAPBOX_TOKEN,
  MAP_ARGENTINA_COLOR,
  MAP_WATER_COLOR,
  MAP_WORLD_COLOR,
} from "@/lib/mapbox";
import { withBasePath } from "@/lib/paths";
import type { OtbnCollection, OtbnProvinceFilter } from "@/lib/otbnCopy";
import { OTBN_PROVINCES } from "@/lib/otbnCopy";

type FC<P> = GeoJSON.FeatureCollection<GeoJSON.Geometry, P>;
type LandProps = { kind: string; nam: string };
type ProvProps = { nam: string; label_lon?: number; label_lat?: number };
type EcoProps = { ecorregion?: string };

type AtlasData = {
  land: FC<LandProps>;
  ecoregion: FC<EcoProps>;
  provincias: FC<ProvProps>;
  bosque: FC<Record<string, unknown>>;
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
  otbn: "/data/otbn-zonas.geojson",
} as const;

const SRC = {
  land: "atlas-land",
  provincias: "atlas-provincias",
  bosque: "atlas-bosque",
  otbn: "atlas-otbn",
  labels: "atlas-labels",
} as const;

const LYR = {
  land: "atlas-land-fill",
  landLine: "atlas-land-line",
  patagoniaFill: "atlas-patagonia-fill",
  provinciasFill: "atlas-provincias-fill",
  provinciasLine: "atlas-provincias-line",
  bosque: "atlas-bosque-fill",
  otbn: "atlas-otbn-fill",
  otbnLine: "atlas-otbn-line",
  labels: "atlas-labels",
} as const;

/** El fill detallado de las 5 sale de atlas-provincias; acá no las repetimos. */
const LAND_SKIP = [
  ...OTBN_PROVINCES,
  "Tierra del Fuego, Antártida e Islas del Atlántico Sur",
];

const LAND_FILTER: mapboxgl.FilterSpecification = [
  "all",
  ["==", ["get", "kind"], "provincia"],
  ["!", ["in", ["get", "nam"], ["literal", LAND_SKIP]]],
];

function fetchJson<T>(path: string): Promise<T> {
  return fetch(withBasePath(path)).then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status} ${path}`);
    return res.json() as Promise<T>;
  });
}

function extendCoords(bounds: mapboxgl.LngLatBounds, coords: unknown): void {
  if (!Array.isArray(coords)) return;
  if (
    coords.length >= 2 &&
    typeof coords[0] === "number" &&
    typeof coords[1] === "number"
  ) {
    bounds.extend([coords[0], coords[1]]);
    return;
  }
  for (const child of coords) extendCoords(bounds, child);
}

function collectionBounds(
  data: GeoJSON.FeatureCollection,
): mapboxgl.LngLatBounds | null {
  const bounds = new mapboxgl.LngLatBounds();
  for (const feature of data.features) {
    if (!feature.geometry || feature.geometry.type === "GeometryCollection") continue;
    extendCoords(bounds, feature.geometry.coordinates);
  }
  return bounds.isEmpty() ? null : bounds;
}

function labelCollection(provincias: FC<ProvProps>): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: provincias.features.flatMap((feature) => {
      const { nam, label_lon, label_lat } = feature.properties;
      if (label_lon == null || label_lat == null) return [];
      return [
        {
          type: "Feature" as const,
          properties: { nam },
          geometry: {
            type: "Point" as const,
            coordinates: [label_lon, label_lat],
          },
        },
      ];
    }),
  };
}

function applyPlanarProjection(map: mapboxgl.Map) {
  try {
    map.setProjection({ name: "mercator" });
  } catch {
    map.setProjection("mercator");
  }
  try {
    map.setFog(null);
  } catch {
    /* algunos estilos no tienen fog */
  }
  map.setPitch(0);
  map.setBearing(0);
}

function blendBasemap(map: mapboxgl.Map) {
  map.getCanvas().style.background = MAP_WATER_COLOR;
  applyPlanarProjection(map);
  const style = map.getStyle();
  for (const layer of style?.layers ?? []) {
    const id = layer.id;
    if (id.startsWith("atlas-")) continue;
    try {
      if (layer.type === "background") {
        map.setPaintProperty(id, "background-color", MAP_WORLD_COLOR);
      }
      if (layer.type === "hillshade") {
        map.setLayoutProperty(id, "visibility", "none");
      }
      if (layer.type === "fill") {
        if (/(^|-)water/.test(id) && !/shadow/.test(id)) {
          map.setPaintProperty(id, "fill-color", MAP_WATER_COLOR);
          try {
            map.setPaintProperty(id, "fill-opacity", 1);
          } catch {
            /* */
          }
        } else {
          map.setPaintProperty(id, "fill-color", MAP_WORLD_COLOR);
        }
      }
      if (layer.type === "line") {
        if (/(^|-)water/.test(id) && !/shadow/.test(id)) {
          map.setPaintProperty(id, "line-color", MAP_WATER_COLOR);
        } else {
          map.setLayoutProperty(id, "visibility", "none");
        }
      }
      if (layer.type === "symbol") {
        map.setLayoutProperty(id, "visibility", "none");
      }
    } catch {
      /* layer paint differs by style version */
    }
  }
}

function firstSymbolLayerId(map: mapboxgl.Map): string | undefined {
  const layers = map.getStyle()?.layers ?? [];
  return layers.find((layer) => layer.type === "symbol")?.id;
}

function setLayerVisibility(map: mapboxgl.Map, id: string, visible: boolean) {
  if (!map.getLayer(id)) return;
  map.setLayoutProperty(id, "visibility", visible ? "visible" : "none");
}

function otbnFilter(
  province: OtbnProvinceFilter,
): mapboxgl.FilterSpecification {
  if (province === "all") return ["has", "zona"];
  return ["==", ["get", "provincia"], province];
}

function otbnFillColor(paint: AtlasOtbnPaint): mapboxgl.ExpressionSpecification | string {
  if (paint === "forest") return ATLAS_COLORS.forest;
  return [
    "match",
    ["get", "zona"],
    1,
    OTBN_COLORS[1],
    2,
    OTBN_COLORS[2],
    3,
    OTBN_COLORS[3],
    "#888888",
  ];
}

function otbnFillOpacity(
  highlightZona: number | null,
): number | mapboxgl.ExpressionSpecification {
  if (highlightZona == null) return 0.82;
  return ["case", ["==", ["get", "zona"], highlightZona], 0.92, 0.07];
}

function otbnLineOpacity(
  highlightZona: number | null,
): number | mapboxgl.ExpressionSpecification {
  if (highlightZona == null) return 0.85;
  return ["case", ["==", ["get", "zona"], highlightZona], 0.95, 0.12];
}

function addOverlayLayers(map: mapboxgl.Map, data: AtlasData) {
  const before = firstSymbolLayerId(map);
  map.addSource(SRC.land, { type: "geojson", data: data.land });
  map.addSource(SRC.provincias, { type: "geojson", data: data.provincias });
  map.addSource(SRC.bosque, { type: "geojson", data: data.bosque });
  map.addSource(SRC.otbn, { type: "geojson", data: data.otbn });
  map.addSource(SRC.labels, { type: "geojson", data: labelCollection(data.provincias) });

  map.addLayer(
    {
      id: LYR.land,
      type: "fill",
      source: SRC.land,
      filter: LAND_FILTER,
      paint: {
        "fill-color": MAP_ARGENTINA_COLOR,
        "fill-opacity": 1,
      },
    },
    before,
  );
  map.addLayer(
    {
      id: LYR.landLine,
      type: "line",
      source: SRC.land,
      filter: [
        "all",
        ["==", ["get", "kind"], "provincia"],
        ["!", ["in", ["get", "nam"], ["literal", LAND_SKIP]]],
      ],
      paint: {
        "line-color": "#cfcbc3",
        "line-width": 1.15,
        "line-opacity": 0.7,
      },
    },
    before,
  );
  map.addLayer(
    {
      id: LYR.patagoniaFill,
      type: "fill",
      source: SRC.provincias,
      paint: {
        "fill-color": MAP_ARGENTINA_COLOR,
        "fill-opacity": 1,
      },
    },
    before,
  );
  map.addLayer(
    {
      id: LYR.provinciasFill,
      type: "fill",
      source: SRC.provincias,
      paint: {
        "fill-color": ATLAS_COLORS.provinceFill,
        "fill-opacity": 0.22,
        "fill-opacity-transition": { duration: 500 },
      },
    },
    before,
  );
  map.addLayer(
    {
      id: LYR.bosque,
      type: "fill",
      source: SRC.bosque,
      paint: {
        "fill-color": ATLAS_COLORS.forest,
        "fill-opacity": 0.82,
        "fill-opacity-transition": { duration: 500 },
      },
    },
    before,
  );
  map.addLayer(
    {
      id: LYR.otbn,
      type: "fill",
      source: SRC.otbn,
      paint: {
        "fill-color": otbnFillColor("zones"),
        "fill-opacity": 0.82,
        "fill-opacity-transition": { duration: 420 },
      },
    },
    before,
  );
  map.addLayer(
    {
      id: LYR.otbnLine,
      type: "line",
      source: SRC.otbn,
      paint: {
        "line-color": otbnFillColor("zones"),
        "line-width": 0.7,
        "line-opacity": 0.85,
        "line-opacity-transition": { duration: 420 },
      },
    },
    before,
  );
  map.addLayer(
    {
      id: LYR.provinciasLine,
      type: "line",
      source: SRC.provincias,
      paint: {
        "line-color": "#cfcbc3",
        "line-width": 1.15,
        "line-opacity": 0.7,
      },
    },
    before,
  );
  try {
    map.addLayer({
      id: LYR.labels,
      type: "symbol",
      source: SRC.labels,
      layout: {
        "text-field": ["get", "nam"],
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Regular"],
        "text-size": 12,
        "text-transform": "uppercase",
        "text-letter-spacing": 0.08,
        "text-allow-overlap": true,
      },
      paint: {
        "text-color": "#d8d4cc",
        "text-halo-color": MAP_ARGENTINA_COLOR,
        "text-halo-width": 1.1,
      },
    });
  } catch {
    map.addLayer({
      id: LYR.labels,
      type: "symbol",
      source: SRC.labels,
      layout: {
        "text-field": ["get", "nam"],
        "text-size": 12,
        "text-transform": "uppercase",
        "text-allow-overlap": true,
      },
      paint: {
        "text-color": "#d8d4cc",
        "text-halo-color": MAP_ARGENTINA_COLOR,
        "text-halo-width": 1.1,
      },
    });
  }
}

function applyPaint(
  map: mapboxgl.Map,
  opts: {
    paint: AtlasOtbnPaint;
    showBosque: boolean;
    showProvinceFill: boolean;
    showLabels: boolean;
    province: OtbnProvinceFilter;
    highlightZona: number | null;
  },
) {
  setLayerVisibility(map, LYR.provinciasFill, opts.showProvinceFill);
  setLayerVisibility(map, LYR.bosque, opts.showBosque);
  if (map.getLayer(LYR.bosque)) {
    map.setPaintProperty(LYR.bosque, "fill-opacity", opts.showBosque ? 0.82 : 0);
  }
  const showOtbn = opts.paint !== "off";
  setLayerVisibility(map, LYR.otbn, showOtbn);
  setLayerVisibility(map, LYR.otbnLine, showOtbn);
  setLayerVisibility(map, LYR.labels, opts.showLabels);

  if (!showOtbn || !map.getLayer(LYR.otbn)) return;
  map.setFilter(LYR.otbn, otbnFilter(opts.province));
  map.setFilter(LYR.otbnLine, otbnFilter(opts.province));
  map.setPaintProperty(LYR.otbn, "fill-color", otbnFillColor(opts.paint));
  map.setPaintProperty(LYR.otbn, "fill-opacity", otbnFillOpacity(opts.highlightZona));
  map.setPaintProperty(LYR.otbnLine, "line-color", otbnFillColor(opts.paint));
  map.setPaintProperty(
    LYR.otbnLine,
    "line-opacity",
    otbnLineOpacity(opts.highlightZona),
  );
}

function cameraPadding(
  map: mapboxgl.Map,
  opts: { fit: AtlasFitTarget; offsetLeft: boolean },
): mapboxgl.PaddingOptions {
  const width = map.getContainer().clientWidth;
  const height = map.getContainer().clientHeight;
  const desktop = width >= 1024;
  const top = opts.fit === "province" ? 72 : opts.fit === "patagonia" ? 56 : 48;
  const bottom = opts.fit === "province" ? 96 : opts.fit === "patagonia" ? 88 : 72;
  const right = desktop ? 56 : 28;
  const left = opts.offsetLeft
    ? Math.round(width * (desktop ? 0.5 : 0.08))
    : desktop
      ? 56
      : 28;
  return {
    top: Math.min(top, Math.floor(height * 0.14)),
    right,
    bottom: Math.min(bottom, Math.max(48, height - top - 140)),
    left: Math.min(left, Math.max(24, width - right - 140)),
  };
}

function applyCamera(
  map: mapboxgl.Map,
  data: AtlasData,
  opts: {
    province: OtbnProvinceFilter;
    fit: AtlasFitTarget;
    offsetLeft: boolean;
    animate?: boolean;
  },
) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let bounds: mapboxgl.LngLatBounds | null = null;
  if (opts.fit === "province" && opts.province !== "all") {
    const otbnFeatures = data.otbn.features.filter(
      (feature) => feature.properties.provincia === opts.province,
    );
    bounds = collectionBounds({
      type: "FeatureCollection",
      features: otbnFeatures,
    });
    if (!bounds) {
      const features = data.provincias.features.filter(
        (feature) => feature.properties.nam === opts.province,
      );
      bounds = collectionBounds({ type: "FeatureCollection", features });
    }
  } else if (opts.fit === "patagonia") {
    bounds = collectionBounds(data.provincias);
  } else {
    const features = data.land.features.filter(
      (feature) => feature.properties.kind === "provincia",
    );
    bounds = collectionBounds({ type: "FeatureCollection", features });
  }
  if (!bounds) return;
  map.stop();
  map.fitBounds(bounds, {
    padding: cameraPadding(map, opts),
    maxZoom: opts.fit === "province" ? 8.5 : opts.fit === "patagonia" ? 5.6 : 4.4,
    duration: opts.animate === false || reduce ? 0 : 1200,
    essential: true,
  });
}

export function AtlasMap({
  step = "categorias",
  provinceFilter = "all",
  highlightZona = null,
  className = "",
  interactive = false,
  explorer = false,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const dataRef = useRef<AtlasData | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const config = atlasStepById(step);
  const paint: AtlasOtbnPaint = explorer ? "zones" : config.otbnPaint;
  const showBosque = explorer ? false : config.showBosque;
  const showProvinceFill = explorer ? false : config.showProvinceFill;
  const showLabels = explorer ? true : config.showLabels;
  const province = explorer ? provinceFilter : config.province;
  const fit = explorer
    ? provinceFilter === "all"
      ? "patagonia"
      : "province"
    : config.fit;
  const offsetLeft = !explorer;
  const viewRef = useRef({
    paint,
    showBosque,
    showProvinceFill,
    showLabels,
    province,
    highlightZona,
    fit,
    offsetLeft,
  });
  viewRef.current = {
    paint,
    showBosque,
    showProvinceFill,
    showLabels,
    province,
    highlightZona,
    fit,
    offsetLeft,
  };

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetchJson<FC<LandProps>>(PATHS.land),
      fetchJson<FC<EcoProps>>(PATHS.ecoregion),
      fetchJson<FC<ProvProps>>(PATHS.provincias),
      fetchJson<FC<Record<string, unknown>>>(PATHS.bosque),
      fetchJson<OtbnCollection>(PATHS.otbn),
    ])
      .then(([land, ecoregion, provincias, bosque, otbn]) => {
        if (!cancelled) {
          dataRef.current = { land, ecoregion, provincias, bosque, otbn };
          setReady(true);
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

  useEffect(() => {
    if (!ready || !containerRef.current || mapRef.current) return;
    const data = dataRef.current;
    if (!data) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLE,
      center: [-64.5, -40],
      zoom: 3.6,
      pitch: 0,
      bearing: 0,
      maxPitch: 0,
      attributionControl: true,
      fadeDuration: 0,
      logoPosition: "bottom-left",
      scrollZoom: false,
      projection: { name: "mercator" },
    });
    mapRef.current = map;
    map.scrollZoom.disable();
    applyPlanarProjection(map);

    if (interactive) {
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
    } else {
      map.dragPan.disable();
      map.boxZoom.disable();
      map.dragRotate.disable();
      map.keyboard.disable();
      map.doubleClickZoom.disable();
      map.touchZoomRotate.disable();
    }

    const onLoad = () => {
      map.scrollZoom.disable();
      applyPlanarProjection(map);
      blendBasemap(map);
      addOverlayLayers(map, data);
      applyPaint(map, viewRef.current);
      applyCamera(map, data, viewRef.current);
    };
    const onStyleLoad = () => {
      applyPlanarProjection(map);
      blendBasemap(map);
    };
    map.on("load", onLoad);
    map.on("style.load", onStyleLoad);

    let lastWidth = 0;
    const resize = () => {
      if (!mapRef.current) return;
      try {
        map.resize();
      } catch {
        return;
      }
      const width = map.getContainer().clientWidth;
      if (lastWidth === 0) {
        lastWidth = width;
        return;
      }
      if (width === lastWidth) return;
      lastWidth = width;
      const loaded = dataRef.current;
      if (loaded && map.getSource(SRC.provincias)) {
        applyCamera(map, loaded, { ...viewRef.current, animate: false });
      }
    };
    const observer = new ResizeObserver(() => {
      window.requestAnimationFrame(resize);
    });
    observer.observe(containerRef.current);
    const t = window.setTimeout(resize, 80);

    return () => {
      window.clearTimeout(t);
      observer.disconnect();
      map.off("load", onLoad);
      map.off("style.load", onStyleLoad);
      map.remove();
      mapRef.current = null;
    };
    // Mount once; later updates go through the view effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.getStyle() || !map.getLayer(LYR.otbn)) return;
    applyPaint(map, {
      paint,
      showBosque,
      showProvinceFill,
      showLabels,
      province,
      highlightZona,
    });
  }, [paint, showBosque, showProvinceFill, showLabels, province, highlightZona]);

  useEffect(() => {
    const map = mapRef.current;
    const data = dataRef.current;
    if (!map || !data) return;
    let cancelled = false;
    const run = () => {
      if (cancelled || !map.getStyle() || !map.getSource(SRC.provincias)) return;
      applyCamera(map, data, { province, fit, offsetLeft });
    };
    if (map.isStyleLoaded() && map.getSource(SRC.provincias)) {
      run();
      return () => {
        cancelled = true;
      };
    }
    map.once("idle", run);
    return () => {
      cancelled = true;
      try {
        map.off("idle", run);
      } catch {
        /* el mapa ya se desmontó */
      }
    };
  }, [province, fit, offsetLeft]);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-[#2B2B2B] text-[#f3efe8] ${className}`}
      >
        <p className="text-sm opacity-80">No se pudo cargar el mapa ({error}).</p>
      </div>
    );
  }

  return (
    <div
      className={`otbn-mapbox relative isolate h-full w-full ${
        interactive ? "" : "pointer-events-none"
      } ${className}`}
    >
      {!ready ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#2B2B2B] text-sm text-[#f3efe8]/70">
          Cargando mapa…
        </div>
      ) : null}
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
