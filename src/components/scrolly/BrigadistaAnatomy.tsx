"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/paths";

type Focus = { x: number; y: number; scale: number };

type FrontStep = {
  kind: "front";
  id: string;
  title: string | null;
  summary: string[];
  focus: Focus;
  layers: Record<string, number>;
  /** Altura del panel de scroll. */
  panelMinVh: number;
};

type PackFit = {
  /** Ancho del pack como % del box de la espalda. */
  widthPct: number;
  /** Offset izquierdo como % del box de la espalda. */
  leftPct: number;
  /** Offset superior como % del box de la espalda. */
  topPct: number;
};

type BackStep = {
  kind: "back";
  id: string;
  title: string;
  packLabel: string;
  packBody: string;
  packImage: string;
  /** Encaje del pack sobre `espalda.png` (mismo frame). */
  fit: PackFit;
  summary: string[];
  panelMinVh: number;
};

/** Aspecto del PNG de espalda; el pack se posiciona en este mismo frame. */
const ESPALDA_ASPECT = 975 / 1080;

type AnatomyStep = FrontStep | BackStep;

const SVG_ASPECT = 7814 / 6183;
const DIM = 0.2;
const ON = 1;
const OFF = 0;

const FIGURE_IDS = [
  "mochila",
  "pala",
  "Antorcha",
  "campera",
  "Guantes",
  "Accesorios",
  "Cabeza",
  "Casco Xray",
  "Botas normal",
  "pantalon",
] as const;

const TEXT_IDS = [
  "Textos sobre primer brigadista",
  "Texto casco y antiparras",
  "Texto campera",
  "Texto guantes",
  "texto pantalon",
  "Texto botas",
] as const;

const ALL_LAYER_IDS = [...FIGURE_IDS, ...TEXT_IDS];

function baseFigure(overrides: Record<string, number> = {}): Record<string, number> {
  const layers: Record<string, number> = {};
  for (const id of FIGURE_IDS) layers[id] = DIM;
  for (const id of TEXT_IDS) layers[id] = OFF;
  return { ...layers, ...overrides };
}

const FIGURE_ON = {
  mochila: ON,
  pala: ON,
  Antorcha: ON,
  campera: ON,
  Guantes: ON,
  Accesorios: ON,
  Cabeza: ON,
  "Casco Xray": OFF,
  "Botas normal": ON,
  pantalon: ON,
} as const;

