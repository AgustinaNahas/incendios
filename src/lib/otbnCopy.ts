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

export const OTBN_PROVINCE_COPY: Record<
  Exclude<OtbnProvinceFilter, "all">,
  { title: string; body: string }
> = {
  Neuquén: {
    title: "El corazón del bosque andino",
    body: "Tres parques nacionales lo custodian: Lanín, Nahuel Huapi y Los Arrayanes.",
  },
  "Río Negro": {
    title: "La puerta de Nahuel Huapi",
    body: "Bariloche y El Bolsón viven pegados al bosque. El OTBN recorta la franja andina: conservación en altura, uso sustentable hacia los valles.",
  },
  Chubut: {
    title: "Los Alerces y el bosque de Esquel",
    body: "La masa forestal corre por el oeste: alerces milenarios, lenga y ciprés. El ordenamiento concentra la categoría I en los núcleos de mayor valor.",
  },
  "Santa Cruz": {
    title: "La lenga del extremo sur",
    body: "El bosque se estrecha sobre la cordillera. Santa Cruz publica categorías I y II: no hay zona de cambio de uso en su OTBN.",
  },
  "Tierra del Fuego": {
    title: "El bosque más austral",
    body: "Lenga y guindo hasta el canal Beagle. El OTBN cubre la isla grande con un mosaico de conservación y uso sustentable.",
  },
};

export const OTBN_PROVINCE_SLUG: Record<
  Exclude<OtbnProvinceFilter, "all">,
  string
> = {
  Neuquén: "neuquen",
  "Río Negro": "rio-negro",
  Chubut: "chubut",
  "Santa Cruz": "santa-cruz",
  "Tierra del Fuego": "tierra-del-fuego",
};

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
