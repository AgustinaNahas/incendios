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
    <div className="relative h-svh w-full overflow-hidden bg-[#C9C6C1] text-[#1A1A1A]">
      <OtbnMapClient
        explorer
        interactive
        provinceFilter={province}
        highlightZona={highlightZona}
        className="absolute inset-0 h-full w-full"
      />

      <div className="pointer-events-none absolute inset-0 z-[1000] flex flex-col justify-between p-3 md:p-5">
        <header className="pointer-events-auto flex items-start justify-between gap-3">
          <div className="max-w-xl rounded-sm border border-[#1A1A1A]/15 bg-[#F6F3EE]/92 px-4 py-3 backdrop-blur-md md:px-5 md:py-4">
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase opacity-65">
              OTBN · Ley 26.331
            </p>
            <h1 className="mt-1 font-[family-name:var(--font-display)] text-2xl leading-tight md:text-3xl">
              Zonas de bosque nativo
            </h1>
            <p className="mt-2 text-sm leading-relaxed opacity-80">
              Neuquén, Río Negro, Chubut, Santa Cruz y Tierra del Fuego. Tocá una
              categoría para resaltarla sobre el atlas.
            </p>
          </div>
          <Link
            href="/#otbn"
            className="rounded-sm border border-[#1A1A1A]/20 bg-[#F6F3EE]/92 px-3 py-2 text-xs font-semibold backdrop-blur-md hover:bg-white"
          >
            ← Volver al relato
          </Link>
        </header>

        <div className="pointer-events-auto flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setProvince("all")}
              className={`rounded-sm px-3 py-1.5 text-xs backdrop-blur-md ${
                province === "all"
                  ? "bg-[#1A1A1A] font-semibold text-[#F6F3EE]"
                  : "bg-[#F6F3EE]/90 opacity-80 hover:opacity-100"
              }`}
            >
              Todas
            </button>
            {OTBN_PROVINCES.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setProvince(id)}
                className={`rounded-sm px-3 py-1.5 text-xs backdrop-blur-md ${
                  province === id
                    ? "bg-[#1A1A1A] font-semibold text-[#F6F3EE]"
                    : "bg-[#F6F3EE]/90 opacity-80 hover:opacity-100"
                }`}
              >
                {id}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setPanelOpen((v) => !v)}
            className="self-start rounded-sm border border-[#1A1A1A]/20 bg-[#F6F3EE]/90 px-3 py-1.5 text-xs backdrop-blur-md md:hidden"
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
        <div className="max-h-[70vh] space-y-2 overflow-y-auto rounded-sm border border-[#1A1A1A]/15 bg-[#F6F3EE]/94 p-3 backdrop-blur-md md:p-4">
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
                className={`w-full rounded-sm border px-3 py-3 text-left transition-colors ${
                  active
                    ? "border-[#1A1A1A]/40 bg-[#1A1A1A]/8"
                    : "border-[#1A1A1A]/10 bg-white/40 hover:bg-white/70"
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
