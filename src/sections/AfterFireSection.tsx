"use client";

import { useState } from "react";
import { Quote } from "@/components/Quote";
import { TextLink } from "@/components/TextLink";

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

const LOCAL_ORGS: OrgBlock[] = [
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
];

const DIRECT_DONATION: OrgBlock[] = [
  {
    name: "Bomberos Voluntarios de Epuyén",
    lines: [
      {
        label: "Enlace directo",
        value: "dnr.onl/9qqFSPgm",
        href: "https://dnr.onl/9qqFSPgm?s=w",
      },
    ],
  },
];

const CAMPAIGNS: OrgBlock[] = [
  {
    name: "Asociación Amigos de la Patagonia",
    lines: [
      {
        label: "Correo",
        value: "info@aapatagonia.org.ar",
        href: "mailto:info@aapatagonia.org.ar",
      },
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

const OTHER_ORGS: OrgBlock[] = [
  {
    name: "Fundación Ambiente y Recursos Naturales (FARN)",
    lines: [
      {
        label: "Correo",
        value: "info@farn.org.ar",
        href: "mailto:info@farn.org.ar",
      },
      {
        label: "Web",
        value: "farn.org.ar",
        href: "https://farn.org.ar/",
      },
    ],
  },
  {
    name: "The Nature Conservancy",
    lines: [
      {
        label: "Dirección",
        value:
          "Avenida Presidente Roque Sáenz Peña 1.164, Piso 9, Ciudad de Buenos Aires, Argentina",
      },
      {
        label: "Correo",
        value: "argentina@tnc.org",
        href: "mailto:argentina@tnc.org",
      },
      {
        label: "Web",
        value: "nature.org/es-us",
        href: "https://www.nature.org/es-us/",
      },
    ],
  },
];

function OrgDetails({ orgs }: { orgs: OrgBlock[] }) {
  const [openPairs, setOpenPairs] = useState<ReadonlySet<number>>(
    () => new Set(),
  );

  const togglePair = (pairIndex: number) => {
    setOpenPairs((prev) => {
      const next = new Set(prev);
      if (next.has(pairIndex)) next.delete(pairIndex);
      else next.add(pairIndex);
      return next;
    });
  };

  return (
    <div className="mt-6 grid items-start gap-4 sm:grid-cols-2">
      {orgs.map((org, i) => {
        const pairIndex = Math.floor(i / 2);
        const isOpen = openPairs.has(pairIndex);

        return (
          <details
            key={org.name}
            open={isOpen}
            className="group border border-foreground/15 bg-background/80 px-4 py-4"
          >
            <summary
              className="flex cursor-pointer list-none items-center justify-between gap-3 font-sans text-base font-bold [&::-webkit-details-marker]:hidden"
              onClick={(e) => {
                e.preventDefault();
                togglePair(pairIndex);
              }}
            >
              <span>{org.name}</span>
              <span
                aria-hidden
                className="shrink-0 text-foreground/70 transition-transform group-open:rotate-180"
              >
                ▾
              </span>
            </summary>
            <ul className="mt-3 space-y-2 text-sm leading-snug text-foreground/85">
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
        );
      })}
    </div>
  );
}

export function AfterFireSection() {
  return (
    <section
      id="despues"
      className="relative scroll-mt-8 bg-background text-foreground"
    >
      <div className="section-rule mx-auto max-w-[800px] px-5 pb-12 md:px-8 ">
        <h2 className="type-h2">Después del fuego</h2>
        <p className="type-bajada">
          Apagar el último foco no cierra la emergencia, el territorio que queda
          ya no es el mismo
        </p>
        <div className="type-stack">
          <p className="type-body">
            Cuando el último foco se apaga y la atención pública se desplaza,
            comienza una etapa mucho más larga: la recuperación. Antes, sin
            embargo, quedan las llamadas “guardias de ceniza”. Durante días, los
            brigadistas recorren los sectores quemados en busca de troncos
            calientes, brasas enterradas y materiales combustibles capaces de
            reactivarse con un cambio de viento.
          </p>
        </div>

        <Quote
          quote="“Cuando un megaincendio ocurre se dan múltiples consecuencias: generación de gases; pérdida de biomasa y de naturaleza; suelos que van a estar durante muchos años sin su vegetación natural; deforestación, pérdida de cultivos y de animales. Los incendios de grandes proporciones, con gran generación de cenizas, también producen contaminación ambiental, al menos localizada. Son muchas las problemáticas que acarrea un incendio.”"
          name="Lucas Berengua"
          role="Meteorólogo del Servicio Meteorológico Nacional"
        />

        <div className="type-stack">
          <p className="type-body">
            Pero hay pérdidas que no se miden en hectáreas. Las familias pueden
            perder la casa, los muebles, los animales y sus fuentes de ingreso.
            Después llegan los meses de trámites, subsidios, reconstrucción y
            decisiones difíciles: empezar de nuevo o irse. Quienes regresan lo
            hacen a un territorio que ya no es el mismo.
          </p>
          <p className="type-body">
            El fuego deja así una última pregunta: ¿qué ocurre antes, durante y
            después de cada incendio para que el mismo escenario vuelva a
            repetirse? Conocer las causas, identificar las condiciones propicias
            y aprender de sus consecuencias no evita por sí solo la próxima
            emergencia, pero sí ayuda a diseñar acciones para que la próxima vez
            el daño sea menor.
          </p>
        </div>

        <div className="mt-16 border border-foreground/25 bg-ink/55 px-5 py-8 md:px-8 md:py-10">
          <h3 className="type-h4 is-flush">Cómo ayudar</h3>
          <p className="type-body mt-4">
            Información sobre cómo ayudar, cómo donar, dónde hacer voluntariado
            y cuáles son las ONG a las que puede recurrirse en esta materia.
          </p>

          <OrgDetails orgs={[...BOMBEROS, ...DIRECT_DONATION, ...LOCAL_ORGS, ...CAMPAIGNS, ...OTHER_ORGS]} />

        </div>

        <div className="mt-10 border border-foreground/25 bg-ink/55 px-5 py-8 md:px-8 md:py-10">
          <p className="text-xs font-semibold tracking-[0.2em] text-foreground/70 uppercase">
            Cómo se hizo
          </p>
          <h3 className="type-h4">Metodología y anexo</h3>
          <p className="type-body mt-4">
            Esta investigación se hizo en el marco del FOCO Bootcamp de FTA y
            FOPEA. La metodología explica el marco del programa, cómo se
            investigó y qué fuentes se consultaron. El anexo reúne la
            cronología de los pedidos de acceso a la información pública: las
            solicitudes, las respuestas —y las que nunca llegaron— y el detalle
            de lo que se pudo documentar.
          </p>
          <p className="type-body mt-4 flex flex-col gap-3 sm:flex-row sm:gap-8">
            <TextLink href="/metodologia">Leer la metodología</TextLink>
            <TextLink href="/anexo">Leer el anexo descriptivo</TextLink>
          </p>
        </div>
      </div>
    </section>
  );
}
