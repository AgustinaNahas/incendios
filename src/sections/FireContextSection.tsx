import { Quote } from "@/components/Quote";

type CauseItem = {
  title: string;
  body: string;
};

type CauseBlock = {
  id: string;
  percent: string;
  title: string;
  items: CauseItem[];
  theme: "natural" | "human";
};

const CAUSES: CauseBlock[] = [
  {
    id: "naturales",
    percent: "5%",
    title: "Causas naturales",
    theme: "natural",
    items: [
      {
        title: "Rayos",
        body: "Pueden dejar focos latentes durante días hasta que viento o sequedad los expanden.",
      },
      {
        title: "Actividad volcánica",
        body: "Puede encender vegetación cercana, aunque es poco frecuente a gran escala en la región.",
      },
    ],
  },
  {
    id: "humanas",
    percent: "95%",
    title: "Causas de origen humano",
    theme: "human",
    items: [
      {
        title: "Negligencia",
        body: "Fogones mal apagados, cigarrillos o turismo en zonas no habilitadas.",
      },
      {
        title: "Hechos intencionales",
        body: "Conflictos entre vecinos o quemas que se usan como represalia.",
      },
      {
        title: "Manejo de pasturas",
        body: "Quemas autorizadas que, sin control, pueden escapar y causar daños de gran magnitud.",
      },
      {
        title: "Infraestructura",
        body: "Fallas vinculadas a la energía eléctrica y otras instalaciones.",
      },
    ],
  },
];

const THEME = {
  natural: {
    border: "border-[#5a7a5a]",
    bg: "bg-[#2f3e2f]/80",
    accent: "text-[#8fbc8f]",
    itemTitle: "text-[#8fbc8f]",
  },
  human: {
    border: "border-[#8a4a4a]",
    bg: "bg-[#4a2b2b]/80",
    accent: "text-[#f3efe8]",
    itemTitle: "text-[#e07a7a]",
  },
} as const;

