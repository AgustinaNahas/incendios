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
        <h3 className="mb-2 font-sans text-lg font-bold text-foreground md:text-xl">
          {title}
        </h3>
      ) : null}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full font-sans"
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
                fill="currentColor"
                fillOpacity={0.65}
                fontSize={12}
              >
                {formatCompact(t)}
              </text>
            </g>
          ))}
          <path
            d={lineHa(data) ?? ""}
            fill="none"
            stroke="var(--heat)"
            strokeWidth={2.5}
          />
          <path
            d={lineBudget(data) ?? ""}
            fill="none"
            stroke="var(--trend)"
            strokeWidth={2.5}
            strokeDasharray="5 4"
          />
          {data.map((d) => (
            <g key={d.year}>
              <circle cx={x(d.year)} cy={yHa(d.hectares)} r={3} fill="var(--heat)" />
              <circle
                cx={x(d.year)}
                cy={yBudget(d.budgetReal)}
                r={3}
                fill="var(--trend)"
              />
            </g>
          ))}
          {ticks.map((year) => (
            <text
              key={year}
              x={x(year)}
              y={height - margin.top - margin.bottom + 18}
              textAnchor="middle"
              fill="currentColor"
              fillOpacity={0.75}
              fontSize={12}
            >
              {year}
            </text>
          ))}
        </g>
      </svg>
      <div className="mt-3 mb-1 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-foreground/85">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-0.5 w-4 bg-heat" /> Ha Patagonia
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-0.5 w-4 border-t-2 border-dashed border-trend" />{" "}
          Presupuesto real (placeholder)
        </span>
      </div>
      {annotation ? (
        <p className="mt-3 text-xs leading-relaxed text-foreground/65 md:text-sm">
          {annotation}
        </p>
      ) : null}
    </div>
  );
}
