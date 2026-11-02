"use client";

import {
  useId,
  useMemo,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import * as d3 from "d3";
import climate from "@/data/summer-climate.json";
import { formatHa } from "@/lib/format";

const INK = "#f3efe8";
const ACCENT = "#f1621a";
const TREND = "#f0c674";
const VIEW_W = 720;

type Summer = {
  year: number;
  hotDays: number;
  precipMm: number;
  windDays: number;
};

const SUMMERS = climate.summers as Summer[];
const YEARS = SUMMERS.map((d) => d.year);
const FIRST_YEAR = YEARS[0] ?? 1991;
const LAST_YEAR = YEARS[YEARS.length - 1] ?? 2026;
const RECENT_FROM = 2021;
const WIND_REVIEW_FROM = 2023;

const EARLY_RAIN_AVG =
  d3.mean(
    SUMMERS.filter((d) => d.year <= 2010),
    (d) => d.precipMm,
  ) ?? 0;

const RECENT_SUMMERS = SUMMERS.filter((d) => d.year >= RECENT_FROM);
const RECENT_DRY = RECENT_SUMMERS.filter((d) => d.precipMm < EARLY_RAIN_AVG);

const HOT_MAX = d3.max(SUMMERS, (d) => d.hotDays) ?? 0;
const HOT_PEAK = SUMMERS.find((d) => d.hotDays === HOT_MAX) ?? SUMMERS[0];

const PRECIP_UNIT = 10;
const PRECIP_SLOT = 14;
const PRECIP_MAX = d3.max(SUMMERS, (d) => d.precipMm) ?? PRECIP_UNIT;

const DROP =
  "M5 0.4C5 0.4 0.7 5.2 0.7 8.2C0.7 11.3 2.6 12.8 5 12.8C7.4 12.8 9.3 11.3 9.3 8.2C9.3 5.2 5 0.4 5 0.4Z";

function isRecentDry(row: Summer) {
  return row.year >= RECENT_FROM && row.precipMm < EARLY_RAIN_AVG;
}

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
    (year) => year === first || year === last || year % 5 === 0,
  );
  return picked.filter((year, index) => {
    const next = picked[index + 1];
    if (next == null || year === first) return true;
    return next - year >= 4;
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

function hitHandlers(
  rowYear: number,
  setYear: (year: number) => void,
) {
  return {
    onPointerEnter: (event: PointerEvent<SVGRectElement>) => {
      if (event.pointerType === "touch") return;
      setYear(rowYear);
    },
    onClick: () => setYear(rowYear),
  };
}

function ChartTitle({ title, dek }: { title: string; dek: string }) {
  return (
    <>
      <h3 className="font-sans text-lg font-bold text-[#f3efe8] md:text-xl">
        {title}
      </h3>
      <p className="mt-2 text-base leading-relaxed text-[#f3efe8]/85 md:text-lg">
        {dek}
      </p>
    </>
  );
}

function Legend({
  items,
}: {
  items: { swatch: ReactNode; label: string }[];
}) {
  return (
    <div className="mt-3 mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#f3efe8]/85">
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-2">
          {item.swatch}
          {item.label}
        </span>
      ))}
    </div>
  );
}

