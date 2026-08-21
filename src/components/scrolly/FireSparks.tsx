"use client";

import { useEffect, useRef, type MutableRefObject } from "react";

const POOL = 48;
const BASE_ACTIVE = 10;
const MAX_EXTRA = 32;

const SPARK_BG =
  "radial-gradient(48.04% 42.76% at 50% 50%, #FFC800 0%, #F46B15 26.44%, rgba(148, 15, 17, 0.2) 49.52%, rgba(34, 3, 3, 0) 75.96%)";

type Spark = {
  el: HTMLDivElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  wobble: number;
  wobbleSpeed: number;
  size: number;
  scale: number;
  blur: number;
  rotation: number;
  spin: number;
  life: number;
  maxLife: number;
  peak: number;
  active: boolean;
};

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function resetSpark(
  spark: Spark,
  width: number,
  height: number,
  intensity: number,
  fromBottom: boolean,
) {
  const band = 0.86 - intensity * 0.22;
  spark.x = width * (0.04 + Math.random() * 0.92);
  spark.y = fromBottom
    ? height * (band + (Math.random() - 0.35) * 0.12)
    : height * (0.25 + Math.random() * 0.55);
  spark.vx = (Math.random() - 0.5) * 18;
  spark.vy = -(28 + Math.random() * 55 + intensity * 18);
  spark.wobble = Math.random() * Math.PI * 2;
  spark.wobbleSpeed = 0.6 + Math.random() * 1.8;
  spark.size = 28 + Math.random() * 36;
  spark.scale = 0.35 + Math.random() * 1.45;
  spark.blur = Math.random() > 0.55 ? 2 + Math.random() * 10 : Math.random() * 1.5;
  spark.rotation = -12 + Math.random() * 24;
  spark.spin = (Math.random() - 0.5) * 12;
  spark.life = 0;
  spark.maxLife = 2.4 + Math.random() * 4.2;
  spark.peak = 0.45 + Math.random() * 0.45;
  spark.active = true;

  spark.el.style.width = `${spark.size}px`;
  spark.el.style.height = `${spark.size * (0.72 + Math.random() * 0.4)}px`;
  spark.el.style.filter = spark.blur > 0.4 ? `blur(${spark.blur}px)` : "none";
  spark.el.style.zIndex = spark.blur > 4 ? "12" : "4";
}

function paint(spark: Spark) {
  const t = spark.life / spark.maxLife;
  const fadeIn = Math.min(1, t / 0.18);
  const fadeOut = t > 0.55 ? 1 - (t - 0.55) / 0.45 : 1;
  const ceiling = spark.y < 80 ? Math.max(0, spark.y / 80) : 1;
  const opacity = spark.peak * fadeIn * fadeOut * ceiling;

  spark.el.style.opacity = String(Math.max(0, opacity));
  spark.el.style.transform = `translate3d(${spark.x}px, ${spark.y}px, 0) rotate(${spark.rotation}deg) scale(${spark.scale})`;
}

type Props = {
  intensityRef: MutableRefObject<number>;
};

export function FireSparks({ intensityRef }: Props) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    if (prefersReducedMotion()) {
      return;
    }

    const sparks: Spark[] = [];
    const nodes: HTMLDivElement[] = [];

    for (let i = 0; i < POOL; i += 1) {
      const el = document.createElement("div");
      el.className = "fire-spark";
      el.style.background = SPARK_BG;
      el.setAttribute("aria-hidden", "true");
      layer.appendChild(el);
      nodes.push(el);
      sparks.push({
        el,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        wobble: 0,
        wobbleSpeed: 0,
        size: 52,
        scale: 1,
        blur: 0,
        rotation: -7,
        spin: 0,
        life: 0,
        maxLife: 1,
        peak: 0.6,
        active: false,
      });
    }

    let raf = 0;
    let last = performance.now();
    let width = 0;
    let height = 0;

    const measure = () => {
      const box = layer.getBoundingClientRect();
      width = box.width;
      height = box.height;
    };

    const seed = () => {
      measure();
      for (let i = 0; i < BASE_ACTIVE; i += 1) {
        resetSpark(sparks[i], width, height, intensityRef.current, false);
        sparks[i].life = Math.random() * sparks[i].maxLife * 0.7;
        paint(sparks[i]);
      }
    };

    seed();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const intensity = intensityRef.current;
      const target = Math.round(BASE_ACTIVE + intensity * MAX_EXTRA);

      let activeCount = 0;
      for (const spark of sparks) {
        if (!spark.active) continue;
        activeCount += 1;
        spark.life += dt;
        spark.wobble += spark.wobbleSpeed * dt;
        spark.x += (spark.vx + Math.sin(spark.wobble) * 22) * dt;
        spark.y += spark.vy * dt;
        spark.rotation += spark.spin * dt;
        spark.scale *= 1 - dt * 0.04;

        if (spark.life >= spark.maxLife || spark.y < -40) {
          spark.active = false;
          spark.el.style.opacity = "0";
          activeCount -= 1;
          continue;
        }
        paint(spark);
      }

      if (activeCount < target) {
        const spark = sparks.find((item) => !item.active);
        if (spark) {
          resetSpark(spark, width, height, intensity, true);
          paint(spark);
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      for (const el of nodes) el.remove();
    };
  }, [intensityRef]);

  return (
    <div
      ref={layerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[9] overflow-hidden"
    />
  );
}
