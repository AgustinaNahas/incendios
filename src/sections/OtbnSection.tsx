"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
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
            className={`h-2 w-2 rounded-full border border-[#f3efe8]/50 transition-colors ${
              selected ? "bg-[#f3efe8]" : "bg-transparent hover:bg-[#f3efe8]/40"
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
  const [categoryReveal, setCategoryReveal] = useState(0);
  const panelRefs = useRef<Record<string, HTMLElement | null>>({});
  const ignoreScrollRef = useRef(false);
  const onHighlightZona = useCallback((zona: number | null) => {
    setHighlightZona(zona);
  }, []);

  useEffect(() => {
    setHighlightZona(null);
    setCategoryReveal(0);
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
      className="relative scroll-mt-8 bg-[#2B2B2B] text-[#f3efe8]"
    >
          <div className="pointer-events-none px-4 pt-8 md:px-8 lg:px-12 lg:pr-6 ">
            <h2 className="type-h3 mx-auto w-full max-w-[800px] px-6 pb-4">
              El mapa del riesgo
            </h2>
          </div>
      <div className="relative">
        <div className="sticky top-0 z-10 h-svh w-full">
          <div className="relative h-full overflow-hidden bg-[#2B2B2B]">
            <OtbnMapClient
              step={step}
              highlightZona={barInteractive ? highlightZona : null}
              interactive={false}
              className="h-full w-full"
            />
            <div className="pointer-events-auto absolute inset-x-0 bottom-3 z-20">
              <AtlasDots activePanel={activePanel.id} onSelect={scrollToPanel} />
            </div>
          </div>
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-[15] h-[19svh] bg-gradient-to-b from-[#2B2B2B] from-10% via-[#2B2B2B]/75 via-55% to-transparent"
        />

        <div className="pointer-events-none relative z-30 -mt-[100svh] lg:w-1/2">


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
                    ? "relative px-4 md:px-8 lg:px-12"
                    : "flex min-h-[80vh] items-center px-4 py-12 md:px-8 lg:px-12 lg:pr-6"
                }
                style={panelMinH ? { minHeight: panelMinH } : undefined}
              >
                <div
                  className={
                    stickyPanel
                      ? "sticky top-0 flex h-svh items-center py-12 lg:pr-6"
                      : "w-full"
                  }
                >
                  <div className="pointer-events-auto w-full space-y-4">
                    <div
                      className={`max-w-[800px] border px-5 py-5 transition-colors md:px-6 md:py-6 ${
                        isActive
                          ? "border-[#f3efe8]/75 bg-[#141414]"
                          : "border-[#f3efe8]/20 bg-[#141414]/80"
                      }`}
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
                                  ? "border-t border-[#f3efe8]/35 pt-4"
                                  : undefined
                              }
                            >
                              {chart.label ? (
                                <p className="mb-2 text-lg leading-none text-white">
                                  <span>{chart.label}</span>
                                  {chart.hectaresLabel ? (
                                    <span className="ml-3">{chart.hectaresLabel}</span>
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
                                onSegmentReveal={
                                  isActive &&
                                  displayed.showCategoryLegend &&
                                  chart.bar.variant === "stacked"
                                    ? (segmentIndex) =>
                                        setCategoryReveal((n) =>
                                          Math.max(n, segmentIndex + 1),
                                        )
                                    : undefined
                                }
                              />
                            </div>
                          ))}
                        </div>
                      ) : null}
                      {displayed.showCategoryLegend ? (
                        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-white/85">
                          {OTBN_CATEGORY_BULLETS.map((bullet, index) => {
                            const visible = categoryReveal > index;
                            const dimmed =
                              isActive &&
                              highlightZona != null &&
                              highlightZona !== bullet.zona;
                            return (
                              <li
                                key={bullet.zona}
                                className="transition-opacity duration-500"
                                style={{
                                  opacity: visible ? (dimmed ? 0.28 : 1) : 0,
                                }}
                              >
                                <span
                                  className="mr-1.5 inline-block px-1.5 py-0.5 font-semibold text-white"
                                  style={{ background: bullet.color }}
                                >
                                  Categoría {bullet.code}
                                </span>{" "}
                                {bullet.text}
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

          <p className="pointer-events-auto px-4 pb-10 text-sm text-[#f3efe8]/70 md:px-8 lg:px-12 lg:pr-6">
            <Link
              href="/otbn"
              className="font-semibold underline-offset-4 hover:underline"
            >
              Ver mapa a pantalla completa →
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
