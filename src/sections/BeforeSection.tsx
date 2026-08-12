"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StorySection } from "@/components/scrolly/StorySection";
import { PreventVsSuppressBars } from "@/components/charts/PreventVsSuppressBars";
import { SeasonalWindow } from "@/components/charts/SeasonalWindow";
import { ProjectionBands } from "@/components/charts/ProjectionBands";
import { formatCompact } from "@/lib/format";
import type { ProvinceYearValue } from "@/lib/parseRii";
import prevention from "@/data/prevention.json";

type Props = {
  firesMonth: ProvinceYearValue[];
};

type Graphic = "cost" | "season" | "projection" | "actions";

export function BeforeSection({ firesMonth }: Props) {
  const [graphic, setGraphic] = useState<Graphic>("actions");
  const [activeAction, setActiveAction] = useState(0);
  const action = prevention.actions[activeAction];

  const graphicNode = (() => {
    switch (graphic) {
      case "cost":
        return (
          <PreventVsSuppressBars
            prevent={prevention.preventVsSuppress.preventCostPerHa}
            suppress={prevention.preventVsSuppress.suppressCostPerHa}
            title="Costo de prevenir vs apagar"
            note={prevention.preventVsSuppress.note}
          />
        );
      case "season":
        return (
          <SeasonalWindow
            data={firesMonth}
            year={2024}
            title="Ventana de prevención"
          />
        );
      case "projection":
        return (
          <ProjectionBands
            baseline={prevention.projection.baselineHa}
            withPrevention={prevention.projection.withPreventionHa}
            uncertainty={prevention.projection.uncertainty}
            title="Trayectoria deseada"
            note={prevention.projection.note}
          />
        );
      case "actions":
        return (
          <div>
            <p className="mb-2 text-xs font-semibold tracking-wide uppercase opacity-70">
              Acciones preventivas
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-3"
              >
                <h3 className="font-[family-name:var(--font-display)] text-2xl">
                  {action.title}
                </h3>
                <p className="text-sm leading-relaxed opacity-85">
                  {action.description}
                </p>
                <div>
                  <p className="mb-1 text-[11px] uppercase tracking-wide opacity-65">
                    Porción ideal del presupuesto
                  </p>
                  <div className="h-3 rounded-sm bg-current/10">
                    <div
                      className="h-3 rounded-sm bg-[#3d6b55]"
                      style={{
                        width: `${action.budgetShareIdeal * 100}%`,
                      }}
                    />
                  </div>
                  <p className="mt-1 text-sm tabular-nums">
                    {Math.round(action.budgetShareIdeal * 100)}%
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {prevention.actions.map((a, i) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setActiveAction(i)}
                  className={`rounded-full px-2.5 py-1 text-[11px] ${
                    i === activeAction
                      ? "bg-current/20 font-semibold"
                      : "bg-current/5 opacity-70"
                  }`}
                >
                  {a.title.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        );
    }
  })();

  return (
    <StorySection
      id="antes"
      eyebrow="Momento III · Prevenir"
      title="El antes: no basta con apagar el fuego"
      lede="Es hora de prevenir los incendios en los santuarios naturales patagónicos. La urgencia está en lo que todavía está en pie."
      graphic={graphicNode}
    >
      <div className="rounded-sm border border-current/20 bg-current/5 p-5">
        <p className="text-xs font-semibold tracking-wide uppercase opacity-65">
          Lo que está en juego
        </p>
        <p className="mt-2 font-[family-name:var(--font-display)] text-4xl md:text-5xl">
          {formatCompact(prevention.nativeForestHa)}{" "}
          <span className="text-lg opacity-70">ha</span>
        </p>
        <p className="mt-2 text-sm opacity-80">{prevention.nativeForestNote}</p>
      </div>

      <p className="text-sm leading-relaxed opacity-85">
        Prevenir implica presupuesto plurianual, manejo de combustible,
        educación, monitoreo y brigadas listas antes del verano — no solo
        reactivos cuando el cielo ya está naranja.
      </p>

      <div className="flex flex-wrap gap-x-3 gap-y-2 text-xs">
        {(
          [
            ["actions", "Acciones"],
            ["cost", "Prevenir vs apagar"],
            ["season", "Ventana estacional"],
            ["projection", "Trayectoria"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setGraphic(id)}
            className={`underline-offset-4 ${
              graphic === id ? "underline font-semibold" : "opacity-70"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </StorySection>
  );
}
