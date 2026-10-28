"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import species from "@/data/species-inflammability.json";
import { Quote } from "@/components/Quote";
import { OTBN_COLORS } from "@/lib/otbnColors";
import { withBasePath } from "@/lib/paths";

type Level = "bajo" | "medio" | "alto";
type Origin = "nativa" | "exotica";
type Kind = "arbol" | "planta";

/** Misma paleta que las categorías OTBN del mapa (I / II / III). */
const LEVELS: Record<Level, { label: string; color: string; ink: string }> = {
  alto: { label: "Alto", color: OTBN_COLORS[1], ink: "#f3efe8" },
  medio: { label: "Medio", color: OTBN_COLORS[2], ink: "#1A1A1A" },
  bajo: { label: "Bajo", color: OTBN_COLORS[3], ink: "#f3efe8" },
};

const LEVEL_ORDER: Level[] = ["alto", "medio", "bajo"];

const CRITICAL_CONDITIONS = [
  {
    title: "Temperatura (>30 °C)",
    body: "Favorece el calentamiento y secado de hojas, ramas y pastizales.",
  },
  {
    title: "Humedad relativa (<30%)",
    body: "El aire seco hace que la vegetación pierda humedad y se encienda con mayor facilidad.",
  },
  {
    title: "Viento (>30 km/h)",
    body: "Acelera el avance del fuego y puede transportar brasas que generan nuevos focos.",
  },
] as const;

const CLIMATE_BULLETS = [
  "Clima más seco y cálido: en gran parte de la región las precipitaciones disminuyeron más del 20% y la temperatura media anual aumentó entre 0,2 y 0,7 °C.",
  "Más olas de calor: aumentan su frecuencia, duración y cantidad de días, especialmente en la cordillera de Neuquén y Río Negro.",
  "Vientos extremos: aunque los promedios cambian poco, en febrero se registran aumentos de más del 10–15% en los vientos máximos de amplias zonas cordilleranas.",
] as const;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function kindLabel(kind: Kind, origin: Origin) {
  if (kind === "planta") {
    return origin === "exotica" ? "Planta exótica" : "Planta nativa";
  }
  return origin === "exotica" ? "Árbol exótico" : "Árbol nativo";
}

