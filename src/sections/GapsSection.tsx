"use client";

import { StorySection } from "@/components/scrolly/StorySection";
import gaps from "@/data/data-gaps.json";

export function GapsSection() {
  return (
    <StorySection
      id="brechas"
      className="bg-gap text-foreground pb-24 md:pb-28"
      eyebrow="Método · Lo que falta"
      title="Brechas: los datos que no pudimos conseguir"
      lede="Contar lo que no está es parte de la historia. La opacidad también es una forma de prevención insuficiente."
      graphic={
        <div>
          <p className="mb-3 text-xs font-semibold tracking-wide uppercase text-foreground/80">
            Dato pedido → estado → impacto
          </p>
          <ul className="space-y-3 text-sm">
            {gaps.slice(0, 4).map((g) => (
              <li
                key={g.datum}
                className="border-b border-foreground/15 pb-3 last:border-0"
              >
                <p className="font-medium text-foreground">{g.datum}</p>
                <p className="mt-1 text-[11px] uppercase tracking-wide text-foreground/75">
                  {g.status}
                </p>
              </li>
            ))}
          </ul>
        </div>
      }
    >
      {/* Mobile cards */}
      <ul className="space-y-4 md:hidden">
        {gaps.map((g) => (
          <li
            key={g.datum}
            className="rounded-sm border border-foreground/20 bg-foreground/[0.04] p-4"
          >
            <p className="font-medium">{g.datum}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-foreground/80">
              {g.status}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">
              {g.impact}
            </p>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[520px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-foreground/25 text-xs uppercase tracking-wide text-foreground/80">
              <th className="py-2 pr-3 font-medium">Dato</th>
              <th className="py-2 pr-3 font-medium">Estado</th>
              <th className="py-2 font-medium">Impacto en la historia</th>
            </tr>
          </thead>
          <tbody>
            {gaps.map((g) => (
              <tr
                key={g.datum}
                className="border-b border-foreground/15 align-top"
              >
                <td className="py-3 pr-3 font-medium text-foreground">{g.datum}</td>
                <td className="py-3 pr-3 text-foreground/90">{g.status}</td>
                <td className="py-3 text-foreground/90">{g.impact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm leading-relaxed text-foreground/85">
        Los CSV del RII sí están: hectáreas e incendios por jurisdicción y mes
        (2017–marzo 2026). Todo lo marcado como placeholder en presupuesto,
        brigadistas y valuación económica debe reemplazarse antes de publicación.
      </p>
    </StorySection>
  );
}
