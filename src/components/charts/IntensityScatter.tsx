"use client";

import { useMemo } from "react";
import * as d3 from "d3";
import { formatCompact } from "@/lib/format";

type Point = { year: number; fires: number; hectares: number };

type Props = {
  data: Point[];
  title?: string;
};

export function IntensityScatter({ data, title }: Props) {
  const width = 420;
  const height = 240;
  const margin = { top: 28, right: 16, bottom: 36, left: 48 };

  const x = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.fires) ?? 1])
        .nice()
        .range([0, width - margin.left - margin.right]),
    [data, margin.left, margin.right, width],
  );

  const y = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.hectares) ?? 1])
        .nice()
        .range([height - margin.top - margin.bottom, 0]),
    [data, height, margin.bottom, margin.top],
  );

  const line = d3
    .line<Point>()
    .x((d) => x(d.fires))
    .y((d) => y(d.hectares))
    .curve(d3.curveLinear);

  const sorted = [...data].sort((a, b) => a.year - b.year);

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
        aria-label="Incendios vs hectáreas en Patagonia"
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          <path
            d={line(sorted) ?? ""}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.25}
            strokeWidth={1}
          />
          {sorted.map((d) => (
            <g key={d.year}>
              <circle
                cx={x(d.fires)}
                cy={y(d.hectares)}
                r={7}
                fill="#ff6b2d"
                fillOpacity={0.85}
              />
              <text
                x={x(d.fires)}
                y={y(d.hectares) - 10}
                textAnchor="middle"
                className="fill-current text-[9px]"
                opacity={0.85}
              >
                {d.year}
              </text>
            </g>
          ))}
          <text
            x={(width - margin.left - margin.right) / 2}
            y={height - margin.top - margin.bottom + 28}
            textAnchor="middle"
            className="fill-current text-[10px]"
            opacity={0.65}
          >
            Cantidad de incendios
          </text>
          <text
            transform={`translate(-34,${(height - margin.top - margin.bottom) / 2}) rotate(-90)`}
            textAnchor="middle"
            className="fill-current text-[10px]"
            opacity={0.65}
          >
            Hectáreas ({formatCompact(d3.max(data, (d) => d.hectares) ?? 0)} máx)
          </text>
        </g>
      </svg>
      <p className="mt-1 text-[11px] opacity-60">
        Años con pocos focos pueden concentrar mucha superficie.
      </p>
    </div>
  );
}
