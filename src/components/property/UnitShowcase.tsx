"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, BedDouble, Bath, Building2, Layers, Maximize } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FloorPlanLightbox } from "./FloorPlanLightbox";
import { formatArea, formatPriceRange } from "@/lib/format";
import { getImageUrl } from "@/lib/image-urls";
import type { Configuration, Tower } from "@/types/database";

interface UnitShowcaseProps {
  configurations: Configuration[];
  towers?: Tower[];
}

function getConfigLabel(config: Configuration): string {
  const name = config.config_name || (config.bedrooms ? `${config.bedrooms} BHK` : "Unit");
  if (config.tower?.name) return `${name} — ${config.tower.name}`;
  return name;
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const pillsRef = useRef<HTMLDivElement>(null);

  const config = configurations[activeIndex];
  const tower = config?.tower || (config?.tower_id ? towers?.find((t) => t.id === config.tower_id) : undefined);
  const showNav = configurations.length > 1;

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > activeIndex ? 1 : -1);
      setActiveIndex(index);
    },
    [activeIndex]
  );

  const goNext = useCallback(() => {
    if (activeIndex < configurations.length - 1) goTo(activeIndex + 1);
  }, [activeIndex, configurations.length, goTo]);

  const goPrev = useCallback(() => {
    if (activeIndex > 0) goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  // Keyboard navigation (guarded against input focus)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  // Auto-scroll active pill into view
  useEffect(() => {
    if (!pillsRef.current) return;
    const activePill = pillsRef.current.children[activeIndex] as HTMLElement;
    if (activePill) {
      activePill.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeIndex]);

  if (!configurations.length) return null;

  const floorPlanSrc = config.floor_plan_cloudinary_id
    ? getImageUrl(config.floor_plan_cloudinary_id, "card")
    : null;
  const floorPlanHero = config.floor_plan_cloudinary_id
    ? getImageUrl(config.floor_plan_cloudinary_id, "hero")
    : null;

  // Collect specs that have data
  const specs: { label: string; value: string }[] = [];
  if (config.carpet_area_sqft) specs.push({ label: "Carpet", value: formatArea(config.carpet_area_sqft) });
  if (config.super_area_sqft) specs.push({ label: "Super Area", value: formatArea(config.super_area_sqft) });
  if (config.built_up_area_sqft) specs.push({ label: "Built-up", value: formatArea(config.built_up_area_sqft) });
  if (config.balcony_area_sqft) specs.push({ label: "Balcony", value: formatArea(config.balcony_area_sqft) });
  if (config.price) specs.push({ label: "Price", value: `₹${formatPriceRange(config.price, null, false)}` });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display">
          <Layers className="w-5 h-5 text-primary" />
          Unit Plans & Configurations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Pill Navigation */}
        {showNav && (
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-2 w-4 bg-gradient-to-r from-card to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-2 w-4 bg-gradient-to-l from-card to-transparent z-10 pointer-events-none" />
            <div ref={pillsRef} className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-1" role="tablist" aria-label="Unit configurations">
              {configurations.map((c, i) => (
                <button
                  key={c.id}
                  role="tab"
                  aria-selected={i === activeIndex}
                  aria-controls={`unit-panel-${c.id}`}
                  onClick={() => goTo(i)}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    i === activeIndex
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {getConfigLabel(c)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Carousel */}
        <div className="relative overflow-hidden rounded-xl">
          {/* Arrow buttons (fade instead of mount/unmount) */}
          {showNav && (
            <Button
              variant="ghost"
              size="sm"
              aria-label="Previous configuration"
              className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-card/80 hover:bg-card shadow-md rounded-full h-9 w-9 p-0 transition-opacity duration-200 ${
                activeIndex === 0 ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
              onClick={goPrev}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}
          {showNav && (
            <Button
              variant="ghost"
              size="sm"
              aria-label="Next configuration"
              className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-card/80 hover:bg-card shadow-md rounded-full h-9 w-9 p-0 transition-opacity duration-200 ${
                activeIndex === configurations.length - 1 ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
              onClick={goNext}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          )}

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={config.id}
              id={`unit-panel-${config.id}`}
              role="tabpanel"
              aria-label={getConfigLabel(config)}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              drag={showNav ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={(_, info) => {
                if (info.offset.x < -50) goNext();
                else if (info.offset.x > 50) goPrev();
              }}
            >
              {/* Header bar */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
                <h4 className="text-base font-semibold">
                  {config.config_name || (config.bedrooms ? `${config.bedrooms} BHK` : "Unit")}
                </h4>
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
                {tower && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    <Building2 className="w-3.5 h-3.5" />
                    {tower.name}
                    {tower.floor_from != null && tower.floor_to != null && (
                      <span className="text-primary/70 ml-1">· {tower.floor_to - tower.floor_from + 1} floors</span>
                    )}
                  </span>
                )}
              </div>

              {/* Floor Plan Image */}
              {floorPlanSrc ? (
                <button
                  onClick={() => setLightboxOpen(true)}
                  className="relative w-full group cursor-zoom-in"
                  aria-label={`View full-size floor plan for ${getConfigLabel(config)}`}
                >
                  <img
                    src={floorPlanSrc}
                    alt={`Floor plan — ${getConfigLabel(config)}`}
                    className="w-full rounded-lg object-contain bg-muted border border-border"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-lg">
                    <span className="flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-full text-sm font-medium shadow">
                      <Maximize className="w-4 h-4" /> View Full Size
                    </span>
                  </div>
                </button>
              ) : (
                <div className="w-full aspect-[4/3] rounded-lg bg-muted border border-dashed border-border flex items-center justify-center">
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

        {/* Slide counter */}
        {showNav && (
          <p className="text-center text-xs text-muted-foreground">
            {activeIndex + 1} / {configurations.length}
          </p>
        )}
      </CardContent>

      {/* Lightbox */}
      {floorPlanHero && (
        <FloorPlanLightbox
          src={floorPlanHero}
          alt={`Floor plan — ${getConfigLabel(config)}`}
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </Card>
  );
}
