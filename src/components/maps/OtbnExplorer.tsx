"use client";

import { useState } from "react";
import Link from "next/link";
import { OtbnMapClient } from "@/components/maps/OtbnMapClient";
import { OTBN_COLORS, type OtbnZona } from "@/lib/otbnColors";
import {
  OTBN_ZONA_COPY,
  OTBN_PROVINCES,
  type OtbnProvinceFilter,
} from "@/lib/otbnCopy";

export function OtbnExplorer() {
  const [province, setProvince] = useState<OtbnProvinceFilter>("all");
  const [highlightZona, setHighlightZona] = useState<number | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);

  return (
    <div className="relative h-svh w-full overflow-hidden bg-[#2B2B2B] text-[#f3efe8]">
      <OtbnMapClient
        explorer
        interactive
        provinceFilter={province}
        highlightZona={highlightZona}
        className="absolute inset-0 h-full w-full"
      />

      <div className="pointer-events-none absolute inset-0 z-[1000] flex flex-col justify-between p-3 md:p-5">
        <header className="pointer-events-auto flex items-start justify-between gap-3">
          <div className="max-w-xl border border-[#f3efe8]/15 bg-[#2B2B2B]/78 px-4 py-3 backdrop-blur-md md:px-5 md:py-4">
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase opacity-65">
              OTBN · Ley 26.331
            </p>
            <h1 className="mt-1 font-[family-name:var(--font-display)] text-2xl leading-tight md:text-3xl">
              Zonas de bosque nativo
            </h1>
            <p className="mt-2 text-sm leading-relaxed opacity-80">
              Neuquén, Río Negro, Chubut, Santa Cruz y Tierra del Fuego. Pasá el
              cursor por una categoría para resaltarla.
            </p>
          </div>
          <Link
            href="/#otbn"
            className="border border-[#f3efe8]/20 bg-[#2B2B2B]/78 px-3 py-2 text-xs font-semibold backdrop-blur-md hover:bg-[#1a0a0a]"
          >
            ← Volver al relato
          </Link>
        </header>

        <div className="pointer-events-auto flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setProvince("all")}
              className={`px-3 py-1.5 text-xs backdrop-blur-md ${
                province === "all"
                  ? "bg-[#f3efe8] font-semibold text-[#2B2B2B]"
                  : "bg-[#2B2B2B]/70 opacity-80 hover:opacity-100"
              }`}
            >
              Todas
            </button>
            {OTBN_PROVINCES.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setProvince(id)}
                className={`px-3 py-1.5 text-xs backdrop-blur-md ${
                  province === id
                    ? "bg-[#f3efe8] font-semibold text-[#2B2B2B]"
                    : "bg-[#2B2B2B]/70 opacity-80 hover:opacity-100"
                }`}
              >
                {id}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setPanelOpen((v) => !v)}
            className="self-start border border-[#f3efe8]/20 bg-[#2B2B2B]/80 px-3 py-1.5 text-xs backdrop-blur-md md:hidden"
          >
            {panelOpen ? "Ocultar categorías" : "Ver categorías"}
          </button>
        </div>
      </div>

      <aside
        className={`absolute right-3 top-1/2 z-[1000] w-[min(100%-1.5rem,22rem)] -translate-y-1/2 transition-all md:right-5 ${
          panelOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0 md:pointer-events-auto md:opacity-100"
        }`}
      >
        <div className="max-h-[70vh] space-y-2 overflow-y-auto border border-[#f3efe8]/15 bg-[#2B2B2B]/86 p-3 backdrop-blur-md md:p-4">
          <p className="px-1 text-[10px] font-semibold tracking-[0.18em] uppercase opacity-60">
            Las tres categorías
          </p>
          {([1, 2, 3] as const).map((zona) => {
            const item = OTBN_ZONA_COPY[zona];
            const active = highlightZona === zona;
            return (
              <button
                key={zona}
                type="button"
                onClick={() =>
                  setHighlightZona((prev) => (prev === zona ? null : zona))
                }
                onMouseEnter={() => setHighlightZona(zona)}
                onMouseLeave={() => setHighlightZona(null)}
                className={`w-full border px-3 py-3 text-left transition-colors ${
                  active
                    ? "border-[#f3efe8]/40 bg-[#f3efe8]/8"
                    : "border-[#f3efe8]/10 bg-[#f3efe8]/4 hover:bg-[#f3efe8]/8"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-[2px]"
                    style={{ background: OTBN_COLORS[zona as OtbnZona] }}
                    aria-hidden
                  />
                  <span className="text-[11px] font-semibold tracking-wide uppercase opacity-70">
                    Categoría {item.code}
                  </span>
                </div>
                <p className="mt-1 font-[family-name:var(--font-display)] text-lg">
                  {item.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed opacity-80">
                  {item.body}
                </p>
              </button>
            );
          })}
          <p className="px-1 pt-1 text-[10px] leading-relaxed opacity-55">
            Santa Cruz publica I y II; el resto incluye III.
          </p>
        </div>
      </aside>
    </div>
  );
}
