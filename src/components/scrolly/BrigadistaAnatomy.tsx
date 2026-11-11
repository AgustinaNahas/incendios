"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { withBasePath } from "@/lib/paths";

/** Rectángulo de zoom en coords normalizadas del SVG (0–1). */
type ZoomRect = { x: number; y: number; w: number; h: number };

type DetailItem = {
  n: number;
  label: string;
  body?: string;
  subitems?: string[];
};

type FrontStep = {
  kind: "front";
  id: string;
  title: string;
  body?: string;
  items?: DetailItem[];
  zoom: ZoomRect;
  /** Desplaza el centro del zoom a la derecha (fracción del viewport). */
  panX?: number;
  layers: Record<string, number>;
  panelMinVh: number;
};

type PackFit = {
  widthPct: number;
  leftPct: number;
  topPct: number;
};

type BackStep = {
  kind: "back";
  id: string;
  title: string;
  packLabel: string;
  packBody: string;
  packImage: string;
  fit: PackFit;
  panelMinVh: number;
};

const ESPALDA_ASPECT = 975 / 1080;

type AnatomyStep = FrontStep | BackStep;

const SVG_W = 7814;
const SVG_H = 6183;
const SVG_ASPECT = SVG_W / SVG_H;
const DIM = 0.2;
const ON = 1;
const OFF = 0;

/** Zoom rects desde BRIGADITA_ZOOM_NUMERO (ocultos; solo guían el contain). */
function zoomFromSvg(x: number, y: number, w: number, h: number): ZoomRect {
  return { x: x / SVG_W, y: y / SVG_H, w: w / SVG_W, h: h / SVG_H };
}

const ZOOM = {
  /** Cuerpo completo: columna de la figura, para overview. */
  overview: zoomFromSvg(3000, 320, 2200, 5480),
  casco: zoomFromSvg(3221.48, 381.274, 2195.5, 1266.14),
  campera: zoomFromSvg(1980.51, 486.096, 5332.88, 3052.49),
  guantes: zoomFromSvg(3693.87, 2481.38, 2079.25, 1199.1),
  pantalon: zoomFromSvg(1931.08, 2601.3, 5493.67, 3168.18),
  botas: zoomFromSvg(3343.63, 4443.84, 2334.88, 1347.25),
} as const;

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

const NUMBER_IDS = [
  "Numeros Casco",
  "Numeros campera",
  "Numeros Guante",
  "Numeros pantalon",
  "Numeros BOTAS",
] as const;

const ALL_LAYER_IDS = [...FIGURE_IDS, ...TEXT_IDS, ...NUMBER_IDS];

