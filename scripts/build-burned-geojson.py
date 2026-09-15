#!/usr/bin/env python3
"""Build a Patagonia-only GeoJSON of CONAE burned hectares by department and month.

Output: public/data/atlas-quemado.geojson
Only Neuquén, Río Negro, Chubut, Santa Cruz and Tierra del Fuego.
Months: 2022-01 … 2026-06 (missing source months are 0).
"""

from __future__ import annotations

import json
from pathlib import Path

from osgeo import ogr

ogr.UseExceptions()

ROOT = Path(__file__).resolve().parents[1]
SRC_DIR = ROOT / "public" / "data" / "hectareas_quemadas"
OUT_PATH = ROOT / "public" / "data" / "atlas-quemado.geojson"

YEARS = (2022, 2023, 2024, 2025, 2026)
MONTHS = [
    f"{year}-{month:02d}"
    for year in YEARS
    for month in range(1, 13)
    if not (year == 2026 and month > 6)
]

FOCUS_EXACT = {"Neuquén", "Río Negro", "Chubut", "Santa Cruz"}
TF_PREFIX = "Tierra del Fuego"

SIMPLIFY = 0.008
COORD_PRECISION = 5

CLIP_WEST = -76.0
CLIP_EAST = -53.5
CLIP_SOUTH = -56.3
CLIP_NORTH = -36.0

_CLIP_BOX = None


def clip_box() -> ogr.Geometry:
    ring = ogr.Geometry(ogr.wkbLinearRing)
    ring.AddPoint(CLIP_WEST, CLIP_SOUTH)
    ring.AddPoint(CLIP_EAST, CLIP_SOUTH)
    ring.AddPoint(CLIP_EAST, CLIP_NORTH)
    ring.AddPoint(CLIP_WEST, CLIP_NORTH)
    ring.AddPoint(CLIP_WEST, CLIP_SOUTH)
    poly = ogr.Geometry(ogr.wkbPolygon)
    poly.AddGeometry(ring)
    return poly


def clip_geom(geom: ogr.Geometry) -> ogr.Geometry | None:
    global _CLIP_BOX
    if geom is None or geom.IsEmpty():
        return None
    if _CLIP_BOX is None:
        _CLIP_BOX = clip_box()
    if _CLIP_BOX.Contains(geom):
        return geom
    clipped = geom.Intersection(_CLIP_BOX)
    if clipped is None or clipped.IsEmpty():
        return None
    return clipped


def round_coords(obj: object, ndigits: int = COORD_PRECISION) -> object:
    if isinstance(obj, list):
        if obj and isinstance(obj[0], (int, float)):
            return [round(float(x), ndigits) for x in obj]
        return [round_coords(x, ndigits) for x in obj]
    return obj


def geom_to_json(geom: ogr.Geometry) -> dict | None:
    if geom.GetCoordinateDimension() == 3:
        geom.FlattenTo2D()
    simplified = geom.SimplifyPreserveTopology(SIMPLIFY)
    if simplified is not None and not simplified.IsEmpty():
        geom = simplified
    gtype = geom.GetGeometryName()
    if gtype in {"POLYGON", "MULTIPOLYGON"}:
        forced = ogr.ForceToMultiPolygon(geom)
        if forced is None or forced.IsEmpty():
            return None
        geom = forced
    raw = json.loads(geom.ExportToJson())
    if "coordinates" in raw:
        raw["coordinates"] = round_coords(raw["coordinates"])
    return raw


def normalize_province(name: str) -> str | None:
    if name in FOCUS_EXACT:
        return name
    if name.startswith(TF_PREFIX):
        return "Tierra del Fuego"
    return None


def find_aq_shp(year: int) -> Path:
    folder = SRC_DIR / str(year)
    matches = sorted(folder.glob("*_depto_aq.shp"))
    if not matches:
        raise FileNotFoundError(f"No hay shapefile _depto_aq en {folder}")
    return matches[0]


def month_fields(layer: ogr.Layer) -> list[str]:
    defn = layer.GetLayerDefn()
    names = [defn.GetFieldDefn(i).GetName() for i in range(defn.GetFieldCount())]
    return [n for n in names if n in set(MONTHS) or (len(n) == 7 and n[4] == "-" and n[:4].isdigit())]


def main() -> int:
    records: dict[int, dict] = {}

    for year in YEARS:
        shp = find_aq_shp(year)
        print(f"== {year} {shp.name}", flush=True)
        ds = ogr.Open(str(shp))
        if ds is None:
            raise RuntimeError(f"No se pudo abrir {shp}")
        layer = ds.GetLayer(0)
        months = month_fields(layer)
        print(f"  months in file: {months}")
        kept = 0
        for feat in layer:
            prov = normalize_province(feat.GetField("nombre_pro") or "")
            if not prov:
                continue
            in1 = feat.GetField("in1")
            if in1 is None:
                continue
            in1 = int(in1)
            geom = feat.GetGeometryRef()
            if geom is None:
                continue
            geom = clip_geom(geom.Clone())
            if geom is None:
                continue
            rec = records.get(in1)
            if rec is None:
                rec = {
                    "in1": in1,
                    "provincia": prov,
                    "nam": feat.GetField("nam") or feat.GetField("nombre_dpt") or "",
                    "geom": geom.Clone(),
                    "ha": {m: 0.0 for m in MONTHS},
                }
                records[in1] = rec
                kept += 1
            else:
                kept += 1
            for month in months:
                if month not in rec["ha"]:
                    continue
                value = feat.GetField(month)
                rec["ha"][month] = round(float(value or 0.0), 2)
        ds = None
        print(f"  matched focus features this year: {kept}")

    features: list[dict] = []
    by_prov: dict[str, int] = {}
    for rec in sorted(records.values(), key=lambda r: (r["provincia"], r["nam"])):
        geometry = geom_to_json(rec["geom"])
        if geometry is None:
            continue
        by_prov[rec["provincia"]] = by_prov.get(rec["provincia"], 0) + 1
        features.append(
            {
                "type": "Feature",
                "properties": {
                    "in1": rec["in1"],
                    "provincia": rec["provincia"],
                    "nam": rec["nam"],
                    "ha": rec["ha"],
                },
                "geometry": geometry,
            }
        )

    if not features:
        raise RuntimeError("No quedaron departamentos de las 5 provincias")

    collection = {
        "type": "FeatureCollection",
        "name": "atlas-quemado",
        "months": MONTHS,
        "crs": {
            "type": "name",
            "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"},
        },
        "features": features,
    }
    OUT_PATH.write_text(
        json.dumps(collection, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )
    size_kb = OUT_PATH.stat().st_size / 1024
    print(f"Wrote {OUT_PATH} ({size_kb:.1f} KiB, {len(features)} features)")
    print("  by province:", by_prov)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
