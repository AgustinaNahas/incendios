type QuoteProps = {
  quote: string;
  name: string;
  role: string;
  className?: string;
};

export function Quote({ quote, name, role, className = "" }: QuoteProps) {
  return (
    <blockquote
      className={`border border-[#f1621a] bg-[#383838] p-8 text-left text-xl font-bold leading-tight md:p-12 md:text-2xl ${className}`}
    >
      <span>{quote}</span>
      <footer className="mt-6 md:mt-8">
        <p className="text-[17px] font-normal">{name}</p>
        <p className="mt-[6px] text-[14px] font-normal">{role}</p>
      </footer>
    </blockquote>
  );
}
