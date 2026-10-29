"use client";

import { useMemo, useState } from "react";
import { StorySection } from "@/components/scrolly/StorySection";
import { DualAxisLines } from "@/components/charts/DualAxisLines";
import { IntensityScatter } from "@/components/charts/IntensityScatter";
import { SlopeChart } from "@/components/charts/SlopeChart";
import { sumByYear, type ProvinceYearValue } from "@/lib/parseRii";
import budget from "@/data/budget.json";

type Props = {
  hectaresPatagonia: ProvinceYearValue[];
  firesProvincePatagonia: ProvinceYearValue[];
};

type Graphic = "dual" | "scatter" | "slope";

export function FireSection({
  hectaresPatagonia,
  firesProvincePatagonia,
}: Props) {
  const [graphic, setGraphic] = useState<Graphic>("dual");

  const dual = useMemo(() => {
    const ha = sumByYear(hectaresPatagonia);
    const real = budget.execution.map((point) => ({
      year: point.year,
      real: point.executed,
    }));
    return ha
      .filter((h) => h.year <= 2025)
      .map((h) => {
        const b = real.find((r) => r.year === h.year);
        return {
          year: h.year,
          hectares: h.value,
          budgetReal: b?.real ?? 0,
        };
      });
  }, [hectaresPatagonia]);

  const scatter = useMemo(() => {
    const ha = sumByYear(hectaresPatagonia);
    const fires = sumByYear(firesProvincePatagonia);
    return ha
      .filter((h) => h.year <= 2025)
      .map((h) => ({
        year: h.year,
        hectares: h.value,
        fires: fires.find((f) => f.year === h.year)?.value ?? 0,
      }));
  }, [hectaresPatagonia, firesProvincePatagonia]);

  const graphicNode = (() => {
    switch (graphic) {
      case "dual":
        return (
          <DualAxisLines
            data={dual}
            title="Presupuesto real vs hectáreas"
            annotation="Presupuesto ejecutado en millones de pesos constantes de 2026 (FARN)."
          />
        );
      case "scatter":
        return (
          <IntensityScatter
            data={scatter}
            title="Intensidad, no solo conteo"
          />
        );
      case "slope":
        return (
          <SlopeChart
            data={hectaresPatagonia}
            title="Quién escala, quién baja"
          />
        );
    }
  })();

  return (
    <StorySection
      id="fuego"
      eyebrow="Momento II · La crisis"
      title="El fuego: incendios, brigadistas y un presupuesto que no alcanza"
      lede="Incendios forestales. Brigadistas, vecinos y una planificación que anticipa veranos negros para los bosques patagónicos."
      graphic={graphicNode}
    >
      <p className="text-sm leading-relaxed opacity-85">
        La falta de fondos y de planificación anticipan un verano negro. El
        gráfico de presupuesto usa el ejecutado del SNMF en millones de pesos
        constantes de 2026.
      </p>

      <div className="rounded-sm border border-current/20 bg-current/5 p-4 text-sm">
        <p className="font-medium">Nota editorial</p>
        <p className="mt-1 opacity-80">
          {budget.note} {budget.source}
        </p>
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-2 text-xs">
        {(
          [
            ["dual", "Presupuesto vs ha"],
            ["scatter", "Intensidad"],
            ["slope", "Ranking provincias"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setGraphic(id)}
            className={`underline-offset-4 ${
              graphic === id ? "underline font-semibold" : "opacity-70"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="text-sm opacity-75">
        La composición del área quemada (bosque nativo vs implantado vs pastizal)
        no está disponible en serie anual: se discute en Brechas.
      </p>
    </StorySection>
  );
}
