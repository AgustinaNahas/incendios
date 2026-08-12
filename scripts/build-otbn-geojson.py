#!/usr/bin/env python3
"""Build a single WGS84 GeoJSON of OTBN zoning categories.

Sources:
  - data/OTBN Santa Cruz/SC_2021_OTBN.shp  (CAT_CONS)
  - data/OTBN Chubut/OTBN Esquel y Norte.kml (OTBN_* layers)
  - data/OTBN Chubut/OTBN Esquel y Sur.kmz   (OTBN_* layers; Esquel skipped as duplicate)
  - data/neuquen.geojson  (PLG_DESCRIPCION: ROJO/AMARILLO/VERDE → I/II/III)
  - data/LOTBN_RioNegro_categorias.gpkg  (categoria 1/2/3; 0 = no bosque)

Output: public/data/otbn-zonas.geojson
"""

from __future__ import annotations

import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from osgeo import ogr, osr

ogr.UseExceptions()

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
OUT = ROOT / "public" / "data" / "otbn-zonas.geojson"
SIMPLIFY_DEG = 0.001
COORD_PRECISION = 5

ZONA_META: dict[int, tuple[str, str]] = {
    1: ("I", "Conservación"),
    2: ("II", "Uso sustentable"),
    3: ("III", "Cambio de uso"),
}

SC_SHP = DATA / "OTBN Santa Cruz" / "SC_2021_OTBN.shp"
CHUBUT_NORTE = DATA / "OTBN Chubut" / "OTBN Esquel y Norte.kml"
CHUBUT_SUR = DATA / "OTBN Chubut" / "OTBN Esquel y Sur.kmz"
NEUQUEN_GEOJSON = DATA / "neuquen.geojson"
RIO_NEGRO_GPKG = DATA / "LOTBN_RioNegro_categorias.gpkg"


def run(cmd: list[str]) -> None:
    print("+", " ".join(cmd), flush=True)
    subprocess.run(cmd, check=True)


def zona_from_chubut(value: object) -> int | None:
    if value is None:
        return None
    s = str(value).strip().upper()
    if not s or s == "NONE":
        return None
    # Prefer longest roman prefix first (III before II before I)
    if s.startswith("III") or s == "3":
        return 3
    if s.startswith("II") or s == "2":
        return 2
    if s.startswith("I") or s == "1":
        return 1
    return None


def feature_props(zona: int, provincia: str) -> dict:
    codigo, nombre = ZONA_META[zona]
    return {
        "zona": zona,
        "zona_codigo": codigo,
        "zona_nombre": nombre,
        "provincia": provincia,
    }


def round_coords(obj: object, ndigits: int = COORD_PRECISION) -> object:
    if isinstance(obj, list):
        if obj and isinstance(obj[0], (int, float)):
            return [round(float(x), ndigits) for x in obj]
        return [round_coords(x, ndigits) for x in obj]
    return obj


def ring_signed_area(ring: list[list[float]]) -> float:
    area = 0.0
    for i in range(len(ring) - 1):
        x1, y1 = ring[i][0], ring[i][1]
        x2, y2 = ring[i + 1][0], ring[i + 1][1]
        area += x1 * y2 - x2 * y1
    return area / 2.0


def orient_polygon_coords(coords: list) -> list:
    """RFC 7947: exterior CCW, holes CW."""
    if not coords:
        return coords
    out = []
    for i, ring in enumerate(coords):
        if len(ring) < 4:
            continue
        area = ring_signed_area(ring)
        need_ccw = i == 0
        if need_ccw and area < 0:
            ring = list(reversed(ring))
        elif not need_ccw and area > 0:
            ring = list(reversed(ring))
        out.append(ring)
    return out


