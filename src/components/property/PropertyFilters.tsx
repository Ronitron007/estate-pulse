"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PropertyFiltersProps {
  cities: string[];
}

export function PropertyFilters({ cities }: PropertyFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCity = searchParams.get("city") || "";
  const currentType = searchParams.get("type") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentSearch = searchParams.get("q") || "";

  const updateFilters = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/properties?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearFilters = () => {
    router.push("/properties");
  };

  const hasFilters = currentCity || currentType || currentStatus || currentSearch;

  return (
    <div className="border-b border-border pb-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search projects..."
            className="pl-10"
            value={currentSearch}
            onChange={(e) => updateFilters("q", e.target.value)}
          />
        </div>

        {/* City filter */}
        <select
          className="h-9 px-3 rounded-sm border border-input bg-background text-sm"
          value={currentCity}
          onChange={(e) => updateFilters("city", e.target.value)}
        >
          <option value="">All Cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        {/* Property type filter */}
        <select
          className="h-9 px-3 rounded-sm border border-input bg-background text-sm"
          value={currentType}
          onChange={(e) => updateFilters("type", e.target.value)}
        >
          <option value="">All Types</option>
          <option value="apartment">Apartment</option>
          <option value="villa">Villa</option>
          <option value="plot">Plot</option>
          <option value="commercial">Commercial</option>
          <option value="penthouse">Penthouse</option>
        </select>

        {/* Status filter */}
        <select
          className="h-9 px-3 rounded-sm border border-input bg-background text-sm"
          value={currentStatus}
          onChange={(e) => updateFilters("status", e.target.value)}
        >
          <option value="">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>

        {/* Clear filters */}
        {hasFilters && (
          <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
            <X className="w-4 h-4" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
