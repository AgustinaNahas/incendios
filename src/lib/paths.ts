/** URL canónica del build (GitHub Pages o el dominio de FOPEA). */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://agustinanahas.github.io/incendios";

/** Prefijo de rutas. Vacío en local y en el build FTP; `/incendios` en GitHub Pages. */
export function withBasePath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  if (!path.startsWith("/")) return `${base}/${path}`;
  return `${base}${path}`;
}