def orient_geometry_dict(geom: dict) -> dict | None:
    gtype = geom.get("type")
    if gtype == "Polygon":
        coords = orient_polygon_coords(geom["coordinates"])
        if not coords:
            return None
        return {"type": "Polygon", "coordinates": coords}
    if gtype == "MultiPolygon":
        polys = []
        for poly in geom["coordinates"]:
            oriented = orient_polygon_coords(poly)
            if oriented:
                polys.append(oriented)
        if not polys:
            return None
        return {"type": "MultiPolygon", "coordinates": polys}
    return None


def make_feature(geom: ogr.Geometry, zona: int, provincia: str) -> dict | None:
    if geom.GetCoordinateDimension() == 3:
        geom.FlattenTo2D()
    forced = ogr.ForceToMultiPolygon(geom)
    if forced is not None and not forced.IsEmpty():
        geom = forced
    raw = json.loads(geom.ExportToJson())
    if "coordinates" not in raw:
        return None
    raw["coordinates"] = round_coords(raw["coordinates"])
    oriented = orient_geometry_dict(raw)
    if oriented is None:
        return None
    return {
        "type": "Feature",
        "properties": feature_props(zona, provincia),
        "geometry": oriented,
    }


def wgs84_traditional() -> osr.SpatialReference:
    """EPSG:4326 with lon/lat axis order (avoids GDAL 3+ lat/lon swaps)."""
    srs = osr.SpatialReference()
    srs.ImportFromEPSG(4326)
    srs.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
    return srs


def dissolve_gpkg_by_zona(
    gpkg_path: Path,
    layer_name: str,
    geom_col: str,
    provincia: str,
) -> list[dict]:
    """Dissolve + simplify a GPKG layer that already has a `zona` integer field."""
    out_geojson = gpkg_path.with_suffix(".dissolved.geojson")
    sql = (
        f"SELECT zona, "
        f"ST_SimplifyPreserveTopology(ST_Union({geom_col}), {SIMPLIFY_DEG}) AS geom "
        f"FROM {layer_name} GROUP BY zona"
    )
    run(
        [
            "ogr2ogr",
            "-f",
            "GeoJSON",
            str(out_geojson),
            str(gpkg_path),
            "-a_srs",
            "EPSG:4326",
            "-dialect",
            "sqlite",
            "-sql",
            sql,
            "-lco",
            f"COORDINATE_PRECISION={COORD_PRECISION}",
            "--config",
            "OGR_GEOJSON_MAX_OBJ_SIZE",
            "0",
            "--config",
            "OGR_CT_FORCE_TRADITIONAL_GIS_ORDER",
            "YES",
        ]
    )

    features: list[dict] = []
    ds = ogr.Open(str(out_geojson))
    if ds is None:
        raise RuntimeError(f"No se pudo abrir {out_geojson}")
    layer = ds.GetLayer(0)
    for layer_feat in layer:
        zona = int(layer_feat.GetField("zona"))
        geom = layer_feat.GetGeometryRef()
        if geom is None or geom.IsEmpty():
            continue
        built = make_feature(geom.Clone(), zona, provincia)
        if built is not None:
            features.append(built)
    ds = None
    return features


def build_santa_cruz(workdir: Path) -> list[dict]:
    if not SC_SHP.exists():
        raise FileNotFoundError(SC_SHP)

    gpkg = workdir / "santa_cruz.gpkg"
    run(
        [
            "ogr2ogr",
            "-f",
            "GPKG",
            str(gpkg),
            str(SC_SHP),
            "-t_srs",
            "EPSG:4326",
            "-nln",
            "otbn",
            "-nlt",
            "PROMOTE_TO_MULTI",
            "--config",
            "OGR_CT_FORCE_TRADITIONAL_GIS_ORDER",
            "YES",
        ]
    )

    # Normalize CAT_CONS → zona in a second layer, then dissolve.
    gpkg_norm = workdir / "santa_cruz_norm.gpkg"
    run(
        [
            "ogr2ogr",
            "-f",
            "GPKG",
            str(gpkg_norm),
            str(gpkg),
            "-nln",
            "otbn",
            "-nlt",
            "PROMOTE_TO_MULTI",
            "-dialect",
            "sqlite",
            "-sql",
            "SELECT CAST(CAT_CONS AS INTEGER) AS zona, geom FROM otbn WHERE CAT_CONS IS NOT NULL",
        ]
    )
    return dissolve_gpkg_by_zona(gpkg_norm, "otbn", "geom", "Santa Cruz")


