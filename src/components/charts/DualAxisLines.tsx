"use client";

import { useMemo } from "react";
import * as d3 from "d3";
import { formatCompact } from "@/lib/format";

type Point = { year: number; hectares: number; budgetReal: number };

type Props = {
  data: Point[];
  title?: string;
  annotation?: string;
};

export function DualAxisLines({ data, title, annotation }: Props) {
  const width = 440;
  const height = 240;
  const margin = { top: 28, right: 48, bottom: 32, left: 48 };

  const x = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => d.year) as [number, number])
        .range([0, width - margin.left - margin.right]),
    [data, margin.left, margin.right, width],
  );

  const yHa = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.hectares) ?? 1])
        .nice()
        .range([height - margin.top - margin.bottom, 0]),
    [data, height, margin.bottom, margin.top],
  );

  const yBudget = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.budgetReal) ?? 1])
        .nice()
        .range([height - margin.top - margin.bottom, 0]),
    [data, height, margin.bottom, margin.top],
  );

  const lineHa = d3
    .line<Point>()
    .x((d) => x(d.year))
    .y((d) => yHa(d.hectares))
    .curve(d3.curveMonotoneX);

  const lineBudget = d3
    .line<Point>()
    .x((d) => x(d.year))
    .y((d) => yBudget(d.budgetReal))
    .curve(d3.curveMonotoneX);

  const ticks = data.map((d) => d.year);

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
        aria-label="Presupuesto real vs hectáreas quemadas"
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {yHa.ticks(4).map((t) => (
            <g key={`ha-${t}`}>
              <line
                x1={0}
                x2={width - margin.left - margin.right}
                y1={yHa(t)}
                y2={yHa(t)}
                stroke="currentColor"
                strokeOpacity={0.12}
              />
              <text
                x={-6}
                y={yHa(t)}
                textAnchor="end"
                dominantBaseline="middle"
                className="fill-current text-[9px]"
                opacity={0.55}
              >
                {formatCompact(t)}
              </text>
            </g>
          ))}
          <path
            d={lineHa(data) ?? ""}
            fill="none"
            stroke="#ff6b2d"
            strokeWidth={2.5}
          />
          <path
            d={lineBudget(data) ?? ""}
            fill="none"
            stroke="#f0c674"
            strokeWidth={2.5}
            strokeDasharray="5 4"
          />
          {data.map((d) => (
            <g key={d.year}>
              <circle cx={x(d.year)} cy={yHa(d.hectares)} r={3} fill="#ff6b2d" />
              <circle
                cx={x(d.year)}
                cy={yBudget(d.budgetReal)}
                r={3}
                fill="#f0c674"
              />
            </g>
          ))}
          {ticks.map((year) => (
            <text
              key={year}
              x={x(year)}
              y={height - margin.top - margin.bottom + 18}
              textAnchor="middle"
              className="fill-current text-[9px]"
              opacity={0.7}
            >
              {year}
            </text>
          ))}
        </g>
      </svg>
      <div className="mt-2 flex flex-wrap gap-3 text-[11px] opacity-80">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 bg-[#ff6b2d]" /> Ha Patagonia
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 border-t-2 border-dashed border-[#f0c674]" />{" "}
          Presupuesto real (placeholder)
        </span>
      </div>
      {annotation ? (
        <p className="mt-2 text-[11px] leading-snug opacity-65">{annotation}</p>
      ) : null}
    </div>
  );
}
