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
        <p className="mb-2 text-xs font-semibold tracking-wide uppercase opacity-70">
          {title}
        </p>
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
              className="h-3 rounded-sm bg-[#3d6b55]"
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
              className="h-3 rounded-sm bg-[#ff6b2d]"
              style={{ width: `${(suppress / max) * 100}%` }}
            />
          </div>
        </div>
      </div>
      {note ? (
        <p className="mt-3 text-[11px] opacity-60">{note}</p>
      ) : null}
    </div>
  );
}
