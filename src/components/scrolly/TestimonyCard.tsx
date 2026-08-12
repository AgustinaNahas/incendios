"use client";

import { motion, AnimatePresence } from "framer-motion";

export type Testimony = {
  id: string;
  quote: string;
  name: string;
  role: string;
  province: string;
  year: number;
};

type Props = {
  testimony: Testimony;
};

export function TestimonyCard({ testimony }: Props) {
  return (
    <AnimatePresence mode="wait">
      <motion.blockquote
        key={testimony.id}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.45 }}
        className="border-l-2 border-current/40 pl-4"
      >
        <p className="font-[family-name:var(--font-display)] text-xl leading-snug md:text-2xl">
          “{testimony.quote}”
        </p>
        <footer className="mt-4 text-sm opacity-75">
          <cite className="not-italic font-medium">{testimony.name}</cite>
          {" · "}
          {testimony.role}, {testimony.province} ({testimony.year})
        </footer>
      </motion.blockquote>
    </AnimatePresence>
  );
}
