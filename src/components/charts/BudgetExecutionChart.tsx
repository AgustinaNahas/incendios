"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import { formatCompact } from "@/lib/format";

export type BudgetExecPoint = {
  year: number;
  budgeted: number;
  executed: number;
};

type Props = {
  data: BudgetExecPoint[];
  active?: boolean;
  title?: string;
};

const VIEW_W = 720;
const VIEW_H = 400;
const MARGIN = { top: 28, right: 16, bottom: 64, left: 64 };
const INNER_W = VIEW_W - MARGIN.left - MARGIN.right;
const INNER_H = VIEW_H - MARGIN.top - MARGIN.bottom;
const DURATION = 900;

const FILL = "#52884A";
const EMPTY_FILL = "#4F864626";
const EMPTY_STROKE = "#FFFFFF60";

type BarDatum = BudgetExecPoint & {
  execH: number;
  emptyH: number;
  yExec: number;
  yEmpty: number;
};

export function BudgetExecutionChart({
  data,
  active = true,
  title = "Ejecución presupuestaria del manejo del fuego",
}: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const wasActiveRef = useRef(false);

  const yMax = useMemo(
    () => Math.max(1, d3.max(data, (d) => d.budgeted) ?? 1),
    [data],
  );

  const x = useMemo(
    () =>
      d3
        .scaleBand<number>()
        .domain(data.map((d) => d.year))
        .range([0, INNER_W])
        .padding(0.32),
    [data],
  );

  const y = useMemo(
    () => d3.scaleLinear().domain([0, yMax]).nice().range([INNER_H, 0]),
    [yMax],
  );

  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animate = active && !reduce;
    const activating = animate && !wasActiveRef.current;
    wasActiveRef.current = active && !reduce;
    const root = d3.select(svg).select("g.plot");
    const band = Math.max(1, x.bandwidth());

    const bars: BarDatum[] = data.map((d) => {
      const yBudgeted = y(d.budgeted);
      const yExecuted = y(d.executed);
      return {
        ...d,
        execH: Math.max(0, INNER_H - yExecuted),
        emptyH: Math.max(0, yExecuted - yBudgeted),
        yExec: yExecuted,
        yEmpty: yBudgeted,
      };
    });

    const groups = root
      .selectAll<SVGGElement, BarDatum>("g.bar")
      .data(bars, (d) => String(d.year));

    groups
      .exit()
      .transition()
      .duration(animate ? 400 : 0)
      .attr("opacity", 0)
      .remove();

    const enter = groups
      .enter()
      .append("g")
      .attr("class", "bar")
      .attr("opacity", 1)
      .attr("transform", (d) => `translate(${x(d.year) ?? 0},0)`);

    enter
      .append("rect")
      .attr("class", "exec")
      .attr("x", 0)
      .attr("fill", FILL)
      .attr("width", band)
      .attr("y", INNER_H)
      .attr("height", 0);

    enter
      .append("rect")
      .attr("class", "empty")
      .attr("x", 0)
      .attr("fill", EMPTY_FILL)
      .attr("stroke", EMPTY_STROKE)
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "4 3")
      .attr("width", band)
      .attr("y", INNER_H)
      .attr("height", 0);

    const merged = enter.merge(groups);
    const enterNodes = new Set(enter.nodes());

    merged.interrupt();
    merged
      .transition()
      .duration(animate ? DURATION : 0)
      .ease(d3.easeCubicOut)
      .attr("transform", (d) => `translate(${x(d.year) ?? 0},0)`);

    merged.select("rect.exec").interrupt();
    merged.select("rect.empty").interrupt();

    merged
      .select<SVGRectElement>("rect.exec")
      .attr("width", band)
      .attr("fill", FILL);

    merged
      .select<SVGRectElement>("rect.empty")
      .attr("width", band)
      .attr("fill", EMPTY_FILL)
      .attr("stroke", EMPTY_STROKE)
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "4 3");

    if (!animate) {
      const show = active || reduce;
      merged
        .select<SVGRectElement>("rect.exec")
        .attr("y", (d) => (show ? d.yExec : INNER_H))
        .attr("height", (d) => (show ? d.execH : 0));
      merged
        .select<SVGRectElement>("rect.empty")
        .attr("y", (d) => (show ? d.yEmpty : INNER_H))
        .attr("height", (d) => (show ? d.emptyH : 0));
      return;
    }

    merged.each(function (d) {
      const exec = d3.select(this).select<SVGRectElement>("rect.exec");
      const fromZero = activating || enterNodes.has(this);
      if (fromZero) exec.attr("y", INNER_H).attr("height", 0);
      exec
        .transition()
        .duration(DURATION)
        .ease(d3.easeCubicOut)
        .attr("y", d.yExec)
        .attr("height", d.execH);
    });

    merged.each(function (d) {
      const empty = d3.select(this).select<SVGRectElement>("rect.empty");
      const fromZero = activating || enterNodes.has(this);

      if (fromZero) {
        empty.attr("y", d.yExec).attr("height", 0);
        empty
          .transition()
          .delay(DURATION)
          .duration(DURATION)
          .ease(d3.easeCubicOut)
          .attr("y", d.yEmpty)
          .attr("height", d.emptyH);
      } else {
        empty
          .transition()
          .duration(DURATION)
          .ease(d3.easeCubicOut)
          .attr("y", d.yEmpty)
          .attr("height", d.emptyH);
      }
    });
  }, [data, active, x, y]);

  const yTicks = y.ticks(4);

  return (
    <div className="w-full">
      <h3 className="font-sans text-lg font-bold text-[#f3efe8] md:text-xl">
        {title}
      </h3>
      <div className="mt-3 mb-4 flex flex-wrap items-center gap-5 text-sm text-[#f3efe8]/85">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3" style={{ background: FILL }} />
          Ejecutado
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            className="inline-block h-3 w-3"
            style={{
              background: EMPTY_FILL,
              border: `1.5px dashed ${EMPTY_STROKE}`,
            }}
          />
          Sin ejecutar
        </span>
      </div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`${title}. Eje X: año. Eje Y: millones de pesos a precios de 2026.`}
      >
        <text
          x={MARGIN.left + INNER_W / 2}
          y={VIEW_H - 10}
          textAnchor="middle"
          fill="#f3efe8"
          fillOpacity={0.75}
          fontSize={13}
        >
          Año
        </text>
        <text
          transform={`translate(16, ${MARGIN.top + INNER_H / 2}) rotate(-90)`}
          textAnchor="middle"
          fill="#f3efe8"
          fillOpacity={0.75}
          fontSize={13}
        >
          Millones de pesos (precios 2026)
        </text>
        <g
          className="axes"
          transform={`translate(${MARGIN.left},${MARGIN.top})`}
        >
          <line
            x1={0}
            x2={0}
            y1={0}
            y2={INNER_H}
            stroke="#f3efe8"
            strokeOpacity={0.35}
          />
          <line
            x1={0}
            x2={INNER_W}
            y1={INNER_H}
            y2={INNER_H}
            stroke="#f3efe8"
            strokeOpacity={0.35}
          />
          {yTicks.map((t) => (
            <g key={t}>
              <line
                x1={0}
                x2={INNER_W}
                y1={y(t)}
                y2={y(t)}
                stroke="#f3efe8"
                strokeOpacity={0.08}
              />
              <text
                x={-8}
                y={y(t)}
                textAnchor="end"
                dominantBaseline="middle"
                fill="#f3efe8"
                fillOpacity={0.65}
                fontSize={12}
              >
                {t === 0 ? "0" : formatCompact(t)}
              </text>
            </g>
          ))}
          {data.map((d) => (
            <text
              key={d.year}
              x={(x(d.year) ?? 0) + x.bandwidth() / 2}
              y={INNER_H + 22}
              textAnchor="middle"
              fill="#f3efe8"
              fillOpacity={0.75}
              fontSize={13}
            >
              {d.year}
            </text>
          ))}
        </g>
        <g
          className="plot"
          transform={`translate(${MARGIN.left},${MARGIN.top})`}
        />
      </svg>
      <p className="mt-2 text-[11px] text-[#f3efe8]/55">
        Valores en millones de pesos constantes a precios de 2026.
      </p>
    </div>
  );
}
