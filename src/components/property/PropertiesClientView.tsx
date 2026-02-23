"use client";

import { useState, useMemo, useCallback } from "react";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import { SortDropdown } from "@/components/property/SortDropdown";
import { MobileFilterBar } from "@/components/property/MobileFilterBar";
import { FilterPanel, type FilterValues } from "@/components/property/FilterPanel";
import type { Project } from "@/types/database";

interface PropertiesClientViewProps {
  projects: Project[];
  cities: string[];
}

const EMPTY_FILTERS: FilterValues = {
  localities: [],
  bedrooms: [],
  priceMin: 0,
  priceMax: Infinity,
};

function sortProjects(projects: Project[], sort: string): Project[] {
  const sorted = [...projects];
  switch (sort) {
    case "price_asc":
      return sorted.sort(
        (a, b) => (a.price_min ?? Infinity) - (b.price_min ?? Infinity)
      );
    case "price_desc":
      return sorted.sort(
        (a, b) => (b.price_max ?? 0) - (a.price_max ?? 0)
      );
    case "possession":
      return sorted.sort((a, b) => {
        const da = a.possession_date ? new Date(a.possession_date).getTime() : Infinity;
        const db = b.possession_date ? new Date(b.possession_date).getTime() : Infinity;
        return da - db;
      });
    default:
      // newest — by published_at desc
      return sorted.sort((a, b) => {
        const da = a.published_at ? new Date(a.published_at).getTime() : 0;
        const db = b.published_at ? new Date(b.published_at).getTime() : 0;
        return db - da;
      });
  }
}

export function PropertiesClientView({
  projects,
  cities,
}: PropertiesClientViewProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>(EMPTY_FILTERS);
  const [sort, setSort] = useState("");

  const activeFilterCount =
    filters.localities.length +
    filters.bedrooms.length +
    (filters.priceMin !== EMPTY_FILTERS.priceMin ||
    filters.priceMax !== EMPTY_FILTERS.priceMax
      ? 1
      : 0);

  const filteredProjects = useMemo(() => {
    let result = projects;

    if (filters.localities.length > 0) {
      result = result.filter(
        (p) => p.locality && filters.localities.includes(p.locality)
      );
    }

    if (filters.bedrooms.length > 0) {
      result = result.filter((p) =>
        p.configurations?.some(
          (c) => c.bedrooms != null && filters.bedrooms.includes(c.bedrooms)
        )
      );
    }

    if (
      filters.priceMin !== EMPTY_FILTERS.priceMin ||
      filters.priceMax !== EMPTY_FILTERS.priceMax
    ) {
      result = result.filter((p) => {
        // Include if price ranges overlap
        if (p.price_min != null && p.price_min > filters.priceMax) return false;
        if (p.price_max != null && p.price_max < filters.priceMin) return false;
        return true;
      });
    }

    return sortProjects(result, sort);
  }, [projects, filters, sort]);

  const handleApply = useCallback((f: FilterValues) => {
    setFilters(f);
    setFilterOpen(false);
  }, []);

  return (
    <>
      {/* Desktop filters — hidden on mobile */}
      <div className="hidden md:block">
        <PropertyFilters cities={cities} />
      </div>

      {/* Results count + desktop sort */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {filteredProjects.length} properties found
        </p>
        <div className="hidden md:block">
          <SortDropdown />
        </div>
      </div>

      {/* Add bottom padding on mobile for sticky bar */}
      <div className="pb-14 md:pb-0">
        <PropertyGrid projects={filteredProjects} />
      </div>

      {/* Mobile only */}
      <MobileFilterBar
        onFiltersOpen={() => setFilterOpen(true)}
        activeFilterCount={activeFilterCount}
        currentSort={sort}
        onSortChange={setSort}
      />
      <FilterPanel
        projects={projects}
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={handleApply}
        initialFilters={filters}
      />
    </>
  );
}
