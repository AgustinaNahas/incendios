"use client";

import Image from "next/image";
import { withBasePath } from "@/lib/paths";

const CONSEQUENCES_COPY =
  "El fuego no se apaga cuando las llamas se van. Quedan casas irreconocibles, un horizonte que ya no se reconoce y vecinos que todavía no saben si van a poder quedarse.";

export function ConsequencesScrolly() {
  return (
    <section id="despues" className="relative scroll-mt-8 overflow-x-clip">
      <div className="sticky top-0 h-dvh overflow-hidden bg-ember-void">
        <Image
          src={withBasePath("/images/forest-fire-scrolly.jpg")}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[center_42%]"
          priority={false}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/35"
        />
      </div>

      <div className="relative z-10">
        <div className="mx-auto flex max-w-xl flex-col items-center px-4 md:px-8">
          <article className="flex min-h-[85vh] w-full items-center">
            <div className="ui-panel ui-panel--accent w-full px-5 py-7 text-center md:px-10 md:py-9">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-accent uppercase">
                Consecuencias
              </p>
              <p className="mt-4 font-[family-name:var(--font-display)] text-xl leading-snug text-foreground md:text-2xl">
                {CONSEQUENCES_COPY}
              </p>
            </div>
          </article>

          <div className="h-[28vh]" aria-hidden />
        </div>
      </div>
    </section>
  );
}
