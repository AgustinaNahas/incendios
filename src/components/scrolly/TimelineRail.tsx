"use client";

import { CHAPTERS, type ChapterId } from "@/lib/patagonia";

type Props = {
  active: ChapterId;
  progress: number;
};

function TreeIcon({
  kind,
  active,
}: {
  kind: "burned" | "fire" | "healthy" | "otbn" | "gap" | "species" | "sources";
  active: boolean;
}) {
  const opacity = active ? 1 : 0.45;
  if (kind === "sources") {
    return (
      <svg width="28" height="36" viewBox="0 0 28 36" aria-hidden style={{ opacity }}>
        <rect x="6" y="6" width="16" height="22" rx="1.5" fill="#f3efe8" opacity="0.9" />
        <path d="M9 12 H19 M9 16 H17 M9 20 H18" stroke="#1A1A1A" strokeWidth="1.4" />
        <rect x="8" y="24" width="5" height="2" fill="#E0B25A" />
      </svg>
    );
  }
  if (kind === "species") {
    return (
      <svg width="28" height="36" viewBox="0 0 28 36" aria-hidden style={{ opacity }}>
        <ellipse cx="14" cy="13" rx="9" ry="11" fill="#2f6b4f" />
        <rect x="12.5" y="22" width="3" height="11" fill="#5a4030" />
        <path
          d="M8 8 C12 4 18 6 20 11"
          fill="none"
          stroke="#F46B15"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (kind === "burned") {
    return (
      <svg width="28" height="36" viewBox="0 0 28 36" aria-hidden style={{ opacity }}>
        <path d="M14 2 L18 14 L22 12 L16 22 L20 34 L8 34 L12 22 L6 14 L10 14 Z" fill="#6b6560" />
        <path d="M13 18 L15 34" stroke="#3a3530" strokeWidth="1.5" />
      </svg>
    );
  }
  if (kind === "fire") {
    return (
      <svg width="28" height="36" viewBox="0 0 28 36" aria-hidden style={{ opacity }}>
        <path d="M14 4 C18 10 22 12 20 18 C24 16 24 22 18 28 C16 32 12 34 10 28 C6 30 4 22 8 18 C6 12 10 8 14 4 Z" fill="#ff6b2d" />
        <path d="M14 14 C16 16 17 18 15 22 C17 21 17 24 14 27 C12 24 11 21 14 14 Z" fill="#ffd166" />
      </svg>
    );
  }
  if (kind === "healthy") {
    return (
      <svg width="28" height="36" viewBox="0 0 28 36" aria-hidden style={{ opacity }}>
        <ellipse cx="14" cy="14" rx="10" ry="12" fill="#2f6b4f" />
        <ellipse cx="10" cy="12" rx="5" ry="6" fill="#4f9d6e" opacity="0.85" />
        <ellipse cx="18" cy="13" rx="4" ry="5" fill="#c47b3a" opacity="0.75" />
        <rect x="12.5" y="22" width="3" height="12" fill="#5a4030" />
      </svg>
    );
  }
  if (kind === "otbn") {
    return (
      <svg width="28" height="36" viewBox="0 0 28 36" aria-hidden style={{ opacity }}>
        <rect x="4" y="6" width="20" height="24" rx="2" fill="#1a2e24" opacity="0.9" />
        <path d="M6 18 L12 10 L16 16 L22 12 L22 28 L6 28 Z" fill="#C45C4A" />
        <path d="M6 22 L14 16 L22 20 L22 28 L6 28 Z" fill="#E0B25A" opacity="0.95" />
        <path d="M14 24 L22 20 L22 28 L14 28 Z" fill="#5F8A6A" />
      </svg>
    );
  }
  return (
    <svg width="28" height="36" viewBox="0 0 28 36" aria-hidden style={{ opacity }}>
      <rect x="6" y="8" width="16" height="20" rx="2" fill="none" stroke="currentColor" strokeDasharray="3 2" />
      <text x="14" y="22" textAnchor="middle" fontSize="12" fill="currentColor">
        ?
      </text>
    </svg>
  );
}

export function TimelineRail({ active, progress }: Props) {
  return (
    <nav
      aria-label="Línea de tiempo narrativa"
      className="fixed right-2 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 md:flex lg:right-5"
    >
      <div className="relative flex flex-col items-center gap-2 rounded-md bg-black/55 px-1.5 py-2 text-[#f3efe8] shadow-lg backdrop-blur-sm">
        <div
          className="absolute top-3 bottom-3 left-1/2 w-px -translate-x-1/2 bg-current/30"
          aria-hidden
        />
        {CHAPTERS.map((chapter) => {
          const isActive = chapter.id === active;
          return (
            <a
              key={chapter.id}
              href={`#${chapter.id}`}
              aria-current={isActive ? "true" : undefined}
              className={`relative z-10 flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 rounded-md px-1 py-1 transition-opacity ${
                isActive ? "opacity-100" : "opacity-80 hover:opacity-100"
              }`}
            >
              <TreeIcon kind={chapter.tree} active={isActive} />
              <span
                className={`text-[10px] font-medium tracking-wide uppercase ${
                  isActive ? "text-[#f3efe8]" : "text-[#f3efe8]/90"
                }`}
              >
                {chapter.short}
              </span>
            </a>
          );
        })}
      </div>
      <div
        className="mt-1 h-16 w-1.5 self-center overflow-hidden rounded-full bg-black/40"
        title="Progreso de lectura"
        aria-hidden
      >
        <div
          className="w-full rounded-full bg-[#f3efe8] transition-[height] duration-150"
          style={{ height: `${Math.round(progress * 100)}%` }}
        />
      </div>
    </nav>
  );
}

export function MobileChapterChips({
  active,
}: {
  active: ChapterId;
}) {
  return (
    <nav
      aria-label="Capítulos"
      className="fixed bottom-3 left-1/2 z-40 w-[min(100vw-1rem,28rem)] -translate-x-1/2 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex gap-0.5 overflow-x-auto overscroll-x-contain rounded-full bg-black/85 px-1.5 py-1 text-[#f3efe8] shadow-lg backdrop-blur-md [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CHAPTERS.map((c) => (
          <a
            key={c.id}
            href={`#${c.id}`}
            aria-current={c.id === active ? "true" : undefined}
            className={`flex min-h-10 shrink-0 items-center rounded-full px-3 py-2 text-[11px] leading-none whitespace-nowrap ${
              c.id === active
                ? "bg-[#f3efe8]/20 font-semibold text-[#f3efe8]"
                : "text-[#f3efe8]/90"
            }`}
          >
            {c.short}
          </a>
        ))}
      </div>
    </nav>
  );
}