export function InflammabilitySection() {
  const pinRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackX, setTrackX] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const pin = pinRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!pin || !viewport || !track) return;

    const shiftOf = () =>
      Math.max(0, track.scrollWidth - viewport.clientWidth);

    const measure = () => {
      pin.style.height = `${window.innerHeight + shiftOf()}px`;
    };

    const update = () => {
      const shift = shiftOf();
      const scrolled = clamp(-pin.getBoundingClientRect().top, 0, shift);
      setTrackX(-scrolled);
      setProgress(shift > 0 ? scrolled / shift : 1);
    };

    measure();
    update();

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      update();
    };

    const ro = new ResizeObserver(onResize);
    ro.observe(track);
    ro.observe(viewport);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section
      id="inflamabilidad"
      className="relative scroll-mt-8 bg-[#2B2B2B] text-[#f3efe8]"
    >
      <div className="mx-auto max-w-[800px] px-5 pt-20 pb-12 md:px-8 md:pt-28">
        <h2 className="type-h3">Factores de propagación</h2>

        <h3 className="mt-10 font-sans text-xl font-bold md:text-2xl">
          Cambios climáticos
        </h3>
        <p className="mt-4 text-base leading-relaxed text-[#f3efe8]/90 md:text-lg">
          El cambio climático inducido por la actividad humana está modificando
          las condiciones de fondo en la Patagonia: temperaturas más altas,
          menos precipitaciones en amplias zonas y mayor frecuencia de eventos
          extremos. Ese contexto favorece períodos más prolongados de sequedad y
          aumenta la disponibilidad de vegetación capaz de arder.
        </p>
        <ul className="mt-6 list-disc space-y-3 pl-5 text-base leading-relaxed text-[#f3efe8]/90 md:text-lg">
          {CLIMATE_BULLETS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <Quote
          className="mt-10"
          quote="“La desesperación de brigadistas, de bomberos, llorando porque venían trabajando con algo que estaban a punto de contener. Empezó a soplar con tanta fuerza. La pavesa que vuela y está quemando inicia un incendio más grande. Intentás frenarlo pero de repente te pasó por arriba”"
          name="Rubén Oliva"
          role="jefe de la Federación de Bomberos Voluntarios en Chubut"
        />

        <h3 className="mt-14 font-sans text-xl font-bold md:text-2xl">
          Las tres condiciones críticas
        </h3>
        <p className="mt-4 text-base leading-relaxed text-[#f3efe8]/90 md:text-lg">
          Sobre ese contexto general pueden darse combinaciones meteorológicas
          especialmente peligrosas. La llamada regla del 30/30/30 es un
          indicador empírico utilizado en el combate de incendios forestales:
          señala condiciones favorables a una propagación rápida cuando
          coinciden más de 30 °C de temperatura, menos del 30% de humedad
          relativa y vientos o rachas superiores a 30 km/h.
        </p>
        <ul className="mt-6 space-y-4">
          {CRITICAL_CONDITIONS.map((item) => (
            <li key={item.title}>
              <p className="font-sans text-base font-bold md:text-lg">
                {item.title}
              </p>
              <p className="mt-1 text-base leading-relaxed text-[#f3efe8]/85 md:text-lg">
                {item.body}
              </p>
            </li>
          ))}
        </ul>

        <Quote
          className="mt-10"
          quote="“Tuvimos la temporada invernal que no llovió nada. Esto se suma a un estrés hídrico importante de varios años”"
          name="Abel Nievas"
          role="secretario de Bosques de Chubut"
        />

        <h3 className="mt-14 font-sans text-xl font-bold md:text-2xl">
          La vegetación nativa y exótica
        </h3>
        <div className="mt-4 space-y-5 text-base leading-relaxed text-[#f3efe8]/90 md:text-lg">
          <p>
            En el bosque andino patagónico conviven especies nativas con
            plantaciones y ejemplares exóticos introducidos, y esa mezcla
            modifica la forma en que el fuego puede avanzar. Los árboles nativos
            no responden todos igual: algunos toleran mejor incendios de baja
            intensidad, otros son muy sensibles y dependen de semillas para
            recuperarse. Las coníferas exóticas, en cambio, suelen aportar
            abundante follaje fino, resinas y una estructura de copa que puede
            aumentar la continuidad del combustible cuando forman masas densas.
            Por eso, el riesgo no depende solo de si un árbol es nativo o
            exótico, sino también de su especie, edad, estado de humedad,
            disposición en el bosque y de cuánto material vegetal se acumula
            alrededor.
          </p>
          <p>
            Ante condiciones comparables, ¿qué árboles tienden a ser más
            vulnerables y cuáles ofrecen mayor resistencia?
          </p>
        </div>
      </div>

      <div ref={pinRef} className="relative" style={{ height: "100vh" }}>
        <div className="sticky top-0 flex h-dvh flex-col">
          <div
            ref={viewportRef}
            className="relative mx-auto flex h-full w-full max-w-[1200px] flex-col overflow-hidden"
          >
            <figure className="shrink-0 px-5 pt-5 pb-4 md:px-8 md:pt-6 md:pb-5">
              <div className="mx-auto w-full max-w-[800px]">
                <figcaption className="mb-3 text-center text-sm font-semibold tracking-wide text-[#f3efe8] md:text-base">
                  Nivel de vulnerabilidad frente al fuego
                </figcaption>
                <div className="mx-auto flex w-[70%] items-center gap-3 md:gap-4">
                  <span className="shrink-0 text-base font-medium md:text-lg">
                    Alto
                  </span>
                  <div
                    className="flex h-[10px] flex-1 gap-1 md:h-[14px]"
                    role="img"
                    aria-label="Escala de vulnerabilidad frente al fuego"
                  >
                    {LEVEL_ORDER.map((level) => (
                      <div
                        key={level}
                        className="h-full flex-1"
                        style={{ background: LEVELS[level].color }}
                      />
                    ))}
                  </div>
                  <span className="shrink-0 text-base font-medium md:text-lg">
                    Bajo
                  </span>
                </div>
              </div>
            </figure>

            <div className="relative min-h-0 flex-1">
              <div
                ref={trackRef}
                className="absolute top-0 left-0 flex h-full w-max items-start gap-4 px-5 pt-2 pb-14 md:gap-5 md:px-8 md:pt-3 md:pb-16"
                style={{
                  transform: `translate3d(${trackX}px, 0, 0)`,
                  willChange: "transform",
                }}
              >
                {species.map((sp) => {
                  const level = sp.level as Level;
                  const tone = LEVELS[level];
                  const origin = sp.origin as Origin;
                  const kind = sp.kind as Kind;

                  return (
                    <article
                      key={sp.id}
                      className="flex h-[min(560px,calc(100dvh-11rem))] w-[min(78vw,280px)] shrink-0 flex-col overflow-hidden bg-[#121212]"
                    >
                      <div
                        className="shrink-0 px-3 py-2 text-center text-xs font-bold tracking-[0.22em] uppercase"
                        style={{ background: tone.color, color: tone.ink }}
                      >
                        {tone.label}
                      </div>

                      <div className="relative h-[280px] w-full shrink-0">
                        <Image
                          src={withBasePath(sp.image)}
                          alt={`${sp.commonName} (${sp.scientificName})`}
                          fill
                          sizes="280px"
                          className="object-contain object-bottom p-2"
                        />
                      </div>

                      <div className="min-h-0 flex-1 overflow-hidden px-[25px] pt-0 pb-[25px]">
                        <p className="text-[10px] font-normal tracking-[0.16em] text-[#f3efe8] uppercase">
                          {kindLabel(kind, origin)}
                        </p>
                        <h3 className="mt-1.5 font-[family-name:var(--font-display)] text-xl leading-none font-black tracking-wide uppercase">
                          {sp.commonName}
                        </h3>
                        <p className="mt-1 text-xs italic text-[#f3efe8]/70">
                          {sp.scientificName}
                        </p>
                        <p className="mt-2 text-xs leading-[1.3] text-[#f3efe8]/85 md:text-sm">
                          {sp.note}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-3 px-5 pb-5 md:px-8">
                <div className="h-px flex-1 bg-[#f3efe8]/20" aria-hidden>
                  <div
                    className="h-px bg-[#f3efe8]/80"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
                <p className="text-[11px] tracking-wide text-[#f3efe8]/70">
                  {Math.min(
                    species.length,
                    Math.max(1, Math.round(progress * (species.length - 1)) + 1),
                  )}{" "}
                  / {species.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
