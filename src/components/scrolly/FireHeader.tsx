"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { withBasePath } from "@/lib/paths";

const STEPS = [
  "/header/steps-1.jpg",
  "/header/steps-2.jpg",
  "/header/steps-3.jpg",
  "/header/steps-4.jpg",
] as const;

const STEP_CARDS = [
  "El fuego empieza en silencio, casi siempre por negligencia humana, en medio de semanas sin lluvia.",
  "La sequía, el calor, la vegetación seca y el viento contribuyen a expandirlo en pocas horas.",
  "Las alertas tempranas fallan o llegan tarde, mientras el bosque nativo se pierde y los vecinos sufren las consecuencias.",
  "Entonces son los brigadistas los que abren cortafuegos y combaten en terrenos difíciles, donde nadie más llega.",
] as const;

/**
 * Unidades de viewport en la historia:
 * 1 intro (card 1 sube desde abajo) + 3 tramos entre cards +
 * tramo final (card 4 al centro → sale por arriba) +
 * un respiro con la 4ª imagen antes del lead.
 */
const INTRO_UNITS = 1;
const BETWEEN_UNITS = STEPS.length - 1; // 3
/** Card 4: llega a mitad, imagen entra, sale por arriba. */
const LAST_EXIT_UNITS = 1.6;
/** Después de que la card 4 salió: se queda la imagen un rato. */
const HOLD_UNITS = 0.55;
const STORY_UNITS = INTRO_UNITS + BETWEEN_UNITS + LAST_EXIT_UNITS + HOLD_UNITS;

const CARD_OPACITY = 0.75;
/**
 * Crossfade largo (fracción de viewport): la imagen siguiente
 * se funde encima de forma bien marcada mientras la card sube.
 */
const IMAGE_FADE_VH = 0.55;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(t: number) {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
}

export function FireHeader() {
  const sectionRef = useRef<HTMLElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const cardsTrackRef = useRef<HTMLDivElement>(null);
  const cardSlotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const update = () => {
      const total = section.offsetHeight - window.innerHeight;
      const raw = reduced
        ? 1
        : clamp(total > 0 ? -section.getBoundingClientRect().top / total : 0);

      // Todo el scroll del header es historia; el lead entra después.
      const cardProgress = raw * STORY_UNITS - INTRO_UNITS;

      const slotH = cardSlotRef.current?.offsetHeight ?? 0;
      if (cardsTrackRef.current && slotH > 0) {
        // Tras la salida de la última card, el track se queda quieto (hold).
        const maxTravel = BETWEEN_UNITS + LAST_EXIT_UNITS;
        const travel = clamp(cardProgress, -INTRO_UNITS, maxTravel);
        const y = -travel * slotH;
        cardsTrackRef.current.style.transform = `translate3d(0, ${y}px, 0)`;
      }

      const vh = window.innerHeight;
      const fadePx = IMAGE_FADE_VH * vh;
      const last = STEPS.length - 1;

      layerRefs.current.forEach((el, i) => {
        if (!el) return;
        let opacity = 0;
        if (i === 0) {
          opacity = 1;
        } else {
          const card = cardRefs.current[i];
          const text = card?.querySelector("p");
          if (text) {
            const rect = text.getBoundingClientRect();
            if (i < last) {
              // Empieza al entrar la card; se completa a lo largo del tramo.
              opacity = smoothstep((vh - rect.top) / fadePx);
            } else {
              // La 4ª: arranca cerca de la mitad de pantalla, crossfade largo.
              const mid = rect.top + rect.height / 2;
              opacity = smoothstep((vh * 0.72 - mid) / fadePx);
            }
          }
        }
        el.style.opacity = String(opacity);
        el.style.visibility = opacity < 0.01 ? "hidden" : "visible";
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Historia completa + un poco de aire antes del lead (que ya solapa con -mt).
  const sectionVh = Math.round((STORY_UNITS + 0.25) * 100);

  return (
    <header
      ref={sectionRef}
      className="relative text-foreground"
      style={{ height: `${sectionVh}vh` }}
    >
      <div className="sticky top-0 isolate h-dvh overflow-hidden bg-background -mb-2">
        {STEPS.map((src, i) => (
          <div
            key={src}
            ref={(el) => {
              layerRefs.current[i] = el;
            }}
            aria-hidden
            className="pointer-events-none absolute inset-0 will-change-[opacity]"
            style={
              {
                zIndex: i + 1,
                opacity: i === 0 ? 1 : 0,
              } as CSSProperties
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={withBasePath(src)}
              alt=""
              className="h-full w-full object-cover object-center"
              draggable={false}
            />
          </div>
        ))}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 shadow-[inset_0_0_120px_40px_rgba(8,3,2,0.22)]"
        />

        {/* Degradé inferior siempre presente (mitad del alto anterior). */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[21] h-[29%] bg-gradient-to-b from-transparent from-0% via-background/45 via-[40%] to-background to-[82%]"
        />

        {/* Cada card entra por el borde inferior y sale por el superior. */}
        <div className="pointer-events-none absolute inset-0 z-[22] overflow-hidden">
          <div ref={cardSlotRef} className="relative h-full w-full">
            <div
              ref={cardsTrackRef}
              className="absolute inset-x-0 top-0 will-change-transform"
              style={{ transform: "translate3d(0, 100%, 0)" }}
            >
              {STEP_CARDS.map((text, i) => (
                <article
                  key={text}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className="flex h-dvh w-full items-end justify-center px-5 pb-8 md:pb-12"
                  style={{ opacity: CARD_OPACITY }}
                >
                  <p className="w-[min(90vw,480px)] bg-black/90 px-5 py-5 font-sans text-lg leading-snug text-foreground md:px-6 md:py-6 md:text-xl">
                    {text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
