"use client";

import { useCallback, useEffect, useState } from "react";
import { OtbnMapClient } from "@/components/maps/OtbnMapClient";
import { AtlasShareBar } from "@/components/charts/AtlasShareBar";
import {
  ATLAS_PANELS,
  OTBN_CATEGORY_BULLETS,
  type AtlasPanel,
  type AtlasStep,
  type AtlasStepId,
} from "@/lib/atlasSteps";

function panelForStep(step: AtlasStepId): AtlasPanel {
  return (
    ATLAS_PANELS.find((panel) => panel.steps.some((item) => item.id === step)) ??
    ATLAS_PANELS[0]
  );
}

/** Índice de subpaso según el progreso 0–1 dentro del panel. */
function stepIndexFromProgress(progress: number, stepCount: number): number {
  if (stepCount <= 1) return 0;
  const clamped = Math.min(Math.max(progress, 0), 0.999);
  return Math.min(stepCount - 1, Math.floor(clamped * stepCount));
}

function AtlasStepCard({
  displayed,
  isActive,
  highlightZona,
  onHighlightZona,
  compact = false,
}: {
  displayed: AtlasStep;
  isActive: boolean;
  highlightZona: number | null;
  onHighlightZona: (zona: number | null) => void;
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact
          ? "ui-panel ui-panel--dock pointer-events-auto max-h-[min(200px,32svh)] w-full overflow-y-auto overscroll-y-contain px-3 py-2 touch-pan-y"
          : "ui-panel ui-panel--accent pointer-events-auto max-h-[min(72svh,calc(100svh-5.5rem))] overflow-y-auto overscroll-contain px-5 py-5 md:max-h-none md:overflow-visible md:px-6 md:py-6"
      }
      style={
        compact
          ? undefined
          : {
              width: "min(450px, calc(100vw - 2rem))",
              marginLeft:
                "max(1rem, calc(33vw - min(225px, calc(50vw - 1rem))))",
            }
      }
    >
      <h3
        className={
          compact
            ? "font-sans text-[15px] leading-tight font-bold text-white"
            : "font-sans text-2xl leading-tight font-bold text-white md:text-[26px]"
        }
      >
        {displayed.title}
      </h3>
      {displayed.kicker ? (
        <p
          className={
            compact
              ? "mt-1 font-sans text-[13px] leading-snug font-bold text-white/90"
              : "mt-2 font-sans text-lg leading-snug font-bold text-white/90 md:text-xl"
          }
        >
          {displayed.kicker}
        </p>
      ) : null}
      {displayed.body ? (
        <p
          className={
            compact
              ? "mt-1.5 text-[12px] leading-snug text-white"
              : "mt-3 text-md leading-relaxed text-white"
          }
        >
          {displayed.body}
        </p>
      ) : null}
      {displayed.charts.length > 0 ? (
        <div
          className={compact ? "mt-2 space-y-2" : displayed.body ? "mt-5 space-y-4" : "mt-6 space-y-4"}
        >
          {displayed.charts.map((chart, index) => (
            <div
              key={chart.id}
              className={
                index > 0
                  ? compact
                    ? "border-t border-foreground/35 pt-2"
                    : "border-t border-foreground/35 pt-4"
                  : undefined
              }
            >
              {chart.label ? (
                <p
                  className={
                    compact
                      ? "mb-1 text-[12px] leading-none text-white"
                      : "mb-4 text-lg leading-none text-white"
                  }
                >
                  <span className="font-bold">{chart.label}:</span>
                  {chart.hectaresLabel ? <span> {chart.hectaresLabel}</span> : null}
                </p>
              ) : null}
              <AtlasShareBar
                bar={chart.bar}
                compact={compact}
                highlightZona={isActive ? highlightZona : null}
                onHighlightZona={
                  isActive && chart.bar.variant === "stacked"
                    ? onHighlightZona
                    : undefined
                }
              />
            </div>
          ))}
        </div>
      ) : null}
      {displayed.note ? (
        <p
          className={
            compact
              ? "mt-2 text-[11px] leading-snug text-foreground/65"
              : "mt-5 leading-relaxed text-[14px] text-foreground/65"
          }
        >
          {displayed.note.before}
          <a href={displayed.note.href} target="_blank" rel="noopener noreferrer">
            {displayed.note.linkLabel}
          </a>
          {displayed.note.after}
        </p>
      ) : null}
      {displayed.showCategoryLegend ? (
        <ul
          className={
            compact
              ? "mt-2 space-y-1 text-[11px] leading-snug text-white/85"
              : "mt-4 space-y-4 text-sm leading-relaxed text-white/85"
          }
        >
          {OTBN_CATEGORY_BULLETS.map((bullet) => {
            const dimmed =
              isActive && highlightZona != null && highlightZona !== bullet.zona;
            return (
              <li
                key={bullet.zona}
                className={`flex flex-row transition-opacity duration-300 ${
                  isActive ? "cursor-pointer" : ""
                }`}
                style={{ opacity: dimmed ? 0.28 : 1 }}
                onMouseEnter={
                  isActive ? () => onHighlightZona(bullet.zona) : undefined
                }
                onMouseLeave={isActive ? () => onHighlightZona(null) : undefined}
              >
                <div
                  className={
                    compact
                      ? "mr-1.5 min-h-3.5 w-1 flex-shrink-0 font-semibold text-white"
                      : "mr-2 min-h-5 w-1 flex-shrink-0 font-semibold text-white"
                  }
                  style={{ background: bullet.color }}
                />
                <div className="flex-grow text-white">
                  Categoría {bullet.code}:{bullet.text}
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

export function OtbnSection() {
  const [step, setStep] = useState<AtlasStepId>("bosques");
  const [highlightZona, setHighlightZona] = useState<number | null>(null);
  const onHighlightZona = useCallback((zona: number | null) => {
    setHighlightZona((current) => (current === zona ? current : zona));
  }, []);

  useEffect(() => {
    setHighlightZona(null);
  }, [step]);

  useEffect(() => {
    const syncFromScroll = () => {
      const mid = window.innerHeight * 0.42;
      let best = ATLAS_PANELS[0];
      let bestDist = Infinity;
      for (const panel of ATLAS_PANELS) {
        const el = document.getElementById(`atlas-panel-${panel.id}`);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= mid && rect.bottom >= mid) {
          const t = (mid - rect.top) / Math.max(rect.height, 1);
          const idx = stepIndexFromProgress(t, panel.steps.length);
          setStep(panel.steps[idx].id);
          return;
        }
        const center = rect.top + rect.height / 2;
        const dist = Math.abs(center - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = panel;
        }
      }
      setStep(best.steps[0].id);
    };

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(syncFromScroll);
    };

    syncFromScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const activePanel = panelForStep(step);
  const active =
    activePanel.steps.find((item) => item.id === step) ?? activePanel.steps[0];
  const barInteractive = active.charts.some((chart) => chart.bar.variant === "stacked");

  return (
    <section
      id="otbn"
      className="relative scroll-mt-8 bg-background text-foreground"
    >
          <div className="pointer-events-none px-4 md:px-8 lg:px-12 lg:pr-6">
            <div className="section-rule mx-auto w-full max-w-[800px] px-6">
              <h2 className="type-h2">El mapa del riesgo</h2>
              <p className="type-bajada">
                La ecorregión que merece ser mirada con más atención
              </p>
            </div>
          </div>
      <div className="relative">
        <div className="sticky top-0 z-10 h-svh w-full">
          <div className="relative h-full overflow-hidden bg-background">
            <OtbnMapClient
              step={step}
              highlightZona={barInteractive ? highlightZona : null}
              onHighlightZona={onHighlightZona}
              interactive={false}
              className="h-full w-full"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 z-[15] h-12 bg-gradient-to-b from-background from-0% via-background/55 via-[45%] to-transparent to-[85%] md:h-20"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] hidden h-20 bg-gradient-to-t from-background from-0% via-background/55 via-[45%] to-transparent to-[85%] md:block"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden">
              <AtlasStepCard
                displayed={active}
                isActive
                highlightZona={highlightZona}
                onHighlightZona={onHighlightZona}
                compact
              />
            </div>
          </div>
        </div>

        <div className="pointer-events-none relative z-30 -mt-[100svh]">


          {ATLAS_PANELS.map((panel) => {
            const multi = panel.steps.length > 1;
            // Un solo paso también necesita sticky + altura para que el mapa haga zoom.
            const stickyPanel = multi || panel.steps[0]?.fit === "province";
            const displayed =
              panel.steps.find((item) => item.id === step) ?? panel.steps[0];
            const isActive = panel.steps.some((item) => item.id === step);
            const panelMinH = multi
              ? `${panel.steps.length * 120}vh`
              : stickyPanel
                ? "140vh"
                : undefined;
            return (
              <article
                key={panel.id}
                id={`atlas-panel-${panel.id}`}
                className={
                  stickyPanel
                    ? "relative"
                    : "flex min-h-[80vh] items-center py-12"
                }
                style={panelMinH ? { minHeight: panelMinH } : undefined}
              >
                <div
                  className={
                    stickyPanel
                      ? "sticky top-0 hidden h-svh items-center md:flex"
                      : "hidden w-full md:block"
                  }
                >
                  <div className="w-full">
                    <AtlasStepCard
                      displayed={displayed}
                      isActive={isActive}
                      highlightZona={highlightZona}
                      onHighlightZona={onHighlightZona}
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
