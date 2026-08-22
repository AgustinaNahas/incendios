#!/usr/bin/env python3
"""Build simplified WGS84 GeoJSON layers for the schematic OTBN atlas.

Outputs in public/data/:
  - atlas-land.geojson          Argentina provinces + Cono Sur neighbors
  - atlas-ecoregion-bosques.geojson
  - atlas-provincias.geojson    5 focus provinces (outline)
  - atlas-bosque-fill.geojson   Bosques Patagonicos clipped to the 5
  - atlas-ciudades.geojson
"""

from __future__ import annotations

import json
import shutil
import subprocess
import sys
import tempfile
import urllib.request
from pathlib import Path

from osgeo import ogr, osr

ogr.UseExceptions()

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "data"
PROV_SHP = ROOT / "provincia" / "provinciaPolygon.shp"
ECO_JSON = ROOT / "ecoregiones_argentina.json"
BAHRA = ROOT / "public" / "data" / "localidad_bahra.geojson"

NE_URL = (
    "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/"
    "master/geojson/ne_110m_admin_0_countries.geojson"
)
NE_COUNTRIES = {
    "Chile",
    "Uruguay",
    "Paraguay",
    "Brazil",
    "Bolivia",
    "Falkland Islands",
}

FOCUS_NAM = {
    "Neuquén": "Neuquén",
    "Río Negro": "Río Negro",
    "Chubut": "Chubut",
    "Santa Cruz": "Santa Cruz",
}
TF_PREFIX = "Tierra del Fuego"

CITIES = [
    ("Neuquén", "Neuquén"),
    ("San Martín de los Andes", "San Martín de los Andes"),
    ("Villa La Angostura", "Villa La Angostura"),
    ("San Carlos de Bariloche", "Bariloche"),
    ("El Bolsón", "El Bolsón"),
    ("Esquel", "Esquel"),
    ("El Chaltén", "El Chaltén"),
    ("El Calafate", "El Calafate"),
    ("Río Grande", "Río Grande"),
    ("Ushuaia", "Ushuaia"),
]

SIMPLIFY_LAND = 0.02
SIMPLIFY_FOCUS = 0.008
COORD_PRECISION = 5

# Recorte en L: Brasil completo al este, TdF + Malvinas al sur.
# Sin Antártida ni Georgias/Sandwich (quedan al este de CLIP_EAST_SOUTH).
CLIP_WEST = -76.0
CLIP_EAST_NORTH = -34.5
CLIP_EAST_SOUTH = -53.5
CLIP_LAT_CUT = -48.0
CLIP_SOUTH = -56.3
CLIP_NORTH = 12.0


def run(cmd: list[str]) -> None:
    print("+", " ".join(cmd), flush=True)
    subprocess.run(cmd, check=True)


def wgs84() -> osr.SpatialReference:
    srs = osr.SpatialReference()
    srs.ImportFromEPSG(4326)
    srs.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
    return srs


def round_coords(obj: object, ndigits: int = COORD_PRECISION) -> object:
    if isinstance(obj, list):
        if obj and isinstance(obj[0], (int, float)):
            return [round(float(x), ndigits) for x in obj]
        return [round_coords(x, ndigits) for x in obj]
    return obj


def clip_box() -> ogr.Geometry:
    ring = ogr.Geometry(ogr.wkbLinearRing)
    ring.AddPoint(CLIP_WEST, CLIP_NORTH)
    ring.AddPoint(CLIP_EAST_NORTH, CLIP_NORTH)
    ring.AddPoint(CLIP_EAST_NORTH, CLIP_LAT_CUT)
    ring.AddPoint(CLIP_EAST_SOUTH, CLIP_LAT_CUT)
    ring.AddPoint(CLIP_EAST_SOUTH, CLIP_SOUTH)
    ring.AddPoint(CLIP_WEST, CLIP_SOUTH)
    ring.AddPoint(CLIP_WEST, CLIP_NORTH)
    poly = ogr.Geometry(ogr.wkbPolygon)
    poly.AddGeometry(ring)
    return poly


