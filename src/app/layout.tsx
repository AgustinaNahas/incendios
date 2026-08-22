import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

const sans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "El Camino del fuego · Bosques Patagónicos",
  description:
    "No es un capricho de la naturaleza: sequía extrema, vientos traicioneros y años sin la prevención adecuada.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full overflow-x-clip font-[family-name:var(--font-sans)]">
        <a href="#otbn" className="skip-link">
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}
