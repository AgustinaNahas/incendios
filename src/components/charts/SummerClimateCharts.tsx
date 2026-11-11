"use client";

import {
  useMemo,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import * as d3 from "d3";
import climate from "@/data/summer-climate.json";
import { formatHa } from "@/lib/format";

const INK = "var(--foreground)";
const BAR = "#FFDCAE";
const ACCENT = "var(--accent)";
const TREND = "var(--trend)";
const VIEW_W = 420;
const VIEW_H = 260;
const CHART_MARGIN = { top: 22, right: 8, bottom: 28, left: 32 };

type Summer = {
  year: number;
  hotDays: number;
  precipMm: number;
  windDays: number;
};

const SUMMERS = climate.summers as Summer[];
const YEARS = SUMMERS.map((d) => d.year);
const LAST_YEAR = YEARS[YEARS.length - 1] ?? 2026;
const WIND_REVIEW_FROM = 2023;

const PRECIP_MAX = d3.max(SUMMERS, (d) => d.precipMm) ?? 0;

function isWindReview(year: number) {
  return year >= WIND_REVIEW_FROM;
}

function daysLabel(value: number) {
  return `${value} ${value === 1 ? "día" : "días"}`;
}

function yearTicks(years: number[]) {
  const first = years[0];
  const last = years[years.length - 1];
  const picked = years.filter(
    (year) => year === first || year === last || year % 10 === 0,
  );
  return picked.filter((year, index) => {
    const next = picked[index + 1];
    if (next == null || year === first) return true;
    return next - year >= 6;
  });
}

function linearTrend(points: { year: number; value: number }[]) {
  const meanX = d3.mean(points, (d) => d.year) ?? 0;
  const meanY = d3.mean(points, (d) => d.value) ?? 0;
  let numerator = 0;
  let denominator = 0;
  for (const point of points) {
    const dx = point.year - meanX;
    numerator += dx * (point.value - meanY);
    denominator += dx * dx;
  }
  const slope = denominator === 0 ? 0 : numerator / denominator;
  const intercept = meanY - slope * meanX;
  return (year: number) => intercept + slope * year;
}

function useYearFocus() {
  const [year, setYear] = useState<number | null>(null);

  const onKeyDown = (event: KeyboardEvent<SVGSVGElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    setYear((current) => {
      const index =
        current == null
          ? direction > 0
            ? -1
            : YEARS.length
          : YEARS.indexOf(current);
      const next = Math.min(YEARS.length - 1, Math.max(0, index + direction));
      return YEARS[next] ?? null;
    });
  };

  const onPointerLeave = (event: PointerEvent<SVGSVGElement>) => {
    if (event.pointerType === "touch") return;
    setYear(null);
  };

  return { year, setYear, onKeyDown, onPointerLeave };
}

function hitHandlers(rowYear: number, setYear: (year: number) => void) {
  return {
    onPointerEnter: (event: PointerEvent<SVGRectElement>) => {
      if (event.pointerType === "touch") return;
      setYear(rowYear);
    },
    onClick: () => setYear(rowYear),
  };
}

function ChartTooltip({
  left,
  top,
  kicker,
  body,
}: {
  left: number;
  top: number;
  kicker: string;
  body: string;
}) {
  const placeSide = top < 20 || left > 76 || left < 16;
  const alignEnd = left > 50;
  const transform = placeSide
    ? alignEnd
      ? "translate(calc(-100% - 12px), -50%)"
      : "translate(12px, -50%)"
    : "translate(-50%, calc(-100% - 10px))";

  return (
    <div
      role="tooltip"
      className="ui-panel ui-panel--accent pointer-events-none absolute z-10 w-max max-w-[220px] px-3 py-2.5"
      style={{ left: `${left}%`, top: `${top}%`, transform }}
    >
      <p className="font-sans text-sm font-bold leading-none text-accent">
        {kicker}
      </p>
      <p className="mt-1.5 text-sm leading-snug text-foreground">{body}</p>
    </div>
  );
}

function markerPercent(viewW: number, viewH: number, xPx: number, yPx: number) {
  return {
    left: (xPx / viewW) * 100,
    top: (yPx / viewH) * 100,
  };
}

function LastBarValue({
  x,
  year,
  yTop,
  label,
  dim,
}: {
  x: d3.ScaleBand<number>;
  year: number;
  yTop: number;
  label: string;
  dim: boolean;
}) {
  return (
    <text
      x={(x(year) ?? 0) + x.bandwidth() / 2}
      y={yTop - 5}
      textAnchor="middle"
      fill={ACCENT}
      fontSize={11}
      fontWeight={700}
      opacity={dim ? 0.3 : 1}
      pointerEvents="none"
    >
      {label}
    </text>
  );
}

function columnX(
  x: d3.ScaleBand<number>,
  year: number,
): { x: number; width: number } {
  const step = x.step();
  const band = x.bandwidth();
  const origin = x(year) ?? 0;
  return { x: origin - (step - band) / 2, width: step };
}

function CompactAxes({
  margin,
  innerW,
  innerH,
  x,
  yTicks,
  y,
}: {
  margin: { top: number; right: number; bottom: number; left: number };
  innerW: number;
  innerH: number;
  x: d3.ScaleBand<number>;
  yTicks: number[];
  y: (value: number) => number;
}) {
  return (
    <g className="axes" transform={`translate(${margin.left},${margin.top})`}>
      <line
        x1={0}
        x2={0}
        y1={0}
        y2={innerH}
        stroke={INK}
        strokeOpacity={0.3}
      />
      <line
        x1={0}
        x2={innerW}
        y1={innerH}
        y2={innerH}
        stroke={INK}
        strokeOpacity={0.3}
      />
      {yTicks.map((tick) => (
        <text
          key={tick}
          x={-6}
          y={y(tick)}
          textAnchor="end"
          dominantBaseline="middle"
          fill={INK}
          fillOpacity={0.6}
          fontSize={10}
        >
          {tick}
        </text>
      ))}
      {yearTicks(YEARS).map((year) => (
        <text
          key={year}
          x={(x(year) ?? 0) + x.bandwidth() / 2}
          y={innerH + 16}
          textAnchor="middle"
          fill={INK}
          fillOpacity={0.7}
          fontSize={10}
        >
          {year}
        </text>
      ))}
    </g>
  );
}

function ChartShell({
  title,
  dek,
  divider = false,
  children,
}: {
  title: string;
  dek: string;
  divider?: boolean;
  children: ReactNode;
}) {
  return (
    <figure className="relative min-w-0 md:row-span-3 md:grid md:grid-rows-subgrid">
      <h3 className="font-sans text-base font-bold text-foreground md:text-lg">
        {title}
      </h3>
      <p className="mt-0 text-[13px] leading-snug text-foreground/80">{dek}</p>
      {children}
      {divider ? (
        <span
          aria-hidden
          className="pointer-events-none absolute top-0 -right-5 hidden h-full w-px bg-foreground/20 md:block"
        />
      ) : null}
    </figure>
  );
}

function HotDaysChart() {
  const focus = useYearFocus();
  const margin = CHART_MARGIN;
  const innerW = VIEW_W - margin.left - margin.right;
  const innerH = VIEW_H - margin.top - margin.bottom;

  const x = useMemo(
    () =>
      d3.scaleBand<number>().domain(YEARS).range([0, innerW]).padding(0.18),
    [innerW],
  );
  const y = useMemo(
    () => d3.scaleLinear().domain([0, 12]).nice().range([innerH, 0]),
    [innerH],
  );
  const trendAt = useMemo(
    () => linearTrend(SUMMERS.map((d) => ({ year: d.year, value: d.hotDays }))),
    [],
  );
  const trendPath = useMemo(() => {
    const line = d3
      .line<Summer>()
      .x((d) => (x(d.year) ?? 0) + x.bandwidth() / 2)
      .y((d) => y(Math.max(0, trendAt(d.year))));
    return line(SUMMERS) ?? "";
  }, [trendAt, x, y]);

  const active = SUMMERS.find((d) => d.year === focus.year) ?? null;
  const yTicks = [0, 4, 8, 12];

  return (
    <ChartShell
      title="Temperatura"
      dek="Cantidad de días con más de 30 °C."
      divider
    >
      <div className="relative mt-3">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="h-auto w-full font-sans outline-none"
          role="group"
          tabIndex={0}
          aria-label="Días con más de 30 grados por verano, de 1991 a 2026. Barras enteras por año. La línea punteada marca una tendencia ascendente. Con las flechas se recorre cada año."
          onKeyDown={focus.onKeyDown}
          onPointerLeave={focus.onPointerLeave}
        >
          <CompactAxes
            margin={margin}
            innerW={innerW}
            innerH={innerH}
            x={x}
            yTicks={yTicks}
            y={y}
          />
          <g
            className="plot"
            transform={`translate(${margin.left},${margin.top})`}
          >
            {SUMMERS.map((row) => {
              const hovered = focus.year === row.year;
              const dim = focus.year != null && !hovered;
              const barH = Math.max(0, innerH - y(row.hotDays));
              const highlight = row.year === LAST_YEAR;
              return (
                <rect
                  key={row.year}
                  x={x(row.year)}
                  y={y(row.hotDays)}
                  width={x.bandwidth()}
                  height={barH}
                  fill={highlight ? ACCENT : BAR}
                  opacity={dim ? 0.3 : highlight ? 0.95 : 0.88}
                  pointerEvents="none"
                />
              );
            })}
            <path
              d={trendPath}
              fill="none"
              stroke={TREND}
              strokeWidth={1.5}
              strokeDasharray="4 3"
              pointerEvents="none"
            />
            <LastBarValue
              x={x}
              year={LAST_YEAR}
              yTop={y(SUMMERS.at(-1)?.hotDays ?? 0)}
              label={String(SUMMERS.at(-1)?.hotDays ?? "")}
              dim={focus.year != null && focus.year !== LAST_YEAR}
            />
            {SUMMERS.map((row) => {
              const hit = columnX(x, row.year);
              return (
                <rect
                  key={`hit-${row.year}`}
                  x={hit.x}
                  y={0}
                  width={hit.width}
                  height={innerH}
                  fill="transparent"
                  className="cursor-pointer"
                  {...hitHandlers(row.year, focus.setYear)}
                />
              );
            })}
          </g>
        </svg>
        {active ? (
          <ChartTooltip
            {...markerPercent(
              VIEW_W,
              VIEW_H,
              margin.left + (x(active.year) ?? 0) + x.bandwidth() / 2,
              margin.top + y(active.hotDays),
            )}
            kicker={`Año ${active.year}`}
            body={
              active.hotDays === 0
                ? "Ningún día con temperaturas extremas"
                : `${daysLabel(active.hotDays)} con temperaturas extremas`
            }
          />
        ) : null}
      </div>
    </ChartShell>
  );
}

function SummerRainChart() {
  const focus = useYearFocus();
  const margin = CHART_MARGIN;
  const innerW = VIEW_W - margin.left - margin.right;
  const innerH = VIEW_H - margin.top - margin.bottom;
  const yMax = Math.max(200, Math.ceil(PRECIP_MAX / 50) * 50);
  const yTicks = d3.range(0, yMax + 1, 50);

  const x = useMemo(
    () =>
      d3.scaleBand<number>().domain(YEARS).range([0, innerW]).padding(0.18),
    [innerW],
  );
  const y = useMemo(
    () => d3.scaleLinear().domain([0, yMax]).range([innerH, 0]),
    [innerH, yMax],
  );

  const active = SUMMERS.find((d) => d.year === focus.year) ?? null;

  return (
    <ChartShell
      title="Precipitaciones"
      dek="Milímetros acumulados en los meses de verano."
      divider
    >
      <div className="relative mt-3">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="h-auto w-full font-sans outline-none"
          role="group"
          tabIndex={0}
          aria-label="Lluvia acumulada por verano, de 1991 a 2026. Barras enteras en milímetros. Con las flechas se recorre cada año."
          onKeyDown={focus.onKeyDown}
          onPointerLeave={focus.onPointerLeave}
        >
          <CompactAxes
            margin={margin}
            innerW={innerW}
            innerH={innerH}
            x={x}
            yTicks={yTicks}
            y={y}
          />
          <g
            className="plot"
            transform={`translate(${margin.left},${margin.top})`}
          >
            <text
              x={innerW}
              y={-6}
              textAnchor="end"
              fill={ACCENT}
              fontSize={10}
              fontWeight={700}
              pointerEvents="none"
            >
              tendencia decreciente
            </text>
            {SUMMERS.map((row) => {
              const hovered = focus.year === row.year;
              const dim = focus.year != null && !hovered;
              const barH = Math.max(0, innerH - y(row.precipMm));
              const highlight = row.year === LAST_YEAR;
              return (
                <rect
                  key={row.year}
                  x={x(row.year)}
                  y={y(row.precipMm)}
                  width={x.bandwidth()}
                  height={barH}
                  fill={highlight ? ACCENT : BAR}
                  opacity={dim ? 0.3 : highlight ? 0.95 : 0.88}
                  pointerEvents="none"
                />
              );
            })}
            <LastBarValue
              x={x}
              year={LAST_YEAR}
              yTop={y(SUMMERS.at(-1)?.precipMm ?? 0)}
              label={formatHa(SUMMERS.at(-1)?.precipMm ?? 0, 1)}
              dim={focus.year != null && focus.year !== LAST_YEAR}
            />
            {SUMMERS.map((row) => {
              const hit = columnX(x, row.year);
              return (
                <rect
                  key={`hit-${row.year}`}
                  x={hit.x}
                  y={0}
                  width={hit.width}
                  height={innerH}
                  fill="transparent"
                  className="cursor-pointer"
                  {...hitHandlers(row.year, focus.setYear)}
                />
              );
            })}
          </g>
        </svg>
        {active ? (
          <ChartTooltip
            {...markerPercent(
              VIEW_W,
              VIEW_H,
              margin.left + (x(active.year) ?? 0) + x.bandwidth() / 2,
              margin.top + y(active.precipMm),
            )}
            kicker={`Año ${active.year}`}
            body={`${formatHa(active.precipMm, 1)} mm de precipitación acumulada`}
          />
        ) : null}
      </div>
    </ChartShell>
  );
}

function WindDaysChart() {
  const focus = useYearFocus();
  const margin = CHART_MARGIN;
  const innerW = VIEW_W - margin.left - margin.right;
  const innerH = VIEW_H - margin.top - margin.bottom;

  const x = useMemo(
    () =>
      d3.scaleBand<number>().domain(YEARS).range([0, innerW]).padding(0.18),
    [innerW],
  );
  const y = useMemo(
    () => d3.scaleLinear().domain([0, 100]).range([innerH, 0]),
    [innerH],
  );

  const reviewStart = x(WIND_REVIEW_FROM) ?? innerW;
  const active = SUMMERS.find((d) => d.year === focus.year) ?? null;

  return (
    <ChartShell
      title="Ráfagas de viento"
      dek="Cantidad de días con registros superiores a 30 km/h."
    >
      <div className="relative mt-3">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="h-auto w-full font-sans outline-none"
          role="group"
          tabIndex={0}
          aria-label="Días con ráfagas de viento mayores a 30 kilómetros por hora, por verano. De 2023 a 2026 los valores están en revisión. Con las flechas se recorre cada año."
          onKeyDown={focus.onKeyDown}
          onPointerLeave={focus.onPointerLeave}
        >
          <CompactAxes
            margin={margin}
            innerW={innerW}
            innerH={innerH}
            x={x}
            yTicks={[0, 25, 50, 75, 100]}
            y={y}
          />
          <g
            className="plot"
            transform={`translate(${margin.left},${margin.top})`}
          >
            <rect
              x={reviewStart}
              y={0}
              width={Math.max(0, innerW - reviewStart)}
              height={innerH}
              fill={ACCENT}
              opacity={0.1}
              pointerEvents="none"
            />
            <text
              x={reviewStart + (innerW - reviewStart) / 2}
              y={-6}
              textAnchor="middle"
              fill={ACCENT}
              fontSize={10}
              fontWeight={700}
              pointerEvents="none"
            >
              *En revisión
            </text>
            {SUMMERS.map((row) => {
              const hovered = focus.year === row.year;
              const dim = focus.year != null && !hovered;
              const barH = Math.max(0, innerH - y(row.windDays));
              const review = isWindReview(row.year);
              return (
                <rect
                  key={row.year}
                  x={x(row.year)}
                  y={y(row.windDays)}
                  width={x.bandwidth()}
                  height={barH}
                  fill={review ? ACCENT : BAR}
                  opacity={dim ? 0.3 : review ? 0.95 : 0.88}
                  pointerEvents="none"
                />
              );
            })}
            {SUMMERS.map((row) => {
              const hit = columnX(x, row.year);
              return (
                <rect
                  key={`hit-${row.year}`}
                  x={hit.x}
                  y={0}
                  width={hit.width}
                  height={innerH}
                  fill="transparent"
                  className="cursor-pointer"
                  {...hitHandlers(row.year, focus.setYear)}
                />
              );
            })}
          </g>
        </svg>
        {active ? (
          <ChartTooltip
            {...markerPercent(
              VIEW_W,
              VIEW_H,
              margin.left + (x(active.year) ?? 0) + x.bandwidth() / 2,
              margin.top + y(active.windDays),
            )}
            kicker={`Año ${active.year}`}
            body={`${daysLabel(active.windDays)} con ráfagas de viento de más de 30 km/h`}
          />
        ) : null}
      </div>
    </ChartShell>
  );
}

export function SummerClimateCharts() {
  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-x-10 md:gap-y-0">
        <HotDaysChart />
        <SummerRainChart />
        <WindDaysChart />
      </div>
      <p className="mt-[10px] text-[11px] leading-[1.3] text-foreground/65 @min-[1050px]:whitespace-nowrap mb-12">
        Fuente: {climate.source} *El gráfico muestra una baja aparente de los
        vientos registrados, que no necesariamente implica una caída real ya que
        puede deberse a cambios de instrumental.
      </p>
    </div>
  );
}
