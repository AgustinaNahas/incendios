"use client";

import dynamic from "next/dynamic";
import type { OtbnProvinceFilter } from "@/lib/otbnCopy";

const OtbnLeafletMap = dynamic(
  () =>
    import("@/components/maps/OtbnLeafletMap").then((m) => m.OtbnLeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-black/10 text-sm opacity-70">
        Cargando mapa…
      </div>
    ),
  },
);

type Props = {
  highlightZona?: number | null;
  provinceFilter?: OtbnProvinceFilter;
  className?: string;
  interactive?: boolean;
};

export function OtbnMapClient(props: Props) {
  return <OtbnLeafletMap {...props} />;
}
