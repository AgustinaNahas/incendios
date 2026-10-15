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

const GEAR = [
  "Casco rojo con antiparras (KPN SAFETY Modelo TYTAN MAX; también MSA Modelo V-Gard)",
  "Chaquetas ignífugas (Inforest)",
  "Pantalones ignífugos (Inforest/ZB)",
  "Mochilas para incendios forestales (ENMEN)",
  "Guantes para trabajo forestal (Inforest)",
  "Calzado para incendios forestales (El Resero)",
  "Anteojos de seguridad (Libus — Modelo Fall Dual)",
  "Linterna (Energizer)",
  "Sistema de hidratación (Waterbag)",
  "Botiquín de primeros auxilios (manta térmica, tijera, pinza, máscara pocket, férula y kit con 9 elementos)",
  "Handys VHF (Motorola Modelo DEP 250)",
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
      className="relative scroll-mt-8 bg-[#2B2B2B] text-[#f3efe8]"
    >
      <div className="mx-auto max-w-[800px] px-5 py-20 md:px-8 md:py-28">
        <h2 className="type-h3">Quiénes combaten el fuego</h2>

        <p className="mt-8 text-base leading-relaxed text-[#f3efe8]/90 md:text-lg">
          En los incendios forestales de la Patagonia intervienen distintos
          cuerpos, cada uno con una formación y una función específica. En los
          operativos de mayor escala, trabajan de manera coordinada y, muchas
          veces, dentro de estructuras de comando conjunto.
        </p>

        <h3 className="mt-12 font-sans text-xl font-bold md:text-2xl">
          Los distintos cuerpos de combate
        </h3>
        <ul className="mt-6 space-y-8">
          {BODIES.map((item) => (
            <li key={item.title} className="list-disc ml-6 pl-2">
              <p className="font-sans text-base font-bold md:text-lg">
                {item.title}
              </p>
              <p className="text-base leading-relaxed text-[#f3efe8]/85 md:text-lg">
                {item.body}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-base leading-relaxed text-[#f3efe8]/90 md:text-lg">
          En el terreno, esas diferencias institucionales se vuelven menos
          visibles. Brigadistas, bomberos, guardaparques, pilotos y vecinos
          comparten un mismo objetivo: ganar tiempo, abrir líneas de defensa,
          proteger viviendas o evitar que un foco vuelva a encenderse. Pero hay
          incendios en los que ni la cantidad de personas ni los recursos
          alcanzan: el viento cambia, el fuego acelera y la prioridad pasa a ser
          no exponer vidas.
        </p>

        <h3 className="mt-16 font-sans text-xl font-bold md:text-2xl">
          Anatomía de un brigadista forestal de Parques Nacionales
        </h3>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {GEAR.map((item) => (
            <li
              key={item}
              className="border border-[#f3efe8]/20 bg-[#1a1a1a]/60 px-4 py-3 text-sm leading-snug text-[#f3efe8]/90 md:text-base"
            >
              {item}
            </li>
          ))}
        </ul>

        <h3 className="mt-14 font-sans text-xl font-bold md:text-2xl">
          Herramientas manuales
        </h3>
        <p className="mt-4 text-base leading-relaxed text-[#f3efe8]/90 md:text-lg">
          Para abrir líneas de defensa, cortar vegetación y apagar focos
          pequeños se emplean:
        </p>
        <ul className="mt-5 list-disc space-y-2 pl-5 text-base leading-relaxed text-[#f3efe8]/90 md:text-lg">
          {TOOLS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <div className="mt-14 space-y-5 text-base leading-relaxed text-[#f3efe8]/90 md:text-lg">
          <p>
            No todos los que llegan a la primera línea del fuego forman parte de
            estructuras oficiales. En zonas rurales, de interfase o de difícil
            acceso, las brigadas comunitarias pueden convertirse en una primera
            respuesta clave gracias a su conocimiento directo del territorio,
            aunque no siempre cuentan con el mismo reconocimiento institucional
            que los cuerpos oficiales.
          </p>
          <p>
            La Brigada Forestal de Mallín Ahogado, en Río Negro, nació en 2021
            durante el incendio de Cuesta del Ternero. Con el tiempo, se
            capacitó, incorporó equipamiento y seguros y, en 2023, obtuvo
            personería jurídica y reconocimiento como entidad auxiliar de
            Protección Civil. Sin embargo, su encuadre dentro del sistema de
            respuesta a emergencias todavía presenta límites.
          </p>
        </div>

        <blockquote className="mt-10 bg-[#D9D9D970] p-8 text-center text-xl leading-tight md:p-12 md:text-2xl">
          <span className="italic">
            “La solidaridad no puede ser una política pública, porque cuando
            hablamos de emergencias, hablamos de una responsabilidad.”
          </span>
          <p className="mt-8 text-[16px]">
            <strong>Natalia Dobranski</strong>, jefa de la Brigada Forestal de
            Mallín Ahogado, una organización comunitaria de Río Negro
          </p>
        </blockquote>
      </div>
    </section>
  );
}
