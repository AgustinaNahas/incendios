"use client";

import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import * as d3 from "d3";
import { formatHa } from "@/lib/format";

export type BudgetExecPoint = {
  year: number;
  budgeted: number;
  executed: number | null;
};

type Props = {
  data: BudgetExecPoint[];
  active?: boolean;
  title?: string;
  source?: string;
};

const VIEW_W = 720;
const VIEW_H = 360;
const MARGIN = { top: 8, right: 8, bottom: 32, left: 40 };
const INNER_W = VIEW_W - MARGIN.left - MARGIN.right;
const INNER_H = VIEW_H - MARGIN.top - MARGIN.bottom;
const DURATION = 900;

const FILL = "var(--accent)";
const EMPTY_FILL = "var(--accent-soft)";
const EMPTY_STROKE = "var(--rule)";

const VALUE_NOTE =
  "Valores en miles de millones de pesos constantes a precios de 2026";

type BarDatum = BudgetExecPoint & {
  execH: number;
  emptyH: number;
  yExec: number;
  yEmpty: number;
};

function formatBudget(value: number | null) {
  if (value == null) return "En curso";
  return formatHa(value, 0);
}

function columnHit(x: d3.ScaleBand<number>, year: number) {
  const step = x.step();
  const band = x.bandwidth();
  const origin = x(year) ?? 0;
  return { x: origin - (step - band) / 2, width: step };
}

