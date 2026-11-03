"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { withBasePath } from "@/lib/paths";

type AnatomyStep = {
  id: string;
  image: string;
  title: string;
  body: string;
  items: string[];
  /** Punto de la ilustración (0–1) y escala del encuadre. */
  focus: { x: number; y: number; scale: number };
};

const FIGURE_ASPECT = 2090 / 5242;

const STEPS: AnatomyStep[] = [
  {
    id: "campera",
    image: "/brigadista/campera-pantalon.png",
    title: "Campera y pantalón",
    body: "La indumentaria ignífuga es la primera barrera frente al calor y a las brasas.",
    items: [
      "Chaquetas ignífugas (Inforest)",
      "Pantalones ignífugos (Inforest/ZB)",
    ],
    focus: { x: 0.5, y: 0.5, scale: 1 },
  },
  {
    id: "botas",
    image: "/brigadista/botas.png",
    title: "Calzado",
    body: "Botas específicas para terreno irregular, calor residual y largas jornadas de combate.",
    items: ["Calzado para incendios forestales (El Resero)"],
    focus: { x: 0.48, y: 0.9, scale: 2.25 },
  },
  {
    id: "guantes",
    image: "/brigadista/guantes.png",
    title: "Guantes",
    body: "Protegen las manos al abrir líneas de defensa, manejar herramientas y retirar material caliente.",
    items: ["Guantes para trabajo forestal (Inforest)"],
    focus: { x: 0.5, y: 0.47, scale: 1.72 },
  },
  {
    id: "casco",
    image: "/brigadista/casco.png",
    title: "Casco y protección facial",
    body: "Protección de cabeza y ojos ante caída de ramas, humo y partículas en suspensión.",
    items: [
      "Casco rojo con antiparras (KPN SAFETY Modelo TYTAN MAX; también MSA Modelo V-Gard)",
      "Anteojos de seguridad (Libus — Modelo Fall Dual)",
    ],
    focus: { x: 0.5, y: 0.095, scale: 2.9 },
  },
  {
    id: "accesorios",
    image: "/brigadista/accesorios.png",
    title: "Accesorios y comunicación",
    body: "Hidratación, iluminación, botiquín y radio sostienen el operativo cuando el fuego se prolonga.",
    items: [
      "Mochilas para incendios forestales (ENMEN)",
      "Linterna (Energizer)",
      "Sistema de hidratación (Waterbag)",
      "Botiquín de primeros auxilios (manta térmica, tijera, pinza, máscara pocket, férula y kit con 9 elementos)",
      "Handys VHF (Motorola Modelo DEP 250)",
    ],
    focus: { x: 0.51, y: 0.34, scale: 2.15 },
  },
];

function focusTransform(focus: AnatomyStep["focus"]) {
  const tx = -(focus.x - 0.5) * focus.scale * 100;
  const ty = -(focus.y - 0.5) * focus.scale * 100;
  return `translate(-50%, -50%) translate(${tx}%, ${ty}%) scale(${focus.scale})`;
}

export function BrigadistaAnatomy() {
  const [stepId, setStepId] = useState(STEPS[0].id);
  const activeIndex = STEPS.findIndex((step) => step.id === stepId);
  const activeStep = STEPS[activeIndex] ?? STEPS[0];

  useEffect(() => {
    const syncFromScroll = () => {
      const mid = window.innerHeight * 0.45;
      let best = STEPS[0];
      let bestDist = Infinity;

      for (const step of STEPS) {
        const el = document.getElementById(`brigadista-panel-${step.id}`);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= mid && rect.bottom >= mid) {
          setStepId(step.id);
          return;
        }
        const center = rect.top + rect.height / 2;
        const dist = Math.abs(center - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = step;
        }
      }
      setStepId(best.id);
    };

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(syncFromScroll);
    };

    syncFromScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="relative mt-10">
      <div className="sticky top-0 z-10 h-svh overflow-hidden bg-background">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute top-1/2 left-1/2 h-svh will-change-transform transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none md:left-[calc(50%+10rem)]"
            style={{
              width: `calc(100svh * ${FIGURE_ASPECT})`,
              transform: focusTransform(activeStep.focus),
            }}
          >
            {STEPS.map((step, index) => {
              const active = step.id === activeStep.id;
              return (
                <div
                  key={step.id}
                  className="absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none"
                  style={{
                    opacity: active ? 1 : 0,
                    zIndex: active ? STEPS.length + 1 : index + 1,
                  }}
                  aria-hidden={!active}
                >
                  <Image
                    src={withBasePath(step.image)}
                    alt=""
                    fill
                    sizes="100vw"
                    className="object-cover object-center"
                    priority={index === 0}
                    loading={index === 0 ? undefined : "eager"}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1100px] items-center px-5 md:px-8">
          <div className="relative hidden w-[min(42%,380px)] shrink-0 md:block">
            {STEPS.map((step, index) => {
              const active = step.id === activeStep.id;
              return (
                <article
                  key={step.id}
                  className="absolute inset-x-0 top-1/2 -translate-y-1/2 border border-foreground/20 bg-panel/90 px-5 py-5 transition-all duration-500 md:px-6 md:py-6"
                  style={{
                    opacity: active ? 1 : 0,
                    transform: `translateY(calc(-50% + ${(index - activeIndex) * 12}px))`,
                    pointerEvents: active ? "auto" : "none",
                  }}
                  aria-hidden={!active}
                >
                  <p className="text-[11px] font-semibold tracking-[0.18em] text-accent uppercase">
                    {String(index + 1).padStart(2, "0")} /{" "}
                    {String(STEPS.length).padStart(2, "0")}
                  </p>
                  <h4 className="mt-3 font-sans text-xl font-bold md:text-2xl">
                    {step.title}
                  </h4>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/85 md:text-base">
                    {step.body}
                  </p>
                  <ul className="mt-4 space-y-2 text-sm leading-snug text-foreground/80">
                    {step.items.map((item) => (
                      <li key={item} className="border-l border-accent/70 pl-3">
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
            {/* Reserve height for absolute cards */}
            <div className="invisible border px-5 py-5 md:px-6 md:py-6" aria-hidden>
              <p className="text-[11px]">00 / 00</p>
              <h4 className="mt-3 text-xl md:text-2xl">{activeStep.title}</h4>
              <p className="mt-3 text-sm md:text-base">{activeStep.body}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {activeStep.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile card under figure */}
        <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 px-5 md:hidden">
          <article className="border border-foreground/20 bg-panel/92 px-4 py-4 backdrop-blur-sm">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-accent uppercase">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(STEPS.length).padStart(2, "0")}
            </p>
            <h4 className="mt-2 font-sans text-lg font-bold">{activeStep.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-foreground/85">
              {activeStep.body}
            </p>
          </article>
        </div>
      </div>

      <div className="pointer-events-none relative z-20 -mt-[100svh]">
        {STEPS.map((step) => (
          <article
            key={step.id}
            id={`brigadista-panel-${step.id}`}
            className="relative min-h-[110vh]"
            aria-current={step.id === activeStep.id ? "step" : undefined}
          />
        ))}
      </div>
    </div>
  );
}
