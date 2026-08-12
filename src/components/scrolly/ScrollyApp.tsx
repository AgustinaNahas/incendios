"use client";

import {
  BackgroundAtmosphere,
  useAtmosphereText,
} from "@/components/scrolly/BackgroundAtmosphere";
import {
  MobileChapterChips,
  TimelineRail,
} from "@/components/scrolly/TimelineRail";
import { AfterSection } from "@/sections/AfterSection";
import { FireSection } from "@/sections/FireSection";
import { BeforeSection } from "@/sections/BeforeSection";
import { OtbnSection } from "@/sections/OtbnSection";
import { GapsSection } from "@/sections/GapsSection";
import { useRiiData } from "@/lib/useRiiData";
import { useScrollChapters } from "@/lib/useScrollChapters";
import testimonies from "@/data/testimonies.json";
import { TreeSilhouette } from "@/components/scrolly/TreeSilhouette";

export function ScrollyApp() {
  const { activeChapter, scrollProgress } = useScrollChapters();
  const palette = useAtmosphereText(scrollProgress);
  const lightText = scrollProgress > 0.72;
  const data = useRiiData();

  return (
    <div
      className="relative min-h-screen"
      style={{ color: palette.text }}
    >
      <BackgroundAtmosphere progress={scrollProgress} />
      <TimelineRail
        active={activeChapter}
        progress={scrollProgress}
        lightText={lightText}
      />
      <MobileChapterChips active={activeChapter} lightText={lightText} />

      <header className="relative mx-auto flex min-h-[92vh] max-w-5xl flex-col justify-end px-4 pb-16 pt-24 md:px-8">
        <TreeSilhouette stage="burned" className="absolute right-4 top-24 opacity-40 md:right-12 md:top-28" />
        <p className="text-xs font-semibold tracking-[0.25em] uppercase opacity-70">
          Bosques patagónicos · scrollytelling
        </p>
        <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl leading-[1.05] md:text-6xl lg:text-7xl">
          Después del fuego,
          <br />
          hacia la prevención
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed opacity-85 md:text-lg">
          Una línea de tiempo que va para atrás: de la cicatriz al incendio, y del
          incendio a lo que aún se puede evitar. Scroll para retroceder.
        </p>
        <p className="mt-8 text-xs opacity-60">
          Datos RII 2017–2026 · presupuesto y testimonios en revisión
        </p>
      </header>

      {data.loading ? (
        <p className="px-4 py-20 text-center text-sm opacity-70">
          Cargando datos del RII…
        </p>
      ) : data.error ? (
        <p className="px-4 py-20 text-center text-sm text-red-300">
          {data.error}
        </p>
      ) : (
        <>
          <AfterSection
            hectaresPatagonia={data.hectaresPatagonia}
            firesMonth={data.firesMonth}
            testimonies={testimonies}
          />
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            <TreeSilhouette
              stage="fire"
              className="mx-auto opacity-50"
            />
          </div>
          <FireSection
            hectaresPatagonia={data.hectaresPatagonia}
            firesProvincePatagonia={data.firesProvincePatagonia}
          />
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            <TreeSilhouette
              stage="healthy"
              className="mx-auto opacity-55"
            />
          </div>
          <BeforeSection firesMonth={data.firesMonth} />
          <OtbnSection />
          <GapsSection />
        </>
      )}

      <footer className="mx-auto max-w-6xl px-4 py-16 text-sm opacity-70 md:px-8">
        <p>
          Fuentes: RII (cantidad y hectáreas de incendios); OTBN de Neuquén, Río
          Negro, Chubut y Santa Cruz en{" "}
          <code className="text-xs">public/data/otbn-zonas.geojson</code>. Series
          de presupuesto, costos y stock de bosque nativo son placeholders
          editables en <code className="text-xs">src/data/</code>.
        </p>
      </footer>
    </div>
  );
}