function Readout({ kicker, body }: { kicker: string; body: string }) {
  return (
    <div className="mt-3 border border-[#f3efe8]/25 bg-[#4a4a4a]/55 px-5 py-4 md:px-6 md:py-5">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-[#f3efe8]/65 uppercase">
        {kicker}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-[#f3efe8]/90 md:text-base">
        {body}
      </p>
    </div>
  );
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
      className="pointer-events-none absolute z-10 w-max max-w-[240px] border border-[#f3efe8]/20 bg-[#111] px-3 py-2.5"
      style={{ left: `${left}%`, top: `${top}%`, transform }}
    >
      <p className="text-[11px] font-semibold tracking-[0.16em] text-[#f1621a] uppercase">
        {kicker}
      </p>
      <p className="mt-1 text-sm leading-snug text-[#f3efe8]">{body}</p>
    </div>
  );
}

function markerPercent(viewW: number, viewH: number, xPx: number, yPx: number) {
  return {
    left: (xPx / viewW) * 100,
    top: (yPx / viewH) * 100,
  };
}

function hotTooltip(row: Summer) {
  let note = `${daysLabel(row.hotDays)} con más de 30 °C.`;
  if (row.year === HOT_PEAK?.year) {
    note += " Es el máximo de la serie.";
  } else if (row.year === FIRST_YEAR) {
    note += " Es el primer verano de la serie.";
  } else if (row.hotDays === 0) {
    note = "Ese verano la temperatura no llegó a 30 °C.";
  }
  return { kicker: String(row.year), body: note };
}

function rainTooltip(row: Summer) {
  const average = formatHa(EARLY_RAIN_AVG, 1);
  let note = `${formatHa(row.precipMm, 1)} mm de lluvia acumulada.`;
  if (row.year >= RECENT_FROM && !isRecentDry(row)) {
    note += ` Excepción reciente: quedó por encima del promedio de 1991–2010 (${average} mm).`;
  } else if (row.precipMm < EARLY_RAIN_AVG) {
    note += ` Por debajo del promedio de 1991–2010 (${average} mm).`;
  } else {
    note += ` Por encima del promedio de 1991–2010 (${average} mm).`;
  }
  return { kicker: String(row.year), body: note };
}

function windTooltip(row: Summer) {
  const note = isWindReview(row.year)
    ? `${daysLabel(row.windDays)} con viento medio por encima de 30 km/h. Es uno de los cuatro veranos finales: el valor nos resulta poco confiable.`
    : `${daysLabel(row.windDays)} con viento medio por encima de 30 km/h. Hasta 2022, casi todos los días del verano superaban ese umbral.`;
  return { kicker: String(row.year), body: note };
}

function AxisFrame({
  margin,
  innerW,
  innerH,
  x,
  yTicks,
  y,
  yLabel,
}: {
  margin: { top: number; right: number; bottom: number; left: number };
  innerW: number;
  innerH: number;
  x: d3.ScaleBand<number>;
  yTicks: number[];
  y: (value: number) => number;
  yLabel: string;
}) {
  const ticks = yearTicks(YEARS);
  return (
    <g className="axes" transform={`translate(${margin.left},${margin.top})`}>
      <text
        x={innerW / 2}
        y={innerH + margin.bottom - 8}
        textAnchor="middle"
        fill={INK}
        fillOpacity={0.75}
        fontSize={13}
      >
        Año
      </text>
      <text
        transform={`translate(${-margin.left + 16}, ${innerH / 2}) rotate(-90)`}
        textAnchor="middle"
        fill={INK}
        fillOpacity={0.75}
        fontSize={13}
      >
        {yLabel}
      </text>
      <line
        x1={0}
        x2={0}
        y1={0}
        y2={innerH}
        stroke={INK}
        strokeOpacity={0.35}
      />
      <line
        x1={0}
        x2={innerW}
        y1={innerH}
        y2={innerH}
        stroke={INK}
        strokeOpacity={0.35}
      />
      {yTicks.map((tick) => (
        <g key={tick}>
          <line
            x1={0}
            x2={innerW}
            y1={y(tick)}
            y2={y(tick)}
            stroke={INK}
            strokeOpacity={0.08}
          />
          <text
            x={-8}
            y={y(tick)}
            textAnchor="end"
            dominantBaseline="middle"
            fill={INK}
            fillOpacity={0.65}
            fontSize={12}
          >
            {tick}
          </text>
        </g>
      ))}
      {ticks.map((year) => (
        <text
          key={year}
          x={(x(year) ?? 0) + x.bandwidth() / 2}
          y={innerH + 22}
          textAnchor="middle"
          fill={INK}
          fillOpacity={0.75}
          fontSize={12}
        >
          {year}
        </text>
      ))}
    </g>
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

function HotDaysChart() {
  const focus = useYearFocus();
  const margin = { top: 28, right: 12, bottom: 48, left: 52 };
  const height = 360;
  const innerW = VIEW_W - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const x = useMemo(
    () =>
      d3.scaleBand<number>().domain(YEARS).range([0, innerW]).padding(0.28),
    [innerW],
  );
  const y = useMemo(
    () => d3.scaleLinear().domain([0, 16]).range([innerH, 0]),
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
      .y((d) => y(trendAt(d.year)));
    return line(SUMMERS) ?? "";
  }, [trendAt, x, y]);

  const active = SUMMERS.find((d) => d.year === focus.year) ?? null;
  const yTicks = [0, 4, 8, 12];

  return (
    <figure>
      <ChartTitle
        title="Días con más de 30 °C"
        dek="Cantidad de días del verano en los que la temperatura superó los 30 °C."
      />
      <Legend
        items={[
          {
            label: "Días del verano",
            swatch: (
              <span className="inline-block h-3 w-3" style={{ background: ACCENT }} />
            ),
          },
          {
            label: "Tendencia",
            swatch: (
              <span
                className="inline-block h-0.5 w-5 border-t-2 border-dashed"
                style={{ borderColor: TREND }}
              />
            ),
          },
        ]}
      />
      <div className="relative">
      <svg
        viewBox={`0 0 ${VIEW_W} ${height}`}
        className="h-auto w-full font-sans outline-none"
        role="group"
        tabIndex={0}
        aria-label="Días con más de 30 grados por verano, de 1991 a 2026. En 1991 hubo 2 días y el máximo es 2024, con 12. La línea punteada marca una tendencia ascendente. Con las flechas se recorre cada año."
        onKeyDown={focus.onKeyDown}
        onPointerLeave={focus.onPointerLeave}
      >
        <AxisFrame
          margin={margin}
          innerW={innerW}
          innerH={innerH}
          x={x}
          yTicks={yTicks}
          y={y}
          yLabel="Días"
        />
        <g className="plot" transform={`translate(${margin.left},${margin.top})`}>
          {SUMMERS.map((row) => {
            const fullH = Math.max(0, innerH - y(row.hotDays));
            const barH = row.hotDays === 0 ? 2 : fullH;
            const hovered = focus.year === row.year;
            const dim = focus.year != null && !hovered;
            return (
              <rect
                key={row.year}
                x={x(row.year)}
                y={innerH - barH}
                width={x.bandwidth()}
                height={barH}
                fill={ACCENT}
                opacity={dim ? 0.35 : row.hotDays === 0 ? 0.45 : 1}
                pointerEvents="none"
              />
            );
          })}
          <path
            d={trendPath}
            fill="none"
            stroke={TREND}
            strokeWidth={1.75}
            strokeDasharray="5 4"
            pointerEvents="none"
          />
          <YearCallout
            x={(x(FIRST_YEAR) ?? 0) + x.bandwidth() / 2}
            y={y(SUMMERS[0]?.hotDays ?? 0)}
            value={String(SUMMERS[0]?.hotDays ?? 0)}
          />
          {HOT_PEAK ? (
            <YearCallout
              x={(x(HOT_PEAK.year) ?? 0) + x.bandwidth() / 2}
              y={y(HOT_PEAK.hotDays)}
              value={String(HOT_PEAK.hotDays)}
              year={HOT_PEAK.year}
            />
          ) : null}
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
            height,
            margin.left + (x(active.year) ?? 0) + x.bandwidth() / 2,
            margin.top + y(active.hotDays),
          )}
          {...hotTooltip(active)}
        />
      ) : null}
      </div>
      <Readout
        kicker="Tendencia"
        body={`En ${FIRST_YEAR} hubo ${SUMMERS[0]?.hotDays ?? 0} días por encima de 30 °C. El máximo es ${HOT_PEAK?.year}, con ${HOT_PEAK?.hotDays}. La línea punteada sigue la suba de la serie.`}
      />
    </figure>
  );
}

