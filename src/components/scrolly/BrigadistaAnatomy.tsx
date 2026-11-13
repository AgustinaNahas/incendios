"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { withBasePath } from "@/lib/paths";

/** Rectángulo de zoom en coords normalizadas del SVG (0–1). */
type ZoomRect = { x: number; y: number; w: number; h: number };

type FabricFigure = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Pieza apaisada (fuelle): la columna de la imagen es más ancha. */
  wide?: boolean;
};

type DetailItem = {
  n: number;
  label: string;
  body?: string;
  subitems?: string[];
  /** Foto de la tela, al lado de la explicación. */
  figure?: FabricFigure;
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

type BackStep = {
  kind: "back";
  id: string;
  title: string;
  packLabel: string;
  packBody: string;
  panelMinVh: number;
};

const BACK_W = 1872;
const BACK_H = 1081;
const BACK_ASPECT = BACK_W / BACK_H;
const PACK_IDS = ["mochila-tactica", "mochila-agua", "mochila-motobomba"] as const;

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
        figure: {
          src: "/brigadista/capas/campera.png",
          alt: "Cuatro capas de la campera: tejido ignífugo, repelencia al agua, aislamiento térmico y bajo gradiente térmico",
          width: 1088,
          height: 1128,
        },
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
    panelMinVh: 140,
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
        figure: {
          src: "/brigadista/capas/guante.png",
          alt: "Cinco capas del guante, desde el cuero exterior hasta el algodón interior",
          width: 1152,
          height: 1196,
        },
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
    panelMinVh: 140,
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
        figure: {
          src: "/brigadista/capas/pantalon.png",
          alt: "Fuelle 3D del pantalón, con el volumen de los pliegues en la rodilla",
          width: 1144,
          height: 668,
          wide: true,
        },
        body:
          "Facilita los movimientos exigentes en el área de las rodillas y evita el descalce. Volumen cóncavo generado por la costura de los pliegues.",
      },
      {
        n: 11,
        label: "Botamanga",
        body:
          "Con cierre y sistema de ajuste con velcro cuya solapa va hacia atrás para evitar enganches.",
      },
    ],
    zoom: ZOOM.pantalon,
    panelMinVh: 140,
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
    panelMinVh: 120,
  },
  {
    kind: "back",
    id: "mochila-agua",
    title: "Mochilas y herramientas",
    packLabel: "Mochila de agua",
    packBody:
      "Utilizada por los brigadistas de ataque, carga una mochila forestal con aproximadamente 20 litros de agua y utiliza una lanza para aplicarla. Su función es enfriar puntos calientes y combatir focos de fuego en zonas donde las mangueras no llegan.",
    panelMinVh: 110,
  },
  {
    kind: "back",
    id: "mochila-motobomba",
    title: "Mochilas y herramientas",
    packLabel: "Mochila de la motobomba",
    packBody:
      "Utilizada por el brigadista bobero, transporta exclusivamente la motobomba de alta presión. Su función es proveer el bombeo de agua principal durante la extinción, siendo una tarea de gran exigencia física que exime al brigadista de cargar otras herramientas.",
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
  aspect: number,
  panX = 0,
) {
  if (viewport.width <= 0 || viewport.height <= 0 || baseHeight <= 0) {
    return "translate(-50%, -50%) scale(1)";
  }

  const baseWidth = baseHeight * aspect;
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

const LAYER_FADE = "opacity 700ms cubic-bezier(0.22, 1, 0.36, 1)";

const SCROLLER_CARD_CLASS =
  "ui-panel ui-panel--accent pointer-events-auto overflow-hidden motion-reduce:transition-none";

function rewriteSvgAssetPaths(svgText: string) {
  return svgText.replace(
    /(xlink:href|href)="(?!data:|https?:|\/|#)([^"]+)"/g,
    (_, attr: string, path: string) =>
      `${attr}="${withBasePath(`/brigadista/${path}`)}"`,
  );
}

function applyLayerOpacities(root: Element, layers: Record<string, number>) {
  const resolved: Record<string, number> = {
    ...layers,
    "Botas detalle": layers["Botas normal"] ?? OFF,
  };
  for (const id of [...ALL_LAYER_IDS, "Botas detalle"]) {
    const el = root.querySelector(`[id="${CSS.escape(id)}"]`) as SVGElement | null;
    if (!el) continue;
    el.style.transition = LAYER_FADE;
    el.style.opacity = String(resolved[id] ?? OFF);
    el.style.pointerEvents = "none";
  }
}

function applyBackOpacities(root: Element, activePackId: string) {
  for (const id of ["espalda", ...PACK_IDS]) {
    const el = root.querySelector(`[id="${CSS.escape(id)}"]`) as SVGElement | null;
    if (!el) continue;
    el.style.transition = LAYER_FADE;
    el.style.opacity = id === "espalda" || id === activePackId ? "1" : "0";
    el.style.pointerEvents = "none";
  }
}

