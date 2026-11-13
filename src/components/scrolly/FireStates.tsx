"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
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
    title: "Circunscripto",
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

function smoothstep(t: number) {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
}

const MOBILE_MQ = "(max-width: 767px)";

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
  const cardsRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [trackX, setTrackX] = useState(0);
  const [progress, setProgress] = useState(0);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [cardWidth, setCardWidth] = useState(280);
  const [stickyTop, setStickyTop] = useState(12);
  const [live, setLive] = useState("");
  const liveIndexRef = useRef(-1);

  useEffect(() => {
    const pin = pinRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!pin || !viewport || !track) return;

    const mobileQuery = window.matchMedia(MOBILE_MQ);
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let mode: "mobile" | "desktop" | null = null;

    const shiftOf = () =>
      Math.max(0, track.scrollWidth - viewport.clientWidth);

    /** En mobile cada card se prende al entrar por abajo de la pantalla. */
    const revealCards = () => {
      const vh = window.innerHeight;
      const travel = Math.max(180, vh * 0.36);
      const reduced = motionQuery.matches;
      const frames: { el: HTMLElement; opacity: number }[] = [];
      let next = -1;

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const opacity = reduced ? 1 : smoothstep((vh - rect.top) / travel);
        frames.push({ el, opacity });
        if (opacity > 0.72) next = i;
      });

      for (const frame of frames) {
        frame.el.style.opacity = frame.opacity.toFixed(3);
      }

      if (next < 0 || liveIndexRef.current === next) return;
      liveIndexRef.current = next;
      const state = FIRE_STATES[next];
      setLive(`${state.title}. ${state.body}`);
    };

    const clearReveal = () => {
      cardRefs.current.forEach((el) => {
        if (el) el.style.opacity = "";
      });
    };

    /**
     * Centra el carrusel, pero sin dejar que los párrafos y el título
     * se vayan por arriba. Si no entra todo, recorta solo lo necesario
     * para que las cards sigan en pantalla y el texto siguiente asome.
     */
    const pinOffset = () => {
      const cards = cardsRef.current;
      if (!cards) return 0;
      const topPadding = 16;
      const peek = 64;
      const cardsCenter = cards.offsetTop + cards.offsetHeight / 2;
      const cardsBottom = cards.offsetTop + cards.offsetHeight;
      const centered = window.innerHeight / 2 - cardsCenter;
      const cardsInView = window.innerHeight - peek - cardsBottom;
      const minTop = Math.min(topPadding, cardsInView);
      return Math.max(centered, minTop);
    };

    const measure = () => {
      if (mobileQuery.matches) {
        pin.style.height = "auto";
        pin.style.marginBottom = "0px";
        return;
      }
      const width = viewport.clientWidth;
      if (width > 0) setCardWidth(cardWidthFor(width));
      const shift = shiftOf();
      const stickyH = stickyRef.current?.offsetHeight ?? 0;
      const offset = pinOffset();
      setStickyTop(offset);
      pin.style.height = `${stickyH + shift}px`;
      pin.style.marginBottom = "0px";
    };

    const update = () => {
      const mobile = mobileQuery.matches;
      if (mode !== (mobile ? "mobile" : "desktop")) {
        mode = mobile ? "mobile" : "desktop";
        liveIndexRef.current = -1;
        if (mobile) {
          setTrackX(0);
          setHasOverflow(false);
          setProgress(0);
          pin.style.height = "auto";
        } else {
          clearReveal();
        }
      }

      if (mobile) {
        pin.style.height = "auto";
        revealCards();
        return;
      }

      const shift = shiftOf();
      const offset = pinOffset();
      // Empieza a scrollear cuando el pin llega a la posición de anclaje (centro).
      const scrolled = clamp(offset - pin.getBoundingClientRect().top, 0, shift);
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
    if (cardsRef.current) ro.observe(cardsRef.current);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    mobileQuery.addEventListener("change", onResize);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      mobileQuery.removeEventListener("change", onResize);
    };
  }, []);

  return (
    <div className="relative">
      <div className="relative left-1/2 w-screen -translate-x-1/2">
        <div ref={pinRef} className="relative h-auto md:h-[70vh]">
          <div
            ref={stickyRef}
            className="z-20 flex flex-col bg-background md:sticky"
            style={{ top: stickyTop }}
          >
            <div className="type-stack mx-auto mt-5 w-full max-w-[800px] px-5 md:px-8">
              <p className="type-body">
                Para los cuerpos de bomberos voluntarios, el combate tiene además un
                costo personal. Muchos de sus integrantes son cuentapropistas:
                comerciantes, albañiles, plomeros o electricistas. Cada jornada
                destinada al incendio es también una jornada en la que dejan de
                trabajar y de generar ingresos. En las ciudades más grandes, algunos
                cuarteles cuentan con personal rentado para funciones específicas,
                pero buena parte de la estructura sigue sostenida por voluntarios
                que interrumpen su vida cotidiana para responder a la emergencia.
              </p>
              <p className="type-body">
                No todos los que llegan a la primera línea del fuego forman parte de
                estructuras oficiales. En zonas rurales, de interfase o de difícil
                acceso, las brigadas comunitarias pueden convertirse en una primera
                respuesta clave gracias a su conocimiento directo del territorio,
                aunque no siempre cuentan con el mismo reconocimiento institucional
                que los cuerpos oficiales.
              </p>
            </div>

            <h3 className="type-h3 mx-auto w-full max-w-[800px] px-5 md:px-8">
              Estados operativos de un incendio forestal
            </h3>

            <div
              ref={cardsRef}
              className="mt-6"
            >
              <div
                ref={viewportRef}
                className="relative mx-auto flex w-full min-w-0 max-w-[1200px] flex-col max-md:overflow-visible md:overflow-hidden"
              >
                <div className="relative min-w-0 max-md:overflow-visible md:overflow-hidden">
                  <div
                    ref={trackRef}
                    className="flex w-full flex-col items-stretch gap-6 px-5 md:w-max md:flex-row md:gap-5 md:px-8"
                    style={
                      {
                        transform: `translate3d(${trackX}px, 0, 0)`,
                        willChange: "transform",
                        "--card-w": `${cardWidth}px`,
                      } as CSSProperties
                    }
                  >
                    {FIRE_STATES.map((state, index) => (
                      <article
                        key={state.title}
                        ref={(el) => {
                          cardRefs.current[index] = el;
                        }}
                        className="flex w-full shrink-0 flex-col bg-panel max-md:opacity-0 max-md:will-change-[opacity] max-md:motion-reduce:opacity-100 md:w-[var(--card-w)] md:opacity-100"
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
                          <h4 className="font-[family-name:var(--font-display)] text-lg leading-none uppercase font-black tracking-wide md:text-[16px] mt-[10px]">
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
                    className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-20 bg-gradient-to-r from-background from-0% via-background/80 via-[40%] to-transparent md:block"
                    style={{
                      opacity: hasOverflow ? clamp(progress / 0.05) : 0,
                    }}
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-20 bg-gradient-to-l from-background from-0% via-background/80 via-[40%] to-transparent md:block"
                    style={{
                      opacity: hasOverflow ? clamp((1 - progress) / 0.05) : 0,
                    }}
                  />
                </div>
              </div>
            </div>

            <div
              id="contexto"
              className="section-rule mx-auto w-full max-w-[800px] scroll-mt-8 px-5 md:px-8"
            >
              <h2 className="type-h2">El riesgo que nadie previene</h2>
              <p className="type-bajada !pb-0">
                Factores de ignición, de propagación y condiciones estructurales:
                las variables que una política preventiva debería gestionar antes
                de la primera llama
              </p>

              <h3 className="type-h3 ">Factores de ignición</h3>
              <h4 className="type-h4 ">Origen natural</h4>
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
