import type { Metadata } from "next";
import { Noto_Sans, Noto_Serif_KR } from "next/font/google";
import "./globals.css";

const display = Noto_Serif_KR({
  variable: "--font-noto-kr",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  display: "swap",
});

const sans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bosques Patagónicos · Incendios sin prevención ni presupuesto claro",
  description:
    "Incendios sin prevención ni presupuesto claro y la emergencia como único plan. Más de 45 mil hectáreas ardieron en la Patagonia argentina en los primeros meses de 2026.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full overflow-x-clip font-sans">
        <a href="#intro" className="skip-link">
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}
