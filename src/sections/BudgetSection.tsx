"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import budget from "@/data/budget.json";
import { withBasePath } from "@/lib/paths";
import {
  BudgetExecutionChart,
  type BudgetExecPoint,
} from "@/components/charts/BudgetExecutionChart";
import { Quote } from "@/components/Quote";
import { TextLink } from "@/components/TextLink";

const ALL_POINTS = budget.execution as BudgetExecPoint[];
const FOREST_POINTS = budget.forestFund.series as BudgetExecPoint[];

const FIRE_PHOTOS = [
  {
    src: "/images/incendio-epuyen.jpg",
    alt: "Incendio en Epuyén",
    credit: "Incendio en Epuyén © Matías Garay / Greenpeace",
    width: 1024,
    height: 682,
  },
  {
    src: "/images/incendio-los-alerces.jpg",
    alt: "Incendio en Los Alerces",
    credit: "Incendio en Los Alerces © Maxi Jonas / Greenpeace",
    width: 1024,
    height: 682,
  },
  {
    src: "/images/incendio-el-bolson.jpg",
    alt: "Incendio en El Bolsón",
    credit: "Incendio en El Bolsón © Marcelo Martínez / Greenpeace",
    width: 1024,
    height: 683,
  },
] as const;

function FirePhoto({
  photo,
}: {
  photo: (typeof FIRE_PHOTOS)[number];
}) {
  return (
    <figure>
      <Image
        src={withBasePath(photo.src)}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        className="h-auto w-full"
      />
      <figcaption className="mt-3 text-xs leading-relaxed text-foreground/65 md:text-sm">
        {photo.credit}
      </figcaption>
    </figure>
  );
}

const LEVELS = [
  "Primero interviene la autoridad jurisdiccional, ya sea la provincia involucrada en el evento o el Parque Nacional.",
  "Si hacen falta refuerzos, se solicita apoyo regional a través del Coordinador Regional del Sistema Nacional del Manejo del Fuego.",
  "Y si la situación supera la capacidad de respuesta disponible, se pide la intervención extrarregional del Servicio Nacional.",
] as const;

