const BAJADA =
  "No es un capricho de la naturaleza: sequía extrema, vientos traicioneros y años sin la prevención adecuada. Las voces de brigadistas, bomberos y vecinos relatan las fallas estructurales que hicieron del riesgo una catástrofe. Esta nota cruza cifras y relatos de quienes la enfrentaron y sostienen, que si nada cambia, volverá a suceder.";

export function LeadSection() {
  return (
    <section
      id="intro"
      className="relative z-10 -mt-[64svh] text-[#f3efe8]"
    >
      <div className="mx-auto max-w-[800px] px-5 pb-6 pt-[16svh] text-center md:px-8">
        <p className="text-sm tracking-wide md:text-base">Bosques Patagónicos</p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-[1.05] md:text-7xl">
          El Camino del fuego
        </h1>
        <p className="mt-6 text-sm leading-relaxed text-[#f3efe8]/90 md:text-base">
          {BAJADA}
        </p>
        <p className="mt-8 text-[11px] leading-relaxed text-[#f3efe8]/80 md:text-xs">
          <span className="font-semibold">Hecho por:</span> Lusina Acosta,
          Raquel Ahumada, Sofía Martínez Maroizi, María Agostina Nahás, y
          Candelaria Victorica
        </p>
        <p className="text-[11px] leading-relaxed text-[#f3efe8]/80 md:text-xs">
          <span className="font-semibold">Con la mentoría de:</span> Trigo
          VeraMariana
        </p>
        <p className="mt-3 text-[11px] text-[#f3efe8]/65 md:text-xs">
          Publicado el día que lo publicamos, 2026
        </p>
      </div>

      <div className="bg-[#2B2B2B]">
        <div className="flex justify-center py-14 md:py-16" aria-hidden>
          <div className="h-36 w-px bg-[#f3efe8]/30 md:h-44" />
        </div>

        <div className="mx-auto max-w-[800px] px-5 pb-24 md:px-8 md:pb-32">
          <h2 className="text-center font-[family-name:var(--font-display)] text-4xl leading-tight md:text-5xl">
            Vivir el fuego
          </h2>
          <div className="mt-8 space-y-5 text-sm leading-relaxed text-[#f3efe8]/90 md:text-base">
            <p>
              Texto de cómo se comporta el fuego: explicación de cómo se mueve
              el fuego: cola, laterales francos. Un fuego que no paraba de
              mutar, “un monstruo”; cómo lo vieron: “etérico”, “lucecitas de
              navidad”. Un incendio de sexta generación, uno de los más
              terribles de la historia. El factor viento hizo imposible
              extinguir la inmensidad de la catástrofe: la impotencia de no
              poder contra la ferocidad del fuego, ver cómo se quema todo sin
              poder actuar.
            </p>
            <p>
              Texto de cómo se comporta el fuego: explicación de cómo se mueve
              el fuego: cola, laterales francos. Un fuego que no paraba de
              mutar “un monstruo”; cómo vio el fuego: “etérico”, “lucecitas de
              navidad”.
            </p>
          </div>
          <blockquote className="mx-auto mt-14 max-w-[36rem] text-center font-[family-name:var(--font-display)] text-xl leading-snug italic md:text-2xl">
            “Lo viví de esta manera y no se experiencia y cuento sobre como lo
            viví y mas cosas de testigo”
          </blockquote>
        </div>
      </div>
    </section>
  );
}
