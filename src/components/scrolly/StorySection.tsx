"use client";

import type { ReactNode } from "react";

type Props = {
  id: string;
  eyebrow: string;
  title: string;
  lede?: string;
  children: ReactNode;
  graphic?: ReactNode;
  className?: string;
};

export function StorySection({
  id,
  eyebrow,
  title,
  lede,
  children,
  graphic,
  className = "",
}: Props) {
  return (
    <section
      id={id}
      className={`relative scroll-mt-8 px-4 py-20 md:px-8 md:py-28 lg:px-12 ${className}`}
    >
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
        <div className="space-y-6">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase opacity-70">
            {eyebrow}
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl leading-tight md:text-5xl">
            {title}
          </h2>
          {lede ? (
            <p className="max-w-prose text-base leading-relaxed opacity-85 md:text-lg">
              {lede}
            </p>
          ) : null}
          <div className="space-y-10">{children}</div>
        </div>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="min-h-[280px] rounded-sm border border-current/15 bg-current/5 p-4 backdrop-blur-[2px] md:min-h-[360px] md:p-6">
            {graphic}
          </div>
        </div>
      </div>
    </section>
  );
}
