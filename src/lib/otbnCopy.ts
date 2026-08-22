import type { OtbnZona } from "@/lib/otbnColors";

export const OTBN_ZONA_COPY: Record<
  OtbnZona,
  { code: string; title: string; body: string }
> = {
  1: {
    code: "I",
    title: "Conservación",
    body: "Sectores de alto valor de conservación. No se permite el aprovechamiento forestal ni el cambio de uso del suelo: el bosque queda como infraestructura ecológica.",
  },
  2: {
    code: "II",
    title: "Uso sustentable",
    body: "Bosques donde sí hay usos productivos y recreativos, pero bajo planes de manejo. Es el territorio donde la prevención de incendios y el manejo de combustible pesan más.",
  },
  3: {
    code: "III",
    title: "Cambio de uso",
    body: "Áreas donde, con evaluación de impacto ambiental, se puede autorizar desmonte parcial. En Patagonia es la franja más sensible a la expansión urbana y productiva.",
  },
};

export type OtbnProvinceFilter =
  | "all"
  | "Neuquén"
  | "Río Negro"
  | "Chubut"
  | "Santa Cruz"
  | "Tierra del Fuego";

export const OTBN_PROVINCES: Exclude<OtbnProvinceFilter, "all">[] = [
  "Neuquén",
  "Río Negro",
  "Chubut",
  "Santa Cruz",
  "Tierra del Fuego",
];

export type OtbnProperties = {
  zona: number;
  zona_codigo: string;
  zona_nombre: string;
  provincia: string;
};

export type OtbnFeature = GeoJSON.Feature<
  GeoJSON.MultiPolygon | GeoJSON.Polygon,
  OtbnProperties
>;

export type OtbnCollection = GeoJSON.FeatureCollection<
  GeoJSON.MultiPolygon | GeoJSON.Polygon,
  OtbnProperties
>;
