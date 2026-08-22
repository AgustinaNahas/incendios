import type { Metadata } from "next";
import { OtbnExplorer } from "@/components/maps/OtbnExplorer";

export const metadata: Metadata = {
  title: "Mapa OTBN · Bosques patagónicos",
  description:
    "Ordenamiento Territorial de Bosques Nativos (Ley 26.331) en Neuquén, Río Negro, Chubut, Santa Cruz y Tierra del Fuego: categorías I, II y III.",
};

export default function OtbnPage() {
  return <OtbnExplorer />;
}
