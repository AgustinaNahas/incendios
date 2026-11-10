"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { OtbnMapClient } from "@/components/maps/OtbnMapClient";
import { AtlasShareBar } from "@/components/charts/AtlasShareBar";
import {
  ATLAS_PANELS,
  OTBN_CATEGORY_BULLETS,
  type AtlasPanel,
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

function AtlasDots({
  activePanel,
  onSelect,
}: {
  activePanel: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      className="flex shrink-0 flex-wrap items-center justify-center gap-1.5 py-2"
      role="tablist"
      aria-label="Pasos del mapa"
    >
      {ATLAS_PANELS.map((panel, index) => {
        const selected = panel.id === activePanel;
        return (
          <button
            key={panel.id}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-label={`${index + 1}. ${panel.label}`}
            onClick={() => onSelect(panel.id)}
            className={`h-2 w-2 rounded-full border border-accent transition-colors ${
              selected ? "bg-accent" : "bg-transparent hover:bg-accent/40"
            }`}
          />
        );
      })}
    </div>
  );
}

export function OtbnSection() {
  const [step, setStep] = useState<AtlasStepId>("bosques");
  const [highlightZona, setHighlightZona] = useState<number | null>(null);
  const panelRefs = useRef<Record<string, HTMLElement | null>>({});
  const ignoreScrollRef = useRef(false);
  const onHighlightZona = useCallback((zona: number | null) => {
    setHighlightZona((current) => (current === zona ? current : zona));
  }, []);

  useEffect(() => {
    setHighlightZona(null);
  }, [step]);

  useEffect(() => {
    const syncFromScroll = () => {
      if (ignoreScrollRef.current) return;
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

  const scrollToPanel = (panelId: string) => {
    const panel = ATLAS_PANELS.find((item) => item.id === panelId);
    if (panel) setStep(panel.steps[0].id);
    ignoreScrollRef.current = true;
    const el =
      panelRefs.current[panelId] ??
      document.getElementById(`atlas-panel-${panelId}`);
    el?.scrollIntoView({
      behavior: "smooth",
      block: panel && (panel.steps.length > 1 || panel.steps[0]?.fit === "province")
        ? "start"
        : "center",
    });
    window.setTimeout(() => {
      ignoreScrollRef.current = false;
    }, 900);
  };

  const activePanel = panelForStep(step);
  const active =
    activePanel.steps.find((item) => item.id === step) ?? activePanel.steps[0];
  const barInteractive = active.charts.some((chart) => chart.bar.variant === "stacked");

  return (
    <section
      id="otbn"
      className="relative scroll-mt-8 bg-background text-foreground"
    >
          <div className="pointer-events-none px-4 pt-8 md:px-8 lg:px-12 lg:pr-6 ">
            <h2 className="type-h2 mx-auto w-full max-w-[800px] px-6">
              <div className="border-t border-t-white/31 pb-12"></div>
              El mapa del riesgo
            </h2>
            <p className="type-bajada mx-auto w-full max-w-[800px] px-6">
              La ecorregión que merece ser mirada con más atención.
            </p>
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
              className="pointer-events-none absolute inset-x-0 top-0 z-[15] h-20 bg-gradient-to-b from-background from-0% via-background/55 via-[45%] to-transparent to-[85%]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-20 bg-gradient-to-t from-background from-0% via-background/55 via-[45%] to-transparent to-[85%]"
            />
            <div className="pointer-events-auto absolute inset-x-0 bottom-3 z-20">
              <AtlasDots activePanel={activePanel.id} onSelect={scrollToPanel} />
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
                ref={(node) => {
                  panelRefs.current[panel.id] = node;
                }}
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
                      ? "sticky top-0 flex h-svh items-center"
                      : "w-full"
                  }
                >
                  <div className="w-full">
                    <div
                      className="ui-panel ui-panel--accent pointer-events-auto max-h-[min(72svh,calc(100svh-5.5rem))] overflow-y-auto overscroll-contain px-5 py-5 md:max-h-none md:overflow-visible md:px-6 md:py-6"
                      style={{
                        width: "min(450px, calc(100vw - 2rem))",
                        marginLeft:
                          "max(1rem, calc(33vw - min(225px, calc(50vw - 1rem))))",
                      }}
                    >
                      <h3 className="font-sans text-2xl leading-tight font-bold text-white md:text-3xl">
                        {displayed.title}
                      </h3>
                      {displayed.kicker ? (
                        <p className="mt-2 font-sans text-lg leading-snug font-bold text-white/90 md:text-xl">
                          {displayed.kicker}
                        </p>
                      ) : null}
                      {displayed.body ? (
                        <p className="mt-3 text-md leading-relaxed text-white">
                          {displayed.body}
                        </p>
                      ) : null}
                      {displayed.charts.length > 0 ? (
                        <div className={displayed.body ? "mt-5 space-y-4" : "mt-6 space-y-4"}>
                          {displayed.charts.map((chart, index) => (
                            <div
                              key={chart.id}
                              className={
                                index > 0
                                  ? "border-t border-foreground/35 pt-4"
                                  : undefined
                              }
                            >
                              {chart.label ? (
                                <p className="mb-4 text-lg leading-none text-white">
                                  <span className="font-bold">{chart.label}:</span>
                                  {chart.hectaresLabel ? (
                                    <span> {chart.hectaresLabel}</span>
                                  ) : null}
                                </p>
                              ) : null}
                              <AtlasShareBar
                                bar={chart.bar}
                                active={isActive}
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
                        <p className="mt-5 text-base leading-relaxed text-white">
                          {displayed.note.before}
                          <a
                            href={displayed.note.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {displayed.note.linkLabel}
                          </a>
                          {displayed.note.after}
                        </p>
                      ) : null}
                      {displayed.showCategoryLegend ? (
                        <ul className="mt-4 space-y-4 text-sm leading-relaxed text-white/85">
                          {OTBN_CATEGORY_BULLETS.map((bullet) => {
                            const dimmed =
                              isActive &&
                              highlightZona != null &&
                              highlightZona !== bullet.zona;
                            return (
                              <li
                                key={bullet.zona}
                                className={`flex flex-row transition-opacity duration-300 ${
                                  isActive ? "cursor-pointer" : ""
                                }`}
                                style={{ opacity: dimmed ? 0.28 : 1 }}
                                onMouseEnter={
                                  isActive
                                    ? () => onHighlightZona(bullet.zona)
                                    : undefined
                                }
                                onMouseLeave={
                                  isActive ? () => onHighlightZona(null) : undefined
                                }
                              >
                                <div
                                  className="mr-2 min-h-5 w-1 flex-shrink-0 font-semibold text-white"
                                  style={{ background: bullet.color }}
                                >
                               </div>
                               <div className="flex-grow text-white">
                               Categoría {bullet.code} <br/>
                                
                                {bullet.text}
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      ) : null}
                    </div>
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
