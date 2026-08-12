import type { Metadata } from "next";
import { OtbnExplorer } from "@/components/maps/OtbnExplorer";

export const metadata: Metadata = {
  title: "Mapa OTBN · Bosques patagónicos",
  description:
    "Ordenamiento Territorial de Bosques Nativos (Ley 26.331) en Chubut y Santa Cruz: categorías I, II y III sobre OpenStreetMap.",
};

export default function OtbnPage() {
  return <OtbnExplorer />;
}
