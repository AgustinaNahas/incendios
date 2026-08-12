#!/usr/bin/env python3
"""Build cleaned fire/native-forest CSVs from existing data + extracted anuario/series figures.

Sources (see each CSV `fuente` column / README note in gaps CSV):
- data/bqd_bninc_ha_año_2023.csv — ha total + ha BN por provincia 1993–2023
- series PDF 2009–2015 / 2010–2016 — cantidad de incendios; región Andino Patagónico
- anuarios 2019/2021/2022/2024 — región Andino; detalle provincial 2022/2024; BN 2024
- public/data RII — cantidad/ha 2017–2026
"""

from __future__ import annotations

import csv
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
PUBLIC = ROOT / "public" / "data"
OUT = PUBLIC

PROV_ALIASES = {
    "Buenos Aires (1)": "Buenos Aires",
    "Ciudad Aut. de Bs. As.": "Ciudad Autónoma de Buenos Aires",
    "Ciudad Autónoma de Bs. As.": "Ciudad Autónoma de Buenos Aires",
    "Ciudad Aut. de Buenos Aires": "Ciudad Autónoma de Buenos Aires",
    "Ciudad Autónoma de Buenos Aires": "Ciudad Autónoma de Buenos Aires",
    "Tierra del Fuego, A. e I.A.S.": "Tierra del Fuego",
    "Tierra del Fuego": "Tierra del Fuego",
    "Mendoza (2)": "Mendoza",
    "CABA": "Ciudad Autónoma de Buenos Aires",
    "Parques Nacionales": "Parques Nacionales",
}


def norm_prov(name: str) -> str:
    name = name.strip()
    return PROV_ALIASES.get(name, name)


def parse_num(raw: str | None) -> str:
    """Return cleaned numeric string or empty for missing."""
    if raw is None:
        return ""
    s = str(raw).strip()
    if s in {"", "-", "–", "—", "s/d", "s/i", "s/í", "*"}:
        return ""
    s = s.replace("*", "").strip()
    # Argentine thousands: 1.234,56 or 1.234
    if re.fullmatch(r"-?\d{1,3}(\.\d{3})+(,\d+)?", s):
        s = s.replace(".", "").replace(",", ".")
    elif "," in s and "." not in s:
        s = s.replace(",", ".")
    elif s.count(",") == 1 and s.count(".") >= 1:
        # 175.141,15
        s = s.replace(".", "").replace(",", ".")
    try:
        v = float(s)
    except ValueError:
        return ""
    if v == int(v):
        return str(int(v))
    return f"{v:.2f}".rstrip("0").rstrip(".")


# ---------------------------------------------------------------------------
# Hardcoded extracts from series / anuarios (validated against pdftotext)
# ---------------------------------------------------------------------------

