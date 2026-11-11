"use client";

import budget from "@/data/budget.json";
import {
  BudgetExecutionChart,
  type BudgetExecPoint,
} from "@/components/charts/BudgetExecutionChart";
import { Quote } from "@/components/Quote";
import { TextLink } from "@/components/TextLink";

const ALL_POINTS = budget.execution as BudgetExecPoint[];
const FOREST_POINTS = budget.forestFund.series as BudgetExecPoint[];

const LEVELS = [
  "Primero interviene la autoridad jurisdiccional, ya sea la provincia involucrada en el evento o el Parque Nacional.",
  "Si hacen falta refuerzos, se solicita apoyo regional a través del Coordinador Regional del Sistema Nacional del Manejo del Fuego.",
  "Y si la situación supera la capacidad de respuesta disponible, se pide la intervención extrarregional del Servicio Nacional.",
] as const;

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
            Para este estudio se solicitaron datos a la Agencia Federal de
            Emergencias (AFE); organismo dependiente del Ministerio de Seguridad
            Nacional, a la Dirección Nacional de Bosques perteneciente a la
            Subsecretaría de Ambiente de la Nación en consultas específicas
            sobre las provincias de Santa Cruz y Tierra del Fuego, Antártida e
            Islas del Atlántico Sur; a la Administración de Parques Nacionales,
            organismo autárquico y con enfoque en las jurisdicciones de Santa
            Cruz (solicitud de información por los parques nacionales Los
            Glaciares, Perito Moreno y Parque Nacional Patagonia) y Tierra del
            Fuego (consulta por el Parque Nacional Tierra del Fuego), al
            Servicio Meteorológico Nacional, en la esfera del Ministerio de
            Defensa; a la Secretaría de Emergencias y Gestión de Riesgos,
            perteneciente al Ministerio de Seguridad de Neuquén; a la Secretaría
            de Bosques de Chubut encargada del Servicio Provincial del Manejo
            del Fuego y la gestión del Ordenamiento Territorial de Bosques
            Nativos (OTBN) y al Servicio de Prevención y Lucha contra los
            Incendios Forestales (SPLIF) en la esfera del Ministerio de
            Desarrollo Económico y Productivo de Río Negro.
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
              incendio, no a evitarlo.”
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
            Las acciones preventivas detectadas se presentan como esfuerzos
            aislados. La investigación identificó, por ejemplo, que en Chubut se
            desarrolla una campaña educativa anual contra los incendios dirigida
            a las escuelas primarias y capacitaciones destinadas al personal
            docente.
          </p>
          <p className="type-body">
            El Servicio Nacional de Manejo del Fuego precisó que la Regional
            Patagonia dispone de un equipo interdisciplinario de aproximadamente
            30 personas. Este staff está a cargo, entre otras actividades de
            concientización, de brindar charlas en instituciones educativas y
            organizar conversatorios abiertos a la comunidad. Estas tareas se
            realizan con el personal designado por las provincias y por Parques
            Nacionales.
          </p>
          <p className="type-body">
            Más allá de lo que establece la normativa, queda en el aire una
            pregunta: ¿cuánto se invierte realmente en prevención? Pese a haber
            presentado 9 pedidos de acceso a la información pública a
            autoridades nacionales y provinciales, no fue posible obtener datos
            precisos sobre los presupuestos destinados a las estrategias
            destinadas a evitar los incendios.
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

        <h3 className="type-h3">Presupuesto nacional</h3>
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
            pero a una caída del 55,8% en relación con la misma partida de 2023.
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