const PROVINCE_STRATEGIES: { name: string; body: ReactNode }[] = [
  {
    name: "Neuquén",
    body: (
      <>
        El Estado creó el Sistema Provincial de Manejo del Fuego mediante{" "}
        <TextLink href="https://boficial.neuquen.gov.ar/Leyes/ley_3555.pdf">
          una ley
        </TextLink>{" "}
        promulgada en diciembre de 2025. Este mecanismo establece un enfoque
        integral de la prevención, con participación de actores públicos,
        privados e intermedios, y un fondo específico. Fue{" "}
        <TextLink href="https://emergenciasyriesgos.neuquen.gov.ar/repo/pluginfile.php/156/mod_resource/content/1/Creaci%C3%B3n%20de%20las%20%C3%81reas%20T%C3%A9cnicas%20del%20Sistema%20Provincial%20de%20Manejo%20del%20Fuego_v1%20%281%29.pdf">
          la respuesta a los incendios que habían ocurrido el año pasado en el
          Parque Nacional Lanín
        </TextLink>
        . Pero un año más tarde resulta difícil determinar qué tipo de avances
        hubo con esta política.{" "}
        <TextLink href="https://www.neuqueninforma.gob.ar/noticias/2026/01/21/254778-provincia-refuerza-el-sistema-provincial-de-manejo-del-fuego-con-la-contratacion-de-30-brigadistas">
          La última noticia oficial disponible
        </TextLink>{" "}
        sobre el tema data de enero de 2026 y anuncia la contratación de 30
        brigadistas eventuales.
      </>
    ),
  },
  {
    name: "Río Negro",
    body: (
      <>
        Aquí se percibe un nivel mayor de desarrollo e institucionalización. El
        Servicio de Prevención y Lucha contra los Incendios Forestales (SPLIF)
        tiene su propia{" "}
        <TextLink href="https://splif.rionegro.gov.ar/quienes-somos">
          página web
        </TextLink>
        , donde informa la realización de charlas de concientización y de
        monitoreo del terreno como actividades preventivas de rutina. Esas
        acciones son descritas con mayor detalle en las pestañas de las
        centrales de Bariloche, El Bolsón y General Conesa, y de la subcentral
        Beltran.
      </>
    ),
  },
  {
    name: "Chubut",
    body: (
      <>
        La investigación identificó que en esta provincia se desarrolla una
        campaña educativa anual contra los incendios dirigida a las escuelas
        primarias y capacitaciones destinadas al personal docente. El Gobierno
        anunció en mayo la realización del{" "}
        <TextLink href="https://noticias.chubut.gob.ar/notas/bosques/4659/torres-confirmo-el-lanzamiento-del-plan-operativo-invernal-2026-y-destaco-el-fortalecimiento-en-la-prevencion-de-incendios.html">
          Plan Operativo Invernal 2026
        </TextLink>{" "}
        que incluye tareas destinadas a reducir el impacto de los incendios
        forestales.
      </>
    ),
  },
  {
    name: "Santa Cruz",
    body: (
      <>
        La provincia está en la etapa final de elaboración del Plan de
        Prevención de Incendios Forestales para alrededor de 430.000 hectáreas.
        La iniciativa logró la participación del Estado, vecinos y
        organizaciones de la sociedad civil, y en septiembre de 2026 había
        recibido{" "}
        <TextLink href="https://ahoracalafate.com.ar/contenido/43054/santa-cruz-avanza-en-un-plan-de-prevencion-de-incendios-forestales-en-mas-de-430">
          casi 100 propuestas
        </TextLink>
        . Se trata de{" "}
        <TextLink href="https://noticias.santacruz.gob.ar/organismos/gabinete/la-provincia-avanza-en-la-formulacion-del-plan-de-prevencion-de-incendios-forestales-en-zonas-de-bosques-nativos">
          una acción promovida por el Gobierno
        </TextLink>{" "}
        con el apoyo de la Organización de las Naciones Unidas. En agosto,
        autoridades del Consejo Agrario Provincial habían{" "}
        <TextLink href="https://www.tiemposur.com.ar/info-general/santa-cruz-refuerza-sus-acciones-ante-la-proximidad-de-la-temporada-critica">
          dado cuenta
        </TextLink>{" "}
        de las tareas de preparación acometidas para reducir el impacto de los
        incendios.
      </>
    ),
  },
  {
    name: "Tierra del Fuego",
    body: (
      <>
        La{" "}
        <TextLink href="https://prodyambiente.tierradelfuego.gob.ar/wp-content/uploads/2024/10/LEY-PROVINCIAL-N%C2%B0-1550-MENEJO-DEL-FUEGO.pdf">
          Ley 1.550
        </TextLink>{" "}
        organiza la prevención de incendios forestales y rurales en todo el
        territorio de la provincia mediante acciones, normas y procedimientos
        para evitar focos. El{" "}
        <TextLink href="https://prodyambiente.tierradelfuego.gob.ar/temporada-de-incendios/">
          portal
        </TextLink>{" "}
        del área de Ambiente presenta gran cantidad de información práctica
        dirigida a orientar a la población, como la recomendación de usar
        calentadores a gas en campamentos y trekkings, y las medidas de
        seguridad para las viviendas de la llamada interfase.
      </>
    ),
  },
];

function ProvinceAccordions() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mt-6 flex flex-col gap-4">
      {PROVINCE_STRATEGIES.map((province, index) => {
        const isOpen = openIndex === index;

        return (
          <details
            key={province.name}
            open={isOpen}
            className="group border border-foreground/15 bg-background/80 px-4 py-4"
          >
            <summary
              className="flex cursor-pointer list-none items-center justify-between gap-3 font-sans text-base font-bold [&::-webkit-details-marker]:hidden"
              onClick={(e) => {
                e.preventDefault();
                setOpenIndex((prev) => (prev === index ? null : index));
              }}
            >
              <span>{province.name}</span>
              <span
                aria-hidden
                className="shrink-0 text-foreground/70 transition-transform group-open:rotate-180"
              >
                ▾
              </span>
            </summary>
            <p className="mt-3 text-sm leading-snug text-foreground/85">
              {province.body}
            </p>
          </details>
        );
      })}
    </div>
  );
}

