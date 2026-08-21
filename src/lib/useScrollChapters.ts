"use client";

import { useEffect, useMemo, useState } from "react";
import { CHAPTERS, type ChapterId } from "./patagonia";

export function useScrollChapters() {
  const [activeChapter, setActiveChapter] = useState<ChapterId>("otbn");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const sectionIds = CHAPTERS.map((c) => c.id);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveChapter(visible[0].target.id as ChapterId);
        }
      },
      {
        root: null,
        rootMargin: "-20% 0px -35% 0px",
        threshold: [0.15, 0.35, 0.55],
      },
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? window.scrollY / max : 0);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const chapterIndex = useMemo(
    () => CHAPTERS.findIndex((c) => c.id === activeChapter),
    [activeChapter],
  );

  return { activeChapter, scrollProgress, chapterIndex };
}
