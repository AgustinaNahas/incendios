"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import species from "@/data/species-inflammability.json";
import { withBasePath } from "@/lib/paths";

type Level = "bajo" | "medio" | "alto";
type Origin = "nativa" | "exotica";
type Kind = "arbol" | "planta";

const LEVELS: Record<Level, { label: string; color: string; ink: string }> = {
  bajo: { label: "Bajo", color: "#44780C", ink: "#f3efe8" },
  medio: { label: "Medio", color: "#C0A010", ink: "#1A1A1A" },
  alto: { label: "Alto", color: "#E83828", ink: "#f3efe8" },
};

const LEVEL_ORDER: Level[] = ["alto", "medio", "bajo"];

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function kindLabel(kind: Kind, origin: Origin) {
  if (kind === "planta") {
    return origin === "exotica" ? "Planta exótica" : "Planta nativa";
  }
  return origin === "exotica" ? "Árbol exótico" : "Árbol nativo";
}

export function InflammabilitySection() {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackX, setTrackX] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track) return;

    const shiftOf = () => Math.max(0, track.scrollWidth - window.innerWidth);

    const measure = () => {
      pin.style.height = `${window.innerHeight + shiftOf()}px`;
    };

    const update = () => {
      const shift = shiftOf();
      const scrolled = clamp(-pin.getBoundingClientRect().top, 0, shift);
      setTrackX(-scrolled);
      setProgress(shift > 0 ? scrolled / shift : 1);
    };

    measure();
    update();

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      update();
    };

    const ro = new ResizeObserver(onResize);
    ro.observe(track);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section
      id="inflamabilidad"
      className="relative scroll-mt-8 bg-[#2B2B2B] text-[#f3efe8]"
    >
      <div className="mx-auto max-w-[800px] px-5 pt-20 pb-12 md:px-8 md:pt-28">
        <h2 className="type-h3">Factores de propagación</h2>
        <p className="mt-4 font-sans text-xl leading-snug font-bold md:text-2xl">
          La vegetación también define cómo avanza el fuego
        </p>
        <div className="mt-8 text-base leading-relaxed text-[#f3efe8]/90 md:text-lg">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur.
          </p>
        </div>

        <figure className="mt-12">
          <figcaption className="mb-4 text-center text-sm font-semibold tracking-wide text-[#f3efe8] md:text-base">
            Nivel de vulnerabilidad frente al fuego
          </figcaption>
          <div className="flex items-center gap-3 md:gap-4">
            <span className="shrink-0 text-base font-medium md:text-lg">
              Alto
            </span>
            <div
              className="flex h-4 flex-1 gap-1 md:h-5"
              role="img"
              aria-label="Escala de vulnerabilidad: alto, medio y bajo"
            >
              {LEVEL_ORDER.map((level) => (
                <div
                  key={level}
                  className="h-full flex-1"
                  style={{ background: LEVELS[level].color }}
                />
              ))}
            </div>
            <span className="shrink-0 text-base font-medium md:text-lg">
              Bajo
            </span>
          </div>
        </figure>
      </div>

      <div ref={pinRef} className="relative" style={{ height: "100vh" }}>
        <div className="sticky top-0 h-dvh overflow-hidden">
          <div
            ref={trackRef}
            className="absolute top-0 left-0 flex h-full w-max items-center gap-5 px-5 md:gap-6 md:px-8"
            style={{
              transform: `translate3d(${trackX}px, 0, 0)`,
              willChange: "transform",
            }}
          >
            {species.map((sp) => {
              const level = sp.level as Level;
              const tone = LEVELS[level];
              const origin = sp.origin as Origin;
              const kind = sp.kind as Kind;

              return (
                <article
                  key={sp.id}
                  className="flex h-[min(680px,calc(100dvh-4.5rem))] w-[min(82vw,320px)] shrink-0 flex-col overflow-hidden border-[3px] bg-[#121212]"
                  style={{ borderColor: tone.color }}
                >
                  <div
                    className="shrink-0 px-3 py-2.5 text-center text-xs font-bold tracking-[0.22em] uppercase"
                    style={{ background: tone.color, color: tone.ink }}
                  >
                    {tone.label}
                  </div>

                  <div className="relative min-h-0 flex-1">
                    <Image
                      src={withBasePath(sp.image)}
                      alt={`${sp.commonName} (${sp.scientificName})`}
                      fill
                      sizes="320px"
                      className="object-contain object-center p-2"
                    />
                  </div>

                  <div className="shrink-0 px-4 pt-3 pb-4">
                    <p
                      className="text-[11px] font-bold tracking-[0.16em] uppercase"
                      style={{ color: tone.color }}
                    >
                      {kindLabel(kind, origin)}
                    </p>
                    <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl leading-none font-black tracking-wide uppercase">
                      {sp.commonName}
                    </h3>
                    <p className="mt-1.5 text-sm italic text-[#f3efe8]/70">
                      {sp.scientificName}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-[#f3efe8]/85">
                      {sp.note}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-3 px-5 pb-5 md:px-8">
            <div className="h-px flex-1 bg-[#f3efe8]/20" aria-hidden>
              <div
                className="h-px bg-[#f3efe8]/80"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <p className="text-[11px] tracking-wide text-[#f3efe8]/70">
              {Math.min(
                species.length,
                Math.max(1, Math.round(progress * (species.length - 1)) + 1),
              )}{" "}
              / {species.length}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
