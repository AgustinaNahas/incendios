import { Quote } from "@/components/Quote";
import { BrigadistaAnatomy } from "@/components/scrolly/BrigadistaAnatomy";
import { FireStates } from "@/components/scrolly/FireStates";

const BODIES = [
  {
    title: "Brigadistas de Parques Nacionales",
    body: "Combatientes especializados en incendios forestales, rurales y de interfase dentro de áreas protegidas nacionales.",
  },
  {
    title: "Brigadistas del Sistema Nacional de Manejo del Fuego",
    body: "Equipos federales que pueden desplazarse para reforzar incendios de gran magnitud.",
  },
  {
    title: "Brigadistas provinciales",
    body: "Integran los sistemas de manejo del fuego de cada provincia y actúan principalmente fuera de los parques nacionales.",
  },
  {
    title: "Bomberos voluntarios",
    body: "Intervienen especialmente en zonas pobladas y de interfase.",
  },
  {
    title: "Brigadistas comunitarios",
    body: "Vecinos organizados en zonas rurales o de interfase; algunos grupos cuentan con capacitación, seguros y equipamiento.",
  },
  {
    title: "Guardaparques",
    body: "Colaboran en prevención, detección y tareas operativas.",
  },
  {
    title: "Pilotos y tripulaciones aéreas",
    body: "Realizan reconocimiento, traslados y descargas de agua o retardantes.",
  },
  {
    title: "Otros apoyos especializados",
    body: "Operadores de maquinaria, meteorólogos y equipos de logística y comunicaciones que sostienen el operativo.",
  },
] as const;

const TOOLS = [
  "Machete forestal (Biassoni)",
  "Pala forestal",
  "Rastrillo combinado Derqui",
  "Rastrillo McLeod",
  "Pulaski (combinación de hacha y azada)",
  "Antorcha de goteo",
  "Motobombas con sistema de mochila, depósito y línea de combustible",
] as const;

export function FightersSection() {
  return (
    <section
      id="combatientes"
      className="relative scroll-mt-8 bg-background text-foreground"
    >
      <div className="mx-auto max-w-[800px] px-5 pt-20 pb-6 md:px-8 md:pt-28">
        <h2 className="type-h3">Quiénes combaten el fuego</h2>


        <p className="mt-4 text-base leading-relaxed text-foreground/90 md:text-2xl">
                    Los distintos cuerpos de combate
          </p>
          
        <p className="mt-8 text-base leading-relaxed text-foreground/90 md:text-lg">
          En los incendios forestales de la Patagonia intervienen distintos
          cuerpos, cada uno con una formación y una función específica. En los
          operativos de mayor escala, trabajan de manera coordinada y, muchas
          veces, dentro de estructuras de comando conjunto.
        </p>

        <ul className="mt-6 space-y-4">
          {BODIES.map((item) => (
            <li key={item.title} className="ml-6 list-disc pl-1 ">
              <p className="font-sans text-base font-bold md:text-lg">
                {item.title}
              </p>
              <p className="text-base leading-relaxed text-foreground/85 md:text-lg">
                {item.body}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-base leading-relaxed text-foreground/90 md:text-lg">
          En el terreno, esas diferencias institucionales se vuelven menos
          visibles. Brigadistas, bomberos, guardaparques, pilotos y vecinos
          comparten un mismo objetivo: ganar tiempo, abrir líneas de defensa,
          proteger viviendas o evitar que un foco vuelva a encenderse. Pero hay
          incendios en los que ni la cantidad de personas ni los recursos
          alcanzan: el viento cambia, el fuego acelera y la prioridad pasa a ser
          no exponer vidas.
        </p>

        <h3 className="mt-16 font-sans text-xl font-bold md:text-2xl">
          Anatomía de un brigadista
        </h3>

        <p className="mt-2 text-base leading-relaxed text-foreground/90 md:text-lg">
          Cómo se ve un brigadista forestal de Parques Nacionales según la información recibida por los pedidos de acceso a la información.
        </p>
      </div>

      <BrigadistaAnatomy />

      <div className="mx-auto max-w-[800px] px-5 pb-12 md:px-8 md:pb-4">
        

        <Quote
          className="mt-10"
          quote="“La solidaridad no puede ser una política pública, porque cuando hablamos de emergencias, hablamos de una responsabilidad.”"
          name="Natalia Dobranski"
          role="jefa de la Brigada Forestal de Mallín Ahogado, una organización comunitaria de Río Negro"
        />

        <FireStates />
      </div>
    </section>
  );
}
