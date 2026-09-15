"use client";

import { useLayoutEffect, useRef } from "react";
import * as d3 from "d3";
import { ATLAS_COLORS, OTBN_COLORS, OTBN_ZONA_LABELS } from "@/lib/otbnColors";
import type { AtlasBarConfig } from "@/lib/atlasSteps";
import type { OtbnZona } from "@/lib/otbnColors";

type Props = {
  bar: AtlasBarConfig;
  active?: boolean;
  highlightZona?: number | null;
  onHighlightZona?: (zona: number | null) => void;
};

const VIEW_W = 640;
const VIEW_H = 44;
const DURATION = 900;

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
  active = true,
  highlightZona = null,
  onHighlightZona,
}: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const hoverRef = useRef(onHighlightZona);
  hoverRef.current = onHighlightZona;
  const seenRef = useRef(false);

  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const segs = segmentsFromBar(bar);
    const root = d3.select(svg);
    const animate = active && !reduce;
    const firstPaint = !seenRef.current;
    if (active) seenRef.current = true;

    const selection = root
      .selectAll<SVGRectElement, Seg>("rect.atlas-bar-seg")
      .data(segs, (d) => d.id);

    selection
      .exit()
      .transition()
      .duration(animate ? DURATION : 0)
      .attr("width", 0)
      .remove();

    const enter = selection
      .enter()
      .append("rect")
      .attr("class", "atlas-bar-seg")
      .attr("y", 0)
      .attr("height", VIEW_H)
      .attr("x", (d) => d.x)
      .attr("width", firstPaint || !animate ? (d) => Math.max(0, d.width) : 0)
      .attr("fill", (d) => d.color);

    const merged = enter.merge(selection);

    merged
      .style("cursor", (d) => (d.hoverable ? "pointer" : "default"))
      .attr("tabindex", (d) => (d.hoverable ? 0 : null))
      .attr("role", (d) => (d.hoverable ? "button" : null))
      .attr("aria-label", (d) => {
        if (!d.hoverable || d.zona == null) return null;
        return `Categoría ${d.zona === 1 ? "I" : d.zona === 2 ? "II" : "III"}`;
      })
      .on("mouseenter", (_event, d) => {
        if (d.hoverable && d.zona != null) hoverRef.current?.(d.zona);
      })
      .on("mouseleave", () => hoverRef.current?.(null))
      .on("focus", (_event, d) => {
        if (d.hoverable && d.zona != null) hoverRef.current?.(d.zona);
      })
      .on("blur", () => hoverRef.current?.(null));

    merged.interrupt();
    if (animate && firstPaint) {
      merged
        .attr("x", (d) => d.x)
        .attr("fill", (d) => d.color)
        .attr("width", 0)
        .transition()
        .delay((_, i) => i * DURATION)
        .duration(DURATION)
        .ease(d3.easeCubicOut)
        .attr("width", (d) => Math.max(0, d.width));
    } else if (animate) {
      merged
        .transition()
        .duration(DURATION)
        .ease(d3.easeCubicInOut)
        .attr("x", (d) => d.x)
        .attr("width", (d) => Math.max(0, d.width))
        .attr("fill", (d) => d.color);
    } else {
      merged
        .attr("x", (d) => d.x)
        .attr("width", (d) => Math.max(0, d.width))
        .attr("fill", (d) => d.color);
    }
  }, [bar, active]);

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

  const overlayText =
    bar.variant === "solid"
      ? bar.label
      : bar.variant === "share"
        ? bar.percentLabel
        : bar.caption;
  const caption = bar.variant === "share" ? bar.caption : null;
  const showLegend = bar.variant === "stacked";

  return (
    <div className="w-full">
      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="block h-11 w-full overflow-visible"
          role="img"
          aria-label={
            bar.variant === "solid"
              ? bar.label
              : bar.variant === "share"
                ? bar.caption
                : bar.caption
          }
        />
        {overlayText ? (
          <p
            className="pointer-events-none absolute inset-0 flex items-center px-3 font-[family-name:var(--font-display)] text-lg font-bold tracking-wide text-[#f3efe8] md:text-xl"
            aria-hidden
          >
            {overlayText}
          </p>
        ) : null}
      </div>
      {caption ? (
        <p className="mt-2 text-sm font-bold text-[#f3efe8]/85">{caption}</p>
      ) : null}
      {showLegend ? (
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#f3efe8]/80">
          {(bar.variant === "stacked" ? bar.segments : []).map((item) => {
            const dimmed =
              highlightZona != null && highlightZona !== item.zona;
            return (
              <li
                key={item.zona}
                className="inline-flex items-center gap-1.5 transition-opacity"
                style={{ opacity: dimmed ? 0.28 : 1 }}
              >
                <span
                  className="h-2 w-2 rounded-[1px]"
                  style={{ background: OTBN_COLORS[item.zona] }}
                  aria-hidden
                />
                Categoría {item.zona === 1 ? "I" : item.zona === 2 ? "II" : "III"}
                <span className="sr-only">
                  {OTBN_ZONA_LABELS[item.zona as OtbnZona]}
                </span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
