import type { Metadata } from "next";
import { Noto_Sans, Noto_Serif_KR } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SITE_URL } from "@/lib/paths";
import "./globals.css";

const GA_ID = "G-F63NMHWKDY";

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

const TITLE =
  "Bosques Patagónicos · Incendios sin prevención ni presupuesto claro";
const DESCRIPTION =
  "Incendios sin prevención ni presupuesto claro y la emergencia como único plan. Más de 45 mil hectáreas ardieron en la Patagonia argentina en los primeros meses de 2026.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/`,
    type: "article",
    locale: "es_AR",
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full overflow-x-clip font-sans">
        {children}
      </body>
      <GoogleAnalytics gaId={GA_ID} />
    </html>
  );
}