_CLIP_BOX = None


def clip_to_focus(geom: ogr.Geometry) -> ogr.Geometry | None:
    """Saca Antártida y Georgias; deja Brasil, TdF insular y Malvinas."""
    global _CLIP_BOX
    if geom is None or geom.IsEmpty():
        return None
    if _CLIP_BOX is None:
        _CLIP_BOX = clip_box()
    env = geom.GetEnvelope()  # minx, maxx, miny, maxy
    cenv = _CLIP_BOX.GetEnvelope()
    if env[1] < cenv[0] or env[0] > cenv[1] or env[3] < cenv[2] or env[2] > cenv[3]:
        return None
    if _CLIP_BOX.Contains(geom):
        return geom
    clipped = geom.Intersection(_CLIP_BOX)
    if clipped is None or clipped.IsEmpty():
        return None
    return clipped


def geom_to_feature(geom: ogr.Geometry, props: dict) -> dict | None:
    if geom is None or geom.IsEmpty():
        return None
    if geom.GetCoordinateDimension() == 3:
        geom.FlattenTo2D()
    gtype = geom.GetGeometryName()
    if gtype in {"POLYGON", "MULTIPOLYGON"}:
        forced = ogr.ForceToMultiPolygon(geom)
        if forced is None or forced.IsEmpty():
            return None
        geom = forced
    raw = json.loads(geom.ExportToJson())
    if "coordinates" in raw:
        raw["coordinates"] = round_coords(raw["coordinates"])
    return {"type": "Feature", "properties": props, "geometry": raw}


