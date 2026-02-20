"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Calendar } from "lucide-react";

interface MobileCtaBarProps {
  propertyTitle: string;
  phone?: string;
  /** ID of the element to observe — bar shows when this element is not visible */
  observeId: string;
}

export function MobileCtaBar({ propertyTitle, phone = "917719784712", observeId }: MobileCtaBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = document.getElementById(observeId);
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [observeId]);

  const waMessage = encodeURIComponent(`Hi, I'm interested in ${propertyTitle}.`);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-border bg-card px-4 py-3 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex gap-3">
        <a
          href={`https://wa.me/${phone}?text=${waMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
        >
          <MessageCircle className="h-4 w-4" /> Talk to an Expert
        </a>
        <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-medium transition-colors hover:bg-muted">
          <Calendar className="h-4 w-4" /> Schedule a visit
        </button>
      </div>
    </div>
  );
}
