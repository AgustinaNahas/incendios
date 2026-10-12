import { formatHa } from "@/lib/format";
import { OTBN_COLORS, type OtbnZona } from "@/lib/otbnColors";
import {
  OTBN_PROVINCE_SLUG,
  type OtbnProvinceFilter,
} from "@/lib/otbnCopy";
import {
  ECOREGION_HA,
  OTBN_TOTAL_HA,
  otbnHaFor,
  otbnShareOfEcoregion,
  otbnZonasPresent,
} from "@/lib/otbnStats";

export type AtlasFitTarget = "argentina" | "patagonia" | "province";

export type AtlasOtbnPaint = "off" | "forest" | "zones";

export type AtlasProvince = Exclude<OtbnProvinceFilter, "all">;

/** `"all"` pinta las cinco provincias; un array recorta el mapa a ese grupo. */
export type AtlasScope = "all" | AtlasProvince[];

export type AtlasBarConfig =
  | {
      variant: "solid";
      total: number;
      label: string;
      segments?: { zona: OtbnZona; value: number }[];
    }
  | {
      variant: "share";
      total: number;
      value: number;
      percentLabel: string;
      caption: string;
    }
  | {
      variant: "stacked";
      total: number;
      segments: { zona: OtbnZona; value: number }[];
      caption: string;
    };

export type AtlasChart = {
  id: string;
  label?: string;
  hectaresLabel?: string;
  bar: AtlasBarConfig;
};

export type AtlasStep = {
  id: string;
  title: string;
  kicker?: string;
  body: string;
  showCategoryLegend: boolean;
  fit: AtlasFitTarget;
  provinces: AtlasScope;
  showProvinceFill: boolean;
  showBosque: boolean;
  showEcoregion: boolean;
  otbnPaint: AtlasOtbnPaint;
  showLabels: boolean;
  charts: AtlasChart[];
};

function stackedBar(province: OtbnProvinceFilter): AtlasBarConfig {
  const ha = otbnHaFor(province);
  const zonas = otbnZonasPresent(province);
  return {
    variant: "stacked",
    total: ha.total,
    segments: zonas.map((zona) => ({ zona, value: ha[zona] })),
    caption: "",
  };
}

function provinceChart(province: AtlasProvince): AtlasChart {
  const ha = otbnHaFor(province);
  return {
    id: OTBN_PROVINCE_SLUG[province],
    label: province,
    hectaresLabel: `${formatHa(ha.total)} ha.`,
    bar: stackedBar(province),
  };
}

const bosquesStep: AtlasStep = {
  id: "bosques",
  title: "Ecorregión Andino Patagónica",
  body: "Se extiende a lo largo de 5 provincias argentinas. El 32% de este territorio corresponde a los Bosques nativos patagónicos. La masa forestal original se caracteriza por árboles y plantas leñosas autóctonas.",
  showCategoryLegend: false,
  fit: "patagonia",
  provinces: "all",
  showProvinceFill: false,
  showBosque: false,
  showEcoregion: true,
  otbnPaint: "forest",
  showLabels: true,
  charts: [
    {
      id: "ecoregion-share",
      bar: {
        variant: "share",
        total: ECOREGION_HA,
        value: OTBN_TOTAL_HA.total,
        percentLabel: `${Math.round(otbnShareOfEcoregion() * 100)}%`,
        caption: `${formatHa(OTBN_TOTAL_HA.total)} ha. de ${formatHa(ECOREGION_HA)} ha.`,
      },
    },
  ],
};

const categoriasStep: AtlasStep = {
  id: "categorias",
  title: "Bosques nativos y su conservación",
  body: "Para proteger los bosques nativos, la Ley Nacional 26.331 los clasifica en tres categorías.",
  showCategoryLegend: true,
  fit: "patagonia",
  provinces: "all",
  showProvinceFill: false,
  showBosque: false,
  showEcoregion: false,
  otbnPaint: "zones",
  showLabels: true,
  charts: [
    {
      id: "categorias-share",
      bar: stackedBar("all"),
    },
  ],
};

function regionStep(
  id: string,
  title: string,
  provinces: AtlasProvince[],
): AtlasStep {
  return {
    id,
    title,
    body: "",
    showCategoryLegend: false,
    fit: "province",
    provinces,
    showProvinceFill: false,
    showBosque: false,
    showEcoregion: false,
    otbnPaint: "zones",
    showLabels: true,
    charts: provinces.map(provinceChart),
  };
}

const norPatagoniaStep = regionStep("nor-patagonia", "Nor-patagonia", [
  "Neuquén",
  "Río Negro",
]);

const patagoniaCentroStep = regionStep("patagonia-centro", "Patagonia centro", [
  "Chubut",
]);

const patagoniaSurStep = regionStep("patagonia-sur", "Patagonia sur", [
  "Santa Cruz",
  "Tierra del Fuego",
]);

export const ATLAS_STEPS: AtlasStep[] = [
  bosquesStep,
  categoriasStep,
  norPatagoniaStep,
  patagoniaCentroStep,
  patagoniaSurStep,
];

export type AtlasPanel = {
  id: string;
  label: string;
  steps: AtlasStep[];
};

export const ATLAS_PANELS: AtlasPanel[] = [
  {
    id: "territorio",
    label: bosquesStep.title,
    steps: [bosquesStep, categoriasStep],
  },
  {
    id: norPatagoniaStep.id,
    label: norPatagoniaStep.title,
    steps: [norPatagoniaStep],
  },
  {
    id: patagoniaCentroStep.id,
    label: patagoniaCentroStep.title,
    steps: [patagoniaCentroStep],
  },
  {
    id: patagoniaSurStep.id,
    label: patagoniaSurStep.title,
    steps: [patagoniaSurStep],
  },
];

export type AtlasStepId = (typeof ATLAS_STEPS)[number]["id"];

export function atlasStepById(id: string): AtlasStep {
  const step = ATLAS_STEPS.find((item) => item.id === id);
  if (!step) return ATLAS_STEPS[0];
  return step;
}

export const OTBN_CATEGORY_BULLETS: {
  zona: OtbnZona;
  color: string;
  code: string;
  text: string;
}[] = [
  {
    zona: 1,
    color: OTBN_COLORS[1],
    code: "I",
    text: "Áreas que deben permanecer intactas.",
  },
  {
    zona: 2,
    color: OTBN_COLORS[2],
    code: "II",
    text: "Áreas que pueden aprovecharse de forma sostenible.",
  },
  {
    zona: 3,
    color: OTBN_COLORS[3],
    code: "III",
    text: "Áreas que pueden transformarse, pero solo con evaluación de impacto ambiental y bajo condiciones estrictas.",
  },
];
