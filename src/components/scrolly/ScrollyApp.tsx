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
import { MethodsSection } from "@/sections/MethodsSection";
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
      <MethodsSection />

      <footer className="mx-auto max-w-6xl px-4 py-12 text-sm opacity-60 md:px-8">
        <p>
          Detalle completo de fuentes en{" "}
          <a href="#fuentes" className="underline underline-offset-2">
            De dónde sale cada dato
          </a>
          . Fotos de especies: Wikimedia Commons (créditos en cada ficha).
        </p>
      </footer>
    </div>
  );
}
