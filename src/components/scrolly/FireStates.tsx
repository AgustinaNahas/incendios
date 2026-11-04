"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/paths";

const FIRE_STATES = [
  {
    title: "Fuera de control",
    image: "/estados/1-fuera-de-control.png",
    body: "El fuego se propaga libremente. Fuegos que aún no han sido atacados, o que no han podido ser contenidos.",
  },
  {
    title: "Detenido o contenido",
    image: "/estados/2-detenido.png",
    body: "Por cualquier circunstancia natural, ambiental, o a raíz de los trabajos de combate, la propagación se ha detenido en uno o más sectores del incendio.",
  },
  {
    title: "Circunscripto",
    image: "/estados/3-circunscripto.png",
    body: "Los trabajos de contención abarcan todo el perímetro pero no están definitivamente terminados.",
  },
  {
    title: "Controlado",
    image: "/estados/4-controlado.png",
    body: "La línea de control ha quedado establecida definitivamente, anclada y asegurada. El incendio puede mostrar actividad y humo en su interior, pero los trabajos se han completado en todo el perímetro.",
  },
  {
    title: "Extinguido",
    image: "/estados/5-extinguido.png",
    body: "El incendio no muestra signos de actividad en ninguna de sus partes.",
  },
] as const;

/** Recorrido sticky por estado, en vh. El bloque no ocupa toda la pantalla. */
const STEP_RUNWAY_VH = 42;
const GAP = 14;
const BORDER = 2;
const EASE =
  "duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:duration-0";

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

/** Ancho de una tarjeta cerrada: la activa ocupa dos de estos espacios. */
function collapsedWidth(viewport: number) {
  const peek = viewport < 640 ? 0.22 : 0.46;
  let collapsed = (viewport - GAP * 2) / (2 + peek * 2);
  const minText = Math.min(210, Math.max(132, viewport * 0.34));
  if (collapsed < minText) {
    collapsed = Math.min(minText, (viewport - GAP) * 0.46);
  }
  return Math.max(112, collapsed);
}

function trackShift(index: number, collapsed: number, viewport: number) {
  const closed = collapsed + BORDER;
  const open = collapsed * 2 + BORDER;
  const left = index * (closed + GAP);
  return viewport / 2 - (left + open / 2);
}