function mountSvg(host: HTMLDivElement, text: string, label: string) {
  host.innerHTML = rewriteSvgAssetPaths(text);
  const svg = host.querySelector("svg");
  if (!svg) return null;
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", label);
  svg.style.display = "block";
  svg.style.width = "100%";
  svg.style.height = "100%";
  return svg;
}

function SubitemList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-0.5 font-sans text-[11px] leading-[1.45] font-normal text-white md:text-[14px]">
      {items.map((sub) => (
        <li key={sub}>{sub}</li>
      ))}
    </ul>
  );
}

function ItemNumber({ n }: { n: number }) {
  return (
    <span className="inline-flex size-[30px] shrink-0 items-center justify-center rounded-full border border-white/60 font-sans text-[11px] leading-none font-bold text-white tabular-nums md:text-[14px]">
      {n}
    </span>
  );
}

function CardCopy({ step }: { step: AnatomyStep }) {
  if (step.kind === "back") {
    return (
      <>
        <h3 className="font-sans text-[24px] leading-tight font-bold text-white md:text-[27px]">
          {step.packLabel}
        </h3>
        <p className="mt-3 font-sans text-[11px] leading-[1.45] font-normal text-white md:text-[14px]">
          {step.packBody}
        </p>
      </>
    );
  }

  return (
    <>
      <h3 className="font-sans text-[24px] leading-tight font-bold text-white md:text-[27px]">
        {step.title}
      </h3>
      {step.body ? (
        <p className="mt-3 font-sans text-[11px] leading-[1.45] font-normal text-white md:text-[14px]">
          {step.body}
        </p>
      ) : null}
      {step.items?.length ? (
        <ul className={step.body ? "mt-5 space-y-4" : "mt-4 space-y-4"}>
          {step.items.map((item) => (
            <li key={item.n}>
              <p className="flex items-center gap-2.5 font-sans text-[14px] leading-snug font-bold tracking-normal text-white uppercase md:text-[17px]">
                <ItemNumber n={item.n} />
                {item.label}
              </p>
              {item.figure ? (
                <div
                  className={
                    item.figure.wide
                      ? "mt-[5px] grid grid-cols-[8.75rem_minmax(0,1fr)] items-center gap-3 md:mt-2"
                      : "mt-[5px] grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[7rem_minmax(0,1fr)] md:mt-2"
                  }
                >
                  <img
                    src={withBasePath(item.figure.src)}
                    alt={item.figure.alt}
                    width={item.figure.width}
                    height={item.figure.height}
                    className="h-auto w-full"
                  />
                  <div>
                    {item.body ? (
                      <p className="font-sans text-[11px] leading-[1.45] font-normal text-white md:text-[14px]">
                        {item.body}
                      </p>
                    ) : null}
                    {item.subitems?.length ? (
                      <SubitemList items={item.subitems} />
                    ) : null}
                  </div>
                </div>
              ) : (
                <>
                  {item.body ? (
                    <p className="mt-[-2px] ml-[40px] font-sans text-[11px] leading-[1.45] font-normal text-white md:text-[14px]">
                      {item.body}
                    </p>
                  ) : null}
                  {item.subitems?.length ? (
                    <div className="mt-[-2px] ml-[40px]">
                      <SubitemList items={item.subitems} />
                    </div>
                  ) : null}
                </>
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

function AnatomyCard({
  step,
  onHeight,
}: {
  step: AnatomyStep;
  onHeight?: (height: number) => void;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(true);
  const [shown, setShown] = useState(step);
  const [visible, setVisible] = useState(true);
  const [height, setHeight] = useState<number | null>(null);
  const [armHeight, setArmHeight] = useState(false);
  visibleRef.current = visible;

  const measure = () => {
    const el = frameRef.current;
    if (!el) return;
    setHeight(el.offsetHeight);
  };

  useEffect(() => {
    if (height != null) onHeight?.(height);
  }, [height, onHeight]);

  useEffect(() => {
    if (step.id === shown.id) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(step);
      setVisible(true);
      return;
    }
    setVisible(false);
    const timeout = window.setTimeout(() => setShown(step), 240);
    return () => window.clearTimeout(timeout);
  }, [step, shown.id]);

  useEffect(() => {
    if (step.id !== shown.id) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      measure();
      setVisible(true);
      setArmHeight(true);
      return;
    }
    // Un frame con el alto viejo (texto nuevo todavía invisible) y después
    // alto y fade arrancan juntos.
    const id = requestAnimationFrame(() => {
      measure();
      setVisible(true);
      requestAnimationFrame(() => setArmHeight(true));
    });
    return () => cancelAnimationFrame(id);
  }, [shown, step.id]);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (!visibleRef.current) return;
      setHeight(el.offsetHeight);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [shown]);

  return (
    <article
      className={SCROLLER_CARD_CLASS}
      style={{
        ...SCROLLER_CARD_STYLE,
        height: height ?? undefined,
        transition: armHeight
          ? "height 520ms cubic-bezier(0.22, 1, 0.36, 1)"
          : "none",
      }}
      aria-live="polite"
    >
      <div
        ref={frameRef}
        className="px-5 py-5 transition-opacity duration-300 ease-out motion-reduce:transition-none md:px-6 md:py-6"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <CardCopy step={shown} />
      </div>
    </article>
  );
}

export function BrigadistaAnatomy() {
  const [stepId, setStepId] = useState(STEPS[0].id);
  const [svgReady, setSvgReady] = useState(false);
  const [backReady, setBackReady] = useState(false);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [cardHeight, setCardHeight] = useState(0);
  const hostRef = useRef<HTMLDivElement>(null);
  const backHostRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pinnedFrontRef = useRef<FrontStep>(
    STEPS.find((step): step is FrontStep => step.kind === "front")!,
  );
  const activeIndex = STEPS.findIndex((step) => step.id === stepId);
  const activeStep = STEPS[activeIndex] ?? STEPS[0];
  const isBack = activeStep.kind === "back";
  if (activeStep.kind === "front") pinnedFrontRef.current = activeStep;
  const zoomFront = pinnedFrontRef.current;

  const narrow = stageSize.width > 0 && stageSize.width < 768;
  const onCardHeight = useCallback((next: number) => {
    setCardHeight((prev) => (prev === next ? prev : next));
  }, []);
  const figureBottom =
    narrow && cardHeight > 0
      ? Math.min(cardHeight + 20, Math.round(window.innerHeight * 0.58))
      : 0;

  const baseHeight = stageSize.height > 0 ? stageSize.height : 800;
  const backZoom = useMemo<ZoomRect>(() => {
    if (stageSize.width > 0 && stageSize.width < 768) {
      return { x: 0, y: 0, w: 1120 / BACK_W, h: 1 };
    }
    return { x: 0, y: 0, w: 1, h: 1 };
  }, [stageSize.width]);

  const frontTransform = useMemo(() => {
    return containTransform(
      zoomFront.zoom,
      stageSize,
      baseHeight,
      SVG_ASPECT,
      narrow ? 0 : (zoomFront.panX ?? 0),
    );
  }, [zoomFront, stageSize, baseHeight, narrow]);

  const backTransform = useMemo(() => {
    return containTransform(backZoom, stageSize, baseHeight, BACK_ASPECT, 0);
  }, [backZoom, stageSize, baseHeight]);

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
        const svg = mountSvg(hostRef.current, text, "Anatomía del brigadista forestal");
        const first = STEPS.find((s) => s.kind === "front");
        if (svg && first && first.kind === "front") {
          applyLayerOpacities(svg, first.layers);
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
    const host = backHostRef.current;
    if (!host) return;

    let cancelled = false;
    fetch(withBasePath("/brigadista/espaldas.svg"))
      .then((res) => {
        if (!res.ok) throw new Error(`SVG ${res.status}`);
        return res.text();
      })
      .then((text) => {
        if (cancelled || !backHostRef.current) return;
        const svg = mountSvg(
          backHostRef.current,
          text,
          "Espalda del brigadista y mochilas",
        );
        if (svg) applyBackOpacities(svg, "mochila-tactica");
        setBackReady(true);
      })
      .catch(() => {
        if (!cancelled) setBackReady(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const svg = hostRef.current?.querySelector("svg");
    if (!svg || !svgReady || activeStep.kind !== "front") return;
    applyLayerOpacities(svg, activeStep.layers);
  }, [activeStep, svgReady]);

  useEffect(() => {
    const svg = backHostRef.current?.querySelector("svg");
    if (!svg || !backReady) return;
    const packId =
      activeStep.kind === "back"
        ? activeStep.id
        : activeStep.id === "botas"
          ? "mochila-tactica"
          : null;
    if (!packId) return;
    applyBackOpacities(svg, packId);
  }, [activeStep, backReady]);

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
        <div
          ref={stageRef}
          className="absolute inset-0"
          style={figureBottom > 0 ? { bottom: figureBottom } : undefined}
        >
        {/* Frente: SVG de capas */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none"
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

        {/* Espaldas: cuerpo + una mochila por vez, en el mismo SVG */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none"
          style={{ opacity: isBack && backReady ? 1 : 0 }}
          aria-hidden={!isBack}
        >
          <div
            className="absolute top-1/2 left-1/2 will-change-transform transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            style={{
              height: baseHeight,
              width: baseHeight * BACK_ASPECT,
              transform: backTransform,
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, #000 16%, #000 84%, transparent 100%)",
              maskImage:
                "linear-gradient(to bottom, transparent 0%, #000 16%, #000 84%, transparent 100%)",
            }}
          >
            <div ref={backHostRef} className="h-full w-full" />
          </div>
        </div>
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-20 bg-gradient-to-b from-background from-0% via-background/55 via-[45%] to-transparent to-[85%]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] hidden h-20 bg-gradient-to-t from-background from-0% via-background/55 via-[45%] to-transparent to-[85%] md:block"
        />

        {/* Mobile: card fija abajo. Desktop: centrada, igual que antes. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end pb-[max(0.5rem,env(safe-area-inset-bottom))] md:inset-0 md:items-center md:pb-0">
          <div className="w-full">
            <AnatomyCard step={activeStep} onHeight={onCardHeight} />
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
