"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Section {
  id: string;
  label: string;
}

interface SectionNavProps {
  sections: Section[];
  /** ID of the hero element — nav appears once hero scrolls out of view */
  heroId?: string;
}

export function SectionNav({ sections, heroId = "hero" }: SectionNavProps) {
  const [visible, setVisible] = useState(false);
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const tabsRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  // Show/hide based on hero visibility
  useEffect(() => {
    const hero = document.getElementById(heroId);
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [heroId]);

  // Track which section is in view
  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible section
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length) {
          // Pick the one closest to top
          const top = visibleEntries.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          setActiveId(top.target.id);
        }
      },
      { rootMargin: "-128px 0px -60% 0px", threshold: 0 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  // Scroll active tab into view horizontally
  useEffect(() => {
    if (activeTabRef.current && tabsRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeId]);

  const handleClick = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div
      className={`sticky top-16 md:top-20 z-40 transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div
            ref={tabsRef}
            className="flex gap-1 overflow-x-auto scrollbar-hide py-2 md:justify-center"
          >
            {sections.map((s) => {
              const isActive = activeId === s.id;
              return (
                <button
                  key={s.id}
                  ref={isActive ? activeTabRef : undefined}
                  onClick={() => handleClick(s.id)}
                  className={`relative whitespace-nowrap px-4 py-2 text-sm font-medium rounded-full transition-colors shrink-0 ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {s.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
