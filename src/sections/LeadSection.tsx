import Image from "next/image";
import { Quote } from "@/components/Quote";
import { ShareButtons } from "@/components/ShareButtons";
import { TextLink } from "@/components/TextLink";
import { withBasePath } from "@/lib/paths";

const BAJADA = "A falta de una prevención coordinada, la emergencia es el único plan";

export function LeadSection() {
  return (
    <section
      id="intro"
      className="relative z-10 -mt-[10svh] text-foreground"
    >
      <div className="mx-auto max-w-[900px] px-5 pb-6 pt-[16svh] text-center md:px-8">
        <Image
          src={withBasePath("/header/foco-bootcamp.png")}
          alt="FOCO Bootcamp"
          width={200}
          height={250}
          className="mx-auto mb-12 h-auto"
          priority
        />
        <h1 className="type-h1 text-accent">
          Incendios forestales en la Patagonia
        </h1>
        <p className="mx-auto mt-[12px] max-w-[800px] font-display text-[22px] leading-snug font-semibold text-foreground md:text-[33px] md:leading-[1.27]">
          {BAJADA}
        </p>
        <p className="mt-[48px] font-sans text-[16px] text-foreground">
          Equipo de FOCO Bootcamp/FTA-FOPEA
        </p>
        <ShareButtons />
      </div>

      <div className="bg-background">
        <div className="mx-auto max-w-[800px] px-5 md:px-8">
          <p className="mt-12 mb-6 text-left text-[16px] font-bold leading-relaxed text-foreground">
            Argentina, 18 de noviembre de 2026
          </p>
          <div className="type-stack">
            <p className="type-body">
              La superficie de Bosques Andino Patagónicos de Argentina afectada
              por incendios forestales durante el período octubre 2025 – marzo
              2026 fue de 60.845 hectáreas, según un{" "}
              <TextLink href="https://www.greenpeace.org/static/planet4-argentina-stateless/2026/05/a3a80031-reporte-incendios-gp-2025-26.pdf">
                reporte
              </TextLink>{" "}
              de Greenpeace. El fuego vuelve a encontrar, una y otra vez,
              condiciones favorables para avanzar: negligencia humana; sequía;
              altas temperaturas; vientos intensos y acumulación de material
              combustible. El resultado se repite: viviendas y patrimonios
              destruidos; comunidades en crisis y pérdida de bosque nativo.
              Mientras gran parte de los recursos se concentran en combatir las
              llamas, la prevención sigue siendo uno de los grandes desafíos
              pendientes. Esta investigación periodística revela que la
              Patagonia carece de una preparación a la altura de los incendios
              que se devoran sus paisajes naturales. Por eso, a esta región le
              queda reaccionar ante cada crisis ya desatada.
            </p>

            <Quote
              quote="“A la noche, el bosque parecía un árbol de Navidad. Miraras hacia donde miraras, en los cerros había foquitos, casi en los cuatro puntos cardinales. Era tétrico ver luces naranjas por todos lados”."
              name="Rubén Oliva"
              role="Presidente de la Federación de Bomberos Voluntarios de Chubut"
            />

            <p className="type-body">
              En los relatos de quienes estuvieron allí, en el perímetro de los
              incendios, el fuego dejó de ser solamente un fenómeno físico.
              Cobró cuerpo, movimiento y una voluntad difícil de anticipar. Se
              convirtió en un “monstruo”, una palabra que aparece una y otra vez
              entre brigadistas y bomberos consultados para intentar describir
              algo que parecía exceder cualquier capacidad de respuesta.
            </p>
            <p className="type-body">
              Los testigos lo definen como un incendio de sexta generación: un
              episodio extremo en el que la intensidad, la velocidad de
              propagación y las condiciones meteorológicas pueden desbordar los
              recursos disponibles. En esos escenarios, sumar personal o
              equipamiento no siempre alcanza y, a veces, sólo la imprevisible
              lluvia permite recuperar el control.
            </p>
            <p className="type-body">
              “Nos convencemos de que podemos resolver cualquier situación y,
              cuando te encontrás con este tipo de emergencia, el ego se
              desploma porque nada de lo que hagas es suficiente”, señala Daniel
              Díaz, jefe de Bomberos de Epuyén (Chubut), una de las localidades
              más afectadas por el megaincendio de comienzos de 2026.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
