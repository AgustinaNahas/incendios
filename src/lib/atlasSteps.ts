import { formatHa } from "@/lib/format";
import { OTBN_COLORS, OTBN_ZONA_LABELS, type OtbnZona } from "@/lib/otbnColors";
import {
  OTBN_PROVINCE_COPY,
  OTBN_PROVINCE_SLUG,
  OTBN_PROVINCES,
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

export type AtlasStep = {
  id: string;
  kicker: string;
  title: string;
  body: string;
  showCategoryLegend: boolean;
  fit: AtlasFitTarget;
  province: OtbnProvinceFilter;
  showProvinceFill: boolean;
  showBosque: boolean;
  otbnPaint: AtlasOtbnPaint;
  showLabels: boolean;
  bar: AtlasBarConfig;
};

function stackedBar(province: OtbnProvinceFilter): AtlasBarConfig {
  const ha = otbnHaFor(province);
  const zonas = otbnZonasPresent(province);
  return {
    variant: "stacked",
    total: ha.total,
    segments: zonas.map((zona) => ({ zona, value: ha[zona] })),
    caption: `${formatHa(ha.total)} ha.`,
  };
}

const ecoregionStep: AtlasStep = {
  id: "ecoregion",
  kicker: "Ecorregión",
  title: "Ecorregión Andino Patagónica",
  body: "Se extiende a lo largo de 5 provincias argentinas: Neuquén, Río Negro, Chubut, Santa Cruz y Tierra del Fuego. Está cubierta principalmente por bosques, pero también hay estepa, mallines, lagos y glaciares.",
  showCategoryLegend: false,
  fit: "argentina",
  province: "all",
  showProvinceFill: true,
  showBosque: false,
  otbnPaint: "off",
  showLabels: true,
  bar: {
    variant: "solid",
    total: ECOREGION_HA,
    label: `${formatHa(ECOREGION_HA)} ha.`,
  },
};

const bosquesStep: AtlasStep = {
  id: "bosques",
  kicker: "Bosque nativo",
  title: "Bosques andinos patagónicos",
  body: "Gran parte de esa región son bosques nativos. La masa forestal original se caracteriza por árboles y plantas leñosas autóctonas como la lenga, el ñire, el coihue o el alerce.",
  showCategoryLegend: false,
  fit: "patagonia",
  province: "all",
  showProvinceFill: false,
  showBosque: true,
  otbnPaint: "off",
  showLabels: true,
  bar: {
    variant: "share",
    total: ECOREGION_HA,
    value: OTBN_TOTAL_HA.total,
    percentLabel: `${Math.round(otbnShareOfEcoregion() * 100)}%`,
    caption: `${formatHa(OTBN_TOTAL_HA.total)} ha. de ${formatHa(ECOREGION_HA)} ha.`,
  },
};

const categoriasStep: AtlasStep = {
  id: "categorias",
  kicker: "Ley 26.331",
  title: "Categorías de conservación",
  body: "Para proteger los bosques nativos, la Ley Nacional 26.331 los clasifica en tres categorías.",
  showCategoryLegend: true,
  fit: "patagonia",
  province: "all",
  showProvinceFill: false,
  showBosque: false,
  otbnPaint: "zones",
  showLabels: true,
  bar: stackedBar("all"),
};

function provinceSteps(
  province: Exclude<OtbnProvinceFilter, "all">,
): AtlasStep[] {
  const slug = OTBN_PROVINCE_SLUG[province];
  const copy = OTBN_PROVINCE_COPY[province];
  const ha = otbnHaFor(province);
  const zonas = otbnZonasPresent(province);
  return [
    {
      id: `${slug}-total`,
      kicker: province,
      title: copy.title,
      body: copy.body,
      showCategoryLegend: false,
      fit: "province",
      province,
      showProvinceFill: false,
      showBosque: false,
      otbnPaint: "forest",
      showLabels: true,
      bar: {
        variant: "solid",
        total: ha.total,
        label: `${formatHa(ha.total)} ha.`,
        segments: zonas.map((zona) => ({ zona, value: ha[zona] })),
      },
    },
    {
      id: `${slug}-categorias`,
      kicker: province,
      title: copy.title,
      body: copy.body,
      showCategoryLegend: false,
      fit: "province",
      province,
      showProvinceFill: false,
      showBosque: false,
      otbnPaint: "zones",
      showLabels: true,
      bar: stackedBar(province),
    },
  ];
}

export const ATLAS_STEPS: AtlasStep[] = [
  ecoregionStep,
  bosquesStep,
  categoriasStep,
  ...OTBN_PROVINCES.flatMap(provinceSteps),
];

export type AtlasPanel = {
  id: string;
  label: string;
  steps: AtlasStep[];
};

export const ATLAS_PANELS: AtlasPanel[] = [
  { id: "ecoregion", label: ecoregionStep.title, steps: [ecoregionStep] },
  { id: "bosques", label: bosquesStep.title, steps: [bosquesStep] },
  { id: "categorias", label: categoriasStep.title, steps: [categoriasStep] },
  ...OTBN_PROVINCES.map((province) => {
    const steps = provinceSteps(province);
    return {
      id: OTBN_PROVINCE_SLUG[province],
      label: province,
      steps,
    };
  }),
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
