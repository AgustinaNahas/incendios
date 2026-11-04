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
        <h3 className="mb-2 font-sans text-lg font-bold text-foreground md:text-xl">
          {title}
        </h3>
      ) : null}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full font-sans"
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
                fill="var(--heat)"
                fillOpacity={0.85}
              />
              <text
                x={x(d.fires)}
                y={y(d.hectares) - 10}
                textAnchor="middle"
                fill="currentColor"
                fillOpacity={0.85}
                fontSize={12}
              >
                {d.year}
              </text>
            </g>
          ))}
          <text
            x={(width - margin.left - margin.right) / 2}
            y={height - margin.top - margin.bottom + 28}
            textAnchor="middle"
            fill="currentColor"
            fillOpacity={0.75}
            fontSize={13}
          >
            Cantidad de incendios
          </text>
          <text
            transform={`translate(-34,${(height - margin.top - margin.bottom) / 2}) rotate(-90)`}
            textAnchor="middle"
            fill="currentColor"
            fillOpacity={0.75}
            fontSize={13}
          >
            Hectáreas ({formatCompact(d3.max(data, (d) => d.hectares) ?? 0)} máx)
          </text>
        </g>
      </svg>
      <p className="mt-3 text-xs leading-relaxed text-foreground/65 md:text-sm">
        Años con pocos focos pueden concentrar mucha superficie.
      </p>
    </div>
  );
}
