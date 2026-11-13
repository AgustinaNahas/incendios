"use client";

import { useLayoutEffect, useRef } from "react";
import * as d3 from "d3";
import { ATLAS_COLORS, OTBN_COLORS } from "@/lib/otbnColors";
import type { AtlasBarConfig } from "@/lib/atlasSteps";
import type { OtbnZona } from "@/lib/otbnColors";

type Props = {
  bar: AtlasBarConfig;
  highlightZona?: number | null;
  onHighlightZona?: (zona: number | null) => void;
  /** Barras más bajas, para la card fija de mobile. */
  compact?: boolean;
};

const VIEW_W = 640;
const VIEW_H = 18;

type Seg = {
  id: string;
  zona: number | null;
  color: string;
  x: number;
  width: number;
  hoverable: boolean;
};

function zonaParts(bar: AtlasBarConfig): { zona: OtbnZona; value: number }[] | null {
  if (bar.variant === "stacked") return bar.segments;
  if (bar.variant === "solid" && bar.segments?.length) return bar.segments;
  return null;
}

function segmentsFromBar(bar: AtlasBarConfig): Seg[] {
  if (bar.variant === "share") {
    const filled = Math.max(0, Math.min(1, bar.value / bar.total)) * VIEW_W;
    return [
      {
        id: "share-fill",
        zona: null,
        color: ATLAS_COLORS.forest,
        x: 0,
        width: filled,
        hoverable: false,
      },
      {
        id: "share-track",
        zona: null,
        color: ATLAS_COLORS.barTrack,
        x: filled,
        width: VIEW_W - filled,
        hoverable: false,
      },
    ];
  }

  const parts = zonaParts(bar);
  if (parts) {
    const total = bar.total || 1;
    const stacked = bar.variant === "stacked";
    let x = 0;
    return parts.map((item) => {
      const width = (item.value / total) * VIEW_W;
      const seg: Seg = {
        id: `z-${item.zona}`,
        zona: item.zona,
        color: stacked ? OTBN_COLORS[item.zona] : ATLAS_COLORS.barTrack,
        x,
        width,
        hoverable: stacked,
      };
      x += width;
      return seg;
    });
  }

  return [
    {
      id: "solid",
      zona: null,
      color: ATLAS_COLORS.barTrack,
      x: 0,
      width: VIEW_W,
      hoverable: false,
    },
  ];
}

export function AtlasShareBar({
  bar,
  highlightZona = null,
  onHighlightZona,
  compact = false,
}: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const hoverRef = useRef(onHighlightZona);
  hoverRef.current = onHighlightZona;

  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const segs = segmentsFromBar(bar);
    const root = d3.select(svg);

    const selection = root
      .selectAll<SVGRectElement, Seg>("rect.atlas-bar-seg")
      .data(segs, (d) => d.id);

    selection.exit().remove();

    const enter = selection
      .enter()
      .append("rect")
      .attr("class", "atlas-bar-seg")
      .attr("y", 0)
      .attr("height", VIEW_H);

    const merged = enter.merge(selection);

    merged
      .interrupt()
      .style("cursor", (d) => (d.hoverable ? "pointer" : "default"))
      .attr("tabindex", (d) => (d.hoverable ? 0 : null))
      .attr("role", (d) => (d.hoverable ? "button" : null))
      .attr("aria-label", (d) => {
        if (!d.hoverable || d.zona == null) return null;
        return `Categoría ${d.zona === 1 ? "I" : d.zona === 2 ? "II" : "III"}`;
      })
      .attr("x", (d) => d.x)
      .attr("width", (d) => Math.max(0, d.width))
      .attr("fill", (d) => d.color)
      .on("mouseenter", (_event, d) => {
        if (d.hoverable && d.zona != null) hoverRef.current?.(d.zona);
      })
      .on("mouseleave", () => hoverRef.current?.(null))
      .on("focus", (_event, d) => {
        if (d.hoverable && d.zona != null) hoverRef.current?.(d.zona);
      })
      .on("blur", () => hoverRef.current?.(null));
  }, [bar]);

  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    d3.select(svg)
      .selectAll<SVGRectElement, Seg>("rect.atlas-bar-seg")
      .attr("opacity", (d) => {
        if (highlightZona == null || !d.hoverable || d.zona == null) return 1;
        return d.zona === highlightZona ? 1 : 0.18;
      });
  }, [highlightZona, bar]);

  const caption = bar.variant === "share" ? bar.caption : null;
  const percents = percentLabels(bar);

  return (
    <div className="w-full">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        className={
          compact
            ? "block h-[7px] max-h-[7px] w-full"
            : "block h-[18px] max-h-[18px] w-full"
        }
        role="img"
        aria-label={barAriaLabel(bar, percents)}
      />
      {percents.length > 0 ? (
        <div
          className={
            compact
              ? "relative mt-0.5 h-3 text-[10px] leading-none text-white/55"
              : "relative mt-1 h-4 text-[11px] text-white/55"
          }
        >
          {percents.map((item) => {
            const dimmed =
              highlightZona != null && item.zona != null && highlightZona !== item.zona;
            return (
              <span
                key={item.id}
                className="absolute top-0 whitespace-nowrap transition-opacity"
                style={{
                  ...percentStyle(item),
                  opacity: dimmed ? 0.28 : 1,
                }}
              >
                {item.text}
              </span>
            );
          })}
        </div>
      ) : null}
      {caption ? (
        <p className={compact ? "mt-0.5 text-[11px] leading-snug text-white" : "mt-1 text-sm text-white"}>
          {caption}
        </p>
      ) : null}
    </div>
  );
}