export function FireContextSection() {
  return (
    <section
      id="contexto"
      className="relative scroll-mt-8 bg-[#2B2B2B] text-[#f3efe8]"
    >
      <div className="mx-auto max-w-[800px] px-5 py-20 md:px-8 md:py-28">
        <h2 className="type-h3">El contexto del fuego</h2>
        <p className="mt-6 font-sans text-base leading-relaxed text-[#f3efe8]/90 md:text-lg">
          ¿Qué condiciones hacen que un bosque sea más vulnerable al fuego
          incluso antes de que aparezca la primera llama? El riesgo puede
          ordenarse en tres niveles: causas directas, factores de propagación y
          condiciones estructurales.
        </p>

        <h3 className="mt-14 font-sans text-xl font-bold md:text-2xl">
          Causas directas
        </h3>
        <h4 className="mt-6 font-sans text-base font-bold md:text-lg">
          Causas naturales
        </h4>
        <p className="mt-3 font-sans text-base leading-relaxed text-[#f3efe8]/90 md:text-lg">
          Entre las causas naturales, los rayos pueden iniciar incendios que
          permanecen latentes durante días y luego se expanden bajo condiciones
          favorables, como ocurrió en diciembre de 2025 en el lago Menéndez. La
          actividad volcánica también puede encender vegetación cercana, aunque
          es una causa poco frecuente de incendios forestales de gran escala en
          la región.
        </p>
        <h4 className="mt-8 font-sans text-base font-bold md:text-lg">
          Causas de origen humano
        </h4>
        <p className="mt-3 font-sans text-base leading-relaxed text-[#f3efe8]/90 md:text-lg">
          La mayoría de los incendios tiene origen antrópico. Según el Servicio
          Nacional de Manejo del Fuego, cerca del 95% está vinculado a acciones
          humanas, ya sea por negligencia, fallas de infraestructura o hechos
          intencionales.
        </p>

        <Quote
          className="mt-10"
          quote="“Puede estar dado por un fuego mal apagado o por una pelea entre vecinos; es muy común que se ajusticien prendiéndose fuego. Los motivos también pueden darse por un grupo de turistas andando por una zona donde no se debe, dejando un cigarrillo prendido”"
          name="Hernán Andrade"
          role="exvecino de Las Golondrinas, Chubut"
        />

        <p className="mt-10 font-sans text-base leading-relaxed text-[#f3efe8]/90 md:text-lg">
          También existen quemas intencionales vinculadas al manejo de pasturas
          o de determinados ambientes. Cuando están autorizadas, deben
          realizarse bajo condiciones controladas y con personal especializado,
          porque si el fuego se escapa puede generar daños de gran magnitud.
        </p>

        <div className="mt-10 space-y-4">
          {CAUSES.map((cause) => {
            const theme = THEME[cause.theme];
            return (
              <div
                key={cause.id}
                className={`overflow-hidden border ${theme.border} ${theme.bg}`}
              >
                <div className="flex items-stretch gap-4 px-4 py-4 md:gap-5 md:px-5 md:py-5">
                  <span
                    className={`flex shrink-0 items-center font-[family-name:var(--font-display)] text-3xl leading-none font-black md:text-4xl ${theme.accent}`}
                  >
                    {cause.percent}
                  </span>
                  <span
                    className="w-px shrink-0 self-stretch bg-current opacity-35"
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1 font-sans text-base font-semibold md:text-lg">
                    {cause.title}
                  </span>
                </div>

                <div className="space-y-4 border-t border-current/20 px-4 pb-5 md:px-5 md:pb-6">
                  <div className="space-y-4 pt-4">
                    {cause.items.map((item) => (
                      <div key={item.title}>
                        <p
                          className={`font-sans text-sm font-bold md:text-base ${theme.itemTitle}`}
                        >
                          {item.title}
                        </p>
                        <p className="mt-1 font-sans text-sm leading-relaxed text-[#f3efe8]/85 md:text-base">
                          {item.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <h3 className="mt-16 font-sans text-xl font-bold md:text-2xl">
          Condiciones estructurales
        </h3>
        <div className="mt-4 space-y-5 text-base leading-relaxed text-[#f3efe8]/90 md:text-lg">
          <p>
            El riesgo no depende sólo de cómo empieza un incendio ni de las
            condiciones climáticas que lo alimentan. También influye cómo se
            ocupa y se gestiona el territorio. En las últimas décadas crecieron
            las viviendas y los asentamientos en zonas de interfase entre bosque
            y áreas habitadas, muchas veces sin planificación suficiente, con
            vegetación y otros combustibles muy próximos a las casas y escasas
            medidas de prevención.
          </p>
          <p>
            A eso se suman desigualdades en la capacidad de prepararse y
            recuperarse, falta de mantenimiento del entorno, turismo con poca
            información preventiva y una educación ambiental todavía
            insuficiente.
          </p>
        </div>

        <Quote
          className="mt-10"
          quote="“El problema principal para mí está relacionado con la gestión territorial. En los últimos 25 años acá, la Comarca creció de manera exponencial”"
          name="Hernán Andrade"
          role="ex vecino de Las Golondrinas, Comarca Andina — Chubut"
        />

        <div className="mt-10 space-y-5 text-base leading-relaxed text-[#f3efe8]/90 md:text-lg">
          <p>
            Respecto a datos censales oficiales, el Indec registró en el
            departamento de Cushamen, donde se encuentra la localidad de Las
            Golondrinas, un crecimiento relativo del 34% en los últimos 12 años.
            Para 2010 la cantidad de habitantes era de 20.919, mientras que para
            2022 era de 28.209.
          </p>
          <p>
            En las últimas décadas, el crecimiento residencial avanzó sobre
            áreas de vegetación natural. Un estudio publicado en 2019 sobre la
            Comarca Andina, que incluye El Bolsón, Lago Puelo, El Hoyo y Epuyén,
            mostró que, entre 1981-82 y 2016, la superficie de interfase
            urbano-forestal creció un 76%, de unas 12.100 a más de 21.300
            hectáreas. Allí, las viviendas se mezclan directamente con el
            bosque, el matorral o la estepa, o quedan muy próximas a grandes
            superficies vegetadas. Para 2016, esas zonas concentraban el 96,6%
            de las construcciones del área analizada. El crecimiento fue
            especialmente marcado alrededor de Mallín Ahogado, El Foyel y
            sectores próximos a El Bolsón y El Hoyo.
          </p>
        </div>
      </div>
    </section>
  );
}