# Cantidad de incendios por jurisdicción — series 2009–2015 + 2016 from 2010–2016
COUNTS_2009_2016: dict[str, dict[int, str]] = {
    "Total": {2009: "10340", 2010: "7526", 2011: "6750", 2012: "5607", 2013: "6705", 2014: "6968", 2015: "6076", 2016: "7519"},
    "Buenos Aires": {2009: "2987", 2010: "1644", 2011: "1174", 2012: "111", 2013: "458", 2014: "2788", 2015: "1794", 2016: "2802"},
    "Catamarca": {2009: "61", 2010: "42", 2011: "38", 2012: "84", 2013: "90", 2014: "69", 2015: "186", 2016: "197"},
    "Ciudad Autónoma de Buenos Aires": {2009: "3", 2010: "1", 2011: "3", 2012: "6", 2013: "6", 2014: "2", 2015: "3", 2016: "5"},
    "Córdoba": {2009: "229", 2010: "192", 2011: "147", 2012: "135", 2013: "173", 2014: "291", 2015: "3", 2016: "283"},
    "Corrientes": {2009: "42", 2010: "50", 2011: "18", 2012: "215", 2013: "101", 2014: "64", 2015: "22", 2016: "12"},
    "Chaco": {2009: "171", 2010: "318", 2011: "529", 2012: "597", 2013: "480", 2014: "445", 2015: "222", 2016: "253"},
    "Chubut": {2009: "167", 2010: "238", 2011: "169", 2012: "89", 2013: "106", 2014: "76", 2015: "82", 2016: "89"},
    "Entre Ríos": {2009: "30", 2010: "60", 2011: "38", 2012: "94", 2013: "112", 2014: "24", 2015: "42", 2016: "23"},
    "Formosa": {2009: "18", 2010: "", 2011: "131", 2012: "42", 2013: "326", 2014: "63", 2015: "68", 2016: "61"},
    "Jujuy": {2009: "275", 2010: "218", 2011: "212", 2012: "199", 2013: "246", 2014: "158", 2015: "173", 2016: "195"},
    "La Pampa": {2009: "12", 2010: "24", 2011: "38", 2012: "25", 2013: "87", 2014: "50", 2015: "72", 2016: "91"},
    "La Rioja": {2009: "26", 2010: "37", 2011: "161", 2012: "167", 2013: "248", 2014: "167", 2015: "222", 2016: "262"},
    "Mendoza": {2009: "123", 2010: "63", 2011: "123", 2012: "172", 2013: "185", 2014: "159", 2015: "164", 2016: "176"},
    "Misiones": {2009: "282", 2010: "581", 2011: "96", 2012: "202", 2013: "98", 2014: "102", 2015: "19", 2016: "36"},
    "Neuquén": {2009: "202", 2010: "125", 2011: "157", 2012: "105", 2013: "141", 2014: "90", 2015: "49", 2016: "76"},
    "Parques Nacionales": {2009: "31", 2010: "22", 2011: "12", 2012: "8", 2013: "21", 2014: "17", 2015: "31", 2016: "41"},
    "Río Negro": {2009: "1726", 2010: "1246", 2011: "1130", 2012: "784", 2013: "1036", 2014: "904", 2015: "1063", 2016: "766"},
    "Salta": {2009: "892", 2010: "1062", 2011: "358", 2012: "443", 2013: "870", 2014: "236", 2015: "338", 2016: "393"},
    "San Juan": {2009: "282", 2010: "314", 2011: "401", 2012: "307", 2013: "187", 2014: "263", 2015: "240", 2016: "275"},
    "San Luis": {2009: "182", 2010: "47", 2011: "33", 2012: "33", 2013: "36", 2014: "41", 2015: "74", 2016: "122"},
    "Santa Cruz": {2009: "17", 2010: "15", 2011: "11", 2012: "14", 2013: "8", 2014: "3", 2015: "55", 2016: "20"},
    "Santa Fe": {2009: "778", 2010: "1024", 2011: "1658", 2012: "1613", 2013: "1625", 2014: "856", 2015: "1047", 2016: "1241"},
    "Santiago del Estero": {2009: "24", 2010: "67", 2011: "93", 2012: "72", 2013: "45", 2014: "85", 2015: "65", 2016: "76"},
    "Tierra del Fuego": {2009: "23", 2010: "136", 2011: "20", 2012: "10", 2013: "16", 2014: "12", 2015: "20", 2016: "14"},
    "Tucumán": {2009: "1757", 2010: "", 2011: "", 2012: "80", 2013: "4", 2014: "3", 2015: "22", 2016: "10"},
}

# Región Bosque Andino Patagónico
# Series 2010–2016: cantidad + ha total (sin split BN en la tabla 5.9)
# Anuarios: cantidad + ha total + ha BN
ANDINO = [
    # año, n_incendios, ha_total, ha_bosque_nativo, fuente
    (2010, "1712", "1939", "", "series_2010-2016"),
    (2011, "1414", "15007", "", "series_2010-2016"),
    (2012, "932", "24164", "", "series_2010-2016"),
    (2013, "1224", "4385", "", "series_2010-2016"),
    (2014, "966", "2418", "", "series_2010-2016"),
    (2015, "1160", "71638", "", "series_2010-2016"),
    (2016, "861", "12729", "", "series_2010-2016"),
    (2019, "532", "6118.69", "237.31", "anuario_2019"),
    (2021, "324", "13325.95", "1569.09", "anuario_2021"),
    (2022, "641", "36016.26", "15781.06", "anuario_2022"),
    (2024, "281", "14541", "9931", "anuario_2024"),
]

