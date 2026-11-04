"use client";

type Props = {
  prevent: number;
  suppress: number;
  title?: string;
  note?: string;
};

export function PreventVsSuppressBars({
  prevent,
  suppress,
  title,
  note,
}: Props) {
  const max = Math.max(prevent, suppress) || 1;

  return (
    <div>
      {title ? (
        <h3 className="mb-2 font-sans text-lg font-bold text-foreground md:text-xl">
          {title}
        </h3>
      ) : null}
      <div className="space-y-4">
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span>Prevenir (por ha)</span>
            <span className="tabular-nums opacity-75">
              ${prevent.toLocaleString("es-AR")}
            </span>
          </div>
          <div className="h-3 rounded-sm bg-current/10">
            <div
              className="h-3 rounded-sm bg-sage"
              style={{ width: `${(prevent / max) * 100}%` }}
            />
          </div>
        </div>
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span>Apagar / combatir (por ha)</span>
            <span className="tabular-nums opacity-75">
              ${suppress.toLocaleString("es-AR")}
            </span>
          </div>
          <div className="h-3 rounded-sm bg-current/10">
            <div
              className="h-3 rounded-sm bg-heat"
              style={{ width: `${(suppress / max) * 100}%` }}
            />
          </div>
        </div>
      </div>
      {note ? (
        <p className="mt-3 text-xs leading-relaxed text-foreground/65 md:text-sm">
          {note}
        </p>
      ) : null}
    </div>
  );
}
