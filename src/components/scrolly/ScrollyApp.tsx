"use client";

import {
  MobileChapterChips,
  TimelineRail,
} from "@/components/scrolly/TimelineRail";
import { OtbnSection } from "@/sections/OtbnSection";
import { ConsequencesScrolly } from "@/sections/ConsequencesScrolly";
import { BurnedSection } from "@/sections/BurnedSection";
import { GapsSection } from "@/sections/GapsSection";
import { InflammabilitySection } from "@/sections/InflammabilitySection";
import { useScrollChapters } from "@/lib/useScrollChapters";
import { FireHeader } from "@/components/scrolly/FireHeader";

export function ScrollyApp() {
  const { activeChapter, scrollProgress } = useScrollChapters();

  return (
    <div className="relative min-h-screen text-[#f3efe8]">
      <TimelineRail active={activeChapter} progress={scrollProgress} />
      <MobileChapterChips active={activeChapter} />

      <FireHeader />
      <OtbnSection />
      <ConsequencesScrolly />
      <BurnedSection />
      <InflammabilitySection />
      <GapsSection />

      <footer className="mx-auto max-w-6xl px-4 py-16 text-sm opacity-70 md:px-8">
        <p>
          Fuentes: RII (cantidad y hectáreas de incendios); OTBN de Neuquén, Río
          Negro, Chubut, Santa Cruz y Tierra del Fuego en{" "}
          <code className="text-xs">public/data/otbn-zonas.geojson</code>. Fotos
          de especies: Wikimedia Commons (ver créditos en cada ficha). Series de
          presupuesto, costos y stock de bosque nativo son placeholders editables
          en <code className="text-xs">src/data/</code>.
        </p>
      </footer>
    </div>
  );
}