function YearCallout({
  x,
  y,
  value,
  year,
}: {
  x: number;
  y: number;
  value: string;
  year?: number;
}) {
  return (
    <g pointerEvents="none">
      {year != null ? (
        <text
          x={x}
          y={y - 36}
          textAnchor="middle"
          fill={ACCENT}
          fontSize={11}
          fontWeight={700}
        >
          {year}
        </text>
      ) : null}
      <text
        x={x}
        y={y - 8}
        textAnchor="middle"
        fill={INK}
        fontSize={13}
        fontWeight={700}
      >
        {value}
      </text>
    </g>
  );
}

function SummerRainChart() {
  const focus = useYearFocus();
  const clipPrefix = useId().replace(/:/g, "");
  const margin = { top: 28, right: 8, bottom: 44, left: 8 };
  const innerW = VIEW_W - margin.left - margin.right;
  const innerH = (PRECIP_MAX / PRECIP_UNIT) * PRECIP_SLOT;
  const height = margin.top + innerH + margin.bottom;

  const x = useMemo(
    () =>
      d3.scaleBand<number>().domain(YEARS).range([0, innerW]).padding(0.32),
    [innerW],
  );

  const active = SUMMERS.find((d) => d.year === focus.year) ?? null;
  const recentStart = x(RECENT_FROM) ?? innerW;
  const recentEnd =
    (x(LAST_YEAR) ?? innerW) + x.bandwidth();
  const dropScale = 11.2 / 13;
  const dropW = 10 * dropScale;
  const dropH = 13 * dropScale;

  return (
    <figure>
      <ChartTitle
        title="Lluvia acumulada"
        dek="Milímetros de precipitación sumados en cada verano. Cada gota representa 10 mm."
      />
      <Legend
        items={[
          {
            label: "10 mm",
            swatch: <DropSwatch fill={INK} />,
          },
          {
            label: "Verano reciente por debajo del promedio 1991–2010",
            swatch: <DropSwatch fill={ACCENT} />,
          },
        ]}
      />
      <div className="relative">
      <svg
        viewBox={`0 0 ${VIEW_W} ${height}`}
        className="h-auto w-full font-sans outline-none"
        role="group"
        tabIndex={0}
        aria-label={`Lluvia acumulada por verano, de 1991 a 2026. Cada gota son 10 milímetros. Desde 2021, ${RECENT_DRY.length} de ${RECENT_SUMMERS.length} veranos quedaron bajo el promedio de 1991 a 2010. Con las flechas se recorre cada año.`}
        onKeyDown={focus.onKeyDown}
        onPointerLeave={focus.onPointerLeave}
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          <text
            x={innerW / 2}
            y={innerH + margin.bottom - 6}
            textAnchor="middle"
            fill={INK}
            fillOpacity={0.75}
            fontSize={13}
          >
            Año
          </text>
          <rect
            x={recentStart}
            y={0}
            width={Math.max(0, recentEnd - recentStart)}
            height={innerH}
            fill={ACCENT}
            opacity={0.1}
            pointerEvents="none"
          />
          <text
            x={(recentStart + recentEnd) / 2}
            y={-10}
            textAnchor="middle"
            fill={ACCENT}
            fontSize={12}
            fontWeight={700}
          >
            poca lluvia
          </text>
          <line
            x1={0}
            x2={innerW}
            y1={innerH}
            y2={innerH}
            stroke={INK}
            strokeOpacity={0.35}
          />
          {yearTicks(YEARS).map((year) => (
            <text
              key={year}
              x={(x(year) ?? 0) + x.bandwidth() / 2}
              y={innerH + 20}
              textAnchor="middle"
              fill={INK}
              fillOpacity={0.75}
              fontSize={12}
            >
              {year}
            </text>
          ))}
          <defs>
            {SUMMERS.map((row) => {
              const columnH = (row.precipMm / PRECIP_UNIT) * PRECIP_SLOT;
              return (
                <clipPath
                  key={row.year}
                  id={`${clipPrefix}-${row.year}`}
                >
                  <rect
                    x={x(row.year)}
                    y={innerH - columnH}
                    width={x.bandwidth()}
                    height={columnH}
                  />
                </clipPath>
              );
            })}
          </defs>
          {SUMMERS.map((row) => {
            const slots = Math.ceil(row.precipMm / PRECIP_UNIT);
            const cx = (x(row.year) ?? 0) + x.bandwidth() / 2;
            const dry = isRecentDry(row);
            const hovered = focus.year === row.year;
            const dim = focus.year != null && !hovered;
            return (
              <g
                key={row.year}
                clipPath={`url(#${clipPrefix}-${row.year})`}
                opacity={dim ? 0.35 : 1}
                pointerEvents="none"
              >
                {Array.from({ length: slots }, (_, slot) => {
                  const yTop =
                    innerH -
                    (slot + 1) * PRECIP_SLOT +
                    (PRECIP_SLOT - dropH) / 2;
                  return (
                    <g
                      key={slot}
                      transform={`translate(${cx - dropW / 2}, ${yTop}) scale(${dropScale})`}
                    >
                      <path d={DROP} fill={dry ? ACCENT : INK} />
                    </g>
                  );
                })}
              </g>
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
            height,
            margin.left + (x(active.year) ?? 0) + x.bandwidth() / 2,
            margin.top +
              innerH -
              (active.precipMm / PRECIP_UNIT) * PRECIP_SLOT,
          )}
          {...rainTooltip(active)}
        />
      ) : null}
      </div>
      <Readout
        kicker="Últimos veranos"
        body={`Desde ${RECENT_FROM}, ${RECENT_DRY.length} de ${RECENT_SUMMERS.length} veranos quedaron por debajo del promedio de 1991–2010 (${formatHa(EARLY_RAIN_AVG, 1)} mm). Las gotas naranjas marcan esos años. 2022, con ${formatHa(99.1, 1)} mm, fue la excepción.`}
      />
    </figure>
  );
}

