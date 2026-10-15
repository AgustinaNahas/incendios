"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import budget from "@/data/budget.json";
import {
  BudgetExecutionChart,
  type BudgetExecPoint,
} from "@/components/charts/BudgetExecutionChart";

type BudgetStep = {
  id: string;
  yearsThrough: number;
  body: string;
};

const STEPS: BudgetStep[] = [
  {
    id: "2017-2020",
    yearsThrough: 2020,
    body: "Desde 2017 se ve una baja del presupuesto en términos reales, mientras el porcentaje ejecutado empieza a subir: se gasta más de lo poco que hay, no se invierte más en prevención.",
  },
  {
    id: "2021-2022",
    yearsThrough: 2022,
    body: "Con 2021 y 2022 el techo presupuestario sigue achicado en pesos constantes. La ejecución mejora, pero el margen para prevención y planificación plurianual no aparece.",
  },
  {
    id: "2023-2025",
    yearsThrough: 2025,
    body: "Al sumar 2023–2025 se confirma la tendencia: menos presupuesto real, más proporción ejecutada. La emergencia absorbe lo disponible; la prevención queda afuera del dibujo.",
  },
];

const ALL_POINTS = budget.execution as BudgetExecPoint[];

export function BudgetSection() {
  const [stepId, setStepId] = useState(STEPS[0].id);
  const [chartActive, setChartActive] = useState(false);
  const panelRefs = useRef<Record<string, HTMLElement | null>>({});
  const chartWrapRef = useRef<HTMLDivElement | null>(null);

  const activeStep = STEPS.find((step) => step.id === stepId) ?? STEPS[0];

  const chartData = useMemo(
    () => ALL_POINTS.filter((d) => d.year <= activeStep.yearsThrough),
    [activeStep.yearsThrough],
  );

  useEffect(() => {
    const el = chartWrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.intersectionRatio >= 0.99) {
          setChartActive(true);
        }
      },
      { threshold: [0.99, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const syncFromScroll = () => {
      const mid = window.innerHeight * 0.55;
      let best = STEPS[0];
      let bestDist = Infinity;
      for (const step of STEPS) {
        const el = document.getElementById(`budget-panel-${step.id}`);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= mid && rect.bottom >= mid) {
          setStepId(step.id);
          return;
        }
        const center = rect.top + rect.height / 2;
        const dist = Math.abs(center - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = step;
        }
      }
      setStepId(best.id);
    };

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(syncFromScroll);
    };

    syncFromScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      id="presupuesto"
      className="relative scroll-mt-8 bg-[#2B2B2B] text-[#f3efe8]"
    >
      <div className="mx-auto max-w-[800px] px-5 pt-20 pb-6 md:px-8 md:pt-28">
        <p className="text-sm leading-relaxed text-[#f3efe8]/80 md:text-base">
          Expresado en valores reales, ajustado por inflación promedio
          interanual, a precios de 2026.
        </p>
      </div>

      <div className="relative">
        <div className="sticky top-0 z-10 flex h-svh w-full flex-col justify-center">
          <div className="mx-auto w-full max-w-[800px] px-5 md:px-8">
            <div
              ref={chartWrapRef}
              className="flex w-full flex-1 flex-col justify-center"
            >
              <BudgetExecutionChart data={chartData} active={chartActive} />
            </div>

            <div className="pointer-events-none mt-4 w-full">
              <div className="border border-[#f3efe8]/25 bg-[#4a4a4a]/55 px-5 py-4 md:px-6 md:py-5">
                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#f3efe8]/65">
                  {activeStep.id}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#f3efe8]/90 md:text-base">
                  {activeStep.body}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none relative z-20 -mt-[100svh]">
          {STEPS.map((step) => {
            const isActive = step.id === stepId;
            return (
              <article
                key={step.id}
                id={`budget-panel-${step.id}`}
                ref={(node) => {
                  panelRefs.current[step.id] = node;
                }}
                className="relative min-h-[120vh] px-4 md:px-8"
                aria-current={isActive ? "step" : undefined}
              />
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-[800px] px-5 pt-6 pb-16 md:px-8 md:pb-24">
        <p className="text-xs leading-relaxed text-[#f3efe8]/65 md:text-sm">
          Fuente: Monitor Presupuestario de la Asociación Civil por la Igualdad
          y la Justicia (ACIJ) con base en Presupuesto Abierto.
        </p>
      </div>
    </section>
  );
}
