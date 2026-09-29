"use client";

import { useState } from "react";

type CauseItem = {
  title: string;
  body: string;
};

type CauseAccordion = {
  id: string;
  percent: string;
  title: string;
  tags: string[];
  items: CauseItem[];
  theme: "natural" | "human";
};

const CAUSES: CauseAccordion[] = [
  {
    id: "naturales",
    percent: "5%",
    title: "Causas naturales",
    tags: ["Rayos", "Actividad volcánica"],
    theme: "natural",
    items: [
      {
        title: "Rayos (tormentas eléctricas)",
        body: "Un rayo puede encender el bosque incluso horas después de la tormenta. A veces el fuego queda latente bajo la materia orgánica y recién se hace visible cuando cambian el viento o la humedad.",
      },
      {
        title: "Actividad volcánica (poco frecuente en esta región)",
        body: "Lava, ceniza caliente o material piroclástico pueden incendiar vegetación. En los bosques andino-patagónicos es una fuente rara frente a las causas humanas.",
      },
    ],
  },
  {
    id: "humanas",
    percent: "95%",
    title: "Causas de origen humano",
    tags: [
      "Negligencia",
      "Fogón mal apagado",
      "Pelea entre vecinos",
      "Manejo de pasturas",
      "Mantener las dinámicas ecológicas en algunos ambientes",
      "Infraestructura relacionada con la energía eléctrica",
    ],
    theme: "human",
    items: [
      {
        title: "Negligencia",
        body: "Colillas, herramientas o residuos que siguen calientes. Una descuido mínimo alcanza cuando el combustible está seco.",
      },
      {
        title: "Fogón mal apagado",
        body: "Fogones de camping o trabajos a cielo abierto que no se enfrían del todo. El brasero bajo ceniza puede reavivarse con el viento.",
      },
      {
        title: "Pelea entre vecinos",
        body: "Conflictos locales que terminan en focos intencionales. El fuego se usa como amenaza o represalia sobre el territorio.",
      },
      {
        title: "Manejo de pasturas",
        body: "Quemas para renovar forraje que se escapan del perímetro controlado, sobre todo con viento y baja humedad.",
      },
      {
        title: "Mantener las dinámicas ecológicas en algunos ambientes",
        body: "En ciertos ecosistemas el fuego formó parte del ciclo histórico. Sin planificación ni contención, esa práctica se vuelve riesgo en la interfaz actual.",
      },
      {
        title: "Infraestructura relacionada con la energía eléctrica",
        body: "Tendidos, transformadores o fallas eléctricas que generan chispas sobre vegetación seca en bordes de caminos y periurbanos.",
      },
    ],
  },
];

const THEME = {
  natural: {
    border: "border-[#5a7a5a]",
    bg: "bg-[#2f3e2f]/80",
    accent: "text-[#8fbc8f]",
    chevron: "text-[#8fbc8f]",
    itemTitle: "text-[#8fbc8f]",
  },
  human: {
    border: "border-[#8a4a4a]",
    bg: "bg-[#4a2b2b]/80",
    accent: "text-[#f3efe8]",
    chevron: "text-[#e07a7a]",
    itemTitle: "text-[#e07a7a]",
  },
} as const;

function Chevron({ open, className }: { open: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden
      className={`h-5 w-5 shrink-0 transition-transform duration-300 ${
        open ? "rotate-180" : ""
      } ${className ?? ""}`}
    >
      <path
        d="M5 7.5 10 12.5 15 7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FireContextSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section
      id="contexto"
      className="relative scroll-mt-8 bg-[#2B2B2B] text-[#f3efe8]"
    >
      <div className="mx-auto max-w-[800px] px-5 py-20 md:px-8 md:py-28">
        <h2 className="font-[family-name:var(--font-display)] text-3xl leading-tight md:text-5xl">
          El contexto del fuego
        </h2>
        <p className="mt-6 text-base leading-relaxed text-[#f3efe8]/90 md:text-lg">
          Pero ¿cuál es el contexto que hace que un bosque sea más probable de
          incendiarse y más difícil de proteger antes de que exista el foco
          inicial? Podemos separarlo en{" "}
          <strong className="font-bold text-[#f3efe8]">
            tres niveles de riesgo
          </strong>
          : causas directas, factores de propagación y condiciones
          estructurales.
        </p>

        <h3 className="mt-14 font-sans text-xl font-bold md:text-2xl">
          Causas directas
        </h3>
        <p className="mt-3 text-base leading-relaxed text-[#f3efe8]/90 md:text-lg">
          Las causas directas pueden ser de dos tipos: naturales o de origen
          antrópico, es decir generadas por el hombre, ya sea por negligencia, a
          propósito o error.
        </p>

        <div className="mt-8 space-y-4">
          {CAUSES.map((cause) => {
            const open = openId === cause.id;
            const theme = THEME[cause.theme];
            return (
              <div
                key={cause.id}
                className={`overflow-hidden border ${theme.border} ${theme.bg}`}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`cause-panel-${cause.id}`}
                  id={`cause-trigger-${cause.id}`}
                  onClick={() =>
                    setOpenId((current) =>
                      current === cause.id ? null : cause.id,
                    )
                  }
                  className="flex w-full items-stretch gap-4 px-4 py-4 text-left md:gap-5 md:px-5 md:py-5"
                >
                  <span
                    className={`flex shrink-0 items-center font-[family-name:var(--font-display)] text-3xl leading-none font-black md:text-4xl ${theme.accent}`}
                  >
                    {cause.percent}
                  </span>
                  <span
                    className="w-px shrink-0 self-stretch bg-current opacity-35"
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block font-sans text-base font-semibold md:text-lg">
                      {cause.title}
                    </span>
                    {!open ? (
                      <span className="mt-1 block text-sm leading-snug text-[#f3efe8]/75">
                        {cause.tags.join(" | ")}
                      </span>
                    ) : null}
                  </span>
                  <span className={`flex items-center ${theme.chevron}`}>
                    <Chevron open={open} />
                  </span>
                </button>

                <div
                  id={`cause-panel-${cause.id}`}
                  role="region"
                  aria-labelledby={`cause-trigger-${cause.id}`}
                  hidden={!open}
                  className="border-t border-current/20 px-4 pb-5 md:px-5 md:pb-6"
                >
                  <div className="space-y-4 pt-4">
                    {cause.items.map((item) => (
                      <div key={item.title}>
                        <p
                          className={`font-sans text-sm font-bold md:text-base ${theme.itemTitle}`}
                        >
                          {item.title}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-[#f3efe8]/85 md:text-base">
                          {item.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
