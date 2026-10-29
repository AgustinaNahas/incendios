import { Quote } from "@/components/Quote";

export function ConclusionsSection() {
  return (
    <section
      id="conclusiones"
      className="relative scroll-mt-8 bg-[#2B2B2B] text-[#f3efe8]"
    >
      <div className="mx-auto max-w-[800px] px-5 py-20 md:px-8 md:py-28">
        <h2 className="type-h3">Conclusiones sobre el camino del fuego</h2>

        <div className="mt-8 space-y-5 text-base leading-relaxed text-[#f3efe8]/90 md:text-lg">
          <p>
            Especialistas en ecología del fuego, bomberos, brigadistas y
            pobladores coinciden en un punto: el fuego es, en buena medida,
            evitable. Pero si la gestión no está, la hipótesis es dura: todo lo
            ocurrido en 2025-2026 puede volver a suceder.
          </p>
          <p>
            El camino del fuego ya es conocido —sequía, viento, interfase,
            combustible disponible, respuesta reactiva y prevención débil—,
            aunque muchos deciden no mirar el mapa.
          </p>
        </div>

        <Quote
          className="mt-10"
          quote="“La solidaridad no puede ser una política pública, porque cuando hablamos de emergencias, hablamos de una responsabilidad.”"
          name="Natalia Dobranski"
          role="jefa de la Brigada Forestal de Mallín Ahogado"
        />

        <div className="mt-10 space-y-5 text-base leading-relaxed text-[#f3efe8]/90 md:text-lg">
          <p>
            Conocer las causas, reconocer las condiciones que favorecen al fuego
            y aprender de sus consecuencias no evita por sí solo la próxima
            emergencia, pero sí define cuánto puede hacerse para que la próxima
            vez el daño sea menor.
          </p>
        </div>
      </div>
    </section>
  );
}
