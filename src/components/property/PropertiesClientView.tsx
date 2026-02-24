"use client";

import { useState, useMemo, useCallback } from "react";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { SortDropdown } from "@/components/property/SortDropdown";
import { MobileFilterBar } from "@/components/property/MobileFilterBar";
import {
  FilterPanel,
  FilterSections,
  useFilterOptions,
  type FilterValues,
} from "@/components/property/FilterPanel";
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
      return sorted.sort((a, b) => {
        const da = a.published_at ? new Date(a.published_at).getTime() : 0;
        const db = b.published_at ? new Date(b.published_at).getTime() : 0;
        return db - da;
      });
  }
}

export function PropertiesClientView({
  projects,
}: PropertiesClientViewProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>(EMPTY_FILTERS);
  const [sort, setSort] = useState("");

  const { localityOptions, bedroomOptions, priceExtent } = useFilterOptions(projects);

  // Initialize price range from data on first render
  const effectiveFilters = useMemo<FilterValues>(() => {
    return {
      ...filters,
      priceMin: filters.priceMin === EMPTY_FILTERS.priceMin ? priceExtent[0] : filters.priceMin,
      priceMax: filters.priceMax === EMPTY_FILTERS.priceMax ? priceExtent[1] : filters.priceMax,
    };
  }, [filters, priceExtent]);

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
      // Filter values are in lakhs, DB values are in rupees
      const minRupees = filters.priceMin * 100000;
      const maxRupees = filters.priceMax * 100000;
      result = result.filter((p) => {
        if (p.price_min != null && p.price_min > maxRupees) return false;
        if (p.price_max != null && p.price_max < minRupees) return false;
        return true;
      });
    }

    return sortProjects(result, sort);
  }, [projects, filters, sort]);

  const handleApply = useCallback((f: FilterValues) => {
    setFilters(f);
    setFilterOpen(false);
  }, []);

  // Desktop: immediate filter updates
  const toggleLocality = useCallback((name: string) => {
    setFilters((prev) => ({
      ...prev,
      localities: prev.localities.includes(name)
        ? prev.localities.filter((l) => l !== name)
        : [...prev.localities, name],
    }));
  }, []);

  const toggleBedroom = useCallback((n: number) => {
    setFilters((prev) => ({
      ...prev,
      bedrooms: prev.bedrooms.includes(n)
        ? prev.bedrooms.filter((b) => b !== n)
        : [...prev.bedrooms, n],
    }));
  }, []);

  const handlePriceChange = useCallback((range: [number, number]) => {
    setFilters((prev) => ({
      ...prev,
      priceMin: range[0],
      priceMax: range[1],
    }));
  }, []);

  const clearAll = useCallback(() => {
    setFilters(EMPTY_FILTERS);
  }, []);

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <>
      {/* Desktop: 2-column layout — grid left, filters right */}
      <div className="flex gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0">
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
        </div>

        {/* Desktop filter sidebar */}
        <aside className="hidden md:block w-72 shrink-0">
          <div className="sticky top-24">
            {hasActiveFilters && (
              <div className="flex justify-end mb-3">
                <button
                  onClick={clearAll}
                  className="text-sm font-medium text-primary"
                >
                  Clear All
                </button>
              </div>
            )}
            <FilterSections
              localityOptions={localityOptions}
              bedroomOptions={bedroomOptions}
              priceExtent={priceExtent}
              selectedLocalities={effectiveFilters.localities}
              selectedBedrooms={effectiveFilters.bedrooms}
              priceRange={[effectiveFilters.priceMin, effectiveFilters.priceMax]}
              onToggleLocality={toggleLocality}
              onToggleBedroom={toggleBedroom}
              onPriceChange={handlePriceChange}
            />
          </div>
        </aside>
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