export function FireStates() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);
  const indexRef = useRef(0);
  const [index, setIndex] = useState(0);
  const [live, setLive] = useState("");
  const [ready, setReady] = useState(false);
  const [frame, setFrame] = useState({ width: 0, collapsed: 180 });

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const measure = () => {
      const width = viewport.clientWidth;
      if (width <= 0) return;
      const collapsed = collapsedWidth(width);
      setFrame((prev) => {
        if (
          Math.abs(prev.width - width) < 0.5 &&
          Math.abs(prev.collapsed - collapsed) < 0.5
        ) {
          return prev;
        }
        return { width, collapsed };
      });
      setReady(true);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    // El primer frame queda ya medido y abierto, sin animar la entrada.
    const id = requestAnimationFrame(() => setReady(true));
    return () => {
      cancelAnimationFrame(id);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const sticky = stickyRef.current;
    if (!root || !sticky) return;

    const runwayPx = () =>
      window.innerHeight * (STEP_RUNWAY_VH / 100) * FIRE_STATES.length;

    const measure = () => {
      const runway = runwayPx();
      root.style.height = `${sticky.offsetHeight + runway}px`;
      root.style.marginBottom = "0px";
    };

    const update = () => {
      const runway = Math.max(1, root.offsetHeight - sticky.offsetHeight);
      const raw = clamp(-root.getBoundingClientRect().top / runway);
      const next =
        raw >= 1
          ? FIRE_STATES.length - 1
          : Math.max(0, Math.floor(raw * FIRE_STATES.length));
      if (indexRef.current === next) return;
      indexRef.current = next;
      setIndex(next);
      const rect = root.getBoundingClientRect();
      const inView = rect.bottom > 0 && rect.top < window.innerHeight;
      if (mountedRef.current && inView) {
        const state = FIRE_STATES[next];
        setLive(`${state.title}. ${state.body}`);
      }
    };

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    update();
    mountedRef.current = true;
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const goTo = (step: number) => {
    const root = rootRef.current;
    const sticky = stickyRef.current;
    if (!root || !sticky) return;
    const runway = Math.max(1, root.offsetHeight - sticky.offsetHeight);
    const rootDoc = root.getBoundingClientRect().top + window.scrollY;
    const progress = (step + 0.45) / FIRE_STATES.length;
    window.scrollTo({ top: rootDoc + progress * runway, behavior: "smooth" });
  };

  const collapsed = frame.collapsed;
  const shift =
    frame.width > 0 ? trackShift(index, collapsed, frame.width) : 0;

  return (
    <div ref={rootRef} className="relative mt-10">
      <div ref={stickyRef} className="sticky top-3 z-20 bg-background pb-2 md:top-[8vh]">
        <h3 className="font-sans text-xl font-bold md:text-2xl">
          Estados de un incendio
        </h3>

        <div className="relative left-1/2 mt-6 w-screen -translate-x-1/2">
          <div className="relative mx-auto max-w-[960px]">
            <div ref={viewportRef} className="overflow-hidden py-2 md:py-6">
              <div
                className={`flex items-stretch ${ready ? `transition-transform ${EASE}` : ""}`}
                style={{
                  gap: GAP,
                  transform: `translate3d(${shift}px, 0, 0)`,
                }}
              >
                {FIRE_STATES.map((state, i) => {
                  const on = i === index;
                  const reached = i <= index;
                  const pad = String(i + 1).padStart(2, "0");
                  return (
                    <button
                      key={state.title}
                      type="button"
                      aria-label={state.title}
                      aria-current={on ? "step" : undefined}
                      onClick={() => goTo(i)}
                      className={`grid h-[13rem] shrink-0 cursor-pointer overflow-hidden border text-left sm:h-[19rem] md:h-80 ${
                        ready ? `transition-[width,grid-template-columns,border-color,background-color,opacity,box-shadow] ${EASE}` : ""
                      } ${
                        on
                          ? "z-10 border-accent bg-accent-deep shadow-[0_0_36px_rgba(241,98,26,0.32)]"
                          : reached
                            ? "border-accent/30 bg-panel-muted opacity-90"
                            : "border-foreground/15 bg-panel-muted opacity-70"
                      }`}
                      style={{
                        width: (on ? collapsed * 2 : collapsed) + BORDER,
                        gridTemplateColumns: on
                          ? `${collapsed}px ${collapsed}px`
                          : `${collapsed}px 0px`,
                      }}
                    >
                      <div className="relative min-w-0">
                        <Image
                          src={withBasePath(state.image)}
                          alt=""
                          fill
                          sizes={`${Math.round(collapsed)}px`}
                          className="object-contain p-2 sm:p-3"
                        />
                        <span
                          aria-hidden
                          className={`pointer-events-none absolute top-2.5 left-2.5 font-sans text-[11px] font-bold tracking-[0.14em] text-accent transition-opacity duration-300 ${
                            on ? "opacity-0" : "opacity-100"
                          }`}
                        >
                          {pad}
                        </span>
                      </div>
                      <div
                        className={`h-full min-w-0 overflow-x-hidden overflow-y-auto overscroll-contain ${
                          on ? "border-l border-foreground/15" : ""
                        }`}
                      >
                        <div
                          className="flex min-h-full flex-col justify-center px-3.5 py-4 sm:px-5"
                          style={{ width: collapsed }}
                        >
                          <p className="text-[11px] font-semibold tracking-[0.18em] text-accent uppercase">
                            {pad} / {String(FIRE_STATES.length).padStart(2, "0")}
                          </p>
                          <h4 className="mt-2 font-sans text-base font-bold leading-tight sm:text-lg md:text-xl">
                            {state.title}
                          </h4>
                          <p className="mt-2 text-[13px] leading-snug text-foreground/85 sm:text-sm md:text-[15px] md:leading-relaxed">
                            {state.body}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 -left-1 z-10 w-20 bg-gradient-to-r from-background from-0% via-background/80 via-[40%] to-transparent"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 -right-1 z-10 w-20 bg-gradient-to-l from-background from-0% via-background/80 via-[40%] to-transparent"
            />
          </div>
        </div>

        <div
          className="mt-3 flex items-center justify-center gap-1.5"
          role="tablist"
          aria-label="Estados de un incendio"
        >
          {FIRE_STATES.map((state, i) => {
            const selected = i === index;
            return (
              <button
                key={state.title}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-label={`${i + 1}. ${state.title}`}
                onClick={() => goTo(i)}
                className={`h-2 w-2 rounded-full border border-accent transition-colors ${
                  selected ? "bg-accent" : "bg-transparent hover:bg-accent/40"
                }`}
              />
            );
          })}
        </div>

        <p className="sr-only" aria-live="polite">
          {live}
        </p>
        <p className="mt-3 pb-3 text-base leading-relaxed text-foreground/90 md:mt-8 md:pb-12 md:text-lg">
          Algunos incendios grandes, aunque sean dados por controlados, pueden
          no declararse extinguidos durante mucho tiempo.
        </p>
        <div className="border-t border-t-white/31 pb-3 md:pb-4"></div>

        <h2 className="type-h3 mt-4 md:mt-10">El contexto del fuego</h2>
        <p className="mt-2 line-clamp-3 text-base leading-relaxed text-foreground/90 md:line-clamp-none md:text-2xl">
          El riesgo puede ordenarse en tres niveles:{" "}
          <b>
            causas directas, factores de propagación y condiciones estructurales
          </b>
          .
        </p>
      </div>
    </div>
  );
}
