"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { OtbnMapClient } from "@/components/maps/OtbnMapClient";
import { OTBN_COLORS, OTBN_ZONA_LABELS, type OtbnZona } from "@/lib/otbnColors";
import { ATLAS_STEPS, type AtlasStepId } from "@/lib/atlasSteps";
import {
  OTBN_PROVINCES,
  type OtbnProvinceFilter,
} from "@/lib/otbnCopy";

function AtlasDots({
  active,
  onSelect,
}: {
  active: AtlasStepId;
  onSelect: (id: AtlasStepId) => void;
}) {
  return (
    <div
      className="flex shrink-0 items-center justify-center gap-2.5 py-2.5"
      role="tablist"
      aria-label="Pasos del mapa"
    >
      {ATLAS_STEPS.map((step, index) => {
        const selected = step.id === active;
        return (
          <button
            key={step.id}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-label={`${index + 1}. ${step.title}`}
            onClick={() => onSelect(step.id)}
            className={`h-2.5 w-2.5 rounded-full border border-current/70 transition-colors ${
              selected ? "bg-current" : "bg-transparent hover:bg-current/40"
            }`}
          />
        );
      })}
    </div>
  );
}

export function OtbnSection() {
  const [step, setStep] = useState<AtlasStepId>("argentina");
  const [filtersActive, setFiltersActive] = useState(false);
  const [province, setProvince] = useState<OtbnProvinceFilter>("all");
  const [highlightZona, setHighlightZona] = useState<number | null>(null);
  const panelRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const ids = [...ATLAS_STEPS.map((s) => s.id), "filters"] as const;

    const syncFromScroll = () => {
      const mid = window.innerHeight * 0.42;
      let bestId: (typeof ids)[number] = "argentina";
      let bestDist = Infinity;
      for (const id of ids) {
        const el = document.getElementById(`atlas-step-${id}`);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const dist = Math.abs(center - mid);
        if (dist < bestDist) {
          bestDist = dist;
          bestId = id;
        }
      }
      if (bestId === "filters") {
        setStep("otbn-3");
        setFiltersActive(true);
        return;
      }
      setStep(bestId);
      setFiltersActive(bestId === "otbn-3");
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

  const scrollToStep = (id: AtlasStepId) => {
    setStep(id);
    setFiltersActive(id === "otbn-3");
    const el =
      panelRefs.current[id] ?? document.getElementById(`atlas-step-${id}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const showFilters = filtersActive;

  return (
    <section id="otbn" className="relative scroll-mt-8 bg-[#160808] py-16 text-[#f3efe8] md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8 lg:px-12">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#f3efe8]/80">
          Momento IV · Territorio
        </p>
        <h2 className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-3xl leading-tight md:text-5xl">
          El mapa que decide qué bosque se puede tocar
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#f3efe8]/90 md:text-lg">
          Del recorte nacional a las cinco provincias, después a la franja de
          Bosques Patagónicos, y de ahí al Ordenamiento Territorial de Bosques
          Nativos (Ley 26.331): tres categorías que dicen dónde se puede tocar
          el bosque.
        </p>
      </div>

      <div className="relative mx-auto mt-10 max-w-6xl px-4 md:px-8">
        <div className="sticky top-0 z-20 flex h-[42vh] w-full flex-col lg:top-16 lg:ml-auto lg:h-[calc(100dvh-5rem)] lg:w-[calc(50%-1rem)]">
          <div className="relative min-h-0 flex-1 overflow-hidden border-t border-current/15 bg-[#C9C6C1] lg:border lg:border-b-0">
            <OtbnMapClient
              step={step}
              provinceFilter={showFilters ? province : "all"}
              highlightZona={showFilters ? highlightZona : null}
              interactive={false}
              className="h-full w-full"
            />
          </div>
          <div className="border-b border-current/15 bg-[#C9C6C1] text-[#1A1A1A] lg:border lg:border-t-0">
            <AtlasDots active={step} onSelect={scrollToStep} />
          </div>
        </div>

        <div className="-mt-[42vh] pt-[42vh] lg:-mt-[calc(100dvh-5rem)] lg:w-[calc(50%-1rem)] lg:pt-0">
          {ATLAS_STEPS.map((item) => (
            <article
              key={item.id}
              id={`atlas-step-${item.id}`}
              ref={(node) => {
                panelRefs.current[item.id] = node;
              }}
              className="flex min-h-[80vh] items-center py-12 lg:pr-6"
            >
              <div
                className={`max-w-xl rounded-sm border px-5 py-5 transition-colors md:px-6 md:py-6 ${
                  step === item.id
                    ? "border-current/35 bg-current/10"
                    : "border-current/15 bg-current/5"
                }`}
              >
                <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#f3efe8]/80">
                  {item.kicker}
                </p>
                <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl leading-tight md:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#f3efe8]/90 md:text-base">
                  {item.body}
                </p>
              </div>
            </article>
          ))}

          <article
            id="atlas-step-filters"
            className="flex min-h-[70vh] items-center py-12 lg:pr-6"
          >
            <div className="max-w-xl space-y-5 rounded-sm border border-current/25 bg-current/10 px-5 py-5 md:px-6 md:py-6">
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#f3efe8]/80">
                Explorar
              </p>
              <h3 className="font-[family-name:var(--font-display)] text-2xl leading-tight md:text-3xl">
                Filtrar por provincia y categoría
              </h3>
              <p className="text-sm leading-relaxed text-[#f3efe8]/90 md:text-base">
                Santa Cruz publica I y II; el resto incluye III. El mapa sigue
                bloqueado: cambiá el recorte desde acá o abrilo a pantalla
                completa.
              </p>

              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setProvince("all")}
                  className={`rounded-sm px-3 py-1.5 ${
                    province === "all"
                      ? "bg-current/25 font-semibold"
                      : "bg-current/10 text-[#f3efe8]/90 hover:bg-current/15"
                  }`}
                >
                  Las cinco provincias
                </button>
                {OTBN_PROVINCES.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setProvince(id)}
                    className={`rounded-sm px-3 py-1.5 ${
                      province === id
                        ? "bg-current/25 font-semibold"
                        : "bg-current/10 text-[#f3efe8]/90 hover:bg-current/15"
                    }`}
                  >
                    {id}
                  </button>
                ))}
              </div>

              <div className="grid gap-2">
                {([1, 2, 3] as const).map((zona) => {
                  const active = highlightZona === zona;
                  return (
                    <button
                      key={zona}
                      type="button"
                      onClick={() =>
                        setHighlightZona((prev) => (prev === zona ? null : zona))
                      }
                      className={`flex items-center gap-3 rounded-sm border px-3 py-2.5 text-left ${
                        active
                          ? "border-current/35 bg-current/12"
                          : "border-current/12 bg-current/5 hover:bg-current/8"
                      }`}
                    >
                      <span
                        className="h-3 w-3 shrink-0 rounded-[2px]"
                        style={{ background: OTBN_COLORS[zona] }}
                        aria-hidden
                      />
                      <span className="text-sm">
                        {zona === 1 ? "I" : zona === 2 ? "II" : "III"} ·{" "}
                        {OTBN_ZONA_LABELS[zona as OtbnZona]}
                      </span>
                    </button>
                  );
                })}
              </div>

              <Link
                href="/otbn"
                className="inline-block text-sm font-semibold underline-offset-4 hover:underline"
              >
                Ver mapa a pantalla completa →
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
