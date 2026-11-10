import type { ReactNode } from "react";

type QuoteProps = {
  quote: ReactNode;
  name: string;
  role: string;
  className?: string;
};

export function Quote({ quote, name, role, className = "" }: QuoteProps) {
  return (
    <blockquote className={`type-quote ${className}`}>
      <span>{quote}</span>
      <footer className="mt-6 md:mt-8">
        <p className="text-[17px] font-normal">{name}</p>
        <p className="mt-[6px] text-[14px] font-normal">{role}</p>
      </footer>
    </blockquote>
  );
}
