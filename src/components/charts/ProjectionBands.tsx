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
        <h3 className="mb-2 font-sans text-lg font-bold text-foreground md:text-xl">
          {title}
        </h3>
      ) : null}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full font-sans"
        role="img"
        aria-label="Proyección ilustrativa de hectáreas"
      >
        {/* baseline band */}
        <rect
          x={60}
          y={y(baseHi)}
          width={120}
          height={Math.max(4, y(baseLo) - y(baseHi))}
          fill="var(--heat)"
          opacity={0.25}
          rx={4}
        />
        <rect
          x={60}
          y={y(baseline) - 4}
          width={120}
          height={8}
          fill="var(--heat)"
          rx={2}
        />
        <text
          x={120}
          y={height - 14}
          textAnchor="middle"
          fill="currentColor"
          fillOpacity={0.75}
          fontSize={12}
        >
          Sin cambio
        </text>
        <text
          x={120}
          y={y(baseline) - 10}
          textAnchor="middle"
          fill="currentColor"
          fontSize={12}
        >
          {Math.round(baseline).toLocaleString("es-AR")} ha
        </text>

        {/* prevention band */}
        <rect
          x={240}
          y={y(prevHi)}
          width={120}
          height={Math.max(4, y(prevLo) - y(prevHi))}
          fill="var(--sage)"
          opacity={0.25}
          rx={4}
        />
        <rect
          x={240}
          y={y(withPrevention) - 4}
          width={120}
          height={8}
          fill="var(--sage)"
          rx={2}
        />
        <text
          x={300}
          y={height - 14}
          textAnchor="middle"
          fill="currentColor"
          fillOpacity={0.75}
          fontSize={12}
        >
          Con prevención
        </text>
        <text
          x={300}
          y={y(withPrevention) - 10}
          textAnchor="middle"
          fill="currentColor"
          fontSize={12}
        >
          {Math.round(withPrevention).toLocaleString("es-AR")} ha
        </text>
      </svg>
      {note ? (
        <p className="mt-3 text-xs leading-relaxed text-foreground/65 md:text-sm">
          {note}
        </p>
      ) : null}
    </div>
  );
}
