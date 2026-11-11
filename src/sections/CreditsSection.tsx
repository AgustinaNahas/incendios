const LEFT = [
  {
    role: "Investigación periodística",
    names: "Luisina Acosta · Raquel Ahumada ·  Sofía Martínez Mariotti",
  },
  {
    role: "Colaboración con AIP",
    names:
      "Fátima Morales · Nahuel Toledo · Gabriel Ramonet · Alicia Miller · Érika Alfonso · Mariana Olmedo",
  },
  { role: "Desarrollo web", names: "María Agustina Nahas" },
  { role: "Diseño", names: "Candelaria Victorica" },
  { role: "Mentoría general del proyecto", names: "Mariana Trigo Viera" },
] as const;

const RIGHT = [
  { role: "Liderazgo de FOCO Bootcamp", names: "Irene Benito" },
  { role: "Coordinación de comunicación de FOPEA", names: "Tiffy Del Mastro" },
  { role: "Imagen de FOCO Bootcamp", names: "Catalina Magnetti" },
  {
    role: "Mentoría de AIP y supervisión de FTA",
    names: "Jorge Filipini · Cecilia García Novarini · Samantha Singer",
  },
  {
    role: "Supervisión de FOPEA",
    names: "Fernando Stanich · Paula Moreno Román · Amelia Corazza",
  },
] as const;

const SOCIAL = [
  {
    label: "X (Twitter)",
    href: "https://twitter.com/fopea",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    label: "Facebook",
    href: "https://facebook.com/fopea",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  {
    label: "Instagram",
    href: "https://instagram.com/fopea",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/fopea",
    path: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z",
  },
] as const;

function CreditColumn({
  items,
}: {
  items: readonly { role: string; names: string }[];
}) {
  return (
    <div>
      {items.map((item) => (
        <div
          key={item.role}
          className="border-b border-foreground/20 py-4 first:pt-0"
        >
          <p className="text-xs font-semibold tracking-[0.16em] text-foreground/70 uppercase">
            {item.role}
          </p>
          <p className="mt-1.5 text-base leading-snug text-foreground">
            {item.names}
          </p>
        </div>
      ))}
    </div>
  );
}

export function CreditsSection() {
  return (
    <footer className="border-t border-white/31 bg-background text-foreground">
      <div className="pt-4 pb-20 md:pb-28">
        <p className="type-body mx-auto mt-10 max-w-[800px] px-6">
          Esta investigación fue elaborada durante 2026 en el ámbito de FOCO.
          Bootcamp de Periodismo, Acceso a la Información Pública y
          Visualización de Datos de la{" "}
          <a
            href="https://www.transparenciaactiva.org.ar/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Fundación Transparencia Activa
          </a>{" "}
          y el{" "}
          <a
            href="http://www.fopea.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Foro de Periodismo Argentino
          </a>
          . El programa recibió el apoyo de la Embajada de Suiza en la
          Argentina, y la colaboración de las embajadas de Alemania y de Francia
          (Comunidad Informada).
        </p>

        <div className="mx-auto mt-10 flex max-w-[800px] flex-col gap-8 px-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-foreground/70 uppercase">
              Contacto
            </p>
            <a
              href="mailto:contacto@transparenciaactiva.ar"
              className="mt-2 block text-foreground underline decoration-foreground/40 underline-offset-2 hover:decoration-accent"
            >
              contacto@transparenciaactiva.ar
            </a>
            <a
              href="mailto:fopea@fopea.org"
              className="mt-1 block text-foreground underline decoration-foreground/40 underline-offset-2 hover:decoration-accent"
            >
              fopea@fopea.org
            </a>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-foreground/70 uppercase">
              Nuestras redes
            </p>
            <div className="mt-3 flex gap-2">
              {SOCIAL.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="flex size-9 items-center justify-center border border-foreground/35 text-foreground hover:border-accent hover:text-accent"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d={item.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSfHFndq2U8cHnPktMPc2iKA2yt-g_-3PBOEsUiZPgVLuG_IbA/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-foreground px-5 py-3.5 text-center text-xs font-semibold tracking-[0.12em] text-background uppercase hover:bg-accent hover:text-accent-deep"
          >
            Sugerencias y comentarios
          </a>
        </div>

        <div className="mx-auto mt-10 max-w-[800px] px-6 pt-8">
          <div className="mb-20 border-t border-t-white/31" />
          <p className="mx-auto max-w-[800px] text-xs font-semibold tracking-[0.16em] text-foreground/70 uppercase">
            Créditos
          </p>
          <div className="mt-6 grid gap-x-12 md:grid-cols-2">
            <CreditColumn items={LEFT} />
            <CreditColumn items={RIGHT} />
          </div>
        </div>
      </div>
    </footer>
  );
}
