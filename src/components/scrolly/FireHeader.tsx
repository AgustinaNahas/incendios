"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { FireSparks } from "@/components/scrolly/FireSparks";
import {
  CampfireLayer,
  FarMountainsLayer,
  FirefighterLayer,
  ForestMidLayer,
  ForestNearLayer,
  GroundLayer,
  LakeLayer,
  MidMountainsLayer,
  NearMountainsLayer,
  SkyLayer,
  SmokeLayer,
  TreesFarLayer,
  TrunksLayer,
  WildfireLayer,
} from "@/components/scrolly/headerLayers";

type Key = [number, number];

type LayerMotion = {
  opacity: Key[];
  scale: Key[];
  x: Key[];
  y: Key[];
  origin?: string;
};

const LAYERS: Record<string, LayerMotion> = {
  sky: {
    opacity: [
      [0, 1],
      [0.88, 1],
      [0.94, 0],
    ],
    scale: [
      [0, 1],
      [0.5, 1.08],
    ],
    x: [[0, 0]],
    y: [
      [0, 0],
      [0.5, -4],
    ],
  },
  farMtn: {
    opacity: [
      [0, 1],
      [0.34, 1],
      [0.48, 0.35],
      [0.58, 0],
    ],
    scale: [
      [0, 1],
      [0.28, 1.35],
      [0.5, 1.7],
    ],
    x: [[0, 0]],
    y: [
      [0, 18],
      [0.22, 4],
      [0.45, -6],
    ],
    origin: "50% 80%",
  },
  midMtn: {
    opacity: [
      [0, 0],
      [0.06, 0],
      [0.14, 1],
      [0.36, 1],
      [0.48, 0.2],
      [0.56, 0],
    ],
    scale: [
      [0, 1.05],
      [0.28, 1.45],
      [0.5, 1.9],
    ],
    x: [
      [0, 0],
      [0.3, -2],
    ],
    y: [
      [0, 28],
      [0.16, 8],
      [0.4, -10],
    ],
    origin: "50% 85%",
  },
  nearMtn: {
    opacity: [
      [0, 0],
      [0.12, 0],
      [0.2, 1],
      [0.34, 1],
      [0.46, 0.15],
      [0.54, 0],
    ],
    scale: [
      [0, 1.1],
      [0.3, 1.55],
      [0.5, 2.1],
    ],
    x: [
      [0, 3],
      [0.3, 0],
    ],
    y: [
      [0, 36],
      [0.22, 6],
      [0.42, -16],
    ],
    origin: "55% 90%",
  },
  lake: {
    opacity: [
      [0, 0],
      [0.14, 0],
      [0.2, 1],
      [0.3, 1],
      [0.4, 0],
    ],
    scale: [
      [0, 1],
      [0.3, 1.35],
    ],
    x: [[0, 0]],
    y: [
      [0, 42],
      [0.2, 8],
      [0.36, -18],
    ],
    origin: "50% 100%",
  },
  treesFar: {
    opacity: [
      [0, 0],
      [0.28, 0],
      [0.36, 1],
      [0.5, 0.4],
      [0.58, 0],
    ],
    scale: [
      [0, 1.1],
      [0.45, 1.6],
    ],
    x: [[0, 0]],
    y: [
      [0, 24],
      [0.36, 4],
      [0.52, -8],
    ],
    origin: "50% 100%",
  },
  forestMid: {
    opacity: [
      [0, 0],
      [0.34, 0],
      [0.42, 1],
      [0.58, 1],
      [0.66, 0],
      [0.78, 0],
      [0.84, 1],
      [0.9, 0.25],
      [0.94, 0],
    ],
    scale: [
      [0, 1.15],
      [0.5, 1.45],
      [0.84, 1.2],
    ],
    x: [
      [0, -4],
      [0.46, 0],
    ],
    y: [
      [0, 30],
      [0.44, 0],
      [0.58, -12],
      [0.84, 8],
    ],
    origin: "50% 100%",
  },
  forestNear: {
    opacity: [
      [0, 0],
      [0.4, 0],
      [0.48, 1],
      [0.6, 1],
      [0.68, 0],
      [0.8, 0],
      [0.85, 1],
      [0.91, 0.35],
      [0.95, 0],
    ],
    scale: [
      [0, 1.2],
      [0.55, 1.55],
      [0.85, 1.15],
    ],
    x: [
      [0, 6],
      [0.5, 0],
    ],
    y: [
      [0, 36],
      [0.5, 0],
      [0.62, -14],
      [0.85, 10],
    ],
    origin: "50% 110%",
  },
  wildfire: {
    opacity: [
      [0, 0],
      [0.8, 0],
      [0.85, 1],
      [0.92, 0.45],
      [0.96, 0],
    ],
    scale: [
      [0, 1.05],
      [0.9, 1.18],
    ],
    x: [[0, 0]],
    y: [
      [0, 8],
      [0.88, -4],
    ],
    origin: "50% 70%",
  },
  trunks: {
    opacity: [
      [0, 0],
      [0.54, 0],
      [0.6, 1],
      [0.7, 0.85],
      [0.76, 0],
    ],
    scale: [
      [0, 1.05],
      [0.68, 1.2],
    ],
    x: [[0, 0]],
    y: [
      [0, 0],
      [0.68, -6],
    ],
    origin: "50% 50%",
  },
  campfire: {
    opacity: [
      [0, 0],
      [0.62, 0],
      [0.67, 1],
      [0.74, 1],
      [0.8, 0],
    ],
    scale: [
      [0, 1.05],
      [0.72, 1.18],
    ],
    x: [[0, 0]],
    y: [
      [0, 16],
      [0.67, 0],
      [0.76, -8],
    ],
    origin: "50% 80%",
  },
  ground: {
    opacity: [
      [0, 0],
      [0.72, 0],
      [0.76, 1],
      [0.82, 1],
      [0.86, 0],
    ],
    scale: [
      [0, 1.1],
      [0.8, 1.25],
    ],
    x: [
      [0, 0],
      [0.8, -3],
    ],
    y: [
      [0, 10],
      [0.78, 0],
    ],
    origin: "60% 70%",
  },
  smoke: {
    opacity: [
      [0, 0],
      [0.74, 0],
      [0.78, 1],
      [0.84, 0.7],
      [0.88, 0],
    ],
    scale: [
      [0, 1],
      [0.82, 1.2],
    ],
    x: [
      [0, 0],
      [0.82, 4],
    ],
    y: [
      [0, 8],
      [0.82, -10],
    ],
    origin: "60% 60%",
  },
  firefighter: {
    opacity: [
      [0, 0],
      [0.86, 0],
      [0.91, 1],
      [0.96, 1],
      [1, 1],
    ],
    scale: [
      [0, 1.06],
      [0.94, 1],
    ],
    x: [[0, 0]],
    y: [
      [0, 10],
      [0.92, 0],
      [1, 0],
    ],
    origin: "50% 48%",
  },
  fade: {
    opacity: [
      [0, 0],
      [0.88, 0],
      [0.93, 1],
      [1, 1],
    ],
    scale: [[0, 1]],
    x: [[0, 0]],
    y: [[0, 0]],
  },
};