# Detalle provincial anuario 2024 (cantidad, ha_total, ha_BN, causas absolutas)
DETAIL_2024 = [
    # prov, n, ha_total, ha_bn, ha_cult, ha_arb, ha_past, ha_sd, negl, inten, nat, desc
    ("Catamarca", "201", "6835", "53", "55", "1678", "5049", "", "38", "5", "1", "157"),
    ("Chaco", "516", "54278", "3743", "2410", "10552", "37573", "", "", "", "", "516"),
    ("Chubut", "89", "5460", "3130", "220", "1155", "955", "", "55", "12", "2", "20"),
    ("Córdoba", "582", "103325", "14750", "4481", "23715", "60379", "", "17", "151", "", "414"),
    ("Entre Ríos", "75", "21869", "2520", "295", "550", "18504", "", "", "", "", "75"),
    ("Formosa", "1028", "7415", "2079", "", "1", "5335", "", "111", "860", "21", "36"),
    ("Jujuy", "436", "1327", "261", "23", "162", "881", "", "398", "", "1", "37"),
    ("La Pampa", "103", "48281", "23957", "131", "14521", "9672", "", "10", "23", "20", "50"),
    ("La Rioja", "1", "150", "", "", "", "", "150", "", "", "", "1"),
    ("Mendoza", "82", "11491", "443", "140", "1123", "9785", "", "20", "31", "19", "12"),
    ("Misiones", "26", "291", "", "20", "", "271", "", "", "", "", "26"),
    ("Neuquén", "6", "64", "", "", "30", "30", "4", "", "", "3", "3"),
    ("Río Negro", "571", "5362", "2389", "58", "995", "1867", "54", "152", "14", "10", "395"),
    ("Salta", "527", "21661", "45", "42", "745", "20828", "", "", "", "", "527"),
    ("San Juan", "485", "581", "270", "", "29", "283", "", "9", "420", "56", ""),
    ("San Luis", "60", "59845", "51960", "", "", "7885", "", "", "", "", "60"),
    ("Santa Cruz", "4", "1", "0", "", "1", "0", "", "2", "1", "", "1"),
    ("Tierra del Fuego", "2", "1", "1", "", "", "0", "", "1", "", "", "1"),
    ("Tucumán", "277", "3255", "1", "20", "121", "3114", "", "", "", "", "277"),
    ("Parques Nacionales", "104", "40784", "7250", "", "2275", "27309", "3950", "9", "47", "11", "37"),
    ("Buenos Aires", "", "", "", "", "", "", "", "", "", "", ""),
    ("Ciudad Autónoma de Buenos Aires", "", "", "", "", "", "", "", "", "", "", ""),
    ("Corrientes", "", "", "", "", "", "", "", "", "", "", ""),
    ("Santa Fe", "", "", "", "", "", "", "", "", "", "", ""),
    ("Santiago del Estero", "", "", "", "", "", "", "", "", "", "", ""),
]

