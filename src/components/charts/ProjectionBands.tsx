"use client";

type Props = {
  baseline: number;
  withPrevention: number;
  uncertainty: number;
  title?: string;
  note?: string;
};

export function ProjectionBands({
  baseline,
  withPrevention,
  uncertainty,
  title,
  note,
}: Props) {
  const width = 420;
  const height = 160;
  const max = Math.max(baseline, withPrevention) * (1 + uncertainty) * 1.1;

  const y = (v: number) => height - 40 - (v / max) * (height - 60);

  const baseLo = baseline * (1 - uncertainty);
  const baseHi = baseline * (1 + uncertainty);
  const prevLo = withPrevention * (1 - uncertainty);
  const prevHi = withPrevention * (1 + uncertainty);

  return (
    <div>
      {title ? (
        <p className="mb-2 text-xs font-semibold tracking-wide uppercase opacity-70">
          {title}
        </p>
      ) : null}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label="Proyección ilustrativa de hectáreas"
      >
        {/* baseline band */}
        <rect
          x={60}
          y={y(baseHi)}
          width={120}
          height={Math.max(4, y(baseLo) - y(baseHi))}
          fill="#ff6b2d"
          opacity={0.25}
          rx={4}
        />
        <rect
          x={60}
          y={y(baseline) - 4}
          width={120}
          height={8}
          fill="#ff6b2d"
          rx={2}
        />
        <text x={120} y={height - 14} textAnchor="middle" className="fill-current text-[10px]" opacity={0.75}>
          Sin cambio
        </text>
        <text x={120} y={y(baseline) - 10} textAnchor="middle" className="fill-current text-[11px]">
          {Math.round(baseline).toLocaleString("es-AR")} ha
        </text>

        {/* prevention band */}
        <rect
          x={240}
          y={y(prevHi)}
          width={120}
          height={Math.max(4, y(prevLo) - y(prevHi))}
          fill="#3d6b55"
          opacity={0.25}
          rx={4}
        />
        <rect
          x={240}
          y={y(withPrevention) - 4}
          width={120}
          height={8}
          fill="#3d6b55"
          rx={2}
        />
        <text x={300} y={height - 14} textAnchor="middle" className="fill-current text-[10px]" opacity={0.75}>
          Con prevención
        </text>
        <text x={300} y={y(withPrevention) - 10} textAnchor="middle" className="fill-current text-[11px]">
          {Math.round(withPrevention).toLocaleString("es-AR")} ha
        </text>
      </svg>
      {note ? <p className="mt-1 text-[11px] opacity-60">{note}</p> : null}
    </div>
  );
}