function baseFigure(overrides: Record<string, number> = {}): Record<string, number> {
  const layers: Record<string, number> = {};
  for (const id of FIGURE_IDS) layers[id] = DIM;
  for (const id of TEXT_IDS) layers[id] = OFF;
  for (const id of NUMBER_IDS) layers[id] = OFF;
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
    id: "equipamiento",
    title: "Equipamiento",
    body:
      "Su indumentaria incluye chaqueta y pantalón ignífugo, casco con antiparras, guantes, botas, linterna y mochilas según su función; para la línea de fuego lleva palas forestales, y para comunicarse, handys y equipos satelitales.",
    zoom: ZOOM.overview,
    // Empuja el foco a la derecha → el brigadista queda más a la izquierda, con aire vs la card.
    panX: 0.1,
    panelMinVh: 100,
    layers: baseFigure({ ...FIGURE_ON }),
  },
  {
    kind: "front",
    id: "casco",
    title: "Casco y antiparras",
    items: [
      {
        n: 1,
        label: "Casco con ruleta",
        body:
          "Interior de foam ignífugo. Ruleta interior para fijar el arnés del casco en el perímetro exacto de la cabeza.",
      },
      {
        n: 2,
        label: "Cubrenuca",
        body: "Tela nomex o kevlar ignífuga. Protege el cuello de chispas.",
      },
      {
        n: 3,
        label: "Antiparras",
        body:
          "Visor de policarbonato oftálmico de alta transparencia resistente a impactos, abrasión y anti-empañante.",
      },
    ],
    zoom: ZOOM.casco,
    panelMinVh: 120,
    layers: baseFigure({
      Cabeza: ON,
      "Casco Xray": ON,
      campera: DIM,
      Antorcha: OFF,
      "Numeros Casco": ON,
    }),
  },
  {
    kind: "front",
    id: "campera",
    title: "Campera",
    items: [
      {
        n: 4,
        label: "Franja reflectiva",
        body:
          "Hace visible al personal en condiciones de poca luz, en entornos con polvo o humo.",
      },
      {
        n: 5,
        label: "Capas protectoras",
        subitems: [
          "Tejido ignífugo",
          "Repelencia al agua",
          "Aislamiento térmico",
          "Bajo gradiente térmico",
        ],
      },
      {
        n: 6,
        label: "Puño extendido",
        body: "Con velcro para mayor protección.",
      },
    ],
    zoom: ZOOM.campera,
    panelMinVh: 120,
    layers: baseFigure({
      campera: ON,
      Cabeza: DIM,
      Guantes: DIM,
      Accesorios: DIM,
      Antorcha: OFF,
      "Numeros campera": ON,
    }),
  },
  {
    kind: "front",
    id: "guantes",
    title: "Guantes",
    items: [
      {
        n: 7,
        label: "Capas protectoras",
        subitems: [
          "Cuero vacuno",
          "Refuerzo térmico con 40% de fibra de vidrio",
          "Membrana impermeable",
          "Capa de aramida 100%",
          "Algodón resistente a las llamas",
        ],
      },
      {
        n: 8,
        label: "Palma y nudillos",
        body: "Reforzados con cuero vacuno.",
      },
    ],
    zoom: ZOOM.guantes,
    panelMinVh: 120,
    layers: baseFigure({
      Guantes: ON,
      campera: DIM,
      pantalon: DIM,
      Antorcha: OFF,
      "Numeros Guante": ON,
    }),
  },
  {
    kind: "front",
    id: "pantalon",
    title: "Pantalón",
    items: [
      {
        n: 9,
        label: "Refuerzos",
        body:
          "Doble tela y costuras internas triples en áreas de alta fricción.",
      },
      {
        n: 10,
        label: "Fuelle 3D",
        body:
          "Facilitar los movimientos exigentes en el área de las rodillas y evita el descalce. Volumen cóncavo generado por la costura de los pliegues.",
      },
      {
        n: 11,
        label: "Botamanga",
        body:
          "Con cierre y sistema de ajuste con velcro cuya solapa va hacia atrás para evitar enganches.",
      },
    ],
    zoom: ZOOM.pantalon,
    panelMinVh: 120,
    layers: baseFigure({
      pantalon: ON,
      Guantes: DIM,
      "Botas normal": DIM,
      campera: DIM,
      Antorcha: OFF,
      "Numeros pantalon": ON,
    }),
  },
  {
    kind: "front",
    id: "botas",
    title: "Botas",
    items: [
      {
        n: 12,
        label: "Caña alta",
        body: "Acolchada con espuma de alta densidad.",
      },
      {
        n: 13,
        label: "Material",
        body:
          "Interior y exterior de cuero vacuno para mejor aislamiento térmico y resistencia.",
      },
      {
        n: 14,
        label: "Puntera",
        body: "Reforzada con foam.",
      },
      {
        n: 15,
        label: "Suela",
        body:
          "De caucho natural, cocida a mano con tornillos para que no se despegue con el calor del fuego.",
      },
    ],
    zoom: ZOOM.botas,
    panelMinVh: 120,
    layers: baseFigure({
      "Botas normal": ON,
      pantalon: DIM,
      Antorcha: OFF,
      "Numeros BOTAS": ON,
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
    fit: { widthPct: 84, leftPct: 6, topPct: 0 },
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
    panelMinVh: 110,
  },
];

/**
 * Contiene el rectángulo de zoom en el 100% del viewport:
 * ajusta al ancho o al alto según cuál limite primero (object-fit: contain).
 * La card flota encima; no reserva espacio.
 */
function containTransform(
  zoom: ZoomRect,
  viewport: { width: number; height: number },
  baseHeight: number,
  panX = 0,
) {
  if (viewport.width <= 0 || viewport.height <= 0 || baseHeight <= 0) {
    return "translate(-50%, -50%) scale(1)";
  }

  const baseWidth = baseHeight * SVG_ASPECT;
  const scale = Math.min(
    viewport.width / (zoom.w * baseWidth),
    viewport.height / (zoom.h * baseHeight),
  );

  const cx = zoom.x + zoom.w / 2 + panX;
  const cy = zoom.y + zoom.h / 2;
  const tx = -(cx - 0.5) * scale * 100;
  const ty = -(cy - 0.5) * scale * 100;

  return `translate(-50%, -50%) translate(${tx}%, ${ty}%) scale(${scale})`;
}

/** Mismo ancho que las cards del mapa; centro en 66vw (espejo del 33vw). */
const SCROLLER_CARD_STYLE = {
  width: "min(450px, calc(100vw - 2rem))",
  marginLeft:
    "max(1rem, min(calc(100vw - 1rem - min(450px, calc(100vw - 2rem))), calc(66vw - min(225px, calc(50vw - 1rem)))))",
} as const;

const SCROLLER_CARD_CLASS =
  "ui-panel ui-panel--accent pointer-events-auto max-h-[min(72svh,calc(100svh-5.5rem))] overflow-y-auto overscroll-contain px-5 py-5 md:max-h-none md:overflow-visible md:px-6 md:py-6";

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

function FrontCard({ step }: { step: FrontStep }) {
  return (
    <article className={SCROLLER_CARD_CLASS} style={SCROLLER_CARD_STYLE}>
      <h3 className="font-sans text-2xl leading-tight font-bold text-white md:text-3xl">
        {step.title}
      </h3>
      {step.body ? (
        <p className="mt-3 text-md leading-relaxed text-white">{step.body}</p>
      ) : null}
      {step.items?.length ? (
        <ul className={step.body ? "mt-5 space-y-4" : "mt-4 space-y-4"}>
          {step.items.map((item) => (
            <li key={item.n}>
              <p className="font-sans text-lg leading-snug font-bold text-white/90 md:text-xl">
                <span className="tabular-nums">{item.n}.</span> {item.label}
              </p>
              {item.body ? (
                <p className="mt-1 text-md leading-relaxed text-white">
                  {item.body}
                </p>
              ) : null}
              {item.subitems?.length ? (
                <ul className="mt-1.5 space-y-0.5 text-md leading-relaxed text-white">
                  {item.subitems.map((sub, i) => (
                    <li key={sub}>
                      <span className="font-bold">
                        {String.fromCharCode(97 + i)}.
                      </span>{" "}
                      {sub}
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

function PackCard({ label, body }: { label: string; body: string }) {
  return (
    <article className={SCROLLER_CARD_CLASS} style={SCROLLER_CARD_STYLE}>
      <h3 className="font-sans text-2xl leading-tight font-bold text-white md:text-3xl">
        {label}
      </h3>
      <p className="mt-3 text-md leading-relaxed text-white">{body}</p>
    </article>
  );
}

export function BrigadistaAnatomy() {
  const [stepId, setStepId] = useState(STEPS[0].id);
  const [svgReady, setSvgReady] = useState(false);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const hostRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const activeIndex = STEPS.findIndex((step) => step.id === stepId);
  const activeStep = STEPS[activeIndex] ?? STEPS[0];
  const isBack = activeStep.kind === "back";
  const frontStep = activeStep.kind === "front" ? activeStep : null;

  const baseHeight = stageSize.height > 0 ? stageSize.height : 800;

  const frontTransform = useMemo(() => {
    if (!frontStep) return "translate(-50%, -50%) scale(1)";
    return containTransform(
      frontStep.zoom,
      stageSize,
      baseHeight,
      frontStep.panX ?? 0,
    );
  }, [frontStep, stageSize, baseHeight]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const measure = () => {
      const rect = stage.getBoundingClientRect();
      setStageSize({ width: rect.width, height: rect.height });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

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
      <div
        ref={stageRef}
        className="sticky top-0 z-10 h-svh overflow-hidden bg-background"
      >
        {/* Frente: SVG de capas */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-700 ease-out"
          style={{ opacity: isBack ? 0 : svgReady ? 1 : 0 }}
          aria-hidden={isBack}
        >
          <div
            className="absolute top-1/2 left-1/2 will-change-transform transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            style={{
              height: baseHeight,
              width: baseHeight * SVG_ASPECT,
              transform: frontTransform,
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
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Figura a pantalla completa; la card flota al 66vw encima. */}
            <div
              className="relative h-full max-h-svh overflow-visible"
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

        {/* Cards: mismo layout que el mapa, centro al 66vw */}
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center">
          <div className="w-full">
            {frontStep ? (
              <FrontCard key={frontStep.id} step={frontStep} />
            ) : activeStep.kind === "back" ? (
              <PackCard
                key={activeStep.id}
                label={activeStep.packLabel}
                body={activeStep.packBody}
              />
            ) : null}
          </div>
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