# Detalle provincial anuario 2022
DETAIL_2022 = [
    ("Buenos Aires", "2", "142", "", "", "", "", "142", "", "", "", "2"),
    ("Catamarca", "190", "29268.68", "981.81", "1322.61", "12140.65", "14823.61", "", "26", "8", "1", "155"),
    ("Chaco", "471", "6094.49", "", "", "", "6094.49", "", "", "", "", "471"),
    ("Chubut", "70", "92.96", "48.36", "4.44", "22.85", "17.31", "", "53", "13", "", "4"),
    ("Ciudad Autónoma de Buenos Aires", "3", "0.09", "", "", "", "0.09", "", "1", "", "", "2"),
    ("Córdoba", "505", "64231.70", "8710", "3", "12042", "43476.70", "", "1", "448", "", "56"),
    ("Corrientes", "18", "88831", "", "2508", "37559.50", "38409", "10354.50", "", "", "", "18"),
    ("Entre Ríos", "402", "238942", "430", "124", "25", "238363", "", "", "", "", "402"),
    ("Formosa", "1000", "176387.65", "", "", "2.56", "176385.09", "", "8", "136", "", "856"),
    ("Jujuy", "326", "18519.34", "6046.91", "89.71", "3648.21", "4156.63", "4577.88", "", "", "", "326"),
    ("La Pampa", "190", "214248.55", "62716.61", "236.20", "55147.63", "96148.11", "", "11", "50", "25", "104"),
    ("La Rioja", "50", "36953.92", "12214.87", "102.25", "11864.29", "11866.71", "905.80", "", "", "", "50"),
    ("Mendoza", "147", "43826.20", "3890", "0.80", "14171.05", "25764.35", "", "21", "35", "16", "75"),
    ("Misiones", "29", "1958", "200", "35", "400", "1323", "", "", "", "", "29"),
    ("Neuquén", "62", "25.87", "0.06", "0.01", "5.70", "20.10", "", "26", "4", "3", "29"),
    ("Río Negro", "141", "9.38", "0.28", "1.78", "4.71", "2.62", "", "14", "15", "", "112"),
    ("Salta", "613", "199267", "110.75", "12", "43658.40", "155485.85", "", "", "", "", "613"),
    ("San Juan", "1876", "4677.50", "86", "214.50", "56", "4312", "9", "237", "1599", "8", "32"),
    ("San Luis", "52", "68458.88", "39667.14", "", "", "28791.74", "", "", "", "", "52"),
    ("Santa Cruz", "11", "421.50", "", "", "314.80", "106.71", "", "3", "", "", "8"),
    ("Santa Fe", "39", "44515.59", "430.40", "250", "12.01", "827.29", "42995.89", "", "", "", "39"),
    ("Santiago del Estero", "350", "18931.80", "", "", "18931.80", "", "", "", "350", "", ""),
    ("Tierra del Fuego", "3", "8200.38", "7380.36", "", "410.02", "246", "164", "", "", "", "3"),
    ("Tucumán", "522", "27861.96", "1216.47", "753", "4405.24", "21487.25", "", "", "", "", "522"),
    ("Parques Nacionales", "61", "109178.73", "10762.74", "11.21", "9", "47285.69", "51110.09", "11", "28", "1", "21"),
]


def write_csv(path: Path, fieldnames: list[str], rows: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames, lineterminator="\n")
        w.writeheader()
        for row in rows:
            w.writerow({k: row.get(k, "") for k in fieldnames})
    print(f"wrote {path.relative_to(ROOT)} ({len(rows)} rows)")


def build_native_ha_province() -> None:
    src = DATA / "bqd_bninc_ha_año_2023.csv"
    rows: list[dict] = []
    with src.open(newline="", encoding="utf-8") as f:
        for r in csv.DictReader(f, delimiter=";"):
            rows.append(
                {
                    "año": r["año"],
                    "provincia": norm_prov(r["jurisdicción"]),
                    "ha_total": parse_num(r["superficie_total_incendiada"]),
                    "ha_bosque_nativo": parse_num(r["superficie_afectada_por_incendios_bosque_nativo"]),
                    "fuente": "bqd_bninc_ha_año_2023",
                }
            )

    # Append 2024 from anuario (province rows with data)
    for prov, n, ha_t, ha_bn, *_ in DETAIL_2024:
        if not ha_t and not ha_bn:
            rows.append(
                {
                    "año": "2024",
                    "provincia": prov,
                    "ha_total": "",
                    "ha_bosque_nativo": "",
                    "fuente": "anuario_2024_s/i",
                }
            )
            continue
        rows.append(
            {
                "año": "2024",
                "provincia": prov,
                "ha_total": parse_num(ha_t),
                "ha_bosque_nativo": parse_num(ha_bn),
                "fuente": "anuario_2024",
            }
        )

    rows.sort(key=lambda r: (int(r["año"]), r["provincia"]))
    write_csv(
        OUT / "native-forest-ha-by-province.csv",
        ["año", "provincia", "ha_total", "ha_bosque_nativo", "fuente"],
        rows,
    )


