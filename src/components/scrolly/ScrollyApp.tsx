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
    <div className="relative min-h-screen overflow-x-clip text-[#f3efe8]">
      <TimelineRail active={activeChapter} progress={scrollProgress} />
      <MobileChapterChips active={activeChapter} />

      <FireHeader />
      <OtbnSection />
      <ConsequencesScrolly />
      <BurnedSection />
      <InflammabilitySection />
      <GapsSection />
      <MethodsSection />
    </div>
  );
}
