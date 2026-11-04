"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import budget from "@/data/budget.json";
import {
  BudgetExecutionChart,
  type BudgetExecPoint,
} from "@/components/charts/BudgetExecutionChart";
import { Quote } from "@/components/Quote";

type BudgetStep = {
  id: string;
  yearsThrough: number;
  body: string;
};

const STEPS: BudgetStep[] = [
  {
    id: "2016-2020",
    yearsThrough: 2020,
    body: "Entre 2016 y 2020 el presupuesto vigente del SNMF oscila con fuerza en términos reales. La ejecución acompaña, pero sin consolidar una inversión estable en prevención.",
  },
  {
    id: "2021-2023",
    yearsThrough: 2023,
    body: "En 2022 aparece un pico excepcional de fondos vigentes y ejecutados. En 2023 la serie vuelve a comprimir el margen, aunque la ejecución sigue alta.",
  },
  {
    id: "2024-2026",
    yearsThrough: 2026,
    body: "2024 marca la menor ejecución desde 2017: apenas el 22% de los fondos disponibles. En 2025–2026 la ejecución mejora, pero el debate sigue siendo cuánto llega realmente a prevención.",
  },
];

const ALL_POINTS = budget.execution as BudgetExecPoint[];

const PREVENTION_LEDE =
  "La Ley Nacional de Manejo del Fuego obliga a planificar la protección contra incendios mediante Planes de Manejo del Fuego a nivel provincial, regional y nacional. Estas acciones se complementan con evaluaciones de carga de combustible y con el monitoreo del índice meteorológico de peligro (FWI), una herramienta basada en el Sistema Canadiense de Evaluación de Peligro de Incendios Forestales, que Argentina adoptó en el año 2000. El índice se calcula a partir de datos meteorológicos y permite estimar la probabilidad de inicio de un incendio y predecir su comportamiento.";