def build_counts_province() -> None:
    rows: list[dict] = []
    for prov, by_year in COUNTS_2009_2016.items():
        if prov == "Total":
            continue
        for year, val in by_year.items():
            rows.append(
                {
                    "año": str(year),
                    "provincia": prov,
                    "n_incendios": val,
                    "fuente": "series_estadisticas_2009-2016",
                }
            )

    # RII 2017–2026
    rii = PUBLIC / "fires-by-province.csv"
    with rii.open(newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f, delimiter=";")
        year_cols = []
        for h in reader.fieldnames or []:
            m = re.match(r"año_(\d{4})", h)
            if m:
                year_cols.append((h, m.group(1)))
        for r in reader:
            prov = norm_prov(r["jurisdicción"])
            if prov == "Total":
                continue
            for col, year in year_cols:
                rows.append(
                    {
                        "año": year,
                        "provincia": prov,
                        "n_incendios": parse_num(r[col]),
                        "fuente": "rii",
                    }
                )

    rows.sort(key=lambda r: (int(r["año"]), r["provincia"]))
    write_csv(
        OUT / "fires-count-by-province.csv",
        ["año", "provincia", "n_incendios", "fuente"],
        rows,
    )


def build_andino() -> None:
    rows = [
        {
            "año": str(y),
            "region": "Bosque Andino Patagónico",
            "n_incendios": n,
            "ha_total": parse_num(ha),
            "ha_bosque_nativo": parse_num(bn),
            "fuente": src,
            "nota": ""
            if bn
            else "series 5.9 solo publica cantidad + ha total (sin split BN por región)",
        }
        for y, n, ha, bn, src in ANDINO
    ]
    write_csv(
        OUT / "andino-patagonico-by-year.csv",
        ["año", "region", "n_incendios", "ha_total", "ha_bosque_nativo", "fuente", "nota"],
        rows,
    )


def build_detail_year() -> None:
    rows: list[dict] = []
    for year, data, fuente in [
        (2022, DETAIL_2022, "anuario_2022"),
        (2024, DETAIL_2024, "anuario_2024"),
    ]:
        for (
            prov,
            n,
            ha_t,
            ha_bn,
            ha_c,
            ha_a,
            ha_p,
            ha_sd,
            negl,
            inten,
            nat,
            desc,
        ) in data:
            rows.append(
                {
                    "año": str(year),
                    "provincia": prov,
                    "n_incendios": parse_num(n),
                    "ha_total": parse_num(ha_t),
                    "ha_bosque_nativo": parse_num(ha_bn),
                    "ha_bosque_cultivado": parse_num(ha_c),
                    "ha_arbustal": parse_num(ha_a),
                    "ha_pastizal": parse_num(ha_p),
                    "ha_sin_determinar": parse_num(ha_sd),
                    "causas_negligencia": parse_num(negl),
                    "causas_intencional": parse_num(inten),
                    "causas_natural": parse_num(nat),
                    "causas_desconocida": parse_num(desc),
                    "fuente": fuente,
                }
            )
    write_csv(
        OUT / "fires-detail-by-province-year.csv",
        [
            "año",
            "provincia",
            "n_incendios",
            "ha_total",
            "ha_bosque_nativo",
            "ha_bosque_cultivado",
            "ha_arbustal",
            "ha_pastizal",
            "ha_sin_determinar",
            "causas_negligencia",
            "causas_intencional",
            "causas_natural",
            "causas_desconocida",
            "fuente",
        ],
        rows,
    )


