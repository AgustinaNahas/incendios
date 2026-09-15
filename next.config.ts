import type { NextConfig } from "next";

/** Repo name on GitHub → project Pages URL: https://<user>.github.io/incendios/ */
const REPO_NAME = "incendios";
const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? `/${REPO_NAME}` : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_MAPBOX_TOKEN:
      process.env.NEXT_PUBLIC_MAPBOX_TOKEN ??
      "pk.eyJ1IjoiaGF2YiIsImEiOiJpSHhUWGVBIn0.IY5RvkA4-jqVtNxcsYioug",
  },
};

export default nextConfig;
