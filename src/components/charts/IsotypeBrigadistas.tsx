"use client";

type Props = {
  current: number;
  needed: number;
  iconRepresents: number;
  title?: string;
};

function PersonIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="22" viewBox="0 0 18 22" aria-hidden>
      <circle cx="9" cy="5" r="3.5" fill={filled ? "var(--heat-soft)" : "currentColor"} opacity={filled ? 1 : 0.25} />
      <path
        d="M3 20 C3 14 6 12 9 12 C12 12 15 14 15 20 Z"
        fill={filled ? "var(--heat-soft)" : "currentColor"}
        opacity={filled ? 1 : 0.25}
      />
    </svg>
  );
}

export function IsotypeBrigadistas({
  current,
  needed,
  iconRepresents,
  title,
}: Props) {
  const currentIcons = Math.round(current / iconRepresents);
  const neededIcons = Math.round(needed / iconRepresents);

  return (
    <div>
      {title ? (
        <h3 className="mb-2 font-sans text-lg font-bold text-foreground md:text-xl">
          {title}
        </h3>
      ) : null}
      <p className="mb-3 text-sm text-foreground/85">
        1 ícono ≈ {iconRepresents} brigadistas
      </p>
      <div className="space-y-3">
        <div>
          <p className="mb-1 text-sm text-foreground/85">
            Dotación actual (est.)
          </p>
          <div className="flex flex-wrap gap-1">
            {Array.from({ length: currentIcons }).map((_, i) => (
              <PersonIcon key={`c-${i}`} filled />
            ))}
          </div>
          <p className="mt-1 text-sm font-medium">{current}</p>
        </div>
        <div>
          <p className="mb-1 text-sm text-foreground/85">
            Necesidad estimada
          </p>
          <div className="flex flex-wrap gap-1">
            {Array.from({ length: neededIcons }).map((_, i) => (
              <PersonIcon key={`n-${i}`} filled={i < currentIcons} />
            ))}
          </div>
          <p className="mt-1 text-sm font-medium">{needed}</p>
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-foreground/65 md:text-sm">
        Placeholder hasta validar cifras oficiales de personal.
      </p>
    </div>
  );
}
