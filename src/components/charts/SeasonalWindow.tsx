"use client";

import { useMemo } from "react";
import * as d3 from "d3";
import type { ProvinceYearValue } from "@/lib/parseRii";

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const PREVENTION_WINDOW = new Set([
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
]);

type Props = {
  data: ProvinceYearValue[];
  year?: number;
  title?: string;
};

export function SeasonalWindow({ data, year = 2024, title }: Props) {
  const width = 440;
  const height = 180;
  const margin = { top: 36, right: 12, bottom: 28, left: 12 };

  const values = useMemo(() => {
    return MONTHS.map((month) => {
      const row = data.find((d) => d.jurisdiction === month && d.year === year);
      return { month, value: row?.value ?? 0 };
    });
  }, [data, year]);

  const max = d3.max(values, (d) => d.value) ?? 1;
  const x = d3
    .scaleBand()
    .domain(MONTHS)
    .range([0, width - margin.left - margin.right])
    .padding(0.2);
  const y = d3
    .scaleLinear()
    .domain([0, max])
    .range([height - margin.top - margin.bottom, 0]);

  return (
    <div>
      {title ? (
        <p className="mb-2 text-xs font-semibold tracking-wide uppercase opacity-70">
          {title}
        </p>
      ) : null}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label="Ventana de prevención vs pico de incendios"
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* prevention band */}
          {(() => {
            const indices = MONTHS.map((m, i) =>
              PREVENTION_WINDOW.has(m) ? i : -1,
            ).filter((i) => i >= 0);
            const first = indices[0] ?? 0;
            const last = indices[indices.length - 1] ?? 0;
            const x0 = x(MONTHS[first]) ?? 0;
            const x1 = (x(MONTHS[last]) ?? 0) + x.bandwidth();
            return (
              <rect
                x={x0}
                y={-18}
                width={x1 - x0}
                height={height - margin.top - margin.bottom + 18}
                fill="#3d6b55"
                opacity={0.18}
                rx={3}
              />
            );
          })()}
          <text
            x={(x("Junio") ?? 0) + x.bandwidth() / 2}
            y={-8}
            textAnchor="middle"
            className="fill-current text-[9px]"
            opacity={0.75}
          >
            Ventana de prevención
          </text>
          {values.map((d) => (
            <rect
              key={d.month}
              x={x(d.month)}
              y={y(d.value)}
              width={x.bandwidth()}
              height={Math.max(0, height - margin.top - margin.bottom - y(d.value))}
              fill={PREVENTION_WINDOW.has(d.month) ? "#3d6b55" : "#ff6b2d"}
              opacity={0.85}
            />
          ))}
          {MONTHS.map((m, i) =>
            i % 2 === 0 ? (
              <text
                key={m}
                x={(x(m) ?? 0) + x.bandwidth() / 2}
                y={height - margin.top - margin.bottom + 14}
                textAnchor="middle"
                className="fill-current text-[8px]"
                opacity={0.65}
              >
                {m.slice(0, 3)}
              </text>
            ) : null,
          )}
        </g>
      </svg>
      <p className="mt-1 text-[11px] opacity-60">
        Incendios mensuales {year} (país) · RII · franja = meses para actuar antes del pico
      </p>
    </div>
  );
}
