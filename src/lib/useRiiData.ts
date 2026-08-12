"use client";

import { useEffect, useState } from "react";
import {
  filterPatagonia,
  parseMonthYearCsv,
  parseProvinceYearCsv,
  type ProvinceYearValue,
} from "./parseRii";

export type RiiData = {
  hectares: ProvinceYearValue[];
  hectaresPatagonia: ProvinceYearValue[];
  firesProvince: ProvinceYearValue[];
  firesProvincePatagonia: ProvinceYearValue[];
  firesMonth: ProvinceYearValue[];
  loading: boolean;
  error: string | null;
};

export function useRiiData(): RiiData {
  const [state, setState] = useState<RiiData>({
    hectares: [],
    hectaresPatagonia: [],
    firesProvince: [],
    firesProvincePatagonia: [],
    firesMonth: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [haRes, fireProvRes, fireMonthRes] = await Promise.all([
          fetch("/data/hectares-by-province.csv"),
          fetch("/data/fires-by-province.csv"),
          fetch("/data/fires-by-month.csv"),
        ]);

        if (!haRes.ok || !fireProvRes.ok || !fireMonthRes.ok) {
          throw new Error("No se pudieron cargar los CSV del RII");
        }

        const [haText, fireProvText, fireMonthText] = await Promise.all([
          haRes.text(),
          fireProvRes.text(),
          fireMonthRes.text(),
        ]);

        const hectares = parseProvinceYearCsv(haText);
        const firesProvince = parseProvinceYearCsv(fireProvText);
        const firesMonth = parseMonthYearCsv(fireMonthText);

        if (cancelled) return;

        setState({
          hectares,
          hectaresPatagonia: filterPatagonia(hectares),
          firesProvince,
          firesProvincePatagonia: filterPatagonia(firesProvince),
          firesMonth,
          loading: false,
          error: null,
        });
      } catch (err) {
        if (cancelled) return;
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : "Error de datos",
        }));
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
