type OrgBlock = {
  name: string;
  lines: { label?: string; value: string; href?: string }[];
};

const ORGS: OrgBlock[] = [
  {
    name: "Bomberos Voluntarios de Epuyén",
    lines: [
      { label: "Instagram", value: "@bomberos_epuyen", href: "https://www.instagram.com/bomberos_epuyen/" },
      { label: "Facebook", value: "Bomberos Voluntarios de Epuyén" },
      { label: "Teléfono", value: "02945 49-9350", href: "tel:+542945499350" },
      { label: "Correo", value: "guardiaepuyen@gmail.com", href: "mailto:guardiaepuyen@gmail.com" },
      { label: "Donar", value: "Enlace para donar", href: "https://dnr.onl/9qqFSPgm?s=w" },
    ],
  },
  {
    name: "Fundación Cooperar",
    lines: [
      { label: "Instagram", value: "@fundacioncooperar", href: "https://www.instagram.com/fundacioncooperar/" },
      { label: "Correo", value: "cooperar.fundacion@gmail.com", href: "mailto:cooperar.fundacion@gmail.com" },
      { label: "Teléfono", value: "(0294) 4492807 · 2944412807" },
      { label: "Web", value: "fundacioncooperar.com.ar", href: "https://www.fundacioncooperar.com.ar/" },
    ],
  },
  {
    name: "Asociación Civil Acercar",
    lines: [
      { label: "Instagram", value: "@ac.acercar", href: "https://www.instagram.com/ac.acercar/" },
      { label: "Donaciones", value: "asociacioncivilacercar.org/donaciones", href: "https://www.asociacioncivilacercar.org/donaciones/" },
      { label: "Alias", value: "ayudaincendios" },
      { label: "Razón social", value: "ASOCIACION CIVIL ACERCAR" },
    ],
  },
  {
    name: "Asociación de Amigos de la Patagonia",
    lines: [
      { label: "Alias", value: "AMIGOSDELAPATAGONIA" },
      { label: "PayPal", value: "paypal.me/amigosdelapatagonia", href: "https://paypal.me/amigosdelapatagonia" },
    ],
  },
  {
    name: "Fundación Sí",
    lines: [
      { label: "Usuario", value: "fundacionsiargentina" },
      { label: "Mail", value: "info@fundacionsi.org.ar", href: "mailto:info@fundacionsi.org.ar" },
    ],
  },
];

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
            embargo, quedan los llamados “guardias de ceniza”. Durante días, los
            bomberos recorren los sectores quemados en busca de troncos
            calientes, brasas enterradas y focos capaces de reactivarse con un
            cambio de viento.
          </p>
          <p>
            Para los cuerpos de bomberos voluntarios, ese esfuerzo tiene además
            un costo personal. Muchos de sus integrantes son cuentapropistas:
            comerciantes, albañiles, plomeros o electricistas. Cada jornada
            destinada al incendio es también una jornada en la que dejan de
            trabajar y de generar ingresos. En las ciudades más grandes, algunos
            cuarteles cuentan con personal rentado para funciones específicas,
            pero buena parte de la estructura sigue sostenida por voluntarios
            que interrumpen su vida cotidiana para responder a la emergencia.
          </p>
          <p>
            El incendio también deja marcas que permanecen mucho después de las
            llamas: pérdida de vegetación, degradación de suelos, afectación de
            cultivos y animales, contaminación por cenizas y procesos de
            recuperación que pueden extenderse durante años.
          </p>
        </div>

        <blockquote className="mt-10 bg-[#D9D9D970] p-8 text-center text-xl leading-tight md:p-12 md:text-2xl">
          <span className="italic">
            “Cuando un megaincendio ocurre se dan múltiples consecuencias:
            generación de gases, pérdida de biomasa y de naturaleza, suelos que
            van a estar durante muchos años sin su vegetación natural,
            deforestación, pérdida de cultivos y de animales. Los incendios de
            grandes proporciones, con gran generación de cenizas, también
            producen contaminación ambiental, al menos localizada. Son muchas
            las problemáticas que acarrea un incendio.”
          </span>
          <p className="mt-8 text-[16px]">
            <strong>Lucas Berengua</strong>, meteorólogo del Servicio
            Meteorológico Nacional
          </p>
        </blockquote>

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
              El jefe de Bomberos Voluntarios de Chubut resaltó que desde el
              organismo se solicitaron colaboraciones solo en los momentos
              críticos y de manera eventual. “Cada vez que ha sucedido algo como
              los incendios en el verano cada uno de los cuarteles se
              autogestionó y lo hicieron a través de sus canales oficiales. El
              que quiera colaborar debe acceder a las páginas”, aclaró. El
              cuartel de Bomberos de Epuyén cuenta con su propia página de
              Facebook donde se publican las solicitudes de ayuda por temporada.
            </p>
            <p>
              También es posible contribuir a las cuotas societarias de Bomberos
              Voluntarios de Epuyén destinadas a gastos de limpieza, viandas,
              tareas administrativas y otras situaciones emergentes de la
              institución.
            </p>
            <p>
              Otras asociaciones de la sociedad civil, así como instituciones
              como universidades, se encargan de coordinar las colaboraciones
              con los combatientes y damnificados. La Fundación Cooperar y la
              Asociación Civil Acercar colaboraron durante los megaincendios de
              2025-2026 desde Río Negro hasta Chubut. Las organizaciones se
              encargaron de colaborar en la reconstrucción de viviendas así como
              en el acondicionamiento de comedores para preparar y distribuir
              viandas a brigadistas, personas evacuadas y personas voluntarias.
            </p>
            <p>
              También es posible donar de manera mensual asociándose a las
              organizaciones a través de sus respectivas páginas web utilizando
              medios de pago como tarjetas de crédito y débito. Otras
              asociaciones de mayor tamaño que comprenden a la región de la
              Patagonia gestionan durante todo el año campañas de colaboraciones
              y donaciones.
            </p>
            <p>
              Desde la Asociación de Amigos de la Patagonia es posible donar
              para ayudar a brigadistas y damnificados a través de
              transferencias de dinero. Fundación Sí es otra de las
              organizaciones de la sociedad civil que durante los incendios se
              encargó de las colectas para ayudar a las familias que perdieron
              parte o toda su vivienda, así como sus herramientas de trabajo.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {ORGS.map((org) => (
              <div
                key={org.name}
                className="border border-[#f3efe8]/15 bg-[#2B2B2B]/80 px-4 py-4"
              >
                <p className="font-sans text-base font-bold">{org.name}</p>
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
