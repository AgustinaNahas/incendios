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
  onSegmentReveal?: (index: number) => void;
};

const VIEW_W = 640;
const VIEW_H = 80;
export const ATLAS_BAR_DURATION = 900;

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
  onSegmentReveal,
}: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const hoverRef = useRef(onHighlightZona);
  hoverRef.current = onHighlightZona;
  const revealRef = useRef(onSegmentReveal);
  revealRef.current = onSegmentReveal;
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

    const revealAll = () => {
      segs.forEach((_, i) => revealRef.current?.(i));
    };

    const selection = root
      .selectAll<SVGRectElement, Seg>("rect.atlas-bar-seg")
      .data(segs, (d) => d.id);

    selection
      .exit()
      .transition()
      .duration(animate ? ATLAS_BAR_DURATION : 0)
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

    const timers: number[] = [];
    merged.interrupt();
    if (animate && firstPaint) {
      segs.forEach((_, i) => {
        timers.push(
          window.setTimeout(() => revealRef.current?.(i), i * ATLAS_BAR_DURATION),
        );
      });
      merged
        .attr("x", (d) => d.x)
        .attr("fill", (d) => d.color)
        .attr("width", 0)
        .transition()
        .delay((_, i) => i * ATLAS_BAR_DURATION)
        .duration(ATLAS_BAR_DURATION)
        .ease(d3.easeCubicOut)
        .attr("width", (d) => Math.max(0, d.width));
    } else if (animate) {
      merged
        .transition()
        .duration(ATLAS_BAR_DURATION)
        .ease(d3.easeCubicInOut)
        .attr("x", (d) => d.x)
        .attr("width", (d) => Math.max(0, d.width))
        .attr("fill", (d) => d.color);
      revealAll();
    } else {
      merged
        .attr("x", (d) => d.x)
        .attr("width", (d) => Math.max(0, d.width))
        .attr("fill", (d) => d.color);
      if (active) revealAll();
    }

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
    };
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
  const legendSegs = showLegend ? segmentsFromBar(bar) : [];

  return (
    <div className="w-full">
      <div className="relative w-full">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="none"
          className="block h-[80px] w-full overflow-visible"
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
            className="pointer-events-none absolute inset-0 flex items-center px-4 font-[family-name:var(--font-display)] text-[52px] leading-none font-black tracking-wide text-[#f3efe8]"
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
        <div className="relative mt-3 min-h-6 text-xs text-[#f3efe8]/80">
          {legendSegs.map((item) => {
            if (item.zona == null) return null;
            const dimmed =
              highlightZona != null && highlightZona !== item.zona;
            const code =
              item.zona === 1 ? "I" : item.zona === 2 ? "II" : "III";
            return (
              <div
                key={item.id}
                className="absolute top-0 inline-flex items-center gap-1.5 whitespace-nowrap transition-opacity"
                style={{
                  left: `${(item.x / VIEW_W) * 100}%`,
                  opacity: dimmed ? 0.28 : 1,
                }}
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-[1px]"
                  style={{ background: OTBN_COLORS[item.zona as OtbnZona] }}
                  aria-hidden
                />
                Categoría {code}
                <span className="sr-only">
                  {OTBN_ZONA_LABELS[item.zona as OtbnZona]}
                </span>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
