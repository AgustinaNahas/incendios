"use client";

import dynamic from "next/dynamic";

const BurnedMap = dynamic(
  () => import("@/components/maps/BurnedMap").then((m) => m.BurnedMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-atlas-water text-sm text-ink/70">
        Cargando mapa…
      </div>
    ),
  },
);

type Props = {
  monthIndex: number;
  className?: string;
};

export function BurnedMapClient(props: Props) {
  return <BurnedMap {...props} />;
}
