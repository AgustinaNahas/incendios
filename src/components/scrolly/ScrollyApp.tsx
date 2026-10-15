"use client";

import { OtbnSection } from "@/sections/OtbnSection";
import { BudgetSection } from "@/sections/BudgetSection";
import { FightersSection } from "@/sections/FightersSection";
import { FireContextSection } from "@/sections/FireContextSection";
import { InflammabilitySection } from "@/sections/InflammabilitySection";
import { AfterFireSection } from "@/sections/AfterFireSection";
import { FireHeader } from "@/components/scrolly/FireHeader";
import { LeadSection } from "@/sections/LeadSection";

export function ScrollyApp() {
  return (
    <div className="relative min-h-screen overflow-x-clip text-[#f3efe8]">
      <FireHeader />
      <LeadSection />
      <OtbnSection />
      <BudgetSection />
      <FightersSection />
      <FireContextSection />
      <InflammabilitySection />
      <AfterFireSection />
    </div>
  );
}
