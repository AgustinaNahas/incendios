import { Quote } from "@/components/Quote";

type OrgBlock = {
  name: string;
  lines: { label?: string; value: string; href?: string }[];
};

const BOMBEROS: OrgBlock[] = [
  {
    name: "Bomberos de Esquel",
    lines: [
      {
        label: "Instagram",
        value: "@bomberosvoluntariosesquel",
        href: "https://www.instagram.com/bomberosvoluntariosesquel/",
      },
      { label: "Facebook", value: "Bomberos Voluntarios de Esquel" },
      {
        label: "Página web",
        value: "bomberosdeesquel.org.ar",
        href: "http://www.bomberosdeesquel.org.ar/",
      },
      {
        label: "Correo",
        value: "prensaabve@gmail.com",
        href: "mailto:prensaabve@gmail.com",
      },
      { label: "Teléfono", value: "(02945) 452150", href: "tel:+542945452150" },
    ],
  },
  {
    name: "Bomberos de Epuyén",
    lines: [
      {
        label: "Instagram",
        value: "@bomberos_epuyen",
        href: "https://www.instagram.com/bomberos_epuyen/",
      },
      { label: "Facebook", value: "Bomberos Voluntarios de Epuyén" },
      {
        label: "Teléfono",
        value: "02945 49-9350",
        href: "tel:+542945499350",
      },
      {
        label: "Correo",
        value: "guardiaepuyen@gmail.com",
        href: "mailto:guardiaepuyen@gmail.com",
      },
      {
        label: "Donar",
        value: "Cuotas societarias / enlace directo",
        href: "https://dnr.onl/9qqFSPgm",
      },
    ],
  },
  {
    name: "Bomberos de Trevelin",
    lines: [
      {
        label: "Instagram",
        value: "@bomberosvt1976",
        href: "https://www.instagram.com/bomberosvt1976/",
      },
      { label: "Facebook", value: "Bomberos Voluntarios Trevelin" },
      {
        label: "Correo",
        value: "bomberostrevelin@yahoo.com.ar",
        href: "mailto:bomberostrevelin@yahoo.com.ar",
      },
      {
        label: "Teléfono",
        value: "02945 48-0106",
        href: "tel:+542945480106",
      },
    ],
  },
  {
    name: "Bomberos de Lago Puelo",
    lines: [
      {
        label: "Instagram",
        value: "@bomberos_lago_puelo",
        href: "https://www.instagram.com/bomberos_lago_puelo/",
      },
      { label: "Facebook", value: "Bomberos Voluntarios Lago Puelo" },
      {
        label: "Teléfono",
        value: "0294 15-491-3180",
        href: "tel:+542944913180",
      },
      {
        label: "WhatsApp",
        value: "+54 9 294 491-3180",
        href: "https://wa.me/5492944913180",
      },
    ],
  },
  {
    name: "Bomberos de El Maitén",
    lines: [
      {
        label: "Teléfono",
        value: "(02945) 495299",
        href: "tel:+542945495299",
      },
      {
        label: "Correo",
        value: "bvelmaiten@yahoo.com.ar",
        href: "mailto:bvelmaiten@yahoo.com.ar",
      },
    ],
  },
  {
    name: "Bomberos de Cholila",
    lines: [
      { label: "Facebook", value: "Bomberos Voluntarios Cholila" },
      {
        label: "Teléfono",
        value: "02945 49-8100",
        href: "tel:+542945498100",
      },
      {
        label: "Correo",
        value: "cdbomberoscholila@hotmail.com",
        href: "mailto:cdbomberoscholila@hotmail.com",
      },
    ],
  },
  {
    name: "Bomberos de El Hoyo",
    lines: [
      {
        label: "Instagram",
        value: "@bomberoseh",
        href: "https://www.instagram.com/bomberoseh/",
      },
      { label: "Facebook", value: "Bomberos Voluntarios El Hoyo" },
      {
        label: "Teléfono",
        value: "0294 447-1515",
        href: "tel:+542944471515",
      },
      {
        label: "Correo",
        value: "bomberosdeelhoyo@gmail.com",
        href: "mailto:bomberosdeelhoyo@gmail.com",
      },
    ],
  },
];

