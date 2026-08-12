# bosques-fuego-scrolly

Scrollytelling inverso (Después → Fuego → Antes → OTBN → Brechas) sobre incendios en bosques patagónicos.

## Desarrollo

```bash
nvm use 22
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000). En local el `basePath` está vacío; en producción (GitHub Pages) es `/incendios`.

## Build estático

```bash
npm run build
```

Sale la carpeta `out/` lista para hosting estático.

## GitHub Pages

El repo se publica como **project site**:

**https://agustinanahas.github.io/incendios/**

Configuración ya incluida:

- `output: "export"` en [`next.config.ts`](next.config.ts)
- `basePath` / `assetPrefix` = `/incendios` en producción
- `public/.nojekyll` (para que Pages no ignore `_next/`)
- Workflow [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) en cada push a `main`

### Activar Pages una vez

1. Push a `main` (o corréd el workflow *Deploy GitHub Pages* a mano).
2. En el repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Esperá el check verde del workflow.

### Datos OTBN

```bash
npm run build:otbn   # regenera public/data/otbn-zonas.geojson
```

## Datos

- `public/data/*.csv` — RII hectáreas e incendios (2017–mar 2026)
- `public/data/otbn-zonas.geojson` — ordenamiento territorial Neuquén, Río Negro, Chubut y Santa Cruz
- `src/data/budget.json`, `testimonies.json`, `prevention.json`, `data-gaps.json` — placeholders editables