/** Resalta años (2016, 2025–2026, etc.) en el cuerpo de las cards. */
function highlightYears(text: string) {
  const parts = text.split(/(\b20\d{2}(?:\s*[–-]\s*20\d{2})?\b)/g);
  return parts.map((part, i) =>
    /^20\d{2}/.test(part) ? (
      <span key={i} className="font-semibold text-accent">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export function BudgetSection() {
  const [stepIndex, setStepIndex] = useState(0);
  const [chartActive, setChartActive] = useState(false);
  const chartWrapRef = useRef<HTMLDivElement | null>(null);

  const activeStep = STEPS[stepIndex] ?? STEPS[0];

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
      // El gráfico cambia cuando la card llega a la zona de lectura (abajo),
      // no cuando entra el article vacío de arriba.
      // Cards apoyan cerca del borde inferior del sticky (75svh).
      const restY = window.innerHeight * 0.62;
      let active = 0;
      for (let i = 0; i < STEPS.length; i++) {
        const card = document.querySelector<HTMLElement>(
          `#budget-panel-${STEPS[i].id} [data-budget-card]`,
        );
        if (!card) continue;
        const rect = card.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        if (center <= restY) active = i;
      }
      setStepIndex(active);
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
      className="relative scroll-mt-8 bg-background text-foreground"
    >
      <div className="mx-auto max-w-[800px] px-5 pt-20 pb-10 md:px-8 md:pt-28">
        <h2 className="type-h3">La actuación del Estado</h2>

        <h3 className="mt-12 font-sans text-xl font-bold md:text-2xl">
          Paraguas normativo
        </h3>
        <div className="mt-4 space-y-5 text-base leading-relaxed text-foreground/90 md:text-lg">
          <p>
            <strong className="font-bold text-foreground">
              Ley de Manejo del Fuego (Ley 26.815):
            </strong>{" "}
            fija los presupuestos mínimos de protección ambiental para la
            prevención y combate de incendios forestales y rurales a nivel
            nacional. Crea el Sistema Federal de Manejo del Fuego y exige la
            elaboración de planes de planificación según diferentes niveles de
            alcance.
          </p>
          <p>
            La Ley de Presupuestos Mínimos de Protección Ambiental de los
            Bosques Nativos (N.º 26.331) establece un régimen de ordenamiento
            territorial obligatorio para que cada provincia clasifique sus masas
            boscosas según su valor de conservación, prohibiendo o restringiendo
            el desmonte.
          </p>
          <p>
            Salvo Santa Cruz, las demás provincias patagónicas cuentan con
            legislaciones propias para la prevención, presupresión y combate de
            incendios forestales.
          </p>
        </div>

        <h3 className="mt-14 font-sans text-xl font-bold md:text-2xl">
          Sistema Federal de Manejo del Fuego
        </h3>
        <div className="mt-4 space-y-5 text-base leading-relaxed text-foreground/90 md:text-lg">
          <p>
            La Ley 26.815 creó el Sistema Federal de Manejo del Fuego (SFMF),
            integrado por el Servicio Nacional de Manejo del Fuego, la
            Administración de Parques Nacionales, las provincias y la Ciudad
            Autónoma de Buenos Aires. Sin embargo, el Decreto 1136/2024
            traspasó esta política nacional del área ambiental al Ministerio de
            Seguridad, que pasó a ser la Autoridad Nacional de Aplicación de la
            ley.
          </p>
          <p>
            La respuesta a un incendio se organiza en tres niveles. Primero
            interviene la autoridad jurisdiccional, ya sea la provincia o el
            Parque Nacional. Si necesita refuerzos, solicita apoyo regional a
            través del Coordinador Regional del SNMF. Y si la situación supera
            la capacidad de respuesta disponible, pide la intervención
            extrarregional del Servicio Nacional.
          </p>
        </div>

        <h3 className="mt-14 font-sans text-xl font-bold md:text-2xl">
          Presupuesto nacional
        </h3>
        <div className="mt-4 space-y-5 text-base leading-relaxed text-foreground/90 md:text-lg">
          <p>
            Durante sus dos primeros años de gestión, el gobierno de Javier
            Milei no tuvo una Ley de Presupuesto aprobada por el Congreso. En
            2024 y 2025 se usó el presupuesto prorrogado de 2023, lo que le dio
            al Poder Ejecutivo un amplio margen para modificar las partidas
            según su criterio. Recién en 2026 el Gobierno cuenta con una Ley de
            Presupuesto.
          </p>
          <p>
            Este proceso vino acompañado de un debilitamiento institucional del
            Ministerio de Ambiente y Desarrollo Sostenible, que pasó a ser una
            subsecretaría, y del cierre de programas y herramientas de ejecución
            de políticas ambientales. Entre ellas se destaca la disolución de
            los fondos fiduciarios de Manejo del Fuego y de Protección Ambiental
            de los Bosques Nativos, ambos vinculados con el Servicio Nacional de
            Manejo del Fuego.
          </p>
          <p>
            Los fideicomisos agilizaban las transferencias a las provincias,
            permitían controlar mejor el uso de los fondos y facilitaban
            planificar políticas de conservación a mediano y largo plazo.
          </p>
          <p>
            A este panorama se suma la reducción presupuestaria en el Servicio
            Meteorológico Nacional y la Administración Nacional de Parques
            Nacionales.
          </p>
        </div>

        <div className="mt-10 border border-accent bg-raised p-6 text-lg leading-snug font-bold md:p-8 md:text-xl">
          El año 2024 registró la menor ejecución presupuestaria del Servicio
          Nacional de Manejo del Fuego desde 2017, alcanzando apenas el 22% de
          los fondos disponibles.
        </div>

        <p className="mt-8 text-base leading-relaxed text-foreground/90 md:text-lg">
          Los fondos destinados al Servicio Nacional de Manejo del Fuego (SNMF)
          en el Presupuesto 2027 son $38.815 millones: un aumento real del 60,1%
          con respecto a 2026, pero una caída del 55,8% con respecto a 2023.
          Estos recursos no solo deben emplearse en tareas de combate del
          fuego, sino también de prevención.
        </p>

        <p className="mt-10 text-sm leading-relaxed text-foreground/80 md:text-base">
          Expresado en valores reales, ajustado por inflación promedio
          interanual, a precios de 2026.
        </p>
      </div>

      {/* Sticky: gráfico + título Prevención asomando abajo (como FireStates). */}
      <div className="relative">
        <div className="sticky top-0 z-10 bg-background">
          <div className="flex h-[min(52svh,380px)] w-full items-center md:h-[75svh]">
            <div
              ref={chartWrapRef}
              className="mx-auto w-full max-w-[800px] px-5 md:px-8"
            >
              <BudgetExecutionChart
                data={chartData}
                active={chartActive}
                source={budget.source}
                title="Ejecución presupuestaria del Servicio Nacional de Manejo del Fuego"
              />
            </div>
          </div>
          <div className="mx-auto max-w-[800px] px-5 pt-5 pb-3 md:px-8 md:pt-8 md:pb-4">
            <h3 className="font-sans text-xl font-bold md:text-2xl">
              Prevención
            </h3>
            <p className="mt-3 line-clamp-3 text-base leading-relaxed text-foreground/90 md:mt-4 md:line-clamp-none md:text-lg">
              {PREVENTION_LEDE}
            </p>
          </div>
        </div>

        <div className="pointer-events-none relative z-20 -mt-[min(52svh,380px)] md:-mt-[75svh]">
          {/* Intro: gráfico solo antes de que entre la 1ª card. */}
          <div className="h-[100svh]" aria-hidden />
          {STEPS.map((step, index) => {
            const isActive = index === stepIndex;
            return (
              <article
                key={step.id}
                id={`budget-panel-${step.id}`}
                className="pointer-events-none flex h-[100svh] items-end px-5 pb-[22vh] md:px-8 md:pb-[28vh]"
                aria-current={isActive ? "step" : undefined}
              >
                <div
                  data-budget-card
                  className="ui-panel ui-panel--accent pointer-events-auto mx-auto w-full max-w-[450px] px-5 py-5 md:px-6 md:py-6"
                >
                  <p className="text-[11px] font-semibold tracking-[0.18em] text-accent uppercase">
                    {step.id}
                  </p>
                  <p className="mt-2 text-base leading-relaxed text-white md:text-lg">
                    {highlightYears(step.body)}
                  </p>
                </div>
              </article>
            );
          })}
          {/* Compensa el -mt del overlay + deja que la última card salga por arriba
              antes de que el sticky suelte hacia Prevención. */}
          <div className="h-[160svh]" aria-hidden />
        </div>
      </div>

      <div className="mx-auto max-w-[800px] px-5 pt-2 pb-20 md:px-8 md:pb-28">
        <p className="mb-8 text-base leading-relaxed text-foreground/90 md:hidden">
          {PREVENTION_LEDE}
        </p>
        <div className="space-y-5 text-base leading-relaxed text-foreground/90 md:text-lg">
          <p>
            Abel Nievas, secretario de Bosques de Chubut, trabajó casi 30 años
            en el Servicio Provincial de Manejo del Fuego. Explica que el FWI se
            utiliza para monitorear el riesgo y planificar las acciones de
            control: “Por ejemplo, con un nivel de bajo a moderado, la brigada
            puede estar a más de 15 o 20 minutos de la base haciendo quemas o
            tareas de prevención. A medida que el nivel aumenta a muy alto y
            extremo, tienen que estar con los equipos cargados en la camioneta
            para dar una respuesta inmediata ante un llamado de incendio”.
          </p>
          <p>
            En cuanto al manejo de combustibles de origen vegetal, Nievas señaló
            que los planes invernales que se realizan cada año incluyen trabajos
            de silvicultura y quemas preventivas.
          </p>
          <p>
            La prevención también depende de la coordinación entre
            jurisdicciones. “Después del incendio de 2001, en el que se quemaron
            500 casas, reanalizamos las campañas de prevención y se conformó una
            mesa comarcal junto con Parques Nacionales, con el SPLIF de Río
            Negro y con el Servicio Nacional de Manejo del Fuego”, recordó
            Nievas.
          </p>
          <p>
            A nivel nacional, desde el Servicio Nacional de Manejo del Fuego
            informaron que la Regional Patagonia cuenta con un equipo
            interdisciplinario de aproximadamente 30 personas. Los equipos
            varían según las actividades previstas, como charlas en
            instituciones educativas, conversatorios abiertos a la comunidad o
            participación en eventos de concientización, entre otras. Estas
            tareas se realizan con el personal designado por las provincias y
            por Parques Nacionales.
          </p>
          <p>
            Sin embargo, más allá de lo que establece el marco normativo, queda
            una pregunta: ¿cuánto se invierte realmente en prevención? A pesar
            de haber presentado pedidos de acceso a la información pública a
            autoridades nacionales y provinciales, no pudimos obtener datos
            precisos sobre los presupuestos destinados a estas estrategias.
          </p>
        </div>

        <Quote
          className="mt-10"
          quote="“En algún momento creí que era una cuestión presupuestaria, pero cuando los fondos aparecen durante la emergencia se demuestra que, si se quieren, están”"
          name="Daniel Díaz"
          role="jefe de Bomberos de Epuyén"
        />

        <div className="mt-10 space-y-5 text-base leading-relaxed text-foreground/90 md:text-lg">
          <p>
            Hay un componente en los incendios casi teatral, sensacional o
            gigantesco. Propio de los efectos de cine que también, mencionan los
            especialistas, condiciona los presupuestos y hacia dónde va la
            atención de quienes gestionan los recursos. Muchas veces se prioriza
            el espectáculo por sobre las acciones más “invisibles”.
          </p>
        </div>

        <p className="mt-10 text-base leading-relaxed text-foreground/90 md:text-lg">
          “El enfoque reactivo sobre los incendios puede identificarse también en
          la publicidad de estos eventos, en la sensacionalidad de un avión
          hidrante lanzando 10.000 litros con precisión por sobre el barrido
          rutinario de material seco. Vende, ‘garpa’ hacer propaganda durante una
          catástrofe, cuando está toda la atención puesta ahí y aparecer con
          millones de dólares para combatir incendios. Lamentablemente no
          tendría el mismo impacto social o quizás eso creen quienes toman
          decisiones el trabajar en prevención”. Daniel Díaz, jefe de Bomberos
          de Epuyén.
        </p>
      </div>
    </section>
  );
}
