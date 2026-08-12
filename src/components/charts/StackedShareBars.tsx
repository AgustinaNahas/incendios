"use client";

type Item = { category: string; share: number };

type Props = {
  data: Item[];
  title?: string;
};

const COLORS = ["#ff6b2d", "#ff9f43", "#f0c674", "#7dcea0", "#85929e"];

export function StackedShareBars({ data, title }: Props) {
  const total = data.reduce((a, b) => a + b.share, 0) || 1;

  return (
    <div>
      {title ? (
        <p className="mb-2 text-xs font-semibold tracking-wide uppercase opacity-70">
          {title}
        </p>
      ) : null}
      <div
        className="flex h-8 w-full overflow-hidden rounded-sm"
        role="img"
        aria-label="Composición del presupuesto"
      >
        {data.map((d, i) => (
          <div
            key={d.category}
            style={{
              width: `${(d.share / total) * 100}%`,
              background: COLORS[i % COLORS.length],
            }}
            title={`${d.category}: ${Math.round(d.share * 100)}%`}
          />
        ))}
      </div>
      <ul className="mt-3 space-y-1.5 text-sm">
        {data.map((d, i) => (
          <li key={d.category} className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-sm"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              {d.category}
            </span>
            <span className="tabular-nums opacity-75">
              {Math.round(d.share * 100)}%
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[11px] opacity-60">
        Desglose ilustrativo 2025 · placeholder hasta datos SNMF.
      </p>
    </div>
  );
}
