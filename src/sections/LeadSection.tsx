import Image from "next/image";
import { Quote } from "@/components/Quote";
import { withBasePath } from "@/lib/paths";

const BAJADA =
  "Incendios sin prevención ni presupuesto claro y la emergencia como único plan";

export function LeadSection() {
  return (
    <section
      id="intro"
      className="relative z-10 -mt-[20svh] text-[#f3efe8]"
    >
      <div className="mx-auto max-w-[800px] px-5 pb-6 pt-[16svh] text-center md:px-8">
        <Image
          src={withBasePath("/header/foco-bootcamp.png")}
          alt="FOCO Bootcamp"
          width={200}
          height={250}
          className="mx-auto mb-12 h-auto"
          priority
        />
        <h1 className="type-h1 mt-3 uppercase text-[#f1621a]">
          Bosques Patagónicos
        </h1>
        <p className="mt-[35px] font-display text-[35px] leading-[1.27] font-semibold text-[#f3efe8]">
          {BAJADA}
        </p>
        <p className="mt-[22px] font-sans text-[16px] font-bold text-[#f3efe8]">
          Equipo de FOCO Bootcamp
        </p>
      </div>

      <div className="bg-[#2B2B2B]">
        <div className="mx-auto max-w-[800px] px-5 pb-24 md:px-8 md:pb-32">
          <p className="mt-12 mb-6 text-left text-[16px] font-bold leading-relaxed text-[#f3efe8]">
            Argentina, 17 de noviembre de 2026
          </p>
          <div className="space-y-12 text-xl leading-relaxed text-[#f3efe8] md:text-xl">
            <p>
              Durante los primeros meses de 2026, más de 45 mil hectáreas
              ardieron en la Patagonia argentina. No fue un hecho aislado ni
              inesperado. El fuego vuelve a encontrar, una y otra vez,
              condiciones favorables para avanzar: negligencia humana, sequía,
              altas temperaturas, vientos intensos y acumulación de material
              combustible. El resultado se repite: viviendas destruidas, pérdida
              de bosque nativo y comunidades obligadas a convivir con la
              emergencia. Mientras gran parte de los recursos se concentra en
              combatir las llamas, la prevención sigue siendo uno de los grandes
              desafíos pendientes.
            </p>

            <Quote
              quote="“A la noche, el bosque parecía un árbol de Navidad. Miraras hacia donde miraras, en los cerros había foquitos, casi en los cuatro puntos cardinales. Era tétrico ver luces naranjas por todos lados.”"
              name="Rubén Oliva"
              role="Jefe de la Federación de Bomberos Voluntarios en Chubut"
            />

            <p>
              En los relatos de quienes estuvieron allí, el fuego dejó de ser
              solamente un fenómeno físico. Cobró cuerpo, movimiento y una
              voluntad difícil de anticipar. Se convirtió en un “monstruo”, una
              palabra que aparece una y otra vez entre brigadistas y bomberos
              para intentar describir algo que parecía exceder cualquier
              capacidad de respuesta.
            </p>
            <p>
              Lo definen como un incendio de sexta generación: un episodio
              extremo en el que la intensidad, la velocidad de propagación y las
              condiciones meteorológicas pueden desbordar los recursos
              disponibles. En esos escenarios, sumar personal o equipamiento no
              siempre alcanza y, a veces, sólo un cambio en el tiempo permite
              recuperar el control.
            </p>

            <Quote
              quote="“Nos convencemos de que podemos resolver cualquier situación y, cuando te encontrás con este tipo de emergencia, el ego se va por el piso porque nada de lo que hagas es suficiente”"
              name="Daniel Díaz"
              role="Jefe de Bomberos de Epuyén, una de las localidades más afectadas por el megaincendio"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