def write_collection(path: Path, name: str, features: list[dict]) -> None:
    collection = {
        "type": "FeatureCollection",
        "name": name,
        "crs": {
            "type": "name",
            "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"},
        },
        "features": features,
    }
    path.write_text(
        json.dumps(collection, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )
    size_kb = path.stat().st_size / 1024
    print(f"Wrote {path} ({size_kb:.1f} KiB, {len(features)} features)")


def representative_point(geom: ogr.Geometry) -> tuple[float, float] | None:
    try:
        pt = geom.PointOnSurface()
        if pt and not pt.IsEmpty():
            return (pt.GetX(), pt.GetY())
    except Exception:
        pass
    try:
        c = geom.Centroid()
        if c and not c.IsEmpty():
            return (c.GetX(), c.GetY())
    except Exception:
        pass
    return None


def normalize_province(nam: str) -> str | None:
    if nam in FOCUS_NAM:
        return FOCUS_NAM[nam]
    if nam.startswith(TF_PREFIX):
        return "Tierra del Fuego"
    return None


def simplify_layer_to_gpkg(
    src: Path,
    dest: Path,
    simplify: float,
    sql: str | None = None,
    encoding: str | None = None,
) -> None:
    cmd = [
        "ogr2ogr",
        "-f",
        "GPKG",
        str(dest),
        str(src),
        "-t_srs",
        "EPSG:4326",
        "-nln",
        "atlas",
        "-nlt",
        "PROMOTE_TO_MULTI",
        "-simplify",
        str(simplify),
        "--config",
        "OGR_CT_FORCE_TRADITIONAL_GIS_ORDER",
        "YES",
        "--config",
        "OGR_GEOJSON_MAX_OBJ_SIZE",
        "0",
    ]
    if encoding:
        cmd.extend(["--config", "SHAPE_ENCODING", encoding])
    if sql:
        cmd.extend(["-dialect", "sqlite", "-sql", sql])
    run(cmd)


def read_gpkg_features(path: Path) -> list[ogr.Feature]:
    ds = ogr.Open(str(path))
    if ds is None:
        raise RuntimeError(f"No se pudo abrir {path}")
    layer = ds.GetLayer(0)
    feats = [f.Clone() for f in layer]
    ds = None
    return feats


def build_land_and_provinces(workdir: Path) -> tuple[list[dict], list[dict]]:
    if not PROV_SHP.exists():
        raise FileNotFoundError(PROV_SHP)

    gpkg = workdir / "provincias.gpkg"
    simplify_layer_to_gpkg(
        PROV_SHP,
        gpkg,
        SIMPLIFY_LAND,
        encoding="ISO-8859-1",
    )

    land: list[dict] = []
    focus: list[dict] = []

    for feat in read_gpkg_features(gpkg):
        nam = feat.GetField("nam") or ""
        geom = feat.GetGeometryRef()
        if geom is None:
            continue
        geom = geom.Clone()
        geom = clip_to_focus(geom)
        if geom is None:
            continue
        props = {
            "kind": "provincia",
            "nam": nam,
            "focus": False,
        }
        built = geom_to_feature(geom, props)
        if built:
            land.append(built)

        label = normalize_province(nam)
        if label:
            # Re-simplify focus provinces at higher detail from original shp
            focus.append((label, nam))

    # Rebuild focus polygons at finer tolerance
    focus_gpkg = workdir / "provincias_focus.gpkg"
    simplify_layer_to_gpkg(
        PROV_SHP,
        focus_gpkg,
        SIMPLIFY_FOCUS,
        encoding="ISO-8859-1",
    )
    focus_out: list[dict] = []
    for feat in read_gpkg_features(focus_gpkg):
        nam = feat.GetField("nam") or ""
        label = normalize_province(nam)
        if not label:
            continue
        geom = feat.GetGeometryRef()
        if geom is None:
            continue
        geom = geom.Clone()
        geom = clip_to_focus(geom)
        if geom is None:
            continue
        pt = representative_point(geom)
        props = {
            "nam": label,
            "nam_src": nam,
        }
        if pt:
            props["label_lon"] = round(pt[0], 4)
            props["label_lat"] = round(pt[1], 4)
        built = geom_to_feature(geom, props)
        if built:
            focus_out.append(built)

    focus_out.sort(key=lambda f: f["properties"]["nam"])
    return land, focus_out


def add_neighbors(land: list[dict], workdir: Path) -> None:
    dest = workdir / "ne_110m_admin_0_countries.geojson"
    print(f"Downloading {NE_URL}", flush=True)
    urllib.request.urlretrieve(NE_URL, dest)

    ds = ogr.Open(str(dest))
    if ds is None:
        raise RuntimeError("No se pudo abrir Natural Earth")
    layer = ds.GetLayer(0)
    for feat in layer:
        name = None
        for field in ("NAME", "NAME_EN", "ADMIN", "NAME_LONG"):
            try:
                value = feat.GetField(field)
            except Exception:
                continue
            if value:
                name = str(value)
                break
        if name not in NE_COUNTRIES:
            continue
        geom = feat.GetGeometryRef()
        if geom is None:
            continue
        geom = geom.Clone()
        geom = clip_to_focus(geom)
        if geom is None:
            continue
        simplified = geom.SimplifyPreserveTopology(0.05)
        if simplified is not None and not simplified.IsEmpty():
            geom = simplified
        built = geom_to_feature(
            geom,
            {"kind": "pais", "nam": name, "focus": False},
        )
        if built:
            land.append(built)
    ds = None


def build_ecoregion(workdir: Path) -> tuple[list[dict], ogr.Geometry]:
    if not ECO_JSON.exists():
        raise FileNotFoundError(ECO_JSON)

    gpkg = workdir / "eco.gpkg"
    run(
        [
            "ogr2ogr",
            "-f",
            "GPKG",
            str(gpkg),
            str(ECO_JSON),
            "-t_srs",
            "EPSG:4326",
            "-nln",
            "eco",
            "-nlt",
            "PROMOTE_TO_MULTI",
            "-simplify",
            str(SIMPLIFY_FOCUS),
            "-where",
            "ecorregion = 'Bosques Patagonicos'",
            "--config",
            "OGR_CT_FORCE_TRADITIONAL_GIS_ORDER",
            "YES",
            "--config",
            "OGR_GEOJSON_MAX_OBJ_SIZE",
            "0",
        ]
    )

    features: list[dict] = []
    union = None
    for feat in read_gpkg_features(gpkg):
        geom = feat.GetGeometryRef()
        if geom is None:
            continue
        geom = geom.Clone()
        if union is None:
            union = geom.Clone()
        else:
            merged = union.Union(geom)
            if merged is not None:
                union = merged
        built = geom_to_feature(
            geom,
            {
                "ecorregion": "Bosques Patagónicos",
                "ecorregion_src": "Bosques Patagonicos",
            },
        )
        if built:
            features.append(built)

    if not features or union is None:
        raise RuntimeError("No se encontró la ecorregión Bosques Patagonicos")
    return features, union


def clip_bosque_to_provinces(
    eco_geom: ogr.Geometry,
    provincias: list[dict],
) -> list[dict]:
    union = None
    for feat in provincias:
        g = ogr.CreateGeometryFromJson(json.dumps(feat["geometry"]))
        if g is None:
            continue
        if union is None:
            union = g
        else:
            merged = union.Union(g)
            if merged is not None:
                union = merged
    if union is None:
        return []
    clipped = eco_geom.Intersection(union)
    if clipped is None or clipped.IsEmpty():
        return []
    built = geom_to_feature(
        clipped,
        {"kind": "bosque", "nam": "Bosques Patagónicos"},
    )
    return [built] if built else []


def build_cities() -> list[dict]:
    if not BAHRA.exists():
        raise FileNotFoundError(BAHRA)
    data = json.loads(BAHRA.read_text(encoding="utf-8"))
    wanted = {src: label for src, label in CITIES}
    found: dict[str, dict] = {}

    for feat in data["features"]:
        fna = feat.get("properties", {}).get("fna") or ""
        if fna not in wanted:
            continue
        geom = feat.get("geometry")
        if not geom:
            continue
        coords = geom.get("coordinates")
        if geom.get("type") == "MultiPoint" and coords:
            coords = coords[0]
        if not coords or len(coords) < 2:
            continue
        lon, lat = float(coords[0]), float(coords[1])
        label = wanted[fna]
        found[label] = {
            "type": "Feature",
            "properties": {
                "nam": label,
                "fna": fna,
                "provincia": feat["properties"].get("nom_pcia"),
            },
            "geometry": {
                "type": "Point",
                "coordinates": [round(lon, 5), round(lat, 5)],
            },
        }

    missing = [label for _, label in CITIES if label not in found]
    if missing:
        print(f"WARN: ciudades no encontradas en BAHRA: {missing}", flush=True)

    order = [label for _, label in CITIES]
    return [found[name] for name in order if name in found]


def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    workdir = Path(tempfile.mkdtemp(prefix="atlas-build-"))
    try:
        print("== Provincias / tierra ==")
        land, focus = build_land_and_provinces(workdir)
        print(f"  provincias ARG: {sum(1 for f in land if f['properties']['kind']=='provincia')}")
        print(f"  focus: {[f['properties']['nam'] for f in focus]}")

        print("== Cono Sur ==")
        add_neighbors(land, workdir)
        print(f"  land features: {len(land)}")

        print("== Ecorregión ==")
        eco, eco_geom = build_ecoregion(workdir)
        print(f"  features: {len(eco)}")

        print("== Bosque fill (clip) ==")
        bosque = clip_bosque_to_provinces(eco_geom, focus)
        print(f"  features: {len(bosque)}")

        print("== Ciudades ==")
        cities = build_cities()
        print(f"  features: {len(cities)}")

        write_collection(OUT_DIR / "atlas-land.geojson", "atlas-land", land)
        write_collection(
            OUT_DIR / "atlas-ecoregion-bosques.geojson",
            "atlas-ecoregion-bosques",
            eco,
        )
        write_collection(OUT_DIR / "atlas-provincias.geojson", "atlas-provincias", focus)
        write_collection(OUT_DIR / "atlas-bosque-fill.geojson", "atlas-bosque-fill", bosque)
        write_collection(OUT_DIR / "atlas-ciudades.geojson", "atlas-ciudades", cities)
    finally:
        shutil.rmtree(workdir, ignore_errors=True)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
