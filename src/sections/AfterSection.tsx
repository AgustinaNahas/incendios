"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { StorySection } from "@/components/scrolly/StorySection";
import { TestimonyCard, type Testimony } from "@/components/scrolly/TestimonyCard";
import { HorizontalBars } from "@/components/charts/HorizontalBars";
import { FireSeasonHeatmap } from "@/components/charts/FireSeasonHeatmap";
import { formatCompact, formatHa } from "@/lib/format";
import {
  mean,
  peakYear,
  sumByProvince,
  sumByYear,
  type ProvinceYearValue,
} from "@/lib/parseRii";

type Props = {
  hectaresPatagonia: ProvinceYearValue[];
  firesMonth: ProvinceYearValue[];
  testimonies: Testimony[];
};

export function AfterSection({
  hectaresPatagonia,
  firesMonth,
  testimonies,
}: Props) {
  const [activeTestimony, setActiveTestimony] = useState(0);
  const [graphic, setGraphic] = useState<"bars" | "heatmap">("bars");

  const yearly = useMemo(
    () => sumByYear(hectaresPatagonia),
    [hectaresPatagonia],
  );
  const byProvince = useMemo(
    () => sumByProvince(hectaresPatagonia),
    [hectaresPatagonia],
  );
  const peak = peakYear(yearly);
  const avg = mean(yearly);
  const last = yearly.find((y) => y.year === 2025);

  return (
    <StorySection
      id="despues"
      eyebrow="Momento I · La cicatriz"
      title="El después: las consecuencias del fuego"
      lede="Brigadistas con la piel curtida, vecinos que perdieron su entorno y un récord de hectáreas quemadas: el costo tangible de una década de prevención insuficiente."
      graphic={
        graphic === "bars" ? (
          <HorizontalBars
            data={byProvince}
            title="Cicatriz acumulada · Patagonia"
          />
        ) : (
          <FireSeasonHeatmap
            data={firesMonth}
            title="El verano que duele"
          />
        )
      }
    >
      <div className="rounded-sm border border-current/20 bg-current/5 p-5">
        <p className="text-xs font-semibold tracking-wide uppercase opacity-65">
          Big number · Patagonia 2017–2025
        </p>
        <p className="mt-2 font-[family-name:var(--font-display)] text-4xl md:text-5xl">
          {peak ? formatCompact(peak.value) : "—"}{" "}
          <span className="text-lg opacity-70">ha</span>
        </p>
        <p className="mt-2 text-sm opacity-80">
          Año pico: <strong>{peak?.year ?? "—"}</strong>. En 2025 se quemaron{" "}
          <strong>{last ? formatHa(last.value) : "—"}</strong> ha; la media del
          período es {formatHa(avg)} ha/año.
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-sm leading-relaxed opacity-85">
          Cada hectárea de bosque quemado tiene un precio: el resultado de una
          década sin inversión real en prevención. La valuación económica
          precisa sigue siendo una brecha (ver sección final).
        </p>

        <div className="flex flex-wrap gap-2">
          {testimonies.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTestimony(i)}
              className={`rounded-full px-3 py-1 text-xs transition ${
                i === activeTestimony
                  ? "bg-current/20 font-semibold"
                  : "bg-current/5 opacity-70 hover:opacity-100"
              }`}
            >
              {t.role}
            </button>
          ))}
        </div>
        <TestimonyCard testimony={testimonies[activeTestimony]} />
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        <button
          type="button"
          onClick={() => setGraphic("bars")}
          className={`text-xs underline-offset-4 ${
            graphic === "bars" ? "underline font-semibold" : "opacity-70"
          }`}
        >
          Ver cicatriz por provincia
        </button>
        <span className="opacity-40">·</span>
        <button
          type="button"
          onClick={() => setGraphic("heatmap")}
          className={`text-xs underline-offset-4 ${
            graphic === "heatmap" ? "underline font-semibold" : "opacity-70"
          }`}
        >
          Ver temporada de fuego
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        className="text-sm opacity-75"
      >
        Fuente de hectáreas e incendios: RII (2017–marzo 2026). Totales 2026
        parciales; no se usan en promedios anuales.
      </motion.div>
    </StorySection>
  );
}