const SKY_STOPS: Array<[number, [number, number, number]]> = [
  [0, [183, 196, 200]],
  [0.46, [176, 188, 186]],
  [0.58, [196, 140, 80]],
  [0.7, [160, 90, 40]],
  [0.84, [70, 28, 16]],
  [0.92, [48, 36, 32]],
  [1, [43, 43, 43]],
];

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function sample(keys: Key[], t: number) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i += 1) {
    if (t <= keys[i][0]) {
      const [t0, v0] = keys[i - 1];
      const [t1, v1] = keys[i];
      const u = t1 === t0 ? 1 : (t - t0) / (t1 - t0);
      return lerp(v0, v1, u);
    }
  }
  return keys[keys.length - 1][1];
}

function sampleColor(t: number) {
  const keys = SKY_STOPS;
  let from = keys[0];
  let to = keys[keys.length - 1];
  for (let i = 1; i < keys.length; i += 1) {
    if (t <= keys[i][0]) {
      from = keys[i - 1];
      to = keys[i];
      break;
    }
  }
  const u = to[0] === from[0] ? 1 : (t - from[0]) / (to[0] - from[0]);
  const r = lerp(from[1][0], to[1][0], u);
  const g = lerp(from[1][1], to[1][1], u);
  const b = lerp(from[1][2], to[1][2], u);
  return `rgb(${r.toFixed(0)}, ${g.toFixed(0)}, ${b.toFixed(0)})`;
}