type PercentLabel = {
  id: string;
  text: string;
  zona: number | null;
  start: number;
  end: number;
};

/** Reparte 100 puntos enteros según la parte fraccional, para que cierren en 100. */
function roundedPercents(values: number[], total: number): number[] {
  if (total <= 0) return values.map(() => 0);
  const raw = values.map((value) => (value / total) * 100);
  const floors = raw.map((value) => Math.floor(value));
  let leftover = 100 - floors.reduce((sum, value) => sum + value, 0);
  const order = raw
    .map((value, index) => ({ index, frac: value - floors[index] }))
    .sort((a, b) => b.frac - a.frac);
  const out = [...floors];
  for (let i = 0; i < leftover; i += 1) {
    const slot = order[i];
    if (!slot) break;
    out[slot.index] += 1;
  }
  return out;
}

function percentLabels(bar: AtlasBarConfig): PercentLabel[] {
  if (bar.variant === "share") {
    const end = Math.max(0, Math.min(1, bar.total ? bar.value / bar.total : 0));
    return [{ id: "share", text: bar.percentLabel, zona: null, start: 0, end }];
  }
  if (bar.variant === "solid") {
    return [{ id: "solid", text: bar.label, zona: null, start: 0, end: 1 }];
  }
  const total = bar.total || 1;
  const pcts = roundedPercents(
    bar.segments.map((item) => item.value),
    total,
  );
  let cursor = 0;
  return bar.segments.map((item, index) => {
    const width = item.value / total;
    const label: PercentLabel = {
      id: `z-${item.zona}`,
      text: `${pcts[index]}%`,
      zona: item.zona,
      start: cursor,
      end: cursor + width,
    };
    cursor += width;
    return label;
  });
}

function percentStyle(item: PercentLabel): { left?: string; right?: string; transform?: string } {
  const width = item.end - item.start;
  const last = item.end > 0.9;
  if (width < 0.12 && last) return { right: "0" };
  if (width < 0.12) return { left: `${item.start * 100}%` };
  return {
    left: `${((item.start + item.end) / 2) * 100}%`,
    transform: "translateX(-50%)",
  };
}

function barAriaLabel(bar: AtlasBarConfig, percents: PercentLabel[]): string {
  if (bar.variant === "share") return `${bar.percentLabel}. ${bar.caption}`;
  if (bar.variant === "solid") return bar.label;
  return percents.map((item) => item.text).join(", ");
}