def collect_chubut_to_gpkg(workdir: Path) -> Path:
    gpkg = workdir / "chubut.gpkg"
    srs = wgs84_traditional()

    driver = ogr.GetDriverByName("GPKG")
    if gpkg.exists():
        driver.DeleteDataSource(str(gpkg))
    ds_out = driver.CreateDataSource(str(gpkg))
    layer_out = ds_out.CreateLayer(
        "otbn",
        srs=srs,
        geom_type=ogr.wkbMultiPolygon,
    )
    layer_out.CreateField(ogr.FieldDefn("zona", ogr.OFTInteger))

    sources = [
        (CHUBUT_NORTE, False),
        (CHUBUT_SUR, True),
    ]

    total = 0
    for path, skip_esquel in sources:
        if not path.exists():
            raise FileNotFoundError(path)
        ds_in = ogr.Open(str(path))
        if ds_in is None:
            raise RuntimeError(f"No se pudo abrir {path}")

        for i in range(ds_in.GetLayerCount()):
            layer = ds_in.GetLayer(i)
            name = layer.GetName()
            if not name.startswith("OTBN_"):
                continue
            if skip_esquel and name == "OTBN_Esquel":
                print(f"  skip duplicate {name} from {path.name}")
                continue

            defn = layer.GetLayerDefn()
            fields = [defn.GetFieldDefn(j).GetName() for j in range(defn.GetFieldCount())]
            cat_field = "CATEGORIA" if "CATEGORIA" in fields else "Name"

            for feat in layer:
                zona = zona_from_chubut(feat.GetField(cat_field))
                if zona is None:
                    continue
                geom = feat.GetGeometryRef()
                if geom is None or geom.IsEmpty():
                    continue

                geom = geom.Clone()
                if geom.GetCoordinateDimension() == 3:
                    geom.FlattenTo2D()

                # KML ya viene en lon/lat WGS84. No usar TransformTo(EPSG:4326):
                # con el orden de ejes authority de GDAL 3+ eso intercambia lat/lon.
                geom.AssignSpatialReference(srs)

                forced = ogr.ForceToMultiPolygon(geom)
                if forced is None or forced.IsEmpty():
                    continue
                geom = forced

                out_feat = ogr.Feature(layer_out.GetLayerDefn())
                out_feat.SetField("zona", zona)
                out_feat.SetGeometry(geom)
                layer_out.CreateFeature(out_feat)
                total += 1

        ds_in = None

    ds_out = None
    print(f"  Chubut features collected: {total}")
    if total == 0:
        raise RuntimeError("No se encontraron features OTBN de Chubut")
    return gpkg


def build_chubut(workdir: Path) -> list[dict]:
    gpkg = collect_chubut_to_gpkg(workdir)
    return dissolve_gpkg_by_zona(gpkg, "otbn", "geom", "Chubut")


