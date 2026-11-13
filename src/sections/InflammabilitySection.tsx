"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import species from "@/data/species-inflammability.json";
import { SummerClimateCharts } from "@/components/charts/SummerClimateCharts";
import { Quote } from "@/components/Quote";
import { TextLink } from "@/components/TextLink";
import { OTBN_COLORS } from "@/lib/otbnColors";
import { withBasePath } from "@/lib/paths";

type Level = "bajo" | "medio" | "alto";
type Origin = "nativa" | "exotica";
type Kind = "arbol" | "planta";

/** Misma paleta que las categorías OTBN del mapa (I / II / III). */
const LEVELS: Record<Level, { label: string; color: string; ink: string }> = {
  alto: { label: "Alta", color: OTBN_COLORS[1], ink: "var(--foreground)" },
  medio: { label: "Media", color: OTBN_COLORS[2], ink: "var(--ink)" },
  bajo: { label: "Baja", color: OTBN_COLORS[3], ink: "var(--foreground)" },
};

const LEVEL_ORDER: Level[] = ["alto", "medio", "bajo"];

const CRITICAL_CONDITIONS = [
  {
    title: "Temperatura (+30°C)",
    body: "Favorece el calentamiento, y el secado de hojas, ramas y pastizales.",
  },
  {
    title: "Humedad relativa (-30%)",
    body: "El aire seco hace que la vegetación pierda humedad y se encienda con mayor facilidad.",
  },
  {
    title: "Viento (+30 km/h)",
    body: "Acelera el avance del fuego y puede transportar brasas que generan nuevos focos.",
  },
] as const;

const CLIMATE_BULLETS = [
  {
    lead: "Clima más seco y cálido:",
    body: "en gran parte de la región, las precipitaciones disminuyeron más del 20%, y la temperatura media anual aumentó entre 0,2 y 0,7 °C.",
  },
  {
    lead: "Más olas de calor:",
    body: "aumentan su frecuencia, duración y cantidad de días, especialmente en la Cordillera a la altura de Neuquén y de Río Negro.",
  },
  {
    lead: "Vientos extremos:",
    body: "aunque los promedios cambian poco, en febrero se registran aumentos de más del 10–15% en los vientos máximos de amplias zonas cordilleranas.",
  },
] as const;

const WUI_STUDY =
  "https://silvis.forest.wisc.edu/wp-content/uploads/2018/12/Godoy_etal_IJWF_ArgentinaWUI_2019.pdf";

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

const CARD_MAX = 300;

/** Tope 300px; en móvil se achica para ~1 card + peek. */
function cardWidthFor(viewport: number) {
  const pad = viewport >= 768 ? 32 : 20;
  const available = Math.max(0, viewport - pad * 2);
  if (viewport < 640) {
    return Math.min(CARD_MAX, Math.max(160, available / 1.15));
  }
  return Math.min(CARD_MAX, available);
}