function DropSwatch({ fill }: { fill: string }) {
  return (
    <svg width="12" height="16" viewBox="0 0 10 13" aria-hidden>
      <path d={DROP} fill={fill} />
    </svg>
  );
}

function WindDaysChart() {
  const focus = useYearFocus();
  const margin = { top: 36, right: 16, bottom: 48, left: 52 };
  const height = 360;
  const innerW = VIEW_W - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const x = useMemo(
    () =>
      d3.scaleBand<number>().domain(YEARS).range([0, innerW]).padding(0.28),
    [innerW],
  );
  const y = useMemo(
    () => d3.scaleLinear().domain([0, 100]).range([innerH, 0]),
    [innerH],
  );

  const cx = (year: number) => (x(year) ?? 0) + x.bandwidth() / 2;
  const solid = SUMMERS.filter((d) => d.year <= 2022);
  const reviewed = SUMMERS.filter((d) => d.year >= 2022);

  const solidPath = d3
    .line<Summer>()
    .x((d) => cx(d.year))
    .y((d) => y(d.windDays))
    .curve(d3.curveMonotoneX)(solid);

  const reviewPath = d3
    .line<Summer>()
    .x((d) => cx(d.year))
    .y((d) => y(d.windDays))
    .curve(d3.curveMonotoneX)(reviewed);

  const reviewStart = x(WIND_REVIEW_FROM) ?? innerW;
  const active = SUMMERS.find((d) => d.year === focus.year) ?? null;
  const anchor2022 = SUMMERS.find((d) => d.year === 2022);
  const anchor2026 = SUMMERS.find((d) => d.year === LAST_YEAR);

  return (
    <figure>
      <ChartTitle
        title="Días con viento medio mayor a 30 km/h"
        dek="Cantidad de días del verano en los que el viento medio superó los 30 km/h."
      />
      <Legend
        items={[
          {
            label: "Días por verano",
            swatch: <span className="inline-block h-0.5 w-5" style={{ background: INK }} />,
          },
          {
            label: "2023–2026, en revisión",
            swatch: (
              <span
                className="inline-block h-0.5 w-5 border-t-2 border-dashed"
                style={{ borderColor: ACCENT }}
              />
            ),
          },
        ]}
      />
      <div className="relative">
      <svg
        viewBox={`0 0 ${VIEW_W} ${height}`}
        className="h-auto w-full font-sans outline-none"
        role="group"
        tabIndex={0}
        aria-label="Días con viento medio mayor a 30 kilómetros por hora, por verano. Hasta 2022 casi todos los días superan ese umbral. De 2023 a 2026 los valores caen a menos de la mitad y están en revisión porque el cálculo resultó llamativo. Con las flechas se recorre cada año."
        onKeyDown={focus.onKeyDown}
        onPointerLeave={focus.onPointerLeave}
      >
        <AxisFrame
          margin={margin}
          innerW={innerW}
          innerH={innerH}
          x={x}
          yTicks={[0, 25, 50, 75, 100]}
          y={y}
          yLabel="Días"
        />
        <g className="plot" transform={`translate(${margin.left},${margin.top})`}>
          <rect
            x={reviewStart}
            y={0}
            width={Math.max(0, innerW - reviewStart)}
            height={innerH}
            fill={ACCENT}
            opacity={0.08}
            pointerEvents="none"
          />
          <text
            x={reviewStart + (innerW - reviewStart) / 2}
            y={16}
            textAnchor="middle"
            fill={ACCENT}
            fontSize={12}
            fontWeight={700}
            pointerEvents="none"
          >
            en revisión
          </text>
          <path
            d={solidPath ?? ""}
            fill="none"
            stroke={INK}
            strokeWidth={2.5}
            pointerEvents="none"
          />
          <path
            d={reviewPath ?? ""}
            fill="none"
            stroke={ACCENT}
            strokeWidth={2.5}
            strokeDasharray="5 4"
            pointerEvents="none"
          />
          {SUMMERS.map((row) => {
            const review = isWindReview(row.year);
            const hovered = focus.year === row.year;
            const dim = focus.year != null && !hovered;
            return (
              <circle
                key={row.year}
                cx={cx(row.year)}
                cy={y(row.windDays)}
                r={hovered ? 5 : review ? 4 : 2.6}
                fill={review ? ACCENT : INK}
                opacity={dim ? 0.35 : 1}
                pointerEvents="none"
              />
            );
          })}
          {anchor2022 ? (
            <YearCallout
              x={cx(anchor2022.year)}
              y={y(anchor2022.windDays)}
              value={String(anchor2022.windDays)}
            />
          ) : null}
          {anchor2026 ? (
            <YearCallout
              x={cx(anchor2026.year)}
              y={y(anchor2026.windDays)}
              value={String(anchor2026.windDays)}
            />
          ) : null}
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
            height,
            margin.left + cx(active.year),
            margin.top + y(active.windDays),
          )}
          {...windTooltip(active)}
        />
      ) : null}
      </div>
      <Readout
        kicker={`${FIRST_YEAR}–2022`}
        body="Hasta 2022, el viento medio superó los 30 km/h casi todos los días del verano."
      />
      <div className="mt-3 border border-[#f1621a] bg-[#383838] px-5 py-4 text-sm leading-relaxed text-[#f3efe8]/90 md:px-6 md:py-5 md:text-base">
        Los últimos cuatro veranos —2023, 2024, 2025 y 2026— caen de golpe a
        menos de la mitad de los días. Las cuentas nos dieron rarísimas y
        creemos que puede haber un error. Los dejamos a la vista, con la curva
        punteada, hasta poder revisarlos.
      </div>
    </figure>
  );
}

export function SummerClimateCharts() {
  return (
    <div className="mt-12">
      <div className="space-y-16">
        <HotDaysChart />
        <SummerRainChart />
        <WindDaysChart />
      </div>
      <p className="mt-8 text-xs leading-relaxed text-[#f3efe8]/65 md:text-sm">
        Fuente: {climate.source}
      </p>
    </div>
  );
}
