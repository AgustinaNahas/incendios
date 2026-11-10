"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { OTBN_COLORS } from "@/lib/otbnColors";
import { withBasePath } from "@/lib/paths";

const FIRE_STATES = [
  {
    title: "Fuera de control",
    image: "/estados/1-fuera-de-control.png",
    body: "El fuego se propaga libremente. Fuegos que aún no han sido atacados, o que no han podido ser contenidos.",
  },
  {
    title: "Contenido",
    image: "/estados/2-detenido.png",
    body: "Por cualquier circunstancia natural, ambiental, o a raíz de los trabajos de combate, la propagación se ha detenido en uno o más sectores del incendio.",
  },
  {
    title: "Circunscripto",
    image: "/estados/3-circunscripto.png",
    body: "Los trabajos de contención abarcan todo el perímetro, pero no están definitivamente terminados.",
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

/** 1–2 crítico, 3–4 en contención, 5 resuelto. Misma paleta OTBN que inflamabilidad. */
function stageColor(index: number) {
  if (index <= 1) return OTBN_COLORS[1];
  if (index <= 3) return OTBN_COLORS[2];
  return OTBN_COLORS[3];
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

const CARD_MAX = 300;

/** Tope 300px; en móvil se achica para ~1 card + peek. */
function cardWidthFor(viewport: number) {
  const pad = viewport >= 768 ? 32 : 20;
  const available = Math.max(0, viewport - pad * 2);
  if (viewport < 640) {
    return Math.min(CARD_MAX, Math.max(160, available / 1.15));
  }
  return Math.min(CARD_MAX, available);
}

export function FireStates() {
  const pinRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackX, setTrackX] = useState(0);
  const [progress, setProgress] = useState(0);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [cardWidth, setCardWidth] = useState(280);
  const [live, setLive] = useState("");
  const liveIndexRef = useRef(-1);

  const activeIndex = Math.round(progress * Math.max(FIRE_STATES.length - 1, 1));

  useEffect(() => {
    const pin = pinRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!pin || !viewport || !track) return;

    const shiftOf = () =>
      Math.max(0, track.scrollWidth - viewport.clientWidth);

    const measure = () => {
      const width = viewport.clientWidth;
      if (width > 0) setCardWidth(cardWidthFor(width));
      const shift = shiftOf();
      const stickyH = stickyRef.current?.offsetHeight ?? 0;
      pin.style.height = `${stickyH + shift}px`;
      pin.style.marginBottom = "0px";
    };

    const update = () => {
      const shift = shiftOf();
      const scrolled = clamp(-pin.getBoundingClientRect().top, 0, shift);
      const raw = shift > 0 ? scrolled / shift : 1;
      setTrackX(-scrolled);
      setHasOverflow(shift > 0);
      setProgress(raw);

      const next = Math.round(raw * Math.max(FIRE_STATES.length - 1, 1));
      if (liveIndexRef.current === next) return;
      liveIndexRef.current = next;
      const rect = pin.getBoundingClientRect();
      const inView = rect.bottom > 0 && rect.top < window.innerHeight;
      if (inView) {
        const state = FIRE_STATES[next];
        setLive(`Etapa ${next + 1}. ${state.title}. ${state.body}`);
      }
    };

    measure();
    // Re-medir tras aplicar el ancho de card en el layout.
    requestAnimationFrame(() => {
      measure();
      update();
    });

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      requestAnimationFrame(() => {
        measure();
        update();
      });
    };

    const ro = new ResizeObserver(onResize);
    ro.observe(track);
    ro.observe(viewport);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const goTo = (index: number) => {
    const pin = pinRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!pin || !viewport || !track) return;
    const shift = Math.max(0, track.scrollWidth - viewport.clientWidth);
    if (shift <= 0 || FIRE_STATES.length <= 1) return;
    const target =
      (clamp(index, 0, FIRE_STATES.length - 1) / (FIRE_STATES.length - 1)) *
      shift;
    const pinDoc = pin.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: pinDoc + target, behavior: "smooth" });
  };

  return (
    <div className="relative mt-10">
      <div className="relative left-1/2 mt-6 w-screen -translate-x-1/2">
        <div ref={pinRef} className="relative" style={{ height: "70vh" }}>
          <div
            ref={stickyRef}
            className="sticky top-3 z-20 flex flex-col bg-background pb-2 md:top-[8vh]"
          >
            <div
              ref={viewportRef}
              className="relative mx-auto flex w-full max-w-[1200px] flex-col overflow-hidden"
            >
              <h3 className="type-h4 is-flush mb-4 mx-auto w-full max-w-[800px] px-5 pt-2 md:px-8">
                Los cinco estados de un incendio
              </h3>
              <div className="relative mt-4 h-[min(360px,calc(100svh-30rem))] md:h-[min(480px,calc(100svh-26rem))]">
                <div
                  ref={trackRef}
                  className="absolute inset-0 flex w-max items-stretch gap-4 px-5 md:gap-5 md:px-8"
                  style={{
                    transform: `translate3d(${trackX}px, 0, 0)`,
                    willChange: "transform",
                  }}
                >
                  {FIRE_STATES.map((state, i) => {
                    const color = stageColor(i);
                    return (
                      <article
                        key={state.title}
                        className="flex h-full shrink-0 flex-col bg-panel"
                        style={{ width: cardWidth }}
                      >
                        <div
                          className="h-1.5 w-full shrink-0"
                          style={{ background: color }}
                          aria-hidden
                        />

                        <div className="relative mx-auto h-[min(110px,16vh)] w-full max-w-[160px] shrink-0 md:h-[min(140px,18vh)]">
                          <Image
                            src={withBasePath(state.image)}
                            alt=""
                            fill
                            sizes="160px"
                            className="object-contain object-bottom px-2 py-3"
                          />
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-1 pb-4 md:px-[25px] md:pb-[25px]">
                          <p
                            className="text-[10px] font-bold tracking-[0.18em] uppercase"
                            style={{ color }}
                          >
                            Etapa {i + 1}
                          </p>
                          <h4 className="mt-1.5 font-[family-name:var(--font-display)] text-lg leading-none font-black tracking-wide md:text-xl">
                            {state.title}
                          </h4>
                          <div
                            className="my-3 border-t border-foreground/20"
                            aria-hidden
                          />
                          <p className="text-xs leading-[1.3] text-foreground/85 md:text-sm">
                            {state.body}
                          </p>
                        </div>
                      </article>
                    );
                  })}
                </div>
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background from-0% via-background/80 via-[40%] to-transparent"
                  style={{
                    opacity: hasOverflow ? clamp(progress / 0.05) : 0,
                  }}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background from-0% via-background/80 via-[40%] to-transparent"
                  style={{
                    opacity: hasOverflow ? clamp((1 - progress) / 0.05) : 0,
                  }}
                />
              </div>

              <div
                className="mt-3 flex shrink-0 items-center justify-center gap-1.5 px-5 pt-2 pb-3 md:px-8"
                role="tablist"
                aria-label="Estados de un incendio"
              >
                {FIRE_STATES.map((state, i) => {
                  const selected = i === activeIndex;
                  return (
                    <button
                      key={state.title}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-label={`Etapa ${i + 1}. ${state.title}`}
                      onClick={() => goTo(i)}
                      className={`h-2 w-2 rounded-full border border-accent transition-colors ${
                        selected
                          ? "bg-accent"
                          : "bg-transparent hover:bg-accent/40"
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            <p className="sr-only" aria-live="polite">
              {live}
            </p>
          </div>
        </div>
      </div>

      {/* <p className="type-body mt-8 pb-12">
        Algunos incendios grandes, aunque sean dados por controlados, pueden no
        declararse extinguidos durante mucho tiempo.
      </p> */}
      <div className="border-t border-t-white/31 pb-4" />

      <h2 className="type-h2 mt-10">El riesgo que nadie previene</h2>
      <p className="type-bajada">
        Factores de ignición, de propagación y condiciones estructurales: las
        variables que una política preventiva debería gestionar antes de la
        primera llama.
      </p>
    </div>
  );
}
