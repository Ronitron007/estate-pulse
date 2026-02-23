"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { SlidersHorizontal, ArrowUpDown, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const SORT_OPTIONS = [
  { value: "", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "possession", label: "Possession Date" },
] as const;

interface MobileFilterBarProps {
  onFiltersOpen: () => void;
  onSortOpen?: never;
  activeFilterCount?: number;
  currentSort: string;
  onSortChange: (value: string) => void;
}

export function MobileFilterBar({
  onFiltersOpen,
  activeFilterCount = 0,
  currentSort,
  onSortChange,
}: MobileFilterBarProps) {
  const [sortOpen, setSortOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSortSelect = useCallback(
    (value: string) => {
      onSortChange(value);
      setSortOpen(false);
    },
    [onSortChange]
  );

  const sortSheet = (
    <AnimatePresence>
      {sortOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSortOpen(false)}
          />
          {/* Sheet */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-2xl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>
            <div className="px-4 pb-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Sort By
              </h3>
            </div>
            <div className="pb-6">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSortSelect(opt.value)}
                  className="flex items-center justify-between w-full px-4 py-3 text-sm text-foreground hover:bg-muted/50 transition-colors"
                >
                  <span
                    className={
                      currentSort === opt.value ? "font-semibold" : ""
                    }
                  >
                    {opt.label}
                  </span>
                  {currentSort === opt.value && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border md:hidden">
        <div className="flex">
          <button
            onClick={onFiltersOpen}
            className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-foreground border-r border-border active:bg-muted/50 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-foreground text-background text-xs font-semibold">
                {activeFilterCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setSortOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-foreground active:bg-muted/50 transition-colors"
          >
            <ArrowUpDown className="w-4 h-4" />
            Sort By
          </button>
        </div>
      </div>

      {/* Sort bottom sheet portal */}
      {mounted && createPortal(sortSheet, document.body)}
    </>
  );
}
