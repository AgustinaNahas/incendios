"use client";

import dynamic from "next/dynamic";
import type { AtlasStepId } from "@/lib/atlasSteps";
import type { OtbnProvinceFilter } from "@/lib/otbnCopy";

const AtlasMap = dynamic(
  () => import("@/components/maps/AtlasMap").then((m) => m.AtlasMap),
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
  step?: AtlasStepId;
  highlightZona?: number | null;
  provinceFilter?: OtbnProvinceFilter;
  className?: string;
  interactive?: boolean;
  explorer?: boolean;
};

export function OtbnMapClient(props: Props) {
  return <AtlasMap {...props} />;
}
