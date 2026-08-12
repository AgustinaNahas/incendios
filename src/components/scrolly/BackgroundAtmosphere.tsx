"use client";

import { useMemo } from "react";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function rgbToCss([r, g, b]: [number, number, number], a = 1) {
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`;
}

/** Dark ash → fire glow → cool green light as we scroll "back" in time. */
const STOPS: { t: number; c0: string; c1: string }[] = [
  { t: 0, c0: "#0c0b0a", c1: "#1a1614" },
  { t: 0.28, c0: "#1a100c", c1: "#3a1c12" },
  { t: 0.52, c0: "#2a1208", c1: "#7a2e10" },
  { t: 0.78, c0: "#1a2a22", c1: "#3d6b55" },
  { t: 1, c0: "#dce8df", c1: "#a8c9b8" },
];

function sample(progress: number) {
  const t = Math.min(1, Math.max(0, progress));
  let i = 0;
  while (i < STOPS.length - 2 && STOPS[i + 1].t < t) i += 1;
  const a = STOPS[i];
  const b = STOPS[i + 1];
  const local = (t - a.t) / (b.t - a.t || 1);
  const c0a = hexToRgb(a.c0);
  const c0b = hexToRgb(b.c0);
  const c1a = hexToRgb(a.c1);
  const c1b = hexToRgb(b.c1);
  return {
    bg0: rgbToCss([
      lerp(c0a[0], c0b[0], local),
      lerp(c0a[1], c0b[1], local),
      lerp(c0a[2], c0b[2], local),
    ]),
    bg1: rgbToCss([
      lerp(c1a[0], c1b[0], local),
      lerp(c1a[1], c1b[1], local),
      lerp(c1a[2], c1b[2], local),
    ]),
    mist: t > 0.7 ? 0.08 : 0.22 - t * 0.12,
    text: t > 0.72 ? "#1a2e24" : "#f3efe8",
    muted: t > 0.72 ? "rgba(26,46,36,0.7)" : "rgba(243,239,232,0.72)",
  };
}

type Props = {
  progress: number;
};

export function BackgroundAtmosphere({ progress }: Props) {
  const palette = useMemo(() => sample(progress), [progress]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 transition-[background] duration-300"
      style={{
        background: `radial-gradient(120% 80% at 70% 20%, ${palette.bg1}, transparent 55%),
          linear-gradient(165deg, ${palette.bg0}, ${palette.bg1})`,
        color: palette.text,
      }}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E\")",
          mixBlendMode: "overlay",
          opacity: palette.mist,
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background: `linear-gradient(to top, ${palette.bg0}, transparent)`,
        }}
      />
    </div>
  );
}

export function useAtmosphereText(progress: number) {
  return useMemo(() => sample(progress), [progress]);
}
