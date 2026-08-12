"use client";

import { useMemo } from "react";
import * as d3 from "d3";
import { FIRE_SEASON_MONTHS } from "@/lib/patagonia";
import type { ProvinceYearValue } from "@/lib/parseRii";

type Props = {
  data: ProvinceYearValue[];
  years?: number[];
  title?: string;
};

export function FireSeasonHeatmap({
  data,
  years = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
  title,
}: Props) {
  const months = FIRE_SEASON_MONTHS;
  const width = 420;
  const height = 190;
  const margin = { top: 28, right: 12, bottom: 28, left: 72 };

  const matrix = useMemo(() => {
    const map = new Map<string, number>();
    for (const row of data) {
      if (!(months as readonly string[]).includes(row.jurisdiction)) continue;
      if (row.value == null) continue;
      map.set(`${row.jurisdiction}-${row.year}`, row.value);
    }
    return map;
  }, [data, months]);

  const max = useMemo(
    () => d3.max([...matrix.values()]) ?? 1,
    [matrix],
  );

  const color = d3
    .scaleSequential(d3.interpolateYlOrRd)
    .domain([0, max]);

  const x = d3
    .scaleBand()
    .domain(years.map(String))
    .range([0, width - margin.left - margin.right])
    .padding(0.08);

  const y = d3
    .scaleBand()
    .domain(months)
    .range([0, height - margin.top - margin.bottom])
    .padding(0.08);

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
        aria-label="Heatmap de incendios por mes de temporada"
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {months.map((month) =>
            years.map((year) => {
              const v = matrix.get(`${month}-${year}`) ?? 0;
              return (
                <rect
                  key={`${month}-${year}`}
                  x={x(String(year))}
                  y={y(month)}
                  width={x.bandwidth()}
                  height={y.bandwidth()}
                  fill={color(v)}
                  rx={2}
                >
                  <title>
                    {month} {year}: {v} incendios
                  </title>
                </rect>
              );
            }),
          )}
          {years.map((year) => (
            <text
              key={year}
              x={(x(String(year)) ?? 0) + x.bandwidth() / 2}
              y={height - margin.top - margin.bottom + 16}
              textAnchor="middle"
              className="fill-current text-[9px]"
              opacity={0.7}
            >
              {String(year).slice(2)}
            </text>
          ))}
          {months.map((month) => (
            <text
              key={month}
              x={-6}
              y={(y(month) ?? 0) + y.bandwidth() / 2}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-current text-[10px]"
              opacity={0.8}
            >
              {month.slice(0, 3)}
            </text>
          ))}
        </g>
      </svg>
      <p className="mt-1 text-[11px] opacity-60">
        Cantidad de incendios · temporada dic–mar · total país (RII)
      </p>
    </div>
  );
}
