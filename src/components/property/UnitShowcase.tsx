"use client";

import { useState, useMemo } from "react";
import { BedDouble, Bath, Building2, Layers, Maximize } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FloorPlanLightbox } from "./FloorPlanLightbox";
import { formatArea, formatPriceRange } from "@/lib/format";
import { getImageUrl } from "@/lib/image-urls";
import type { Configuration, ConfigTower } from "@/types/database";

interface UnitShowcaseProps {
  configurations: Configuration[];
}

interface BHKGroup {
  bedrooms: number | null;
  label: string;
  configs: Configuration[];
}

export function UnitShowcase({ configurations }: UnitShowcaseProps) {
  // Group configs by bedrooms → top-level BHK pills
  const bhkGroups = useMemo(() => {
    const map = new Map<number | null, Configuration[]>();
    for (const c of configurations) {
      const key = c.bedrooms;
      const existing = map.get(key);
      if (existing) existing.push(c);
      else map.set(key, [c]);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => (a ?? 0) - (b ?? 0))
      .map(([bedrooms, configs]): BHKGroup => ({
        bedrooms,
        label: bedrooms ? `${bedrooms} BHK` : "Unit",
        configs,
      }));
  }, [configurations]);

  const [activeBHK, setActiveBHK] = useState(0);
  const [activeConfig, setActiveConfig] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const group = bhkGroups[activeBHK];
  const config = group?.configs[activeConfig];
  const showBHKNav = bhkGroups.length > 1;
  const showCarpetNav = group?.configs.length > 1;

  // Reset config index when switching BHK group
  const handleBHKChange = (index: number) => {
    setActiveBHK(index);
    setActiveConfig(0);
  };

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

  const configTowers: ConfigTower[] = config.towers || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display">
          <Layers className="w-5 h-5 text-primary" />
          Unit Plans & Configurations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* BHK Pills */}
        {showBHKNav && (
          <div className="flex gap-2 flex-wrap" role="tablist" aria-label="BHK types">
            {bhkGroups.map((g, i) => (
              <button
                key={g.label}
                role="tab"
                aria-selected={i === activeBHK}
                onClick={() => handleBHKChange(i)}
                className={`shrink-0 rounded-sm px-4 py-1.5 text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  i === activeBHK
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        )}

        {/* Carpet Area Sub-Pills (when >1 config in BHK group) */}
        {showCarpetNav && (
          <div className="flex gap-2 flex-wrap" role="tablist" aria-label="Carpet areas">
            {group.configs.map((c, i) => {
              const label = c.carpet_area_sqft
                ? formatArea(c.carpet_area_sqft)
                : c.config_name || `Option ${i + 1}`;
              return (
                <button
                  key={c.id}
                  role="tab"
                  aria-selected={i === activeConfig}
                  onClick={() => setActiveConfig(i)}
                  className={`shrink-0 rounded-sm px-3 py-1 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-ring ${
                    i === activeConfig
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 border border-transparent"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {/* Tower Badges */}
        {configTowers.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {configTowers.map((ct, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-sm bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                <Building2 className="w-3.5 h-3.5" />
                {ct.name}
                {ct.floor_from != null && ct.floor_to != null && (
                  <span className="text-primary/70 ml-0.5">· Fl {ct.floor_from}–{ct.floor_to}</span>
                )}
              </span>
            ))}
          </div>
        )}

        {/* Header bar */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <h4 className="text-base font-semibold">
            {config.config_name || group.label}
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
          </div>
        </div>

        {/* Floor Plan Image */}
        {floorPlanSrc ? (
          <button
            onClick={() => setLightboxOpen(true)}
            className="relative w-full group cursor-zoom-in"
            aria-label={`View full-size floor plan for ${config.config_name || group.label}`}
          >
            <img
              src={floorPlanSrc}
              alt={`Floor plan — ${config.config_name || group.label}`}
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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {specs.map((s) => (
              <div key={s.label}>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-sm font-semibold">{s.value}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Lightbox */}
      {floorPlanHero && (
        <FloorPlanLightbox
          src={floorPlanHero}
          alt={`Floor plan — ${config.config_name || group.label}`}
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </Card>
  );
}
