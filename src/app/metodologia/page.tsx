import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import sources from "@/data/sources.json";
import { TextLink } from "@/components/TextLink";

type SourceRow = {
  info: string;
  source: string;
  url: string | null;
};

const rows = sources as SourceRow[];

const AIP_REQUESTS: {
  organ: string;
  date: string;
  request: string;
  response: string;
}[] = [
  {
    organ:
      "Secretaría de Bosques de Chubut (Servicio Provincial de Manejo del Fuego)",
    date: "30/07/2026 (presentado en formato impreso el 10/08/2026, a pedido del organismo)",
    request:
      "Faros de Conservación y sistemas de detección temprana; erradicación de especies exóticas y mantenimiento de cortafuegos; nómina del Servicio Provincial de Manejo del Fuego; ejecución de fondos de las leyes 26.331 y 26.815.",
    response:
      "Respondió parcialmente (24/08/2026). Sin datos presupuestarios ni series anuales.",
  },
  {
    organ: "Agencia Federal de Emergencias (Ministerio de Seguridad Nacional)",
    date: "31/07/2026",
    request:
      "Datos técnicos y presupuestarios 2016-2026 sobre detección temprana, manejo de material combustible, cortafuegos, personal, equipamiento, aviones vigía, monitoreo hídrico, rutas de evacuación e informes de alerta temprana.",
    response:
      "Respondió parcialmente (24/08/2026). Sin datos presupuestarios; derivó puntos a la Administración de Parques Nacionales (que respondió el 17/09/2026) y al Instituto Nacional del Agua (sin respuesta).",
  },
  {
    organ: "Servicio Meteorológico Nacional (Ministerio de Defensa)",
    date: "03/08/2026",
    request:
      "Datos meteorológicos mensuales de la región patagónica (diciembre a marzo, 2016-2026): temperatura, amplitud térmica, precipitaciones y viento.",
    response: "Respondió (27/08/2026).",
  },
  {
    organ:
      "Administración de Parques Nacionales (Santa Cruz: PN Los Glaciares, Perito Moreno y Patagonia)",
    date: "14/08/2026",
    request:
      "Personal, equipos de protección personal y capacitaciones, presupuesto, planes de manejo, mapas de riesgo, acuerdos interinstitucionales y registro de tierras quemadas.",
    response:
      "Respondió parcialmente (24/08 y 07/09/2026). Detalle completo solo del PN Patagonia; sin presupuesto desagregado.",
  },
  {
    organ: "Dirección Nacional de Bosques (Santa Cruz)",
    date: "14/08/2026",
    request:
      "Fondos de las leyes 26.331 y 26.815 asignados y transferidos a Santa Cruz, distribución por categorías de ordenamiento territorial, personal y bienes adquiridos.",
    response:
      "Respondió parcialmente (octubre de 2026). Informó transferencias anuales; sin desagregado por categorías de ordenamiento territorial.",
  },
  {
    organ: "Dirección Nacional de Bosques (Tierra del Fuego)",
    date: "14/08/2026 (presentado nuevamente ante la Jefatura de Gabinete de Ministros el 24/08/2026)",
    request:
      "Fondos de las leyes 26.331 y 26.815 asignados y transferidos a Tierra del Fuego, distribución por categorías de ordenamiento territorial, personal y bienes adquiridos.",
    response: "Respondió (08/09 y 16/10/2026).",
  },
  {
    organ:
      "Administración de Parques Nacionales (Tierra del Fuego: PN Tierra del Fuego)",
    date: "24/08/2026",
    request:
      "Personal, equipamiento, presupuesto, planes de manejo, mapas de riesgo, acuerdos interinstitucionales y registro de tierras quemadas.",
    response:
      "Derivado por la Jefatura de Gabinete al Ministerio de Seguridad (02/09/2026) y por este a Parques Nacionales (09/09/2026).",
  },
  {
    organ: "Secretaría de Emergencias y Gestión de Riesgos de Neuquén",
    date: "14/08/2026",
    request: "Plan provincial de protección contra incendios, personal y presupuesto.",
    response: "Sin respuesta.",
  },
  {
    organ:
      "Servicio de Prevención y Lucha contra Incendios Forestales de Río Negro",
    date: "14/08/2026",
    request:
      "Plan provincial de manejo del fuego, informes técnicos, personal y presupuesto.",
    response: "Sin respuesta.",
  },
];

