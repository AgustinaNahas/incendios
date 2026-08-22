"use client";

import sources from "@/data/sources.json";

type SourceRow = {
  info: string;
  source: string;
  url: string | null;
  urlNote?: string;
  accessed: string;
};

const rows = sources as SourceRow[];

export function MethodsSection() {
  const withLink = rows.filter((r) => r.url).length;

  return (
    <section
      id="fuentes"
      className="relative scroll-mt-8 bg-[#0c0c0c] px-4 py-20 text-[#f3efe8] md:px-8 md:py-28 lg:px-12"
    >
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="max-w-3xl space-y-5">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase opacity-70">
            Método · Fuentes
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl leading-tight md:text-5xl">
            De dónde sale cada dato
          </h2>
          <p className="text-base leading-relaxed opacity-85 md:text-lg">
            Registro de las fuentes usadas en este scrollytelling: cartografía
            OTBN, áreas quemadas, series forestales y literatura sobre
            inflamabilidad. Donde el enlace exacto no quedó conservado, lo
            dejamos explicitado.
          </p>
          <p className="text-sm opacity-65">
            {rows.length} entradas · {withLink} con URL verificable · consulta
            base {rows[0]?.accessed}
          </p>
        </div>

        <div className="overflow-x-auto rounded-sm border border-current/15">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-current/25 bg-white/[0.03] text-xs uppercase tracking-wide opacity-70">
                <th className="px-4 py-3 font-medium">Información</th>
                <th className="px-4 py-3 font-medium">Fuente</th>
                <th className="px-4 py-3 font-medium">Link</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Consultada
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.info}
                  className="border-b border-current/10 align-top last:border-0"
                >
                  <td className="px-4 py-3.5 font-medium">{row.info}</td>
                  <td className="px-4 py-3.5 opacity-85">{row.source}</td>
                  <td className="px-4 py-3.5">
                    {row.url ? (
                      <a
                        href={row.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all text-[#E0B25A] underline decoration-current/30 underline-offset-2 hover:decoration-current"
                      >
                        {row.url.replace(/^https?:\/\//, "")}
                      </a>
                    ) : (
                      <span className="text-xs leading-relaxed opacity-55">
                        {row.urlNote ?? "URL no disponible"}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap opacity-70">
                    {row.accessed}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="max-w-3xl text-sm opacity-60">
          Esta lista es un borrador vivo: se puede completar con URLs faltantes
          (Río Negro, Chubut, CONAE, IGN/MAyDS, CSV de hectáreas) a medida que
          las recuperemos.
        </p>
      </div>
    </section>
  );
}
