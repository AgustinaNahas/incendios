import { Quote } from "@/components/Quote";

export function FireContextSection() {
  return (
    <section className="relative bg-background text-foreground">
      <div className="mx-auto max-w-[800px] px-5 pb-12 md:px-8">
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