export function BudgetSection() {
  return (
    <section
      id="presupuesto"
      className="relative scroll-mt-8 bg-background text-foreground"
    >
      <div className="section-rule mx-auto max-w-[800px] px-5 pb-10 md:px-8">
        <h2 className="type-h2">El rol del Estado</h2>
        <p className="type-bajada">
          Nueve pedidos de acceso a la información, una decena de correos y una
          conclusión incómoda
        </p>

        <div className="type-stack">
          <p className="type-body">
            Si bien la normativa obliga a prevenir los incendios, esta
            investigación no pudo acceder a evidencia acerca de la existencia de
            una política pública preventiva clara y coordinada entre las
            distintas provincias de la Patagonia y las entidades nacionales. Si
            estos datos existen, la Ley de Acceso a la Información Pública (AIP)
            no funcionó para conseguirlos: las nueve solicitudes presentadas
            recibieron respuestas incompletas o directamente no consiguieron
            respuestas (
            <TextLink href="/anexo">ver anexo descriptivo</TextLink>
            ). Los organismos del Estado guardan silencio o hacen derivaciones a
            otros organismos. En algunos casos, las informaciones recibidas
            describen acciones generales no comprobables o carencias de
            equipamiento.
          </p>
          <p className="type-body">
          Para este estudio se solicitaron datos a la Agencia Federal de Emergencias (AFE), organismo del Ministerio de Seguridad Nacional; a la Dirección Nacional de Bosques de la Subsecretaría de Ambiente de la Nación en consultas específicas sobre las provincias de Santa Cruz y Tierra del Fuego, Antártida e Islas del Atlántico Sur; a la Administración de Parques Nacionales, organismo autárquico y con enfoque en las jurisdicciones de Santa Cruz (solicitud de información por los parques nacionales Los Glaciares, Perito Moreno y Parque Nacional Patagonia) y Tierra del Fuego (consulta por el Parque Nacional Tierra del Fuego); al Servicio Meteorológico Nacional, en el ámbito del Ministerio de Defensa; a la Secretaría de Emergencias y Gestión de Riesgos del Ministerio de Seguridad de Neuquén; a la Secretaría de Bosques de Chubut encargada del Servicio Provincial del Manejo del Fuego y la gestión del Ordenamiento Territorial de Bosques Nativos (OTBN), y al Servicio de Prevención y Lucha contra los Incendios Forestales (SPLIF) del Ministerio de Desarrollo Económico y Productivo de Río Negro.

          </p>
          <p className="type-body">
            Tampoco se pudo concertar entrevistas con la mayoría de los
            responsables locales de la prevención a quienes se les mandó, en
            total, una decena de correos electrónicos. El equipo de FOCO
            Bootcamp contactó en Neuquén, a Luna Luciana Ortíz, secretaria de
            Emergencias y Gestión de Riesgos; en Río Negro, a Orlando Isaías
            Báez, coordinador del Servicio de Prevención y Lucha contra los
            Incendios Forestales (SPLIF); en Chubut, a Abel Nievas, secretario
            de Bosques; en Santa Cruz, a Ayelén Alberti, funcionaria a cargo de
            la Dirección Provincial de Bosques y Parques, y en Tierra del Fuego,
            a Rodrigo Cía, subsecretario de Manejo del Fuego. De todos estos
            funcionarios, el único que efectivamente permitió un diálogo fue
            Nievas, aunque en la conversación dijo que carecía de datos sobre
            recursos aplicados a la labor preventiva en Chubut.
          </p>
        </div>

        <h3 className="type-h3">Las leyes que no se traducen en política</h3>
        <div className="type-stack mt-4">
          <p className="type-body">
            La Ley Nacional de Manejo del Fuego (
            <TextLink href="https://www.argentina.gob.ar/normativa/nacional/ley-26815-207401/texto">
              26.815
            </TextLink>
            ) fija los presupuestos mínimos para la prevención y el combate,
            crea el Sistema Federal de Manejo del Fuego y exige{" "}
            <TextLink href="https://www.argentina.gob.ar/parquesnacionales/direccion-de-lucha-contra-incendios-forestales-y-emergencias-dlife/manejo-0">
              planificaciones
            </TextLink>{" "}
            provinciales, regionales y nacionales; la Ley de Bosques Nativos (
            <TextLink href="https://www.argentina.gob.ar/normativa/nacional/ley-26331-136125/texto">
              26.331
            </TextLink>
            ) obliga a las provincias a ordenar territorialmente sus masas
            boscosas según su valor de conservación. Salvo Santa Cruz, las
            provincias patagónicas cuentan además con legislación específica.
            Estas acciones se complementan con evaluaciones de carga de
            combustible vegetal (toda biomasa que potencialmente puede arder al
            ser expuesta a una fuente de calor) y con el monitoreo del índice
            meteorológico de peligro (FWI), una herramienta basada en el{" "}
            <TextLink href="https://www.argentina.gob.ar/parquesnacionales/direccion-de-lucha-contra-incendios-forestales-y-emergencias-dlife/manejo-1">
              Sistema Canadiense de Evaluación de Peligro de Incendios
              Forestales
            </TextLink>
            , que la Argentina adoptó en el año 2000.
          </p>
          <p className="type-body">
            El índice se calcula a partir de datos meteorológicos, y permite
            estimar la probabilidad de inicio de un incendio y predecir su
            comportamiento. El Servicio Meteorológico Nacional (SMN) tiene 5
            estaciones meteorológicas en la ecorregión Andina Patagónica:
            Chapelco (San Martín de los Andes), Bariloche, El Bolsón, Esquel y
            Lago Argentino.
          </p>
          <p className="type-body">
            Abel Nievas, secretario de Bosques de Chubut, trabajó casi 30 años
            en el Servicio Provincial de Manejo del Fuego. En un diálogo con
            este equipo de FOCO Bootcamp, explica que el FWI se utiliza para
            monitorear el riesgo y planificar las acciones de control. Por
            ejemplo, con un nivel de bajo a moderado, la brigada puede estar a
            más de 15 o 20 minutos de la base haciendo quemas o tareas de
            prevención. A medida que el nivel aumenta a muy alto y extremo,
            tienen que estar con los equipos cargados en la camioneta para dar
            una respuesta inmediata ante una alerta de incendio, agrega Nievas.
          </p>
          <p className="type-body">
            Sobre el manejo de combustibles de origen vegetal, Nievas comenta
            que los planes invernales que se realizan cada año incluyen trabajos
            de silvicultura y quemas preventivas. Cuanto mayor sea la
            acumulación de combustibles en una zona, mayor cantidad de calor
            podrá desprenderse y el incendio podría ser más intenso.
          </p>
        </div>

        <Quote
          quote={
            <>
              “Después del{" "}
              <TextLink href="https://www.rionegro.com.ar/sociedad/heridas-abiertas-a-3-anos-de-los-incendios-mas-destructivos-de-la-cordillera-3456843/">
                incendio de 2021
              </TextLink>
              , donde se quemaron 500 casas, reanalizamos las campañas de
              prevención, y se conformó una mesa comarcal junto con Parques
              Nacionales, con el Servicio de Prevención y Lucha contra los
              Incendios Forestales (SPLIF) de Río Negro y con el Servicio
              Nacional de Manejo del Fuego. En general, se advierte que la
              respuesta coordinada está más bien dirigida a reaccionar a un
              incendio, no a evitarlo”.
            </>
          }
          name="Abel Nievas"
          role="Secretario de Bosques de Chubut"
        />

        <div className="type-stack">
          <p className="type-body">
            Esa coordinación de organismos está pensada para reaccionar, no para
            prevenir. El Sistema Federal de Manejo del Fuego, creado por la Ley
            26.815, está integrado por el Servicio Nacional de Manejo del Fuego,
            la Administración de Parques Nacionales, las provincias y la Ciudad
            Autónoma de Buenos Aires. Sin embargo, el Decreto 1.136/2024
            dictado durante la administración del presidente Javier Milei derivó
            esta política ambiental al Ministerio de Seguridad, que pasó a ser
            la Autoridad Nacional de Aplicación de la Ley 26.815.
          </p>
          <div>
            <p className="type-body font-bold">
              La respuesta a un incendio se organiza en tres niveles:
            </p>
            <ul className="mt-4 list-disc space-y-3 pl-5">
              {LEVELS.map((item) => (
                <li key={item} className="type-body">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <h3 className="type-h3">Esfuerzos aislados</h3>
        <div className="type-stack mt-4">
          <p className="type-body">
            Las acciones preventivas detectadas en las provincias patagónicas se
            presentan como esfuerzos aislados, con diferente grado de alcance y
            consolidación. En algunas jurisdicciones se observa más
            sistematización que en otras, pero todas parecen en marcha de una
            forma u otra. Para hacer este análisis se tomó fundamentalmente en
            cuenta la información disponible para el público general.
          </p>
        </div>

        <h4 className="type-h4">Las estrategias, provincia por provincia</h4>
        <ProvinceAccordions />

        <div className="type-stack mt-8">
          <p className="type-body">
            Por su parte el Servicio Nacional de Manejo del Fuego precisó que la
            Regional Patagonia dispone de un equipo interdisciplinario de
            aproximadamente 30 personas. Este staff está a cargo, entre otras
            actividades de concientización, de brindar charlas en instituciones
            educativas y organizar conversatorios abiertos a la comunidad. Estas
            tareas se realizan con el personal designado por las provincias y
            por Parques Nacionales.
          </p>
          <p className="type-body">
            ¿Cuánto se invierte realmente en prevención? Pese a haber presentado
            9 pedidos de acceso a la información pública a autoridades
            nacionales y provinciales, no fue posible obtener datos precisos
            sobre los presupuestos destinados a las estrategias destinadas a
            evitar los incendios.
          </p>
        </div>

        <Quote
          quote="“En algún momento creí que era una cuestión presupuestaria, pero, cuando los fondos aparecen durante la emergencia queda demostrado que, cuando se quiere, están”."
          name="Daniel Díaz"
          role="Jefe de Bomberos de Epuyén"
        />

        <div className="type-stack">
          <p className="type-body">
            Los incendios exhiben escenas dramáticas. Especialistas consultados
            para esta investigación dicen que la espectacularidad del fuego
            condiciona los presupuestos y hacia dónde va la atención de quienes
            gestionan los recursos. Muchas veces se priorizan las escenas
            cinematográficas por sobre las acciones “invisibles” de prevención.
          </p>
          <p className="type-body">
            “El enfoque reactivo sobre los incendios puede identificarse también
            en la publicidad que reciben estos eventos y en el sensacionalismo
            de un avión hidrante que lanza 10.000 litros con precisión en
            contraste con la exposición que tiene el barrido rutinario de
            material seco. Vende, ‘garpa’, hacer propaganda durante una
            catástrofe, cuando está toda la atención puesta ahí y aparecer con
            millones de dólares para combatir incendios. Lamentablemente no
            tendría el mismo impacto social o quizás eso creen quienes toman
            decisiones el trabajar en prevención”, reflexiona Díaz, jefe de
            Bomberos de Epuyén.
          </p>
        </div>

        <div className="relative left-1/2 mt-14 mb-12 w-screen -translate-x-1/2">
          <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8">
            <FirePhoto photo={FIRE_PHOTOS[0]} />
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-5">
              <FirePhoto photo={FIRE_PHOTOS[1]} />
              <FirePhoto photo={FIRE_PHOTOS[2]} />
            </div>
          </div>
        </div>

        <h3 className="type-h3 is-flush">Presupuesto nacional</h3>
        <div className="type-stack mt-4">
          <p className="type-body">
            Durante sus dos primeros años de gestión, el Gobierno de Javier
            Milei no tuvo una Ley de Presupuesto aprobada por el Congreso. En
            2024 y 2025 se usó el presupuesto prorrogado de 2023, lo que dio al
            Poder Ejecutivo un margen amplio para modificar las partidas. Recién
            en 2026 el Gobierno cuenta con una Ley de Presupuesto.
          </p>
          <p className="type-body">
            Este proceso vino acompañado de un debilitamiento institucional del
            ex Ministerio de Ambiente y Desarrollo Sostenible, que pasó a ser
            una Subsecretaría, y del cierre de programas y herramientas para la
            ejecución de políticas ambientales. Entre ellas se destaca la
            disolución de los fondos fiduciarios de{" "}
            <TextLink href="https://www.boletinoficial.gob.ar/detalleAviso/primera/328018/20250708">
              Manejo del Fuego
            </TextLink>{" "}
            y de{" "}
            <TextLink href="https://www.boletinoficial.gob.ar/detalleAviso/primera/315308/20241008">
              Protección Ambiental de los Bosques Nativos
            </TextLink>
            , ambos vinculados con el Servicio Nacional de Manejo del Fuego.
          </p>
          <p className="type-body">
            Según el{" "}
            <TextLink href="https://farn.org.ar/wp-content/uploads/2026/04/Presupuesto-ambiental-en-Argentina-la-consolidacion-de-un-ajuste.pdf">
              Monitor Ambiental de Presupuesto
            </TextLink>{" "}
            de la Fundación Ambiente y Recursos Naturales (FARN), los
            fideicomisos agilizaban las transferencias a las provincias,
            permitían controlar mejor el uso de los fondos, y facilitaban
            planificar políticas de conservación a mediano y largo plazo.
          </p>
          <p className="type-body">
            A este panorama se suma la{" "}
            <TextLink href="https://farn.org.ar/wp-content/uploads/2026/09/Monitor-Ambiental-Presupuesto-Hacia-una-nueva-normalidad-ajuste-y-desfinanciamiento-de-la-politica-ambiental.pdf">
              caída real presupuestaria
            </TextLink>{" "}
            en el Servicio Meteorológico Nacional y la Administración Nacional
            de Parques Nacionales.
          </p>
          <p className="type-body">
            En el año 2024 se registró la menor ejecución presupuestaria del
            Servicio Nacional de Manejo del Fuego desde 2017: el gasto en esta
            área alcanzó el 22% de los recursos disponibles.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-[800px] space-y-16 px-5 md:px-8">
        <BudgetExecutionChart
          data={ALL_POINTS}
          title="Ejecución presupuestaria del Servicio Nacional del Manejo del Fuego"
          note={
            <>
              En millones de pesos
            </>
          }
          source={
            <>
              <TextLink href="https://monitorpresupuestario.acij.org.ar/explorar/monitor">
                Monitor Presupuestario
              </TextLink>{" "}
              de la Asociación Civil por la Igualdad y la Justicia (ACIJ) con
              base en Presupuesto Abierto.
            </>
          }
        />

        <p className="type-body">
            De acuerdo con el{" "}
            <TextLink href="https://farn.org.ar/presupuesto-2027-ajuste-ambiente/">
              análisis
            </TextLink>{" "}
            de FARN, los fondos destinados al Servicio Nacional de Manejo del
            Fuego (SNMF) en el proyecto de Presupuesto 2027 ascienden a $38.815
            millones, esto implica un aumento real del 60,1% respecto de 2026,
            pero una caída del 55,8% en relación con la misma partida de 2023.
            Estos recursos no sólo deben emplearse en tareas de combate del
            fuego, sino también de prevención.
          </p>
        {/* <BudgetExecutionChart
          data={FOREST_POINTS}
          title="Ejecución presupuestaria del Fondo de Bosques"
          note="En millones de pesos."
          missingLabel="Sin dato"
          source={budget.forestFund.source}
        /> */}
      </div>

    </section>
  );
}
