"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { FireSparks } from "@/components/scrolly/FireSparks";
import { withBasePath } from "@/lib/paths";

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function FireHeader() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const intensityRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    const copy = copyRef.current;
    if (!section || !frame || !copy) return;

    let raf = 0;

    const update = () => {
      const total = section.offsetHeight - window.innerHeight;
      const progress = clamp(total > 0 ? -section.getBoundingClientRect().top / total : 0);
      intensityRef.current = progress;

      frame.style.setProperty("--fire-shift", `${lerp(22, 0, progress)}%`);
      frame.style.setProperty("--fire-opacity", String(lerp(0.7, 1, progress)));
      frame.style.setProperty("--fire-glow", String(lerp(0.4, 0.7, progress)));
      frame.style.setProperty("--mask-from", `${lerp(58, 6, progress)}%`);
      frame.style.setProperty("--mask-to", `${lerp(88, 32, progress)}%`);
      copy.style.opacity = String(lerp(1, 0.82, progress));
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
    <header ref={sectionRef} className="relative h-[195vh] text-[#f3efe8]">
      <div
        ref={frameRef}
        className="sticky top-0 isolate h-dvh overflow-hidden bg-[#220303]"
        style={
          {
            "--fire-shift": "22%",
            "--fire-opacity": "0.7",
            "--fire-glow": "0.4",
            "--mask-from": "58%",
            "--mask-to": "88%",
          } as CSSProperties
        }
      >
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_110%,rgba(180,32,12,0.45),transparent_58%),radial-gradient(120%_80%_at_50%_-10%,#070403,transparent_52%)]"
        />

        <div
          aria-hidden
          className="absolute inset-0 origin-bottom will-change-transform"
          style={{
            opacity: "var(--fire-opacity)",
            transform: "translate3d(0, var(--fire-shift), 0)",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, transparent var(--mask-from), #000 var(--mask-to), #000 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, transparent var(--mask-from), #000 var(--mask-to), #000 100%)",
          }}
        >
          <Image
            src={withBasePath("/images/hero-fire.jpg")}
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover object-[center_62%]"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black to-transparent" />
        </div>

        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[45%] bg-[radial-gradient(70%_80%_at_50%_100%,rgba(244,107,21,0.55),rgba(148,15,17,0.18)_42%,transparent_72%)]"
          style={{ opacity: "var(--fire-glow)" }}
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_40px_rgba(8,3,2,0.72)]"
        />

        <FireSparks intensityRef={intensityRef} />

        <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
          <span
            className="fire-spark-static opacity-80"
            style={{
              left: "8%",
              top: "18%",
              transform: "matrix(-0.99, -0.12, 0.12, -0.99, 0, 0) scale(0.7)",
              filter: "blur(1px)",
            }}
          />
          <span
            className="fire-spark-static opacity-50"
            style={{
              left: "78%",
              top: "12%",
              width: "86px",
              height: "86px",
              transform: "matrix(-0.99, -0.12, 0.12, -0.99, 0, 0) scale(1.35)",
              filter: "blur(8px)",
            }}
          />
          <span
            className="fire-spark-static opacity-70"
            style={{
              left: "88%",
              top: "42%",
              transform: "matrix(-0.99, -0.12, 0.12, -0.99, 0, 0) scale(0.55)",
            }}
          />
          <span
            className="fire-spark-static opacity-45"
            style={{
              left: "16%",
              top: "62%",
              width: "70px",
              height: "70px",
              transform: "matrix(-0.99, -0.12, 0.12, -0.99, 0, 0)",
              filter: "blur(6px)",
            }}
          />
          <span
            className="fire-spark-static opacity-65"
            style={{
              left: "62%",
              top: "28%",
              transform: "matrix(-0.99, -0.12, 0.12, -0.99, 0, 0) scale(0.42)",
            }}
          />
        </div>

        <div className="relative z-20 mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-6 text-center md:px-8">
          <div ref={copyRef} className="will-change-[opacity]">
            <p className="text-xs font-semibold tracking-[0.28em] uppercase md:text-sm">
              Bosques Patagónicos
            </p>
            <h1 className="mt-5 font-[family-name:var(--font-sans)] text-[2.35rem] font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              El Camino del fuego
            </h1>
            <p className="mx-auto mt-8 max-w-[38rem] text-sm leading-relaxed text-white/90 md:text-lg">
              No es un capricho de la naturaleza: sequía extrema, vientos
              traicioneros y años sin la prevención adecuada. Las voces de
              brigadistas, bomberos y vecinos relatan las fallas estructurales que
              hicieron del riesgo una catástrofe. Esta nota cruza cifras y relatos
              de quienes la enfrentaron y sostienen, que si nada cambia, volverá a
              suceder.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