function paintLayer(
  el: HTMLElement,
  motion: LayerMotion,
  progress: number,
  hideWhenTransparent = true,
) {
  const opacity = sample(motion.opacity, progress);
  el.style.opacity = String(opacity);
  if (hideWhenTransparent) {
    el.style.visibility = opacity < 0.01 ? "hidden" : "visible";
  }
  el.style.transform = `translate3d(${sample(motion.x, progress)}%, ${sample(motion.y, progress)}%, 0) scale(${sample(motion.scale, progress)})`;
}

const LAYER_DEFS: Array<{
  id: keyof typeof LAYERS;
  z: number;
  Layer: () => ReactNode;
}> = [
  { id: "sky", z: 1, Layer: SkyLayer },
  { id: "farMtn", z: 2, Layer: FarMountainsLayer },
  { id: "midMtn", z: 3, Layer: MidMountainsLayer },
  { id: "nearMtn", z: 4, Layer: NearMountainsLayer },
  { id: "lake", z: 5, Layer: LakeLayer },
  { id: "treesFar", z: 6, Layer: TreesFarLayer },
  { id: "wildfire", z: 7, Layer: WildfireLayer },
  { id: "forestMid", z: 8, Layer: ForestMidLayer },
  { id: "forestNear", z: 9, Layer: ForestNearLayer },
  { id: "trunks", z: 10, Layer: TrunksLayer },
  { id: "campfire", z: 11, Layer: CampfireLayer },
  { id: "ground", z: 12, Layer: GroundLayer },
  { id: "smoke", z: 13, Layer: SmokeLayer },
  { id: "firefighter", z: 14, Layer: FirefighterLayer },
];

export function FireHeader() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const fadeRef = useRef<HTMLDivElement>(null);
  const intensityRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    if (!section || !frame) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const update = () => {
      const total = section.offsetHeight - window.innerHeight;
      const progress = reduced
        ? 1
        : clamp(total > 0 ? -section.getBoundingClientRect().top / total : 0);

      const fire = clamp((progress - 0.54) / 0.22);
      const sparkFade = 1 - clamp((progress - 0.86) / 0.08);
      intensityRef.current = fire * sparkFade;
      frame.style.backgroundColor = sampleColor(progress);

      for (const { id } of LAYER_DEFS) {
        const el = layerRefs.current[id];
        if (el) paintLayer(el, LAYERS[id], progress);
      }
      if (fadeRef.current) {
        paintLayer(fadeRef.current, LAYERS.fade, progress, false);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header ref={sectionRef} className="relative h-[560vh] text-[#f3efe8]">
      <div
        ref={frameRef}
        className="sticky top-0 isolate h-dvh overflow-hidden bg-[#b7c4c8]"
      >
        {LAYER_DEFS.map(({ id, z, Layer }) => (
          <div
            key={id}
            ref={(el) => {
              layerRefs.current[id] = el;
            }}
            aria-hidden
            className="pointer-events-none absolute inset-0 will-change-transform"
            style={
              {
                zIndex: z,
                transformOrigin: LAYERS[id].origin ?? "50% 50%",
                opacity: id === "farMtn" || id === "sky" ? 1 : 0,
              } as CSSProperties
            }
          >
            <Layer />
          </div>
        ))}

        <FireSparks intensityRef={intensityRef} />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 shadow-[inset_0_0_140px_50px_rgba(8,3,2,0.28)]"
        />

        <div
          ref={fadeRef}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[22] h-[62%] bg-gradient-to-b from-transparent from-0% via-[#2B2B2B]/50 via-[38%] to-[#2B2B2B] to-[78%] will-change-[opacity]"
          style={{ opacity: 0 }}
        />
      </div>
    </header>
  );
}
