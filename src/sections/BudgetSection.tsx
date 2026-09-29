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

  const activeStep =
    STEPS.find((step) => step.id === stepId) ?? STEPS[0];

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
      <div className="mx-auto max-w-[800px] px-5 pt-20 pb-10 md:px-8 md:pt-28">

        <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl leading-tight md:text-5xl">
        El rol del Estado
        </h2>
        <p className="mt-4 font-sans text-xl leading-snug font-bold md:text-2xl">
        Presupuesto y gestión
        </p>
        <div className="mt-8 space-y-5 text-base leading-relaxed text-[#f3efe8]/90 md:text-lg">
          <p>
          En el marco del Sistema Federal de Manejo del Fuego las jurisdicciones planifican sus distintas actividades de prevención. A partir de dicha planificación, el Servicio Nacional de Manejo del Fuego participó de manera interdisciplinaria en las distintas actividades. Pueden ser charlas en instituciones educativas, conversatorios abiertos a la comunidad, participación en eventos de concientización, entre otros.

          </p>
          <p>
          En la regional Patagonia, desde 2016 a 2026 se realizaron más de 100 jornadas en escuelas urbanas y rurales teniendo un impacto en más de 10.000 estudiantes de la comunidad educativa de las provincias de Chubut, Río Negro y Neuquén. 


          </p>
          <p>
          Introducimos los presupuestos, un factor clave dentro de la investigación que se vincula con la gestión política de los recursos asignados por Nación y provincia. En este apartado se utilizarán testimonios que se cruzarán con datos y gráficos. Gran parte de la causa de los incendios está en la desatención a la prevención, la cual requiere dinero y acciones. Existe una mirada reactiva y no preventiva que se demuestra en los datos. En el relato se buscará hacer énfasis en el contraste entre la demanda operativa ante el combate de megaincendios y la realidad presupuestaria de la prevención.
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="sticky top-0 z-10 flex h-svh w-full flex-col justify-center px-4 py-10 md:px-8">
          <div
            ref={chartWrapRef}
            className="mx-auto w-full max-w-[900px] flex-1 flex flex-col justify-center"
          >
            <BudgetExecutionChart data={chartData} active={chartActive} />
          </div>

          <div className="pointer-events-none mx-auto mt-4 w-full max-w-[800px]">
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

      <div className="mx-auto max-w-[800px] px-5 pt-20 pb-10 md:px-8 md:pt-28">

        <p className="mt-4 font-sans text-xl leading-snug font-bold md:text-2xl">
          Manejo del fuego
        </p>
        <div className="mt-8 space-y-5 text-base leading-relaxed text-[#f3efe8]/90 md:text-lg">
          <p>
          La Ley 26.815 de Manejo del Fuego establece presupuestos mínimos de protección ambiental en materia de incendios forestales y rurales en el ámbito del territorio nacional. Esta norma aplica a las acciones y operaciones de prevención, presupresión y combate de incendios forestales y rurales, en bosques nativos e implantados, áreas naturales protegidas y zonas agrícolas, entre otras áreas donde las estructuras edilicias se entremezclan con la vegetación fuera del ambiente estrictamente urbano o estructural. 
          </p>
          <p>
          La protección contra los incendios se planifica a través de la instrumentación de Planes de Manejo del Fuego según los siguientes niveles de alcance:
Local, de cada una de las provincias y APN; regional, establecido por las Regiones conforme las dispone la ley; nacional, establecido por el Servicio Nacional de Manejo del Fuego e integra los planes regionales.
          </p>

        <p className="mt-4 font-sans text-xl leading-snug font-bold md:text-2xl">
          Alerta temprana
        </p>
          <p>
          En lo que respecta a la planificación para la protección de incendios, la Ley 26.815 establece, como un nivel de alcance, al Sistema Nacional de Alerta Temprana y Evaluación de Peligro de Incendios (SATyEPI), el cual a través de un sistema de grados de peligros de incendios, tiene como fin anticipar condiciones de severidad de las temporadas de fuego, y advertir al personal de combate sobre situaciones críticas.
          </p>
        </div>
      </div>
    </section>
  );
}