const ORGS: OrgBlock[] = [
  {
    name: "Fundación Cooperar",
    lines: [
      {
        label: "Instagram",
        value: "@fundacioncooperar",
        href: "https://www.instagram.com/fundacioncooperar/",
      },
      {
        label: "Web",
        value: "fundacioncooperar.com.ar",
        href: "https://www.fundacioncooperar.com.ar/",
      },
      {
        label: "Teléfonos",
        value: "(0294) 4492807 | 294 4412807",
      },
      {
        label: "Correo",
        value: "cooperar.fundacion@gmail.com",
        href: "mailto:cooperar.fundacion@gmail.com",
      },
    ],
  },
  {
    name: "Asociación Civil Acercar",
    lines: [
      {
        label: "Instagram",
        value: "@ac.acercar",
        href: "https://www.instagram.com/ac.acercar/",
      },
      {
        label: "Donaciones",
        value: "asociacioncivilacercar.org/donaciones",
        href: "https://www.asociacioncivilacercar.org/donaciones/",
      },
      { label: "Alias", value: "ayudaincendios" },
      { label: "Razón social", value: "ASOCIACION CIVIL ACERCAR" },
    ],
  },
  {
    name: "Asociación Amigos de la Patagonia",
    lines: [
      { label: "Alias", value: "AMIGOSDELAPATAGONIA" },
      {
        label: "PayPal",
        value: "paypal.me/amigosdelapatagonia",
        href: "https://paypal.me/amigosdelapatagonia",
      },
    ],
  },
  {
    name: "Fundación Sí",
    lines: [
      { label: "Mercado Pago / Usuario", value: "fundacionsiargentina" },
      {
        label: "Correo",
        value: "info@fundacionsi.org.ar",
        href: "mailto:info@fundacionsi.org.ar",
      },
    ],
  },
];

function OrgDetails({ orgs }: { orgs: OrgBlock[] }) {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      {orgs.map((org) => (
        <details
          key={org.name}
          className="group border border-[#f3efe8]/15 bg-[#2B2B2B]/80 px-4 py-4"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-sans text-base font-bold [&::-webkit-details-marker]:hidden">
            <span>{org.name}</span>
            <span
              aria-hidden
              className="shrink-0 text-[#f3efe8]/70 transition-transform group-open:rotate-180"
            >
              ▾
            </span>
          </summary>
          <ul className="mt-3 space-y-2 text-sm leading-snug text-[#f3efe8]/85">
            {org.lines.map((line) => (
              <li key={`${org.name}-${line.label ?? line.value}`}>
                {line.label ? (
                  <span className="opacity-65">{line.label}: </span>
                ) : null}
                {line.href ? (
                  <a
                    href={line.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-white"
                  >
                    {line.value}
                  </a>
                ) : (
                  line.value
                )}
              </li>
            ))}
          </ul>
        </details>
      ))}
    </div>
  );
}

