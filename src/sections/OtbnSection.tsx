"use client";

import { useState } from "react";
import Link from "next/link";
import { OtbnMapClient } from "@/components/maps/OtbnMapClient";
import { OTBN_COLORS, OTBN_ZONA_LABELS, type OtbnZona } from "@/lib/otbnColors";
import {
  OTBN_ZONA_COPY,
  type OtbnProvinceFilter,
} from "@/lib/otbnCopy";

export function OtbnSection() {
  const [province, setProvince] = useState<OtbnProvinceFilter>("all");
  const [highlightZona, setHighlightZona] = useState<number | null>(null);

  return (
    <section
      id="otbn"
      className="relative scroll-mt-8 py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl space-y-6 px-4 md:px-8 lg:px-12">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase opacity-70">
          Momento IV · Territorio
        </p>
        <h2 className="max-w-3xl font-[family-name:var(--font-display)] text-3xl leading-tight md:text-5xl">
          El mapa que decide qué bosque se puede tocar
        </h2>
        <p className="max-w-2xl text-base leading-relaxed opacity-85 md:text-lg">
          El Ordenamiento Territorial de Bosques Nativos (OTBN) es la cartografía
          de la Ley 26.331: clasifica el bosque en tres categorías. Acá, Chubut y
          Santa Cruz sobre un mapa de referencia.
        </p>

        <div className="grid gap-3 md:grid-cols-3">
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
                className={`rounded-sm border px-4 py-3 text-left transition-colors ${
                  active
                    ? "border-current/35 bg-current/10"
                    : "border-current/15 bg-current/5 hover:bg-current/8"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-[2px]"
                    style={{ background: OTBN_COLORS[zona] }}
                    aria-hidden
                  />
                  <p className="text-xs font-semibold tracking-wide uppercase opacity-70">
                    Categoría {item.code}
                  </p>
                </div>
                <p className="mt-1 font-[family-name:var(--font-display)] text-xl">
                  {item.title}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed opacity-80">
                  {item.body}
                </p>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          {(
            [
              ["all", "Chubut + Santa Cruz"],
              ["Chubut", "Solo Chubut"],
              ["Santa Cruz", "Solo Santa Cruz"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setProvince(id)}
              className={`underline-offset-4 ${
                province === id ? "underline font-semibold" : "opacity-70"
              }`}
            >
              {label}
            </button>
          ))}
          <Link
            href="/otbn"
            className="ml-auto font-semibold underline-offset-4 hover:underline"
          >
            Ver mapa a pantalla completa →
          </Link>
        </div>
      </div>

      <div className="mt-8 w-full px-0 md:px-4 lg:px-8">
        <div className="overflow-hidden border-y border-current/15 bg-current/5 md:rounded-sm md:border">
          <OtbnMapClient
            provinceFilter={province}
            highlightZona={highlightZona}
            className="h-[min(72vh,640px)] w-full"
          />
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 text-[11px] md:px-5">
            {([1, 2, 3] as const).map((zona) => (
              <span key={zona} className="flex items-center gap-1.5 opacity-85">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-[2px]"
                  style={{ background: OTBN_COLORS[zona] }}
                  aria-hidden
                />
                {zona === 1 ? "I" : zona === 2 ? "II" : "III"} ·{" "}
                {OTBN_ZONA_LABELS[zona as OtbnZona]}
              </span>
            ))}
            <span className="opacity-55">Base · OpenStreetMap</span>
          </div>
        </div>
      </div>
    </section>
  );
}
