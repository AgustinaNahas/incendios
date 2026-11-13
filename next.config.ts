import type { NextConfig } from "next";

/** Repo name on GitHub → project Pages URL: https://<user>.github.io/incendios/ */
const REPO_NAME = "incendios";
const isProd = process.env.NODE_ENV === "production";

/**
 * `BASE_PATH` vacío publica en la raíz del dominio (FTP de FOPEA).
 * Sin esa variable, el build de producción sigue en `/incendios` para GitHub Pages.
 */
const basePath =
  process.env.BASE_PATH !== undefined
    ? process.env.BASE_PATH
    : isProd
      ? `/${REPO_NAME}`
      : "";

const siteUrl = (
  process.env.SITE_URL ?? "https://agustinanahas.github.io/incendios"
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_URL: siteUrl,
    NEXT_PUBLIC_MAPBOX_TOKEN:
      process.env.NEXT_PUBLIC_MAPBOX_TOKEN ??
      "pk.eyJ1IjoiaGF2YiIsImEiOiJpSHhUWGVBIn0.IY5RvkA4-jqVtNxcsYioug",
  },
};

export default nextConfig;
