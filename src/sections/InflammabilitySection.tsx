"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import species from "@/data/species-inflammability.json";
import { SummerClimateCharts } from "@/components/charts/SummerClimateCharts";
import { Quote } from "@/components/Quote";
import { OTBN_COLORS } from "@/lib/otbnColors";
import { withBasePath } from "@/lib/paths";

type Level = "bajo" | "medio" | "alto";
type Origin = "nativa" | "exotica";
type Kind = "arbol" | "planta";

/** Misma paleta que las categorías OTBN del mapa (I / II / III). */
const LEVELS: Record<Level, { label: string; color: string; ink: string }> = {
  alto: { label: "Alto", color: OTBN_COLORS[1], ink: "var(--foreground)" },
  medio: { label: "Medio", color: OTBN_COLORS[2], ink: "var(--ink)" },
  bajo: { label: "Bajo", color: OTBN_COLORS[3], ink: "var(--foreground)" },
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

/** Peek debajo del carrusel (mismo patrón que FireStates → contexto). */
const AFTER_FIRE_LEDE =
  "Cuando el último foco se apaga y la atención pública se desplaza, comienza una etapa mucho más larga: la recuperación. Antes, sin embargo, quedan las llamadas “guardias de ceniza”. Durante días, los brigadistas recorren los sectores quemados en busca de troncos calientes, brasas enterradas y focos capaces de reactivarse con un cambio de viento.";

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
  const stickyRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackX, setTrackX] = useState(0);
  const [progress, setProgress] = useState(0);
  const [hasOverflow, setHasOverflow] = useState(false);

  const activeIndex = Math.round(progress * Math.max(species.length - 1, 1));

  useEffect(() => {
    const pin = pinRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!pin || !viewport || !track) return;

    const shiftOf = () =>
      Math.max(0, track.scrollWidth - viewport.clientWidth);

    const measure = () => {
      const shift = shiftOf();
      const stickyH = stickyRef.current?.offsetHeight ?? 0;
      pin.style.height = `${stickyH + shift}px`;
      pin.style.marginBottom = "0px";
    };

    const update = () => {
      const shift = shiftOf();
      const scrolled = clamp(-pin.getBoundingClientRect().top, 0, shift);
      const raw = shift > 0 ? scrolled / shift : 1;
      setTrackX(-scrolled);
      setHasOverflow(shift > 0);
      setProgress(raw);
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

  const goTo = (index: number) => {
    const pin = pinRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!pin || !viewport || !track) return;
    const shift = Math.max(0, track.scrollWidth - viewport.clientWidth);
    if (shift <= 0 || species.length <= 1) return;
    const target = (clamp(index, 0, species.length - 1) / (species.length - 1)) * shift;
    const pinDoc = pin.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: pinDoc + target, behavior: "smooth" });
  };

  return (
    <section
      id="inflamabilidad"
      className="relative scroll-mt-8 bg-background text-foreground"
    >
      <div className="mx-auto max-w-[800px] px-5 pt-12 pb-12 md:px-8 md:pt-12">
      <h3 className="font-sans text-xl font-bold md:text-2xl">
      Factores de propagación</h3>

        <h3 className="mt-10 font-sans text-xl font-bold md:text-2xl">
          Cambios climáticos
        </h3>
        <p className="mt-4 text-base leading-relaxed text-foreground/90 md:text-lg">
          El cambio climático inducido por la actividad humana está modificando
          las condiciones de fondo en la Patagonia: temperaturas más altas,
          menos precipitaciones en amplias zonas y mayor frecuencia de eventos
          extremos. Ese contexto favorece períodos más prolongados de sequedad y
          aumenta la disponibilidad de vegetación capaz de arder.
        </p>
        <ul className="mt-6 list-disc space-y-3 pl-5 text-base leading-relaxed text-foreground/90 md:text-lg">
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
        <p className="mt-4 text-base leading-relaxed text-foreground/90 md:text-lg">
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
              <p className="mt-1 text-base leading-relaxed text-foreground/85 md:text-lg">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
        <SummerClimateCharts />

        <p className="mt-8 text-base leading-relaxed text-foreground/90 md:text-lg">
        “Tuvimos la temporada invernal que no llovió nada. Esto se suma a un estrés hídrico importante de varios años”. Abel Nievas, secretario de Bosques de Chubut        </p>


        <h3 className="mt-14 font-sans text-xl font-bold md:text-2xl">
          La vegetación nativa y exótica
        </h3>
        <div className="mt-4 space-y-5 text-base leading-relaxed text-foreground/90 md:text-lg">
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

      <div ref={pinRef} className="relative" style={{ height: "70vh" }}>
        <div
          ref={stickyRef}
          className="sticky top-3 z-20 flex flex-col bg-background pb-2 md:top-[8vh]"
        >
          <div
            ref={viewportRef}
            className="relative mx-auto flex w-full max-w-[1200px] flex-col overflow-hidden"
          >
            <figure className="mb-3 shrink-0 px-5 pt-4 pb-2 md:px-8 md:pt-5">
              <div className="mx-auto w-full max-w-[800px]">
                <figcaption className="mb-3 text-center text-sm font-semibold tracking-wide text-foreground md:text-base">
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

            <div className="relative h-[min(360px,calc(100svh-30rem))] md:h-[min(500px,calc(100svh-26rem))]">
              <div
                ref={trackRef}
                className="absolute inset-0 flex w-max items-stretch gap-4 px-5 md:gap-5 md:px-8"
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
                      className="flex h-full w-[min(78vw,280px)] shrink-0 flex-col bg-panel"
                    >
                      <div
                        className="shrink-0 px-3 py-2 text-center text-xs font-bold tracking-[0.22em] uppercase"
                        style={{ background: tone.color, color: tone.ink }}
                      >
                        {tone.label}
                      </div>

                      <div className="relative h-[min(160px,20vh)] w-full shrink-0 md:h-[min(250px,25vh)]">
                        <Image
                          src={withBasePath(sp.image)}
                          alt={`${sp.commonName} (${sp.scientificName})`}
                          fill
                          sizes="280px"
                          className="object-contain object-bottom px-2 py-4 md:py-8"
                        />
                      </div>

                      <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-0 pb-4 md:px-[25px] md:pb-[25px]">
                        <p className="text-[10px] font-normal tracking-[0.16em] text-foreground uppercase">
                          {kindLabel(kind, origin)}
                        </p>
                        <h3 className="mt-1.5 font-[family-name:var(--font-display)] text-lg leading-none font-black tracking-wide uppercase md:text-xl">
                          {sp.commonName}
                        </h3>
                        <p className="mt-1 text-xs italic text-foreground/70">
                          {sp.scientificName}
                        </p>
                        <p className="mt-2 text-xs leading-[1.3] text-foreground/85 md:text-sm">
                          {sp.note}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background from-0% via-background/80 via-[40%] to-transparent"
                style={{ opacity: hasOverflow ? clamp(progress / 0.05) : 0 }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background from-0% via-background/80 via-[40%] to-transparent"
                style={{ opacity: hasOverflow ? clamp((1 - progress) / 0.05) : 0 }}
              />
            </div>

            <div
              className="mt-3 flex shrink-0 items-center justify-center gap-1.5 px-5 pt-2 pb-3 md:px-8"
              role="tablist"
              aria-label="Especies"
            >
              {species.map((sp, i) => {
                const selected = i === activeIndex;
                return (
                  <button
                    key={sp.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-label={`${i + 1}. ${sp.commonName}`}
                    onClick={() => goTo(i)}
                    className={`h-2 w-2 rounded-full border border-accent transition-colors ${
                      selected ? "bg-accent" : "bg-transparent hover:bg-accent/40"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          <div className="mx-auto w-full max-w-[800px] px-5 pt-4 md:px-8 md:pt-6">
            <div className="border-t border-t-white/31 pb-4" />
            <h2 className="type-h3 mt-4 md:mt-6">Después del fuego</h2>
            <p className="mt-2 line-clamp-4 text-base leading-relaxed text-foreground/90 md:line-clamp-none md:text-2xl">
              {AFTER_FIRE_LEDE}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