def build_neuquen(workdir: Path) -> list[dict]:
    if not NEUQUEN_GEOJSON.exists():
        raise FileNotFoundError(NEUQUEN_GEOJSON)

    raw = workdir / "neuquen_raw.gpkg"
    run(
        [
            "ogr2ogr",
            "-f",
            "GPKG",
            str(raw),
            str(NEUQUEN_GEOJSON),
            "-nln",
            "raw",
            "-nlt",
            "PROMOTE_TO_MULTI",
            "--config",
            "OGR_CT_FORCE_TRADITIONAL_GIS_ORDER",
            "YES",
        ]
    )

    # OTBN por color oficial: rojo=I, amarillo=II, verde=III
    gpkg_norm = workdir / "neuquen_norm.gpkg"
    sql = (
        'SELECT CASE "GEO.CART_04_GIS_POLIGONOS.PLG_DESCRIPCION" '
        "WHEN 'ROJO' THEN 1 WHEN 'AMARILLO' THEN 2 WHEN 'VERDE' THEN 3 END AS zona, "
        "geom FROM raw "
        'WHERE "GEO.CART_04_GIS_POLIGONOS.PLG_DESCRIPCION" IN '
        "('ROJO','AMARILLO','VERDE')"
    )
    run(
        [
            "ogr2ogr",
            "-f",
            "GPKG",
            str(gpkg_norm),
            str(raw),
            "-nln",
            "otbn",
            "-nlt",
            "PROMOTE_TO_MULTI",
            "-dialect",
            "sqlite",
            "-sql",
            sql,
        ]
    )
    return dissolve_gpkg_by_zona(gpkg_norm, "otbn", "geom", "Neuquén")


def build_rio_negro(workdir: Path) -> list[dict]:
    if not RIO_NEGRO_GPKG.exists():
        raise FileNotFoundError(RIO_NEGRO_GPKG)

    # Pseudo-Mercator → WGS84; categoria 0 = sin bosque (excluir)
    gpkg_norm = workdir / "rio_negro_norm.gpkg"
    run(
        [
            "ogr2ogr",
            "-f",
            "GPKG",
            str(gpkg_norm),
            str(RIO_NEGRO_GPKG),
            "-t_srs",
            "EPSG:4326",
            "-nln",
            "otbn",
            "-nlt",
            "PROMOTE_TO_MULTI",
            "-dialect",
            "sqlite",
            "-sql",
            "SELECT CAST(categoria AS INTEGER) AS zona, geom "
            "FROM LOTBN_RioNegro_categorias WHERE categoria IN (1, 2, 3)",
            "--config",
            "OGR_CT_FORCE_TRADITIONAL_GIS_ORDER",
            "YES",
        ]
    )
    return dissolve_gpkg_by_zona(gpkg_norm, "otbn", "geom", "Río Negro")


def main() -> int:
    required = (SC_SHP, CHUBUT_NORTE, CHUBUT_SUR, NEUQUEN_GEOJSON, RIO_NEGRO_GPKG)
    for path in required:
        if not path.exists():
            print(f"ERROR: falta {path}", file=sys.stderr)
            return 1

    OUT.parent.mkdir(parents=True, exist_ok=True)
    workdir = Path(tempfile.mkdtemp(prefix="otbn-build-"))
    try:
        builders = [
            ("Neuquén", build_neuquen),
            ("Río Negro", build_rio_negro),
            ("Chubut", build_chubut),
            ("Santa Cruz", build_santa_cruz),
        ]
        all_features: list[dict] = []
        for label, builder in builders:
            print(f"== {label} ==")
            feats = builder(workdir)
            print(f"  features: {len(feats)}")
            all_features.extend(feats)

        features = sorted(
            all_features,
            key=lambda f: (f["properties"]["provincia"], f["properties"]["zona"]),
        )

        collection = {
            "type": "FeatureCollection",
            "name": "otbn-zonas",
            "crs": {
                "type": "name",
                "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"},
            },
            "features": features,
        }

        OUT.write_text(
            json.dumps(collection, ensure_ascii=False, separators=(",", ":")),
            encoding="utf-8",
        )
        size_mb = OUT.stat().st_size / (1024 * 1024)
        print(f"Wrote {OUT} ({size_mb:.2f} MiB, {len(features)} features)")
        for f in features:
            p = f["properties"]
            print(f"  - {p['provincia']} zona {p['zona_codigo']} ({p['zona_nombre']})")
    finally:
        shutil.rmtree(workdir, ignore_errors=True)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
