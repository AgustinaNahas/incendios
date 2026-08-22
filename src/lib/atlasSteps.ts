import { OTBN_ZONA_COPY } from "@/lib/otbnCopy";

export type AtlasStepId =
  | "argentina"
  | "provincias"
  | "ecoregion"
  | "otbn-1"
  | "otbn-2"
  | "otbn-3";

export type AtlasFitTarget = "argentina" | "ecoregion" | "provincias";

export type AtlasStep = {
  id: AtlasStepId;
  kicker: string;
  title: string;
  body: string;
  fit: AtlasFitTarget;
  showEcoregion: boolean;
  showEcoregionOutline: boolean;
  showBosqueFill: boolean;
  showProvinces: boolean;
  showProvinceHatch: boolean;
  showCities: boolean;
  otbnMax: number;
};

export const ATLAS_STEPS: AtlasStep[] = [
  {
    id: "argentina",
    kicker: "El recorte",
    title: "Patagonia, en el mapa",
    body: "El relato no cubre todo el país: se concentra en el sur andino-patagónico, donde el bosque nativo, el viento y la frontera con Chile definen el riesgo de incendio.",
    fit: "argentina",
    showEcoregion: false,
    showEcoregionOutline: false,
    showBosqueFill: false,
    showProvinces: false,
    showProvinceHatch: false,
    showCities: false,
    otbnMax: 0,
  },
  {
    id: "provincias",
    kicker: "Cinco provincias",
    title: "Neuquén, Río Negro, Chubut, Santa Cruz y Tierra del Fuego",
    body: "Primero el recorte político: cinco provincias del sur. El bosque no llena el mapa —corre por el oeste— pero acá se decide el ordenamiento que después se pinta sobre esa franja.",
    fit: "provincias",
    showEcoregion: false,
    showEcoregionOutline: false,
    showBosqueFill: false,
    showProvinces: true,
    showProvinceHatch: true,
    showCities: false,
    otbnMax: 0,
  },
  {
    id: "ecoregion",
    kicker: "Ecorregión",
    title: "Bosques Patagónicos",
    body: "Una franja estrecha sobre la cordillera: lenga, ñire, ciprés y coihue. Es el recorte ecológico de esta nota —no la estepa, no el monte— y el territorio que la Ley de Bosques tiene que ordenar.",
    fit: "ecoregion",
    showEcoregion: true,
    showEcoregionOutline: true,
    showBosqueFill: false,
    showProvinces: true,
    showProvinceHatch: false,
    showCities: true,
    otbnMax: 0,
  },
  {
    id: "otbn-1",
    kicker: `Categoría ${OTBN_ZONA_COPY[1].code}`,
    title: OTBN_ZONA_COPY[1].title,
    body: OTBN_ZONA_COPY[1].body,
    fit: "ecoregion",
    showEcoregion: false,
    showEcoregionOutline: true,
    showBosqueFill: false,
    showProvinces: true,
    showProvinceHatch: false,
    showCities: true,
    otbnMax: 1,
  },
  {
    id: "otbn-2",
    kicker: `Categoría ${OTBN_ZONA_COPY[2].code}`,
    title: OTBN_ZONA_COPY[2].title,
    body: OTBN_ZONA_COPY[2].body,
    fit: "ecoregion",
    showEcoregion: false,
    showEcoregionOutline: true,
    showBosqueFill: false,
    showProvinces: true,
    showProvinceHatch: false,
    showCities: true,
    otbnMax: 2,
  },
  {
    id: "otbn-3",
    kicker: `Categoría ${OTBN_ZONA_COPY[3].code}`,
    title: OTBN_ZONA_COPY[3].title,
    body: OTBN_ZONA_COPY[3].body,
    fit: "ecoregion",
    showEcoregion: false,
    showEcoregionOutline: true,
    showBosqueFill: false,
    showProvinces: true,
    showProvinceHatch: false,
    showCities: true,
    otbnMax: 3,
  },
];

export function atlasStepById(id: AtlasStepId): AtlasStep {
  const step = ATLAS_STEPS.find((item) => item.id === id);
  if (!step) return ATLAS_STEPS[0];
  return step;
}
