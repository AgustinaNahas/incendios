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

const PROVINCE_SECOND_AT = 0.55;

function panelForStep(step: AtlasStepId): AtlasPanel {
  return (
    ATLAS_PANELS.find((panel) => panel.steps.some((item) => item.id === step)) ??
    ATLAS_PANELS[0]
  );
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
  const [step, setStep] = useState<AtlasStepId>("ecoregion");
  const [highlightZona, setHighlightZona] = useState<number | null>(null);
  const panelRefs = useRef<Record<string, HTMLElement | null>>({});
  const ignoreScrollRef = useRef(false);
  const onHighlightZona = useCallback((zona: number | null) => {
    setHighlightZona(zona);
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
          const next =
            panel.steps.length > 1 && t >= PROVINCE_SECOND_AT
              ? panel.steps[1].id
              : panel.steps[0].id;
          setStep(next);
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
      block: panel && panel.steps.length > 1 ? "start" : "center",
    });
    window.setTimeout(() => {
      ignoreScrollRef.current = false;
    }, 900);
  };

  const activePanel = panelForStep(step);
  const active =
    activePanel.steps.find((item) => item.id === step) ?? activePanel.steps[0];
  const barInteractive = active.bar.variant === "stacked";

  return (
    <section
      id="otbn"
      className="relative scroll-mt-8 bg-[#2B2B2B] text-[#f3efe8]"
    >
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
          <div className="pointer-events-none px-4 pt-8 md:px-8 lg:px-12 lg:pr-6">
            <h2 className="max-w-[800px] font-[family-name:var(--font-display)] text-3xl leading-tight md:text-5xl">
              El territorio del fuego
            </h2>
          </div>

          {ATLAS_PANELS.map((panel) => {
            const multi = panel.steps.length > 1;
            const displayed =
              panel.steps.find((item) => item.id === step) ?? panel.steps[0];
            const isActive = panel.steps.some((item) => item.id === step);
            return (
              <article
                key={panel.id}
                id={`atlas-panel-${panel.id}`}
                ref={(node) => {
                  panelRefs.current[panel.id] = node;
                }}
                className={
                  multi
                    ? "relative min-h-[240vh] px-4 md:px-8 lg:px-12"
                    : "flex min-h-[80vh] items-center px-4 py-12 md:px-8 lg:px-12 lg:pr-6"
                }
              >
                <div
                  className={
                    multi
                      ? "sticky top-0 flex h-svh items-center py-12 lg:pr-6"
                      : "w-full"
                  }
                >
                  <div className="pointer-events-auto w-full max-w-[800px] space-y-4">
                    <div
                      className={`border px-5 py-5 transition-colors md:px-6 md:py-6 ${
                        isActive
                          ? "border-[#f3efe8]/25 bg-[#4a4a4a]/55"
                          : "border-[#f3efe8]/12 bg-[#3a3a3a]/40"
                      }`}
                    >
                      {multi ? (
                        <>
                          <h3 className="font-[family-name:var(--font-display)] text-2xl leading-tight md:text-3xl">
                            {displayed.kicker}
                          </h3>
                          <div
                            className="mt-2 flex h-0.5 w-14 gap-0.5"
                            aria-hidden
                          >
                            {panel.steps.map((item) => (
                              <span
                                key={item.id}
                                className={`h-full flex-1 ${
                                  item.id === displayed.id
                                    ? "bg-[#f3efe8]"
                                    : "bg-[#f3efe8]/25"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="mt-2 font-[family-name:var(--font-display)] text-lg leading-snug text-[#f3efe8]/90 md:text-xl">
                            {displayed.title}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#f3efe8]/70">
                            {displayed.kicker}
                          </p>
                          <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl leading-tight md:text-3xl">
                            {displayed.title}
                          </h3>
                        </>
                      )}
                      <p className="mt-3 text-sm leading-relaxed text-[#f3efe8]/88 md:text-base">
                        {displayed.body}
                      </p>
                      {displayed.showCategoryLegend ? (
                        <ul className="mt-4 space-y-1.5 text-sm leading-relaxed text-[#f3efe8]/85">
                          {OTBN_CATEGORY_BULLETS.map((bullet) => {
                            const dimmed =
                              isActive &&
                              highlightZona != null &&
                              highlightZona !== bullet.zona;
                            return (
                              <li
                                key={bullet.zona}
                                className="transition-opacity"
                                style={{ opacity: dimmed ? 0.28 : 1 }}
                              >
                                <span
                                  className="font-semibold"
                                  style={{ color: bullet.color }}
                                >
                                  Categoría {bullet.code}:
                                </span>{" "}
                                {bullet.text}
                              </li>
                            );
                          })}
                        </ul>
                      ) : null}
                    </div>

                    <AtlasShareBar
                      bar={displayed.bar}
                      active={isActive}
                      highlightZona={isActive ? highlightZona : null}
                      onHighlightZona={
                        isActive && displayed.bar.variant === "stacked"
                          ? onHighlightZona
                          : undefined
                      }
                    />
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
