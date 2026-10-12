"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { withBasePath } from "@/lib/paths";

const STEPS = [
  "/header/steps-1.png",
  "/header/steps-2.png",
  "/header/steps-3.png",
  "/header/steps-4.png",
  "/header/steps-5.png",
] as const;

/** Ventana de crossfade como fracción del tramo entre pasos (0–1). */
const CROSSFADE = 0.42;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

/** Curva suave: acelera y frena sin el “corte” lineal. */
function smoothstep(t: number) {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
}

/**
 * Opacidad al apilar: el paso 0 queda siempre abajo;
 * cada imagen siguiente se funde encima y se queda.
 */
function stackOpacity(index: number, progress: number, total: number) {
  if (index === 0) return 1;
  const span = Math.max(total - 1, 1);
  const peak = index / span;
  const start = peak - CROSSFADE / span;
  return smoothstep((progress - start) / (CROSSFADE / span));
}

export function FireHeader() {
  const sectionRef = useRef<HTMLElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const fadeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const update = () => {
      const total = section.offsetHeight - window.innerHeight;
      const progress = reduced
        ? 1
        : clamp(total > 0 ? -section.getBoundingClientRect().top / total : 0);

      const n = STEPS.length;

      layerRefs.current.forEach((el, i) => {
        if (!el) return;
        const opacity = stackOpacity(i, progress, n);
        el.style.opacity = String(opacity);
        el.style.visibility = opacity < 0.01 ? "hidden" : "visible";
      });

      if (fadeRef.current) {
        // Fundido final al color de página para enganchar el lead.
        const fade = smoothstep((progress - 0.82) / 0.18);
        fadeRef.current.style.opacity = String(fade);
      }
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

  return (
    <header ref={sectionRef} className="relative h-[420vh] text-[#f3efe8]">
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
              className="h-full w-full object-cover object-[center_42%]"
              draggable={false}
            />
          </div>
        ))}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 shadow-[inset_0_0_120px_40px_rgba(8,3,2,0.22)]"
        />

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
