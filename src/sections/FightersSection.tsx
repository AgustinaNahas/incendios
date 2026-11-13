import { Quote } from "@/components/Quote";
import { BrigadistaAnatomy } from "@/components/scrolly/BrigadistaAnatomy";
import { FireStates } from "@/components/scrolly/FireStates";

const BODIES = [
  {
    title: "Brigadistas de Parques Nacionales",
    body: "Combatientes especializados en incendios forestales, rurales y de interfase dentro de las áreas protegidas nacionales.",
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
    body: "Realizan reconocimiento, traslados, y descargas de agua o retardantes.",
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
      <div className="section-rule mx-auto max-w-[800px] px-5 mb-6 md:px-8">
        <h2 className="type-h2">Quiénes combaten el fuego</h2>
        <p className="type-bajada">
          Brigadistas, bomberos voluntarios y comunidades sostienen la primera
          línea de una emergencia que la prevención no evita
        </p>

        <p className="type-body">
          En los incendios forestales de la Patagonia intervienen distintos
          cuerpos: brigadistas, bomberos, guardaparques, pilotos y vecinos, con
          formaciones y funciones específicas, que en los operativos de mayor
          escala actúan de manera coordinada y, muchas veces, bajo estructuras
          de comando conjunto. En el terreno, las diferencias institucionales se
          vuelven menos visibles porque todos comparten un mismo objetivo: ganar
          tiempo, abrir líneas de defensa, proteger viviendas o evitar que un
          foco vuelva a encenderse. Sin embargo, hay incendios en los que ni la
          cantidad de personas ni los recursos alcanzan: el viento cambia, las
          llamas se aceleran y la prioridad pasa a ser no exponer vidas.
        </p>

        <p className="type-body mt-6 font-bold">Los distintos cuerpos de combate:</p>
        <ul className="mt-4 space-y-4">
          {BODIES.map((item) => (
            <li key={item.title} className="ml-6 list-disc pl-1">
              <p className="type-body font-bold">{item.title}</p>
              <p className="type-body">{item.body}</p>
            </li>
          ))}
        </ul>

        <h3 className="type-h3">Anatomía de un brigadista forestal</h3>
        <p className="type-bajada">
          El equipo con el que combaten el fuego en Parques Nacionales, según la
          información obtenida a través de pedidos de acceso a la información
        </p>
      </div>

      <BrigadistaAnatomy />

      <div className="mx-auto max-w-[800px] px-5 md:px-8">
        

        <div className="type-stack mt-10">
          <p className="type-body">
            El Servicio Provincial del Manejo del Fuego de Chubut dispone de 13
            bases de brigada a lo largo de la Cordillera, dos anexos, una
            Central de Coordinación y Despacho, y una Subcentral de Incendios
            Forestales. El personal cumple diferentes roles, como combatientes,
            radioperadores o jefe de cuadrilla.
          </p>
        </div>

        {/* <Quote
          quote="“La solidaridad no puede ser una política pública, porque cuando hablamos de emergencias, hablamos de una responsabilidad.”"
          name="Natalia Dobranski"
          role="jefa de la Brigada Forestal de Mallín Ahogado, una organización comunitaria de Río Negro"
        /> */}

        <FireStates />
      </div>
    </section>
  );
}
