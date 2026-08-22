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

function SourceLink({ row }: { row: SourceRow }) {
  if (row.url) {
    return (
      <a
        href={row.url}
        target="_blank"
        rel="noopener noreferrer"
        className="break-all text-[#E8C56A] underline decoration-[#E8C56A]/40 underline-offset-2 hover:decoration-[#E8C56A]"
      >
        {row.url.replace(/^https?:\/\//, "")}
      </a>
    );
  }
  return (
    <span className="text-sm leading-relaxed text-[#f3efe8]/75">
      {row.urlNote ?? "URL no disponible"}
    </span>
  );
}

export function MethodsSection() {
  const withLink = rows.filter((r) => r.url).length;

  return (
    <section
      id="fuentes"
      className="relative scroll-mt-8 bg-[#0c0c0c] px-4 py-20 text-[#f3efe8] md:px-8 md:py-28 lg:px-12"
    >
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="max-w-3xl space-y-5">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#f3efe8]/80">
            Método · Fuentes
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl leading-tight md:text-5xl">
            De dónde sale cada dato
          </h2>
          <p className="text-base leading-relaxed text-[#f3efe8]/90 md:text-lg">
            Registro de las fuentes usadas en este scrollytelling: cartografía
            OTBN, áreas quemadas y literatura sobre inflamabilidad.
          </p>
          <p className="text-sm text-[#f3efe8]/80">
            {rows.length} entradas · {withLink} con URL · consulta base{" "}
            {rows[0]?.accessed}
          </p>
        </div>

        {/* Mobile: stacked cards — avoids page-level horizontal scroll */}
        <ul className="space-y-4 md:hidden">
          {rows.map((row) => (
            <li
              key={row.info}
              className="rounded-sm border border-[#f3efe8]/20 bg-[#f3efe8]/[0.04] p-4"
            >
              <p className="font-medium text-[#f3efe8]">{row.info}</p>
              <p className="mt-2 text-sm leading-relaxed text-[#f3efe8]/85">
                {row.source}
              </p>
              <div className="mt-3 text-sm">
                <SourceLink row={row} />
              </div>
              <p className="mt-2 text-xs text-[#f3efe8]/75">
                Consultada: {row.accessed}
              </p>
            </li>
          ))}
        </ul>

        <div className="hidden overflow-x-auto rounded-sm border border-[#f3efe8]/20 md:block">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[#f3efe8]/25 bg-white/[0.04] text-xs uppercase tracking-wide text-[#f3efe8]/80">
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
                  className="border-b border-[#f3efe8]/10 align-top last:border-0"
                >
                  <td className="px-4 py-3.5 font-medium text-[#f3efe8]">
                    {row.info}
                  </td>
                  <td className="px-4 py-3.5 text-[#f3efe8]/90">{row.source}</td>
                  <td className="px-4 py-3.5">
                    <SourceLink row={row} />
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-[#f3efe8]/80">
                    {row.accessed}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