def build_gaps() -> None:
    rows = [
        {
            "tabla": "ha BN por provincia",
            "disponible": "1993–2023 (CSV) + 2024 (anuario, con s/i en varias provincias)",
            "hueco": "2025–2026; varias provincias s/i en 2024 (BA, CABA, Corrientes, Santa Fe, Sgo. del Estero)",
            "archivo": "public/data/native-forest-ha-by-province.csv",
        },
        {
            "tabla": "n° incendios por provincia",
            "disponible": "2009–2016 (series) + 2017–mar 2026 (RII)",
            "hueco": "1993–2008; Parques Nacionales solo en series",
            "archivo": "public/data/fires-count-by-province.csv",
        },
        {
            "tabla": "n° incendios EN bosque nativo",
            "disponible": "No publicado",
            "hueco": "Los anuarios dan ha de BN, no conteo de incendios en BN",
            "archivo": "",
        },
        {
            "tabla": "Bosque Andino Patagónico (región)",
            "disponible": "2010–2016 (n + ha); 2019/21/22/24 (n + ha + ha BN)",
            "hueco": "2009, 2017–2018, 2020, 2023, 2025+; ha BN ausente en series 2010–2016",
            "archivo": "public/data/andino-patagonico-by-year.csv",
        },
        {
            "tabla": "Proxy provincias patagónicas (ha BN)",
            "disponible": "1993–2024 agregado 5 provincias",
            "hueco": "No equivale a región Andino Patagónico",
            "archivo": "public/data/patagonia-provinces-ha-by-year.csv",
        },
        {
            "tabla": "Detalle año × provincia × BN × causas",
            "disponible": "2022 y 2024",
            "hueco": "2019/2021 parseables pero causas a veces en %; faltan 2020/2023",
            "archivo": "public/data/fires-detail-by-province-year.csv",
        },
        {
            "tabla": "Mes × provincia × BN × causas",
            "disponible": "2024 digitalizado",
            "hueco": "2019, 2021, 2022 pendientes; 2017–18/2020/2023 sin anuario en /data",
            "archivo": "public/data/fires-detail-by-month-province-2024.csv",
        },
        {
            "tabla": "Consistencia RII vs Anuario",
            "disponible": "Ambas series coexisten",
            "hueco": "2024 RII ~2750 incendios/~306k ha vs Anuario 5175/392k ha — no mezclar sin documentar",
            "archivo": "",
        },
    ]
    write_csv(
        OUT / "fire-tables-gaps.csv",
        ["tabla", "disponible", "hueco", "archivo"],
        rows,
    )


def build_patagonia_bn_proxy() -> None:
    """Proxy provincia-patagónica (NO es región Andino Patagónico)."""
    pat = {"Chubut", "Neuquén", "Río Negro", "Santa Cruz", "Tierra del Fuego"}
    src = OUT / "native-forest-ha-by-province.csv"
    by_year: dict[str, dict[str, float]] = {}
    with src.open(newline="", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            if r["provincia"] not in pat:
                continue
            y = r["año"]
            by_year.setdefault(y, {"ha_total": 0.0, "ha_bn": 0.0, "miss_bn": 0, "n": 0})
            by_year[y]["n"] += 1
            if r["ha_total"]:
                by_year[y]["ha_total"] += float(r["ha_total"])
            if r["ha_bosque_nativo"]:
                by_year[y]["ha_bn"] += float(r["ha_bosque_nativo"])
            else:
                by_year[y]["miss_bn"] += 1

    rows = [
        {
            "año": y,
            "agregado": "provincias_patagonicas_5",
            "provincias": "Chubut|Neuquén|Río Negro|Santa Cruz|Tierra del Fuego",
            "ha_total": parse_num(str(round(v["ha_total"], 2))),
            "ha_bosque_nativo": parse_num(str(round(v["ha_bn"], 2))),
            "provincias_sin_dato_bn": str(v["miss_bn"]),
            "nota": "PROXY por provincia — no equivale a región fitogeográfica Bosque Andino Patagónico",
        }
        for y, v in sorted(by_year.items(), key=lambda x: int(x[0]))
    ]
    write_csv(
        OUT / "patagonia-provinces-ha-by-year.csv",
        [
            "año",
            "agregado",
            "provincias",
            "ha_total",
            "ha_bosque_nativo",
            "provincias_sin_dato_bn",
            "nota",
        ],
        rows,
    )


def main() -> None:
    build_native_ha_province()
    build_counts_province()
    build_andino()
    build_detail_year()
    build_patagonia_bn_proxy()
    build_gaps()


if __name__ == "__main__":
    main()