const STEPS: AnatomyStep[] = [
  {
    kind: "front",
    id: "overview",
    title: null,
    summary: ["El equipo completo del brigadista forestal."],
    focus: { x: 0.485, y: 0.5, scale: 1.15 },
    panelMinVh: 55,
    layers: baseFigure({
      ...FIGURE_ON,
      "Textos sobre primer brigadista": OFF,
    }),
  },
  {
    kind: "front",
    id: "labels",
    title: null,
    summary: [
      "Casco, antiparras, campera, guantes, pantalón, botas y herramientas del combate.",
    ],
    focus: { x: 0.46, y: 0.5, scale: 1.08 },
    panelMinVh: 100,
    layers: baseFigure({
      ...FIGURE_ON,
      "Textos sobre primer brigadista": ON,
    }),
  },
  {
    kind: "front",
    id: "casco",
    title: "El casco y antiparras",
    summary: [
      "Interior del casco: foam ignífugo que amortigua golpes y resiste la llama.",
      "Ruleta de ajuste rápido (Ratchet).",
      "Banda perimetral y de sudor acolchada.",
      "Cubrenucas ignífugo de Nomex o Kevlar.",
    ],
    focus: { x: 0.54, y: 0.145, scale: 3.3 },
    panelMinVh: 120,
    layers: baseFigure({
      Cabeza: ON,
      "Casco Xray": ON,
      campera: DIM,
      "Texto casco y antiparras": ON,
    }),
  },
  {
    kind: "front",
    id: "campera",
    title: "La campera",
    summary: [
      "Cinta reflectiva para mayor visualización.",
      "Tejido inherentemente ignífugo, repelente al agua y con aislante térmico.",
      "Puño extendido con ajuste de velcro.",
    ],
    focus: { x: 0.58, y: 0.34, scale: 1.85 },
    panelMinVh: 120,
    layers: baseFigure({
      campera: ON,
      Cabeza: DIM,
      Guantes: DIM,
      Accesorios: DIM,
      "Texto campera": ON,
    }),
  },
  {
    kind: "front",
    id: "guantes",
    title: "Los guantes",
    summary: [
      "Exterior de cuero vacuno y refuerzo térmico con fibra de vidrio.",
      "Membrana impermeable y capas interiores de aramida y algodón.",
      "Palma y nudillos reforzados.",
    ],
    focus: { x: 0.58, y: 0.505, scale: 3.7 },
    panelMinVh: 120,
    layers: baseFigure({
      Guantes: ON,
      campera: DIM,
      pantalon: DIM,
      "Texto guantes": ON,
    }),
  },
  {
    kind: "front",
    id: "pantalon",
    title: "El pantalón",
    summary: [
      "Refuerzos y costuras triples en zonas de fricción.",
      "Fuelle y pinzas de flexión en la rodilla.",
      "Botamangas con velcro hacia atrás para evitar enganches.",
    ],
    focus: { x: 0.58, y: 0.68, scale: 1.9 },
    panelMinVh: 120,
    layers: baseFigure({
      pantalon: ON,
      Guantes: DIM,
      "Botas normal": DIM,
      campera: DIM,
      "texto pantalon": ON,
    }),
  },
  {
    kind: "front",
    id: "botas",
    title: "Calzado de montaña",
    summary: [
      "Caña alta y lengüeta acolchadas.",
      "Cuero vacuno interior y exterior.",
      "Puntera y contrafuerte reforzados.",
      "Suela de caucho natural cocida y atornillada.",
    ],
    focus: { x: 0.545, y: 0.86, scale: 3.25 },
    panelMinVh: 120,
    layers: baseFigure({
      "Botas normal": ON,
      pantalon: DIM,
      "Texto botas": ON,
    }),
  },
  {
    kind: "back",
    id: "mochila-tactica",
    title: "Mochilas y herramientas",
    packLabel: "Mochila táctica",
    packBody:
      "Utilizada por los brigadistas lineeros, transporta mangueras, acoples y otros elementos necesarios para el funcionamiento de la motobomba. Su función es brindar apoyo logístico y asegurar el suministro de agua en las tareas de extinción.",
    packImage: "/brigadista/espaldas/mochila-tactica.png",
    // Height-match Figma + nudge visual sobre espalda.png
    fit: { widthPct: 84, leftPct: 6, topPct: 0 },
    summary: [
      "Mochila táctica de los brigadistas lineeros para apoyo logístico de la motobomba.",
    ],
    panelMinVh: 120,
  },
  {
    kind: "back",
    id: "mochila-agua",
    title: "Mochilas y herramientas",
    packLabel: "Mochila de agua",
    packBody:
      "Utilizada por los brigadistas de ataque, carga una mochila forestal con aproximadamente 20 litros de agua y utiliza una lanza para aplicarla. Su función es enfriar puntos calientes y combatir focos de fuego en zonas donde las mangueras no llegan.",
    packImage: "/brigadista/espaldas/mochila-agua.png",
    fit: { widthPct: 84, leftPct: 12, topPct: 3.5 },
    summary: [
      "Mochila de agua (~20 L) para enfriar puntos calientes donde no llegan las mangueras.",
    ],
    panelMinVh: 110,
  },
  {
    kind: "back",
    id: "mochila-motobomba",
    title: "Mochilas y herramientas",
    packLabel: "Mochila de la motobomba",
    packBody:
      "Utilizada por el brigadista bobero, transporta exclusivamente la motobomba de alta presión. Su función es proveer el bombeo de agua principal durante la extinción, siendo una tarea de gran exigencia física que exime al brigadista de cargar otras herramientas.",
    packImage: "/brigadista/espaldas/mochila-motobomba.png",
    fit: { widthPct: 88, leftPct: 7, topPct: -1 },
    summary: [
      "Mochila de la motobomba: bombeo principal de agua, a cargo del brigadista bobero.",
    ],
    panelMinVh: 110,
  },
];

