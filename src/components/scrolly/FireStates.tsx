"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export function FireStates() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);
  const indexRef = useRef(0);
  const [index, setIndex] = useState(0);
  const [live, setLive] = useState("");

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
      const next = Math.min(
        FIRE_STATES.length - 1,
        Math.floor(raw * FIRE_STATES.length - 1e-6),
      );
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

  return (
    <div ref={rootRef} className="relative mt-10">
      <div ref={stickyRef} className="sticky top-[8vh] z-20 bg-[#2B2B2B] pb-2">
        <h3 className="font-sans text-xl font-bold md:text-2xl">
          Estados del incendio
        </h3>

        <div className="mt-6 flex items-stretch gap-1.5 sm:gap-2.5">
          {FIRE_STATES.map((state, i) => {
            const on = i === index;
            const reached = i <= index;
            return (
              <button
                key={state.title}
                type="button"
                aria-label={state.title}
                aria-current={on ? "step" : undefined}
                onClick={() => goTo(i)}
                className={`flex min-w-0 flex-1 cursor-pointer flex-col border text-left transition-all duration-500 ${
                  on
                    ? "border-[#f1621a] bg-[#1c120e] shadow-[0_0_28px_rgba(241,98,26,0.4)]"
                    : reached
                      ? "border-[#f1621a]/30 bg-[#161616]"
                      : "border-[#f3efe8]/12 bg-[#161616] opacity-45"
                }`}
              >
                <span
                  className={`px-1.5 pt-1.5 font-sans text-[10px] font-bold tracking-wide sm:px-2 sm:text-[11px] ${
                    on ? "text-[#f1621a]" : "text-[#f3efe8]/70"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="relative aspect-square w-full">
                  <Image
                    src={withBasePath(state.image)}
                    alt=""
                    fill
                    sizes="(max-width: 800px) 18vw, 150px"
                    className={`object-contain p-0.5 transition-transform duration-500 sm:p-1 ${
                      on ? "scale-[1.04]" : "scale-100"
                    }`}
                  />
                </span>
                <span
                  className={`hidden min-h-[2.6em] px-1.5 pb-2 text-center text-[11px] leading-tight font-semibold md:block md:px-2 ${
                    on ? "text-[#f3efe8]" : "text-[#f3efe8]/75"
                  }`}
                >
                  {state.title}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative mt-4 h-2" aria-hidden>
          <div className="absolute top-1/2 right-[10%] left-[10%] h-px -translate-y-1/2 bg-[#f3efe8]/15" />
          <div
            className="absolute top-1/2 left-[10%] h-px -translate-y-1/2 bg-[#f1621a] transition-[width] duration-500"
            style={{
              width: `${(index / (FIRE_STATES.length - 1)) * 80}%`,
            }}
          />
          <div className="absolute inset-0 flex">
            {FIRE_STATES.map((state, i) => (
              <span key={state.title} className="flex flex-1 items-center justify-center">
                <span
                  className={`size-2 rounded-full transition-colors duration-500 ${
                    i <= index ? "bg-[#f1621a]" : "bg-[#f3efe8]/25"
                  }`}
                />
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 grid">
          {FIRE_STATES.map((state, i) => {
            const on = i === index;
            return (
              <article
                key={state.title}
                aria-hidden={!on}
                className={`col-start-1 row-start-1 transition-all duration-500 ${
                  on ? "relative z-10" : "pointer-events-none"
                }`}
                style={{
                  opacity: on ? 1 : 0,
                  transform: on ? "translateY(0)" : "translateY(10px)",
                }}
              >
                <p className="text-[11px] font-semibold tracking-[0.18em] text-[#f1621a] uppercase">
                  {String(i + 1).padStart(2, "0")} /{" "}
                  {String(FIRE_STATES.length).padStart(2, "0")}
                </p>
                <h4 className="mt-2 font-sans text-lg font-bold md:text-2xl">
                  {state.title}
                </h4>
                <p className="mt-2 text-base leading-relaxed text-[#f3efe8]/85 md:text-lg">
                  {state.body}
                </p>
              </article>
            );
          })}
        </div>

        <p className="sr-only" aria-live="polite">
          {live}
        </p>
        <p className="mt-8 text-base leading-relaxed text-[#f3efe8]/90 md:text-lg">
          Algunos incendios grandes, aunque sean dados por controlados, pueden
          no declararse extinguidos durante mucho tiempo.
        </p>
        <h2 className="type-h3 mt-10">El contexto del fuego</h2>
        <p className="mt-6 text-base leading-relaxed text-[#f3efe8]/90 md:text-lg">
          ¿Qué condiciones hacen que un bosque sea más vulnerable al fuego
          incluso antes de que aparezca la primera llama? El riesgo puede
          ordenarse en tres niveles: causas directas, factores de propagación y
          condiciones estructurales.
        </p>
      </div>
    </div>
  );
}