function BudgetTooltip({
  left,
  top,
  point,
}: {
  left: number;
  top: number;
  point: BudgetExecPoint;
}) {
  const pending =
    point.executed == null
      ? null
      : Math.max(0, point.budgeted - point.executed);
  const placeSide = top < 22 || left > 78 || left < 14;
  const alignEnd = left > 50;
  const transform = placeSide
    ? alignEnd
      ? "translate(calc(-100% - 12px), -50%)"
      : "translate(12px, -50%)"
    : "translate(-50%, calc(-100% - 10px))";
  const rows = [
    ["Ejecutado", point.executed],
    ["Sin ejecutar", pending],
    ["Total", point.budgeted],
  ] as const;

  return (
    <div
      id={`budget-tip-${point.year}`}
      role="tooltip"
      className="pointer-events-none absolute z-10 w-max max-w-[240px] border border-foreground/20 bg-tooltip px-3 py-2.5"
      style={{ left: `${left}%`, top: `${top}%`, transform }}
    >
      <p className="text-[11px] font-semibold tracking-[0.16em] text-accent uppercase">
        {point.year}
      </p>
      <dl className="mt-1.5 space-y-0.5 text-sm leading-snug text-foreground">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-4">
            <dt className="text-foreground/75">{label}</dt>
            <dd className="font-semibold tabular-nums">{formatBudget(value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function BudgetExecutionChart({
  data,
  active = true,
  title = "Ejecución presupuestaria del manejo del fuego",
  source = "Monitor Presupuestario de la Asociación Civil por la Igualdad y la Justicia (ACIJ) con base en Presupuesto Abierto",
}: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const wasActiveRef = useRef(false);
  const [hover, setHover] = useState<number | null>(null);

  const yMax = useMemo(() => {
    const peak = d3.max(data, (d) => d.budgeted) ?? 1;
    const step = peak <= 50 ? 10 : peak <= 100 ? 25 : 50;
    return Math.max(step, Math.ceil(peak / step) * step);
  }, [data]);

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
    () => d3.scaleLinear().domain([0, yMax]).range([INNER_H, 0]),
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
      const known = d.executed != null;
      const yBudgeted = y(d.budgeted);
      const yExecuted = known ? y(d.executed ?? 0) : INNER_H;
      return {
        ...d,
        execH: known ? Math.max(0, INNER_H - yExecuted) : 0,
        emptyH: Math.max(0, (known ? yExecuted : INNER_H) - yBudgeted),
        yExec: known ? yExecuted : INNER_H,
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

  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    d3.select(svg)
      .selectAll<SVGGElement, BarDatum>("g.plot g.bar")
      .attr("opacity", (d) => (hover == null || d.year === hover ? 1 : 0.35));
  }, [hover, data]);

  const yStep = yMax <= 50 ? 10 : yMax <= 100 ? 25 : 50;
  const yTicks = d3.range(0, yMax + yStep / 2, yStep);
  const hovered = data.find((d) => d.year === hover) ?? null;

  const onKeyDown = (event: KeyboardEvent<SVGSVGElement>) => {
    if (event.key === "Escape") {
      setHover(null);
      return;
    }
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    setHover((current) => {
      const index =
        current == null
          ? direction > 0
            ? -1
            : data.length
          : data.findIndex((d) => d.year === current);
      const next = Math.min(data.length - 1, Math.max(0, index + direction));
      return data[next]?.year ?? null;
    });
  };

  const onPointerLeave = (event: PointerEvent<SVGSVGElement>) => {
    if (event.pointerType === "touch") return;
    setHover(null);
  };

  return (
    <div className="w-full">
      <h3 className="font-sans text-lg font-bold text-foreground md:text-xl">
        {title}
      </h3>
      <p className="mt-1 text-base leading-snug text-foreground/90">
        {VALUE_NOTE}
      </p>
      <div className="mt-3 mb-4 flex flex-wrap items-center gap-5 text-sm text-foreground/85">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 bg-accent" />
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
      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="mx-auto h-auto max-h-[48vh] w-full font-sans outline-none"
          role="group"
          tabIndex={0}
          aria-label={`${title}. ${VALUE_NOTE}. Con las flechas se recorre cada año.`}
          onKeyDown={onKeyDown}
          onPointerLeave={onPointerLeave}
        >
          <g
            className="axes"
            transform={`translate(${MARGIN.left},${MARGIN.top})`}
          >
            <line
              x1={0}
              x2={0}
              y1={0}
              y2={INNER_H}
              stroke="var(--foreground)"
              strokeOpacity={0.35}
            />
            {yTicks.map((t) => (
              <text
                key={t}
                x={-8}
                y={y(t)}
                textAnchor="end"
                dominantBaseline="middle"
                fill="var(--foreground)"
                fillOpacity={0.65}
                fontSize={12}
              >
                {formatHa(t, 0)}
              </text>
            ))}
            {data.map((d) => (
              <text
                key={d.year}
                x={(x(d.year) ?? 0) + x.bandwidth() / 2}
                y={INNER_H + 20}
                textAnchor="middle"
                fill="var(--foreground)"
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
          <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
            {data.map((d) => {
              const hit = columnHit(x, d.year);
              const activeYear = hover === d.year;
              return (
                <rect
                  key={d.year}
                  x={hit.x}
                  y={0}
                  width={hit.width}
                  height={INNER_H}
                  fill={
                    activeYear
                      ? "color-mix(in srgb, var(--foreground) 6%, transparent)"
                      : "transparent"
                  }
                  className="cursor-pointer"
                  role="button"
                  tabIndex={-1}
                  aria-label={`${d.year}. Total ${formatBudget(d.budgeted)}, ejecutado ${formatBudget(d.executed)}`}
                  aria-describedby={
                    activeYear ? `budget-tip-${d.year}` : undefined
                  }
                  onPointerEnter={(event) => {
                    if (event.pointerType === "touch") return;
                    setHover(d.year);
                  }}
                  onClick={() => setHover(d.year)}
                />
              );
            })}
          </g>
        </svg>
        {hovered ? (
          <BudgetTooltip
            left={
              ((MARGIN.left + (x(hovered.year) ?? 0) + x.bandwidth() / 2) /
                VIEW_W) *
              100
            }
            top={((MARGIN.top + y(hovered.budgeted)) / VIEW_H) * 100}
            point={hovered}
          />
        ) : null}
      </div>
      <p className="mt-3 text-[20px] leading-snug text-foreground">
        Fuente: {source}
      </p>
    </div>
  );
}
