import { Quote } from "@/components/Quote";
import { TextLink } from "@/components/TextLink";

const MENENDEZ =
  "http://lanacion.com.ar/sociedad/tras-cuatro-meses-de-fuego-extinguen-el-incendio-en-los-alerces-epicentro-de-las-peores-temporadas-nid14042026/";

export function FireContextSection() {
  return (
    <section
      id="contexto"
      className="relative scroll-mt-8 bg-background text-foreground"
    >
      <div className="mx-auto max-w-[800px] px-5 pb-20 md:px-8 md:pt-6 md:pb-28">
        <h2 className="type-h2 md:hidden">El riesgo que nadie previene</h2>
        <p className="type-bajada md:hidden">
          Factores de ignición, de propagación y condiciones estructurales: las
          variables que una política preventiva debería gestionar antes de la
          primera llama.
        </p>

        <h3 className="type-h3 is-flush">Factores de ignición</h3>
        <h4 className="type-h4">Origen natural</h4>
        <p className="type-body mt-4">
          Los rayos pueden iniciar incendios que permanecen latentes durante
          días y luego se expanden bajo condiciones favorables, como ocurrió en
          diciembre de 2025 en el{" "}
          <TextLink href={MENENDEZ}>lago Menéndez</TextLink>. La actividad
          volcánica también puede encender vegetación cercana, aunque es una
          causa poco frecuente en la región.
        </p>

        <h4 className="type-h4">Origen humano</h4>
        <p className="type-body mt-4">
          La mayoría de los incendios tiene origen antrópico o humano. Según el
          Servicio Nacional de Manejo del Fuego, cerca del 95% está vinculado a
          acciones de personas, ya sea por negligencia, fallas en la
          infraestructura de distribución eléctrica o hechos intencionales.
        </p>

        <Quote
          quote="“Un incendio puede generarse por un fuego mal apagado o por una pelea entre vecinos: es muy común que se ajusticien prendiéndose fuego. Los motivos también pueden darse por un grupo de turistas que pasa por una zona donde no debe y deja un cigarrillo prendido”."
          name="Hernán Andrade"
          role="exvecino de Las Golondrinas, Chubut"
        />

        <p className="type-body">
          También existen quemas intencionales vinculadas al manejo de pasturas
          o de determinados ambientes. Cuando están autorizadas, deben
          realizarse bajo condiciones controladas y con personal especializado
          porque si el fuego se propaga puede generar daños de gran magnitud.
        </p>
      </div>
    </section>
  );
}
