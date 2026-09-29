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
  title: string;
  kicker?: string;
  body: string;
  hectaresLabel?: string;
  shareLabel?: string;
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
    caption: ``,
  };
}

const bosquesStep: AtlasStep = {
  id: "bosques",
  title: "Ecoregión Andino Patagónica",
  body: "Se extiende a lo largo de 5 provincias argentinas. Ell 32% de este territorio corresponde a los Bosques nativos patagónicos. La masa forestal original se caracteriza por árboles y plantas leñosas autóctonas.",
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
  const sharePct = Math.round((ha.total / OTBN_TOTAL_HA.total) * 100);
  return [
    {
      id: slug,
      title: copy.title,
      kicker: copy.kicker,
      body: copy.body,
      hectaresLabel: `${formatHa(ha.total)} ha.`,
      shareLabel: `${sharePct}%`,
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
  {
    id: "territorio",
    label: bosquesStep.title,
    steps: [bosquesStep, categoriasStep],
  },
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