function focusTransform(focus: Focus) {
  const tx = -(focus.x - 0.5) * focus.scale * 100;
  const ty = -(focus.y - 0.5) * focus.scale * 100;
  return `translate(-50%, -50%) translate(${tx}%, ${ty}%) scale(${focus.scale})`;
}

function rewriteSvgAssetPaths(svgText: string) {
  return svgText
    .replaceAll('xlink:href="layers/', `xlink:href="${withBasePath("/brigadista/layers/")}`)
    .replaceAll('href="layers/', `href="${withBasePath("/brigadista/layers/")}`);
}

function applyLayerOpacities(root: Element, layers: Record<string, number>) {
  for (const id of ALL_LAYER_IDS) {
    const el = root.querySelector(`[id="${CSS.escape(id)}"]`) as SVGElement | null;
    if (!el) continue;
    el.style.transition = "opacity 700ms cubic-bezier(0.22, 1, 0.36, 1)";
    el.style.opacity = String(layers[id] ?? OFF);
    el.style.pointerEvents = "none";
  }
}

export function BrigadistaAnatomy() {
  const [stepId, setStepId] = useState(STEPS[0].id);
  const [svgReady, setSvgReady] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);
  const activeIndex = STEPS.findIndex((step) => step.id === stepId);
  const activeStep = STEPS[activeIndex] ?? STEPS[0];
  const isBack = activeStep.kind === "back";
  const frontStep = activeStep.kind === "front" ? activeStep : null;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    fetch(withBasePath("/brigadista/completo.svg"))
      .then((res) => {
        if (!res.ok) throw new Error(`SVG ${res.status}`);
        return res.text();
      })
      .then((text) => {
        if (cancelled || !hostRef.current) return;
        hostRef.current.innerHTML = rewriteSvgAssetPaths(text);
        const svg = hostRef.current.querySelector("svg");
        if (svg) {
          svg.setAttribute("role", "img");
          svg.setAttribute("aria-label", "Anatomía del brigadista forestal");
          svg.style.display = "block";
          svg.style.width = "100%";
          svg.style.height = "100%";
          const first = STEPS.find((s) => s.kind === "front");
          if (first && first.kind === "front") {
            applyLayerOpacities(svg, first.layers);
          }
        }
        setSvgReady(true);
      })
      .catch(() => {
        if (!cancelled) setSvgReady(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    const svg = host?.querySelector("svg");
    if (!svg || !svgReady || !frontStep) return;
    applyLayerOpacities(svg, frontStep.layers);
  }, [frontStep, svgReady]);

  useEffect(() => {
    const syncFromScroll = () => {
      const mid = window.innerHeight * 0.45;
      let best = STEPS[0];
      let bestDist = Infinity;

      for (const step of STEPS) {
        const el = document.getElementById(`brigadista-panel-${step.id}`);
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
    <div className="relative mt-10">
      <div className="sticky top-0 z-10 h-svh overflow-hidden bg-background">
        {/* Frente: SVG de capas */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-700 ease-out"
          style={{ opacity: isBack ? 0 : svgReady ? 1 : 0 }}
          aria-hidden={isBack}
        >
          <div
            className="absolute top-1/2 left-1/2 h-[min(100svh,920px)] will-change-transform transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            style={{
              width: `calc(min(100svh, 920px) * ${SVG_ASPECT})`,
              maxWidth: "160vw",
              transform: focusTransform(
                frontStep?.focus ?? { x: 0.5, y: 0.5, scale: 1 },
              ),
            }}
          >
            <div ref={hostRef} className="h-full w-full" />
          </div>
        </div>

        {/* Espaldas: base + mochila */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-700 ease-out"
          style={{ opacity: isBack ? 1 : 0 }}
          aria-hidden={!isBack}
        >
          <div className="absolute inset-0 flex items-center justify-center px-4 md:px-10">
            <div className="relative flex h-[min(88svh,820px)] w-full max-w-[1100px] items-center justify-center gap-3 md:gap-8">
              {/* Frame compartido = aspecto de espalda; el pack se ancla en % de este box. */}
              <div
                className="relative h-full shrink-0 overflow-visible"
                style={{ aspectRatio: `${ESPALDA_ASPECT}` }}
              >
                <Image
                  src={withBasePath("/brigadista/espaldas/espalda.png")}
                  alt=""
                  fill
                  sizes="420px"
                  className="object-contain object-center opacity-65"
                  priority
                />
                {STEPS.filter((s): s is BackStep => s.kind === "back").map(
                  (step) => {
                    const active = step.id === activeStep.id;
                    return (
                      <div
                        key={step.id}
                        className="absolute transition-opacity duration-700 ease-out"
                        style={{
                          opacity: active ? 1 : 0,
                          left: `${step.fit.leftPct}%`,
                          top: `${step.fit.topPct}%`,
                          width: `${step.fit.widthPct}%`,
                        }}
                      >
                        <Image
                          src={withBasePath(step.packImage)}
                          alt=""
                          width={900}
                          height={1100}
                          sizes="420px"
                          className="h-auto w-full"
                        />
                      </div>
                    );
                  },
                )}
              </div>

              <div className="relative hidden min-w-0 flex-1 md:block">
                {STEPS.filter((s): s is BackStep => s.kind === "back").map(
                  (step) => {
                    const active = step.id === activeStep.id;
                    return (
                      <div
                        key={step.id}
                        className="absolute inset-x-0 top-1/2 -translate-y-1/2 transition-opacity duration-700 ease-out"
                        style={{ opacity: active ? 1 : 0 }}
                      >
                        <div className="mb-3 h-px w-16 bg-foreground/80" />
                        <p className="font-display text-xl font-bold md:text-2xl">
                          {step.packLabel}
                        </p>
                        <p className="mt-3 max-w-[36ch] text-sm leading-relaxed text-foreground/85 md:text-base">
                          {step.packBody}
                        </p>
                      </div>
                    );
                  },
                )}
                <div className="invisible" aria-hidden>
                  <p className="text-xl md:text-2xl">Mochila de la motobomba</p>
                  <p className="mt-3 max-w-[36ch] text-sm md:text-base">
                    Utilizada por el brigadista bobero, transporta exclusivamente
                    la motobomba de alta presión. Su función es proveer el
                    bombeo de agua principal durante la extinción, siendo una
                    tarea de gran exigencia física que exime al brigadista de
                    cargar otras herramientas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-20 bg-gradient-to-b from-background from-0% via-background/55 via-[45%] to-transparent to-[85%]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-20 bg-gradient-to-t from-background from-0% via-background/55 via-[45%] to-transparent to-[85%]"
        />

        {activeStep.title ? (
          <div className="pointer-events-none absolute inset-x-0 top-[10%] z-20 flex justify-center px-4 md:justify-start md:pl-[8%]">
            <div
              className="border border-foreground/85 bg-background/25 px-4 py-2 backdrop-blur-[2px]"
              key={activeStep.title + (activeStep.kind === "back" ? "-back" : "")}
            >
              <p className="font-display text-lg font-bold tracking-wide text-foreground md:text-2xl">
                {activeStep.title}
              </p>
            </div>
          </div>
        ) : null}

        <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 px-4 md:hidden">
          <article className="ui-panel ui-panel--accent max-h-[38svh] overflow-y-auto overscroll-contain px-4 py-3.5">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-accent uppercase">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(STEPS.length).padStart(2, "0")}
            </p>
            <h4 className="mt-1.5 font-sans text-base font-bold">
              {activeStep.kind === "back"
                ? activeStep.packLabel
                : (activeStep.title ?? "Equipo completo")}
            </h4>
            <ul className="mt-2 space-y-1.5 text-xs leading-snug text-foreground/80">
              {(activeStep.kind === "back"
                ? [activeStep.packBody]
                : activeStep.summary
              ).map((item) => (
                <li key={item.slice(0, 48)} className="border-l border-accent/70 pl-2.5">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>

      <div className="pointer-events-none relative z-20 -mt-[100svh]">
        {STEPS.map((step) => (
          <article
            key={step.id}
            id={`brigadista-panel-${step.id}`}
            className="relative"
            style={{ minHeight: `${step.panelMinVh}vh` }}
            aria-current={step.id === activeStep.id ? "step" : undefined}
          />
        ))}
      </div>
    </div>
  );
}
