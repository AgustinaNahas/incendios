import Image from "next/image";
import { withBasePath } from "@/lib/paths";

const BAJADA =
  "Incendios sin prevención y la emergencia como único plan";

export function LeadSection() {
  return (
    <section
      id="intro"
      className="relative z-10 -mt-[20svh] text-[#f3efe8]"
    >
      <div className="mx-auto max-w-[1200px] px-5 pb-6 pt-[16svh] text-center md:px-8">
        <Image
          src={withBasePath("/header/foco-bootcamp.png")}
          alt="FOCO Bootcamp"
          width={120}
          height={59}
          className="mx-auto w-[120px] h-auto"
          priority
        />
        <h1 className="mt-3 font-display text-4xl leading-[1.05] md:text-8xl">
          Bosques Patagónicos
        </h1>
        <p className="mt-6 font-sans text-[54px] leading-[1.27] font-bold text-[#f3efe8]">
          {BAJADA}
        </p>
        <p className="mt-8 text-2xl font-bold leading-relaxed text-[#f3efe8]">
        FOCO Bootcamp - Transparencia Activa y FOPEA
        </p>
        <p className="mt-3 text-[11px] text-[#f3efe8]/65 md:text-xs">
          Publicado el día que lo publicamos, 2026
        </p>
      </div>

      <div className="bg-[#2B2B2B]">

        <div className="mx-auto max-w-[800px] px-5 pb-24 md:px-8 md:pb-32">

          <div className="mt-12 space-y-12 text-xl leading-relaxed text-[#f3efe8] md:text-xl">
            <p>
            Durante los primeros meses de 2026, más de 45 mil hectáreas de la Patagonia argentina se prendieron fuego. No fue un accidente. El fuego toma siempre el mismo camino: la negligencia humana, la sequía, vientos traicioneros continúan poniendo en riesgo nuestro patrimonio natural. Casas quemadas, menos bosque nativo y años enfocados en la emergencia pero pocas veces en la prevención.

            </p>
            <p>
              Texto de cómo se comporta el fuego: explicación de cómo se mueve
              el fuego: cola, laterales francos. Un fuego que no paraba de
              mutar “un monstruo”; cómo vio el fuego: “etérico”, “lucecitas de
              navidad”.
            </p>

            <blockquote className="bg-[#FF000040] p-12 italic">
            “En la noche parecía un árbol de Navidad. Para donde mirabas en los cerros había foquitos y casi a los cuatro puntos cardinales. Era tétrico ver lucecitas naranjas por todos lados.”

            </blockquote>
            <p className="text-sm"><strong>Rubén Oliva</strong> - Jefe de la Federación de Bomberos Voluntarios en Chubut</p>
            <p>
            Así el fuego se transformó en un ente, en una forma que cobró vida, que tomó cuerpo y dimensiones reales. Al que se le puso nombre y se catalogó de "monstruo". Esa forma errática, imprevisible e implacable. "Al fuego siempre lo identificamos como la cabeza, la cola y los flancos derecho e izquierdo, pero el viento rotaba; lo que era cabeza pasaba a ser cola, lo que era un lateral derecho pasaba a ser la cabeza. Lo que vos tenías identificado en la mañana temprano cambiaba una hora después y volvía todo hacia atrás", comentó el Jefe de Bomberos.
            </p>
            <p>
            Un incendio de sexta generación, uno de los más terribles de la historia. Las condiciones que sobrepasan los recursos: por más cantidad de brigadistas, bomberos e infraestructura, un incendio puede no tener mayor salida que una lluvia salvadora.
            </p>
            <p>
            "Nos convencemos de que podemos resolver cualquier situación y cuando te encontrás con este tipo de emergencia, el ego se va por el piso porque nada de lo que hagas es suficiente", dijo Daniel Díaz, jefe de Bomberos de Epuyén, una de las zonas más devastadas por el megaincendio.

            </p>
          </div>
          
        </div>
      </div>
    </section>
  );
}
