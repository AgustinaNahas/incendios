"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { TextLink } from "@/components/TextLink";
import { withBasePath } from "@/lib/paths";

const MENENDEZ =
  "http://lanacion.com.ar/sociedad/tras-cuatro-meses-de-fuego-extinguen-el-incendio-en-los-alerces-epicentro-de-las-peores-temporadas-nid14042026/";

const FIRE_STATES = [
  {
    title: "Fuera de control",
    image: "/estados/1-fuera-de-control.png",
    body: "El fuego avanza libremente y los medios no logran frenar su propagación; es la etapa más crítica y cambiante.",
  },
  {
    title: "Contenido",
    image: "/estados/2-detenido.png",
    body: "Se frena el frente principal, pero el fuego sigue activo, y puede reactivarse con viento fuerte o pendientes.",
  },
  {
    title: "Circunscrito",
    image: "/estados/3-circunscripto.png",
    body: "El fuego queda rodeado en todo su perímetro pero faltan asegurar líneas y enfriar bordes para evitar escapes.",
  },
  {
    title: "Controlado",
    image: "/estados/4-controlado.png",
    body: "Existe línea de control segura en todo el perímetro y el fuego ya no puede superarla; no retrocede de estado.",
  },
  {
    title: "Extinguido",
    image: "/estados/5-extinguido.png",
    body: "No quedan llamas ni focos calientes activos tras la liquidación y la guardia de cenizas, el incendio terminó.",
  },
] as const;

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
        setLive(`${state.title}. ${state.body}`);
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
    if (stickyRef.current) ro.observe(stickyRef.current);

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
    <div className="relative">
      <h3 className="type-h3">Los cinco estados operativos de un incendio forestal</h3>
      <div className="relative left-1/2 mt-6 w-screen -translate-x-1/2">
        <div ref={pinRef} className="relative" style={{ height: "70vh" }}>
          <div
            ref={stickyRef}
            className="sticky top-3 z-20 flex flex-col bg-background pb-2"
          >
            <div
              ref={viewportRef}
              className="relative mx-auto flex w-full min-w-0 max-w-[1200px] flex-col overflow-hidden"
            >
              <div className="relative min-w-0 overflow-hidden">
                <div
                  ref={trackRef}
                  className="flex w-max items-stretch gap-4 px-5 md:gap-5 md:px-8"
                  style={{
                    transform: `translate3d(${trackX}px, 0, 0)`,
                    willChange: "transform",
                  }}
                >
                  {FIRE_STATES.map((state) => (
                    <article
                      key={state.title}
                      className="flex shrink-0 flex-col bg-panel"
                      style={{ width: cardWidth }}
                    >
                      <div className="relative mx-auto h-[min(110px,16vh)] w-full max-w-[160px] shrink-0 md:h-[min(140px,18vh)]">
                        <Image
                          src={withBasePath(state.image)}
                          alt=""
                          fill
                          sizes="160px"
                          className="object-contain object-bottom px-2 py-3"
                        />
                      </div>

                      <div className="px-4 pt-1 pb-4 md:px-[25px] md:pb-[25px]">
                        <h4 className="font-[family-name:var(--font-display)] text-lg leading-none font-black tracking-wide md:text-xl">
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
                  ))}
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
                      aria-label={state.title}
                      onClick={() => goTo(i)}
                      className={`h-2 w-2 rounded-full border border-white transition-colors ${
                        selected
                          ? "bg-white"
                          : "bg-transparent hover:bg-white/40"
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            <div
              id="contexto"
              className="mx-auto w-full max-w-[800px] scroll-mt-8 px-5 pt-2 pb-4 md:px-8"
            >
              <h2 className="type-h2 mt-2">El riesgo que nadie previene</h2>
              <p className="type-bajada !mt-2 !pb-0">
                Factores de ignición, de propagación y condiciones estructurales:
                las variables que una política preventiva debería gestionar antes
                de la primera llama
              </p>

              <h3 className="type-h3 !mt-5">Factores de ignición</h3>
              <h4 className="type-h4 !mt-3">Origen natural</h4>
              <p className="type-body mt-2">
                Los rayos pueden iniciar incendios que permanecen latentes durante
                días y luego se expanden bajo condiciones favorables, como ocurrió
                en diciembre de 2025 en el{" "}
                <TextLink href={MENENDEZ}>lago Menéndez</TextLink>. La actividad
                volcánica también puede encender vegetación cercana, aunque es una
                causa poco frecuente en la región.
              </p>

              <h4 className="type-h4 !mt-4">Origen humano</h4>
              <p className="type-body mt-2">
                La mayoría de los incendios tiene origen antrópico o humano. Según
                el Servicio Nacional de Manejo del Fuego, cerca del 95% está
                vinculado a acciones de personas, ya sea por negligencia, fallas
                en la infraestructura de distribución eléctrica o hechos
                intencionales.
              </p>
            </div>

            <p className="sr-only" aria-live="polite">
              {live}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
