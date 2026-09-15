"use client";

import { OtbnSection } from "@/sections/OtbnSection";
import { InflammabilitySection } from "@/sections/InflammabilitySection";
import { FireHeader } from "@/components/scrolly/FireHeader";
import { LeadSection } from "@/sections/LeadSection";

export function ScrollyApp() {
  return (
    <div className="relative min-h-screen overflow-x-clip text-[#f3efe8]">
      <FireHeader />
      <LeadSection />
      <OtbnSection />
      <InflammabilitySection />
    </div>
  );
}