export function AfterFireSection() {
  return (
    <section
      id="despues"
      className="relative scroll-mt-8 bg-[#2B2B2B] text-[#f3efe8]"
    >
      <div className="mx-auto max-w-[800px] px-5 py-20 md:px-8 md:py-28">
        <h2 className="type-h3">Después del fuego</h2>

        <div className="mt-8 space-y-5 text-base leading-relaxed text-[#f3efe8]/90 md:text-lg">
          <p>
            Cuando el último foco se apaga y la atención pública se desplaza,
            comienza una etapa mucho más larga: la recuperación. Antes, sin
            embargo, quedan las llamadas “guardias de ceniza”. Durante días, los
            brigadistas recorren los sectores quemados en busca de troncos
            calientes, brasas enterradas y focos capaces de reactivarse con un
            cambio de viento.
          </p>
          <p>
            El incendio también deja marcas que permanecen mucho después de las
            llamas: pérdida de vegetación, degradación de suelos, afectación de
            cultivos y animales, contaminación por cenizas y procesos de
            recuperación que pueden extenderse durante años.
          </p>
        </div>

        <Quote
          className="mt-10"
          quote="“Cuando un megaincendio ocurre se dan múltiples consecuencias: generación de gases, pérdida de biomasa y de naturaleza, suelos que van a estar durante muchos años sin su vegetación natural, deforestación, pérdida de cultivos y de animales. Los incendios de grandes proporciones, con gran generación de cenizas, también producen contaminación ambiental, al menos localizada. Son muchas las problemáticas que acarrea un incendio.”"
          name="Lucas Berengua"
          role="meteorólogo del Servicio Meteorológico Nacional"
        />

        <div className="mt-10 space-y-5 text-base leading-relaxed text-[#f3efe8]/90 md:text-lg">
          <p>
            Pero hay pérdidas que no se miden en hectáreas. Las familias pueden
            perder la casa, los muebles, los animales y sus fuentes de ingreso.
            Después llegan los meses de trámites, subsidios, reconstrucción y
            decisiones difíciles: volver, empezar de nuevo o irse. Quienes
            regresan lo hacen a un territorio que ya no es el mismo.
          </p>
          <p>
            El fuego deja así una última pregunta: qué ocurre antes, durante y
            después de cada incendio para que el mismo escenario vuelva a
            repetirse. Conocer las causas, reconocer las condiciones que lo
            favorecen y aprender de sus consecuencias no evita por sí solo la
            próxima emergencia, pero sí define cuánto puede hacerse para que la
            próxima vez el daño sea menor.
          </p>
        </div>

        <div className="mt-16 border border-[#f3efe8]/25 bg-[#1a1a1a]/55 px-5 py-8 md:px-8 md:py-10">
          <h3 className="font-sans text-xl font-bold md:text-2xl">
            Cómo ayudar
          </h3>
          <div className="mt-5 space-y-5 text-base leading-relaxed text-[#f3efe8]/90 md:text-lg">
            <p>
              “Cada vez que ha sucedido algo como los incendios en el verano
              cada uno de los cuarteles se autogestionó”, aclaró el Jefe de
              Bomberos de Chubut.
            </p>
            <p>
              Cada destacamento de la región cuenta con sus canales oficiales
              donde solicitan ayuda. Esta se requiere generalmente de manera
              temporal, de acuerdo con las necesidades de la coyuntura, y se
              hace principalmente a través de redes sociales.
            </p>
            <p>
              Las cuotas societarias de Bomberos Voluntarios de Epuyén financian
              insumos operativos básicos: desde viandas y equipamiento de
              limpieza hasta logística administrativa y respuestas ante
              imprevistos.
            </p>
            <p>
              Durante las emergencias de 2025-2026 en Río Negro y Chubut, la
              Fundación Cooperar y la Asociación Civil Acercar articularon la
              reconstrucción de viviendas y la gestión de comedores para
              brigadistas, evacuados y voluntarios.
            </p>
            <p>
              Entidades nacionales y regionales mantienen abiertas sus vías de
              recaudación durante todo el año para financiar herramientas de
              trabajo, reconstrucción de viviendas y equipamiento contra
              incendios.
            </p>
          </div>

          <h4 className="mt-10 font-sans text-base font-bold md:text-lg">
            Contacto de cuarteles de Bomberos de la Comarca Andina
          </h4>
          <OrgDetails orgs={BOMBEROS} />

          <h4 className="mt-10 font-sans text-base font-bold md:text-lg">
            Organizaciones locales y campañas permanentes
          </h4>
          <OrgDetails orgs={ORGS} />
        </div>
      </div>
    </section>
  );
}
