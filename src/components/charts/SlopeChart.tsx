"use client";

import { useMemo } from "react";
import * as d3 from "d3";
import {
  COMPLETE_YEARS,
  PATAGONIA_PROVINCES,
  PROVINCE_COLORS,
  type PatagoniaProvince,
} from "@/lib/patagonia";
import type { ProvinceYearValue } from "@/lib/parseRii";

type Props = {
  data: ProvinceYearValue[];
  years?: readonly number[];
  title?: string;
};

export function SlopeChart({
  data,
  years = [2017, 2021, 2025],
  title,
}: Props) {
  const width = 420;
  const height = 260;
  const margin = { top: 28, right: 110, bottom: 24, left: 110 };

  const byProv = useMemo(() => {
    const map: Record<string, Record<number, number>> = {};
    for (const p of PATAGONIA_PROVINCES) map[p] = {};
    for (const row of data) {
      if (!(PATAGONIA_PROVINCES as readonly string[]).includes(row.jurisdiction))
        continue;
      if (row.value == null) continue;
      map[row.jurisdiction][row.year] = row.value;
    }
    return map;
  }, [data]);

  const max = useMemo(() => {
    let m = 1;
    for (const p of PATAGONIA_PROVINCES) {
      for (const y of years) {
        m = Math.max(m, byProv[p][y] ?? 0);
      }
    }
    return m;
  }, [byProv, years]);

  const x = d3
    .scalePoint()
    .domain(years.map(String))
    .range([0, width - margin.left - margin.right]);

  const y = d3
    .scaleLinear()
    .domain([0, max])
    .nice()
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
        aria-label="Slope chart de hectáreas por provincia"
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {years.map((year) => (
            <line
              key={year}
              x1={x(String(year))}
              x2={x(String(year))}
              y1={0}
              y2={height - margin.top - margin.bottom}
              stroke="currentColor"
              strokeOpacity={0.12}
            />
          ))}
          {PATAGONIA_PROVINCES.map((province) => {
            const pts = years.map((year) => ({
              year,
              value: byProv[province][year] ?? 0,
            }));
            const path = d3
              .line<{ year: number; value: number }>()
              .x((d) => x(String(d.year)) ?? 0)
              .y((d) => y(d.value))(pts);
            const color = PROVINCE_COLORS[province as PatagoniaProvince];
            const first = pts[0];
            const last = pts[pts.length - 1];
            return (
              <g key={province}>
                <path d={path ?? ""} fill="none" stroke={color} strokeWidth={2} />
                {pts.map((p) => (
                  <circle
                    key={p.year}
                    cx={x(String(p.year))}
                    cy={y(p.value)}
                    r={3.5}
                    fill={color}
                  />
                ))}
                <text
                  x={(x(String(first.year)) ?? 0) - 8}
                  y={y(first.value)}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="text-[9px]"
                  fill={color}
                >
                  {province}
                </text>
                <text
                  x={(x(String(last.year)) ?? 0) + 8}
                  y={y(last.value)}
                  textAnchor="start"
                  dominantBaseline="middle"
                  className="text-[9px]"
                  fill={color}
                >
                  {province}
                </text>
              </g>
            );
          })}
          {years.map((year) => (
            <text
              key={`lbl-${year}`}
              x={x(String(year))}
              y={height - margin.top - margin.bottom + 16}
              textAnchor="middle"
              className="fill-current text-[10px]"
              opacity={0.7}
            >
              {year}
            </text>
          ))}
        </g>
      </svg>
      <p className="mt-1 text-[11px] opacity-60">
        Hectáreas quemadas · años ancla {years.join(" / ")} · RII
      </p>
      <p className="sr-only">Comparación {COMPLETE_YEARS[0]}–{COMPLETE_YEARS.at(-1)}</p>
    </div>
  );
}
