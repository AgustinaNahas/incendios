"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BurnedMapClient } from "@/components/maps/BurnedMapClient";
import { formatBurnedMonth } from "@/lib/burnedMap";
import {
  BURNED_TIMELINE_MONTHS,
  burnedSeasonGradient,
  seasonColor,
  isoMonthIntensity,
} from "@/lib/fireSeasonGradient";

const MONTHS = BURNED_TIMELINE_MONTHS;

const YEAR_TICKS = [
  { year: "2022", iso: "2022-01" },
  { year: "2023", iso: "2023-01" },
  { year: "2024", iso: "2024-01" },
  { year: "2025", iso: "2025-01" },
  { year: "2026", iso: "2026-01" },
];

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export function BurnedSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [monthIndex, setMonthIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let raf = 0;
    const update = () => {
      const total = section.offsetHeight - window.innerHeight;
      const progress = clamp(total > 0 ? -section.getBoundingClientRect().top / total : 0);
      const next = Math.round(progress * (MONTHS.length - 1));
      setMonthIndex((prev) => (prev === next ? prev : next));
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

  const iso = MONTHS[monthIndex] ?? MONTHS[0];
  const progressPct = useMemo(
    () => (MONTHS.length > 1 ? (monthIndex / (MONTHS.length - 1)) * 100 : 0),
    [monthIndex],
  );
  const seasonGradient = useMemo(() => burnedSeasonGradient(MONTHS), []);
  const thumbColor = useMemo(() => seasonColor(isoMonthIntensity(iso)), [iso]);

  return (
    <section
      ref={sectionRef}
      id="quemado"
      className="relative h-[560vh] scroll-mt-8"
    >
      <div className="sticky top-0 z-20 flex h-dvh flex-col">
        <div className="relative min-h-0 flex-1 bg-[#C9C6C1]">
          <BurnedMapClient monthIndex={monthIndex} className="h-full w-full" />
        </div>

        <div className="shrink-0 border-t border-[#1A1A1A]/15 bg-[#C9C6C1] px-4 py-3 text-[#1A1A1A] md:px-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-2">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase opacity-65">
                  Hectáreas quemadas · CONAE
                </p>
                <p className="font-[family-name:var(--font-display)] text-xl leading-tight md:text-2xl">
                  {formatBurnedMonth(iso)}
                </p>
              </div>
              <div
                className="flex items-center gap-2 text-[11px] opacity-80"
                aria-hidden
              >
                <span>0 ha</span>
                <span
                  className="h-2 w-28 rounded-sm md:w-40"
                  style={{
                    background:
                      "linear-gradient(90deg, #FFFFFF 0%, #FFC800 34%, #F46B15 67%, #940F11 100%)",
                    border: "1px solid #1A1A1A",
                  }}
                />
                <span>más ha</span>
              </div>
            </div>

            <div className="relative mt-1 h-2 rounded-full bg-[#1A1A1A]/15">
              {/* Gradiente estacional (CONAE 2022–2026): verano bordo, invierno claro */}
              <div
                className="absolute inset-y-0 left-0 overflow-hidden rounded-full"
                style={{ width: `${progressPct}%` }}
              >
                <div
                  className="h-full"
                  style={{
                    width:
                      progressPct > 0
                        ? `${(100 / progressPct) * 100}%`
                        : "100%",
                    backgroundImage: seasonGradient,
                  }}
                />
              </div>
              <div
                className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#1A1A1A] shadow-sm"
                style={{ left: `${progressPct}%`, backgroundColor: thumbColor }}
              />
            </div>
            <p className="text-[10px] tracking-wide opacity-55">
              Color de la barra: media histórica de hectáreas por mes calendario
              (CONAE, Patagonia 2022–2026) · verano más intenso, invierno más claro
            </p>
            <div className="relative h-4 text-[11px] tracking-wide uppercase opacity-70">
              {YEAR_TICKS.map((tick) => {
                const idx = MONTHS.indexOf(tick.iso);
                const left = idx < 0 ? 0 : (idx / (MONTHS.length - 1)) * 100;
                return (
                  <span
                    key={tick.year}
                    className="absolute -translate-x-1/2"
                    style={{ left: `${left}%` }}
                  >
                    {tick.year}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
