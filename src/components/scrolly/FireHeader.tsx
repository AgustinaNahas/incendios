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

/** Último tramo del scroll: fundido al lead (después del último paso). */
const FADE_START = 0.9;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(t: number) {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
}

/**
 * Progreso de historia 0–1 → paso continuo 0…n-1.
 * Cada imagen se apila encima con un crossfade corto alrededor del cambio.
 */
function stackOpacity(index: number, stepProgress: number) {
  if (index === 0) return 1;
  // Entra cuando stepProgress se acerca a `index`.
  const t = smoothstep(stepProgress - (index - 1));
  return t;
}

const INTRO_DELAY_MS = 2000;
const INTRO_FADE_MS = 600;

export function FireHeader() {
  const sectionRef = useRef<HTMLElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const cardsTrackRef = useRef<HTMLDivElement>(null);
  const cardSlotRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  /** 0 → 1: aparición de la primera card tras el delay de carga. */
  const introRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let introRaf = 0;
    let introTimer = 0;

    const update = () => {
      const total = section.offsetHeight - window.innerHeight;
      const raw = reduced
        ? 1
        : clamp(total > 0 ? -section.getBoundingClientRect().top / total : 0);

      const n = STEPS.length;
      const span = Math.max(n - 1, 1);

      // 0→1 solo en la parte de historia; el final queda para el fade al lead.
      const story = clamp(raw / FADE_START);
      const stepProgress = story * span;

      layerRefs.current.forEach((el, i) => {
        if (!el) return;
        const opacity = stackOpacity(i, stepProgress);
        el.style.opacity = String(opacity);
        el.style.visibility = opacity < 0.01 ? "hidden" : "visible";
      });

      const slotH = cardSlotRef.current?.offsetHeight ?? 0;
      if (cardsTrackRef.current && slotH > 0) {
        // La última card no se queda en el borde inferior: en su tramo
        // sube hasta el centro, por encima del título que entra después.
        const lastCard = cardRefs.current[span];
        const lastText = lastCard?.querySelector("p");
        let lift = 0;
        if (lastCard && lastText) {
          const cardTop = lastCard.getBoundingClientRect().top;
          const textRect = lastText.getBoundingClientRect();
          const textCenter = textRect.top + textRect.height / 2 - cardTop;
          lift = textCenter - slotH / 2;
        }
        const intoLast = clamp(stepProgress - (span - 1));
        const y = -stepProgress * slotH - intoLast * lift;
        cardsTrackRef.current.style.transform = `translate3d(0, ${y}px, 0)`;
      }

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        // La primera card espera el delay de intro; el resto viaja a opacidad plena.
        el.style.opacity = i === 0 ? String(introRef.current) : "1";
      });

      if (fadeRef.current) {
        const fade = smoothstep((raw - FADE_START) / (1 - FADE_START));
        fadeRef.current.style.opacity = String(fade);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    const startIntro = () => {
      if (reduced) {
        introRef.current = 1;
        update();
        return;
      }
      const started = performance.now();
      const tick = (now: number) => {
        introRef.current = smoothstep((now - started) / INTRO_FADE_MS);
        update();
        if (introRef.current < 1) {
          introRaf = requestAnimationFrame(tick);
        }
      };
      introRaf = requestAnimationFrame(tick);
    };

    update();
    introTimer = window.setTimeout(startIntro, INTRO_DELAY_MS);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(introRaf);
      window.clearTimeout(introTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header ref={sectionRef} className="relative h-[400vh] text-[#f3efe8]">
      <div className="sticky top-0 isolate h-dvh overflow-hidden bg-[#2B2B2B] -mb-2">
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

        {/* Cada card entra por el borde inferior y sale por el superior. */}
        <div className="pointer-events-none absolute inset-0 z-[21] overflow-hidden">
          <div ref={cardSlotRef} className="relative h-full w-full">
            <div
              ref={cardsTrackRef}
              className="absolute inset-x-0 top-0 will-change-transform"
            >
              {STEP_CARDS.map((text, i) => (
                <article
                  key={text}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className="flex h-dvh w-full items-end justify-center px-5 pb-8 will-change-[opacity] md:pb-12"
                  style={{ opacity: i === 0 ? 0 : 1 }}
                >
                  <p className="w-[min(90vw,480px)] bg-black/90 px-5 py-5 font-display text-lg leading-snug text-[#f3efe8] md:px-6 md:py-6 md:text-xl">
                    {text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div
          ref={fadeRef}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[22] h-[58%] bg-gradient-to-b from-transparent from-0% via-[#2B2B2B]/45 via-[40%] to-[#2B2B2B] to-[82%] will-change-[opacity]"
          style={{ opacity: 0 }}
        />
      </div>
    </header>
  );
}
