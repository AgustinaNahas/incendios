"use client";

import dynamic from "next/dynamic";

const BurnedMap = dynamic(
  () => import("@/components/maps/BurnedMap").then((m) => m.BurnedMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#C9C6C1] text-sm text-[#1A1A1A]/70">
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