function kindLabel(kind: Kind, origin: Origin) {
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
  const [cardWidth, setCardWidth] = useState(280);
  const [levelFilter, setLevelFilter] = useState<Level | null>(null);

  const visibleSpecies = useMemo(
    () =>
      levelFilter
        ? species.filter((sp) => sp.level === levelFilter)
        : species,
    [levelFilter],
  );

  useEffect(() => {
    const pin = pinRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!pin || !viewport || !track) return;

    const shiftOf = () =>
      Math.max(0, track.scrollWidth - viewport.clientWidth);

    const measure = () => {
      const width = viewport.clientWidth;
      if (width > 0) setCardWidth(cardWidthFor(width));
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

    // Al filtrar, volver al inicio del recorrido horizontal.
    setTrackX(0);
    setProgress(0);
    const pinDoc = pin.getBoundingClientRect().top + window.scrollY;
    if (Math.abs(window.scrollY - pinDoc) < pin.offsetHeight) {
      window.scrollTo({ top: pinDoc });
    }

    measure();
    requestAnimationFrame(() => {
      measure();
      update();
    });

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      requestAnimationFrame(() => {
        measure();
        update();
      });
    };

    const ro = new ResizeObserver(onResize);
    ro.observe(track);
    ro.observe(viewport);
    if (stickyRef.current) ro.observe(stickyRef.current);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [visibleSpecies]);

  const toggleLevelFilter = (level: Level) => {
    setLevelFilter((prev) => (prev === level ? null : level));
  };

  return (
    <section
      id="inflamabilidad"
      className="relative scroll-mt-8 bg-background text-foreground"
    >
      <div className="mx-auto max-w-[800px] px-5 pt-12 md:px-8 md:pt-12">
        <h3 className="type-h3 is-flush">Factores de propagación</h3>
        <h4 className="type-h4">Cambios climáticos</h4>
        <div className="type-stack mt-4">
          <p className="type-body">
            <TextLink href="https://cenpat.conicet.gov.ar/incendios-en-la-patagonia-el-cambio-climatico-detras-del-fuego-de-2026/">
              El cambio climático inducido por la actividad humana
            </TextLink>{" "}
            está modificando las condiciones de fondo en la Patagonia:
            temperaturas más altas, menos precipitaciones en amplias zonas y
            mayor frecuencia de eventos extremos. Ese contexto favorece períodos
            más prolongados de sequedad y aumenta la disponibilidad de
            vegetación susceptible de arder.
          </p>
          <p className="type-body">
            El fenómeno de El Niño en desarrollo durante 2026 anticipa un final
            de verano y un comienzo del otoño riesgosos. Un{" "}
            <TextLink href="https://drive.google.com/file/d/1IfmASfcYaRVuqZK8macseOEunbro5KZT/view">
              informe reciente
            </TextLink>{" "}
            del Conicet y la Fundación Bariloche advierte que un invierno y una
            primavera húmedos genera un exceso de biomasa y continuidad de
            combustible fino que, al secarse en un verano cálido y seco, desata
            las temporadas de incendios más severas (acumulación seguida de
            desecación). A esta situación se exponen las reservas naturales
            patagónicas durante 2027.
          </p>
        </div>
        <ul className="mt-6 list-disc space-y-3 pl-5">
          {CLIMATE_BULLETS.map((item) => (
            <li key={item.lead} className="type-body">
              <b>{item.lead}</b> {item.body}
            </li>
          ))}
        </ul>

        {/* <Quote
          quote="“La desesperación de brigadistas, de bomberos, llorando porque venían trabajando con algo que estaban a punto de contener. Empezó a soplar con tanta fuerza. La pavesa que vuela y está quemando inicia un incendio más grande. Intentás frenarlo pero de repente te pasó por arriba”"
          name="Rubén Oliva"
          role="jefe de la Federación de Bomberos Voluntarios en Chubut"
        /> */}

        <p className="type-body mt-12">
          Sobre ese contexto general pueden darse combinaciones meteorológicas
          especialmente peligrosas. La llamada{" "}
          <TextLink href="https://www.publico.es/sociedad/m-ambiente/regla-30-30-30-incendios-forestales.html">
            regla del 30/30/30
          </TextLink>{" "}
          es un indicador empírico utilizado en el combate de incendios
          forestales: señala condiciones favorables a una propagación rápida
          cuando coinciden más de 30 °C de temperatura, menos del 30% de humedad
          relativa, y ráfagas de vientos superiores a 30 km/h.
        </p>
        <ul className="mt-6 list-disc space-y-3 pl-5">
          {CRITICAL_CONDITIONS.map((item) => (
            <li key={item.title}>
              <p className="type-body font-bold">{item.title}</p>
              <p className="type-body mt-1">{item.body}</p>
            </li>
          ))}
        </ul>

        <h4 className="type-h4 !mt-[4rem] !mb-[3rem]">
          Indicadores meteorológicos de la estación Aero Esquel en
          verano.
        </h4>
      </div>

      <div className="mx-auto mt-4 w-full max-w-[1200px] px-5 md:px-8">
        <SummerClimateCharts />
      </div>

      <div className="mx-auto max-w-[800px] px-5 md:px-8">
        {/* <Quote
          quote="“Tuvimos la temporada invernal que no llovió nada. Esto se suma a un estrés hídrico importante de varios años”."
          name="Abel Nievas"
          role="secretario de Bosques de Chubut"
        /> */}

        <h4 className="type-h4">Vegetación arbórea nativa y exótica</h4>
        <p className="type-body mt-4">
          En el bosque andino patagónico conviven especies nativas con
          plantaciones y ejemplares exóticos introducidos, y esa mezcla modifica
          la forma en la que el fuego puede avanzar. Los árboles nativos no
          responden todos igual: algunos toleran mejor los incendios de baja
          intensidad, otros son muy sensibles y dependen de semillas para
          recuperarse. Las coníferas exóticas, en cambio, suelen aportar
          abundante follaje fino, resinas y una estructura de copa que puede
          aumentar la continuidad del combustible cuando forman masas densas. Por
          eso, el riesgo no depende sólo de si un árbol es nativo o exótico,
          sino también de su especie, edad, estado de humedad, disposición en el
          bosque y de cuánto material vegetal se acumula alrededor.
        </p>
      </div>

      <div ref={pinRef} className="relative" style={{ height: "70vh" }}>
        <div
          ref={stickyRef}
          className="sticky top-3 z-20 flex flex-col bg-background"
        >
          <div
            ref={viewportRef}
            className="relative mx-auto flex w-full max-w-[1200px] flex-col overflow-hidden"
          >
            <figure className="mb-3 shrink-0 px-5 pt-4 pb-2 md:px-8 md:pt-5">
              <div className="mx-auto w-full max-w-[800px]">
                <figcaption className="mb-3 mt-[50px]  text-center text-sm font-semibold tracking-wide text-foreground">
                  Vulnerabilidad de las especies al fuego
                </figcaption>
                <div className="mx-auto mt-3 flex w-[70%] items-center gap-3 md:gap-4">
                  <span className="shrink-0 text-sm font-medium">
                    Alta
                  </span>
                  <div
                    className="flex h-2 flex-1 gap-1"
                    role="group"
                    aria-label="Filtrar por vulnerabilidad frente al fuego"
                  >
                    {LEVEL_ORDER.map((level) => {
                      const active = levelFilter === level;
                      const dimmed = levelFilter !== null && !active;
                      return (
                        <button
                          key={level}
                          type="button"
                          aria-pressed={active}
                          aria-label={
                            active
                              ? `Quitar filtro ${LEVELS[level].label}`
                              : `Filtrar riesgo ${LEVELS[level].label}`
                          }
                          title={
                            active
                              ? `Mostrar todas (${LEVELS[level].label})`
                              : `Solo ${LEVELS[level].label}`
                          }
                          onClick={() => toggleLevelFilter(level)}
                          className={`h-full flex-1 cursor-pointer transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                            dimmed ? "opacity-30" : "opacity-100"
                          }`}
                          style={{ background: LEVELS[level].color }}
                        />
                      );
                    })}
                  </div>
                  <span className="shrink-0 text-sm font-medium">
                    Baja
                  </span>
                </div>
              </div>
            </figure>

            <div className="relative">
              <div
                ref={trackRef}
                className="flex w-max items-stretch gap-4 px-5 md:gap-5 md:px-8"
                style={{
                  transform: `translate3d(${trackX}px, 0, 0)`,
                  willChange: "transform",
                }}
              >
                {visibleSpecies.map((sp) => {
                  const level = sp.level as Level;
                  const tone = LEVELS[level];
                  const origin = sp.origin as Origin;
                  const kind = sp.kind as Kind;

                  return (
                    <article
                      key={sp.id}
                      className="flex shrink-0 flex-col bg-panel"
                      style={{ width: cardWidth }}
                    >
                      <div
                        className="h-2 w-full shrink-0"
                        style={{ background: tone.color }}
                        aria-hidden
                      />

                      <div className="relative h-[250px] w-full shrink-0">
                        <Image
                          src={withBasePath(sp.image)}
                          alt={`${sp.commonName} (${sp.scientificName})`}
                          fill
                          sizes={`${Math.round(cardWidth)}px`}
                          className="object-contain object-bottom px-2 py-3 md:py-4"
                        />
                      </div>

                      <div className="px-4 pt-0 pb-4 md:px-[25px] md:pb-5">
                        <p className="text-[10px] font-normal tracking-[0.16em] text-foreground uppercase">
                          {kindLabel(kind, origin)}
                        </p>
                        <h3 className="mt-1.5 font-[family-name:var(--font-display)] text-[18px] leading-none font-black tracking-wide uppercase">
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

          </div>

          <div className="mx-auto w-full max-w-[800px] px-5 mt-12 pt-2 md:px-8">
              <h3 className="type-h3 is-flush">Condiciones estructurales</h3>
              <div className="type-stack mt-3">
                <p className="type-body">
                  El riesgo no depende sólo de cómo empieza un incendio ni de las
                  condiciones climáticas que lo alimentan. También influye cómo se
                  ocupa y se gestiona el territorio. En las últimas décadas
                  crecieron las viviendas y los asentamientos en zonas de interfase
                  entre bosque y áreas habitadas, muchas veces sin planificación
                  suficiente, con vegetación y otros combustibles muy próximos a
                  las casas, y, como se dijo antes, escasas medidas de prevención.
                </p>
                <p className="type-body">
                  A eso se suman desigualdades en la capacidad de prepararse y
                  recuperarse; falta de mantenimiento del entorno; turismo
                  creciente poco o nada concientizado y una educación ambiental
                  todavía insuficiente.
                </p>
              </div>
            </div>
          </div>
        </div>

      <div className="mx-auto max-w-[800px] px-5 md:px-8">
        <Quote
          quote="“El problema principal para mí está relacionado con la gestión territorial. En los últimos 25 años la Comarca creció de manera exponencial”."
          name="Hernán Andrade"
          role="ex vecino de Las Golondrinas, Comarca Andina - Chubut"
        />
        <div className="type-stack">
          <p className="type-body">
            El último censo del Indec registró en el departamento de Cushamen,
            donde se encuentra la localidad de Las Golondrinas, un crecimiento
            relativo del 34% en los últimos 12 años. Para 2010 la cantidad de
            habitantes era de 20.919 mientras que para 2022 era de 28.209.
          </p>
          <p className="type-body">
            En las últimas décadas, el crecimiento residencial avanzó sobre
            áreas de vegetación natural.{" "}
            <TextLink href={WUI_STUDY}>Un estudio</TextLink> de científicos del
            Conicet y de otras instituciones publicado en 2019 sobre la Comarca
            Andina, que incluye El Bolsón, Lago Puelo, El Hoyo y Epuyén, reveló
            que, entre 1981-82 y 2016, la superficie de interfase urbano-forestal
            creció el 76%: pasó de unas 12.100 a más de 21.300 hectáreas. Allí
            las viviendas se mezclan directamente con el bosque, el matorral o
            la estepa, o quedan muy próximas a grandes superficies naturales.
            Para 2016, esas zonas concentraban el 96,6% de las construcciones
            del área analizada. El crecimiento fue especialmente marcado
            alrededor de Mallín Ahogado, El Foyel, y sectores próximos a El
            Bolsón y El Hoyo.
          </p>
        </div>
      </div>
    </section>
  );
}
