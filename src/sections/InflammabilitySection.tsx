"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import species from "@/data/species-inflammability.json";
import storyCards from "@/data/colihue-cards.json";
import { withBasePath } from "@/lib/paths";

type Level = "alta" | "moderada" | "baja";
type Origin = "nativa" | "exotica";

const LEVEL_LABEL: Record<Level, string> = {
  alta: "Alta",
  moderada: "Moderada",
  baja: "Relativamente baja",
};

const LEVEL_COLOR: Record<Level, string> = {
  alta: "#F46B15",
  moderada: "#E0B25A",
  baja: "#6FA88A",
};

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

type ScrollState = {
  phase: "rank" | "zoom" | "story";
  trackX: number;
  rankT: number;
  zoomT: number;
  storyT: number;
  rankShift: number;
};

const INITIAL: ScrollState = {
  phase: "rank",
  trackX: 0,
  rankT: 0,
  zoomT: 0,
  storyT: 0,
  rankShift: 0,
};

export function InflammabilitySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState<ScrollState>(INITIAL);

  const colihue = species[species.length - 1];

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const budgets = () => {
      const rankShift = Math.max(0, track.scrollWidth - window.innerWidth);
      const zoomDist = window.innerHeight * 0.85;
      const storyDist = storyCards.length * window.innerHeight * 0.7;
      return { rankShift, zoomDist, storyDist };
    };

    const measure = () => {
      const { rankShift, zoomDist, storyDist } = budgets();
      // sticky viewport + horizontal distance + zoom + story
      section.style.height = `${window.innerHeight + rankShift + zoomDist + storyDist}px`;
      setScroll((prev) =>
        prev.rankShift === rankShift ? prev : { ...prev, rankShift },
      );
    };

    const update = () => {
      const { rankShift, zoomDist, storyDist } = budgets();
      const scrolled = clamp(
        -section.getBoundingClientRect().top,
        0,
        rankShift + zoomDist + storyDist,
      );

      if (scrolled <= rankShift) {
        const rankT = rankShift > 0 ? scrolled / rankShift : 0;
        setScroll({
          phase: "rank",
          trackX: -scrolled,
          rankT,
          zoomT: 0,
          storyT: 0,
          rankShift,
        });
        return;
      }

      if (scrolled <= rankShift + zoomDist) {
        const zoomT = (scrolled - rankShift) / zoomDist;
        setScroll({
          phase: "zoom",
          trackX: -rankShift,
          rankT: 1,
          zoomT,
          storyT: 0,
          rankShift,
        });
        return;
      }

      const storyT = clamp(
        (scrolled - rankShift - zoomDist) / Math.max(storyDist, 1),
      );
      setScroll({
        phase: "story",
        trackX: -rankShift,
        rankT: 1,
        zoomT: 1,
        storyT,
        rankShift,
      });
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

    const ro = new ResizeObserver(() => {
      measure();
      update();
    });
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

  const { phase, trackX, rankT, zoomT, storyT, rankShift } = scroll;

  const activeRankIndex = Math.min(
    species.length - 1,
    Math.max(0, Math.round(rankT * (species.length - 1))),
  );
  const activeRank = species[activeRankIndex];

  const storyIndex = Math.min(
    storyCards.length - 1,
    Math.floor(storyT * 0.999 * storyCards.length),
  );
  const activeStory = storyCards[storyIndex];

  const rankChromeOpacity = phase === "rank" ? 1 : clamp(1 - zoomT * 1.5);
  const trackOpacity =
    phase === "rank" ? 1 : phase === "zoom" ? clamp(1 - zoomT * 0.9) : 0;
  const heroOpacity =
    phase === "rank"
      ? 0
      : phase === "zoom"
        ? clamp((zoomT - 0.2) * 1.6)
        : 1;
  const heroScale =
    phase === "rank"
      ? 0.78
      : lerp(0.78, 1.14, Math.min(1, zoomT * 0.6 + storyT * 0.4));

  const showStoryPanel =
    phase === "story" || (phase === "zoom" && zoomT > 0.5);

  return (
    <section
      ref={sectionRef}
      id="inflamabilidad"
      className="relative scroll-mt-8"
      style={{ height: "600vh" }}
    >
      <div className="sticky top-0 h-dvh overflow-hidden bg-[#1a0806]">
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            opacity: heroOpacity,
            transform: `scale(${heroScale})`,
            willChange: "transform, opacity",
          }}
          aria-hidden={phase === "rank"}
        >
          <Image
            src={withBasePath(colihue.image)}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[center_40%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/70" />
        </div>

        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(244,107,21,0.18),transparent_55%)]" />

        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-20 px-4 pt-10 text-center md:px-8"
          style={{
            opacity:
              phase === "zoom"
                ? clamp(zoomT * 1.4)
                : phase === "story"
                  ? 1
                  : 0,
          }}
        >
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#F46B15]">
            Zoom · Chusquea culeou
          </p>
          <h2 className="mx-auto mt-2 max-w-xl font-[family-name:var(--font-display)] text-3xl leading-tight text-[#f3efe8] md:text-4xl">
            Nativa, inflamable — y no es un pino
          </h2>
        </div>

        <div className="relative z-10 flex h-full flex-col">
          <header
            className="mx-auto flex w-full max-w-6xl shrink-0 items-end justify-between gap-4 px-4 pt-8 pb-4 md:px-8"
            style={{ opacity: rankChromeOpacity }}
          >
            <div className="max-w-xl">
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#F46B15]/90">
                Combustible vivo · Ranking
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl leading-tight text-[#f3efe8] md:text-4xl">
                Inflamabilidad de especies del bosque
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-[#f3efe8]/70 md:text-base">
                De menos a más inflamables. Bajá para recorrer el ranking de
                costado — termina en el colihue.
              </p>
            </div>
            <div className="hidden shrink-0 text-right sm:block">
              <p className="text-[11px] tracking-wide uppercase text-[#f3efe8]/50">
                En foco
              </p>
              <p className="font-[family-name:var(--font-display)] text-lg text-[#f3efe8]">
                {phase === "rank" ? activeRank.commonName : colihue.commonName}
              </p>
              <p className="text-xs text-[#f3efe8]/55">
                {phase === "rank"
                  ? activeRank.scientificName
                  : colihue.scientificName}
              </p>
            </div>
          </header>

          <div
            className="relative min-h-0 flex-1"
            style={{ opacity: trackOpacity }}
          >
            <div
              ref={trackRef}
              className="absolute top-0 left-0 flex h-full w-max items-stretch gap-5 px-4 pb-10 md:gap-7 md:px-8"
              style={{
                transform: `translate3d(${trackX}px, 0, 0)`,
                willChange: "transform",
              }}
            >
              {species.map((sp) => {
                const level = sp.level as Level;
                const origin = sp.origin as Origin;
                const isActive =
                  phase === "rank"
                    ? sp.id === activeRank.id
                    : sp.id === colihue.id;
                const isColihue = sp.id === "chusquea-culeou";
                const grow =
                  isColihue && phase !== "rank"
                    ? lerp(1, 1.55, clamp(zoomT * 1.2))
                    : 1;
                const cardFade =
                  !isColihue && phase !== "rank" ? clamp(1 - zoomT * 2) : 1;

                return (
                  <article
                    key={sp.id}
                    className="flex w-[min(78vw,320px)] shrink-0 flex-col md:w-[300px]"
                    style={{
                      opacity: (isActive ? 1 : 0.8) * cardFade,
                      transform: isColihue ? `scale(${grow})` : undefined,
                      transformOrigin: "center center",
                      zIndex: isColihue && phase !== "rank" ? 5 : 1,
                    }}
                  >
                    <div
                      className="flex h-full flex-col overflow-hidden border border-[#1A1A1A]/25 bg-[#f7f0ea] text-[#1A1A1A]"
                      style={{
                        outline: isActive
                          ? `2px solid ${LEVEL_COLOR[level]}`
                          : "2px solid transparent",
                        outlineOffset: 2,
                      }}
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-[#d9d2cb]">
                        <Image
                          src={withBasePath(sp.image)}
                          alt={`${sp.commonName} (${sp.scientificName})`}
                          fill
                          sizes="320px"
                          className="object-cover object-center"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-[#1A1A1A] px-2 py-1 font-[family-name:var(--font-display)] text-sm text-[#f3efe8]">
                            {String(sp.rank).padStart(2, "0")}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3">
                          <span
                            className={`px-2 py-1 text-[10px] font-semibold tracking-wide uppercase ${
                              origin === "exotica"
                                ? "bg-[#940F11] text-[#f3efe8]"
                                : "bg-[#2f6b4f] text-[#f3efe8]"
                            }`}
                          >
                            {origin === "exotica" ? "Exótica" : "Nativa"}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col gap-2 px-4 pt-4 pb-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2 w-2 shrink-0 rounded-full"
                            style={{ background: LEVEL_COLOR[level] }}
                            aria-hidden
                          />
                          <span
                            className="text-[11px] font-semibold tracking-[0.14em] uppercase"
                            style={{ color: LEVEL_COLOR[level] }}
                          >
                            Inflamabilidad {LEVEL_LABEL[level]}
                          </span>
                        </div>
                        <h3 className="font-[family-name:var(--font-display)] text-xl leading-tight">
                          {sp.commonName}
                        </h3>
                        <p className="text-sm italic opacity-70">
                          {sp.scientificName}
                        </p>
                        <p className="mt-auto pt-2 text-xs leading-relaxed opacity-75">
                          {sp.note}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div
            className="absolute inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-8 md:px-8"
            style={{
              opacity: showStoryPanel ? 1 : 0,
              transform: `translateY(${showStoryPanel ? 0 : 24}px)`,
              transition: "opacity 200ms ease, transform 200ms ease",
              pointerEvents: phase === "rank" ? "none" : "auto",
            }}
          >
            <div className="w-full max-w-xl bg-[#fdf2f0] px-6 py-6 text-[#1A1A1A] md:px-8 md:py-7">
              {phase !== "rank" ? (
                <>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="bg-[#2f6b4f] px-2 py-1 text-[10px] font-semibold tracking-wide uppercase text-[#f3efe8]">
                      Nativa
                    </span>
                    <span className="bg-[#F46B15] px-2 py-1 text-[10px] font-semibold tracking-wide uppercase text-[#1A1A1A]">
                      Inflamabilidad alta
                    </span>
                    <span className="text-[11px] tracking-wide text-[#940F11]/60">
                      {storyIndex + 1} / {storyCards.length}
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#940F11]/75">
                    {activeStory.eyebrow}
                  </p>
                  <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl leading-snug text-[#940F11]">
                    {activeStory.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#5c2a22]/90 md:text-base">
                    {activeStory.body}
                  </p>
                  {storyIndex === storyCards.length - 1 ? (
                    <p className="mt-4 text-[11px] leading-relaxed text-[#940F11]/55">
                      Fuente:{" "}
                      <a
                        href="https://intainforma.inta.gob.ar/las-especies-nativas-protegen-la-cordillera-argentina/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2"
                      >
                        INTA Informa · Esquel (2023)
                      </a>
                    </p>
                  ) : null}
                </>
              ) : null}
            </div>
          </div>

          {phase === "rank" ? (
            <div className="mx-auto flex w-full max-w-6xl shrink-0 items-center gap-3 px-4 pb-5 md:px-8">
              <div className="h-px flex-1 bg-[#f3efe8]/20" aria-hidden>
                <div
                  className="h-px bg-[#F46B15]"
                  style={{
                    width: `${rankShift > 0 ? rankT * 100 : 0}%`,
                  }}
                />
              </div>
              <p className="text-[11px] tracking-wide text-[#f3efe8]/45">
                {activeRankIndex + 1} / {species.length}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
