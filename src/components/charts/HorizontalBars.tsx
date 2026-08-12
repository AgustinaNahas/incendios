"use client";

import { useMemo } from "react";
import * as d3 from "d3";
import { formatCompact, formatHa } from "@/lib/format";
import { PROVINCE_COLORS, type PatagoniaProvince } from "@/lib/patagonia";

type Props = {
  data: { province: PatagoniaProvince; value: number }[];
  title?: string;
};

export function HorizontalBars({ data, title }: Props) {
  const width = 420;
  const height = Math.max(180, data.length * 36 + 40);
  const margin = { top: 28, right: 56, bottom: 12, left: 100 };

  const x = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.value) ?? 1])
        .range([0, width - margin.left - margin.right])
        .nice(),
    [data, margin.left, margin.right, width],
  );

  const y = useMemo(
    () =>
      d3
        .scaleBand()
        .domain(data.map((d) => d.province))
        .range([0, height - margin.top - margin.bottom])
        .padding(0.28),
    [data, height, margin.bottom, margin.top],
  );

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
        aria-label={title ?? "Barras de hectáreas por provincia"}
      >
        {data.map((d) => {
          const barW = x(d.value);
          const barY = y(d.province) ?? 0;
          return (
            <g key={d.province} transform={`translate(${margin.left},${margin.top})`}>
              <text
                x={-8}
                y={barY + (y.bandwidth() ?? 0) / 2}
                textAnchor="end"
                dominantBaseline="middle"
                className="fill-current text-[11px]"
                opacity={0.85}
              >
                {d.province}
              </text>
              <rect
                x={0}
                y={barY}
                width={Math.max(0, barW)}
                height={y.bandwidth()}
                fill={PROVINCE_COLORS[d.province]}
                opacity={0.9}
              />
              <text
                x={barW + 6}
                y={barY + (y.bandwidth() ?? 0) / 2}
                dominantBaseline="middle"
                className="fill-current text-[10px]"
                opacity={0.8}
              >
                {formatCompact(d.value)}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="mt-1 text-[11px] opacity-60">
        Hectáreas acumuladas 2017–2025 · Fuente: RII
      </p>
      <p className="sr-only">
        {data.map((d) => `${d.province}: ${formatHa(d.value)} ha`).join(". ")}
      </p>
    </div>
  );
}
