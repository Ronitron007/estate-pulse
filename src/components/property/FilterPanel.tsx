"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, MapPin, BedDouble, IndianRupee } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import type { Project } from "@/types/database";

export interface FilterValues {
  localities: string[];
  bedrooms: number[];
  priceMin: number;
  priceMax: number;
}

interface FilterPanelProps {
  projects: Project[];
  open: boolean;
  onClose: () => void;
  onApply: (filters: FilterValues) => void;
  initialFilters?: FilterValues;
}

function formatPrice(lakhs: number): string {
  if (lakhs >= 100) return `${(lakhs / 100).toFixed(lakhs % 100 === 0 ? 0 : 1)} Cr`;
  return `${lakhs} L`;
}

export function FilterPanel({
  projects,
  open,
  onClose,
  onApply,
  initialFilters,
}: FilterPanelProps) {
  const [mounted, setMounted] = useState(false);

  // Derive filter options from project data
  const { localityOptions, bedroomOptions, priceExtent } = useMemo(() => {
    const localityMap = new Map<string, number>();
    const bedroomSet = new Set<number>();
    let pMin = Infinity;
    let pMax = -Infinity;

    for (const p of projects) {
      if (p.locality) {
        localityMap.set(p.locality, (localityMap.get(p.locality) || 0) + 1);
      }
      if (p.configurations) {
        for (const c of p.configurations) {
          if (c.bedrooms != null) bedroomSet.add(c.bedrooms);
        }
      }
      // Price in lakhs
      if (p.price_min != null && p.price_min < pMin) pMin = p.price_min;
      if (p.price_max != null && p.price_max > pMax) pMax = p.price_max;
    }

    const localityOptions = Array.from(localityMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const bedroomOptions = Array.from(bedroomSet).sort((a, b) => a - b);

    // Round down/up to nearest 50L for nice slider bounds
    const floorMin = pMin === Infinity ? 0 : Math.floor(pMin / 50) * 50;
    const ceilMax = pMax === -Infinity ? 1000 : Math.ceil(pMax / 50) * 50;

    return {
      localityOptions,
      bedroomOptions,
      priceExtent: [floorMin, ceilMax] as [number, number],
    };
  }, [projects]);

  // Internal filter state
  const [selectedLocalities, setSelectedLocalities] = useState<string[]>(
    initialFilters?.localities ?? []
  );
  const [selectedBedrooms, setSelectedBedrooms] = useState<number[]>(
    initialFilters?.bedrooms ?? []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>(
    initialFilters
      ? [initialFilters.priceMin, initialFilters.priceMax]
      : priceExtent
  );

  // Sync when initialFilters or priceExtent changes
  useEffect(() => {
    if (initialFilters) {
      setSelectedLocalities(initialFilters.localities);
      setSelectedBedrooms(initialFilters.bedrooms);
      setPriceRange([initialFilters.priceMin, initialFilters.priceMax]);
    }
  }, [initialFilters]);

  // Reset price range when extent changes (projects change)
  useEffect(() => {
    if (!initialFilters) {
      setPriceRange(priceExtent);
    }
  }, [priceExtent, initialFilters]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Body scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const toggleLocality = useCallback((name: string) => {
    setSelectedLocalities((prev) =>
      prev.includes(name) ? prev.filter((l) => l !== name) : [...prev, name]
    );
  }, []);

  const toggleBedroom = useCallback((n: number) => {
    setSelectedBedrooms((prev) =>
      prev.includes(n) ? prev.filter((b) => b !== n) : [...prev, n]
    );
  }, []);

  const clearAll = () => {
    setSelectedLocalities([]);
    setSelectedBedrooms([]);
    setPriceRange(priceExtent);
  };

  // Count matching projects
  const matchCount = useMemo(() => {
    return projects.filter((p) => {
      if (
        selectedLocalities.length > 0 &&
        (!p.locality || !selectedLocalities.includes(p.locality))
      )
        return false;
      if (
        selectedBedrooms.length > 0 &&
        !p.configurations?.some(
          (c) => c.bedrooms != null && selectedBedrooms.includes(c.bedrooms)
        )
      )
        return false;
      if (p.price_min != null && p.price_min > priceRange[1]) return false;
      if (p.price_max != null && p.price_max < priceRange[0]) return false;
      return true;
    }).length;
  }, [projects, selectedLocalities, selectedBedrooms, priceRange]);

  const handleApply = () => {
    onApply({
      localities: selectedLocalities,
      bedrooms: selectedBedrooms,
      priceMin: priceRange[0],
      priceMax: priceRange[1],
    });
  };

  const hasActiveFilters =
    selectedLocalities.length > 0 ||
    selectedBedrooms.length > 0 ||
    priceRange[0] !== priceExtent[0] ||
    priceRange[1] !== priceExtent[1];

  const overlay = (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-background flex flex-col"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <button
              onClick={onClose}
              className="p-1 -ml-1 text-foreground"
              aria-label="Close filters"
            >
              <X className="w-5 h-5" />
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="text-sm font-medium text-primary"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
            {/* Locality */}
            {localityOptions.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Locality
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {localityOptions.map(({ name, count }) => {
                    const active = selectedLocalities.includes(name);
                    return (
                      <button
                        key={name}
                        onClick={() => toggleLocality(name)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                          active
                            ? "bg-foreground text-background border-foreground"
                            : "bg-background text-foreground border-border hover:border-foreground/40"
                        }`}
                      >
                        {name}{" "}
                        <span
                          className={
                            active
                              ? "text-background/70"
                              : "text-muted-foreground"
                          }
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            <hr className="border-border" />

            {/* Bedrooms */}
            {bedroomOptions.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <BedDouble className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Bedrooms
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {bedroomOptions.map((n) => {
                    const active = selectedBedrooms.includes(n);
                    return (
                      <button
                        key={n}
                        onClick={() => toggleBedroom(n)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                          active
                            ? "bg-foreground text-background border-foreground"
                            : "bg-background text-foreground border-border hover:border-foreground/40"
                        }`}
                      >
                        {n} BHK
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            <hr className="border-border" />

            {/* Price Range */}
            {priceExtent[0] < priceExtent[1] && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Price
                    </span>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {formatPrice(priceRange[0])} &ndash;{" "}
                    {formatPrice(priceRange[1])}
                  </span>
                </div>
                <div className="px-1">
                  <Slider
                    min={priceExtent[0]}
                    max={priceExtent[1]}
                    step={50}
                    value={priceRange}
                    onValueChange={(val) =>
                      setPriceRange(val as [number, number])
                    }
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>{formatPrice(priceExtent[0])}</span>
                  <span>{formatPrice(priceExtent[1])}</span>
                </div>
              </section>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-border">
            <Button onClick={handleApply} className="w-full h-11 text-sm font-semibold">
              Show {matchCount} Properties
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(overlay, document.body);
}
