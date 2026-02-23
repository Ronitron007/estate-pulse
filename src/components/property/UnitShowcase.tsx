"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BedDouble, Bath, Building2, Layers, Maximize } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FloorPlanLightbox } from "./FloorPlanLightbox";
import { formatArea, formatPriceRange } from "@/lib/format";
import { getImageUrl } from "@/lib/image-urls";
import type { Configuration, Tower } from "@/types/database";

interface UnitShowcaseProps {
  configurations: Configuration[];
  towers?: Tower[];
}

interface ConfigGroup {
  key: string;
  label: string;
  configs: Configuration[];
}

function getGroupKey(config: Configuration): string {
  return config.config_name || (config.bedrooms ? `${config.bedrooms} BHK` : "Unit");
}

function resolveTower(config: Configuration, towers?: Tower[]): Tower | undefined {
  return config.tower || (config.tower_id ? towers?.find((t) => t.id === config.tower_id) : undefined);
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -200 : 200,
    opacity: 0,
  }),
};

export function UnitShowcase({ configurations, towers }: UnitShowcaseProps) {
  // Group configs by type (bedrooms + config_name)
  const groups = useMemo(() => {
    const map = new Map<string, Configuration[]>();
    for (const c of configurations) {
      const key = getGroupKey(c);
      const existing = map.get(key);
      if (existing) existing.push(c);
      else map.set(key, [c]);
    }
    return Array.from(map.entries()).map(([key, configs]): ConfigGroup => ({
      key,
      label: key,
      configs,
    }));
  }, [configurations]);

  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [activeTowerIndex, setActiveTowerIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const pillsRef = useRef<HTMLDivElement>(null);

  const group = groups[activeGroupIndex];
  const config = group?.configs[activeTowerIndex];
  const tower = config ? resolveTower(config, towers) : undefined;
  const showGroupNav = groups.length > 1;
  const showTowerNav = group?.configs.length > 1;

  // Reset tower index when switching config groups
  useEffect(() => {
    setActiveTowerIndex(0);
  }, [activeGroupIndex]);

  const goToGroup = useCallback(
    (index: number) => {
      setDirection(index > activeGroupIndex ? 1 : -1);
      setActiveGroupIndex(index);
    },
    [activeGroupIndex]
  );

  const goNextGroup = useCallback(() => {
    if (activeGroupIndex < groups.length - 1) goToGroup(activeGroupIndex + 1);
  }, [activeGroupIndex, groups.length, goToGroup]);

  const goPrevGroup = useCallback(() => {
    if (activeGroupIndex > 0) goToGroup(activeGroupIndex - 1);
  }, [activeGroupIndex, goToGroup]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight") goNextGroup();
      if (e.key === "ArrowLeft") goPrevGroup();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [goNextGroup, goPrevGroup]);

  // Auto-scroll active pill into view
  useEffect(() => {
    if (!pillsRef.current) return;
    const activePill = pillsRef.current.children[activeGroupIndex] as HTMLElement;
    if (activePill) {
      activePill.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeGroupIndex]);

  if (!configurations.length || !config) return null;

  const floorPlanSrc = config.floor_plan_cloudinary_id
    ? getImageUrl(config.floor_plan_cloudinary_id, "card")
    : null;
  const floorPlanHero = config.floor_plan_cloudinary_id
    ? getImageUrl(config.floor_plan_cloudinary_id, "hero")
    : null;

  // Collect specs
  const specs: { label: string; value: string }[] = [];
  if (config.carpet_area_sqft) specs.push({ label: "Carpet", value: formatArea(config.carpet_area_sqft) });
  if (config.super_area_sqft) specs.push({ label: "Super Area", value: formatArea(config.super_area_sqft) });
  if (config.built_up_area_sqft) specs.push({ label: "Built-up", value: formatArea(config.built_up_area_sqft) });
  if (config.balcony_area_sqft) specs.push({ label: "Balcony", value: formatArea(config.balcony_area_sqft) });
  if (config.price) specs.push({ label: "Price", value: `₹${formatPriceRange(config.price, null, false)}` });

  const configLabel = group.label;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display">
          <Layers className="w-5 h-5 text-primary" />
          Unit Plans & Configurations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Config Type Pills */}
        {showGroupNav && (
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-2 w-4 bg-gradient-to-r from-card to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-2 w-4 bg-gradient-to-l from-card to-transparent z-10 pointer-events-none" />
            <div ref={pillsRef} className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-1" role="tablist" aria-label="Unit configurations">
              {groups.map((g, i) => (
                <button
                  key={g.key}
                  role="tab"
                  aria-selected={i === activeGroupIndex}
                  onClick={() => goToGroup(i)}
                  className={`shrink-0 rounded-sm px-4 py-1.5 text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    i === activeGroupIndex
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Carousel content */}
        <div className="relative overflow-hidden rounded-sm">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`${group.key}-${activeTowerIndex}`}
              role="tabpanel"
              aria-label={configLabel}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* Header bar */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
                <h4 className="text-base font-semibold">{configLabel}</h4>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  {config.bedrooms != null && (
                    <span className="flex items-center gap-1">
                      <BedDouble className="w-4 h-4" /> {config.bedrooms}
                    </span>
                  )}
                  {config.bathrooms != null && (
                    <span className="flex items-center gap-1">
                      <Bath className="w-4 h-4" /> {config.bathrooms}
                    </span>
                  )}
                  {config.floor_from != null && config.floor_to != null && (
                    <span>Floors {config.floor_from}–{config.floor_to}</span>
                  )}
                </div>
              </div>

              {/* Tower Sub-Tabs */}
              {showTowerNav && (
                <div className="flex flex-wrap gap-2 mb-4" role="tablist" aria-label="Available towers">
                  {group.configs.map((c, i) => {
                    const t = resolveTower(c, towers);
                    const label = t?.name || `Tower ${i + 1}`;
                    return (
                      <button
                        key={c.id}
                        role="tab"
                        aria-selected={i === activeTowerIndex}
                        onClick={() => setActiveTowerIndex(i)}
                        className={`inline-flex items-center gap-1.5 rounded-sm px-3 py-1 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-ring ${
                          i === activeTowerIndex
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "bg-muted text-muted-foreground hover:bg-muted/80 border border-transparent"
                        }`}
                      >
                        <Building2 className="w-3 h-3" />
                        {label}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Single tower badge (when only one tower) */}
              {!showTowerNav && tower && (
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1 rounded-sm bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    <Building2 className="w-3.5 h-3.5" />
                    {tower.name}
                    {tower.floor_from != null && tower.floor_to != null && (
                      <span className="text-primary/70 ml-1">· {tower.floor_to - tower.floor_from + 1} floors</span>
                    )}
                  </span>
                </div>
              )}

              {/* Floor Plan Image */}
              {floorPlanSrc ? (
                <button
                  onClick={() => setLightboxOpen(true)}
                  className="relative w-full group cursor-zoom-in"
                  aria-label={`View full-size floor plan for ${configLabel}`}
                >
                  <img
                    src={floorPlanSrc}
                    alt={`Floor plan — ${configLabel}${tower ? ` (${tower.name})` : ""}`}
                    className="w-full rounded-sm object-contain bg-muted border border-border"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-sm">
                    <span className="flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-full text-sm font-medium shadow">
                      <Maximize className="w-4 h-4" /> View Full Size
                    </span>
                  </div>
                </button>
              ) : (
                <div className="w-full aspect-[4/3] rounded-sm bg-muted border border-dashed border-border flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Floor plan coming soon</p>
                </div>
              )}

              {/* Specs bar */}
              {specs.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                  {specs.map((s) => (
                    <div key={s.label}>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                      <p className="text-sm font-semibold">{s.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Tower details (secondary info) */}
              {tower && (tower.lifts_count || tower.staircase_info || tower.units_per_floor) && (
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                  {tower.units_per_floor && <span>{tower.units_per_floor} units/floor</span>}
                  {tower.lifts_count && (
                    <span>
                      {tower.lifts_count} {tower.lift_type || ""} lift{tower.lifts_count > 1 ? "s" : ""}
                    </span>
                  )}
                  {tower.staircase_info && <span>{tower.staircase_info}</span>}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Group counter */}
        {showGroupNav && (
          <p className="text-center text-xs text-muted-foreground">
            {activeGroupIndex + 1} / {groups.length}
          </p>
        )}
      </CardContent>

      {/* Lightbox */}
      {floorPlanHero && (
        <FloorPlanLightbox
          src={floorPlanHero}
          alt={`Floor plan — ${configLabel}${tower ? ` (${tower.name})` : ""}`}
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </Card>
  );
}