const OPEN_SOURCES: { label: string; href: string; note?: string }[] = [
  {
    label: "Greenpeace — Reporte de incendios 2025-2026",
    href: "https://www.greenpeace.org/static/planet4-argentina-stateless/2026/05/a3a80031-reporte-incendios-gp-2025-26.pdf",
  },
  {
    label: "Ley Nacional de Manejo del Fuego 26.815",
    href: "https://www.argentina.gob.ar/normativa/nacional/ley-26815-207401/texto",
  },
  {
    label: "Ley de Bosques Nativos 26.331",
    href: "https://www.argentina.gob.ar/normativa/nacional/ley-26331-136125/texto",
  },
  ...rows
    .filter((row) => row.url)
    .map((row) => ({ label: row.info, href: row.url as string, note: row.source })),
];

export const metadata: Metadata = {
  title: "Metodología de investigación",
  description:
    "Cómo se hizo esta investigación de FOCO Bootcamp sobre incendios forestales en la Patagonia: marco del programa, pedidos de acceso a la información y fuentes.",
};

function Question({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-foreground/20 pt-8">
      <h2 className="type-h4 is-flush">{title}</h2>
      <div className="type-stack mt-4">{children}</div>
    </section>
  );
}

export default function MetodologiaPage() {
  return (
    <main className="bg-background text-foreground">
      <article className="mx-auto max-w-[800px] px-5 py-16 md:px-8 md:py-24">
        <p className="mb-10 flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/">Volver a la investigación</Link>
          <Link href="/anexo">Anexo</Link>
        </p>

        <p className="text-xs font-semibold tracking-[0.2em] text-foreground/70 uppercase">
          Cómo se hizo
        </p>
        <h1 className="type-h2 mt-3">Metodología de investigación</h1>

        <div className="mt-10 space-y-8">
          <Question title="¿Qué es FOCO Bootcamp?">
            <p className="type-body">
              FOCO / Bootcamp de Periodismo, Acceso a la Información Pública y
              Visualización de Datos (FOCO Bootcamp) es un proyecto de Fundación
              Transparencia Activa (FTA) y del Foro de Periodismo Argentino
              (FOPEA). Se trata de una experiencia de formación intensiva
              dirigida a generar visualizaciones digitales de gran impacto de
              investigaciones periodísticas basadas en pedidos de acceso a la
              información pública (AIP). Esta capacitación de excelencia fundada
              en la práctica y la colaboración interdisciplinaria está orientada
              a beneficiarios convencidos de la necesidad e importancia de que
              la sociedad acceda a datos y evidencia clave de interés general;
              pueda comprender sus implicancias, y tome decisiones informadas en
              términos individuales y colectivos.
            </p>
          </Question>

          <Question title="¿Qué organizaciones coordinan el proyecto?">
            <p className="type-body">
              FOCO Bootcamp es organizado por la Fundación Transparencia Activa
              (FTA) y el Foro de Periodismo Argentino (FOPEA).
            </p>
            <h3 className="type-h4">
              <TextLink href="https://www.transparenciaactiva.org.ar/">
                Sobre FTA
              </TextLink>
            </h3>
            <p className="type-body">
              La Fundación Transparencia Activa (FTA) es una organización de la
              sociedad civil con sede en la Argentina orientada a promover y
              garantizar el derecho de acceso a la información pública entendido
              como una herramienta esencial para la libertad de expresión, la
              participación ciudadana y el fortalecimiento democrático. Su
              trabajo se enfoca en el fortalecimiento de las capacidades de la
              ciudadanía, periodistas e investigadores para acceder, analizar y
              reutilizar información pública, así como en la promoción de
              estándares de transparencia tanto en el sector público como en el
              privado para eliminar barreras de accesibilidad de la información.
            </p>
            <h3 className="type-h4">
              <TextLink href="http://www.fopea.org/">Sobre FOPEA</TextLink>
            </h3>
            <p className="type-body">
              El Foro de Periodismo Argentino nació en 2002 como un espacio para
              la reflexión, el diálogo y la promoción del periodismo de calidad.
              Se trata de una organización no gubernamental sin fines de lucro
              creada por un grupo de profesionales de medios de comunicación y
              docentes afines al oficio. Entre sus objetivos está defender las
              libertades de prensa y de expresión mediante la denuncia de las
              restricciones impuestas a este derecho básico de la democracia y
              la protección de los periodistas; estimular la profesionalización
              mediante la capacitación, y liderar los debates sobre las
              cuestiones más relevantes de la práctica del oficio (por ejemplo,
              la ética, el acceso a la información pública, la transparencia, la
              gestión responsable de la publicidad oficial y la innovación). Con
              una agenda decididamente federal, FOPEA es la entidad de
              periodistas de referencia en el país.
            </p>
          </Question>

          <Question title="¿De dónde proviene el financiamiento?">
            <p className="type-body">
              El programa recibió el apoyo de la Embajada de Suiza, y la
              colaboración de las embajadas de Alemania y de Francia (Comunidad
              Informada).
            </p>
          </Question>

          <Question title="¿Cómo se seleccionaron los temas de investigación?">
            <p className="type-body">
              Los temas de investigación de FOCO Bootcamp fueron seleccionados
              en función de su originalidad, profundidad, calidad, novedad,
              potencial de visualización y valor para el debate democrático. En
              esta edición del Bootcamp se procuró especialmente que los temas
              admitieran pedidos de acceso a la información pública.
            </p>
          </Question>

          <Question title="¿Cómo se seleccionaron los investigadores?">
            <p className="type-body">
              Los becarios de FOCO Bootcamp fueron seleccionados a partir de los
              siguientes criterios:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li className="type-body">
                La motivación para participar en el programa.
              </li>
              <li className="type-body">
                El compromiso con el acceso a la información pública.
              </li>
              <li className="type-body">
                La diversidad en términos de edad, experiencia, lugar de
                residencia y género.
              </li>
              <li className="type-body">
                La calidad y originalidad de las propuestas en el caso de las
                investigaciones.
              </li>
              <li className="type-body">
                La creatividad, la vocación innovadora y el espíritu de
                colaboración.
              </li>
              <li className="type-body">
                La experiencia que, en el supuesto de los estudiantes, será
                compensada con el grado de progreso en los estudios y otros
                antecedentes.
              </li>
              <li className="type-body">
                La adhesión a las{" "}
                <TextLink href="https://fopea.org/transparencia-activa-y-fopea-presentan-foco-bootcamp/">
                  bases de FOCO Bootcamp
                </TextLink>{" "}
                y al{" "}
                <TextLink href="https://fopea.org/codigo-de-etica/">
                  Código de Ética de FOPEA
                </TextLink>
                .
              </li>
            </ul>
          </Question>

          <Question title="¿Cómo se investigó el asunto desarrollado en esta visualización?">
            <p className="type-body">
              La investigación reconstruye cómo se planifican, financian y
              ejecutan las políticas de prevención y combate de incendios
              forestales en la Patagonia argentina, con foco en la actuación del
              Estado antes, durante y después de las emergencias.
            </p>
            <p className="type-body">
              El punto de partida fueron los incendios de la temporada 2025-2026
              y la pregunta de si existe una política pública preventiva
              coordinada entre las provincias de la Patagonia y los organismos
              nacionales.
            </p>
            <p className="type-body">
              El trabajo combina pedidos de acceso a la información pública;
              entrevistas periodísticas; análisis de legislación nacional y
              provincial; datos presupuestarios; estadísticas oficiales;
              documentos técnicos y bibliografía científica. Para eso se
              desplegaron las siguientes acciones:
            </p>
            <ol className="list-decimal space-y-2 pl-5">
              <li className="type-body">
                Nueve pedidos de acceso a la información pública a la Agencia
                Federal de Emergencias; a la Dirección Nacional de Bosques; a la
                Administración de Parques Nacionales; al Servicio Meteorológico
                Nacional; a la Secretaría de Emergencias y Gestión de Riesgos de
                Neuquén; a la Secretaría de Bosques de Chubut; y al Servicio de
                Prevención y Lucha contra los Incendios Forestales (SPLIF) de
                Río Negro.
              </li>
              <li className="type-body">
                Pedidos de entrevista a las autoridades provinciales de
                prevención y manejo del fuego.
              </li>
              <li className="type-body">
                Relevamiento de la cartografía del Ordenamiento Territorial de
                Bosques Nativos, de las áreas quemadas y de la literatura
                científica sobre inflamabilidad.
              </li>
              <li className="type-body">
                Testimonios de brigadistas, bomberos y de las organizaciones que
                intervienen después del fuego.
              </li>
            </ol>
          </Question>

          <Question title="¿Qué fuentes documentales se consultaron?">
            <p className="type-body">
              Se relevaron datos correspondientes principalmente al período
              2016-2026, incorporando antecedentes normativos, presupuestarios y
              ambientales necesarios para contextualizar la evolución de las
              políticas públicas. Para ello, se analizaron las siguientes
              fuentes:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li className="type-body">
                <TextLink href="https://www.argentina.gob.ar/normativa/nacional/ley-26815-207401/texto">
                  Ley 26.815 de Manejo del Fuego
                </TextLink>
                .
              </li>
              <li className="type-body">
                <TextLink href="https://www.argentina.gob.ar/normativa/nacional/ley-26331-136125/texto">
                  Ley 26.331 de Bosques Nativos
                </TextLink>
                .
              </li>
              <li className="type-body">
                Ley 27.275 de Acceso a la Información Pública y leyes
                provinciales de acceso a la información pública local.
              </li>
              <li className="type-body">Decreto 1.136/2024.</li>
              <li className="type-body">
                Decreto 888/2024 (disolución del fondo fiduciario de Protección
                Ambiental de los Bosques Nativos).
              </li>
              <li className="type-body">
                Decreto 463/2025 (disolución del fondo fiduciario del Sistema
                Nacional de Manejo del Fuego).
              </li>
              <li className="type-body">Ley de Presupuesto 2026.</li>
              <li className="type-body">Presupuesto Abierto.</li>
              <li className="type-body">
                <TextLink href="https://monitorpresupuestario.acij.org.ar/explorar/monitor">
                  Monitor Presupuestario de la Asociación Civil por la Igualdad
                  y la Justicia (ACIJ)
                </TextLink>
                .
              </li>
              <li className="type-body">
                Datos presupuestarios procesados por la{" "}
                <TextLink href="https://farn.org.ar/">
                  Fundación Ambiente y Recursos Naturales (FARN)
                </TextLink>
                .
              </li>
              <li className="type-body">
                Información del Servicio Meteorológico Nacional.
              </li>
              <li className="type-body">Información del INDEC.</li>
              <li className="type-body">
                Información del Servicio Nacional de Manejo del Fuego.
              </li>
              <li className="type-body">
                Información de la Administración de Parques Nacionales.
              </li>
              <li className="type-body">
                Cartografía y normativa de Ordenamiento Territorial de Bosques
                Nativos.
              </li>
              <li className="type-body">
                <TextLink href="https://www.greenpeace.org/static/planet4-argentina-stateless/2026/05/a3a80031-reporte-incendios-gp-2025-26.pdf">
                  Reporte de incendios 2025-2026 de Greenpeace
                </TextLink>
                ; publicaciones del CENPAT-CONICET y de CONICET–Fundación
                Bariloche; estudio sobre interfase urbano-forestal en la
                Comarca Andina (
                <TextLink href="https://silvis.forest.wisc.edu/wp-content/uploads/2018/12/Godoy_etal_IJWF_ArgentinaWUI_2019.pdf">
                  Godoy et al., 2019
                </TextLink>
                ).
              </li>
            </ul>
          </Question>

          <Question title="¿Qué voces se incorporaron a la investigación?">
            <p className="type-body">
              Además, se realizaron entrevistas a actores que participaron
              directamente de los incendios forestales o que trabajan en
              prevención y combate del fuego:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li className="type-body">
                Rubén Oliva, presidente de la Federación de Bomberos Voluntarios
                de Chubut.
              </li>
              <li className="type-body">
                Daniel Díaz, jefe de Bomberos Voluntarios de Epuyén.
              </li>
              <li className="type-body">
                Natalia Dobranski, jefa de la Brigada Forestal de Mallín Ahogado
                (Río Negro).
              </li>
              <li className="type-body">
                Hernán Andrade, ex vecino de Las Golondrinas (Chubut).
              </li>
              <li className="type-body">
                Lucas Berengua, meteorólogo del Servicio Meteorológico Nacional.
              </li>
              <li className="type-body">
                Abel Nievas, secretario de Bosques de Chubut.
              </li>
            </ul>
            <p className="type-body">
              La investigación también incorporó información técnica proveniente
              de respuestas oficiales remitidas por organismos nacionales y
              provinciales, además del análisis de documentación presupuestaria
              y administrativa vinculada al Sistema Nacional de Manejo del
              Fuego.
            </p>
          </Question>

          <Question title="¿Cuál es el objetivo de esta investigación?">
            <p className="type-body">
              El objetivo es exponer el hallazgo principal de la pesquisa: que
              las políticas públicas destinadas a los incendios forestales en la
              Patagonia priorizan la respuesta durante la emergencia por encima
              de la prevención.
            </p>
            <p className="type-body">
              A partir del análisis de presupuestos, normativa, pedidos de
              acceso a la información pública, documentación oficial y
              testimonios de quienes participan en el combate de los incendios,
              la investigación busca determinar cómo se distribuyen los recursos
              públicos destinados al manejo del fuego, qué herramientas
              preventivas existen, cuáles dejaron de funcionar, qué información
              produce el Estado y cuáles son las limitaciones para conocer el
              destino de esos fondos.
            </p>
            <p className="type-body">
              Mostrar, mediante mapas, gráficos y el relato de quienes combaten
              y padecen el fuego, que la Patagonia carece de una preparación a
              la altura de los incendios que afectan sus bosques. A falta de una
              prevención coordinada y de un presupuesto claro, la emergencia es
              el único plan.
            </p>
          </Question>

          <Question title="¿Cuántos pedidos de acceso a la información pública (AIP) se presentaron?">
            <p className="type-body">
              Se presentaron nueve solicitudes de acceso a la información
              pública. Una de ellas debió presentarse dos veces por derivaciones
              entre organismos. La cronología completa está en el anexo.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[56rem] border-collapse text-left text-sm">
                <thead>
                  <tr>
                    <th className="border-b border-foreground/30 px-3 py-2 font-bold">
                      Órgano responsable de proporcionar la información
                    </th>
                    <th className="border-b border-foreground/30 px-3 py-2 font-bold">
                      Fecha
                    </th>
                    <th className="border-b border-foreground/30 px-3 py-2 font-bold">
                      Solicitud realizada
                    </th>
                    <th className="border-b border-foreground/30 px-3 py-2 font-bold">
                      Respuesta recibida
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {AIP_REQUESTS.map((row) => (
                    <tr key={row.organ}>
                      <td className="border-b border-foreground/15 px-3 py-2 align-top">
                        {row.organ}
                      </td>
                      <td className="border-b border-foreground/15 px-3 py-2 align-top">
                        {row.date}
                      </td>
                      <td className="border-b border-foreground/15 px-3 py-2 align-top">
                        {row.request}
                      </td>
                      <td className="border-b border-foreground/15 px-3 py-2 align-top">
                        {row.response}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="type-body">
              Ninguna de las respuestas permitió conocer cuánto se invierte en
              prevención. Se detectaron omisiones de información presupuestaria,
              ausencia de series históricas, derivaciones entre organismos,
              respuestas parciales e información agregada que impidió
              reconstruir con precisión la evolución anual de los recursos
              destinados a la prevención. Al menos tres respuestas (Chubut,
              Agencia Federal de Emergencias y Servicio Meteorológico Nacional)
              llegaron después del plazo legal.
            </p>
            <p className="type-body">
              <TextLink href="/anexo">Leer el anexo descriptivo</TextLink>
            </p>
          </Question>

          <Question title="¿En qué período se buscaron los datos y cuándo se publicaron los resultados?">
            <p className="type-body">
              La investigación reúne información correspondiente principalmente
              al período 2016-2026, incluyendo datos presupuestarios, informes
              meteorológicos, normativa, políticas públicas, adquisiciones de
              equipamiento, acciones de prevención y documentación oficial
              producida durante esos años.
            </p>
            <p className="type-body">
              Los pedidos de acceso a la información y los contactos con las
              autoridades se realizaron entre agosto y octubre de 2026. El
              trabajo se publica el 18 de noviembre de 2026.
            </p>
          </Question>

          <Question title="¿Se consultaron autoridades estatales?">
            <p className="type-body">Sí. Se solicitaron datos oficiales a:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li className="type-body">Agencia Federal de Emergencias.</li>
              <li className="type-body">Servicio Meteorológico Nacional.</li>
              <li className="type-body">
                Administración de Parques Nacionales.
              </li>
              <li className="type-body">Dirección Nacional de Bosques.</li>
              <li className="type-body">Jefatura de Gabinete de Ministros.</li>
              <li className="type-body">
                Secretaría de Bosques de Chubut (Servicio Provincial de Manejo
                del Fuego).
              </li>
              <li className="type-body">
                Secretaría de Emergencias y Gestión de Riesgos de Neuquén.
              </li>
              <li className="type-body">
                Servicio de Prevención y Lucha contra Incendios Forestales de
                Río Negro.
              </li>
            </ul>
            <p className="type-body">
              Por derivación, los pedidos también llegaron al Ministerio de
              Seguridad Nacional y al Instituto Nacional del Agua. Se analizaron
              las respuestas remitidas por esos organismos y la documentación
              oficial entregada durante la investigación.
            </p>
            <p className="type-body">
              Asimismo, se envió una decena de correos a responsables de la
              prevención en las provincias patagónicas. En Neuquén se contactó a
              Luna Luciana Ortíz, secretaria de Emergencias y Gestión de
              Riesgos; en Río Negro, a Orlando Isaías Báez, coordinador del
              SPLIF; en Chubut, a Abel Nievas, secretario de Bosques; en Santa
              Cruz, a Ayelén Alberti, funcionaria a cargo de la Dirección
              Provincial de Bosques y Parques; y en Tierra del Fuego, a Rodrigo
              Cía, subsecretario de Manejo del Fuego.
            </p>
            <p className="type-body">
              Solo Chubut concretó una entrevista. Nievas dijo que carecía de
              datos sobre recursos aplicados a la labor preventiva en la
              provincia. Neuquén respondió y se coordinó una entrevista que
              finalmente no se realizó. Río Negro, Santa Cruz y Tierra del Fuego
              no respondieron.
            </p>
          </Question>

          <Question title="¿Cuáles fuentes abiertas fueron consultadas?">
            <p className="type-body">
              A continuación se detallan las fuentes y repositorios consultados
              para esta investigación:
            </p>
            <ul className="list-disc space-y-3 pl-5">
              {OPEN_SOURCES.map((source) => (
                <li key={source.href} className="type-body">
                  <TextLink href={source.href}>{source.label}</TextLink>
                  {source.note ? (
                    <span className="mt-1 block text-sm leading-relaxed text-foreground/75">
                      {source.note}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </Question>

          <Question title="¿Se puede republicar el contenido?">
            <p className="type-body">
              Sí. Las investigaciones están disponibles para quienes deseen
              reproducirlas total o parcialmente, con atribución de fuente.
              Solicitamos que se referencie el micrositio{" "}
              <TextLink href="https://agustinanahas.github.io/incendios/">
                agustinanahas.github.io/incendios
              </TextLink>
              .
            </p>
          </Question>

          <Question title="¿Cómo dejar un comentario, sugerencia o reacción, o contactar a los responsables del proyecto?">
            <p className="type-body">
              Por favor, utilizar este{" "}
              <TextLink href="https://forms.gle/J5LPU4j49sdVpBg47">
                formulario
              </TextLink>{" "}
              para comunicar inquietudes relacionadas al programa.
            </p>
          </Question>
        </div>
      </article>
    </main>
  );
}
